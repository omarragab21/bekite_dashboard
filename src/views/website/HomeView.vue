<template>
  <div class="home-view" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
    <!-- Hero Slider -->
    <section class="hero-section">
      <div v-if="loading" class="hero-loader">
        <div class="spinner"></div>
      </div>
      
      <div v-else class="hero-slider">
        <!-- Slider Navigation Buttons -->
        <template v-if="sliders.length > 1">
          <button class="slider-btn prev" @click="prevSlide" aria-label="Previous">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"/> <!-- Points Right -->
            </svg>
          </button>
          <button class="slider-btn next" @click="nextSlide" aria-label="Next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="15 18 9 12 15 6"/> <!-- Points Left -->
            </svg>
          </button>
        </template>

        <div 
          v-for="(slide, index) in sliders" 
          :key="slide.id"
          class="slide"
          :class="{ active: currentSlide === index }"
        >
          <!-- Background Image -->
          <div 
            class="slide-image" 
            :style="{ backgroundImage: `url(${getImageUrl(slide.image) || '/placeholder-hero.jpg'})` }"
          ></div>
          
          <!-- Content Overlay -->
          <div class="container slide-content-container">
            <div class="slide-content">
              <!-- <span class="slide-badge" v-if="slide.badge || currentLang === 'ar'">
                {{ slide.badge || t('hero.new_collection') }}
              </span> -->
              <h1 class="slide-title" v-html="formatTitle(slide.title)"></h1>
              <p class="slide-description" v-if="slide.description">{{ slide.description }}</p>
              <router-link v-if="slide.link && !slide.link.startsWith('http')" :to="slide.link" class="slide-main-btn">
                {{ slide.button_text || t('hero.explore_now') }}
              </router-link>
              <a v-if="slide.link && slide.link.startsWith('http')" :href="slide.link" class="slide-main-btn">
                {{ slide.button_text || t('hero.explore_now') }}
              </a>
            </div>
          </div>
        </div>

        <!-- Pagination Dots -->
        <div class="slider-dots" v-if="sliders.length > 1">
          <div 
            v-for="(_, index) in sliders" 
            :key="index"
            class="dot-wrapper"
            @click="currentSlide = index"
          >
            <div class="dot" :class="{ active: currentSlide === index }"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="categories-section container" v-if="categories.length > 0">
      <div class="section-header-flex">
        <div class="header-text">
          <h2 class="section-title">{{ sectionTitles.categoryTitle }}</h2>
          <p class="section-subtitle" v-if="sectionTitles.categorySubtitle">{{ sectionTitles.categorySubtitle }}</p>
        </div>
        <router-link to="/products" class="view-all-btn">{{ t('home.view_all') }}</router-link>
      </div>
      
      <div class="slider-wrapper">
        <!-- Floating Desktop Arrows -->
        <template v-if="categories.length > 4">
          <button class="nav-arrow-btn right-arrow" @click="scrollCategories('right')" aria-label="Next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
          <button class="nav-arrow-btn left-arrow" @click="scrollCategories('left')" aria-label="Previous">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
        </template>

        <div class="categories-slider" ref="categoriesSlider">
          <router-link 
            v-for="category in categories" 
            :key="category.id" 
            :to="{ path: '/products', query: { category_id: category.id } }"
            class="category-card"
          >
            <div class="category-image" :style="{ backgroundImage: `url(${getImageUrl(category.image)})` }"></div>
            <div class="category-overlay"></div>
            <div class="category-content">
              <h3 class="category-title">{{ category.name }}</h3>
              <p class="category-desc">{{ category.description }}</p>
              <span class="category-link">{{ t('home.shop_now') }} {{ currentLang === 'ar' ? '←' : '→' }}</span>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Featured Offers Section -->
    <section class="offers-section container" v-if="offers.length > 0">
      <div class="offers-header">
        <div class="header-text">
          <h2 class="section-title">{{ sectionTitles.offersTitle }}</h2>
          <p class="section-subtitle" v-if="sectionTitles.offersSubtitle">{{ sectionTitles.offersSubtitle }}</p>
        </div>
        <router-link to="/offers" class="view-all-btn">{{ t('home.all_offers') }}</router-link>
      </div>

      <div class="slider-wrapper">
        <!-- Floating Desktop Arrows -->
        <template v-if="offers.length > 4">
          <button class="nav-arrow-btn right-arrow" @click="scrollOffers('right')" aria-label="Next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
          <button class="nav-arrow-btn left-arrow" @click="scrollOffers('left')" aria-label="Previous">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
        </template>

        <div class="offers-slider" ref="offersSlider">
          <router-link 
            v-for="offer in offers" 
            :key="offer.id" 
            :to="'/offers'"
            class="offer-card"
          >
            <div class="offer-image" :style="{ backgroundImage: `url(${getImageUrl(offer.image)})` }">
              <div class="offer-badge" v-if="offer.value">
                {{ t('offers.discount') }} {{ offer.type === 'percentage' ? Math.round(offer.value) + '%' : Math.round(offer.value) + ' ' + currency }}
              </div>
              <div class="offer-overlay"></div>
              <div class="offer-content">
                <h3 class="offer-title">{{ localized(offer, 'name') }}</h3>
                <p class="offer-desc">{{ localized(offer, 'description') }}</p>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Best Sellers Section -->
    <section class="best-sellers-section container" v-if="bestSellers.length > 0">
      <div class="section-header-flex v2">
        <div class="header-text">
          <h2 class="section-title">{{ sectionTitles.bestSellersTitle }}</h2>
          <p class="section-subtitle" v-if="sectionTitles.bestSellersSubtitle">{{ sectionTitles.bestSellersSubtitle }}</p>
        </div>
        <router-link to="/products?sort_by=sales_count&sort_direction=desc" class="view-all-btn">{{ t('home.view_all') }}</router-link>
      </div>

      <div class="mobile-product-slider"
           @touchstart="handleTouchStart($event, 'bestSellers')"
           @touchend="handleTouchEnd($event, 'bestSellers', bestSellers)">
        <div class="mobile-product-pages" :style="{ transform: `translateX(${currentLang === 'ar' ? bestSellersSlide * 100 : -bestSellersSlide * 100}%)` }">
          <div class="mobile-product-page" v-for="(page, index) in chunkProducts(bestSellers)" :key="`best-${index}`">
            <product-card v-for="product in page" :key="product.id" :product="product" @click="goToProduct(product)" @add-to-cart="addToCart(product)" />
          </div>
        </div>
        <div class="mobile-slider-controls" v-if="chunkProducts(bestSellers).length > 1">
          <button @click="prevMobileSlide('bestSellers')" :disabled="bestSellersSlide === 0">‹</button>
          <button @click="nextMobileSlide('bestSellers', bestSellers)" :disabled="bestSellersSlide >= chunkProducts(bestSellers).length - 1">›</button>
        </div>
      </div>

      <div class="slider-wrapper">
        <template v-if="bestSellers.length > 4">
          <button class="nav-arrow-btn right-arrow" @click="scrollSection('bestSellers', 'right')" aria-label="Next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
          <button class="nav-arrow-btn left-arrow" @click="scrollSection('bestSellers', 'left')" aria-label="Previous">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
        </template>
        <div class="products-grid desktop-products-grid" ref="bestSellersSlider">
          <product-card v-for="product in bestSellers" :key="product.id" :product="product" @click="goToProduct(product)" @add-to-cart="addToCart(product)" />
        </div>
      </div>
    </section>

    <!-- New Arrivals Section -->
    <section class="new-arrivals-section container" v-if="newArrivals.length > 0">
      <div class="section-header-flex v2">
        <div class="header-text">
          <h2 class="section-title">{{ sectionTitles.newArrivalsTitle }}</h2>
          <p class="section-subtitle" v-if="sectionTitles.newArrivalsSubtitle">{{ sectionTitles.newArrivalsSubtitle }}</p>
        </div>
        <router-link to="/products?sort_by=created_at&sort_direction=desc" class="view-all-btn">{{ t('home.view_all') }}</router-link>
      </div>

      <div class="mobile-product-slider"
           @touchstart="handleTouchStart($event, 'newArrivals')"
           @touchend="handleTouchEnd($event, 'newArrivals', newArrivals)">
        <div class="mobile-product-pages" :style="{ transform: `translateX(${currentLang === 'ar' ? newArrivalsSlide * 100 : -newArrivalsSlide * 100}%)` }">
          <div class="mobile-product-page" v-for="(page, index) in chunkProducts(newArrivals)" :key="`new-${index}`">
            <product-card v-for="product in page" :key="product.id" :product="product" @click="goToProduct(product)" @add-to-cart="addToCart(product)" />
          </div>
        </div>
        <div class="mobile-slider-controls" v-if="chunkProducts(newArrivals).length > 1">
          <button @click="prevMobileSlide('newArrivals')" :disabled="newArrivalsSlide === 0">‹</button>
          <button @click="nextMobileSlide('newArrivals', newArrivals)" :disabled="newArrivalsSlide >= chunkProducts(newArrivals).length - 1">›</button>
        </div>
      </div>

      <div class="slider-wrapper">
        <template v-if="newArrivals.length > 4">
          <button class="nav-arrow-btn right-arrow" @click="scrollSection('newArrivals', 'right')" aria-label="Next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
          <button class="nav-arrow-btn left-arrow" @click="scrollSection('newArrivals', 'left')" aria-label="Previous">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
        </template>
        <div class="products-grid desktop-products-grid" ref="newArrivalsSlider">
          <product-card v-for="product in newArrivals" :key="product.id" :product="product" @click="goToProduct(product)" @add-to-cart="addToCart(product)" />
        </div>
      </div>
    </section>

    <!-- Dynamic Category Section 1 (Last Sections) -->
    <section class="dynamic-cat-section container" v-if="cat1Data && cat1Products.length">
      <div class="section-header-flex v2">
        <div class="header-text">
          <h2 class="section-title">{{ localized(cat1Data, 'name') }}</h2>
        </div>
        <router-link :to="'/products?category_id=' + cat1Data.id" class="view-all-btn">{{ t('home.view_all') }}</router-link>
      </div>
      <div class="mobile-product-slider"
           @touchstart="handleTouchStart($event, 'cat1')"
           @touchend="handleTouchEnd($event, 'cat1', cat1Products)">
        <div class="mobile-product-pages" :style="{ transform: `translateX(${currentLang === 'ar' ? cat1Slide * 100 : -cat1Slide * 100}%)` }">
          <div class="mobile-product-page" v-for="(page, index) in chunkProducts(cat1Products)" :key="`cat1-${index}`">
            <product-card v-for="product in page" :key="product.id" :product="product" @click="goToProduct(product)" @add-to-cart="addToCart(product)" />
          </div>
        </div>
        <div class="mobile-slider-controls" v-if="chunkProducts(cat1Products).length > 1">
          <button @click="prevMobileSlide('cat1')" :disabled="cat1Slide === 0">‹</button>
          <button @click="nextMobileSlide('cat1', cat1Products)" :disabled="cat1Slide >= chunkProducts(cat1Products).length - 1">›</button>
        </div>
      </div>

      <div class="slider-wrapper">
        <template v-if="cat1Products.length > 4">
          <button class="nav-arrow-btn right-arrow" @click="scrollSection('cat1', 'right')" aria-label="Next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
          <button class="nav-arrow-btn left-arrow" @click="scrollSection('cat1', 'left')" aria-label="Previous">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
        </template>
        <div class="products-grid desktop-products-grid" ref="cat1Slider">
          <product-card v-for="product in cat1Products" :key="product.id" :product="product" @click="goToProduct(product)" @add-to-cart="addToCart(product)" />
        </div>
      </div>
    </section>

    <!-- Dynamic Category Section 2 (Last Sections) -->
    <section class="dynamic-cat-section container" v-if="cat2Data && cat2Products.length">
      <div class="section-header-flex v2">
        <div class="header-text">
          <h2 class="section-title">{{ localized(cat2Data, 'name') }}</h2>
        </div>
        <router-link :to="'/products?category_id=' + cat2Data.id" class="view-all-btn">{{ t('home.view_all') }}</router-link>
      </div>
      <div class="mobile-product-slider"
           @touchstart="handleTouchStart($event, 'cat2')"
           @touchend="handleTouchEnd($event, 'cat2', cat2Products)">
        <div class="mobile-product-pages" :style="{ transform: `translateX(${currentLang === 'ar' ? cat2Slide * 100 : -cat2Slide * 100}%)` }">
          <div class="mobile-product-page" v-for="(page, index) in chunkProducts(cat2Products)" :key="`cat2-${index}`">
            <product-card v-for="product in page" :key="product.id" :product="product" @click="goToProduct(product)" @add-to-cart="addToCart(product)" />
          </div>
        </div>
        <div class="mobile-slider-controls" v-if="chunkProducts(cat2Products).length > 1">
          <button @click="prevMobileSlide('cat2')" :disabled="cat2Slide === 0">‹</button>
          <button @click="nextMobileSlide('cat2', cat2Products)" :disabled="cat2Slide >= chunkProducts(cat2Products).length - 1">›</button>
        </div>
      </div>

      <div class="slider-wrapper">
        <template v-if="cat2Products.length > 4">
          <button class="nav-arrow-btn right-arrow" @click="scrollSection('cat2', 'right')" aria-label="Next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
          <button class="nav-arrow-btn left-arrow" @click="scrollSection('cat2', 'left')" aria-label="Previous">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
        </template>
        <div class="products-grid desktop-products-grid" ref="cat2Slider">
          <product-card v-for="product in cat2Products" :key="product.id" :product="product" @click="goToProduct(product)" @add-to-cart="addToCart(product)" />
        </div>
      </div>
    </section>

    <!-- Brands Section -->
    <section class="brands-section" v-if="brands.length > 0">
      <div class="brands-header-container container">
        <div class="section-header-flex">
          <div class="header-text">
            <h2 class="section-title">{{ sectionTitles.brandsTitle }}</h2>
            <p class="section-subtitle" v-if="sectionTitles.brandsSubtitle">{{ sectionTitles.brandsSubtitle }}</p>
          </div>
        </div>
      </div>
      
      <div class="brands-rail-container">
        <div class="brands-rail" :class="{ 'no-animation': brands.length <= 2 }">
          <!-- Double the list for infinite scroll effect, but only if we have enough brands -->
          <component 
            :is="brand.url ? 'a' : 'div'"
            :href="brand.url || null"
            :target="null"
            v-for="(brand, index) in (brands.length > 2 ? [...brands, ...brands] : brands)" 
            :key="`${brand.id}-${index}`" 
            class="brand-item"
            :style="brand.url ? 'cursor: pointer;' : ''"
          >
            <img :src="getImageUrl(brand.logo)" :alt="localized(brand, 'name')" />
          </component>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import api from '../../config/axios';
