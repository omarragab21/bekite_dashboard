<template>
  <div class="website-layout" :class="currentLang === 'ar' ? 'lang-ar' : 'lang-en'" :dir="currentLang === 'ar' ? 'rtl' : 'ltr'">
    <header class="fixed-header">
      <!-- Top Bar -->
    <div class="top-bar" v-if="freeDeliveryThreshold || latestCoupon">
      <div class="container top-bar-container">
        <div class="top-bar-content">
          <!-- Welcome Message -->
          <div class="top-bar-item welcome-message desktop-only" v-if="freeDeliveryThreshold">
            <span class="delivery-promo">
              <svg class="icon-3d" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="3" width="15" height="13" rx="2" ry="2"/>
                <path d="M16 8h4l3 3v5h-7V8z"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
              {{ $t('free_delivery_over') }} {{ freeDeliveryThreshold }} {{ $t('currency') }}
            </span>
          </div>

          <!-- Dynamic Coupon if exists -->
          <div class="top-bar-divider" v-if="freeDeliveryThreshold && latestCoupon"></div>
          
          <div class="top-bar-item coupon-info" v-if="latestCoupon">
            <span class="sparkle">✨</span>
            <span class="use-code-text">{{ $t('use_code') }}</span>
            <span class="coupon-code">{{ latestCoupon.code }}</span>
            <span class="discount-label">
              {{ latestCoupon.type === 'percentage' ? parseInt(latestCoupon.value) + '%' : $t('currency') + ' ' + latestCoupon.value }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="navbar" :class="{ 'navbar-scrolled': isScrolled }">
      <div class="container nav-container">
        <!-- Logo (Right in RTL) -->
        <router-link to="/" class="logo">
          <div class="logo-icon" v-if="siteLogo">
            <img :src="siteLogo" :alt="siteName" class="site-logo-img">
          </div>
        </router-link>

        <!-- Main Links (Center in Desktop) -->
        <div class="nav-links desktop-only">
          <router-link to="/" active-class="active" exact-active-class="active">{{ $t('nav.home') }}</router-link>
          <router-link to="/products" active-class="active" exact-active-class="active">{{ $t('nav.products') }}</router-link>
          <router-link to="/offers" active-class="active" exact-active-class="active">{{ $t('nav.offers') }}</router-link>
          <router-link
            v-for="topic in navTopics"
            :key="topic.id"
            :to="`/page/${topic.id}`"
            active-class="active"
          >{{ localized(topic, 'title') }}</router-link>
          <router-link to="/contact" active-class="active" exact-active-class="active">{{ $t('nav.contact') }}</router-link>

        </div>

        <!-- Desktop specific Icons (Left in RTL) -->
        <div class="nav-icons desktop-only">
          <button class="icon-btn search-btn" @click="showSearchModal = true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
          <router-link to="/profile?tab=wishlist" class="icon-btn wishlist-btn" :class="{ 'has-items': wishlistCount > 0 }">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span class="badge" v-if="wishlistCount > 0">{{ wishlistCount }}</span>
          </router-link>
          
          <router-link to="/cart" class="icon-btn cart-btn" :class="{ 'has-items': cartCount > 0 }">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart w-5 h-5"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
            <span class="badge" v-if="cartCount > 0">{{ cartCount }}</span>
          </router-link>
          
          <div class="user-dropdown-container" @mouseenter="showUserDropdown = true" @mouseleave="showUserDropdown = false">
            <button class="icon-btn user-btn" :title="isLoggedIn ? $t('profile.title') : $t('nav.login')" @click="handleUserClick">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
            <transition name="fade">
              <div v-if="isLoggedIn && showUserDropdown" class="user-dropdown-menu">
                <div class="user-dropdown-header">
                  <p class="user-name">{{ authState.user?.name || authState.user?.full_name || $t('auth.customer') }}</p>
                  <p class="user-phone" dir="ltr">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    {{ currentUser?.phone || '' }}
                  </p>
                </div>
                <div class="user-dropdown-body">
                  <router-link to="/profile" class="user-dropdown-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    {{ $t('profile.title') }}
                  </router-link>
                  <router-link to="/profile?tab=wishlist" class="user-dropdown-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    {{ $t('profile.wishlist') }}
                  </router-link>
                  <button class="user-dropdown-item logout" @click="handleLogout">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    {{ $t('profile.logout') }}
                  </button>
                </div>
              </div>
            </transition>
          </div>
          <button class="icon-btn globe-btn" @click="toggleLanguage">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe w-5 h-5"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
          </button>
        </div>

        <!-- Mobile Side Actions (Left in RTL Mobile) -->
        <div class="nav-actions-left mobile-only">
          <!-- Cart & Search Icons -->
          <div class="nav-icons mobile-icons">
            <button class="icon-btn search-btn" @click="showSearchModal = true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
            <router-link to="/cart" class="icon-btn cart-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart w-6 h-6"><circle cx="8" cy="21" r="1"></circle><circle cx="19" cy="21" r="1"></circle><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path></svg>
              <span class="badge" v-if="cartCount > 0">{{ cartCount }}</span>
            </router-link>
          </div>

          <!-- Burger/Close Menu -->
          <button class="icon-btn menu-btn" @click="isMobileMenuOpen = !isMobileMenuOpen">
            <svg v-if="!isMobileMenuOpen" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <svg v-else width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Mobile Menu Overlay -->
        <transition name="slide-down">
          <div v-if="isMobileMenuOpen" class="mobile-menu-overlay">
            <div class="mobile-menu-inner">
              <div class="mobile-menu-links">
                <router-link to="/" class="mobile-link" :class="{ 'active': $route.path === '/' }" @click="isMobileMenuOpen = false">{{ $t('nav.home') }}</router-link>
                <router-link to="/products" class="mobile-link" :class="{ 'active': $route.path === '/products' }" @click="isMobileMenuOpen = false">{{ $t('nav.products') }}</router-link>
                <router-link to="/offers" class="mobile-link" :class="{ 'active': $route.path === '/offers' }" @click="isMobileMenuOpen = false">{{ $t('nav.offers') }}</router-link>
                <router-link
                  v-for="topic in navTopics"
                  :key="topic.id"
                  :to="`/page/${topic.id}`"
                  class="mobile-link"
                  :class="{ 'active': $route.path === `/page/${topic.id}` }"
                  @click="isMobileMenuOpen = false"
                >{{ localized(topic, 'title') }}</router-link>
                <router-link to="/contact" class="mobile-link" :class="{ 'active': $route.path === '/contact' }" @click="isMobileMenuOpen = false">{{ $t('nav.contact') }}</router-link>

              </div>
              
              <div class="mobile-menu-separator"></div>

              <div class="mobile-menu-footer">
                <div class="footer-item" @click="toggleLanguage">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
                  <span>{{ currentLang === 'ar' ? 'English' : 'العربية' }}</span>
                </div>
                <router-link v-if="isLoggedIn" to="/profile" class="footer-item" @click="isMobileMenuOpen = false">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span>{{ $t('profile.title') }}</span>
                </router-link>
                <button v-if="isLoggedIn" class="footer-item" @click="handleLogout(); isMobileMenuOpen = false">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span>{{ $t('profile.logout') }}</span>
                </button>
                <button v-else class="footer-item" @click="handleUserClick(); isMobileMenuOpen = false">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span>{{ $t('nav.login') }}</span>
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </nav>
    </header>

    <main class="main-content">
      <router-view />
    </main>

    <!-- Global Components -->
    <add-to-cart-modal />
    <auth-modal ref="authModal" :logo="siteLogo" :site-name="siteName" />

    <!-- Search Modal -->
    <div class="search-modal-overlay" v-if="showSearchModal" @click.self="showSearchModal = false">
      <div class="search-modal-content">
        <div class="search-header">
          <h2>{{ $t('search.title') }}</h2>
          <button class="search-close-btn" @click="showSearchModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="search-input-wrapper">
          <input 
            type="text" 
            v-model="searchQuery" 
            :placeholder="$t('search.placeholder')"
            @keyup.enter="performSearch"
            ref="searchInput"
          />
          <button class="search-submit-btn" @click="performSearch">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </div>
        <div class="search-results" v-if="searchResults.length > 0">
          <div 
            v-for="product in searchResults" 
            :key="product.id" 
            class="search-result-item"
            @click="goToProduct(product.id)"
          >
            <div class="search-result-image" v-if="product.image">
              <img :src="product.image" :alt="product.name" />
            </div>
            <div class="search-result-info">
              <h4>{{ localized(product, 'name') }}</h4>
              <p class="search-result-price">{{ formatPrice(product.price * (1 - (product.discount/100 || 0))) }}</p>
            </div>
          </div>
        </div>
        <div class="search-no-results" v-if="searchQuery && searchResults.length === 0 && !searching">
          <p>{{ $t('search.no_results') }}</p>
        </div>
        <div class="search-loading" v-if="searching">
          <div class="spinner"></div>
        </div>
      </div>
    </div>

    <!-- Floating Action Buttons -->
    <a v-if="socials.whatsapp" :href="`https://wa.me/${socials.whatsapp}`" target="_blank" class="whatsapp-float">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
         <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    </a>

    <!-- Footer -->
    <footer class="main-footer">
      <div class="container">
        <div class="footer-grid">
          <!-- Col 1: Brand Info -->
          <div class="footer-col brand-info">
            <router-link to="/" class="footer-logo logo">
              <div class="logo-icon" v-if="footerLogo || siteLogo">
                <img :src="footerLogo || siteLogo" :alt="siteName" class="site-logo-img">
              </div>
            </router-link>
            <p v-if="siteDescription" class="footer-desc">{{ localizedValue(siteDescription) }}</p>
            
            <div class="social-section">
              <p class="social-title">{{ $t('footer.follow_us') }}</p>
              <div class="social-links">
                <a v-if="socials.whatsapp" :href="socials.whatsapp" target="_blank"><i class="fab fa-whatsapp"></i></a>
                <a v-if="socials.facebook" :href="socials.facebook" target="_blank"><i class="fab fa-facebook-f"></i></a>
                <a v-if="socials.instagram" :href="socials.instagram" target="_blank"><i class="fab fa-instagram"></i></a>
                <a v-if="socials.twitter || socials.x" :href="socials.twitter || socials.x" target="_blank"><i class="fab fa-x-twitter"></i></a>
                <a v-if="socials.linkedin" :href="socials.linkedin" target="_blank"><i class="fab fa-linkedin-in"></i></a>
                <a v-if="socials.youtube" :href="socials.youtube" target="_blank"><i class="fab fa-youtube"></i></a>
                <a v-if="socials.snapchat" :href="socials.snapchat" target="_blank"><i class="fab fa-snapchat"></i></a>
                <a v-if="socials.tiktok" :href="socials.tiktok" target="_blank"><i class="fab fa-tiktok"></i></a>
              </div>
            </div>
          </div>

          <!-- Col 2: Shop -->
          <div class="footer-col">
            <h4 class="footer-title">{{ $t('footer.shop') }}</h4>
            <ul class="footer-links">
              <li v-for="cat in categories.slice(0, 5)" :key="cat.id">
                <router-link :to="`/products?category_id=${cat.id}`">{{ localized(cat, 'name') }}</router-link>
              </li>
              <li><router-link to="/products">{{ $t('nav.products') }}</router-link></li>
              <li><router-link to="/offers">{{ $t('nav.offers') }}</router-link></li>
            </ul>
          </div>

          <!-- Col 3: Customer Service -->
          <div class="footer-col">
            <h4 class="footer-title">{{ $t('footer.customer_service') }}</h4>
            <ul class="footer-links">
              <li><router-link to="/contact">{{ $t('nav.contact') }}</router-link></li>
              <li v-for="topic in topicsByGroup.customer_service" :key="topic.id">
                <router-link :to="`/page/${topic.id}`">{{ localized(topic, 'title') }}</router-link>
              </li>
              <li v-for="topic in topicsByGroup.info" :key="topic.id">
                <router-link :to="`/page/${topic.id}`">{{ localized(topic, 'title') }}</router-link>
              </li>
            </ul>
          </div>

          <!-- Col 4: Contact Info -->
          <div class="footer-col contact-info">
            <h4 class="footer-title">{{ $t('footer.contact_us') }}</h4>
            <ul class="contact-list">
              <li v-if="siteAddress">
                <div class="contact-icon-wrapper"><i class="fas fa-map-marker-alt"></i></div>
                <span>{{ localizedValue(siteAddress) }}</span>
              </li>
              <li v-if="sitePhone">
                <div class="contact-icon-wrapper"><i class="fas fa-phone-alt"></i></div>
                <a :href="'tel:' + sitePhone" dir="ltr">{{ sitePhone }}</a>
              </li>
              <li v-if="siteEmail">
                <div class="contact-icon-wrapper"><i class="fas fa-envelope"></i></div>
                <a :href="'mailto:' + siteEmail">{{ siteEmail }}</a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="footer-bottom">
          <p class="copyright">{{ $t('footer.rights_reserved') }} &copy; {{ new Date().getFullYear() }} <template v-if="siteName">{{ siteName }}</template></p>
          <div class="developer-tag">
            {{ $t('footer.developed_by') }} <a href="https://be-kite.com/" target="_blank" class="be-kite">Be Kite</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import api from '../config/axios';
import { cartState } from '../store/cart';
import { authState, authActions } from '../store/auth';
import AddToCartModal from './AddToCartModal.vue';
import AuthModal from './AuthModal.vue';
import { useLocalized } from '../composables/useLocalized';

const { locale } = useI18n();
const { localized, localizedValue } = useLocalized();
const isScrolled = ref(false);
const categories = ref([]);
const latestCoupon = ref(null);
const freeDeliveryThreshold = ref(null);
const siteName = ref('');
const siteLogo = ref('');
const footerLogo = ref('');
const siteDescription = ref('');
const sitePhone = ref('');
const siteEmail = ref('');
const siteAddress = ref('');
const socials = reactive({
  facebook: '',
  instagram: '',
  twitter: '',
  x: '',
  linkedin: '',
  youtube: '',
  snapchat: '',
  tiktok: '',
  whatsapp: ''
});

const isMobileMenuOpen = ref(false);
const authModal = ref(null);
const showUserDropdown = ref(false);
const showSearchModal = ref(false);
const searchQuery = ref('');
const searchResults = ref([]);
const searching = ref(false);
const searchInput = ref(null);

const isLoggedIn = computed(() => !!authState.token);
const currentUser = computed(() => authState.user);

const cartCount = computed(() => cartState.count);
const wishlistCount = computed(() => cartState.wishlistCount);

const currentLang = computed(() => locale.value);
const router = useRouter();

const openAuthModal = () => {
  if (!isLoggedIn.value && authModal.value) {
    authModal.value.openModal();
  }
};

// Make openAuthModal globally accessible for wishlist and cart operations
window.openAuthModal = openAuthModal;

const handleUserClick = () => {
  if (isLoggedIn.value) {
    router.push('/profile');
    showUserDropdown.value = !showUserDropdown.value;
  } else {
    openAuthModal();
  }
};

const handleLogout = async () => {
  await authActions.logout();
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

const topics = ref([]);

const navTopics = computed(() =>
  topics.value.filter(t => t.status === 'published' && t.show_in_nav)
);

const topicsByGroup = computed(() => {
  const groups = {
    customer_service: [],
    info: []
  };
  topics.value.forEach(t => {
    if (t.status !== 'published') return;
    if (t.category === 'سياسات' || t.category === 'طرق الدفع') {
      groups.customer_service.push(t);
    } else {
      groups.info.push(t);
    }
  });
  return groups;
});

const fetchData = async () => {
  try {
    const [settingsRes, couponsRes, topicsRes] = await Promise.all([
      api.get('/frontend/settings'),
      api.get('/frontend/coupons'),
      api.get('/frontend/topics?status=published')
    ]);
    
    // Get settings
    const settings = settingsRes.data.data || settingsRes.data;
    if (Array.isArray(settings)) {
      const getVal = (key) => settings.find(s => s.key === key)?.value;
      
      freeDeliveryThreshold.value = getVal('free_delivery_threshold') || getVal('delivery_range');
      siteName.value = getVal('site_name');
      if (siteName.value) {
        document.title = siteName.value;
      }
      siteDescription.value = getVal('site_description');
      sitePhone.value = getVal('support_phone') || getVal('phone_number');
      siteEmail.value = getVal('email');
      siteAddress.value = {
        ar: getVal('address_ar') || getVal('address'),
        en: getVal('address_en') || getVal('address')
      };

      socials.facebook = getVal('facebook');
      socials.instagram = getVal('instagram');
      socials.twitter = getVal('twitter') || getVal('x_twitter') || getVal('x_link');
      socials.x = getVal('x_twitter') || getVal('twitter') || getVal('x_link');
      socials.linkedin = getVal('linkedin');
      socials.youtube = getVal('youtube');
      socials.snapchat = getVal('snapchat');
      socials.tiktok = getVal('tiktok');
      socials.whatsapp = getVal('whatsapp');

      const faviconVal = getVal('favicon');
      const logoVal = getVal('logo');
      const footerLogoVal = getVal('footer_logo');
      if (logoVal) {
        siteLogo.value = logoVal.startsWith('http') 
          ? logoVal 
          : `${api.defaults.baseURL.replace('/api', '')}/storage/${logoVal}`;
      }

      if (footerLogoVal) {
        footerLogo.value = footerLogoVal.startsWith('http') 
          ? footerLogoVal 
          : `${api.defaults.baseURL.replace('/api', '')}/storage/${footerLogoVal}`;
      }

      // Update Favicon (Prefer favicon setting, fallback to logo)
      const finalFavicon = faviconVal 
        ? (faviconVal.startsWith('http') ? faviconVal : `${api.defaults.baseURL.replace('/api', '')}/storage/${faviconVal}`)
        : siteLogo.value;

      if (finalFavicon) {
        const faviconLink = document.querySelector("link[rel~='icon']");
        if (faviconLink) {
          faviconLink.href = finalFavicon;
        }
      }
    }

    // Get latest active coupon
    const coupons = couponsRes.data.data || couponsRes.data;
    if (Array.isArray(coupons) && coupons.length > 0) {
      latestCoupon.value = coupons.find(c => c.is_public && c.is_active) || coupons[0];
    }

    // Topics
    topics.value = topicsRes.data.data || topicsRes.data || [];
  } catch (error) {
    console.error('Failed to fetch top bar data', error);
  }
};

const fetchUser = () => authActions.init();

const fetchCategories = async () => {
  try {
    const res = await api.get('/frontend/categories');
    categories.value = res.data.data || res.data;
  } catch (err) {
    console.error('Failed to fetch categories', err);
  }
};

const toggleLanguage = () => {
  const newLang = locale.value === 'ar' ? 'en' : 'ar';
  locale.value = newLang;
  localStorage.setItem('lang', newLang);
  document.documentElement.lang = newLang;
  document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  location.reload();
};

const performSearch = async () => {
  if (!searchQuery.value.trim()) return;
  
  searching.value = true;
  try {
    const res = await api.get('/frontend/products', {
      params: { search: searchQuery.value }
    });
    searchResults.value = res.data.data || res.data || [];
  } catch (err) {
    console.error('Search failed:', err);
    searchResults.value = [];
  } finally {
    searching.value = false;
  }
};

const goToProduct = (productId) => {
  showSearchModal.value = false;
  router.push(`/product/${productId}`);
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('ar-JO', {
    style: 'currency',
    currency: 'JOD',
    minimumFractionDigits: 2
  }).format(price);
};

// Watch for search modal open to focus input
watch(showSearchModal, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      searchInput.value?.focus();
    }, 100);
  } else {
    searchQuery.value = '';
    searchResults.value = [];
  }
});

