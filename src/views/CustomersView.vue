<template>
  <div class="customers-page">
    <!-- View Mode: List -->
    <div v-if="viewMode === 'list'" class="list-view-container">
      <!-- Header -->
      <div class="page-header spaced">
        <div class="header-titles">
          <div class="title-with-icon">
            <h2 class="page-title">إدارة العملاء</h2>
            <div class="count-badge">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
               </svg>
            </div>
          </div>
          <p class="page-subtitle">إدارة حسابات العملاء والمعلومات</p>
        </div>
      </div>

      <div class="filters-row spaced-row">
        <div class="search-box">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="search-icon">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" v-model="searchQuery" placeholder="البحث بالاسم أو البريد أو الهاتف" class="search-input" />
        </div>
        <div class="filter-select">
          <select v-model="statusFilter" class="form-select">
            <option value="">جميع الحالات</option>
            <option value="1">نشط</option>
            <option value="0">غير نشط</option>
          </select>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="select-icon" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>

      <!-- Table -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th class="col-name text-right">الاسم</th>
              <th class="col-email">البريد الإلكتروني</th>
              <th class="col-phone">رقم الجوال</th>
              <th class="col-city">المدينة</th>
              <th class="col-orders">الطلبات</th>
              <th class="col-spent">إجمالي الإنفاق</th>
              <th class="col-status">الحالة</th>
              <th class="col-actions">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading" class="state-row"><td colspan="8">جاري التحميل...</td></tr>
            <tr v-else-if="filteredCustomers.length === 0" class="state-row"><td colspan="8">لا يوجد عملاء مطابقين</td></tr>
            <template v-else>
              <tr v-for="customer in filteredCustomers" :key="customer.id" class="data-row">
                <td class="col-name text-right">
                  <span class="customer-name">{{ customer.name }}</span>
                </td>
                <td class="col-email">
                  <span class="customer-email">{{ customer.email }}</span>
                </td>
                <td class="col-phone ltr-text">
                  {{ customer.phone || '-' }}
                </td>
                <td class="col-city">
                  {{ customer.city || '-' }}
                </td>
                <td class="col-orders">
                  {{ customer.orders_count || 0 }}
                </td>
                <td class="col-spent">
                  {{ formatPrice(customer.total_spent || 0) }} د.أ
                </td>
                <td class="col-status">
                  <span :class="['status-badge-table', customer.is_active ? 'active' : 'inactive']">
                    {{ customer.is_active ? 'نشط' : 'غير نشط' }}
                  </span>
                </td>
                <td class="col-actions">
                  <div class="actions-group">
                     <button class="action-btn delete-btn" @click="confirmDelete(customer)" title="حذف">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                    <button class="action-btn view-btn" @click="openDetail(customer)" title="عرض">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- View Mode: Detail (Figma Exact) -->
    <div v-if="viewMode === 'detail'" class="detail-view-container">
      <!-- Detail Header -->
      <div class="detail-header" dir="ltr">
        <div class="header-left">
          <button class="back-btn" @click="viewMode = 'list'">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
              </svg>
            </button>
          <div class="block-toggle-group">
            <span class="toggle-label" :class="{ 'blocked': !selectedCustomer?.is_active }">{{ !selectedCustomer?.is_active ? 'محظور' : 'حظر' }}</span>
            <div class="block-toggle" :class="{ 'active': !selectedCustomer?.is_active }" @click="confirmToggleBlock">
              <div class="toggle-circle"></div>
            </div>
            <svg class="block-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
            </svg>
          </div>
        </div>

        <div class="header-right">
          <div class="customer-info-group">
            <div class="customer-text">
              <div class="name-row">
                <span class="status-tag active" v-if="selectedCustomer?.is_active">نشط</span>
                <h2 class="detail-name">{{ selectedCustomer?.name }}</h2>
              </div>
              <p class="detail-contact">
                <span dir="ltr">{{ selectedCustomer?.phone }}</span> | <span>{{ selectedCustomer?.email }}</span>
              </p>
            </div>
            <div class="customer-avatar-large">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <button class="back-btn" @click="viewMode = 'list'">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <p class="stat-label">إجمالي الطلبات</p>
          <p class="stat-value">{{ selectedCustomer?.orders_count || 0 }}</p>
        </div>
        <div class="stat-card">
          <p class="stat-label">إجمالي الإنفاق</p>
          <p class="stat-value highlighted">{{ formatPrice(selectedCustomer?.total_spent || 0) }} د.أ</p>
        </div>
        <div class="stat-card">
          <p class="stat-label">رصيد المحفظة</p>
          <p class="stat-value wallet">{{ formatPrice(selectedCustomer?.balance || 0) }} د.أ</p>
        </div>
        <!-- Disabled temporarily - loyalty points feature -->
        <!-- <div class="stat-card">
          <p class="stat-label">نقاط الولاء</p>
          <p class="stat-value points">{{ selectedCustomer?.points || 0 }}</p>
        </div> -->
        <div class="stat-card">
          <p class="stat-label">المدينة</p>
          <p class="stat-value">{{ selectedCustomer?.city || 'عمان' }}</p>
        </div>
        <div class="stat-card">
          <p class="stat-label">تاريخ الانضمام</p>
          <p class="stat-value date">{{ formatDate(selectedCustomer?.created_at) }}</p>
        </div>
      </div>

      <!-- Tabs Section -->
      <div class="detail-tabs">
        <div class="tabs-list">
          <button class="detail-tab-btn" :class="{ active: activeTab === 'orders' }" @click="activeTab = 'orders'">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
            </svg>
            <span>سجل الطلبات</span>
            <span class="tab-count">{{ selectedCustomer?.orders?.length || 0 }}</span>
          </button>
          <button class="detail-tab-btn" :class="{ active: activeTab === 'wishlist' }" @click="activeTab = 'wishlist'">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span>المفضلة</span>
            <span class="tab-count">{{ selectedCustomer?.wishlists?.length || 0 }}</span>
          </button>
          <button class="detail-tab-btn" :class="{ active: activeTab === 'addresses' }" @click="activeTab = 'addresses'">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span>عناوين الشحن</span>
            <span class="tab-count">{{ selectedCustomer?.addresses?.length || 0 }}</span>
          </button>
          <button class="detail-tab-btn" :class="{ active: activeTab === 'wallet' }" @click="activeTab = 'wallet'">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16v12H4z"/><path d="M4 10h16"/></svg>
            <span>المحفظة</span>
          </button>
          <!-- <button class="detail-tab-btn" :class="{ active: activeTab === 'experience' }" @click="activeTab = 'experience'">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l9 4v12l-9 4-9-4V6z"/><path d="M12 6v6"/></svg>
            <span>Experience</span>
          </button> -->
          <button class="detail-tab-btn" :class="{ active: activeTab === 'reviews' }" @click="activeTab = 'reviews'">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span>التقييمات</span>
            <span class="tab-count">{{ selectedCustomer?.reviews?.length || 0 }}</span>
          </button>
        </div>
      </div>

      <!-- Tab Content: Orders -->
      <div v-if="activeTab === 'orders'" class="tab-content-area">
        <div class="detail-table-container">
          <table class="detail-table">
            <thead>
              <tr>
                <th>رقم الطلب</th>
                <th>التاريخ</th>
                <th>المنتجات</th>
                <th>المبلغ</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in selectedCustomer?.orders" :key="order.id">
                <td class="order-id">
                  <button class="order-link" type="button" @click="openOrderModal(order)">#{{ order.order_number || order.id }}</button>
                </td>
                <td class="order-date">{{ formatDate(order.date || order.created_at) }}</td>
                <td class="order-items-count">{{ order.products?.length || 1 }} منتجات</td>
                <td class="order-amount">{{ formatPrice(order.total || order.total_amount) }} د.أ</td>
                <td class="order-status">
                  <span :class="['status-badge-detail', getStatusClass(order.status)]">{{ getStatusLabel(order.status) }}</span>
                </td>
              </tr>
              <tr v-if="!selectedCustomer?.orders?.length">
                <td colspan="5" style="text-align: center; padding: 3rem; color: #9ca3af;">لا يوجد طلبات لهذا العميل</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab Content: Wishlist -->
      <div v-else-if="activeTab === 'wishlist'" class="tab-content-area">
        <div class="wishlist-grid" v-if="selectedCustomer?.wishlists?.length">
            <div v-for="item in selectedCustomer.wishlists" :key="item.id" class="wishlist-item-card">
                <img :src="getImageUrl(item.product?.image)" class="wishlist-img" />
                <div class="wishlist-info">
                    <h4>{{ item.product?.name }}</h4>
                    <p>{{ formatPrice(item.product?.price) }} د.أ</p>
                </div>
            </div>
        </div>
        <div v-else class="empty-placeholder">
            <p>لا توجد منتجات في المفضلة</p>
        </div>
      </div>

      <!-- Tab Content: Addresses -->
      <div v-else-if="activeTab === 'addresses'" class="tab-content-area">
        <div class="addresses-grid" v-if="selectedCustomer?.addresses?.length">
            <div v-for="addr in selectedCustomer.addresses" :key="addr.id" class="address-card">
                <div class="addr-header">
                    <span class="addr-tag">{{ addr.name }}</span>
                    <span v-if="addr.is_default" class="default-badge">افتراضي</span>
                </div>
                <h4 class="addr-name">{{ addr.full_name }}</h4>
                <p class="addr-text">{{ addr.address }}, {{ addr.city }}</p>
                <p class="addr-phone">{{ addr.phone }}</p>
            </div>
        </div>
        <div v-else class="empty-placeholder">
            <p>لا توجد عناوين مسجلة</p>
        </div>
      </div>

      <!-- Tab Content: Wallet -->
      <div v-else-if="activeTab === 'wallet'" class="tab-content-area wallet-section">
        <div class="wallet-grid two-col">
          <div class="wallet-card">
            <div class="wallet-card-head">
              <svg class="wallet-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
              </svg>
              <span class="highlight-tag">الرصيد المتاح</span>
            </div>
            <strong>{{ formatPrice(selectedCustomer?.balance || 0) }} د.أ</strong>
            <p>يمكنك مراجعة أرصدة العميل قبل إصدار أي خصم.</p>
          </div>
          <div class="wallet-card">
            <div class="wallet-card-head">
              <svg class="wallet-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"/><path d="M4 12V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6"/><path d="M12 2l4 4H8l4-4"/>
              </svg>
              <span class="highlight-tag">رصيد الحسم</span>
            </div>
            <strong>{{ formatPrice(selectedCustomer?.discount_balance || 0) }} د.أ</strong>
            <p>متوفر لاستخدامه في خصومات القسائم.</p>
          </div>
        </div>

        <!-- Wallet Actions -->
        <div class="wallet-actions-wrapper">
          <div class="wallet-actions">
            <button class="wallet-action-btn charge-btn" @click="openWalletModal('charge')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
              شحن رصيد
            </button>
            <button class="wallet-action-btn deduct-btn" @click="openWalletModal('deduct')">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/></svg>
              خصم رصيد
            </button>
          </div>
        </div>

        <!-- Wallet Transaction History -->
        <div class="wallet-history-section">
          <div class="history-header">
            <h4 class="history-title">سجل عمليات المحفظة</h4>
          </div>
          <div class="wallet-table-container">
            <table class="wallet-table">
              <thead>
                <tr>
                  <th>النوع</th>
                  <th>المبلغ</th>
                  <th>الرصيد بعد العملية</th>
                  <th>الملاحظة</th>
                  <th>بواسطة</th>
                  <th>التاريخ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="walletTransactionsLoading">
                  <td colspan="6" class="text-center loading-cell">
                    <div class="loading-spinner"></div>
                    جاري التحميل...
                  </td>
                </tr>
                <tr v-else-if="!walletTransactions || walletTransactions.length === 0">
                  <td colspan="6" class="text-center empty-cell">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5"><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/><path d="M12 7v5l3 3"/></svg>
                    <p>لا توجد عمليات</p>
                  </td>
                </tr>
                <tr v-else v-for="txn in walletTransactions" :key="txn.id">
                  <td>
                    <span class="txn-badge" :class="txn.type">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-if="txn.type === 'charge'"><path d="M12 5v14M5 12h14"/></svg>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-else><path d="M5 12h14"/></svg>
                      {{ txn.type === 'charge' ? 'شحن' : 'خصم' }}
                    </span>
                  </td>
                  <td :class="txn.type === 'charge' ? 'amount-green' : 'amount-red'">
                    {{ txn.type === 'charge' ? '+' : '-' }}{{ formatPrice(txn.amount) }} د.أ
                  </td>
                  <td class="balance-cell">{{ formatPrice(txn.balance_after) }} د.أ</td>
                  <td class="note-cell">{{ txn.note || '-' }}</td>
                  <td class="by-cell">{{ txn.created_by || 'النظام' }}</td>
                  <td class="date-cell">{{ formatDate(txn.created_at) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div v-else-if="activeTab === 'experience'" class="tab-content-area experience-section">
        <div class="experience-row">
          <div>
            <h4>سجل التفاعلات</h4>
            <p>آخر زيارة: {{ formatDate(selectedCustomer?.last_activity) }}</p>
          </div>
          <div>
            <h4>نقاط التفاعل</h4>
            <p>{{ selectedCustomer?.experience_points || 0 }}</p>
          </div>
        </div>
        <p class="section-hint">المعلومات مستندة إلى التفاعل مع الطلبات والإشعارات</p>
      </div>
      <div v-else-if="activeTab === 'reviews'" class="tab-content-area">
        <div class="reviews-list" v-if="selectedCustomer?.reviews?.length">
            <div v-for="review in selectedCustomer.reviews" :key="review.id" class="review-item-detail">
                <div class="review-header-row">
                    <div class="review-stars">
                        <i v-for="i in 5" :key="i" class="fas fa-star" :class="{ 'active': i <= review.rating }"></i>
                    </div>
                    <span class="review-date">{{ formatDate(review.created_at) }}</span>
                </div>
                <p class="review-comment">{{ localizedValue(review.comment) }}</p>
            </div>
        </div>
        <div v-else class="empty-placeholder">
            <p>لا توجد تقييمات من هذا العميل</p>
        </div>
      </div>
      
    </div>

    <!-- Block Confirmation Modal -->
    <div class="modal-overlay" v-if="showBlockConfirm" @click.self="showBlockConfirm = false">
      <div class="confirm-modal">
        <div class="confirm-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
          </svg>
        </div>
        <h3 class="confirm-title">{{ selectedCustomer?.is_active ? 'تأكيد حظر العميل' : 'تأكيد إلغاء الحظر' }}</h3>
        <p class="confirm-msg">{{ selectedCustomer?.is_active ? `هل أنت متأكد من حظر العميل "${selectedCustomer?.name}"\u061f لن يتمكن من تسجيل الدخول أو إتمام أي طلب.` : `هل تريد إعادة تفعيل حساب "${selectedCustomer?.name}"\u061f` }}</p>
        <div class="confirm-actions">
          <button class="confirm-cancel-btn" @click="showBlockConfirm = false">إلغاء</button>
          <button class="confirm-block-btn" :class="{ 'unblock': !selectedCustomer?.is_active }" @click="toggleCustomerStatus">
            {{ selectedCustomer?.is_active ? 'حظر العميل' : 'إلغاء الحظر' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Alert Message -->
    <div class="alert-toast" :class="[alertType, { show: showAlert }]">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="alert-icon">
        <path v-if="alertType === 'success'" d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline v-if="alertType === 'success'" points="22 4 12 14.01 9 11.01"/>
        <circle v-if="alertType === 'error'" cx="12" cy="12" r="10"/><line v-if="alertType === 'error'" x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {{ alertMessage }}
    </div>
    <div class="modal-overlay" v-if="showOrderModal" @click.self="showOrderModal = false">
      <div class="modal-content view-content-large">
        <div class="view-header-bar">
          <div class="right-col">
            <h3 class="view-title">تفاصيل الطلب #{{ activeOrder?.orderNumber || activeOrder?.order_number }}</h3>
            <span class="view-time">{{ formatDate(activeOrder?.date || activeOrder?.created_at) }} - {{ activeOrder?.time || '' }}</span>
            <span class="status-badge" :class="activeOrder?.status">{{ getStatusLabel(activeOrder?.status) }}</span>
          </div>
          <div class="left-col">
            <button class="modal-close" @click="showOrderModal = false">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <div class="view-body-wrapper">
          <!-- Stepper -->
          <div class="order-stepper">
            <div class="step" :class="getStepClass('pending')">
              <div class="step-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span>استلام الطلب</span>
            </div>
            <div class="step-line" :class="getLineClass('processing')"></div>
            <div class="step" :class="getStepClass('processing')">
              <div class="step-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span>قيد التحضير</span>
            </div>
            <div class="step-line" :class="getLineClass('shipped')"></div>
            <div class="step" :class="getStepClass('shipped')">
              <div class="step-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span>قيد الشحن</span>
            </div>
            <div class="step-line" :class="getLineClass('delivered')"></div>
            <div class="step" :class="getStepClass('delivered')">
              <div class="step-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span>تم التسليم</span>
            </div>
          </div>

          <div class="order-layout">
            <!-- Right side (Products & Customer) -->
            <div class="content-main">
              <div class="card-section">
                <h4 class="section-heading">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  منتجات الطلب
                </h4>
                <table class="products-table">
                  <thead>
                    <tr>
                      <th class="text-right">المنتج</th>
                      <th>الكمية</th>
                      <th>الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="prod in (activeOrder?.products || activeOrder?.orderItems || [])" :key="prod.id">
                      <td>
                        <div class="p-info">
                          <img v-if="prod.image" :src="getImageUrl(prod.image)" :alt="prod.name" />
                          <div v-else class="img-placeholder"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg></div>
                          <div class="p-texts">
                            <span class="p-name">{{ localizedValue(prod.product?.name || prod.name || prod.product_name) }}</span>
                            <div class="p-attrs-v2" v-if="prod.attributes">
                              <span v-for="(val, label) in prod.attributes" :key="label" class="attr-tag-v2">
                                {{ label }}: {{ val }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="text-center font-bold">{{ prod.quantity || prod.qty || 1 }}</td>
                      <td class="text-center">{{ formatPrice((prod.price || prod.unit_price || 0) * (prod.quantity || prod.qty || 1)) }} د.أ</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="card-section">
                <h4 class="section-heading">معلومات العميل</h4>
                <div class="customer-info-grid">
                  <div class="info-item">
                    <span class="info-label">الاسم</span>
                    <span class="info-val font-bold">{{ activeOrder?.customerName || selectedCustomer?.name }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">الهاتف</span>
                    <span class="info-val ltr flex-end" style="direction:ltr; text-align:right; width: 100%">{{ activeOrder?.customerPhone || selectedCustomer?.phone }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">البريد الإلكتروني</span>
                    <span class="info-val">{{ activeOrder?.customerEmail || selectedCustomer?.email || 'لا يوجد' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">العنوان</span>
                    <span class="info-val">{{ formatAddress(activeOrder?.customerAddress || selectedCustomer?.address) }}</span>
                  </div>
                </div>
              </div>

              <div class="card-section" v-if="activeOrder?.activityLog && activeOrder.activityLog.length">
                <h4 class="section-heading">سجل النشاط</h4>
                <div class="activity-timeline">
                  <div class="timeline-item" v-for="(log, idx) in activeOrder.activityLog" :key="idx">
                    <div class="ti-date">{{ log.date }}<br>{{ log.time }}</div>
                    <div class="ti-bullet"></div>
                    <div class="ti-content">
                      <p class="ti-msg">{{ log.message }}</p>
                      <span class="ti-status" :class="log.status" v-if="log.status">{{ getStatusLabel(log.status) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Left side (Summary) -->
            <div class="content-side">
              <div class="card-section">
                <h4 class="section-heading">ملخص الطلب</h4>
                <div class="summary-rows">
                  <div class="s-row">
                    <span>المجموع الفرعي</span>
                    <span>{{ formatPrice(activeOrder?.subtotal || 0) }} د.أ</span>
                  </div>
                  <div class="s-row">
                    <span>الشحن</span>
                    <span>{{ formatPrice(activeOrder?.shipping || 0) }} د.أ</span>
                  </div>
                  <div class="s-row" v-if="activeOrder?.discount > 0">
                    <span>الخصم</span>
                    <span class="green-text">-{{ formatPrice(activeOrder?.discount) }} د.أ</span>
                  </div>
                  <div class="s-row total">
                    <span>الإجمالي</span>
                    <span>{{ formatPrice(activeOrder?.total || 0) }} د.أ</span>
                  </div>
                  <div class="s-row flex-start mt-1">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    <span class="text-gray">{{ paymentMethods[activeOrder?.paymentMethod] || 'دفع عند الاستلام' }}</span>
                  </div>
                </div>
              </div>

              <!-- Gift Info Section in Details -->
              <div class="card-section gift-admin-section" v-if="activeOrder?.isGift">
                <h4 class="section-heading">
                  <i class="fas fa-gift"></i>
                  طلب هدية
                </h4>
                <div class="gift-msg-admin">
                  <span class="info-label">رسالة الإهداء:</span>
                  <p class="gift-text-admin">{{ activeOrder?.giftMessage || 'بدون رسالة' }}</p>
                </div>
              </div>

              <div class="card-section">
                <h4 class="section-heading">معلومات الشحن</h4>
                <div class="shipping-info">
                  <div class="shi-row">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#db2777" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                    <div>
                      <span class="shi-label">الشركة الناقلة</span>
                      <span class="shi-val">{{ activeOrder?.courierName || 'غير محدد' }}</span>
                    </div>
                  </div>
                  <div class="shi-row">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    <div>
                      <span class="shi-label">رقم التتبع</span>
                      <span class="shi-val ltr flex-end">{{ activeOrder?.trackingNumber || '---' }}</span>
                    </div>
                  </div>
                  <div class="shi-row">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <div>
                      <span class="shi-label">التوصيل المتوقع</span>
                      <span class="shi-val">{{ activeOrder?.estimatedDelivery || '---' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Wallet Transaction Modal -->
    <div class="modal-overlay" v-if="showWalletModal" @click.self="showWalletModal = false">
      <div class="modal-content wallet-modal">
        <button class="modal-close" @click="showWalletModal = false">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div class="wallet-modal-header">
          <h3>{{ walletModalType === 'charge' ? 'شحن رصيد' : 'خصم رصيد' }}</h3>
          <p>للعميل: {{ selectedCustomer?.name }}</p>
        </div>
        <form @submit.prevent="submitWalletTransaction" class="wallet-modal-form">
          <div class="form-group">
            <label class="form-label">المبلغ <span class="req">*</span></label>
            <input type="number" v-model="walletForm.amount" class="form-control" min="0" step="0.01" required placeholder="أدخل المبلغ" />
          </div>
          <div class="form-group">
            <label class="form-label">الملاحظة</label>
            <textarea v-model="walletForm.note" class="form-control text-area" rows="3" placeholder="أدخل ملاحظة (اختياري)"></textarea>
          </div>
          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="showWalletModal = false">إلغاء</button>
            <button type="submit" class="btn-submit" :disabled="walletFormLoading">
              {{ walletFormLoading ? 'جاري المعالجة...' : (walletModalType === 'charge' ? 'شحن' : 'خصم') }}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useLocalized } from '../composables/useLocalized';
import api from '../config/axios';

// States
const customers = ref([]);
const loading = ref(false);
const searchQuery = ref('');
const statusFilter = ref('');

// View Mode
const viewMode = ref('list'); // 'list' or 'detail'
const selectedCustomer = ref(null);
const activeTab = ref('orders');
const showOrderModal = ref(false);
const activeOrder = ref(null);

const showAlert = ref(false);
const alertMessage = ref('');
const alertType = ref('success');
const showBlockConfirm = ref(false);

// Wallet State
const walletTransactions = ref([]);
const walletTransactionsLoading = ref(false);
const showWalletModal = ref(false);
const walletModalType = ref('charge'); // 'charge' or 'deduct'
const walletForm = ref({
  amount: '',
  note: ''
});
const walletFormLoading = ref(false);

const confirmToggleBlock = () => {
  showBlockConfirm.value = true;
};

// Utils
const formatPrice = (p) => Number(p).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
const formatDate = (d) => d ? new Date(d).toISOString().split('T')[0] : '-';

const formatAddress = (addressData) => {
  if (!addressData) return 'لا يوجد';
  if (typeof addressData === 'string') {
    try {
      const parsed = JSON.parse(addressData);
      if (parsed.address && parsed.city) {
        return `${parsed.address}، ${parsed.city}`;
      }
      return addressData;
    } catch (e) {
      return addressData;
    }
  }
  if (typeof addressData === 'object') {
    if (addressData.address && addressData.city) {
      return `${addressData.address}، ${addressData.city}`;
    }
  }
  return 'لا يوجد';
};

const getImageUrl = (path) => {
  if (!path) return '/placeholder-product.png';
  if (path.startsWith('http')) return path;
  const baseUrl = api.defaults.baseURL;
  return `${baseUrl.replace('/api', '')}/storage/${path}`;
};

const { localizedValue } = useLocalized();

const orderModalLoading = ref(false);

const triggerAlert = (msg, type = 'success') => {
  alertMessage.value = msg;
  showOrderModal.value = false;
  alertType.value = type;
  showAlert.value = true;
  setTimeout(() => { showAlert.value = false; }, 3000);
};

const openOrderModal = async (order) => {
  orderModalLoading.value = true;
  showOrderModal.value = false;
  try {
    const res = await api.get(`/dashboard/orders/${order.id}`);
    activeOrder.value = res.data.data || res.data;
    showOrderModal.value = true;
  } catch (err) {
    triggerAlert('فشل تحميل تفاصيل الطلب', 'error');
  } finally {
    orderModalLoading.value = false;
  }
};

// Fetch Data
const fetchCustomers = async () => {
  loading.value = true;
  try {
    const res = await api.get('/dashboard/customers');
    customers.value = res.data.data || res.data;
  } catch (err) {
    triggerAlert('فشل تحميل بيانات العملاء', 'error');
  } finally {
    loading.value = false;
  }
};

const openDetail = async (customer) => {
  loading.value = true;
  try {
    const res = await api.get(`/dashboard/customers/${customer.id}`);
    selectedCustomer.value = res.data.data || res.data;
    console.log('Customer detail data:', selectedCustomer.value);
    console.log('Orders count:', selectedCustomer.value?.orders?.length);
    console.log('Addresses count:', selectedCustomer.value?.addresses?.length);
    console.log('Wishlists count:', selectedCustomer.value?.wishlists?.length);
    console.log('Reviews count:', selectedCustomer.value?.reviews?.length);
    viewMode.value = 'detail';
    activeTab.value = 'orders';
  } catch (err) {
    console.error('Failed to load customer detail:', err);
    triggerAlert('فشل تحميل تفاصيل العميل', 'error');
  } finally {
    loading.value = false;
  }
};

const toggleCustomerStatus = async () => {
  showBlockConfirm.value = false;
  if (!selectedCustomer.value) return;
  const newStatus = !selectedCustomer.value.is_active;
  try {
    await api.put(`/dashboard/customers/${selectedCustomer.value.id}`, {
      is_active: newStatus
    });
    selectedCustomer.value.is_active = newStatus;
    triggerAlert(newStatus ? 'تم تنشيط العميل' : 'تم حظر العميل');
  } catch (err) {
    triggerAlert('فشل تحديث حالة العميل', 'error');
  }
};

const confirmDelete = async (customer) => {
  if (confirm(`هل أنت متأكد من حذف العميل "${customer.name}"؟`)) {
    try {
      await api.delete(`/dashboard/customers/${customer.id}`);
      triggerAlert('تم حذف العميل بنجاح');
      fetchCustomers();
    } catch (err) {
      triggerAlert('فشل حذف العميل', 'error');
    }
  }
};

const getStatusLabel = (status) => {
    const labels = {
        'pending': 'قيد الانتظار',
        'processing': 'جاري التحضير',
        'shipped': 'تم الشحن',
        'delivered': 'تم التوصيل',
        'completed': 'مكتمل',
        'cancelled': 'ملغي'
    };
    return labels[status] || status;
};

const getStatusClass = (status) => {
    if (status === 'delivered' || status === 'completed') return 'delivered';
    if (status === 'cancelled') return 'cancelled';
    return 'pending';
};

const paymentMethods = {
  'cash': 'دفع عند الاستلام',
  'card': 'بطاقة ائتمان',
  'wallet': 'المحفظة',
  'points': 'نقاط الولاء'
};

// Stepper Logic
const orderSteps = ['pending', 'processing', 'shipped', 'delivered'];
const getStepClass = (step) => {
  if (!activeOrder.value) return '';
  const cIdx = orderSteps.indexOf(activeOrder.value.status);
  const sIdx = orderSteps.indexOf(step);
  if (cIdx >= sIdx) return 'active';
  return '';
};

const getLineClass = (step) => {
  if (!activeOrder.value) return '';
  const cIdx = orderSteps.indexOf(activeOrder.value.status);
  const sIdx = orderSteps.indexOf(step);
  if (cIdx > sIdx) return 'active';
  return '';
};

// Wallet Functions
const fetchWalletTransactions = async () => {
  if (!selectedCustomer.value) return;
  walletTransactionsLoading.value = true;
  try {
    const res = await api.get(`/dashboard/customers/${selectedCustomer.value.id}/wallet-transactions`);
    walletTransactions.value = res.data.data || res.data || [];
  } catch (err) {
    console.error('Failed to fetch wallet transactions:', err);
    walletTransactions.value = [];
  } finally {
    walletTransactionsLoading.value = false;
  }
};

const openWalletModal = (type) => {
  walletModalType.value = type;
  walletForm.value = { amount: '', note: '' };
  showWalletModal.value = true;
};

const submitWalletTransaction = async () => {
  if (!selectedCustomer.value) return;
  walletFormLoading.value = true;
  try {
    const endpoint = walletModalType.value === 'charge' 
      ? `/dashboard/customers/${selectedCustomer.value.id}/wallet-charge`
      : `/dashboard/customers/${selectedCustomer.value.id}/wallet-deduct`;
    
    const res = await api.post(endpoint, {
      amount: parseFloat(walletForm.value.amount),
      note: walletForm.value.note
    });
    
    // Update balance instantly from response
    if (res.data && res.data.balance !== undefined) {
      selectedCustomer.value.balance = res.data.balance;
    }
    
    triggerAlert(walletModalType.value === 'charge' ? 'تم شحن الرصيد بنجاح' : 'تم خصم الرصيد بنجاح');
    showWalletModal.value = false;
    
    // Refresh transactions list
    await fetchWalletTransactions();
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'فشلت العملية';
    triggerAlert(errorMsg, 'error');
  } finally {
    walletFormLoading.value = false;
  }
};

onMounted(() => {
  fetchCustomers();
});

// Watch for tab changes to fetch wallet transactions
watch(activeTab, (newTab) => {
  if (newTab === 'wallet' && selectedCustomer.value) {
    fetchWalletTransactions();
  }
});

watch(selectedCustomer, (newCustomer) => {
  if (newCustomer && activeTab.value === 'wallet') {
    fetchWalletTransactions();
  }
});

// Filtering
const filteredCustomers = computed(() => {
  if (!Array.isArray(customers.value)) return [];
  return customers.value.filter(c => {
    const nameMatch = c.name?.toLowerCase().includes(searchQuery.value.toLowerCase());
    const emailMatch = c.email?.toLowerCase().includes(searchQuery.value.toLowerCase());
    const phoneMatch = c.phone?.includes(searchQuery.value) || false;
    
    const queryMatch = nameMatch || emailMatch || phoneMatch;
    const statusMatch = statusFilter.value === '' ? true : (c.is_active ? '1' : '0') === statusFilter.value;
    
    return queryMatch && statusMatch;
  });
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap');

.customers-page {
  display: flex; flex-direction: column; gap: 1.5rem; direction: rtl; 
  font-family: 'Almarai', sans-serif; padding-bottom: 2rem;
}

/* --- List View Styles --- */
.page-header { display: flex; align-items: center; justify-content: space-between; }
.page-header.spaced { margin-bottom: 1rem; }
.filters-row.spaced-row { margin-top: 1.25rem; display: flex; gap: 1rem; align-items: stretch; }
.title-with-icon { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.2rem; }
.page-title { font-size: 1.4rem; font-weight: 800; color: #111827; margin: 0; }
.count-badge { background: #fdf2f8; color: #db2777; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.page-subtitle { font-size: 0.85rem; color: #6b7280; margin: 0; }

.filters-row { display: flex; gap: 1rem; align-items: center; margin-top: 1rem; }

/* Block Confirm Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; overflow-y: auto; }
.confirm-modal { background: #fff; border-radius: 16px; padding: 2rem; width: 100%; max-width: 420px; text-align: center; direction: rtl; }
.confirm-icon { margin: 0 auto 1rem; width: 56px; height: 56px; background: #fef2f2; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.confirm-title { font-size: 1.1rem; font-weight: 800; color: #111827; margin: 0 0 0.5rem; }
.confirm-msg { font-size: 0.85rem; color: #6b7280; line-height: 1.6; margin-bottom: 1.5rem; }
.confirm-actions { display: flex; gap: 0.75rem; justify-content: center; }
.confirm-cancel-btn { flex: 1; padding: 0.7rem; border: 1.5px solid #e5e7eb; background: #fff; border-radius: 8px; font-weight: 700; cursor: pointer; font-family: 'Almarai', sans-serif; }
.confirm-block-btn { flex: 1; padding: 0.7rem; background: #dc2626; color: #fff; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; font-family: 'Almarai', sans-serif; }
.confirm-block-btn.unblock { background: #16a34a; }
.search-box { flex: 1; position: relative; display: flex; align-items: center; }
.filters-row.spaced-row .search-box { flex: 1.2; }
.search-icon { position: absolute; right: 1rem; color: #9ca3af; }
.search-input { width: 100%; padding: 0.7rem 2.8rem 0.7rem 1rem; border: 1px solid #e5e7eb; border-radius: 8px; font-family: 'Almarai', sans-serif; font-size: 0.85rem; outline: none; background: #fff; transition: border-color 0.2s; }
.search-input:focus { border-color: #873260; }

.filter-select { position: relative; display: flex; align-items: center; min-width: 180px; }
.form-select { width: 100%; padding: 0.7rem 1rem 0.7rem 2.5rem; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; font-family: 'Almarai', sans-serif; font-size: 0.85rem; color: #374151; appearance: none; outline: none; cursor: pointer; }
.filter-select .select-icon { position: absolute; left: 1rem; color: #9ca3af; pointer-events: none; }

.table-container { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; overflow-x: auto; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td { padding: 1.1rem 1rem; border-bottom: 1px solid #f3f4f6; vertical-align: middle; text-align: center; }
.data-table th { background: #f9fafb; font-size: 0.75rem; font-weight: 700; color: #6b7280; white-space: nowrap; }
.data-table td { font-size: 0.85rem; color: #374151; }
.data-row:hover td { background: #fdfafb; }
.state-row td { text-align: center; color: #6b7280; padding: 2.5rem; }

.text-right { text-align: right !important; }
.ltr-text { direction: ltr; }

.customer-name { font-weight: 700; color: #111827; }
.customer-email { color: #6b7280; font-size: 0.8rem; }

.status-badge-table { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 6px; font-size: 0.7rem; font-weight: 700; }
.status-badge-table.active { background: #ecfdf5; color: #059669; }
.status-badge-table.inactive { background: #f3f4f6; color: #6b7280; }

.actions-group { display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
.action-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 6px; border: none; cursor: pointer; transition: all 0.2s; }
.view-btn { background: #fdf2f8; color: #db2777; }
.view-btn:hover { background: #fce7f3; }
.delete-btn { background: #fef2f2; color: #dc2626; }
.delete-btn:hover { background: #fee2e2; }

/* --- Detail View Styles (Figma Match) --- */
.detail-view-container {
  display: flex; flex-direction: column; gap: 2rem;
}

.detail-header {
  display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; gap: 1rem;
  flex-wrap: wrap;
}

.header-left, .header-right { flex: 1 1 auto; display: flex; justify-content: flex-start; }
.header-right { justify-content: flex-end; }

.block-toggle-group {
  display: flex; align-items: center; gap: 1rem; color: #ef4444; font-weight: 700;
}

.block-toggle {
  width: 48px; height: 24px; background: #e5e7eb; border-radius: 50px; position: relative; cursor: pointer; transition: 0.3s;
}

.toggle-circle {
  width: 18px; height: 18px; background: #fff; border-radius: 50%; position: absolute; top: 3px; right: 3px; transition: 0.3s;
}

.block-toggle.active { background: #ef4444; }
.block-toggle.active .toggle-circle { transform: translateX(-24px); }

.customer-info-group {
  display: flex; align-items: center; gap: 1.5rem;
}

.customer-text { text-align: right; }
.name-row { display: flex; align-items: center; justify-content: flex-end; gap: 0.75rem; }
.detail-name { font-size: 1.6rem; font-weight: 800; color: #111827; margin: 0; }
.status-tag { padding: 0.2rem 0.8rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700; }
.status-tag.active { background: #dcfce7; color: #16a34a; }

.detail-contact { color: #6b7280; font-size: 0.9rem; margin-top: 0.25rem; }

.customer-avatar-large {
  width: 56px; height: 56px; background: #f3f4f6; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #9ca3af;
}

.back-btn {
  margin-right: 20px;  width: 40px; height: 40px; background: #fff; border: 1px solid #e5e7eb; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #6b7280; transition: 0.2s;
}
.back-btn:hover { background: #f9fafb; color: #111827; }

/* Stats Grid */
.stats-grid {
  display: grid; grid-template-columns: repeat(6, 1fr); gap: 1rem;
}

.stat-card {
  background: #fff; border: 1px solid #f3f4f6; border-radius: 12px; padding: 1.5rem; text-align: center;
}

.stat-label { font-size: 0.85rem; color: #9ca3af; font-weight: 600; margin-bottom: 0.75rem; }
.stat-value { font-size: 1.5rem; font-weight: 800; color: #111827; margin: 0; }
.stat-value.highlighted { color: #111827; }
.stat-value.wallet { color: #10b981; }
.stat-value.points { color: #f59e0b; }
.stat-value.date { font-size: 1.1rem; }

/* Tabs */
.detail-tabs {
  border-bottom: 2px solid #f3f4f6; margin-top: 1rem;
}

.tabs-list { display: flex; gap: 2rem; }

.detail-tab-btn {
  display: flex; align-items: center; gap: 0.5rem; padding: 1rem 0; background: none; border: none; border-bottom: 3px solid transparent; cursor: pointer; color: #9ca3af; font-weight: 700; transition: 0.2s; position: relative; bottom: -2px;
}

.detail-tab-btn span { font-size: 0.95rem; }
.tab-count { background: #f3f4f6; padding: 0.1rem 0.5rem; border-radius: 50px; font-size: 0.75rem; }

.detail-tab-btn.active { color: #873260; border-bottom-color: #873260; }
.detail-tab-btn.active .tab-count { background: #fce7f3; color: #873260; }

/* Detail Table */
.tab-content-area { background: #fff; border-radius: 12px; padding: 0; border: 1px solid #f3f4f6; overflow: hidden; min-height: 200px; }
.detail-table { width: 100%; border-collapse: collapse; }
.detail-table th { background: #f9fafb; padding: 1.25rem; text-align: right; font-size: 0.8rem; color: #6b7280; font-weight: 700; }
.detail-table td { padding: 1.25rem; text-align: right; border-bottom: 1px solid #f3f4f6; font-size: 0.9rem; color: #374151; font-weight: 500; }
.detail-table tr:last-child td { border-bottom: none; }

.order-id { font-weight: 700; color: #873260; }
.order-amount { font-weight: 700; }

.status-badge-detail { padding: 0.4rem 1rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700; }
.status-badge-detail.delivered { background: #dcfce7; color: #16a34a; }
.status-badge-detail.pending { background: #fff7ed; color: #ea580c; }
.status-badge-detail.cancelled { background: #fef2f2; color: #dc2626; }

/* Wishlist Grid */
.wishlist-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; padding: 1.5rem; }
.wishlist-item-card { border: 1px solid #f3f4f6; border-radius: 12px; overflow: hidden; }
.wishlist-img { width: 100%; height: 150px; object-fit: cover; }
.wishlist-info { padding: 1rem; text-align: center; }
.wishlist-info h4 { font-size: 0.9rem; margin-bottom: 0.5rem; }
.wishlist-info p { font-weight: 800; color: #873260; }

/* Addresses Grid */
.addresses-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; padding: 1.5rem; }
.address-card { background: #f9fafb; border-radius: 12px; padding: 1.5rem; border: 1px solid #f3f4f6; }
.addr-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.addr-tag { background: #fff; padding: 0.2rem 0.8rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700; border: 1px solid #e5e7eb; }
.default-badge { font-size: 0.7rem; color: #16a34a; font-weight: 700; }
.addr-name { margin-bottom: 0.5rem; font-weight: 700; }
.addr-text { color: #6b7280; font-size: 0.85rem; margin-bottom: 0.5rem; }
.addr-phone { font-size: 0.85rem; font-weight: 600; direction: ltr; text-align: right; }

.wallet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
  padding: 20px;
}
.wallet-grid.two-col {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}
.wallet-card {
  border-radius: 16px;
  padding: 1.2rem 1.5rem;
  background: linear-gradient(135deg, rgba(245, 245, 255, 0.95), rgba(255, 255, 255, 0.95));
  border: 1px solid rgba(59, 130, 246, 0.25);
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.wallet-card p {
  color: #4b5563;
  margin: 0;
  font-size: 0.85rem;
}
.wallet-card strong {
  font-size: 1.55rem;
  color: #0f172a;
  font-weight: 800;
}
.wallet-card .highlight-tag {
  align-self: flex-start;
  background: rgba(59, 130, 246, 0.1);
  color: #1d4ed8;
  padding: 0.1rem 0.6rem;
  margin-bottom: 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
}
.wallet-card-head {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.wallet-icon {
  font-size: 1.4rem;
}
.experience-row {
  display: flex;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
  padding: 1.5rem;
  border: 1px dashed #e5e7eb;
}
.experience-row h4 {
  margin: 0;
  font-size: 1rem;
  color: #3730a3;
}
.section-hint {
  margin-top: 1rem;
  color: #9ca3af;
  font-size: 0.85rem;
}

/* Wallet Actions */
.wallet-actions-wrapper {
  margin-top: 2rem;
  padding: 0 20px;
}
.wallet-actions {
  display: flex;
  gap: 1rem;
}
.wallet-action-btn {
  flex: 1;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: none;
  font-family: 'Almarai', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
.charge-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}
.charge-btn:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.4), 0 4px 6px -2px rgba(16, 185, 129, 0.2);
}
.deduct-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}
.deduct-btn:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.4), 0 4px 6px -2px rgba(239, 68, 68, 0.2);
}

/* Wallet History Section */
.wallet-history-section {
  margin-top: 2rem;
  padding: 0 20px 20px;
}
.history-header {
  margin-bottom: 1.25rem;
}
.history-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #111827;
  margin: 0;
}
.wallet-table-container {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #f3f4f6;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
.wallet-table {
  width: 100%;
  border-collapse: collapse;
}
.wallet-table thead {
  background: #f9fafb;
}
.wallet-table th {
  padding: 1rem 1.25rem;
  text-align: right;
  font-size: 0.8rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #e5e7eb;
}
.wallet-table td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.9rem;
  color: #374151;
  vertical-align: middle;
}
.wallet-table tr:last-child td {
  border-bottom: none;
}
.wallet-table tr:hover td {
  background: #f9fafb;
}
.txn-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.9rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
}
.txn-badge.charge {
  background: #d1fae5;
  color: #059669;
  border: 1px solid #a7f3d0;
}
.txn-badge.deduct {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}
.amount-green {
  color: #059669;
  font-weight: 700;
  font-size: 0.95rem;
}
.amount-red {
  color: #dc2626;
  font-weight: 700;
  font-size: 0.95rem;
}
.balance-cell {
  font-weight: 700;
  color: #111827;
  font-size: 0.95rem;
}
.note-cell {
  color: #6b7280;
  font-size: 0.85rem;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.by-cell {
  color: #4b5563;
  font-size: 0.85rem;
  font-weight: 600;
}
.date-cell {
  color: #9ca3af;
  font-size: 0.8rem;
  font-weight: 600;
}
.loading-cell {
  padding: 2rem;
}
.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #e5e7eb;
  border-top-color: #873260;
  border-radius: 50%;
  margin: 0 auto 0.5rem;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.empty-cell {
  padding: 3rem 2rem;
}
.empty-cell svg {
  margin: 0 auto 1rem;
  display: block;
}
.empty-cell p {
  margin: 0;
  color: #9ca3af;
  font-size: 0.9rem;
  font-weight: 600;
}

/* Wallet Modal - Redesigned */
.wallet-modal {
  width: 100%;
  max-width: 420px;
  padding: 2rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
  direction: rtl;
}
.wallet-modal-header {
  margin-bottom: 1.75rem;
  padding-left: 2.5rem;
}
.wallet-modal-header h3 {
  font-size: 1.4rem;
  font-weight: 800;
  color: #111827;
  margin: 0 0 0.5rem 0;
}
.wallet-modal-header p {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
}
.wallet-modal-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.wallet-modal-form .form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0;
}
.wallet-modal-form .form-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.wallet-modal-form .req {
  color: #ef4444;
  font-size: 0.9rem;
}
.wallet-modal-form .form-control {
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-family: 'Almarai', sans-serif;
  font-size: 0.95rem;
  color: #111827;
  background: #fff;
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;
}
.wallet-modal-form .form-control:focus {
  border-color: #873260;
  box-shadow: 0 0 0 3px rgba(135, 50, 96, 0.1);
}
.wallet-modal-form .form-control::placeholder {
  color: #9ca3af;
  font-size: 0.85rem;
}
.wallet-modal-form .text-area {
  resize: vertical;
  min-height: 100px;
}
.wallet-modal-form .form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}
.wallet-modal-form .form-actions button {
  flex: 1;
  padding: 0.9rem;
  border-radius: 10px;
  font-family: 'Almarai', sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  outline: none;
}
.wallet-modal-form .btn-cancel {
  background: #f3f4f6;
  color: #4b5563;
}
.wallet-modal-form .btn-cancel:hover {
  background: #e5e7eb;
}
.wallet-modal-form .btn-submit {
  background: #873260;
  color: #fff;
}
.wallet-modal-form .btn-submit:hover:not(:disabled) {
  background: #6b274d;
}
.wallet-modal-form .btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.wallet-modal .modal-close {
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  background: #f3f4f6;
  border: none;
  color: #6b7280;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 10;
}
.wallet-modal .modal-close:hover {
  background: #e5e7eb;
  color: #111827;
}

.modal-content { background: #f9fafb; border-radius: 12px; width: 100%; position: relative; margin: auto; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); }
.view-content-large { max-width: 1200px; padding: 0; overflow: hidden; }

/* Large View Header */
.view-header-bar { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 2rem; background: #fff; border-bottom: 1px solid #f3f4f6; }
.right-col { display: flex; align-items: center; gap: 1rem; }
.view-title { font-size: 1.25rem; font-weight: 800; color: #111827; margin: 0; }
.view-time { font-size: 0.85rem; color: #6b7280; font-weight: 600; }
.left-col { display: flex; align-items: center; gap: 1rem; }
.modal-close { background: #f3f4f6; border: none; color: #6b7280; width: 34px; height: 34px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.modal-close:hover { background: #e5e7eb; color: #111827; }

/* Stepper */
.view-body-wrapper { padding: 2rem; }
.order-stepper { display: flex; align-items: center; justify-content: space-between; background: #fff; padding: 1.5rem 2rem; border-radius: 12px; border: 1px solid #f3f4f6; margin-bottom: 1.5rem; }
.step { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; z-index: 2; position: relative; }
.step-icon { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #fff; border: 2px solid #e5e7eb; color: #d1d5db; font-weight: bold; transition: all 0.3s; }
.step span { font-size: 0.8rem; font-weight: 700; color: #9ca3af; transition: color 0.3s; }
.step-line { flex: 1; height: 2px; background: #e5e7eb; margin: 0 1rem; margin-top: -1.2rem; transition: background 0.3s; }
.step.completed .step-icon { background: #873260; border-color: #873260; color: #fff; }
.step.completed span { color: #873260; }
.step-line.completed { background: #873260; }
.step.active .step-icon { border-color: #873260; color: #873260; box-shadow: 0 0 0 4px #fdf2f8; }
.step.active span { color: #111827; }

/* Grid layout for details */
.order-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; align-items: start; }
.content-main { display: flex; flex-direction: column; gap: 1.5rem; }
.content-side { display: flex; flex-direction: column; gap: 1.5rem; }

.card-section { background: #fff; border-radius: 12px; border: 1px solid #f3f4f6; padding: 1.5rem; box-shadow: 0 1px 2px rgba(0,0,0,0.01); }
.section-heading { font-size: 0.95rem; font-weight: 800; color: #111827; margin: 0 0 1.25rem 0; display: flex; align-items: center; gap: 0.5rem; }
.section-heading svg { color: #873260; }

/* Table inside modal */
.products-table { width: 100%; border-collapse: collapse; }
.products-table th { text-align: right; font-size: 0.8rem; color: #6b7280; font-weight: 700; padding-bottom: 1rem; border-bottom: 1px solid #f3f4f6; }
.products-table td { padding: 1rem 0; border-bottom: 1px solid #f9fafb; font-size: 0.85rem; color: #374151; vertical-align: middle; }
.products-table tr:last-child td { border-bottom: none; }
.p-info { display: flex; align-items: center; gap: 0.8rem; }
.p-info img { width: 44px; height: 44px; border-radius: 8px; object-fit: cover; border: 1px solid #e5e7eb; }
.p-texts { display: flex; flex-direction: column; gap: 2px; }
.p-name { font-weight: 700; color: #111827; }
.p-attrs-v2 { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 2px; }
.attr-tag-v2 { font-size: 10px; background: #fdf2f8; color: #873260; padding: 1px 6px; border-radius: 4px; font-weight: 700; border: 1px solid #fce7f3; }
.text-center { text-align: center !important; }

/* Info Grid */
.customer-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
.info-item { display: flex; flex-direction: column; gap: 0.3rem; }
.info-label { font-size: 0.75rem; font-weight: 700; color: #9ca3af; }
.info-val { font-size: 0.85rem; font-weight: 600; color: #374151; }
.flex-end { align-self: flex-end; }
.ltr { direction: ltr; }

/* Timeline */
.activity-timeline { display: flex; flex-direction: column; padding-top: 0.5rem; }
.timeline-item { display: flex; gap: 1.5rem; position: relative; padding-bottom: 1.5rem; }
.timeline-item:last-child { padding-bottom: 0; }
.ti-date { font-size: 0.75rem; color: #9ca3af; font-weight: 600; line-height: 1.4; width: 60px; text-align: left; }
.ti-bullet { width: 12px; height: 12px; background: #e5e7eb; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 0 1px #e5e7eb; position: relative; margin-top: 4px; z-index: 2;}
.timeline-item:not(:last-child)::before { content: ''; position: absolute; right: 88px; top: 16px; bottom: 0; width: 1px; background: #e5e7eb; }
.ti-content { flex: 1; margin-top: 2px; }
.ti-msg { margin: 0; font-size: 0.85rem; font-weight: 700; color: #374151; margin-bottom: 0.4rem; }
.ti-status { font-size: 0.7rem; padding: 0.1rem 0.5rem; border-radius: 4px; display: inline-block; }

/* Summary */
.summary-rows { display: flex; flex-direction: column; gap: 1rem; }
.s-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; font-weight: 600; color: #4b5563; border-bottom: 1px dashed #f3f4f6; padding-bottom: 0.5rem; }
.s-row:last-child { border-bottom: none; padding-bottom: 0; }
.s-row.total { font-size: 1.1rem; font-weight: 800; color: #111827; border-top: 1px solid #e5e7eb; padding-top: 1rem; border-bottom: none; }
.green-text { color: #059669; }
.text-gray { color: #6b7280; font-size: 0.8rem; }
.flex-start { justify-content: flex-start; gap: 0.5rem; border: none; padding: 0; margin-top: 0.5rem; }

/* Shipping Block */
.shipping-info { display: flex; flex-direction: column; gap: 1.25rem; }
.shi-row { display: flex; align-items: flex-start; gap: 0.8rem; }
.shi-row div { display: flex; flex-direction: column; }
.shi-label { font-size: 0.75rem; font-weight: 700; color: #9ca3af; margin-bottom: 0.2rem; }
.shi-val { font-size: 0.85rem; font-weight: 800; color: #1f2937; }

/* Gift Admin Styles */
.gift-admin-section {
  border: 1px solid #fce7f3;
  background: #fff9fc;
}
.gift-msg-admin {
  background: #fff;
  border: 1px solid #fce7f3;
  padding: 1rem;
  border-radius: 8px;
}
.gift-text-admin {
  margin: 0.5rem 0 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #873260;
  white-space: pre-wrap;
}

.order-status {
  color: #374151;
}
.order-link {
  background: none;
  border: none;
  color: #873260;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
}
.order-link:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}


/* Reviews List */
.reviews-list { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
.review-item-detail { border-bottom: 1px solid #f3f4f6; padding-bottom: 1.5rem; }
.review-item-detail:last-child { border-bottom: none; }
.review-header-row { display: flex; justify-content: space-between; margin-bottom: 0.75rem; }
.review-stars { color: #e5e7eb; font-size: 0.8rem; }
.review-stars i.active { color: #f59e0b; }
.review-date { font-size: 0.8rem; color: #9ca3af; }
.review-comment { font-size: 0.95rem; color: #374151; }


/* Alerts */
.alert-toast { position: fixed; bottom: 2rem; right: 2rem; padding: 1rem 1.5rem; border-radius: 12px; background: #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 0.75rem; transform: translateY(150%); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); z-index: 2000; font-family: 'Almarai', sans-serif; font-weight: 600; font-size: 0.9rem; }
.alert-toast.show { transform: translateY(0); }
.alert-toast.success { border-right: 4px solid #059669; color: #065f46; }
.alert-toast.error { border-right: 4px solid #dc2626; color: #991b1b; }

@media (max-width: 1200px) {
  .stats-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 768px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .detail-header { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
  .header-right { width: 100%; justify-content: space-between; }
  .tabs-list { overflow-x: auto; padding-bottom: 1rem; }
  .wishlist-grid, .addresses-grid { grid-template-columns: 1fr; }
}
</style>