import ProductCard from '../../components/ProductCard.vue';
import { cartState } from '../../store/cart';
import { useLocalized } from '../../composables/useLocalized';
import { useSettings } from '../../composables/useSettings';

const router = useRouter();

const { t, locale } = useI18n();
const { localized } = useLocalized();
const { currency, fetchSettings } = useSettings();
const sliders = ref([]);
const categories = ref([]);
const offers = ref([]);
const bestSellers = ref([]);
const newArrivals = ref([]);
const cat1Products = ref([]);
const cat2Products = ref([]);
const cat1Data = ref(null);
const cat2Data = ref(null);
const brands = ref([]);
const loading = ref(true);
const currentSlide = ref(0);
const currentLang = computed(() => locale.value);
const slideInterval = ref(null);
const categoriesSlider = ref(null);
const offersSlider = ref(null);
const bestSellersSlider = ref(null);
const newArrivalsSlider = ref(null);
const cat1Slider = ref(null);
const cat2Slider = ref(null);
const bestSellersSlide = ref(0);
const newArrivalsSlide = ref(0);
const cat1Slide = ref(0);
const cat2Slide = ref(0);
const sectionTitles = ref({
  categoryTitle: '',
  categorySubtitle: '',
  offersTitle: '',
  offersSubtitle: '',
  bestSellersTitle: '',
  bestSellersSubtitle: '',
  newArrivalsTitle: '',
  newArrivalsSubtitle: '',
  brandsTitle: '',
  brandsSubtitle: ''
});