// Auto-search with debounce
let searchTimeout;
watch(searchQuery, (newValue) => {
  clearTimeout(searchTimeout);
  if (newValue.trim()) {
    searchTimeout = setTimeout(() => {
      performSearch();
    }, 300);
  } else {
    searchResults.value = [];
  }
});

onMounted(() => {
  fetchData();
  fetchCategories();
  authActions.init();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap');

.website-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  /* direction: rtl; */ /* Remove hardcoded RTL */
  font-family: 'Almarai', ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  font-weight: 100;
  overflow-x: hidden; /* Prevent site-wide horizontal scroll */
}

.website-layout.lang-en {
  direction: ltr;
  text-align: left;
}

.website-layout.lang-ar {
  direction: rtl;
  text-align: right;
}

.website-layout.lang-en .main-content {
  direction: ltr;
  text-align: left;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

@media (max-width: 1024px) {
  .main-content {
    padding-top: 100px;
  }
}

.delivery-promo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
}

.icon-3d {
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
  color: #fbbf24; /* Golden yellow */
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

/* Top Bar */
.top-bar {
  background: #873260;
  color: #fff;
  padding: 8px 10px !important;
  font-size: 11px !important;
  font-weight: 400 !important;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  text-align: center;
}

.top-bar-container {
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 100% !important;
}

.top-bar-content {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  gap: 15px !important;
  width: auto !important;
}

.delivery-icon ,.sparkle{
  display: flex;
  justify-content: center;
  align-items: center;
}

.top-bar-item {
  display: flex;
  align-items: center;
  gap: 6px !important;
  font-size: 0.88rem;
  white-space: nowrap;
}

.top-bar-divider {
  width: 1px;
  height: 12px;
  background: rgba(255,255,255,0.2);
  margin: 0 5px;
}

.coupon-code {
  color: #fdb913;
  letter-spacing: 1px;
  font-weight: 700;
}

.text-bold {
  font-weight: 700;
}

.sparkle {
  font-size: 16px;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding-left: 5% !important;
  padding-right: 5% !important;
}

/* Fixed Header */
.fixed-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}



/* Navbar */
.navbar {
  background: #fff;
  border-bottom: 1px solid #f3f4f6;
  padding: 10px 0;
  position: relative;
  z-index: 1000;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 5% !important;
  padding-right: 5% !important;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.logo-icon {
  height: 60px;
  width: auto;
  min-width: 60px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: all 0.3s ease;
}

.navbar-scrolled .logo-icon {
  height: 48px;
  min-width: 48px;
}

.site-logo-img {
  height: 100%;
  width: auto;
  max-width: 200px;
  object-fit: contain;
}

@media (max-width: 768px) {
  .logo-icon {
    height: 40px;
    width: auto;
    min-width: unset;
  }
  .site-logo-img {
    max-width: 150px;
  }
  .nav-container {
    padding: 0 15px !important;
  }
}

.nav-links {
  display: flex;
  gap: 25px;
  align-items: center;
}

.nav-links a {
  text-decoration: none;
  color: #333;
  font-weight: 400;
  font-size: 15px;
  transition: all 0.2s;
  position: relative;
  padding: 5px 0;
}

.nav-links a:hover, .nav-links a.active {
  color: #873260;
}

.nav-links a.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  right: 0;
  width: 100%;
  height: 2.5px;
  background: #873260;
  border-radius: 2px;
}

/* Icons */
.nav-icons {
  display: flex;
  gap: 5px;
  align-items: center;
}

.icon-btn {
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  text-decoration: none;
}

.cart-btn .badge {
  position: absolute;
  top: 2px;
  right: 2px;
  background: #ef4444;
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  min-width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #fff;
}

.icon-btn:hover {
  background: #f9fafb;
  color: #873260;
}

/* User Dropdown */
.user-dropdown-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 240px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  margin-top: 10px;
  z-index: 1010;
  padding: 10px;
  border: 1px solid #f3f4f6;
}

