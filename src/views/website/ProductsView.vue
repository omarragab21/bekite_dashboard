<template>
  <div class="products-page">
    <div class="container">
      <!-- Breadcrumbs -->
      <nav class="breadcrumbs">
        <router-link to="/">{{ $t('nav.home') }}</router-link>
        <span class="separator">/</span>
        <span class="current">{{ $t('products.all_products') }}</span>
      </nav>

      <div class="products-layout container">
        <!-- Sidebar Filters -->
        <aside class="sidebar-filters">
          <div class="filter-section" v-show="!isMobile">
            <h3 class="filter-title" @click="toggleFilter('category')">
              {{ $t('products.category') }}
              <i class="fas fa-chevron-up" :class="{ 'rotated': !filtersOpen.category }"></i>
            </h3>
            <div class="filter-content" v-show="filtersOpen.category">
              <div class="category-list">
                <label class="filter-item all-products" :class="{ active: !selectedCategory }">
                  <input type="radio" v-model="selectedCategory" :value="null" @change="resetFilters" />
                  <span>{{ $t('products.all_products') }}</span>
                </label>
                <div v-for="cat in mainCategories" :key="cat.id" class="category-group">
                  <label class="filter-item item-with-icon" :class="{ active: selectedCategory === cat.id }">
                    <input type="radio" v-model="selectedCategory" :value="cat.id" @change="handleCategoryChange" />
                    <i class="fas fa-chevron-left arrow-icon" v-if="cat.children?.length"></i>
                    <span class="cat-name">{{ localized(cat, 'name') }}</span>
                  </label>
                  <!-- Sub-categories (Indented) -->
                  <div v-if="selectedCategory === cat.id && cat.children?.length" class="sub-category-list">
                    <label v-for="sub in cat.children" :key="sub.id" class="filter-item sub-item" :class="{ active: selectedSubCategory === sub.id }">
                      <input type="radio" v-model="selectedSubCategory" :value="sub.id" @change="fetchProducts" />
                      <span>{{ localized(sub, 'name') }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Price Filter (Always visible or based on products) -->
          <div class="filter-section">
            <h3 class="filter-title" @click="toggleFilter('price')">
              {{ $t('products.price') }}
               <i class="fas fa-chevron-up" :class="{ 'rotated': !filtersOpen.price }"></i>
            </h3>
            <div class="filter-content" v-show="filtersOpen.price">
              <div class="price-range-inputs">
                <input type="number" v-model="priceRange.min" :placeholder="$t('products.from')" @input="debouncedFetch">
                <input type="number" v-model="priceRange.max" :placeholder="$t('products.to')" @input="debouncedFetch">
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="products-main">
          <!-- Top Bar -->
          <div class="products-header">
            <div class="header-top-row">
              <h1 class="page-title">{{ currentTitle }}</h1>
              <p class="results-count">{{ $t('products.showing_results', { shown: products.length, total: totalCount }) }}</p>
            </div>
            
            <div class="controls-row">
              <!-- Filter Button (Right in RTL) -->
              <button class="mobile-filter-btn" @click="showMobileFilters = true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></svg>
                <span>{{ $t('products.filters') }}</span>
              </button>

              <!-- Results Count (Middle) -->


              <!-- Sort Dropdown (Left in RTL) -->
              <div class="sort-container">
                <select v-model="sortBy" class="sort-select" @change="fetchProducts">
                  <option value="created_at_desc">{{ $t('products.sort_latest') }}</option>
                  <option value="price_asc">{{ $t('products.sort_price_low') }}</option>
                  <option value="price_desc">{{ $t('products.sort_price_high') }}</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Products Grid -->
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>{{ $t('common.loading') }}</p>
          </div>

          <div v-else-if="products.length === 0" class="empty-state">
            <i class="fas fa-search"></i>
            <h3>{{ $t('products.no_products') }}</h3>
            <p>{{ $t('products.no_products_hint') }}</p>
          </div>

          <div v-else class="products-grid grid">
            <product-card 
              v-for="product in products" 
              :key="product.id" 
              :product="product" 
              @click="goToProduct(product)"
              @add-to-cart="cartState.addToCart(product)"
            />
          </div>

          <!-- Pagination Placeholder -->
          <div class="pagination" v-if="totalPages > 1">
            <button class="page-btn" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
              <i class="fas fa-chevron-right"></i>
            </button>
            <span v-for="p in totalPages" :key="p" class="page-num" :class="{ active: p === currentPage }" @click="changePage(p)">
              {{ p }}
            </span>
            <button class="page-btn" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
              <i class="fas fa-chevron-left"></i>
            </button>
          </div>
        </main>
      </div>
    </div>

    <!-- Mobile Filters Drawer -->
    <div class="mobile-filters-drawer" :class="{ 'active': showMobileFilters }">
      <div class="drawer-overlay" @click="showMobileFilters = false"></div>
      <div class="drawer-content">
        <div class="drawer-header">
          <button class="close-drawer" @click="showMobileFilters = false">
            <i class="fas fa-times"></i>
          </button>
          <h2 class="drawer-title">{{ $t('products.filters') }}</h2>
        </div>
        
        <div class="drawer-body">
          <!-- Category List with Icons (Image 2 style) -->
          <div class="filter-section">
            <div class="filter-title">{{ $t('products.category') }}</div>
            <div class="category-drawer-list">
              <div class="drawer-cat-item main" :class="{ active: !selectedCategory }" @click="selectedCategory = null; resetFilters()">
                <span>{{ $t('products.all_products') }}</span>
              </div>
              <div v-for="cat in mainCategories" :key="cat.id" class="drawer-cat-group">
                <div class="drawer-cat-item" :class="{ active: selectedCategory === cat.id }"
                     @click="selectedCategory = cat.id; handleCategoryChange()">
                  <div class="cat-left">
                    <span class="cat-icon">{{ getCategoryIcon(localized(cat, 'name')) }}</span>
                    <span class="cat-name">{{ localized(cat, 'name') }}</span>
                  </div>
                  <i class="fas fa-chevron-down" v-if="cat.children?.length" :class="{ 'rotated': selectedCategory === cat.id }"></i>
                </div>
                <!-- Sub-categories in Drawer -->
                <div v-if="selectedCategory === cat.id && cat.children?.length" class="drawer-sub-list">
                  <div v-for="sub in cat.children" :key="sub.id" 
                       class="drawer-sub-item" :class="{ active: selectedSubCategory === sub.id }"
                       @click.stop="selectedSubCategory = sub.id; fetchProducts(); showMobileFilters = false">
                    {{ localized(sub, 'name') }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Dynamic Attributes (Size/Color) -->
          <template v-for="(vals, key) in dynamicFilters" :key="key">
            <div class="filter-section" v-if="isSizeType(key) && vals.length > 0">
              <div class="filter-title">{{ getAttributeLabel(key) }}</div>
              <div class="size-boxes-grid">
                <button v-for="size in vals" :key="size" 
                        :class="{ active: selectedSizes.includes(size) }"
                        @click="toggleSize(size)">
                  {{ size }}
                </button>
              </div>
            </div>

            <div class="filter-section" v-else-if="isColorType(key) && vals.length > 0">
              <div class="filter-title">{{ getAttributeLabel(key) }}</div>
              <div class="color-swatches-list">
                <div v-for="color in vals" 
                     :key="color" 
                     class="color-swatch-circle" 
                     :style="{ backgroundColor: getActualColor(color), border: getActualColor(color).toLowerCase() === '#ffffff' ? '1px solid #ddd' : 'none' }" 
                     :class="{ active: selectedColors.includes(color) }"
                     @click="toggleColor(color)">
                </div>
              </div>
            </div>
          </template>

          <div class="filter-section">
            <div class="filter-title">{{ $t('products.price') }}</div>
            <div class="price-range-container">
              <div class="price-inputs">
                <input type="number" v-model="priceRange.min" :placeholder="$t('products.min_price')" @input="debouncedFetch">
                <span>-</span>
                <input type="number" v-model="priceRange.max" :placeholder="$t('products.max_price')" @input="debouncedFetch">
              </div>
            </div>
          </div>
        </div>

        <div class="drawer-footer">
          <button class="apply-filters-btn" @click="showMobileFilters = false">
            {{ $t('products.show_results', { count: totalCount }) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import api from '../../config/axios';
import ProductCard from '../../components/ProductCard.vue';
import { cartState } from '../../store/cart';
import { useOffers } from '../../composables/useOffers';
import { useLocalized } from '../../composables/useLocalized';

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

const showMobileFilters = ref(false);
const isMobile = ref(window.innerWidth <= 1024);

const updateIsMobile = () => {
  isMobile.value = window.innerWidth <= 1024;
};

const router = useRouter();

const route = useRoute();

// Initialize useOffers composable
const { fetchOffers } = useOffers();
const { localized } = useLocalized();
const { t } = useI18n();

const currentTitle = computed(() => {
  if (selectedSubCategory.value) {
    const parent = categories.value.find(c => c.children?.some(s => s.id === selectedSubCategory.value));
    const sub = parent?.children.find(s => s.id === selectedSubCategory.value);
    return sub ? localized(sub, 'name') : t('products.all_products');
  }
  if (selectedCategory.value) {
    const cat = categories.value.find(c => c.id === selectedCategory.value);
    return cat ? localized(cat, 'name') : t('products.all_products');
  }
  return t('products.all_products');
});

const products = ref([]);
const categories = ref([]);
const loading = ref(true);
const totalCount = ref(0);
const totalPages = ref(1);
const currentPage = ref(1);
const sortBy = ref('created_at_desc');

// Filters
const selectedCategory = ref(null);
const selectedSubCategory = ref(null);
const selectedSizes = ref([]);
const selectedColors = ref([]);
const priceRange = reactive({ min: null, max: null });
const inStockOnly = ref(false);
const brands = ref([]);
const selectedBrands = ref([]);
const dynamicFilters = ref({});
const selectedAttributes = reactive({}); // { material: [], brand: [] }
const filtersOpen = reactive({
  category: true,
  subcategory: true,
  price: true,
});

const sizes = ref([]);
const availableColors = ref([]);

const toggleFilter = (key) => {
  if (filtersOpen[key] === undefined) filtersOpen[key] = true;
  filtersOpen[key] = !filtersOpen[key];
};

const isColorType = (key) => key.toLowerCase().includes('color') || key === 'اللون' || key === 'الألوان';
const isSizeType = (key) => key.toLowerCase().includes('size') || key === 'المقاس' || key === 'المقاسات';

const getAttributeLabel = (key) => {
  const labels = {
    brand: 'العلامة التجارية',
    color: 'اللون',
    size: 'المقاس',
    material: 'المادة',
    weight: 'الوزن',
    dimensions: 'الأبعاد',
    warranty: 'الضمان'
  };
  return labels[key] || key;
};

const getCategoryIcon = (name) => {
  if (name.includes('رجالي')) return '👕';
  if (name.includes('نسائي')) return '👗';
  if (name.includes('أطفال')) return '👶';
  if (name.includes('إكسسوار')) return '👜';
  if (name.includes('رياضي')) return '🏃';
  if (name.includes('أحذية')) return '👟';
  if (name.includes('مناسبات')) return '🎩';
  if (name.includes('صيفي')) return '☀️';
  return '📦';
};

const toggleSize = (size) => {
  const index = selectedSizes.value.indexOf(size);
  if (index > -1) selectedSizes.value.splice(index, 1);
  else selectedSizes.value.push(size);
  fetchProducts();
};

const toggleColor = (color) => {
  const index = selectedColors.value.indexOf(color);
  if (index > -1) selectedColors.value.splice(index, 1);
  else selectedColors.value.push(color);
  fetchProducts();
};

const mainCategories = computed(() => {
  return categories.value.filter(c => !c.parent_id);
});

const subCategories = computed(() => {
  if (!selectedCategory.value) return [];
  const parent = categories.value.find(c => c.id === selectedCategory.value);
  return parent ? (parent.children || []) : [];
});

const handleCategoryChange = () => {
  selectedSubCategory.value = null; // Reset sub-category when main category changes
  fetchProducts();
};

const resetFilters = () => {
  selectedCategory.value = null;
  selectedSubCategory.value = null;
  selectedSizes.value = [];
  selectedColors.value = [];
  priceRange.min = null;
  priceRange.max = null;
  selectedBrands.value = [];
  // Clear dynamic attributes
  Object.keys(selectedAttributes).forEach(k => selectedAttributes[k] = []);
  fetchProducts();
};

let debounceTimer;
const debouncedFetch = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    fetchProducts();
  }, 500);
};

const getImageUrl = (path) => {
  if (!path) return '/placeholder-product.png';
  if (path.startsWith('http')) return path;
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  return `${baseUrl.replace('/api', '')}/storage/${path}`;
};

const goToProduct = (product) => {
  router.push(`/product/${product.id}`);
};

const fetchProducts = async () => {
  loading.value = true;
  try {
    const params = {
      page: currentPage.value,
      per_page: 12,
      category_id: selectedCategory.value,
      subcategory_id: selectedSubCategory.value,
      brands: selectedBrands.value.length ? selectedBrands.value.join(',') : null,
      sizes: selectedSizes.value.length ? selectedSizes.value.join(',') : null,
      colors: selectedColors.value.length ? selectedColors.value.join(',') : null,
      sort_by: sortBy.value.split('_').slice(0, -1).join('_'),
      sort_direction: sortBy.value.split('_').pop(),
      min_price: priceRange.min,
      max_price: priceRange.max,
      in_stock: inStockOnly.value ? 1 : 0,
      is_active: 1,
      ...Object.fromEntries(
        Object.entries(selectedAttributes).map(([k, v]) => [k, v.length ? v.join(',') : null])
      )
    };
    
    const res = await api.get('/frontend/products', { params });
    products.value = res.data.data.data || res.data.data || res.data;
    totalCount.value = res.data.meta?.total || res.data.total || (res.data.data ? res.data.data.total : 0) || products.value.length;
    totalPages.value = res.data.meta?.last_page || res.data.last_page || (res.data.data ? res.data.data.last_page : 1) || 1;
  } catch (err) {
    console.error('Failed to fetch products', err);
  } finally {
    loading.value = false;
  }
};

const fetchDynamicFilters = async () => {
  try {
    const res = await api.get('/frontend/filters');
    dynamicFilters.value = res.data.attributes || {};
    
    // Auto-initialize selectedAttributes and filtersOpen
    Object.keys(dynamicFilters.value).forEach(key => {
      if (!selectedAttributes[key]) selectedAttributes[key] = [];
      if (filtersOpen[key] === undefined) filtersOpen[key] = true;

      // Backward compatibility for existing refs
      if (isSizeType(key)) sizes.value = dynamicFilters.value[key];
      if (isColorType(key)) availableColors.value = dynamicFilters.value[key];
      if (key === 'brand') brands.value = dynamicFilters.value[key];
    });
  } catch (err) {
    console.error('Failed to fetch filters', err);
  }
};

const fetchCategories = async () => {
  try {
    const res = await api.get('/frontend/categories');
    categories.value = res.data.data || res.data;
  } catch (err) {
    console.error('Failed to fetch categories', err);
  }
};

const changePage = (page) => {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  fetchProducts();
};

watch(() => route.query.category_id, (newVal) => {
  selectedCategory.value = newVal ? parseInt(newVal) : null;
  fetchProducts();
});

watch(() => route.query.subcategory_id, (newVal) => {
  selectedSubCategory.value = newVal ? parseInt(newVal) : null;
  fetchProducts();
});

onMounted(() => {
  if (route.query.category_id) {
    selectedCategory.value = parseInt(route.query.category_id);
  }
  if (route.query.subcategory_id) {
    selectedSubCategory.value = parseInt(route.query.subcategory_id);
  }
  fetchCategories();
  fetchDynamicFilters();
  fetchProducts();
  fetchOffers();
  
  window.addEventListener('resize', updateIsMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateIsMobile);
});
</script>

<style scoped>
.products-page {
  padding: 120px 0 100px;
  background: #fdfcfd;
}

.products-header {
  margin-bottom: 30px;
  padding-top: 0;
}

.page-title {
  font-size: 28px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 5px;
}

.results-count {
  text-align: right;
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 20px;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

.breadcrumbs {
  margin-bottom: 30px;
  display: flex;
  gap: 10px;
  align-items: center;
  color: #9ca3af;
  font-size: 14px;
}

.breadcrumbs a {
  text-decoration: none;
  color: #6b7280;
}

.breadcrumbs .current {
  color: #873260;
  font-weight: 600;
}

.products-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 40px;
  margin-top: 20px;
}

/* Sidebar Filters (Hidden on Mobile) */
.sidebar-filters {
  background: #fff;
  border: 1px solid #f3f4f6;
  border-radius: 16px;
  padding: 24px;
  height: fit-content;
  position: sticky;
  top: 100px;
  margin-top: 0;
}

.filter-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f3f4f6;
}