// Touch handling for mobile swipe
const touchStartX = ref(0);
const touchEndX = ref(0);
const activeSlider = ref(null);

const handleTouchStart = (e, sliderKey) => {
  touchStartX.value = e.changedTouches[0].screenX;
  activeSlider.value = sliderKey;
};

const handleTouchEnd = (e, sliderKey, products) => {
  touchEndX.value = e.changedTouches[0].screenX;
  if (activeSlider.value === sliderKey) {
    handleSwipe(sliderKey, products);
  }
};

const handleSwipe = (sliderKey, products) => {
  const swipeThreshold = 50;
  const diff = touchStartX.value - touchEndX.value;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swipe left - next slide
      nextMobileSlide(sliderKey, products);
    } else {
      // Swipe right - previous slide
      prevMobileSlide(sliderKey);
    }
  }
};

const getImageUrl = (path) => {
  if (!path) return '/logo.png';
  if (path.startsWith('http')) return path;
  const baseUrl = api.defaults.baseURL;
  return `${baseUrl.replace('/api', '')}/storage/${path}`;
};

const goToProduct = (product) => {
  router.push(`/product/${product.id}`);
};

const addToCart = (product) => {
  cartState.addToCart(product);
};

const chunkProducts = (products) => {
  const chunks = [];
  for (let i = 0; i < products.length; i += 4) {
    chunks.push(products.slice(i, i + 4));
  }
  return chunks;
};

