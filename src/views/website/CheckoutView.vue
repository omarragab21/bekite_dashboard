<template>
  <div class="checkout-page">
    <div class="container container-checkout">
      <!-- Checkout Progress Bar -->
      <div class="checkout-progress-wrapper" v-if="currentStep < 5">
        <div class="checkout-progress">
          <div 
            v-for="step in progressSteps" 
            :key="step.id" 
            class="step-item"
            :class="{ 
              active: currentStep === step.id, 
              completed: currentStep > step.id 
            }"
          >
            <div class="step-circle">
              <i v-if="currentStep > step.id" class="fas fa-check"></i>
              <span v-else>{{ step.id }}</span>
            </div>
            <span class="step-label">{{ step.label }}</span>
          </div>
          <div class="progress-line"></div>
        </div>
      </div>

      <div class="checkout-layout" :class="{ 'confirmation-layout': currentStep === 5 }">
        <!-- Main Content (Steps) -->
        <div class="main-checkout-content">
          
          <!-- Step 2: Shipping Address -->
          <div v-if="currentStep === 2" class="step-container fadeIn">
            <div class="checkout-step-header">
              <div class="header-main">
                <h2 class="header-title">{{ t('checkout.shipping_address') }}</h2>
                <p class="header-subtitle">{{ t('checkout.select_delivery_address') }}</p>
              </div>
              <div class="header-icon-box">
                <i class="fas fa-map-marker-alt"></i>
              </div>
            </div>

            <!-- Address Tabs -->
            <div class="address-tabs">
              <button 
                class="address-tab" 
                :class="{ active: addressTab === 'saved' }"
                @click="addressTab = 'saved'"
              >
                <i class="fas fa-list-ul"></i>
                <span>{{ t('checkout.saved_addresses') }}</span>
              </button>
              <button 
                class="address-tab" 
                :class="{ active: addressTab === 'other' }"
                @click="addressTab = 'other'; selectedAddressId = null; resetCustomerInfo()"
              >
                <i class="fas fa-user-plus"></i>
                <span>{{ t('checkout.other_recipient') }}</span>
              </button>
              <div class="tab-indicator" :class="addressTab"></div>
            </div>

            <!-- Saved Addresses Content -->
            <div v-if="addressTab === 'saved'" class="tab-content fadeIn">
              <!-- Address List -->
              <div v-if="!showAddForm" class="saved-addresses-list">
                <div 
                  v-for="addr in savedAddresses" 
                  :key="addr.id" 
                  class="address-card-new"
                  :class="{ selected: selectedAddressId === addr.id }"
                  @click="selectAddress(addr)"
                >
                  <div class="addr-type-icon">
                    <i :class="getAddressIcon(addr.name)"></i>
                  </div>
                  <div class="addr-details-box">
                    <div class="addr-top">
                      <h4 class="addr-name">{{ addr.name }}</h4>
                      <span v-if="addr.is_default" class="default-badge">{{ t('checkout.default') }}</span>
                    </div>
                    <div class="addr-owner">{{ addr.full_name }}</div>
                    <div class="addr-full-text">{{ addr.city }}، {{ addr.address }}</div>
                    <div class="addr-phone">{{ addr.phone }}</div>
                  </div>
                  <div class="addr-selection">
                    <div class="radio-outer">
                      <div class="radio-inner"></div>
                    </div>
                  </div>
                </div>

                <!-- Add New Selection (Dashed) -->
                <button class="add-new-addr-dashed" @click="showAddForm = true">
                  <i class="fas fa-plus"></i>
                  <span>{{ t('checkout.add_new_address') }}</span>
                </button>
              </div>

              <!-- Add New Address Form (The one from Figma) -->
              <div v-else class="add-address-form-v3 fadeIn">
                <div class="form-v3-header">
                  <h3 class="form-v3-title">{{ t('checkout.add_new_address') }}</h3>
                  <button class="close-v3-btn" @click="showAddForm = false">
                    <i class="fas fa-times"></i>
                  </button>
                </div>

                <div class="checkout-form-v2">
                  <div class="input-field-box">
                    <label>{{ t('checkout.address_label') }}</label>
                    <input type="text" v-model="newAddrForm.name" :placeholder="t('checkout.address_label_placeholder')" />
                  </div>

                  <div class="input-field-box">
                    <label>{{ t('auth.name') }} <span class="required">*</span></label>
                    <div class="input-relative">
                      <input type="text" v-model="newAddrForm.full_name" :placeholder="t('auth.name')" />
                      <i class="far fa-user input-icon"></i>
                    </div>
                  </div>

                  <div class="form-row-new dual">
                    <div class="input-field-box">
                      <label>الدولة <span class="required">*</span></label>
                      <div class="input-relative">
                        <select v-model="newAddrForm.country_id" @change="fetchCities(newAddrForm.country_id)">
                          <option value="">اختر الدولة</option>
                          <option v-for="country in countries" :key="country.id" :value="country.id">
                            {{ country.name }}
                          </option>
                        </select>
                        <i class="fas fa-chevron-down input-icon"></i>
                      </div>
                    </div>
                    <div class="input-field-box">
                      <label>{{ t('checkout.city') }} <span class="required">*</span></label>
                      <div class="input-relative">
                        <select v-model="newAddrForm.city_id">
                          <option value="">اختر المدينة</option>
                          <option v-for="city in cities" :key="city.id" :value="city.id">
                            {{ city.name }}
                          </option>
                        </select>
                        <i class="fas fa-chevron-down input-icon"></i>
                      </div>
                    </div>
                  </div>

                  <div class="input-field-box">
                    <label>{{ t('auth.phone') }} <span class="required">*</span></label>
                    <div class="input-relative">
                      <input type="tel" v-model="newAddrForm.phone" placeholder="0791234567" />
                    </div>
                  </div>

                  <div class="input-field-box">
                    <label>{{ t('checkout.full_address') }} <span class="required">*</span></label>
                    <div class="input-relative">
                      <textarea v-model="newAddrForm.address" :placeholder="t('checkout.address_placeholder')" rows="2"></textarea>
                      <i class="fas fa-home input-icon"></i>
                    </div>
                  </div>

                  <button class="save-addr-v3-btn" @click="handleSaveNewAddress" :disabled="loading">
                    <template v-if="loading">
                      <i class="fas fa-spinner fa-spin"></i> {{ t('common.loading') }}
                    </template>
                    <template v-else>
                      <i class="fas fa-plus"></i> {{ t('checkout.save_address') }}
                    </template>
                  </button>
                </div>
              </div>
            </div>

            <!-- Another Recipient Content -->
            <div v-else class="tab-content fadeIn">
              <div class="another-recipient-info">
                <i class="fas fa-info-circle"></i>
                <span>{{ t('checkout.other_recipient_hint') }}</span>
              </div>
              
              <div class="checkout-form-v2">
                <div class="form-row-new">
                  <div class="input-field-box">
                    <label>{{ t('checkout.recipient_name') }} <span class="required">*</span></label>
                    <div class="input-relative">
                      <input type="text" v-model="customerInfo.name" :placeholder="t('checkout.recipient_name_placeholder')" />
                      <i class="far fa-user input-icon"></i>
                    </div>
                  </div>
                </div>

                <div class="form-row-new dual">
                  <div class="input-field-box">
                    <label>{{ t('checkout.recipient_phone') }} <span class="required">*</span></label>
                    <div class="input-relative">
                      <input type="tel" v-model="customerInfo.phone" placeholder="0791234567" />
                      <i class="fas fa-mobile-alt input-icon"></i>
                    </div>
                  </div>
                  <div class="input-field-box">
                    <label>{{ t('checkout.email_optional') }}</label>
                    <div class="input-relative">
                      <input type="email" v-model="customerInfo.email" placeholder="email@example.com" />
                      <i class="far fa-envelope input-icon"></i>
                    </div>
                  </div>
                </div>

                <div class="form-row-new dual">
                  <div class="input-field-box">
                    <label>الدولة <span class="required">*</span></label>
                    <div class="input-relative">
                      <select v-model="customerInfo.country_id" @change="fetchCities(customerInfo.country_id)">
                        <option value="">اختر الدولة</option>
                        <option v-for="country in countries" :key="country.id" :value="country.id">
                          {{ country.name }}
                        </option>
                      </select>
                      <i class="fas fa-globe input-icon"></i>
                    </div>
                  </div>
                  <div class="input-field-box">
                    <label>{{ t('checkout.city') }} <span class="required">*</span></label>
                    <div class="input-relative">
                      <select v-model="customerInfo.city_id">
                        <option value="">اختر المدينة</option>
                        <option v-for="city in cities" :key="city.id" :value="city.id">
                          {{ city.name }}
                        </option>
                      </select>
                      <i class="fas fa-chevron-down input-icon"></i>
                    </div>
                  </div>
                </div>

                <div class="form-row-new">
                  <div class="input-field-box">
                    <label>{{ t('contact.address') }} <span class="required">*</span></label>
                    <div class="input-relative">
                      <textarea v-model="customerInfo.address" :placeholder="t('checkout.address_placeholder')" rows="2"></textarea>
                      <i class="fas fa-home input-icon"></i>
                    </div>
                  </div>
                </div>

                <div class="form-row-new dual">
                  <div class="input-field-box">
                    <label>{{ t('checkout.building_number') }}</label>
                    <input type="text" v-model="customerInfo.building" placeholder="123" />
                  </div>
                  <div class="input-field-box">
                    <label>{{ t('checkout.floor') }}</label>
                    <input type="text" v-model="customerInfo.floor" placeholder="2" />
                  </div>
                </div>

                <div class="form-row-new">
                  <div class="input-field-box">
                    <label>{{ t('checkout.notes_optional') }}</label>
                    <textarea v-model="customerInfo.notes" :placeholder="t('checkout.notes_placeholder')" rows="2"></textarea>
                  </div>
                </div>
              </div>
            </div>

            <!-- Gift Option (Global for Step 2) -->
            <div class="gift-option-section fadeIn">
              <label class="gift-toggle-card" :class="{ active: isGift }">
                <div class="gift-toggle-header">
                  <div class="gift-icon-box">
                    <i class="fas fa-gift"></i>
                  </div>
                  <div class="gift-text-box">
                    <h3 class="gift-title">{{ t('checkout.is_gift') }}</h3>
                    <p class="gift-desc">{{ t('checkout.gift_desc') }}</p>
                  </div>
                  <div class="gift-switch">
                    <input type="checkbox" v-model="isGift" />
                    <span class="switch-slider"></span>
                  </div>
                </div>
                
                <transition name="slide-fade">
                  <div v-if="isGift" class="gift-message-box">
                    <label>{{ t('checkout.gift_message') }}</label>
                    <textarea 
                      v-model="giftMessage" 
                      :placeholder="t('checkout.gift_message_placeholder')" 
                      rows="3"
                    ></textarea>
                  </div>
                </transition>
              </label>
            </div>
          </div>

          <!-- Step 3: Payment Method -->
          <div v-if="currentStep === 3" class="step-container fadeIn">
            <div class="step-header">
              <div class="header-icon"><i class="fas fa-credit-card"></i></div>
              <div class="header-text">
                <h2>{{ t('checkout.payment_method') }}</h2>
                <p>{{ t('checkout.choose_payment_method') }}</p>
              </div>
            </div>

            <div class="payment-options">
              <!-- Wallet Option -->
              <label class="payment-card wallet-card" :class="{ active: useWallet }">
                <input type="checkbox" v-model="useWallet" name="wallet" />
                <div class="payment-icon"><i class="fas fa-wallet"></i></div>
                <div class="payment-info">
                  <span class="payment-title">{{ t('checkout.use_wallet_balance') }}</span>
                  <span class="payment-desc">{{ t('profile.wallet_balance') }}: {{ formatPrice(walletBalance) }} {{ currency }}</span>
                </div>
                <div class="wallet-amount" v-if="useWallet">
                  <span>{{ t('checkout.wallet_will_use') }}: {{ formatPrice(Math.min(walletBalance, grandTotal)) }} {{ currency }}</span>
                </div>
              </label>

              <label class="payment-card" :class="{ active: selectedPayment === 'cod' }">
                <input type="radio" v-model="selectedPayment" value="cod" name="payment" :disabled="useWallet && walletBalance >= grandTotal" />
                <div class="payment-icon"><i class="fas fa-money-bill-wave"></i></div>
                <div class="payment-info">
                  <span class="payment-title">{{ t('checkout.payment_methods.cash_on_delivery') }}</span>
                  <span class="payment-desc">{{ t('checkout.cash_to_courier') }}</span>
                </div>
                <div class="radio-circle"></div>
              </label>

              <label class="payment-card disabled" :class="{ active: selectedPayment === 'card' }">
                <input type="radio" v-model="selectedPayment" value="card" name="payment" disabled />
                <div class="payment-icon"><i class="far fa-credit-card"></i></div>
                <div class="payment-info">
                  <span class="payment-title">{{ t('checkout.card_soon') }}</span>
                  <span class="payment-desc">Visa, MasterCard, Mada</span>
                </div>
                <div class="radio-circle"></div>
              </label>
            </div>

            <!-- Wallet Summary -->
            <div v-if="useWallet" class="wallet-summary">
              <div class="wallet-summary-row">
                <span>{{ t('checkout.order_total') }}:</span>
                <span>{{ formatPrice(grandTotal) }} {{ currency }}</span>
              </div>
              <div class="wallet-summary-row">
                <span>{{ t('checkout.from_wallet') }}:</span>
                <span>-{{ formatPrice(walletPayment) }} {{ currency }}</span>
              </div>
              <div class="wallet-summary-row remaining">
                <span>{{ t('checkout.remaining_to_pay') }}:</span>
                <span>{{ formatPrice(remainingAmount) }} {{ currency }}</span>
              </div>
              <div v-if="remainingAmount === 0" class="wallet-fully-paid">
                <i class="fas fa-check-circle"></i>
                <span>{{ t('checkout.fully_paid_by_wallet') }}</span>
              </div>
            </div>
          </div>

          <!-- Step 4: Order Review -->
          <div v-if="currentStep === 4" class="step-container fadeIn">
            <div class="step-header">
              <div class="header-icon"><i class="fas fa-box"></i></div>
              <div class="header-text">
                <h2>{{ t('checkout.review_order') }}</h2>
                <p>{{ t('checkout.review_order_subtitle') }}</p>
              </div>
            </div>

            <div class="review-details">
              <div class="review-section">
                <div class="review-section-header">
                  <i class="fas fa-shopping-bag"></i>
                  <span>{{ t('nav.products') }}</span>
                </div>
                <div class="review-items">
                  <div v-for="item in cartState.items" :key="item.id" class="review-item">
                    <img :src="getImageUrl(item.image)" :alt="localized(item, 'name')" />
                    <div class="item-info">
                      <h3>{{ localized(item, 'name') }}</h3>
                      <span>{{ t('cart.quantity') }}: {{ item.quantity }}</span>
                    </div>
                    <div class="item-price">{{ formatPrice(getItemPriceWithDiscount(item)) }} {{ currency }}</div>
                  </div>
                </div>
              </div>

              <div class="review-summary-grid">
                <div class="review-section">
                  <div class="review-section-header">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>{{ t('checkout.contact_shipping_info') }}</span>
                  </div>
                  <div class="review-data-content">
                    <p><strong>{{ t('auth.name') }}:</strong> {{ customerInfo.name }}</p>
                    <p><strong>{{ t('auth.phone') }}:</strong> {{ customerInfo.phone }}</p>
                    <p><strong>{{ t('contact.address') }}:</strong> {{ customerInfo.address }}</p>
                  </div>
                </div>

                <div class="review-section">
                  <div class="review-section-header">
                    <i class="fas fa-credit-card"></i>
                    <span>{{ t('checkout.payment_method') }}</span>
                  </div>
                  <div class="review-data-content">
                    <p>{{ getPaymentLabel(selectedPayment) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 5: Order Confirmation (Success) -->
          <div v-if="currentStep === 5" class="confirmation-container fadeIn">
            <div class="success-icon-wrapper">
              <div class="success-circle">
                <i class="fas fa-check"></i>
              </div>
            </div>
            <h1 class="success-title">{{ t('checkout.order_confirmed') }}</h1>
            <p class="order-id">{{ t('checkout.order_number') }}: #ORD-1775396010170</p>
            <p class="success-desc">{{ t('checkout.order_confirmed_desc') }}</p>
            
            <div class="success-actions">
              <router-link to="/products" class="continue-shopping">{{ t('cart.continue_shopping') }}</router-link>
              <router-link to="/" class="back-home">{{ t('dynamic_page.back_home') }}</router-link>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons-new" v-if="currentStep < 5">
            <button class="btn-checkout-secondary" @click="prevStep">
              <i class="fas fa-arrow-right"></i>
              <span>{{ t('common.back') }}</span>
            </button>
            <button class="btn-checkout-primary" @click="nextStep" :disabled="loading">
              <template v-if="loading">
                <i class="fas fa-spinner fa-spin"></i> {{ t('checkout.processing') }}
              </template>
              <template v-else>
                <span>{{ currentStep === 4 ? t('checkout.place_order_now') : t('common.next') }}</span>
                <i class="fas fa-arrow-left"></i>
              </template>
            </button>
          </div>
        </div>

        <!-- Sidebar Summary -->
        <aside class="order-summary-sidebar" v-if="currentStep < 5">
          <div class="sidebar-header">{{ t('checkout.order_summary') }}</div>
          
          <!-- Items List (Scrollable) -->
          <div class="sidebar-items-scroll">
            <div v-for="item in cartState.items" :key="item.id" class="sidebar-item">
              <div class="item-img-box">
                <img :src="getImageUrl(item.image)" :alt="localized(item, 'name')" />
                <span class="item-q-badge">{{ item.quantity }}x</span>
              </div>
              <div class="item-mid">
                <h4 class="item-title">{{ localized(item, 'name') }}</h4>
              </div>
              <div class="item-price">{{ formatPrice(getItemPriceWithDiscount(item)) }} {{ currency }}</div>
            </div>
          </div>

          <!-- Coupon Input -->
          <div class="coupon-section">
            <div class="coupon-input-group">
              <input 
                type="text" 
                v-model="couponCode" 
                :placeholder="t('checkout.coupon_code')" 
                :disabled="appliedCoupon"
                @keyup.enter="applyCoupon"
              />
              <button 
                @click="appliedCoupon ? removeCoupon() : applyCoupon()" 
                :class="{ 'remove-btn': appliedCoupon, 'apply-btn': !appliedCoupon }"
                :disabled="!couponCode && !appliedCoupon"
              >
                {{ appliedCoupon ? t('cart.remove') : t('checkout.apply') }}
              </button>
            </div>
            <p v-if="couponMessage" :class="['coupon-msg', couponMessageType]">
              {{ couponMessage }}
            </p>
          </div>

          <div class="sidebar-totals">
            <div class="total-row">
              <span>{{ t('checkout.subtotal') }}</span>
              <span>{{ formatPrice(subtotalWithDiscount) }} {{ currency }}</span>
            </div>
            <div class="total-row" v-if="discountAmount > 0">
              <span>{{ t('offers.discount') }} ({{ appliedCoupon?.code }})</span>
              <span class="discount-val">- {{ formatPrice(discountAmount) }} {{ currency }}</span>
            </div>
            <div class="total-row shipping-row">
              <span>{{ t('checkout.shipping') }}</span>
              <span v-if="shippingAmount <= 0" class="free">{{ t('cart.free') }}</span>
              <span v-else>{{ formatPrice(shippingAmount) }} {{ currency }}</span>
            </div>
            <div class="total-row" v-if="taxAmount > 0">
              <span>{{ t('checkout.tax') || 'الضريبة' }} ({{ taxRate }}%)</span>
              <span>{{ formatPrice(taxAmount) }} {{ currency }}</span>
            </div>
            <div class="total-row grand-total">
              <span>{{ t('checkout.final_total') }}</span>
              <span>{{ formatPrice(grandTotal) }} {{ currency }}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { cartState } from '../../store/cart';
import { authState } from '../../store/auth';
import api from '../../config/axios';
import { useOffers } from '../../composables/useOffers';
import { useLocalized } from '../../composables/useLocalized';
import { useSettings } from '../../composables/useSettings';

const router = useRouter();
const { t } = useI18n();
const { localized } = useLocalized();
const { getActiveOfferForProduct, calculateDiscountFromOffer, calculatePriceWithOffer, fetchOffers } = useOffers();
const { currency } = useSettings();

// Calculate item price with offer discount
const getItemPriceWithDiscount = (item) => {
  const offer = getActiveOfferForProduct(item);
  if (offer) {
    const price = calculatePriceWithOffer(item, offer);
    return price * item.quantity;
  }
  // Use existing discount from cart item
  if (item.type === 'fixed') {
    return (item.price - (item.discount || 0)) * item.quantity;
  }
  return (item.price * (1 - (item.discount/100 || 0))) * item.quantity;
};

// Calculate item unit price with discount
const getItemUnitPrice = (item) => {
  const offer = getActiveOfferForProduct(item);
  if (offer) {
    return calculatePriceWithOffer(item, offer);
  }
  // Use existing discount from cart item
  if (item.type === 'fixed') {
    return item.price - (item.discount || 0);
  }
  return item.price * (1 - (item.discount/100 || 0));
};

const currentStep = ref(2);
const addressTab = ref('saved'); // 'saved' or 'other'
const showAddForm = ref(false);
const loading = ref(false);
const customerInfo = ref({
  name: '',
  phone: '',
  email: '',
  country: 'JO',
  city: '',
  country_id: null,
  city_id: null,
  address: '',
  building: '',
  floor: '',
  notes: ''
});
const newAddrForm = ref({
  name: '',
  full_name: '',
  city: '',
  country_id: null,
  city_id: null,
  phone: '',
  address: '',
  is_default: false
});
const savedAddresses = ref([]);
const selectedAddressId = ref(null);
const selectedPayment = ref('cod');

// Countries and Cities
const countries = ref([]);
const cities = ref([]);
const cityShippingRate = ref(-1);
const settings = ref({
  enable_city_shipping: false,
  use_city_specific_rates: false,
  default_city_shipping_rate: 0,
});

// Wallet State
const useWallet = ref(false);
const walletBalance = ref(0);

// Gift State
const isGift = ref(false);
const giftMessage = ref('');
const freeDeliveryThreshold = ref(100);
const shippingCost = ref(15);
const taxRate = ref(0);

const getAddressIcon = (name) => {
  const n = name.toLowerCase();
  if (n.includes('منزل') || n.includes('home')) return 'fas fa-home';
  if (n.includes('عمل') || n.includes('work') || n.includes('مكتب')) return 'fas fa-briefcase';
  return 'fas fa-map-marker-alt';
};

const selectAddress = async (addr) => {
  selectedAddressId.value = addr.id;
  customerInfo.value.name = addr.full_name;
  customerInfo.value.phone = addr.phone;
  customerInfo.value.address = addr.address;
  customerInfo.value.city = addr.city || '';
  customerInfo.value.country_id = addr.country_id;
  customerInfo.value.city_id = addr.city_id;
  
  // Always fetch city shipping rate if city_id is available
  if (addr.city_id) {
    await fetchCityShippingRate(addr.city_id);
  } else {
    cityShippingRate.value = -1;
  }
};

const handleSaveNewAddress = async () => {
  if (!newAddrForm.value.full_name || !newAddrForm.value.phone || !newAddrForm.value.address) {
    alert(t('checkout.required_fields'));
    return;
  }
  loading.value = true;
  try {
    const res = await api.post('/frontend/addresses', newAddrForm.value);
    // Refresh list
    await fetchUserData();
    showAddForm.value = false;
    // Auto select the new one
    const newAddr = res.data.data || res.data;
    selectAddress(newAddr);
    // Reset form
    newAddrForm.value = { name: '', full_name: '', city: '', phone: '', address: '', is_default: false };
  } catch (err) {
    console.error('Save failed', err);
    alert(t('checkout.save_address_failed'));
  } finally {
    loading.value = false;
  }
};

const resetCustomerInfo = () => {
  customerInfo.value = {
    name: '',
    phone: '',
    email: '',
    country: 'JO',
    city: '',
    address: '',
    building: '',
    floor: '',
    notes: ''
  };
};


// Coupon State
const couponCode = ref('');
const appliedCoupon = ref(null);
const discountAmount = ref(0);
const couponMessage = ref('');
const couponMessageType = ref(''); // success or error

const progressSteps = computed(() => [
  { id: 1, label: t('checkout.step_cart') },
  { id: 2, label: t('checkout.step_address') },
  { id: 3, label: t('checkout.step_payment') },
  { id: 4, label: t('checkout.step_review') },
  { id: 5, label: t('checkout.step_confirmation') }
]);

const fetchUserData = async () => {
  const token = localStorage.getItem('c_token');
  if (!token) return;

  try {
    const [userRes, addrRes] = await Promise.all([
      api.get('/frontend/user'),
      api.get('/frontend/addresses')
    ]);
    
    const user = userRes.data.data || userRes.data;
    customerInfo.value.name = user.name || '';
    customerInfo.value.phone = user.phone || '';
    customerInfo.value.email = user.email || '';

    savedAddresses.value = addrRes.data.data || addrRes.data || [];
    if (savedAddresses.value.length > 0) {
      const defaultAddr = savedAddresses.value.find(a => a.is_default) || savedAddresses.value[0];
      await selectAddress(defaultAddr);
    }
  } catch (err) {
    console.error('Failed to pre-fill user data', err);
  }
};

onMounted(async () => {
  if (cartState.items.length === 0) {
    router.push('/cart');
    return;
  }
  fetchSettings();
  
  // If user is already logged in but fetchUserData hasn't run
  if (authState.user) {
    customerInfo.value.name = authState.user.name || '';
    customerInfo.value.phone = authState.user.phone || '';
    customerInfo.value.email = authState.user.email || '';
  }
  
  await cartState.refreshCartItems();
  await fetchOffers();
  await fetchSettings();
  await fetchWalletBalance();
  await fetchUserData();
  await fetchCountries();
  await fetchCities();
});

// Watch for city changes to update shipping rate and city name
watch(() => customerInfo.value.city_id, (newCityId) => {
  if (newCityId) {
    const city = cities.value.find(c => c.id == newCityId);
    if (city) {
      customerInfo.value.city = city.name;
    }
    if (settings.value.enable_city_shipping) {
      fetchCityShippingRate(newCityId);
    }
  }
});

watch(() => newAddrForm.value.city_id, (newCityId) => {
  if (newCityId) {
    const city = cities.value.find(c => c.id == newCityId);
    if (city) {
      newAddrForm.value.city = city.name;
    }
    if (settings.value.enable_city_shipping) {
      fetchCityShippingRate(newCityId);
    }
  }
});

const fetchSettings = async () => {
  try {
    const res = await api.get('/frontend/settings');
    const settingsData = res.data.data || res.data || [];
    const getVal = (key) => settingsData.find(s => s.key === key)?.value;
    const threshold = getVal('free_delivery_threshold');
    const shipping = getVal('shipping_cost');
    const tax = getVal('tax_rate');
    const enableCityShipping = getVal('enable_city_shipping');
    const useCitySpecificRates = getVal('use_city_specific_rates');
    const defaultCityShippingRate = getVal('default_city_shipping_rate');
    
    if (threshold !== undefined && threshold !== null && threshold !== '') freeDeliveryThreshold.value = parseFloat(threshold) || 0;
    if (shipping !== undefined && shipping !== null && shipping !== '') shippingCost.value = parseFloat(shipping) || 0;
    if (tax !== undefined && tax !== null && tax !== '') taxRate.value = parseFloat(tax) || 0;
  
    // Store city shipping settings
    settings.value.enable_city_shipping = enableCityShipping === '1' || enableCityShipping === true;
    settings.value.use_city_specific_rates = useCitySpecificRates === '1' || useCitySpecificRates === true;
    settings.value.default_city_shipping_rate = parseFloat(defaultCityShippingRate) || 0;

    // Re-fetch city rate now that settings are loaded
    if (customerInfo.value.city_id) {
      await fetchCityShippingRate(customerInfo.value.city_id);
    }
  } catch (err) {
    console.error('Failed to fetch checkout settings', err);
  }
};

const fetchCountries = async () => {
  try {
    const res = await api.get('/frontend/countries');
    countries.value = res.data.data || res.data || [];
  } catch (err) {
    console.error('Failed to fetch countries', err);
  }
};

const fetchCities = async (countryId = null) => {
  try {
    const params = countryId ? { country_id: countryId } : {};
    const res = await api.get('/frontend/cities', { params });
    cities.value = res.data.data || res.data || [];
  } catch (err) {
    console.error('Failed to fetch cities', err);
  }
};

const fetchCityShippingRate = async (cityId) => {
  if (!cityId || !settings.value.enable_city_shipping) {
    cityShippingRate.value = -1;
    return;
  }
  try {
    const res = await api.get(`/frontend/cities/${cityId}/shipping-rate`);
    const city = res.data.data || res.data;
    
    // Check for nested shipping_rate object
    if (city?.shipping_rate && city.shipping_rate.shipping_cost !== undefined) {
      if (city.shipping_rate.is_active !== false) {
        cityShippingRate.value = Number(city.shipping_rate.shipping_cost) || 0;
        return;
      }
    }
    
    // Check for flat response with shipping_cost
    if (city?.shipping_cost !== undefined && city.is_active !== false) {
      cityShippingRate.value = Number(city.shipping_cost) || 0;
      return;
    }
    
    // No valid rate found - mark as missing (-1) so shippingAmount can fall back
    cityShippingRate.value = -1;
  } catch (err) {
    console.error('Failed to fetch city shipping rate', err);
    cityShippingRate.value = -1;
  }
};

const fetchWalletBalance = async () => {
  if (!authState.token) return;
  try {
    const res = await api.get('/frontend/wallet');
    walletBalance.value = res.data.balance || 0;
  } catch (err) {
    console.error('Failed to fetch wallet balance:', err);
    walletBalance.value = 0;
  }
};

// Calculate subtotal with offer discount
const subtotalWithDiscount = computed(() => {
  return cartState.items.reduce((sum, item) => {
    return sum + getItemPriceWithDiscount(item);
  }, 0);
});

const taxableAmount = computed(() => {
  return Math.max(0, subtotalWithDiscount.value - discountAmount.value);
});

const shippingAmount = computed(() => {
  if (subtotalWithDiscount.value <= 0) return 0;
  
  // If city shipping is enabled, use city-based rate
  if (settings.value.enable_city_shipping) {
    // If we have a valid city rate (>= 0), use it
    if (cityShippingRate.value >= 0) {
      return subtotalWithDiscount.value >= freeDeliveryThreshold.value ? 0 : cityShippingRate.value;
    }
    // Rate is missing (-1) - fall back to default or fixed cost
    const fallbackRate = settings.value.default_city_shipping_rate || shippingCost.value;
    return subtotalWithDiscount.value >= freeDeliveryThreshold.value ? 0 : fallbackRate;
  }
  
  // Otherwise, use fixed shipping cost
  return subtotalWithDiscount.value >= freeDeliveryThreshold.value ? 0 : shippingCost.value;
});

const taxAmount = computed(() => {
  return Math.max(0, taxableAmount.value * (taxRate.value / 100));
});

const grandTotal = computed(() => {
  return taxableAmount.value + shippingAmount.value + taxAmount.value;
});

// Wallet Computed
const walletPayment = computed(() => {
  if (!useWallet.value) return 0;
  return Math.min(walletBalance.value, grandTotal.value);
});

const remainingAmount = computed(() => {
  if (!useWallet.value) return grandTotal.value;
  return Math.max(0, grandTotal.value - walletBalance.value);
});

const applyCoupon = async () => {
  if (!couponCode.value) return;
  
  try {
    const response = await api.post('/frontend/coupons/validate', {
      code: couponCode.value,
      amount: cartState.subtotal
    });
    
    if (response.data.valid) {
      appliedCoupon.value = response.data.data;
      discountAmount.value = response.data.discount;
      couponMessage.value = t('checkout.coupon_applied');
      couponMessageType.value = 'success';
    } else {
      couponMessage.value = t('checkout.invalid_coupon');
      couponMessageType.value = 'error';
    }
  } catch (err) {
    couponMessage.value = t('checkout.invalid_coupon');
    couponMessageType.value = 'error';
  }
};

const removeCoupon = () => {
  appliedCoupon.value = null;
  discountAmount.value = 0;
  couponCode.value = '';
  couponMessage.value = '';
};

const nextStep = async () => {
  if (currentStep.value === 2) {
    if (!customerInfo.value.name || !customerInfo.value.phone || !customerInfo.value.address) {
      alert(t('checkout.required_fields'));
      return;
    }
    currentStep.value++;
  } else if (currentStep.value === 3) {
    currentStep.value++;
  } else if (currentStep.value === 4) {
    await confirmOrder();
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const confirmOrder = async () => {
  loading.value = true;
  try {
    const fullAddress = `${customerInfo.value.address}${customerInfo.value.building ? ', ' + t('checkout.building_number') + ' ' + customerInfo.value.building : ''}${customerInfo.value.floor ? ', ' + t('checkout.floor') + ' ' + customerInfo.value.floor : ''}, ${customerInfo.value.city}, ${customerInfo.value.country}`;
    
    const orderData = {
      customer_id: authState.user?.id || null,
      customer_name: customerInfo.value.name,
      customer_phone: customerInfo.value.phone,
      customer_email: customerInfo.value.email,
      city_id: customerInfo.value.city_id,
      city: customerInfo.value.city,
      shipping_address: fullAddress,
      billing_address: fullAddress,
      total_amount: grandTotal.value,
      subtotal: subtotalWithDiscount.value,
      discount: discountAmount.value,
      tax_amount: taxAmount.value,
      shipping_cost: shippingAmount.value,
      payment_method: remainingAmount.value > 0 ? selectedPayment.value : 'wallet',
      use_wallet: useWallet.value,
      wallet_amount: walletPayment.value,
      notes: (appliedCoupon.value ? `Coupon: ${appliedCoupon.value.code}. ` : '') + (customerInfo.value.notes || ''),
      is_gift: isGift.value,
      gift_message: isGift.value ? giftMessage.value : null,
      items: cartState.items.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: getItemUnitPrice(item),
        attributes: item.selectedAttributes || item.attributes || null
      }))
    };

    const response = await api.post('/frontend/orders', orderData);
    
    if (response.data) {
      currentStep.value = 5;
      if (useWallet.value) {
        await fetchWalletBalance();
      }
      // Clear cart
      cartState.items = [];
      localStorage.removeItem('cart');
    }
  } catch (err) {
    console.error('Order error:', err);
    alert(t('checkout.order_error'));
  } finally {
    loading.value = false;
  }
};

const prevStep = () => {
  if (currentStep.value > 2) {
    currentStep.value--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    router.push('/cart');
  }
};

const getImageUrl = (path) => {
  if (!path) return '/placeholder-product.png';
  if (path.startsWith('http')) return path;
  const baseUrl = api.defaults.baseURL;
  return `${baseUrl.replace('/api', '')}/storage/${path}`;
};

const formatPrice = (price) => {
  const val = parseFloat(price);
  return isNaN(val) ? '0.00' : val.toLocaleString('en-US', { minimumFractionDigits: 2 });
};

const getPaymentLabel = (key) => {
  const labels = {
    card: t('checkout.card'),
    cod: t('checkout.payment_methods.cash_on_delivery'),
    wallet: t('checkout.payment_methods.wallet')
  };
  return labels[key] || '';
};
</script>

<style scoped>
.checkout-page {
  padding: 120px 0 100px;
  background: #fdfcfd;
  min-height: 100vh;
}

@media (max-width: 1024px) {
  .checkout-page { padding-top: 40px !important; }
}

.container-checkout {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
}

/* Progress Bar */
.checkout-progress-wrapper {
  margin-bottom: 60px;
}

.checkout-progress {
  display: flex;
  justify-content: space-between;
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}

.progress-line {
  position: absolute;
  top: 18px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #e5e7eb;
  z-index: 1;
}

.step-item {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100px;
}

.step-circle {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #9ca3af;
  transition: all 0.3s;
}

.step-label {
  font-size: 14px;
  font-weight: 600;
  color: #9ca3af;
}

.step-item.active .step-circle {
  border-color: #873260;
  color: #873260;
  box-shadow: 0 0 0 5px rgba(135, 50, 96, 0.1);
}

.step-item.active .step-label {
  color: #873260;
  font-weight: 700;
}

.step-item.completed .step-circle {
  background: #873260;
  border-color: #873260;
  color: #fff;
}

.step-item.completed .step-label {
  color: #111827;
}

/* Layout */
.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;
  align-items: start;
}