.filter-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.filter-title {
  font-size: 18px;
  font-weight: 800;
  color: #111827;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-bottom: 20px;
  padding: 5px 0;
}

.filter-title i {
  font-size: 12px;
  transition: transform 0.3s;
}

.filter-title i.rotated {
  transform: rotate(180deg);
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-item {
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid transparent;
}

.filter-item input {
  display: none;
}

.filter-item:hover {
  background: #f9fafb;
}

.filter-item.active {
  background: #873260;
  color: #fff;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(135, 50, 96, 0.2);
}

.item-with-icon {
  justify-content: flex-end; /* Text to the right */
  gap: 12px;
}

.cat-name {
  flex: 1;
}

.cat-icon-span {
  font-size: 20px;
}

.arrow-icon {
  font-size: 10px;
  opacity: 0.5;
  margin-left: auto;
}

.active .arrow-icon {
  opacity: 1;
  color: #fff;
}

.filter-item.all-products {
  font-weight: 700;
  color: #374151;
  border: 1px solid #f3f4f6;
  margin-bottom: 12px;
  justify-content: center;
  padding: 12px;
}

.filter-item.all-products.active {
  color: #fff;
  border-color: #873260;
}

.sub-category-list {
  padding-right: 25px; /* Indent more */
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
  margin-bottom: 10px;
}

.sub-item {
  padding: 8px 12px;
  font-size: 15px;
  opacity: 0.8;
  border-right: 2px solid #f3f4f6;
  border-radius: 0 8px 8px 0;
}

.sub-item.active {
  background: rgba(135, 50, 96, 0.05);
  color: #873260;
  border-right-color: #873260;
  opacity: 1;
}

.size-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.size-grid button {
  padding: 10px 12px;
  min-width: 45px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
  font-size: 13px;
  white-space: nowrap;
}

.size-grid button.active {
  border-color: #873260;
  background: #873260;
  color: #fff;
}

.color-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.color-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  box-shadow: 0 0 0 1px #e5e7eb;
  transition: all 0.2s;
}