const slideRefs = {
  bestSellers: bestSellersSlide,
  newArrivals: newArrivalsSlide,
  cat1: cat1Slide,
  cat2: cat2Slide
};

const nextMobileSlide = (key, products) => {
  const pagesCount = chunkProducts(products).length;
  if (slideRefs[key].value < pagesCount - 1) {
    slideRefs[key].value += 1;
  }
};

const prevMobileSlide = (key) => {
  if (slideRefs[key].value > 0) {
    slideRefs[key].value -= 1;
  }
};

const formatTitle = (title) => {
  if (!title) return '';
  // Try to split the year from the title to make it bigger
  const yearMatch = title.match(/\b(202\d)\b/);
  if (yearMatch) {
    const year = yearMatch[0];
    const text = title.replace(year, '').trim();
    return `${text} <br> <span class="title-year">${year}</span>`;
  }
  return title;
};

const scrollCategories = (direction) => {
  if (!categoriesSlider.value) return;
  const container = categoriesSlider.value;
  const scrollAmount = container.clientWidth * 0.5; // Scroll half container width
  
  // In RTL, scrollLeft behavior can be inverse. 
  // We use scrollBy which is generally consistent.
  // Visual Left arrow (<) in RTL goes NEXT (negative left)
  // Visual Right arrow (>) in RTL goes BACK (positive left)
  container.scrollBy({
    left: direction === 'left' ? -scrollAmount : scrollAmount,
    behavior: 'smooth'
  });
};

const scrollOffers = (direction) => {
  if (!offersSlider.value) return;
  const container = offersSlider.value;
  const scrollAmount = container.clientWidth * 0.4;
  container.scrollBy({
    left: direction === 'left' ? -scrollAmount : scrollAmount,
    behavior: 'smooth'
  });
};

const sectionSliders = {
  bestSellers: bestSellersSlider,
  newArrivals: newArrivalsSlider,
  cat1: cat1Slider,
  cat2: cat2Slider
};

const scrollSection = (key, direction) => {
  const sliderRef = sectionSliders[key];
  if (!sliderRef || !sliderRef.value) return;
  const container = sliderRef.value;
  const scrollAmount = container.clientWidth * 0.5;
  container.scrollBy({
    left: direction === 'left' ? -scrollAmount : scrollAmount,
    behavior: 'smooth'
  });
};

const fetchCategories = async () => {
  try {
    const res = await api.get('/frontend/categories?is_active=1');
    const allCats = res.data.data || res.data;
    categories.value = allCats.filter(c => !c.parent_id);
  } catch (err) {
    console.error('Failed to fetch categories', err);
  }
};

const fetchOffers = async () => {
  try {
    const res = await api.get('/frontend/offers?is_active=1');
    offers.value = res.data.data || res.data;
    console.log('Home offers:', offers.value);
  } catch (err) {
    console.error('Failed to fetch offers', err);
  }
};

const fetchBestSellers = async () => {
  try {
    const res = await api.get('/frontend/products?sort_by=sales_count&sort_direction=desc&per_page=12&is_active=1');
    bestSellers.value = res.data.data;
  } catch (err) {
    console.error('Failed to fetch best sellers', err);
  }
};

const fetchNewArrivals = async () => {
  try {
    const res = await api.get('/frontend/products?sort_by=created_at&sort_direction=desc&per_page=12&is_active=1');
    newArrivals.value = res.data.data;
  } catch (err) {
    console.error('Failed to fetch new arrivals', err);
  }
};

const fetchBrands = async () => {
  try {
    const res = await api.get('/frontend/brands');
    console.log('Brands response:', res.data);
    brands.value = res.data.data || res.data;
    console.log('Brands value:', brands.value);
  } catch (err) {
    console.error('Failed to fetch brands', err);
    brands.value = []; // Set empty array to prevent errors
  }
};