.lang-ar .user-dropdown-menu {
  direction: rtl;
}

.lang-en .user-dropdown-menu {
  direction: ltr;
}

.user-dropdown-menu::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 12px;
  height: 12px;
  background: #fff;
  border-left: 1px solid #f3f4f6;
  border-top: 1px solid #f3f4f6;
}

.user-dropdown-header {
  padding: 10px;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 5px;
}

.lang-ar .user-dropdown-header {
  text-align: right;
}

.lang-en .user-dropdown-header {
  text-align: left;
}

.user-name {
  font-weight: 800;
  font-size: 16px;
  color: #111827;
  margin: 0 0 5px;
}

.user-phone {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 5px;
  justify-content: flex-end;
}

.user-dropdown-body {
  display: flex;
  flex-direction: column;
}

.user-dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 8px;
  color: #374151;
  text-decoration: none;
  font-size: 15px;
  font-weight: 700;
  transition: background 0.2s;
  background: none;
  border: none;
  cursor: pointer;
}

.lang-ar .user-dropdown-item {
  text-align: right;
}

.lang-en .user-dropdown-item {
  text-align: left;
}

.user-dropdown-item:hover {
  background: #f9fafb;
}

.user-dropdown-item svg {
  color: #6b7280;
}

.user-dropdown-item.logout {
  color: #dc2626;
  margin-top: 5px;
}