.color-dot:hover {
  transform: scale(1.1);
}

.color-dot.active {
  border-color: #873260;
  transform: scale(1.2);
  box-shadow: 0 0 0 2px #873260;
}

.price-range-inputs {
  display: flex;
  gap: 12px;
  align-items: center;
}

.price-range-inputs input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  background: #f9fafb;
  transition: all 0.3s;
  text-align: center;
}

.price-range-inputs input:focus {
  border-color: #873260;
  background: #fff;
  outline: none;
  box-shadow: 0 0 0 4px rgba(135, 50, 96, 0.1);
}

/* Main Content */
.header-top-row {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.page-title {
  font-size: 32px;
  font-weight: 850;
  color: #111827;
  margin: 0;
  line-height: 1.2;
}

.results-count {
  color: #6b7280;
  font-size: 15px;
  margin-top: 10px;
}

.controls-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}

.controls-right {
  display: flex;
  gap: 12px;
  flex: 1;
}

.mobile-filter-btn {
  display: none; /* Desktop hidden */
}

.sort-container {
  flex: 1;
  max-width: 220px;
}

.sort-select {
  width: 100%;
  padding: 12px 42px 12px 20px;
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  background: #fff;
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m3 4 3 3 3-3'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 15px center;
  cursor: pointer;
}