const fetchHomeSections = async () => {
  try {
    const settingsRes = await api.get('/frontend/settings');
    const setts = settingsRes.data.data;
    const cat1Id = setts.find(s => s.key === 'home_category_1')?.value;
    const cat2Id = setts.find(s => s.key === 'home_category_2')?.value;

    // Fetch section titles and subtitles
    const categoryTitleAr = setts.find(s => s.key === 'home_section_category_title_ar')?.value;
    const categoryTitleEn = setts.find(s => s.key === 'home_section_category_title_en')?.value;
    const categorySubtitleAr = setts.find(s => s.key === 'home_section_category_subtitle_ar')?.value;
    const categorySubtitleEn = setts.find(s => s.key === 'home_section_category_subtitle_en')?.value;
    
    const offersTitleAr = setts.find(s => s.key === 'home_section_offers_title_ar')?.value;
    const offersTitleEn = setts.find(s => s.key === 'home_section_offers_title_en')?.value;
    const offersSubtitleAr = setts.find(s => s.key === 'home_section_offers_subtitle_ar')?.value;
    const offersSubtitleEn = setts.find(s => s.key === 'home_section_offers_subtitle_en')?.value;

    const bestSellersTitleAr = setts.find(s => s.key === 'home_section_best_sellers_title_ar')?.value;
    const bestSellersTitleEn = setts.find(s => s.key === 'home_section_best_sellers_title_en')?.value;
    const bestSellersSubtitleAr = setts.find(s => s.key === 'home_section_best_sellers_subtitle_ar')?.value;
    const bestSellersSubtitleEn = setts.find(s => s.key === 'home_section_best_sellers_subtitle_en')?.value;

    const newArrivalsTitleAr = setts.find(s => s.key === 'home_section_new_arrivals_title_ar')?.value;
    const newArrivalsTitleEn = setts.find(s => s.key === 'home_section_new_arrivals_title_en')?.value;
    const newArrivalsSubtitleAr = setts.find(s => s.key === 'home_section_new_arrivals_subtitle_ar')?.value;
    const newArrivalsSubtitleEn = setts.find(s => s.key === 'home_section_new_arrivals_subtitle_en')?.value;

    const brandsTitleAr = setts.find(s => s.key === 'home_section_brands_title_ar')?.value;
    const brandsTitleEn = setts.find(s => s.key === 'home_section_brands_title_en')?.value;
    const brandsSubtitleAr = setts.find(s => s.key === 'home_section_brands_subtitle_ar')?.value;
    const brandsSubtitleEn = setts.find(s => s.key === 'home_section_brands_subtitle_en')?.value;

    sectionTitles.value.categoryTitle = currentLang.value === 'ar' ? (categoryTitleAr || t('home.shop_by_category')) : (categoryTitleEn || t('home.shop_by_category'));
    sectionTitles.value.categorySubtitle = currentLang.value === 'ar' ? categorySubtitleAr : categorySubtitleEn;
    
    sectionTitles.value.offersTitle = currentLang.value === 'ar' ? (offersTitleAr || t('home.featured_offers')) : (offersTitleEn || t('home.featured_offers'));
    sectionTitles.value.offersSubtitle = currentLang.value === 'ar' ? offersSubtitleAr : offersSubtitleEn;

    sectionTitles.value.bestSellersTitle = currentLang.value === 'ar' ? (bestSellersTitleAr || t('home.best_sellers')) : (bestSellersTitleEn || t('home.best_sellers'));
    sectionTitles.value.bestSellersSubtitle = currentLang.value === 'ar' ? bestSellersSubtitleAr : bestSellersSubtitleEn;

    sectionTitles.value.newArrivalsTitle = currentLang.value === 'ar' ? (newArrivalsTitleAr || t('home.new_arrivals')) : (newArrivalsTitleEn || t('home.new_arrivals'));
    sectionTitles.value.newArrivalsSubtitle = currentLang.value === 'ar' ? newArrivalsSubtitleAr : newArrivalsSubtitleEn;

    sectionTitles.value.brandsTitle = currentLang.value === 'ar' ? (brandsTitleAr || t('home.brands')) : (brandsTitleEn || t('home.brands'));
    sectionTitles.value.brandsSubtitle = currentLang.value === 'ar' ? brandsSubtitleAr : brandsSubtitleEn;

    if (cat1Id) {
      const c1Res = await api.get(`/frontend/categories/${cat1Id}`);
      cat1Data.value = c1Res.data.data;
      const p1Res = await api.get(`/frontend/products?category_id=${cat1Id}&per_page=12&is_active=1`);
      cat1Products.value = p1Res.data.data;
    }

    if (cat2Id) {
      const c2Res = await api.get(`/frontend/categories/${cat2Id}`);
      cat2Data.value = c2Res.data.data;
      const p2Res = await api.get(`/frontend/products?category_id=${cat2Id}&per_page=12&is_active=1`);
      cat2Products.value = p2Res.data.data;
    }
  } catch (err) {
    console.error('Failed to fetch home sections', err);
  }
};

const fetchSliders = async () => {
  try {
    const res = await api.get('/frontend/sliders?is_active=1');
    sliders.value = res.data.data;
  } catch (err) {
    console.error('Failed to fetch sliders', err);
  } finally {
    loading.value = false;
  }
};

