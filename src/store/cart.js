import { reactive, computed } from 'vue';
import api from '../config/axios';

// Initial data from local storage
const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

export const cartState = reactive({
  items: savedCart,
  wishlist: savedWishlist,
  lastAddedProduct: null,
  showModal: false,

  // Simple methods
  addToCart(product, quantity = 1) {
    const existing = this.items.find(item => item.id === product.id);
    if (existing) {
      Object.assign(existing, { ...product, quantity: existing.quantity });
      existing.quantity += quantity;
    } else {
      this.items.push({ ...product, quantity });
    }
    this.lastAddedProduct = product;
    this.showModal = true;
    this.save();
    
    setTimeout(() => {
      this.showModal = false;
    }, 3500);
  },

  removeFromCart(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.save();
  },

  updateQuantity(productId, quantity) {
    const item = this.items.find(item => item.id === productId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.save();
    }
  },

  async refreshCartItems() {
    if (!this.items.length) return;

    try {
      const latestProducts = await Promise.all(
        this.items.map(async (item) => {
          try {
            const res = await api.get(`/frontend/products/${item.id}`);
            return res.data.data || res.data;
          } catch (_) {
            return null;
          }
        })
      );

      this.items = this.items.map((item, index) => {
        const latestProduct = latestProducts[index];
        return latestProduct ? { ...latestProduct, quantity: item.quantity } : item;
      });
      this.save();
    } catch (err) {
      console.error('Cart refresh failed', err);
    }
  },

  async toggleWishlist(product) {
    const token = localStorage.getItem('c_token');
    if (!token) {
      // User is not logged in, trigger auth modal
      if (window.openAuthModal) {
        window.openAuthModal();
      }
      return;
    }

    const index = this.wishlist.findIndex(item => item.id === product.id);
    if (index > -1) {
      this.wishlist.splice(index, 1);
    } else {
      this.wishlist.push(product);
    }
    this.save();

    // Sync with backend if logged in
    try {
      await api.post('/frontend/wishlist/toggle', { product_id: product.id });
    } catch (err) {
      console.error('Wishlist sync failed', err);
    }
  },

  isInWishlist(productId) {
    return this.wishlist.some(item => item.id === productId);
  },

  save() {
    localStorage.setItem('cart', JSON.stringify(this.items));
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
  },
  
  clear() {
    this.items = [];
    this.wishlist = [];
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
  }
});

// Computed properties (safer as separate exports)
export const cartSubtotal = computed(() => {
  return cartState.items.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    const discount = parseFloat(item.discount) || 0;
    return sum + (price - discount) * item.quantity;
  }, 0);
});

export const cartTotal = computed(() => {
  return cartSubtotal.value + (cartSubtotal.value * 0.16);
});

export const cartCount = computed(() => {
  return cartState.items.reduce((sum, item) => sum + item.quantity, 0);
});

export const wishlistCount = computed(() => {
  return cartState.wishlist.length;
});

// For convenience, add them to cartState as well (reactive proxies)
Object.defineProperty(cartState, 'subtotal', { get: () => cartSubtotal.value });
Object.defineProperty(cartState, 'total', { get: () => cartTotal.value });
Object.defineProperty(cartState, 'count', { get: () => cartCount.value });
Object.defineProperty(cartState, 'wishlistCount', { get: () => wishlistCount.value });