.confirmation-layout {
  grid-template-columns: 1fr;
}

/* Step Container */
.step-container {
  background: #fff;
  border-radius: 24px;
  padding: 40px;
  border: 1px solid #f3f4f6;
  box-shadow: 0 10px 30px rgba(0,0,0,0.02);
}

.step-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
}

.header-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(135, 50, 96, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #873260;
  font-size: 18px;
}

.header-text h2 {
  font-size: 24px;
  font-weight: 800;
  color: #111827;
  margin: 0;
}

.header-text p {
  color: #6b7280;
  margin: 5px 0 0;
  font-size: 14px;
}

.saved-addresses-btn {
  margin-right: auto;
  background: none;
  border: none;
  color: #873260;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

/* Address Cards */
.address-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.address-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 24px;
  border: 2px solid #f3f4f6;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.address-card input {
  position: absolute;
  opacity: 0;
}

.address-card.active {
  border-color: #873260;
  background: rgba(135, 50, 96, 0.01);
}

.address-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  color: #111827;
  font-size: 18px;
  margin-bottom: 12px;
}

.address-title i { color: #873260; }

.default-badge {
  background: #fdf2f8;
  color: #db2777;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 20px;
}

.address-owner { font-weight: 700; margin-bottom: 8px; }
.address-details { color: #6b7280; margin-bottom: 5px; font-size: 14px; }
.address-phone { color: #6b7280; direction: ltr; font-size: 14px; }

.radio-circle {
  width: 22px;
  height: 22px;
  border: 2px solid #e5e7eb;
  border-radius: 50%;
  position: absolute;
  top: 24px;
  left: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.address-card.active .radio-circle,
.payment-card.active .radio-circle {
  border-color: #873260;
}

.radio-circle::after {
  content: '';
  width: 10px;
  height: 10px;
  background: #873260;
  border-radius: 50%;
  opacity: 0;
}

.address-card.active .radio-circle::after,
.payment-card.active .radio-circle::after {
  opacity: 1;
}

.add-address-btn {
  border: 2px dashed #e5e7eb;
  background: none;
  padding: 24px;
  border-radius: 20px;
  color: #9ca3af;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.add-address-btn:hover {
  border-color: #873260;
  color: #873260;
}

/* Payment Cards */
.payment-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.payment-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  border: 2px solid #f3f4f6;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.payment-card input { position: absolute; opacity: 0; }
.payment-card.active { border-color: #873260; background: rgba(135, 50, 96, 0.01); }

.payment-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #873260;
}

.payment-title { display: block; font-weight: 700; font-size: 16px; margin-bottom: 4px; }
.payment-desc { color: #9ca3af; font-size: 13px; }

/* Review Section */
.review-section {
  background: #fcfafb;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}

.review-section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.review-items { display: flex; flex-direction: column; gap: 15px; }
.review-item { display: flex; align-items: center; gap: 15px; }
.review-item img { width: 60px; height: 60px; border-radius: 12px; object-fit: cover; }
.review-item .item-info h3 { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
.review-item .item-info span { color: #9ca3af; font-size: 13px; }
.review-item .item-price { margin-right: auto; font-weight: 800; color: #873260; }

.review-summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.review-data-content p { color: #4b5563; font-size: 14px; margin-bottom: 8px; }

/* New Step Header */
.checkout-step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header-main .header-title {
  font-size: 26px;
  font-weight: 800;
  color: #111827;
  margin: 0;
}

.header-main .header-subtitle {
  color: #9ca3af;
  font-size: 14px;
  margin-top: 4px;
}

.header-icon-box {
  width: 54px;
  height: 54px;
  background: #fdf2f8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #873260;
  font-size: 22px;
}

/* Address Tabs */
.address-tabs {
  display: flex;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 30px;
  position: relative;
  gap: 40px;
}

.address-tab {
  background: none;
  border: none;
  padding: 15px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  color: #9ca3af;
  cursor: pointer;
  transition: 0.3s;
}

.address-tab i {
  font-size: 18px;
}

.address-tab.active {
  color: #873260;
}

.tab-indicator {
  position: absolute;
  bottom: -1px;
  height: 3px;
  background: #873260;
  border-radius: 3px 3px 0 0;
  transition: all 0.3s ease;
}

.tab-indicator.saved {
  width: 140px;
  right: 0;
}

.tab-indicator.other {
  width: 120px;
  right: 180px;
}

/* Saved Addresses List */
.saved-addresses-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.address-card-new {
  display: flex;
  gap: 20px;
  padding: 24px;
  border: 1px solid #f3f4f6;
  border-radius: 16px;
  background: #fff;
  cursor: pointer;
  transition: 0.3s;
  position: relative;
}

.address-card-new.selected {
  border-color: #873260;
}

.addr-type-icon {
  width: 48px;
  height: 48px;
  background: #f8fafc;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  font-size: 18px;
}

.address-card-new:nth-child(even) .addr-type-icon {
  background: #fffbeb;
  color: #f59e0b;
}

.addr-details-box {
  flex: 1;
}

.addr-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.addr-name {
  font-size: 18px;
  font-weight: 800;
  margin: 0;
  color: #111827;
}

.addr-owner {
  font-weight: 700;
  color: #4b5563;
  font-size: 14px;
  margin-bottom: 4px;
}

.addr-full-text {
  color: #9ca3af;
  font-size: 14px;
  margin-bottom: 12px;
}

.addr-phone {
  font-weight: 700;
  color: #4b5563;
  direction: ltr;
}

.addr-selection {
  display: flex;
  align-items: center;
}

.radio-outer {
  width: 22px;
  height: 22px;
  border: 2px solid #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
}

.address-card-new.selected .radio-outer {
  border-color: #873260;
}

.radio-inner {
  width: 12px;
  height: 12px;
  background: #873260;
  border-radius: 50%;
  opacity: 0;
  transform: scale(0.5);
  transition: 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.address-card-new.selected .radio-inner {
  opacity: 1;
  transform: scale(1);
}

.add-new-addr-dashed {
  width: 100%;
  border: 1px dashed #e5e7eb;
  background: none;
  padding: 18px;
  border-radius: 16px;
  color: #9ca3af;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 10px;
}

.add-new-addr-dashed:hover {
  border-color: #873260;
  color: #873260;
}

/* Another Recipient Warning */
.another-recipient-info {
  background: #fffbeb;
  border: 1px solid #fde68a;
  padding: 15px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #92400e;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 25px;
}

/* Checkout Form v2 */
.checkout-form-v2 {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-row-new {
  display: flex;
  flex-direction: column;
}

.form-row-new.dual {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.input-field-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-field-box label {
  font-weight: 700;
  font-size: 14px;
  color: #374151;
}

.input-relative {
  position: relative;
}

.input-relative input,
.input-relative select,
.input-relative textarea,
.input-field-box textarea {
  width: 100%;
  padding: 14px 45px 14px 15px;
  border: 1.5px solid #f3f4f6;
  border-radius: 12px;
  background: #fff;
  font-family: inherit;
  transition: 0.3s;
  font-size: 14px;
}

.input-field-box textarea:not(.input-relative textarea) {
  padding: 14px 15px;
}

.input-field-box input:not(.input-relative input) {
  padding: 14px 15px;
  border: 1.5px solid #f3f4f6;
  border-radius: 12px;
  font-family: inherit;
  transition: 0.3s;
  font-size: 14px;
}

.input-relative .input-icon {
  position: absolute;
  top: 50%;
  right: 18px;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 16px;
  pointer-events: none;
}

.input-relative textarea ~ .input-icon {
  top: 25px;
}

.input-relative input:focus,
.input-relative select:focus,
.input-relative textarea:focus,
.input-field-box input:focus,
.input-field-box textarea:focus {
  border-color: #873260;
  outline: none;
  box-shadow: 0 0 0 4px rgba(135, 50, 96, 0.05);
}

/* Action Buttons New */
.action-buttons-new {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  gap: 15px;
}

.btn-checkout-primary {
  background: #873260;
  color: #fff;
  border: none;
  padding: 15px 40px;
  border-radius: 12px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: 0.3s;
}

.btn-checkout-primary:hover {
  background: #4a1936;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(135, 50, 96, 0.2);
}

.btn-checkout-secondary {
  background: #fff;
  color: #4b5563;
  border: 1.5px solid #e5e7eb;
  padding: 15px 40px;
  border-radius: 12px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: 0.3s;
}

.btn-checkout-secondary:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #d1d5db;
}

.btn-checkout-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
}

.back-btn {
  padding: 16px 32px;
  border: 1px solid #e5e7eb;
  background: #fff;
  border-radius: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #4b5563;
  cursor: pointer;
}

.next-btn {
  padding: 16px 60px;
  background: #873260; /* Primary Dark Mauve */
  color: #fff;
  border: none;
  border-radius: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.next-btn:hover { background: #4a1936; box-shadow: 0 10px 20px rgba(135, 50, 96, 0.2); }

/* Sidebar */
.order-summary-sidebar {
  background: #fff;
  border-radius: 24px;
  padding: 30px;
  border: 1px solid #f3f4f6;
  position: sticky;
  top: 100px;
}

.sidebar-header {
  font-size: 20px;
  font-weight: 850;
  color: #111827;
  margin-bottom: 30px;
}

.sidebar-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid #f3f4f6;
}

.sidebar-item { display: flex; align-items: center; gap: 15px; }
.item-img-box { position: relative; width: 64px; height: 64px; border-radius: 12px; overflow: hidden; background: #f9fafb; flex-shrink: 0; }
.item-img-box img { width: 100%; height: 100%; object-fit: cover; }
.item-q-badge { position: absolute; top: -5px; right: -5px; background: #873260; color: #fff; width: 22px; height: 22px; border-radius: 50%; font-size: 11px; display: flex; align-items: center; justify-content: center; font-weight: 700; }

.item-mid { flex: 1; min-width: 0; }
.item-title { font-size: 14px; font-weight: 700; color: #111827; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0 0 4px 0; }
.item-sku { font-size: 12px; color: #9ca3af; margin: 0; }
.item-price { font-weight: 800; color: #111827; font-size: 15px; }

.sidebar-totals { display: flex; flex-direction: column; gap: 15px; }
.total-row { display: flex; justify-content: space-between; color: #6b7280; font-weight: 600; font-size: 15px; }
.shipping-row span.free { color: #10b981; font-weight: 800; }
.grand-total { border-top: 1px solid #f3f4f6; padding-top: 15px; margin-top: 5px; color: #873260; font-size: 20px; font-weight: 900; }

/* Confirmation Container */
.confirmation-container {
  max-width: 600px;
  margin: 60px auto;
  text-align: center;
  padding: 60px 40px;
  background: #fff;
  border-radius: 30px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.03);
}

.success-icon-wrapper { margin-bottom: 30px; }
.success-circle { width: 100px; height: 100px; background: #ecfdf5; color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 40px; margin: 0 auto; }
.success-title { font-size: 32px; font-weight: 900; color: #111827; margin-bottom: 10px; }
.order-id { font-size: 14px; color: #9ca3af; font-weight: 600; margin-bottom: 30px; }
.success-desc { color: #6b7280; line-height: 1.8; margin-bottom: 40px; }

.success-actions { display: flex; gap: 15px; justify-content: center; }
.continue-shopping { padding: 16px 40px; background: #873260; color: #fff; border-radius: 15px; text-decoration: none; font-weight: 700; }
.back-home { padding: 16px 40px; background: #f9fafb; color: #4b5563; border-radius: 15px; text-decoration: none; font-weight: 700; border: 1px solid #e5e7eb; }

/* Animation */
.fadeIn { animation: fadeIn 0.5s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* Form */
.checkout-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-group label {
  font-weight: 700;
  color: #111827;
  font-size: 14px;
}

.form-group label .required {
  color: #ef4444;
}

.form-group input, 
.form-group textarea {
  padding: 14px 18px;
  border: 1.5px solid #f3f4f6;
  border-radius: 12px;
  background: #fcfafc;
  transition: all 0.3s;
  font-family: inherit;
  font-size: 15px;
}

.form-group input:focus, 
.form-group textarea:focus {
  border-color: #873260;
  outline: none;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(135, 50, 96, 0.05);
}

/* Coupon */
.coupon-section {
  padding: 20px 0;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 20px;
}

.coupon-input-group {
  display: flex;
  gap: 10px;
}

.coupon-input-group input {
  flex: 1;
  padding: 12px 15px;
  border: 1.5px solid #f3f4f6;
  border-radius: 10px;
  font-size: 14px;
}

.coupon-input-group button {
  padding: 0 20px;
  border-radius: 10px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.apply-btn { background: #873260; color: #fff; }
.remove-btn { background: #fee2e2; color: #ef4444; }

.coupon-msg { font-size: 12px; margin-top: 8px; font-weight: 600; }
.coupon-msg.success { color: #10b981; }
.coupon-msg.error { color: #ef4444; }

.discount-val { color: #10b981; font-weight: 800; }

.sidebar-items-scroll {
  max-height: 280px;
  overflow-y: auto;
  padding-right: 5px;
}

.sidebar-items-scroll::-webkit-scrollbar { width: 4px; }
.sidebar-items-scroll::-webkit-scrollbar-thumb { background: #f3f4f6; border-radius: 10px; }

.payment-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f9fafb;
}

/* Wallet Card Styles */
.wallet-card {
  background: linear-gradient(135deg, #8E2DE2 0%, #C94B4B 0.1);
}

.wallet-card.active {
  border-color: #8E2DE2;
  background: linear-gradient(135deg, rgba(142, 45, 226, 0.05) 0%, rgba(201, 75, 75, 0.05) 100%);
}

.wallet-amount {
  position: absolute;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.95);
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  color: #8E2DE2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.wallet-summary {
  margin-top: 24px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 16px;
  border: 1px solid #f3f4f6;
}

.wallet-summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
}

.wallet-summary-row:last-child {
  border-bottom: none;
}

.wallet-summary-row.remaining {
  font-weight: 700;
  color: #873260;
  font-size: 16px;
  padding-top: 16px;
}

.wallet-fully-paid {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 12px 16px;
  background: #d1fae5;
  border-radius: 12px;
  color: #059669;
  font-size: 14px;
  font-weight: 600;
}

.wallet-fully-paid i {
  font-size: 18px;
}

@media (max-width: 1024px) {
  .checkout-layout { grid-template-columns: 1fr; }
  .order-summary-sidebar { position: static; order: -1; }
  .review-summary-grid { grid-template-columns: 1fr; }
}

/* Gift Option Styles */
.gift-option-section {
  margin-top: 30px;
}

.gift-toggle-card {
  display: block;
  background: #fff;
  border: 1.5px solid #f3f4f6;
  border-radius: 20px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.gift-toggle-card.active {
  border-color: #873260;
  box-shadow: 0 10px 30px rgba(135, 50, 96, 0.05);
}

.gift-toggle-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.gift-icon-box {
  width: 54px;
  height: 54px;
  background: #fdf2f8;
  color: #873260;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
  transition: all 0.3s;
}

.gift-toggle-card.active .gift-icon-box {
  background: #873260;
  color: #fff;
  transform: rotate(-10deg) scale(1.1);
}

.gift-text-box {
  flex: 1;
}

.gift-title {
  font-size: 17px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 4px;
}

.gift-desc {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

.gift-switch {
  position: relative;
  width: 50px;
  height: 26px;
}

.gift-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch-slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #e5e7eb;
  transition: .4s;
  border-radius: 34px;
}

.switch-slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.gift-switch input:checked + .switch-slider {
  background-color: #873260;
}

.gift-switch input:checked + .switch-slider:before {
  transform: translateX(24px);
}

.gift-message-box {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px dashed #f3f4f6;
}

.gift-message-box label {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 10px;
}

.gift-message-box textarea {
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  font-family: inherit;
  resize: none;
  font-size: 14px;
  transition: all 0.3s;
}

.gift-message-box textarea:focus {
  outline: none;
  border-color: #873260;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(135, 50, 96, 0.05);
}

.slide-fade-enter-active {
  transition: all 0.4s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}


@media (max-width: 640px) {
  .checkout-progress { scale: 0.7; transform-origin: center; }
  .next-btn { padding: 16px 30px; font-size: 14px; }
  .back-btn { padding: 16px 20px; font-size: 14px; }
  .checkout-form-grid { grid-template-columns: 1fr; }
  .form-group.full-width { grid-column: span 1; }
  .form-row-new.dual { grid-template-columns: 1fr !important; }
  .step-container { padding: 20px; border-radius: 16px; }
  .container-checkout { padding: 0 15px; }
  .checkout-page { padding: 110px 0 60px; }
  .checkout-step-header { margin-bottom: 20px; }
  .header-main .header-title { font-size: 20px; }
  .address-tabs { gap: 20px; overflow-x: auto; padding-bottom: 5px; }
  .address-tab { white-space: nowrap; font-size: 14px; }
}
/* Add Address Form v3 (Figma) */
.add-address-form-v3 {
  border: 1px solid #f3f4f6;
  border-radius: 16px;
  padding: 24px;
  position: relative;
  background: #fff;
  margin-top: 10px;
}

.form-v3-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.form-v3-title {
  font-size: 20px;
  font-weight: 800;
  color: #111827;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-v3-title::after {
  content: '+';
  color: #873260;
  font-weight: 400;
}

.close-v3-btn {
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  line-height: 1;
}

.save-addr-v3-btn {
  width: 100%;
  background: #ba99ab; /* Light maroon as in figma */
  color: #fff;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
  margin-top: 20px;
  transition: 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.save-addr-v3-btn:hover:not(:disabled) {
  background: #873260;
}

.save-addr-v3-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

</style>