const nextSlide = () => {
  if (sliders.value.length > 0) {
    currentSlide.value = (currentSlide.value + 1) % sliders.value.length;
    resetInterval();
  }
};

const prevSlide = () => {
  if (sliders.value.length > 0) {
    currentSlide.value = (currentSlide.value - 1 + sliders.value.length) % sliders.value.length;
    resetInterval();
  }
};

const resetInterval = () => {
  if (slideInterval.value) clearInterval(slideInterval.value);
  slideInterval.value = setInterval(nextSlide, 7000);
};

onMounted(() => {
  fetchSettings();
  fetchSliders();
  fetchCategories();
  fetchOffers();
  fetchBestSellers();
  fetchNewArrivals();
  fetchHomeSections();
  fetchBrands();
  slideInterval.value = setInterval(nextSlide, 7000);
});

onUnmounted(() => {
  if (slideInterval.value) clearInterval(slideInterval.value);
});
</script>

<style scoped>
.home-view {
  direction: inherit;
}

.container {
  max-width: 1440px;
  margin: 0 auto;
  padding-left: 5%;
  padding-right: 5%;
}

/* Hero Section */
.hero-section {
  position: relative;
  height: 90vh; /* Slightly taller for better impact */
  overflow: hidden;
  background: #f3f4f6;
}

.hero-loader {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(135, 50, 96, 0.1);
  border-top-color: #873260;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.hero-slider {
  position: relative;
  width: 100%;
  height: 100%;
}

.slider-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  color: #111827;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 50;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  opacity: 0;
  pointer-events: none;
}

.hero-slider:hover .slider-btn {
  opacity: 1;
  pointer-events: auto;
}

.slider-btn:hover {
  background: #fff;
  color: #873260;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

.slider-btn.prev { right: 20px; } /* In RTL, Prev is on right */
.slider-btn.next { left: 20px; } /* In RTL, Next is on left */

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  visibility: hidden;
  transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center; /* Centered vertically by default */
  justify-content: center;
  padding-bottom: 5vh;
}

.slide.active {
  opacity: 1;
  visibility: visible;
}

.slide-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  z-index: 1;
}

.slide.active .slide-image {
  transform: scale(1);
}

.slide-image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 2;
}

.slide-content-container {
  position: relative;
  z-index: 10;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding-inline-start: 18%;
  padding-top: 40px;
}

.slide-content {
  max-width: 800px;
  transform: translateY(30px); /* Transition from bottom */
  opacity: 0;
  transition: all 1s 0.3s ease;
}

.slide.active .slide-content {
  transform: translateY(0);
  opacity: 1;
}

.slide-badge {
  display: inline-block;
  background: #fdb913;
  color: #111827;
  padding: 8px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 25px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.slide-title {
  font-size: 50px;
  font-weight: 850;
  color: #fff;
  line-height: 1.1;
  margin-bottom: 20px;
  text-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

:deep(.title-year) {
  font-size: 120px;
  display: block;
  margin-top: 10px;
}

.slide-description {
  font-size: 18px;
  color: #fff;
  margin-bottom: 40px;
  max-width: 600px;
  font-weight: 500;
  opacity: 0.95;
}

.slide-main-btn {
  display: inline-block;
  background: #fdb913;
  color: #111827;
  text-decoration: none;
  padding: 18px 48px;
  border-radius: 12px;
  font-size: 20px;
  font-weight: 800;
  transition: all 0.3s;
  box-shadow: 0 10px 30px rgba(253, 185, 19, 0.3);
}

.slide-main-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 50px rgba(253, 185, 19, 0.5);
  background: #ffc22b;
}

/* Slider Controls */
.slider-dots {
  position: absolute;
  bottom: 25px; /* Lower position */
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px; /* Closer dots */
  z-index: 20;
}

.dot-wrapper {
  padding: 6px;
  cursor: pointer;
}

.dot {
  width: 8px; /* Smaller dots */
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4); /* Lighter over images */
  border: none;
  transition: all 0.4s;
}

.dot.active {
  width: 30px; /* Smaller active pill */
  border-radius: 10px;
  background: #fdb913;
}

@media (max-width: 1200px) {
  .slide-title { font-size: 4.5rem; }
  .slide-content { padding: 0 2rem; }
  .slide-content-container { padding-inline-start: 10%; }
}

@media (max-width: 1024px) {
  .slide-title { font-size: 3rem; }
  .slide-content-container { padding-inline-start: 8%; }
  .slide-badge { padding: 6px 20px; font-size: 13px; }
  .slide-description { font-size: 16px; }
  .slide-main-btn { padding: 14px 36px; font-size: 18px; }
  .slider-btn {
    width: 40px;
    height: 40px;
  }
  .slider-btn.prev { right: 10px; }
  .slider-btn.next { left: 10px; }
}

@media (max-width: 768px) {
  .hero-section {
    height: 60vh;
  }

  .slide {
    padding-bottom: 5vh;
  }

  .slide-content-container {
    padding: 0 20px;
    justify-content: flex-start;
    }

  .slide-content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    }

  .slide-badge {
    padding: 5px 14px;
    font-size: 11px;
    margin-bottom: 10px;
  }

  .slide-title {
    font-size: 28px;
    margin-bottom: 10px;
    padding: 0 5px;
    line-height: 1.2;
  }

  :deep(.title-year) {
    font-size: 42px;
  }

  .slide-description {
    font-size: 14px;
    margin-bottom: 20px;
    max-width: 95%;
    margin-inline: auto;
    font-weight: 500;
  }

  .slide-main-btn {
    width: auto;
    min-width: 180px;
    padding: 12px 24px;
    font-size: 16px;
    border-radius: 8px;
  }

  .slider-btn {
    width: 36px;
    height: 36px;
  }
  .slider-btn.prev { right: 8px; }
  .slider-btn.next { left: 8px; }

  .slider-dots {
    bottom: 15px;
  }

  .dot {
    width: 6px;
    height: 6px;
  }

  .dot.active {
    width: 24px;
  }
}

