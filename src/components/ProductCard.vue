<template>
  <div class="product-card" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'" @click="$emit('click', product)">
    <div class="product-image-wrapper">
      <img :src="getImageUrl(product.image)" :alt="productName" class="product-image" loading="lazy" />
      
      <!-- Badges -->
      <div class="product-badges">
        <span class="badge-new" v-if="product.is_featured || product.is_new">{{ t('product.new') }}</span>
        <span class="badge-sale" v-if="parseFloat(product.discount) > 0">{{ t('product.sale') }}</span>
      </div>

      <div class="wishlist-wrapper">
        <button 
          class="wishlist-btn" 
          @click.stop="cartState.toggleWishlist(product)"
          :class="{ active: cartState.isInWishlist(product.id) }"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" :fill="cartState.isInWishlist(product.id) ? '#ef4444' : 'none'" :stroke="cartState.isInWishlist(product.id) ? '#ef4444' : 'currentColor'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
      </div>

      <!-- Stock Warning -->
      <div class="product-overlay" v-if="product.stock > 0 && product.stock <= 10">
        <span class="stock-warning">{{ t('product.only_left', { count: product.stock }) }}</span>
      </div>
      <div class="product-overlay out-of-stock" v-else-if="product.stock === 0">
        <span class="stock-warning">{{ t('product.out_of_stock') }}</span>
      </div>
    </div>
    
    <div class="product-info">
      <!-- Color Dots -->
      <div class="product-colors" v-if="product.color_options?.length">
        <span 
          v-for="color in product.color_options" 
          :key="color" 
          class="color-dot" 
          :style="{ backgroundColor: getActualColor(color) }"
          :class="{ 'white-border': getActualColor(color) === '#ffffff' || getActualColor(color).toLowerCase() === 'white' }"
        ></span>
      </div>
      <div class="product-colors dummy-colors" v-else></div> <!-- Placeholder to retain spacing if no colors -->

      <h3 class="product-name">{{ productName }}</h3>
      
      <!-- Sizes -->
      <div class="product-sizes" v-if="product.size_options?.length">
        {{ product.size_options.join(' - ') }}
      </div>
      <div class="product-sizes dummy-sizes" v-else></div>

      <div class="product-price-row">
        <div class="price-right-group">
          <span class="current-price">{{ formatPrice(currentPrice) }} <bdi>{{ currency }}</bdi></span>
          <span class="old-price" v-if="discountPercentage > 0">{{ formatPrice(product.price) }} <bdi>{{ currency }}</bdi></span>
        </div>
        <span class="discount-pill" v-if="discountPercentage > 0" dir="ltr">
          {{ Math.round(discountPercentage) }}%
        </span>
      </div>

      <button class="add-to-cart-btn" @click.stop="$emit('add-to-cart', product)">
        <span>{{ t('product.add_to_cart') }}</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n';
import { cartState } from '../store/cart';
import { useOffers } from '../composables/useOffers';
import { useLocalized } from '../composables/useLocalized';
import { useSettings } from '../composables/useSettings';

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  offer: {
    type: Object,
    required: false
  }
});

const emit = defineEmits(['click', 'add-to-cart']);

const { t } = useI18n();
const { currentLang, localized } = useLocalized();
const { offers, fetchOffers, getActiveOfferForProduct, calculateDiscountFromOffer, calculatePriceWithOffer } = useOffers();
const { currency, fetchSettings } = useSettings();

const productName = computed(() => localized(props.product, 'name'));

onMounted(() => {
  fetchOffers();
  fetchSettings();
});

// Use passed offer if available, otherwise get active offer for this product
const activeOffer = computed(() => {
  if (props.offer) return props.offer;
  return getActiveOfferForProduct(props.product);
});

// Calculate discount from offer if available, otherwise use product discount
const discountPercentage = computed(() => {
  const offer = activeOffer.value;
  if (offer) {
    return calculateDiscountFromOffer(props.product, offer);
  }
  return parseFloat(props.product.discount) || 0;
});

const currentPrice = computed(() => {
  const offer = activeOffer.value;
  if (offer) {
    return calculatePriceWithOffer(props.product, offer);
  }
  const discount = discountPercentage.value;
  const price = parseFloat(props.product.price);
  return price * (1 - (discount / 100));
});

const colorMap = {
  'أحمر': '#ef4444',
  'أزرق': '#3b82f6',
  'أخضر': '#10b981',
  'أسود': '#111827',
  'أبيض': '#ffffff',
  'وردي': '#ec4899',
  'ذهبي': '#f59e0b',
  'فضي': '#9ca3af',
  'رمادي': '#6b7280',
  'برتقالي': '#f97316',
  'أصفر': '#eab308',
  'بني': '#92400e',
  'بنفسجي': '#8b5cf6'
};

const getActualColor = (colorName) => {
  if (!colorName) return 'transparent';
  return colorMap[colorName.trim()] || colorName;
};

const getImageUrl = (path) => {
  if (!path) return '/placeholder-product.png';
  if (path.startsWith('http')) return path;
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  return `${baseUrl.replace('/api', '')}/storage/${path}`;
};

const formatPrice = (price) => {
  return parseFloat(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
</script>

<style scoped>
.product-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #f3f4f6;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.06);
  border-color: #e5e7eb;
}

.product-image-wrapper {
  position: relative;
  height: 280px;
  background: #f9fafb;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-badges {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 2;
}

.badge-new {
  background: #10b981;
  color: #fff;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 800;
}

.badge-sale {
  background: #ef4444;
  color: #fff;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 800;
}

.wishlist-wrapper {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
}

.wishlist-btn {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: all 0.2s;
  color: #64748b;
}

.wishlist-btn.active {
  color: #ef4444;
  background: #fff;
}

.product-info {
  padding: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-card[dir="rtl"] .product-info {
  text-align: right;
}

.product-card[dir="ltr"] .product-info {
  text-align: left;
}

.product-colors {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
  min-height: 14px;
}

.color-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid transparent;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1);
}

.color-dot.white-border {
  border: 1px solid #e5e7eb;
}

.product-name {
  font-size: 16px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 5px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-sizes {
  color: #9ca3af;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 15px;
}

.product-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  margin-top: auto;
}

.price-right-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.current-price {
  font-size: 18px;
  font-weight: 900;
  color: #873260;
}

.old-price {
  font-size: 13px;
  color: #9ca3af;
  text-decoration: line-through;
}

.discount-pill {
  background: #fff1f2;
  color: #ef4444;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 800;
  border: 1px solid #fecdd3;
}

.add-to-cart-btn {
  width: 100%;
  padding: 12px;
  background: #873260;
  color: #fff;
  border: none;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 800;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

/* List View Styles - Matches Figma Image 3 */
.product-card.list-view {
  flex-direction: row;
  height: auto;
  min-height: 180px;
}

.product-card.list-view .product-image-wrapper {
  width: 140px;
  height: 100%;
  flex-shrink: 0;
}

.product-card.list-view .product-info {
  padding: 15px;
  justify-content: center;
}

.product-card.list-view .add-to-cart-btn {
  margin-top: 15px;
  border-radius: 12px;
}

.product-card.list-view {
  padding-bottom: 0;
}

@media (max-width: 768px) {
  .product-image-wrapper {
    height: 180px;
  }
  .product-card.list-view .product-image-wrapper {
    width: 110px;
    height: 140px;
  }
  .product-info {
    padding: 12px;
  }
  .product-name {
    font-size: 13px;
  }
  .current-price {
    font-size: 16px;
  }
  .add-to-cart-btn {
    padding: 10px;
    font-size: 13px;
  }
}
</style>
