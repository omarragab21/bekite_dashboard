<template>
  <div class="product-detail-page" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
    <div class="container">
      <!-- Breadcrumbs -->
      <nav class="breadcrumbs" v-if="product">
        <router-link to="/">{{ t('nav.home') }}</router-link>
        <span class="separator">/</span>
        <router-link to="/products">{{ t('nav.products') }}</router-link>
        <span class="separator">/</span>
          <router-link :to="product.category_parent_id ? `/products?subcategory_id=${product.category_id}` : `/products?category_id=${product.category_id}`" v-if="product.category">
            {{ localizedValue(product.category) }}
          </router-link>
          <span class="separator" v-if="product.category">/</span>
        <span class="current">{{ localized(product, 'name') }}</span>
      </nav>

      <div v-if="loading" class="detail-loader">
        <div class="spinner"></div>
      </div>

      <div v-else-if="product" class="product-main-layout">
        <!-- Part 1: Images Section -->
        <div class="images-section">
          <!-- Thumbnail Column (Left in LTR, Right in RTL) -->
          <div class="thumbnails-column">
            <div 
              v-for="(img, index) in allImages" 
              :key="index" 
              class="thumb-item"
              :class="{ active: currentImageIndex === index }"
              @click="currentImageIndex = index"
            >
              <img :src="img" :alt="localized(product, 'name')" />
            </div>
          </div>

          <!-- Main Image -->
          <div class="main-image-wrapper" @click="openLightbox(currentImageIndex)">
            <img :src="allImages[currentImageIndex]" :alt="localized(product, 'name')" class="main-display-image" />
             <div class="image-actions">
              <button class="img-action-btn" @click.stop="toggleWishlist">
                <svg width="20" height="20" viewBox="0 0 24 24" :fill="cartState.isInWishlist(product.id) ? '#ef4444' : 'none'" :stroke="cartState.isInWishlist(product.id) ? '#ef4444' : 'currentColor'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>
              <button class="img-action-btn" @click.stop="showShareModal = true">
                <i class="fas fa-share-alt"></i>
              </button>
            </div>
            <div class="discount-label" v-if="parseFloat(product.discount) > 0">
              {{ t('offers.discount') }} {{ Math.round((parseFloat(product.discount) / product.price) * 100) }}%
            </div>
          </div>
        </div>

        <!-- Part 2: Info Section -->
        <div class="info-section">
          <div class="product-header">
            <h1 class="product-title">{{ localized(product, 'name') }}</h1>
            <p class="product-subtitle">{{ localizedValue(product.category) || product.english_name || '' }}</p>
            
            <div class="rating-row" v-if="product">
              <div class="stars">
                <i v-for="i in 5" :key="i" :class="i <= Math.round(product.average_rating || 0) ? 'fas fa-star' : 'far fa-star'"></i>
              </div>
            </div>
            
            <div class="discount-label" v-if="discountPercentage > 0">
              {{ t('offers.discount') }} {{ Math.round(discountPercentage) }}%
            </div>
            <div class="price-section">
              <span class="main-price">{{ formatPrice(currentPrice) }} <bdi>{{ currency }}</bdi></span>
              <span class="old-price" v-if="discountPercentage > 0">{{ formatPrice(product.price) }} <bdi>{{ currency }}</bdi></span>
              <span class="save-badge" v-if="discountPercentage > 0">{{ t('product.save') }} {{ Math.round(discountPercentage) }}%</span>
            </div>
          </div>

          <!-- Dynamic Attributes -->
          <div v-for="(values, attrKey) in product.attributes" :key="attrKey" class="attribute-group">
            <div class="attr-header">
              <h3 class="attr-label">
                {{ formatAttrKey(attrKey) }}: 
                <span class="selected-val">{{ selectedAttributes[attrKey] || t('product.choose') }}</span>
              </h3>
            </div>
            
            <!-- Color Palette -->
            <div v-if="isColorAttr(attrKey)" class="color-options">
              <div 
                v-for="val in resolveAttributeValues(attrKey, values)" 
                :key="val.label" 
                class="color-circle" 
                :class="{ 
                  active: selectedAttributes[attrKey] === val.label,
                  'white-color': getActualColor(val.color) === '#ffffff' || getActualColor(val.color).toLowerCase() === 'white' || val.color === 'أبيض'
                }"
                :style="{ backgroundColor: getActualColor(val.color) || '#e5e7eb' }"
                @click="selectedAttributes[attrKey] = val.label"
                :title="val.label"
              ></div>
            </div>
            
            <!-- Standard Pills for others -->
            <div v-else class="size-options">
              <button 
                v-for="val in values" 
                :key="val" 
                class="size-box"
                :class="{ active: selectedAttributes[attrKey] === val }"
                @click="selectedAttributes[attrKey] = val"
              >
                {{ val }}
              </button>
            </div>
          </div>

          <!-- Quantity -->
          <div class="attribute-group">
            <h3 class="attr-label">{{ t('product.quantity') }}</h3>
            <div class="quantity-selector">
              <button class="q-btn" @click="quantity > 1 ? quantity-- : null">-</button>
              <span class="q-val">{{ quantity }}</span>
              <button class="q-btn" @click="quantity++">+</button>
            </div>
          </div>

          <!-- Add to Cart -->
          <button class="main-add-btn" @click="handleAddToCart">
            <span>{{ t('product.add_to_cart') }}</span>
            <i class="fas fa-shopping-cart"></i>
          </button>

          <!-- Service Badges -->
          <div class="service-badges">
            <div class="service-item">
              <div class="service-icon"><i class="fas fa-shipping-fast"></i></div>
              <span class="service-text">{{ t('product.fast_delivery') }}</span>
            </div>
            <div class="service-item">
              <div class="service-icon"><i class="fas fa-headset"></i></div>
              <span class="service-text">{{ t('product.support') }}</span>
            </div>
            <div class="service-item">
              <div class="service-icon"><i class="fas fa-shield-alt"></i></div>
              <span class="service-text">{{ t('product.secure_payment') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Part 3: Tabs Section -->
      <div v-if="product" class="tabs-section">
        <div class="tabs-header">
          <button 
            v-for="tab in tabOptions" 
            :key="tab.id" 
            class="tab-btn" 
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
            <span class="tab-count" v-if="tab.count">({{ tab.count }})</span>
          </button>
        </div>
        
        <div class="tab-content">
          <div v-if="activeTab === 'info'" class="info-tab">
            <p v-if="localized(product, 'description')" class="tab-description">{{ localized(product, 'description') }}</p>
          </div>
          <div v-if="activeTab === 'features'" class="features-tab">
            <ul v-if="localized(product, 'features')" class="features-list">
              <li v-for="(f, i) in localized(product, 'features').split('\n')" :key="i">{{ f }}</li>
            </ul>
          </div>
          <div v-if="activeTab === 'tips'" class="tips-tab">
            <ul v-if="localized(product, 'tips')" class="tips-list">
              <li v-for="(tip, i) in localized(product, 'tips').split('\n')" :key="i">{{ tip }}</li>
            </ul>
          </div>
          <div v-if="activeTab === 'shipping'" class="shipping-tab">
            <p v-if="localized(product, 'shipping_info')" style="white-space: pre-wrap;">{{ localized(product, 'shipping_info') }}</p>
          </div>
          <div v-if="activeTab === 'reviews'" class="reviews-tab">
            <!-- Review Summary -->
            <div class="reviews-summary" v-if="reviews.length > 0">
              <div class="summary-score">
                <div class="score-num">{{ Number(product.average_rating || 0).toFixed(1) }}</div>
                <div class="score-stars">
                  <i v-for="i in 5" :key="i" :class="i <= Math.round(product.average_rating || 0) ? 'fas fa-star' : 'far fa-star'"></i>
                </div>
                <div class="score-count">{{ t('product.based_on_reviews', { count: reviews.length }) }}</div>
              </div>
            </div>

            <!-- Review List -->
            <div class="reviews-list" v-if="reviews.length > 0">
              <div v-for="review in reviews" :key="review.id" class="review-item">
                <div class="review-header">
                  <div class="reviewer-info">
                    <div class="reviewer-avatar">{{ review.customer?.name?.charAt(0) || t('auth.customer').charAt(0) }}</div>
                    <div class="reviewer-name-date">
                      <div class="reviewer-name">{{ review.customer?.name || t('auth.customer') }}</div>
                      <div class="review-date">{{ formatDate(review.created_at) }}</div>
                    </div>
                  </div>
                  <div class="review-rating">
                    <i v-for="i in 5" :key="i" :class="i <= review.rating ? 'fas fa-star' : 'far fa-star'"></i>
                  </div>
                </div>
                <div class="review-comment" v-if="review.comment">{{ review.comment }}</div>
              </div>
            </div>
            
            <div v-else class="review-placeholder">
              <i class="far fa-comments"></i>
              <p>{{ t('product.no_reviews') }}</p>
            </div>

            <!-- Add Review Form -->
            <div class="add-review-section">
              <h3 class="section-subtitle">{{ t('product.add_review') }}</h3>
              
              <div v-if="!user" class="login-prompt">
                {{ t('product.login_to_review_prefix') }} <router-link to="/login">{{ t('auth.login') }}</router-link> {{ t('product.login_to_review_suffix') }}
              </div>
              
              <form v-else @submit.prevent="submitReview" class="review-form">
                <div class="rating-input-group">
                  <label>{{ t('product.your_rating') }}:</label>
                  <div class="star-rating-input">
                    <i 
                      v-for="i in 5" 
                      :key="i" 
                      :class="i <= reviewForm.rating ? 'fas fa-star active' : 'far fa-star'"
                      @click="reviewForm.rating = i"
                    ></i>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>{{ t('product.your_opinion') }}:</label>
                  <textarea v-model="reviewForm.comment" :placeholder="t('product.review_placeholder')" rows="4"></textarea>
                </div>
                
                <button type="submit" class="submit-review-btn" :disabled="isSubmittingReview">
                  {{ isSubmittingReview ? t('profile.sending') : t('profile.submit_rating') }}
                </button>
                
                <div v-if="reviewMessage" :class="['review-msg', reviewStatus]">
                  {{ reviewMessage }}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Part 4: Related Products -->
      <section class="related-section" v-if="relatedProducts.length > 0">
        <div class="section-title">{{ t('product.related_products') }}</div>
        <div class="products-grid">
          <product-card 
            v-for="p in relatedProducts" 
            :key="p.id" 
            :product="p" 
            @click="goToProduct(p)"
            @add-to-cart="cartState.addToCart(p)"
          />
        </div>
      </section>
    </div>

    <!-- Image Lightbox Gallery -->
    <transition name="fade">
      <div v-if="showLightbox" class="lightbox-overlay" @click.self="closeLightbox">
        <button class="lightbox-close" @click="closeLightbox">✕</button>
        
        <div class="lightbox-content">
          <button class="lightbox-nav prev" @click="prevLightbox" v-if="allImages.length > 1">
            <i class="fas fa-chevron-right"></i>
          </button>
          
          <div class="lightbox-image-container">
            <img :src="allImages[lightboxIndex]" :alt="product.name" class="lightbox-main-img" />
          </div>

          <button class="lightbox-nav next" @click="nextLightbox" v-if="allImages.length > 1">
            <i class="fas fa-chevron-left"></i>
          </button>
        </div>

        <div class="lightbox-thumbnails" v-if="allImages.length > 1">
          <div 
            v-for="(img, idx) in allImages" 
            :key="idx" 
            class="lightbox-thumb"
            :class="{ active: lightboxIndex === idx }"
            @click="lightboxIndex = idx"
          >
            <img :src="img" />
          </div>
        </div>
      </div>
    </transition>

    <!-- Share Modal -->
    <Teleport to="body">
    <transition name="fade">
      <div v-if="showShareModal" class="share-modal-overlay" :dir="locale === 'ar' ? 'rtl' : 'ltr'" @click.self="showShareModal = false">
        <div class="share-modal-content">
          <div class="share-header">
            <h3 class="share-title">{{ t('product.share_product') }}</h3>
            <button class="share-close" @click="showShareModal = false"><i class="fas fa-times"></i></button>
          </div>

          <div class="share-product-preview" v-if="product">
            <div class="preview-image">
              <img :src="allImages[0]" :alt="localized(product, 'name')" />
            </div>
            <div class="preview-info">
              <h4 class="preview-name">{{ localized(product, 'name') }}</h4>
              <p class="preview-price">{{ formatPrice(currentPrice) }} {{ currency }}</p>
            </div>
          </div>

          <div class="share-section-label">{{ t('product.share_via') }}</div>
          <div class="share-options-grid">
            <button class="share-grid-btn" @click="shareTo('whatsapp')">
              <div class="grid-icon-box wa"><i class="fab fa-whatsapp"></i></div>
              <span class="grid-text">{{ t('product.whatsapp') }}</span>
            </button>
            <button class="share-grid-btn" @click="shareTo('facebook')">
              <div class="grid-icon-box fb"><i class="fab fa-facebook-f"></i></div>
              <span class="grid-text">{{ t('product.facebook') }}</span>
            </button>
            <button class="share-grid-btn" @click="shareTo('instagram')">
              <div class="grid-icon-box ig"><i class="fab fa-instagram"></i></div>
              <span class="grid-text">{{ t('product.instagram') }}</span>
            </button>
            <button class="share-grid-btn" @click="shareTo('email')">
              <div class="grid-icon-box ml"><i class="far fa-envelope"></i></div>
              <span class="grid-text">{{ t('product.email') }}</span>
            </button>
          </div>

          <div class="share-section-label">{{ t('product.or_copy_link') }}</div>
          <div class="link-copy-wrapper">
            <div class="link-input-area">
              <input type="text" readonly :value="currentFullUrl" class="link-input-field" />
              <i class="fas fa-link link-icon"></i>
            </div>
            <button class="copy-action-btn" @click="copyLink">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-if="!linkCopied">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <i class="fas fa-check" v-else></i>
              <span>{{ linkCopied ? t('product.link_copied') : t('product.copy') }}</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import api from '../../config/axios';
import ProductCard from '../../components/ProductCard.vue';
import { cartState } from '../../store/cart';
import { useOffers } from '../../composables/useOffers';
import { useLocalized } from '../../composables/useLocalized';
import { useSettings } from '../../composables/useSettings';

const { getActiveOfferForProduct, calculateDiscountFromOffer, calculatePriceWithOffer, fetchOffers } = useOffers();
const { t, locale } = useI18n();
const { localized, localizedValue } = useLocalized();
const { currency, fetchSettings } = useSettings();

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

const route = useRoute();
const router = useRouter();

const product = ref(null);
const relatedProducts = ref([]);
const loading = ref(true);
const currentImageIndex = ref(0);
const quantity = ref(1);
const selectedAttributes = ref({});
const activeTab = ref('info');
const attributesList = ref([]);

// Lightbox
const showLightbox = ref(false);
const lightboxIndex = ref(0);

// Share Modal
const showShareModal = ref(false);
const linkCopied = ref(false);

const currentFullUrl = computed(() => {
  // Use a clean version of the URL, maybe without specific query params if needed
  return window.location.origin + route.fullPath;
});

const shareTo = (platform) => {
  const url = encodeURIComponent(currentFullUrl.value);
  const title = encodeURIComponent(product.value?.name || '');
  
  if (platform === 'whatsapp') {
    window.open(`https://api.whatsapp.com/send?text=${title} - ${url}`, '_blank');
  } else if (platform === 'facebook') {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  } else if (platform === 'email') {
    window.open(`mailto:?subject=${title}&body=${url}`, '_blank');
  } else if (platform === 'instagram') {
    // Instagram doesn't support direct URL sharing, usually redirect to copy link
    copyLink();
  }
};

const copyLink = () => {
  navigator.clipboard.writeText(window.location.href).then(() => {
    linkCopied.value = true;
    setTimeout(() => {
      linkCopied.value = false;
      showShareModal.value = false;
    }, 2000);
  });
};

const openLightbox = (index) => {
  lightboxIndex.value = index;
  showLightbox.value = true;
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  showLightbox.value = false;
  document.body.style.overflow = '';
};

const nextLightbox = () => {
  if (lightboxIndex.value < allImages.value.length - 1) {
    lightboxIndex.value++;
  } else {
    lightboxIndex.value = 0;
  }
};

const prevLightbox = () => {
  if (lightboxIndex.value > 0) {
    lightboxIndex.value--;
  } else {
    lightboxIndex.value = allImages.value.length - 1;
  }
};

const isColorAttr = (key) => {
  const k = key.toLowerCase();
  return k.includes('color') || k.includes('لون');
};

const formatAttrKey = (key) => {
  const translations = {
    'color': t('products.color'),
    'size': t('products.size'),
    'material': t('products.material'),
    'weight': t('products.weight'),
    'dimensions': t('products.dimensions'),
    'brand': t('products.brand'),
    'warranty': t('products.warranty')
  };
  return translations[key.toLowerCase()] || key;
};

const reviews = ref([]);

const tabOptions = computed(() => {
  const tabs = [];

  if (localized(product.value, 'description')) tabs.push({ id: 'info', label: t('product.about_product') });
  if (localized(product.value, 'features')) tabs.push({ id: 'features', label: t('product.key_features') });
  if (localized(product.value, 'tips')) tabs.push({ id: 'tips', label: t('product.tips') });
  if (localized(product.value, 'shipping_info')) tabs.push({ id: 'shipping', label: t('product.shipping_warranty') });

  tabs.push({ id: 'reviews', label: t('product.reviews'), count: reviews.value.length || null });
  return tabs;
});

watch(tabOptions, (tabs) => {
  if (!Array.isArray(tabs) || tabs.length === 0) return;
  // Always prioritize 'info' tab if available
  const infoTab = tabs.find(t => t.id === 'info');
  if (infoTab && activeTab.value !== 'info') {
    activeTab.value = 'info';
    return;
  }
  const exists = tabs.some(t => t.id === activeTab.value);
  if (!exists) activeTab.value = tabs[0].id;
}, { immediate: true });

const allImages = computed(() => {
  if (!product.value) return [];
  const images = [];
  
  if (product.value.images && product.value.images.length > 0) {
    product.value.images.forEach(img => {
      images.push(getImageUrl(img));
    });
  } else if (product.value.image) {
    images.push(getImageUrl(product.value.image));
  }
  
  // Show only real images - no static placeholders
  return images;
});

const getImageUrl = (path) => {
  if (!path) return '/placeholder-product.png';
  if (path.startsWith('http')) return path;
  const baseUrl = api.defaults.baseURL;
  return `${baseUrl.replace('/api', '')}/storage/${path}`;
};

const formatPrice = (val) => {
  const num = parseFloat(val);
  return isNaN(num) ? '0.00' : num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Calculate active offer for this product
const activeOffer = computed(() => {
  if (product.value) {
    return getActiveOfferForProduct(product.value);
  }
  return null;
});

// Calculate discount percentage from offer or product
const discountPercentage = computed(() => {
  if (activeOffer.value) {
    return calculateDiscountFromOffer(product.value, activeOffer.value);
  }
  return parseFloat(product.value?.discount) || 0;
});

// Calculate current price with discount
const currentPrice = computed(() => {
  if (activeOffer.value) {
    return calculatePriceWithOffer(product.value, activeOffer.value);
  }
  const discount = discountPercentage.value;
  const price = parseFloat(product.value?.price) || 0;
  return price * (1 - (discount / 100));
});

const fetchProduct = async (id) => {
  loading.value = true;
  currentImageIndex.value = 0;
  try {
    const res = await api.get(`/frontend/products/${id}`);
    product.value = res.data.data;
    
    // Auto-select first value for each attribute
    if (product.value.attributes) {
      const initial = {};
      Object.keys(product.value.attributes).forEach(key => {
        if (product.value.attributes[key]?.length > 0) {
          initial[key] = product.value.attributes[key][0];
        }
      });
      selectedAttributes.value = initial;
    }

    fetchRelated(product.value.category_id);
  } catch (err) {
    console.error('Failed to fetch product', err);
  } finally {
    loading.value = false;
  }
};

const fetchRelated = async (categoryId) => {
  try {
    const res = await api.get('/frontend/products', {
      params: { category_id: categoryId, per_page: 4 }
    });
    relatedProducts.value = (res.data.data?.data || res.data.data || []).filter(p => p.id !== product.value?.id);
  } catch (err) {
    console.error('Failed to fetch related products', err);
  }
};

const fetchAttributes = async () => {
  try {
    const res = await api.get('/frontend/attributes'); // Assuming this endpoint exists or similar
    attributesList.value = res.data.data || res.data;
  } catch (err) {
    console.error('Failed to fetch global attributes', err);
  }
};

const resolveAttributeValues = (attrKey, values) => {
  if (!Array.isArray(values)) return [];
  // Try to find the attribute info
  const attrInfo = attributesList.value.find(a => a.name === attrKey || a.label === attrKey);
  
  return values.map(valLabel => {
    if (!attrInfo) return { label: valLabel, color: null };
    const valObj = attrInfo.values?.find(v => v.label === valLabel);
    return { 
      label: valLabel, 
      color: valObj ? valObj.color : null 
    };
  });
};

const toggleWishlist = () => {
  cartState.toggleWishlist(product.value);
};

const handleAddToCart = () => {
  cartState.addToCart(product.value, quantity.value);
};

const goToProduct = (p) => {
  router.push(`/product/${p.id}`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

watch(() => route.params.id, (newId) => {
  if (newId) fetchProduct(newId);
});

// Reviews logic
const reviewForm = ref({ rating: 5, comment: '' });
const isSubmittingReview = ref(false);
const reviewMessage = ref('');
const reviewStatus = ref('');
const user = computed(() => {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
});

const fetchReviews = async () => {
  try {
    const res = await api.get(`/frontend/products/${route.params.id}/reviews`);
    reviews.value = res.data.data;
  } catch (err) {
    console.error('Failed to fetch reviews', err);
  }
};

const submitReview = async () => {
  isSubmittingReview.value = true;
  reviewMessage.value = '';
  try {
    const res = await api.post('/frontend/reviews', {
      product_id: route.params.id,
      rating: reviewForm.rating,
      comment: reviewForm.comment
    });
    reviewStatus.value = 'success';
    reviewMessage.value = res.data.message;
    reviewForm.value = { rating: 5, comment: '' };
    // Refetching won't show the new review immediately because it needs approval
  } catch (err) {
    reviewStatus.value = 'error';
    reviewMessage.value = err.response?.data?.message || t('product.review_submit_failed');
  } finally {
    isSubmittingReview.value = false;
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale.value === 'ar' ? 'ar-JO' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

onMounted(() => {
  fetchProduct(route.params.id);
  fetchAttributes();
  fetchReviews();
  fetchOffers();
  fetchSettings();
});
</script>

<style scoped>
.product-detail-page {
  padding: 120px 0 100px;
  background: #fdfcfd;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

/* Breadcrumbs */
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 40px;
  font-size: 14px;
  color: #9ca3af;
}

.breadcrumbs a {
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.3s;
}

.breadcrumbs a:hover {
  color: #873260;
}

.breadcrumbs .current {
  color: #111827;
  font-weight: 600;
}

.separator {
  font-size: 10px;
}

/* Loading State */
.detail-loader {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f4f6;
  border-top-color: #873260;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Main Layout */
.product-main-layout {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 60px;
  margin-bottom: 80px;
}

/* Images Section */
.images-section {
  display: flex;
  gap: 20px;
}

.thumbnails-column {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100px;
}

.thumb-item {
  width: 100px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s;
  background: #f9fafb;
}

.thumb-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-item.active {
  border-color: #873260;
}

.main-image-wrapper {
  flex: 1;
  position: relative;
  height: 660px;
  background: #f9fafb;
  border-radius: 24px;
  overflow: hidden;
}

.main-display-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-actions {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.img-action-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111827;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.3s;
}

.img-action-btn:hover {
  transform: scale(1.1);
  color: #873260;
}

.discount-label {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #f43f5e;
  color: #fff;
  padding: 6px 16px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 14px;
}

/* Info Section */
.info-section {
  display: flex;
  flex-direction: column;
}

.product-title {
  font-size: 38px;
  font-weight: 850;
  color: #111827;
  margin-bottom: 5px;
}

.product-subtitle {
  color: #9ca3af;
  font-size: 16px;
  margin-bottom: 20px;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 25px;
}

.stars {
  color: #fdb913;
}

.rating-text {
  color: #6b7280;
  font-size: 14px;
}

.price-container {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 35px;
}

.main-price {
  font-size: 32px;
  font-weight: 900;
  color: #873260;
}

.old-price {
  font-size: 18px;
  color: #9ca3af;
  text-decoration: line-through;
}

.save-badge {
  background: #fff1f2;
  color: #f43f5e;
  padding: 4px 12px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
}

.attribute-group {
  margin-bottom: 30px;
}

.attr-label {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 15px;
}

.selected-val {
  color: #6b7280;
  font-weight: 500;
  margin-right: 5px;
}

.color-options {
  display: flex;
  gap: 12px;
}

.color-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.color-circle:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.color-circle.active {
  border-color: #873260;
  transform: scale(1.1);
}

.color-circle.white-color {
  border: 1px solid #e5e7eb;
}

.color-circle.white-color.active {
  border-color: #873260;
  border-width: 2px;
}

.attr-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.size-guide {
  background: none;
  border: none;
  color: #873260;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.size-options {
  display: flex;
  gap: 12px;
}

.size-box {
  min-width: 50px;
  width: auto;
  padding: 0 15px;
  height: 50px;
  border: 1px solid #e5e7eb;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  color: #4b5563;
  transition: all 0.3s;
  white-space: nowrap;
}

.size-box.active {
  background: #873260;
  color: #fff;
  border-color: #873260;
}

.quantity-selector {
  display: flex;
  align-items: center;
  background: #f9fafb;
  width: fit-content;
  border-radius: 50px;
  padding: 5px;
}

.q-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #fff;
  color: #111827;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.q-btn:hover { background: #873260; color: #fff; }

.q-val {
  width: 50px;
  text-align: center;
  font-weight: 700;
  font-size: 18px;
}

.main-add-btn {
  width: 100%;
  padding: 20px;
  background: #873260;
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  cursor: pointer;
  transition: all 0.4s;
  margin: 10px 0 30px;
}

.main-add-btn:hover {
  background: #4a1936;
  transform: scale(1.02);
  box-shadow: 0 15px 35px rgba(135, 50, 96, 0.2);
}

.service-badges {
  display: flex;
  justify-content: space-between;
  background: #fcf8fa;
  padding: 20px;
  border-radius: 20px;
}

.service-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.service-icon { color: #873260; font-size: 20px; }
.service-text { font-size: 13px; color: #4b5563; font-weight: 600; }

/* Tabs Section */
.tabs-section {
  margin-bottom: 80px;
}

.tabs-header {
  display: flex;
  border-bottom: 2px solid #f3f4f6;
  margin-bottom: 30px;
  gap: 30px;
  justify-content: flex-start; /* Figma alignment */
}

.tab-btn {
  padding-bottom: 15px;
  border: none;
  background: none;
  font-size: 16px;
  font-weight: 700;
  color: #9ca3af;
  cursor: pointer;
  position: relative;
  transition: all 0.3s;
}

.tab-btn.active {
  color: #873260;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: #873260;
  border-radius: 3px;
}

.tab-content {
  padding: 10px 0;
  line-height: 1.8;
  color: #4b5563;
  font-size: 16px;
}

/* Lists styling */
.features-list, .tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.features-list li, .tips-list li {
  padding: 8px 0;
  padding-right: 24px;
  position: relative;
  line-height: 1.6;
}

.features-list li::before, .tips-list li::before {
  content: "✓";
  position: absolute;
  right: 0;
  color: #873260;
  font-weight: bold;
  font-size: 14px;
}

/* Related Products */
.related-section { margin-top: 100px; }
.related-section .section-title {
  font-size: 28px;
  font-weight: 850;
  color: #111827;
  margin-bottom: 40px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

@media (max-width: 1024px) {
  .product-detail-page { padding-top: 40px !important; }
  .product-main-layout { grid-template-columns: 1fr; }
  .images-section { flex-direction: column-reverse; }
  .thumbnails-column { flex-direction: row; width: 100%; overflow-x: auto; }
  .main-image-wrapper { height: 500px; }
  .products-grid { grid-template-columns: repeat(2, 1fr); }
  .tabs-header { gap: 20px; overflow-x: auto; padding-bottom: 5px; }
  .tab-btn { font-size: 14px; }
}

@media (max-width: 768px) {
  .products-grid { grid-template-columns: 1fr; }
  .thumbnails-column {
    width: 100%;
    gap: 10px;
  }
  .thumb-item {
    width: 70px;
    height: 90px;
    flex-shrink: 0;
  }
  .main-image-wrapper {
    height: 400px;
  }
}

@media (max-width: 480px) {
  .thumbnails-column {
    gap: 8px;
  }
  .thumb-item {
    width: 60px;
    height: 80px;
  }
  .main-image-wrapper {
    height: 350px;
  }
  .product-title {
    font-size: 28px;
  }
  .product-subtitle {
    font-size: 14px;
  }
  .main-price {
    font-size: 24px;
  }
}
/* Lightbox Styles */
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  z-index: 99999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.lightbox-close {
  position: absolute;
  top: 30px;
  right: 30px;
  background: none;
  border: none;
  color: #fff;
  font-size: 30px;
  cursor: pointer;
  z-index: 2;
  transition: transform 0.3s;
}

.lightbox-close:hover {
  transform: rotate(90deg) scale(1.2);
}

.lightbox-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  width: 100%;
  flex: 1;
  max-height: 80vh;
}

.lightbox-image-container {
  max-width: 80%;
  max-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-main-img {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
}

.lightbox-nav {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.lightbox-nav:hover {
  background: #873260;
  border-color: #873260;
  transform: scale(1.1);
}

.lightbox-thumbnails {
  display: flex;
  gap: 15px;
  margin-top: 40px;
  padding: 10px;
  overflow-x: auto;
}

.lightbox-thumb {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  opacity: 0.5;
  transition: all 0.3s;
}

.lightbox-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lightbox-thumb.active {
  border-color: #873260;
  opacity: 1;
  transform: scale(1.1);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .lightbox-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
  }
  .lightbox-nav.prev { right: 10px; }
  .lightbox-nav.next { left: 10px; }
  .lightbox-content { gap: 0; }
  .lightbox-main-img { max-height: 70vh; }
}

/* Reviews Styles */
.reviews-tab {
  padding: 20px 0;
}

.reviews-summary {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  padding: 30px;
  background: #fdfcfd;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
}

.summary-score {
  text-align: center;
}

.score-num {
  font-size: 48px;
  font-weight: 800;
  color: #111827;
  line-height: 1;
  margin-bottom: 8px;
}

.score-stars {
  color: #fbbf24;
  font-size: 20px;
  margin-bottom: 8px;
}

.score-count {
  font-size: 14px;
  color: #64748b;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 60px;
}

.review-item {
  padding-bottom: 24px;
  border-bottom: 1px solid #f1f5f9;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reviewer-avatar {
  width: 44px;
  height: 44px;
  background: #f1f5f9;
  color: #873260;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
}

.reviewer-name {
  font-weight: 600;
  color: #111827;
  font-size: 15px;
}

.review-date {
  font-size: 13px;
  color: #94a3b8;
}

.review-rating {
  color: #fbbf24;
  font-size: 14px;
}

.review-comment {
  font-size: 15px;
  color: #475569;
  line-height: 1.6;
  padding-right: 56px;
}

.review-placeholder {
  text-align: center;
  padding: 60px 0;
  color: #94a3b8;
}

.review-placeholder i {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.3;
}

.add-review-section {
  background: #fff;
  padding: 40px;
  border-radius: 20px;
  border: 1px solid #f1f5f9;
}

.section-subtitle {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 24px;
}

.rating-input-group {
  margin-bottom: 24px;
}

.rating-input-group label {
  display: block;
  margin-bottom: 12px;
  font-weight: 600;
  color: #111827;
}

.star-rating-input {
  display: flex;
  gap: 8px;
  font-size: 28px;
  color: #e2e8f0;
}

.star-rating-input i {
  cursor: pointer;
  transition: all 0.2s;
}

.star-rating-input i.active {
  color: #fbbf24;
}

.star-rating-input i:hover {
  transform: scale(1.2);
}

.review-form .form-group {
  margin-bottom: 24px;
}

.review-form label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #111827;
}

.review-form textarea {
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  font-family: inherit;
  resize: vertical;
  transition: all 0.3s;
}

.review-form textarea:focus {
  outline: none;
  border-color: #873260;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(135, 50, 96, 0.05);
}

.submit-review-btn {
  background: #873260;
  color: #fff;
  border: none;
  padding: 14px 32px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-review-btn:hover:not(:disabled) {
  background: #6d284d;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(135, 50, 96, 0.2);
}

.submit-review-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.review-msg {
  margin-top: 20px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
}

.review-msg.success {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.review-msg.error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.login-prompt {
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  color: #64748b;
}

.login-prompt a {
  color: #873260;
  font-weight: 700;
  text-decoration: none;
}

/* Share Modal Refined */
.share-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  backdrop-filter: blur(8px);
}

.share-modal-content {
  background: #fff;
  border-radius: 28px;
  padding: 24px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.15);
  animation: modalScaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
}

@keyframes modalScaleUp {
  from { transform: scale(0.9); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}

.share-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: 15px;
}

.share-title {
  font-size: 20px;
  font-weight: 800;
  color: #111827;
}

.share-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f9fafb;
  border: none;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.share-close:hover {
  background: #f3f4f6;
  color: #111827;
}

/* Product Preview */
.share-product-preview {
  display: flex;
  align-items: center;
  gap: 20px;
  background: #fff;
  padding: 15px;
  border-radius: 18px;
  border: 1px solid #f3f4f6;
  margin-bottom: 25px;
}

.preview-image {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-info {
  flex: 1;
}

.preview-name {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 5px;
}

.preview-price {
  font-size: 15px;
  font-weight: 800;
  color: #873260;
}

.share-section-label {
  font-size: 13px;
  font-weight: 600;
  color: #9ca3af;
  margin-bottom: 15px;
  text-align: right;
}

[dir="ltr"] .share-section-label {
  text-align: left;
}

/* Social Grid */
.share-options-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 25px;
}

.share-grid-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.share-grid-btn:hover {
  transform: translateY(-3px);
}

.grid-icon-box {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.grid-icon-box.wa { background: #e8f9ef; color: #25D366; }
.grid-icon-box.fb { background: #e8f2ff; color: #1877F2; }
.grid-icon-box.ig { background: #fff1f5; color: #E1306C; }
.grid-icon-box.ml { background: #f3f4f6; color: #873260; }

.grid-text {
  font-size: 12px;
  font-weight: 600;
  color: #4b5563;
}

/* Link Copy Area */
.link-copy-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 16px;
  padding: 6px;
}

.link-input-area {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
}

.link-icon {
  color: #9ca3af;
  font-size: 14px;
}

.link-input-field {
  width: 100%;
  border: none;
  background: none;
  font-size: 13px;
  color: #6b7280;
  padding: 8px 0;
  outline: none;
  text-overflow: ellipsis;
}

.copy-action-btn {
  background: #873260;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.copy-action-btn:hover {
  background: #6d284d;
}

.copy-action-btn i, .copy-action-btn svg {
  font-size: 14px;
}
</style>

<style>
/* Non-scoped: needed because Teleport renders outside component scope */
.share-modal-overlay {
  position: fixed !important;
  inset: 0 !important;
  background: rgba(0,0,0,0.55) !important;
  z-index: 99999 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 20px !important;
  backdrop-filter: blur(4px) !important;
}
</style>