@media (max-width: 480px) {
  .hero-section {
    height: 50vh;
  }

  .slide-title {
    font-size: 24px;
  }

  :deep(.title-year) {
    font-size: 36px;
  }

  .slide-description {
    font-size: 13px;
    margin-bottom: 15px;
  }

  .slide-main-btn {
    min-width: 150px;
    padding: 10px 20px;
    font-size: 14px;
  }

  .slide-badge {
    padding: 4px 12px;
    font-size: 10px;
  }
}

/* Categories Section */
.categories-section {
  padding: 80px 0 100px;
  max-width: 1300px !important;
  margin: 0 auto;
}

.section-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
}

.section-header-flex.v2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #f3f4f6;
  padding-bottom: 24px;
  margin-bottom: 48px;
}

.best-sellers-section .section-title,
.new-arrivals-section .section-title,
.dynamic-cat-section .section-title,
.brands-section .section-title {
  font-size: 34px;
  font-weight: 850;
  color: #111827;
  margin-bottom: 20px;
  line-height: 1.2;
}

.best-sellers-section .section-subtitle,
.new-arrivals-section .section-subtitle,
.dynamic-cat-section .section-subtitle {
  font-size: 16px;
  color: #6b7280;
  font-weight: 600;
}

.view-all-btn {
  padding: 8px 30px;
  background: #fff;
  border: 1px solid #87326033;
  border-radius: 12px;
  color: #111827;
  text-decoration: none;
  font-weight: 700;
  font-size: 15px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 10px rgba(0,0,0,0.03);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

.view-all-btn:hover {
  border-color: #873260;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(135, 50, 96, 0.1);
  color: #873260;
}

.best-sellers-section, .new-arrivals-section, .dynamic-cat-section, .brands-section {
  padding: 100px 0;
}

/* Removed redundant view-all-link styles */

.section-title {
  font-size: 32px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 15px;
}

.section-subtitle {
  font-size: 16px;
  color: #6b7280;
}

.slider-wrapper {
  position: relative;
  width: 100%;
}

.nav-arrow-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e5e7eb;
  color: #111827;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 50;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.nav-arrow-btn:hover {
  background: #fff;
  border-color: #873260;
  color: #873260;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  transform: translateY(-50%) scale(1.1);
}

.right-arrow {
  right: -25px;
}

.left-arrow {
  left: -25px;
}

.categories-slider {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  padding: 10px 0;
  -ms-overflow-style: none;
}

.categories-slider::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.category-card {
  flex: 0 0 calc(20% - 16px); /* 5 cards visible on desktop */
  min-width: 280px;
  position: relative;
  height: 420px;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  text-decoration: none;
}

.category-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 0.6s ease;
  z-index: 1;
}

.category-card:hover .category-image {
  transform: scale(1.08);
}

.category-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 70%;
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%);
  z-index: 2;
  transition: height 0.3s;
}

.category-card:hover .category-overlay {
  height: 85%;
}

.category-content {
  position: relative;
  z-index: 3;
  padding: 20px;
  color: white;
}

.category-title {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 8px;
}

.category-desc {
  font-size: 13px;
  color: #d1d5db;
  margin-bottom: 15px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-link {
  font-size: 14px;
  color: #fdb913;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* RTL icon arrow fix */
html[dir="rtl"] .category-link {
  flex-direction: row-reverse;
  justify-content: flex-end;
}

@media (max-width: 1200px) {
  .category-card {
    flex: 0 0 calc(33.333% - 14px);
  }
}

@media (max-width: 768px) {
  .categories-section {
    padding: 50px 0 30px;
  }
  .section-title {
    font-size: 26px;
  }
  .category-card {
    flex: 0 0 85%; /* Shows one card mostly on mobile */
    height: 350px;
  }
  .nav-arrow-btn {
    display: none; /* Native scrolling is better on mobile */
  }
}

/* Offers Section */
.offers-section {
  padding: 60px 0 100px;
  max-width: 1300px !important;
  margin: 0 auto;
}

.offers-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
}

/* Combined into .view-all-btn */

.offers-slider {
  display: flex;
  gap: 24px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  padding: 10px 0;
  -ms-overflow-style: none;
}

.offers-slider::-webkit-scrollbar {
  display: none;
}

.offer-card {
  flex: 0 0 calc(25% - 18px); /* 4 cards visible on desktop */
  min-width: 320px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.offer-image {
  height: 380px;
  border-radius: 20px;
  background-size: cover;
  background-position: center;
  position: relative;
  transition: transform 0.5s;
  overflow: hidden;
}

.offer-card:hover .offer-image {
  transform: translateY(-5px);
}

.offer-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 30%, transparent 60%);
}

.offer-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  background: #f59e0b;
  color: #111827;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 800;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  z-index: 10;
}

.offer-content {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  padding: 30px 25px;
  z-index: 10;
  color: #fff;
}