[dir="rtl"] .sort-select {
  padding: 12px 20px 12px 42px;
  background-position: left 15px center;
}

/* Results count handled in header-top-row */

/* Products Grid */
.products-grid.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}


/* Loading/Empty State */
.loading-state, .empty-state {
  text-align: center;
  padding: 100px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #873260;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Mobile Responsive */
@media (max-width: 1024px) {
  .products-layout {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .sidebar-filters {
    display: none;
  }
  .mobile-filter-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 12px 20px;
    border: 1px solid #f3f4f6;
    border-radius: 12px;
    background: #fff;
    font-weight: 700;
    font-size: 14px;
    flex: 1;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.03);
  }
  .sort-dropdown {
    max-width: none;
  }
  .products-grid.grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .container {
    padding: 0 15px;
  }
  .breadcrumbs {
    display: none;
  }
  .products-header {
    margin-bottom: 20px;
    margin-top: 0;
  }
  .products-page {
    padding-top: 40px !important;
  }
  .header-top-row {
    margin-bottom: 15px;
  }
  .results-count {
    margin-top: 5px;
    font-size: 14px;
  }
  .controls-row {
    flex-direction: row !important;
    gap: 10px;
    align-items: center;
  }
  .view-toggles {
    order: 1;
    background: #f3f4f6;
    padding: 4px;
    border-radius: 12px;
    display: flex;
    gap: 4px;
  }
  .view-toggles .toggle-btn {
    width: 38px;
    height: 38px;
    border: none;
    background: transparent;
    border-radius: 8px;
  }
  .view-toggles .toggle-btn.active {
    background: #873260;
    color: #fff;
    box-shadow: 0 4px 10px rgba(135, 50, 96, 0.2);
  }
  .sort-container {
    order: 2;
    flex: 1;
  }
  .sort-select {
    width: 100%;
    padding: 10px;
    border-radius: 12px;
    border: 1px solid #f3f4f6;
    background: #fff;
    font-size: 13px;
    font-weight: 700;
  }
  .mobile-filter-btn {
    order: 3;
    flex: 1.2;
    padding: 10px 15px !important;
    border-radius: 12px !important;
  }
}