.user-dropdown-item.logout:hover {
  background: #fef2f2;
}

.user-dropdown-item.logout svg {
  color: #dc2626;
}

.icon-btn .badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: #ef4444;
  color: #fff;
  font-size: 0.65rem;
  font-weight: 800;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
  z-index: 2;
}

/* Search Modal */
.search-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 100px;
  z-index: 2000;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.search-modal-content {
  background: #fff;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 70vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.search-header h2 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #111827;
  margin: 0;
}

.search-close-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: #f3f4f6;
  cursor: pointer;
  transition: 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.search-close-btn:hover {
  background: #e5e7eb;
  color: #111827;
}

.search-input-wrapper {
  display: flex;
  gap: 0.5rem;
  padding: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.search-input-wrapper input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  transition: 0.2s;
}

.search-input-wrapper input:focus {
  outline: none;
  border-color: #873260;
  box-shadow: 0 0 0 3px rgba(135, 50, 96, 0.1);
}

.search-submit-btn {
  width: 48px;
  border: none;
  border-radius: 10px;
  background: #873260;
  color: #fff;
  cursor: pointer;
  transition: 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-submit-btn:hover {
  background: #4a1936;
}

.search-results {
  padding: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.search-result-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
  border: 1px solid transparent;
}

.search-result-item:hover {
  background: #f9fafb;
  border-color: #f3f4f6;
}

.search-result-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  background: #f3f4f6;
  flex-shrink: 0;
}