.offer-title {
  font-size: 22px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 8px;
}

.offer-desc {
  font-size: 15px;
  color: rgba(255,255,255,0.9);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 1200px) {
  .offer-card {
    flex: 0 0 calc(50% - 12px); /* 2 cards visible on medium screens */
  }
}

@media (max-width: 768px) {
  .offers-section {
    padding: 40px 0 60px;
  }
  .offer-card {
    flex: 0 0 85%; /* Shows one card mostly on mobile */
    height: auto;
  }
  .offers-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  .view-all-btn {
    align-self: flex-start;
  }
}
/* Product Grid Sections (Shared) */
.best-sellers-section,
.new-arrivals-section,
.dynamic-cat-section {
  padding: 0px 0 100px;
  max-width: 1300px !important;
  margin: 0 auto;
}

.new-arrivals-section,
.dynamic-cat-section {
  padding-top: 0; /* Less gap between sections */
}

.section-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 40px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

/* Hover arrows for all slider wrappers */
.slider-wrapper .nav-arrow-btn {
  opacity: 0;
  transition: opacity 0.3s, transform 0.3s;
}

.slider-wrapper:hover .nav-arrow-btn {
  opacity: 1;
}

@media (min-width: 769px) {
  /* Scrollable product grids inside slider-wrapper (desktop only) */
  .slider-wrapper > .products-grid.desktop-products-grid,
  .slider-wrapper > .desktop-products-grid {
    display: flex !important;
    gap: 24px;
    overflow-x: auto;
    scroll-behavior: smooth;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding: 10px 0;
  }

  .slider-wrapper > .products-grid.desktop-products-grid::-webkit-scrollbar,
  .slider-wrapper > .desktop-products-grid::-webkit-scrollbar {
    display: none;
  }

  .slider-wrapper > .products-grid.desktop-products-grid > *,
  .slider-wrapper > .desktop-products-grid > * {
    flex: 0 0 calc(25% - 18px);
    min-width: 260px;
  }
}

.mobile-product-slider {
  display: none;
}

.product-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.product-image-wrapper {
  position: relative;
  height: 380px;
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
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.badge-new {
  background: #10b981;
  color: #fff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
}

.badge-sale {
  background: #f43f5e;
  color: #fff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
}

.product-info {
  padding: 20px;
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
  background: #374151;
  cursor: pointer;
  border: 2px solid #fff;
  box-shadow: 0 0 0 1px #e5e7eb;
}

.color-dot.active {
  box-shadow: 0 0 0 2px #873260;
}

.product-name {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
}

.product-sku {
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 15px;
}

.product-price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.price-group {
  display: flex;
  flex-direction: column;
}

.current-price {
  font-size: 20px;
  font-weight: 800;
  color: #111827;
}

.old-price {
  font-size: 14px;
  color: #9ca3af;
  text-decoration: line-through;
}

.discount-pill {
  background: #fee2e2;
  color: #ef4444;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
}

.add-to-cart-btn {
  width: 100%;
  padding: 12px;
  background: #873260; /* User's theme color */
  color: #fff;
  border: none;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.add-to-cart-btn:hover {
  background: #4a1936;
  transform: scale(1.02);
}

@media (max-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .categories-section, .best-sellers-section, .new-arrivals-section, .dynamic-cat-section, .brands-section {
    padding: 40px 0 !important;
  }
  .desktop-products-grid {
    display: none;
  }
  .mobile-product-slider {
    display: block;
    overflow: hidden;
    width: 100%;
  }
  .mobile-product-pages {
    display: flex;
    transition: transform 0.35s ease;
    will-change: transform;
  }
  .mobile-product-page {
    flex: 0 0 100%;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  .mobile-product-page :deep(.product-image-wrapper) {
    height: 180px;
  }
  .mobile-product-page :deep(.product-info) {
    padding: 12px;
  }
  .mobile-product-page :deep(.product-name) {
    font-size: 13px;
    min-height: 34px;
  }
  .mobile-product-page :deep(.current-price) {
    font-size: 14px;
  }
  .mobile-product-page :deep(.add-to-cart-btn) {
    padding: 9px 6px;
    font-size: 12px;
    gap: 5px;
  }
  .mobile-product-page :deep(.add-to-cart-btn svg) {
    width: 15px;
    height: 15px;
  }
  .mobile-slider-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-top: 18px;
  }
  .mobile-slider-controls button {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid #e5e7eb;
    background: #fff;
    color: #873260;
    font-size: 24px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  }
  .mobile-slider-controls button:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
}

@media (max-width: 1024px) {
  .hero-section {
    height: 60vh !important;
  }
  .slide-title {
    font-size: 2.2rem !important;
  }
}

/* Brands Section */
.brands-section {
  padding: 100px 0;
  background: #fff;
  overflow: hidden;
}

.brands-header-container {
  max-width: 1300px !important;
  margin: 0 auto;
  width: 100%;
}

.brands-rail-container {
  margin-top: 50px;
  padding: 50px 0;
}

.brands-rail {
  display: flex;
  gap: 80px;
  animation: scrollRail 45s linear infinite;
  width: max-content;
  align-items: center;
  display: flex;
}

.brands-rail.no-animation {
  animation: none;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
}

@keyframes scrollRail {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.brand-item {
  width: 140px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s;
}

.brand-item:hover {
  filter: grayscale(0) opacity(1);
  transform: scale(1.1);
}

.brand-item img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

</style>