/* Category Drawer Style (Image 2) */
.category-drawer-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.drawer-cat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-radius: 12px;
  background: #f9fafb;
  cursor: pointer;
  transition: all 0.2s;
}

.drawer-cat-item.main {
  background: #873260;
  color: #fff;
}

.drawer-cat-item.active:not(.main) {
  background: #fef2f2;
  border: 1px solid #fecdd3;
}

.cat-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cat-icon {
  font-size: 18px;
}

.cat-name {
  font-weight: 700;
  font-size: 15px;
}

.drawer-cat-item i {
  font-size: 12px;
  color: #9ca3af;
}

/* Size Boxes (Image 2) */
.size-boxes-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.size-boxes-grid button {
  min-width: 50px;
  padding: 0 12px;
  height: 44px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.size-boxes-grid button.active {
  border-color: #873260;
  background: #873260;
  color: #fff;
}

/* Price range polished */
.price-inputs {
  display: flex;
  align-items: center;
  gap: 15px;
}

.price-inputs input {
  flex: 1;
  padding: 15px;
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  background: #f9fafb;
  font-size: 14px;
}

.price-inputs span {
  color: #9ca3af;
}

/* Mobile Filters Drawer */
.mobile-filters-drawer {
  position: fixed;
  inset: 0;
  z-index: 1000;
  visibility: hidden;
  transition: visibility 0.3s;
}

.mobile-filters-drawer.active {
  visibility: visible;
}

.drawer-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s;
}