.search-result-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.search-result-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.search-result-info h4 {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
}

.search-result-price {
  font-size: 0.95rem;
  font-weight: 800;
  color: #873260;
  margin: 0;
}

.search-no-results {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
}

.search-loading {
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top-color: #873260;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.mobile-menu-separator{
  padding-top: 10px;
}
/* WhatsApp */
.whatsapp-float {
  position: fixed;
  bottom: 100px; /* Raised a bit */
  right: 25px;
  background: #25d366;
  color: #fff;
  width: 55px;
  height: 55px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 30px rgba(37, 211, 102, 0.4);
  z-index: 2000;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@media (max-width: 768px) {
  .whatsapp-float {
    width: 48px;
    height: 48px;
    bottom: 20px;
    right: 15px;
  }
  .whatsapp-float svg {
    width: 20px;
    height: 20px;
  }
}

html[dir="rtl"] .whatsapp-float {
  right: auto;
  left: 30px;
}

.whatsapp-float:hover {
  transform: scale(1.1) rotate(5deg);
}

.content {
  flex: 1;
}

/* Main Footer Styles */
.main-footer {
  background: #873260;
  color: #fff;
  padding: 100px 0 40px;
  margin-top: auto;
}

.lang-ar .main-footer {
  direction: rtl;
  text-align: right;
}

.lang-en .main-footer {
  direction: ltr;
  text-align: left;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1.5fr;
  gap: 80px;
  margin-bottom: 80px;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}

.logo-text {
  font-size: 28px;
  font-weight: 800;
}

.footer-desc {
  color: rgba(255,255,255,0.7);
  line-height: 1.6;
  margin-bottom: 30px;
  font-size: 15px;
}

.footer-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 30px;
  position: relative;
  padding-bottom: 10px;
}

