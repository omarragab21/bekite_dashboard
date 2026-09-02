<template>
  <div class="offers-page">
    <div class="container">
      <!-- Header, Filters, Results - only show if there are offers -->
      <template v-if="offers.length > 0">
        <!-- Header Section -->
        <div class="offers-header">
          <h1 class="page-title">{{ t('offers.special_offers') }}</h1>
          <p class="page-subtitle">{{ t('offers.special_offers_subtitle') }}</p>
        </div>

        <!-- Offer Filters (Tabs) -->
        <div class="offers-filters-container">
          <div class="offers-filters">
            <button 
              class="filter-pill" 
              :class="{ active: !selectedOfferId }"
              @click="selectOffer(null)"
            >
              <i class="fas fa-tags"></i>
              <span>{{ t('home.all_offers') }}</span>
            </button>
            
            <button 
              v-for="offer in offers" 
              :key="offer.id" 
              class="filter-pill"
              :class="{ active: selectedOfferId === offer.id }"
              @click="selectOffer(offer.id)"
            >
              <i class="fas fa-tag"></i>
              <span>{{ localized(offer, 'name') }}</span>
              <span class="discount-badge" v-if="offer.value">
                {{ offer.type === 'percentage' ? Math.round(offer.value) + '%' : Math.round(offer.value) + ' ' + currency }}
              </span>
            </button>
          </div>
        </div>

        <!-- Results Info -->
        <div class="results-info">
          <p class="count-text">{{ t('offers.showing_products', { count: products.length }) }}</p>
        </div>
      </template>

      <!-- Products Grid -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>{{ t('offers.loading') }}</p>
      </div>

      <div v-else-if="products.length === 0" class="empty-state">
        <i class="fas fa-percent"></i>
        <h3>{{ t('offers.no_active_offers') }}</h3>
        <p>{{ t('offers.no_active_offers_hint') }}</p>
      </div>

      <div v-else class="products-grid">
        <product-card 
          v-for="product in products" 
          :key="product.id" 
          :product="product"
          :offer="currentOffer"
          @click="router.push(`/product/${product.id}`)"
          @add-to-cart="cartState.addToCart(product)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import api from '../../config/axios';
import ProductCard from '../../components/ProductCard.vue';
import { cartState } from '../../store/cart';
import { useLocalized } from '../../composables/useLocalized';
import { useSettings } from '../../composables/useSettings';

const router = useRouter();
const { t } = useI18n();
const { currency, fetchSettings } = useSettings();
const { localized } = useLocalized();

const offers = ref([]);
const products = ref([]);
const loading = ref(true);
const selectedOfferId = ref(null);
const currentPage = ref(1);

const selectOffer = (id) => {
  selectedOfferId.value = id;
  currentPage.value = 1;
  fetchProducts();
};

const currentOffer = computed(() => {
  if (selectedOfferId.value) {
    const offer = offers.value.find(o => o.id === selectedOfferId.value);
    console.log('OffersView - currentOffer from selected:', offer);
    return offer;
  }
  if (offers.value.length > 0) {
    console.log('OffersView - currentOffer from first:', offers.value[0]);
    return offers.value[0];
  }
  console.log('OffersView - currentOffer: null');
  return null;
});

const fetchOffers = async () => {
  try {
    const res = await api.get('/frontend/offers?is_active=1');
    offers.value = res.data.data || res.data;
    console.log('Offers:', offers.value);
  } catch (err) {
    console.error('Failed to fetch offers', err);
  }
};

const fetchProducts = async () => {
  loading.value = true;
  try {
    const params = {
      is_active: 1,
      per_page: 20
    };

    if (!selectedOfferId.value) {
      // Aggregating all products from all active offers
      const allProductIds = [];
      const allCategoryIds = [];
      
      offers.value.forEach(o => {
        if (o.applies_to === 'products' && o.selected_products) {
          allProductIds.push(...o.selected_products);
        } else if (o.applies_to === 'categories' && o.selected_categories) {
          allCategoryIds.push(...o.selected_categories);
        }
      });

      if (allProductIds.length > 0) params.ids = [...new Set(allProductIds)].join(',');
      if (allCategoryIds.length > 0) params.category_ids = [...new Set(allCategoryIds)].join(',');
      
      if (allProductIds.length === 0 && allCategoryIds.length === 0) {
        products.value = [];
        loading.value = false;
        return;
      }
    } else {
      const selectedOffer = offers.value.find(o => o.id === selectedOfferId.value);
      if (!selectedOffer) {
        products.value = [];
        loading.value = false;
        return;
      }

      if (selectedOffer.applies_to === 'products') {
        if (!selectedOffer.selected_products?.length) {
          products.value = [];
          loading.value = false;
          return;
        }
        params.ids = selectedOffer.selected_products.join(',');
      } else if (selectedOffer.applies_to === 'categories') {
        if (!selectedOffer.selected_categories?.length) {
          products.value = [];
          loading.value = false;
          return;
        }
        params.category_ids = selectedOffer.selected_categories.join(',');
      }
    }
    
    // Use the main products endpoint
    const res = await api.get('/frontend/products', { params });
    products.value = res.data.data || res.data;
    if (res.data.data?.data) products.value = res.data.data.data;
  } catch (err) {
    console.error('Failed to fetch discounted products', err);
  } finally {
    loading.value = false;
  }
};