.mobile-filters-drawer.active .drawer-overlay {
  opacity: 1;
}

.drawer-content {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 90%;
  background: #fff;
  border-radius: 30px 30px 0 0;
  display: flex;
  flex-direction: column;
  transform: translateY(100%);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.mobile-filters-drawer.active .drawer-content {
  transform: translateY(0);
}

.drawer-header {
  padding: 20px;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.drawer-header::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
}

.drawer-title {
  font-size: 18px;
  font-weight: 850;
  color: #111827;
}

.close-drawer {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f3f4f6;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #374151;
  cursor: pointer;
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.drawer-footer {
  padding: 20px;
  border-top: 1px solid #f3f4f6;
  background: #fff;
}

.apply-filters-btn {
  width: 100%;
  padding: 18px;
  background: #873260;
  color: #fff;
  border: none;
  border-radius: 16px;
  font-weight: 800;
  font-size: 16px;
  cursor: pointer;
}

.pagination {
  margin-top: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.page-btn, .page-num {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
}

.page-num.active {
  background: #873260;
  color: #fff;
  border-color: #873260;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}



/* Loading & Empty states */
.loading-state, .empty-state {
  padding: 100px 0;
  text-align: center;
  color: #6b7280;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top-color: #873260;
  border-radius: 50%;
  margin: 0 auto 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.brand-filter-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.brand-item {
  font-size: 14px;
  color: #4b5563;
  transition: color 0.3s;
}

.brand-item:hover {
  color: #873260;
}

.brand-item input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #873260;
}
.drawer-cat-item i {
  font-size: 12px;
  transition: transform 0.3s;
}

.drawer-cat-item i.rotated {
  transform: rotate(180deg);
}

.drawer-sub-list {
  background: #f9fafb;
  border-radius: 0 0 12px 12px;
  padding: 5px 0;
  margin-bottom: 10px;
}

.drawer-sub-item {
  padding: 12px 50px;
  font-size: 14px;
  color: #4b5563;
  cursor: pointer;
  border-right: 3px solid transparent;
}

.drawer-sub-item.active {
  color: #873260;
  font-weight: 700;
  background: rgba(135, 50, 96, 0.05);
  border-right-color: #873260;
}
</style>