.footer-title::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  width: 40px;
  height: 2px;
  background: #fdb913;
}

.lang-en .footer-title::after {
  right: auto;
  left: 0;
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 15px;
}

.footer-links a {
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  transition: all 0.3s;
  font-size: 15px;
}

.footer-links a:hover {
  color: #fdb913;
  padding-right: 8px;
}

.lang-en .footer-links a:hover {
  padding-right: 0;
  padding-left: 8px;
}

.contact-list {
  list-style: none;
  padding: 0;
}

.contact-list li {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  color: rgba(255,255,255,0.8);
  line-height: 1.5;
  font-size: 14px;
}

.lang-en .contact-list li,
.lang-ar .contact-list li {
  flex-direction: row;
  justify-content: flex-start;
}

.lang-en .footer-col,
.lang-en .footer-desc,
.lang-en .footer-links,
.lang-en .contact-list,
.lang-en .social-section,
.lang-en .footer-bottom {
  text-align: left;
}

.lang-en .social-links {
  justify-content: flex-start;
}

.contact-list i {
  color: #fdb913;
  font-size: 18px;
  margin-top: 3px;
}

.social-links {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  max-width: 100%;
}

.social-links a {
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #fff;
  text-decoration: none;
  transition: all 0.3s;
}

.social-links a:hover {
  background: #fdb913;
  transform: translateY(-5px);
}