const getImageUrl = (path) => {
  if (!path) return '/placeholder-product.png';
  if (path.startsWith('http')) return path;
  const baseUrl = api.defaults.baseURL;
  return `${baseUrl.replace('/api', '')}/storage/${path}`;
};

onMounted(async () => {
  fetchSettings();
  await fetchOffers();
  await fetchProducts();
});
</script>

<style scoped>
.offers-page {
  padding: 120px 0 100px;
  background: #fdfcfd;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

/* Header Section */
.offers-header {
  text-align: center;
  margin-bottom: 50px;
}

.page-title {
  font-size: 36px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 12px;
}

.page-subtitle {
  font-size: 18px;
  color: #6b7280;
}

/* Filter Pills */
.offers-filters-container {
  margin-bottom: 40px;
  overflow-x: auto;
  padding-bottom: 10px;
  scrollbar-width: none; /* Hide for Firefox */
}

.offers-filters-container::-webkit-scrollbar {
  display: none; /* Hide for Chrome */
}

.offers-filters {
  display: flex;
  gap: 15px;
  justify-content: center;
  min-width: max-content;
  padding: 5px 5px;
}

.filter-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: #fff;
  border: 1px solid #f3f4f6;
  border-radius: 50px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #4b5563;
  font-weight: 600;
}

.filter-pill i {
  font-size: 14px;
}

.filter-pill:hover {
  border-color: #873260;
  color: #873260;
  transform: translateY(-2px);
}

.filter-pill.active {
  background: #873260;
  color: #fff;
  border-color: #873260;
  box-shadow: 0 10px 20px rgba(135, 50, 96, 0.2);
}

.discount-badge {
  background: #fee2e2;
  color: #ef4444;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 20px;
  font-weight: 700;
}

.filter-pill.active .discount-badge {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

/* Results Info */
.results-info {
  margin-bottom: 25px;
}

.count-text {
  color: #9ca3af;
  font-size: 14px;
}

/* Product Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.product-card {
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #f3f4f6;
  transition: all 0.3s;
}

.product-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.05);
}

.product-image-wrapper {
  position: relative;
  height: 320px;
  background: #f9fafb;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-badges {
  position: absolute;
  top: 15px;
  right: 15px;
}

.badge-sale {
  background: #f43f5e;
  color: #fff;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
}

.product-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  background: rgba(244, 63, 94, 0.9);
  color: #fff;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
}

.product-info {
  padding: 24px;
}

.product-colors {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.product-name {
  font-size: 18px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 8px;
}

.product-dimensions {
  color: #9ca3af;
  font-size: 13px;
  margin-bottom: 15px;
}

.product-price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.price-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.current-price {
  font-size: 22px;
  font-weight: 800;
  color: #111827;
}

.old-price {
  font-size: 15px;
  color: #9ca3af;
  text-decoration: line-through;
}

.discount-pill {
  background: #fff1f2;
  color: #f43f5e;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  border: 1px solid #ffe4e6;
}

.add-to-cart-btn {
  width: 100%;
  padding: 14px;
  background: #873260;
  color: #fff;
  border: none;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.add-to-cart-btn:hover {
  background: #4a1936;
  box-shadow: 0 10px 20px rgba(135, 50, 96, 0.3);
}

/* Loading & Empty states */
.loading-state, .empty-state {
  padding: 100px 0;
  text-align: center;
  color: #6b7280;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f4f6;
  border-top-color: #873260;
  border-radius: 50%;
  margin: 0 auto 25px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 1280px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .offers-page {
    padding-top: 40px !important;
  }
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .page-title {
    font-size: 28px;
  }
  .offers-filters {
    justify-content: flex-start;
  }
}
</style>