.footer-bottom {
  padding-top: 40px;
  border-top: 1px solid rgba(255,255,255,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(255,255,255,0.7);
  font-size: 14px;
}

.be-kite {
  color: #fdb913;
  font-weight: 700;
  text-decoration: none;
  transition: opacity 0.3s;
}

.be-kite:hover {
  opacity: 0.8;
}
/* Responsive Adjustments */
.mobile-only {
  display: none !important;
}

@media (max-width: 768px) {
  .desktop-only {
    display: none !important;
  }
  .mobile-only {
    display: flex !important;
  }

  .nav-container {
    justify-content: space-between !important;
    padding: 0 15px !important;
  }

  .logo {
    order: 0;
    gap: 8px;
  }

  .logo-text {
    font-size: 18px !important;
  }

  .logo-icon {
    width: auto;
    height: 40px;
  }

  .mobile-order-2 {
    order: 2 !important;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .nav-icons {
    gap: 5px;
  }

  /* Mobile Top Bar */
  .top-bar-content {
    display: flex !important;
    flex-wrap: nowrap !important;
    overflow-x: auto;
    gap: 10px !important;
    justify-content: flex-start !important; /* Starts from right in RTL */
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .top-bar-content::-webkit-scrollbar { display: none; }

  .top-bar-item {
    font-size: 0.65rem !important;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .top-bar-divider {
    display: block;
    height: 12px;
    width: 1px;
    background: rgba(255,255,255,0.2);
  }

  .coupon-info {
    display: flex; 
  }
  
  .logo-text {
    font-size: 16px !important;
  }


  /* Mobile Menu Styles */
  .mobile-menu-overlay {
    position: fixed;
    top: 100px; /* Adjusted to be right below the navbar */
    left: 0;
    width: 100%;
    height: calc(100vh - 100px);
    background: #fff;
    z-index: 9999999;
    padding: 10px 15px;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .mobile-menu-inner {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .mobile-menu-links {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 20px;
  }

  .mobile-link {
    text-decoration: none;
    color: #111827;
    font-size: 1.2rem;
    font-weight: 700;
    padding: 15px 20px;
    border-radius: 12px;
    transition: all 0.2s;
    border-bottom: 1px solid #f9fafb;
  }

  .mobile-link.active {
    background: #873260;
    color: #fff;
  }

  .mobile-menu-footer {
    margin-top: 30px;
    padding: 20px 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-top: 1px solid #f3f4f6;
  }

  .footer-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: #111827;
    font-weight: 700;
    font-size: 0.85rem;
    cursor: pointer;
    background: none;
    border: none;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: 40px;
    margin-bottom: 40px;
  }

  .footer-col.brand-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .footer-title::after {
    right: 0;
    transform: none;
  }

  .social-links {
    justify-content: flex-start;
    gap: 12px;
    width: 100%;
  }

  .lang-en .social-links {
    justify-content: flex-start;
  }

  .social-links a {
    width: 38px;
    height: 38px;
    flex: 0 0 38px;
  }

  .contact-list li {
    justify-content: flex-start;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  /* Transitions */
  .slide-down-enter-active, .slide-down-leave-active {
    transition: all 0.3s ease-out;
  }
  .slide-down-enter-from, .slide-down-leave-to {
    transform: translateY(-20px);
    opacity: 0;
  }
}

.social-section {
  margin-top: 10px;
}

.social-title {
  font-size: 14px;
  color: rgba(255,255,255,0.6);
  margin-bottom: 15px;
  font-weight: 600;
}

.contact-icon-wrapper {
  width: 32px;
  height: 32px;
  background: rgba(255,255,255,0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.contact-icon-wrapper i {
  margin-top: 0 !important;
  font-size: 14px !important;
}

.contact-list a {
  color: inherit;
  text-decoration: none;
}

</style>
