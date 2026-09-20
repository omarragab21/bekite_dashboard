<template>
  <div class="products-page" dir="rtl">
    <!-- Header -->
    <div class="page-header">
      <div class="header-titles">
        <h1 class="page-title">المنتجات والأنظمة البرمجية (Digital Products)</h1>
        <p class="page-subtitle">إدارة المنظومات والمنصات السحابية المطورة من Be Kite — تجارة، واجهة، مسار، مع موديولاتها وشاشاتها وقدرات التوسع والمشاريع المعتمدة عليها</p>
      </div>
      <button class="btn-add" @click="openAddModal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        إضافة منتج جديد
      </button>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon-wrap" style="background: rgba(147, 51, 234, 0.12); color: #9333ea;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
          </svg>
        </div>
        <div class="stat-text">
          <span class="stat-value">{{ products.length }}</span>
          <span class="stat-label">إجمالي الأنظمة الرقمية</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-wrap" style="background: rgba(16, 185, 129, 0.12); color: #10b981;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div class="stat-text">
          <span class="stat-value">{{ activeProductsCount }}</span>
          <span class="stat-label">أنظمة مفعلة للعملاء</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-wrap" style="background: rgba(245, 158, 11, 0.12); color: #f59e0b;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>
        <div class="stat-text">
          <span class="stat-value">{{ featuredCount }}</span>
          <span class="stat-label">أنظمة مميزة (Featured)</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-wrap" style="background: rgba(6, 182, 212, 0.12); color: #06b6d4;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
        </div>
        <div class="stat-text">
          <span class="stat-value">{{ totalModulesCount }}</span>
          <span class="stat-label">إجمالي موديولات الأنظمة</span>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-row">
      <div class="search-box">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input type="text" v-model="searchQuery" placeholder="البحث عن منتج رقمي، موديول، أو قطاع..." class="search-input" />
        <button v-if="searchQuery" class="clear-search-btn" @click="searchQuery = ''">✕</button>
      </div>

      <div class="filter-dropdown">
        <select v-model="selectedCategory" class="filter-select">
          <option value="">جميع القطاعات</option>
          <option v-for="cat in categories" :key="cat.slug" :value="cat.slug">{{ cat.name }}</option>
        </select>
      </div>

      <div class="filter-dropdown">
        <select v-model="selectedStatus" class="filter-select">
          <option value="">جميع الحالات</option>
          <option value="1">مفعل (Active)</option>
          <option value="0">معطل (Inactive)</option>
        </select>
      </div>
    </div>

    <!-- Products Cards Grid (Same Style as Projects & Brands) -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>جاري تحميل المنتجات والأنظمة الرقمية من الخادم...</p>
    </div>

    <div v-else-if="filteredProducts.length === 0" class="empty-state">
      <div class="empty-icon-wrap">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
        </svg>
      </div>
      <h3>لا توجد أنظمة مطابقة</h3>
      <p>لم يتم العثور على أي منتج رقمي يطابق معايير البحث والفلترة الحالية.</p>
      <button class="btn-reset-filters" @click="resetFilters">إعادة ضبط الفلاتر</button>
    </div>

    <div v-else class="products-cards-grid">
      <div
        v-for="product in filteredProducts"
        :key="product.id"
        class="product-card"
        :class="{ 'card-dragging': draggedId === product.id }"
        draggable="true"
        @dragstart="onDragStart(product)"
        @dragover.prevent="onDragOver(product)"
        @drop.prevent="onDrop(product)"
      >
        <!-- Top Branded Accent Bar -->
        <div class="product-top-bar" :style="{ background: product.accent_color || '#7c3aed' }"></div>

        <div class="product-card-inner">
          <!-- Top Row: Icon Box + Header Badges -->
          <div class="product-top">
            <div
              class="product-icon-box"
              :style="{
                backgroundColor: getAlphaColor(product.accent_color, '15'),
                borderColor: getAlphaColor(product.accent_color, '35')
              }"
            >
              <img
                v-if="product.icon_image || product.icon"
                :src="product.icon_image || product.icon"
                class="product-custom-icon"
                alt="Icon"
                @error="onImgError"
              />
              <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="product.accent_color || '#7c3aed'" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>

            <div class="product-header-meta">
              <span
                class="product-badge-tag"
                :style="{
                  color: product.accent_color || '#7c3aed',
                  backgroundColor: getAlphaColor(product.accent_color, '15'),
                  borderColor: getAlphaColor(product.accent_color, '35')
                }"
              >
                {{ product.badge || getCategoryLabel(product.category) || 'SAAS PLATFORM' }}
              </span>

              <div class="product-status-chip" :class="product.is_active ? 'active' : 'inactive'">
                <span class="status-dot"></span>
                <span>{{ product.is_active ? 'مفعل' : 'معطل' }}</span>
              </div>
            </div>
          </div>

          <!-- Titles & Category -->
          <div class="product-titles-wrap">
            <div class="product-cat-row">
              <span class="product-cat-label">📦 {{ getCategoryLabel(product.category) }}</span>
              <span class="meta-sep">·</span>
              <span class="product-slug-tag ltr-text">/{{ product.slug }}</span>
            </div>

            <h3 class="product-card-title">{{ product.name }}</h3>

            <span
              v-if="product.name_en && product.name_en.trim().toLowerCase() !== product.name.trim().toLowerCase()"
              class="product-card-sub"
              :style="{ color: product.accent_color || '#7c3aed' }"
            >
              {{ product.name_en }}
            </span>
          </div>

          <!-- Subtitle Tagline -->
          <p v-if="product.subtitle" class="product-tagline" :style="{ color: product.accent_color || '#7c3aed' }">
            {{ product.subtitle }}
          </p>

          <!-- Description -->
          <p class="product-card-desc">{{ product.description || 'نظام سحابي رقمي متكامل يوفر حلولاً مؤتمتة وإدارة شاملة للعمليات التجارية.' }}</p>

          <!-- Modules, Screens & Scale Badges -->
          <div class="product-badges-row">
            <span class="prod-badge-chip module-badge" title="موديولات ومكونات النظام">
              🧩 {{ (product.modules || []).length }} موديول
            </span>
            <span v-if="(product.gallery || []).length > 0" class="prod-badge-chip gallery-badge" title="معرض شاشات الواجهات">
              📸 {{ (product.gallery || []).length }} شاشات
            </span>
            <span class="prod-badge-chip tier-badge" title="مستويات التوسع السحابي">
              📈 3 باقات توسع
            </span>
            <span v-if="(product.related_projects || []).length > 0" class="prod-badge-chip related-badge" title="مشاريع مبنية على النظام">
              💼 {{ (product.related_projects || []).length }} مشاريع
            </span>
          </div>

          <!-- Pricing / License Meta -->
          <div v-if="product.pricing_model || product.price" class="product-pricing-row">
            <span class="price-val">{{ product.price ? product.price + ' $' : 'ترخيص مخصص' }}</span>
            <span class="price-type">/ {{ product.pricing_model || 'اشتراك سنوي أو شراء' }}</span>
          </div>
        </div>

        <!-- Footer Actions Bar -->
        <div class="product-card-footer">
          <button
            class="toggle-status-action"
            :class="product.is_active ? 'btn-deactivate' : 'btn-activate'"
            @click="toggleProductStatus(product)"
            :title="product.is_active ? 'اضغط لتعطيل المنتج' : 'اضغط للتفعيل والنشر'"
          >
            {{ product.is_active ? 'إيقاف مؤقت' : 'تفعيل المنتج' }}
          </button>

          <div class="product-action-btns">
            <button
              class="action-icon-btn preview-btn"
              @click="openQuickPreview(product)"
              title="معاينة المنتج الشاملة (9 أقسام)"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
            <button
              class="action-icon-btn edit-btn"
              @click="openEditModal(product)"
              title="تعديل بيانات وموديولات المنتج"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button
              class="action-icon-btn delete-btn"
              @click="confirmDelete(product)"
              title="حذف المنتج"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= ADD / EDIT PRODUCT MODAL ================= -->
    <div v-if="modalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-card modal-large-card">
        <div class="modal-header">
          <div class="modal-title-wrap">
            <h2 class="modal-title">{{ isEdit ? 'تعديل المنتج' : 'إضافة منتج جديد' }}</h2>
            <span class="modal-subtitle">قم بتعبئة بيانات المنتج، موديولات ما يتضمنه، معرض الشاشات، ومستويات التوسع</span>
          </div>
          <button class="close-btn" @click="closeModal" title="إغلاق">✕</button>
        </div>

        <!-- 6 Tabs Navigation Header -->
        <div class="modal-tabs-nav">
          <button
            type="button"
            class="tab-btn"
            :class="{ active: activeTab === 'general' }"
            @click="activeTab = 'general'"
          >
            📋 البيانات ونظرة عامة
          </button>
          <button
            type="button"
            class="tab-btn"
            :class="{ active: activeTab === 'built_for' }"
            @click="activeTab = 'built_for'"
          >
            👥 لمن صُمم النظام (Built For)
          </button>
          <button
            type="button"
            class="tab-btn"
            :class="{ active: activeTab === 'capabilities' }"
            @click="activeTab = 'capabilities'"
          >
            ⚡ المزايا والقدرات (What It Does)
          </button>
          <button
            type="button"
            class="tab-btn"
            :class="{ active: activeTab === 'showcase' }"
            @click="activeTab = 'showcase'"
          >
            📸 استعراض النظام (See In Action)
          </button>
          <button
            type="button"
            class="tab-btn"
            :class="{ active: activeTab === 'workflow' }"
            @click="activeTab = 'workflow'"
          >
            🔄 خطوات العمل والمزايا
          </button>
          <button
            type="button"
            class="tab-btn"
            :class="{ active: activeTab === 'advanced' }"
            @click="activeTab = 'advanced'"
          >
            📈 التوسع والباقات والربط
          </button>
        </div>

        <form @submit.prevent="saveProduct" class="modal-form-wrap">
          <div class="modal-tab-content-scroll">
            
            <!-- ================= TAB 1: General Info & Overview ================= -->
            <div v-show="activeTab === 'general'" class="tab-pane">
              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label">اسم النظام (بالعربية) *</label>
                  <input
                    type="text"
                    v-model="formData.name_ar"
                    @input="formData.name = formData.name_ar; formErrors.name = null"
                    class="form-input"
                    :class="{ 'input-error': formErrors.name }"
                    required
                    placeholder="مثال: زلمة كاشير الاحترافي"
                  />
                  <span v-if="formErrors.name" class="field-error-msg">{{ formErrors.name }}</span>
                </div>
                <div class="form-group">
                  <label class="form-label">اسم النظام (English) *</label>
                  <input
                    type="text"
                    v-model="formData.name_en"
                    class="form-input ltr-text"
                    :class="{ 'input-error': formErrors.name_en }"
                    @input="formErrors.name_en = null"
                    required
                    placeholder="e.g. Zalameh POS Pro"
                  />
                  <span v-if="formErrors.name_en" class="field-error-msg">{{ formErrors.name_en }}</span>
                </div>
              </div>

              <!-- Address Fields matching Postman JSON -->
              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label">العنوان / المقر (بالعربية) *</label>
                  <input
                    type="text"
                    v-model="formData.address_ar"
                    class="form-input"
                    placeholder="عمان، الأردن - شارع الملكة رانيا"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">العنوان / المقر (English) *</label>
                  <input
                    type="text"
                    v-model="formData.address_en"
                    class="form-input ltr-text"
                    placeholder="Amman, Jordan - Queen Rania St"
                  />
                </div>
              </div>

              <div class="form-grid-3">
                <div class="form-group">
                  <label class="form-label">الرابط المخصص (Slug) *</label>
                  <input type="text" v-model="formData.slug" class="form-input ltr-text" placeholder="zalameh-pos-pro" />
                </div>
                <div class="form-group">
                  <label class="form-label">القطاع / التصنيف (Category ID) *</label>
                  <select v-model="formData.category_id" class="form-input">
                    <option v-for="cat in categories" :key="cat.id || cat.slug" :value="cat.id || 1">{{ cat.name }} (ID: {{ cat.id || 1 }})</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">اللون المميز (Color Hex) *</label>
                  <div class="color-wrap">
                    <input type="color" v-model="formData.color" @input="formData.accent_color = formData.color" class="color-input" />
                    <input type="text" v-model="formData.color" @input="formData.accent_color = formData.color" class="form-input ltr-text" placeholder="#1E3A8A" />
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">الوصف التفصيلي للمنظومة (بالعربية) *</label>
                <textarea v-model="formData.description_ar" @input="formData.description = formData.description_ar" class="form-textarea" rows="3" placeholder="نظام نقاط بيع سحابي متكامل يخدم قطاع التجزئة والمطاعم مع مزامنة فورية وإصدار فواتير ضريبية."></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">الوصف التفصيلي (English) *</label>
                <textarea v-model="formData.description_en" class="form-textarea ltr-text" rows="2" placeholder="All-in-one cloud POS system tailored for retail and restaurants with instant sync and e-invoicing compliance."></textarea>
              </div>

              <!-- Overview Section (ما هو النظام؟) -->
              <div class="form-sub-card mt-4">
                <div class="sub-card-header">
                  <span class="sub-card-title">📖 قسم نظرة عامة (Overview Paragraphs & Tablet Image)</span>
                  <span class="sub-card-badge">يظهر في موقع Be Kite</span>
                </div>
                <div class="form-grid-2">
                  <div class="form-group">
                    <label class="form-label">الفقرة الأولى (Overview Paragraph 1) *</label>
                    <textarea v-model="formData.overview_paragraph1" class="form-textarea" rows="3" placeholder="Empower your daily frontline operations with instantaneous order routing..."></textarea>
                  </div>
                  <div class="form-group">
                    <label class="form-label">الفقرة الثانية (Overview Paragraph 2) *</label>
                    <textarea v-model="formData.overview_paragraph2" class="form-textarea" rows="3" placeholder="Designed to function offline with zero disruption to checkout..."></textarea>
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">صورة التابلت الاستعراضية (Overview Tablet Image File / URL)</label>
                  <div class="upload-dual-mode">
                    <input type="file" accept="image/*" @change="e => formData.overview_tablet_image_file = e.target.files[0]" class="form-input file-input mb-1" />
                    <input type="text" v-model="formData.overview_tablet_image_url" class="form-input ltr-text" placeholder="/images/products/tijara_overview.png" />
                  </div>
                </div>
              </div>

              <div class="form-grid-2 mt-4">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="formData.is_featured_product" :true-value="1" :false-value="0" />
                  <span>تمييز المنتج في الصفحة الرئيسية (Featured Product)</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" v-model="formData.is_active" :true-value="1" :false-value="0" />
                  <span>نشر وتفعيل المنتج لجميع العملاء (Active)</span>
                </label>
              </div>
            </div>

            <!-- ================= TAB 2: Built For ================= -->
            <div v-show="activeTab === 'built_for'" class="tab-pane">
              <div class="section-notice">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span>قسم لمن صُمم النظام (Built For Businesses That Sell Online) — بطاقات الأدوار الأربعة المخصصة لكل دور في منظومة التجارة الإلكترونية.</span>
              </div>

              <div v-if="formData.built_for" class="built-for-editor">
                <div class="form-grid-2 mb-4">
                  <div class="form-group">
                    <label class="form-label">عنوان القسم الرئيسي</label>
                    <input type="text" v-model="formData.built_for.title" class="form-input" placeholder="صُمم خصيصاً للشركات التي تبيع عبر الإنترنت" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">العنوان الفرعي للقسم</label>
                    <input type="text" v-model="formData.built_for.subtitle" class="form-input" placeholder="مسارات عمل مخصصة لكل دور ومسؤولية..." />
                  </div>
                </div>

                <div class="built-for-grid-editor">
                  <div v-for="(item, bIdx) in formData.built_for.items" :key="bIdx" class="persona-edit-card">
                    <div class="persona-card-header">
                      <span class="persona-num">الدور {{ bIdx + 1 }}: {{ item.title }}</span>
                      <span class="persona-icon-badge">
                        {{ item.icon === 'shopping-cart' ? '🛒' : (item.icon === 'truck' ? '🚚' : (item.icon === 'briefcase' ? '💼' : '🎯')) }}
                      </span>
                    </div>
                    <div class="form-group">
                      <label class="form-label">عنوان الدور / الفئة *</label>
                      <input type="text" v-model="item.title" class="form-input" placeholder="مثال: المتاجر الإلكترونية" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">شرح القيمة المضافة لهذا الدور *</label>
                      <textarea v-model="item.desc" class="form-textarea" rows="2" placeholder="توسيع مبيعات متجرك متعدد الأقسام..."></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ================= TAB 3: Key Capabilities (What It Does) ================= -->
            <div v-show="activeTab === 'capabilities'" class="tab-pane">
              <div class="section-notice">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span>المزايا والقدرات التشغيلية (What It Does / Key Capabilities) — القدرات الستة الأساسية لنظام تجارة من الكتالوج إلى التوسع متعدد القنوات.</span>
              </div>

              <div v-if="formData.what_it_does" class="capabilities-editor">
                <div class="form-grid-2 mb-4">
                  <div class="form-group">
                    <label class="form-label">عنوان قسم القدرات</label>
                    <input type="text" v-model="formData.what_it_does.title" class="form-input" placeholder="ما الذي يقدمه نظام تجارة؟" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">العنوان الفرعي</label>
                    <input type="text" v-model="formData.what_it_does.subtitle" class="form-input" placeholder="كل ما تحتاجه لإدارة عمليات البيع والتجارة..." />
                  </div>
                </div>

                <div class="capabilities-grid-editor">
                  <div v-for="(cap, cIdx) in formData.what_it_does.items" :key="cIdx" class="cap-edit-card">
                    <div class="cap-card-header">
                      <span class="cap-num">ميزة {{ cIdx + 1 }}</span>
                      <button type="button" class="btn-del-mini" @click="formData.what_it_does.items.splice(cIdx, 1)">✕</button>
                    </div>
                    <div class="form-group">
                      <label class="form-label">اسم القدرة / الميزة *</label>
                      <input type="text" v-model="cap.title" class="form-input" placeholder="مثال: إدارة الكتالوج والمنتجات" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">شرح الميزة *</label>
                      <textarea v-model="cap.desc" class="form-textarea" rows="2" placeholder="توحيد المنتجات والخيارات والأسعار..."></textarea>
                    </div>
                  </div>
                </div>

                <button type="button" class="btn-add-dashed mt-3" @click="formData.what_it_does.items.push({ icon: 'layers', title: '', desc: '' })">
                  + إضافة قدرة تشغيلية جديدة
                </button>
              </div>
            </div>

            <!-- ================= TAB 4: See It In Action (Showcase) ================= -->
            <div v-show="activeTab === 'showcase'" class="tab-pane">
              <div class="section-notice">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span>استعراض النظام أثناء العمل (See It In Action) — الشاشة الرئيسية الكبيرة + شاشات المعاينة التفاعلية الثلاثة (Rapid Checkout Terminal, Real-Time Sales Telemetry, Kitchen Display System).</span>
              </div>

              <div class="form-group">
                <label class="form-label">الصورة الرئيسية لشاشة النظام (Main Action Showcase Image File / URL) *</label>
                <div class="upload-dual-mode">
                  <input type="file" accept="image/*" @change="e => formData.see_in_action_main_image_file = e.target.files[0]" class="form-input file-input mb-1" />
                  <input type="text" v-model="formData.action_main_image" class="form-input ltr-text" placeholder="/images/products/tijara_action_main.png" />
                </div>
                <div v-if="formData.action_main_image" class="single-preview-wrap mt-2">
                  <img :src="formData.action_main_image" alt="Main Showcase Preview" @error="onImgError" />
                </div>
              </div>

              <div class="sub-section-title mt-4">
                <span>📸 الشاشات الفرعية الثلاثة التفاعلية (Action Screens 1, 2, 3)</span>
              </div>

              <div class="action-screens-grid-editor">
                <!-- Screen 1 -->
                <div class="action-screen-card">
                  <div class="screen-card-header">
                    <span class="screen-num">شاشة 1: {{ formData.see_in_action_screen_one_title_ar || 'شاشة الكاشير السريعة' }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">عنوان الشاشة 1 (العربية) *</label>
                    <input type="text" v-model="formData.see_in_action_screen_one_title_ar" class="form-input" placeholder="شاشة الكاشير السريعة" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">عنوان الشاشة 1 (English) *</label>
                    <input type="text" v-model="formData.see_in_action_screen_one_title_en" class="form-input ltr-text" placeholder="Rapid Checkout Terminal" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">ملف صورة الشاشة 1</label>
                    <input type="file" accept="image/*" @change="e => formData.see_in_action_screen_one_file = e.target.files[0]" class="form-input file-input mb-1" />
                    <input type="text" v-model="formData.see_in_action_screen_one_url" class="form-input ltr-text" placeholder="/images/products/tijara_action_1.png" />
                  </div>
                </div>

                <!-- Screen 2 -->
                <div class="action-screen-card">
                  <div class="screen-card-header">
                    <span class="screen-num">شاشة 2: {{ formData.see_in_action_screen_two_title_ar || 'لوحة تحليلات المبيعات الفورية' }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">عنوان الشاشة 2 (العربية) *</label>
                    <input type="text" v-model="formData.see_in_action_screen_two_title_ar" class="form-input" placeholder="لوحة تحليلات المبيعات الفورية" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">عنوان الشاشة 2 (English) *</label>
                    <input type="text" v-model="formData.see_in_action_screen_two_title_en" class="form-input ltr-text" placeholder="Real-Time Sales Telemetry" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">ملف صورة الشاشة 2</label>
                    <input type="file" accept="image/*" @change="e => formData.see_in_action_screen_two_file = e.target.files[0]" class="form-input file-input mb-1" />
                    <input type="text" v-model="formData.see_in_action_screen_two_url" class="form-input ltr-text" placeholder="/images/products/tijara_action_2.png" />
                  </div>
                </div>

                <!-- Screen 3 -->
                <div class="action-screen-card">
                  <div class="screen-card-header">
                    <span class="screen-num">شاشة 3: {{ formData.see_in_action_screen_three_title_ar || 'شاشة تحكم المطبخ والطلبات' }}</span>
                  </div>
                  <div class="form-group">
                    <label class="form-label">عنوان الشاشة 3 (العربية) *</label>
                    <input type="text" v-model="formData.see_in_action_screen_three_title_ar" class="form-input" placeholder="شاشة تحكم المطبخ والطلبات" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">عنوان الشاشة 3 (English) *</label>
                    <input type="text" v-model="formData.see_in_action_screen_three_title_en" class="form-input ltr-text" placeholder="Kitchen Display System (KDS)" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">ملف صورة الشاشة 3</label>
                    <input type="file" accept="image/*" @change="e => formData.see_in_action_screen_three_file = e.target.files[0]" class="form-input file-input mb-1" />
                    <input type="text" v-model="formData.see_in_action_screen_three_url" class="form-input ltr-text" placeholder="/images/products/tijara_action_3.png" />
                  </div>
                </div>
              </div>
            </div>

            <!-- ================= TAB 5: How It Works & Why Choose ================= -->
            <div v-show="activeTab === 'workflow'" class="tab-pane">
              <!-- How It Works -->
              <div class="sub-card-section">
                <div class="sub-card-header">
                  <span class="sub-card-title">🔄 كيف يعمل النظام (How It Works - 4 Simple Steps)</span>
                </div>
                <div v-if="formData.how_it_works" class="steps-grid-editor">
                  <div v-for="(st, stIdx) in formData.how_it_works.steps" :key="stIdx" class="step-edit-card">
                    <span class="step-badge-num">{{ st.num }}</span>
                    <div class="form-group">
                      <label class="form-label">عنوان الخطوة *</label>
                      <input type="text" v-model="st.title" class="form-input" placeholder="مثال: الإعداد والتهيئة" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">شرح الخطوة *</label>
                      <textarea v-model="st.desc" class="form-textarea" rows="2" placeholder="تجهيز المتجر واستيراد المنتجات..."></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Why Choose Tijara -->
              <div class="sub-card-section mt-4">
                <div class="sub-card-header">
                  <span class="sub-card-title">🏆 المزايا التنافسية (Why Teams Choose Tijara - 4 Cards)</span>
                </div>
                <div v-if="formData.why_choose" class="why-choose-grid-editor">
                  <div v-for="(why, wIdx) in formData.why_choose.items" :key="wIdx" class="why-edit-card">
                    <div class="form-group">
                      <label class="form-label">ميزة {{ wIdx + 1 }} - العنوان *</label>
                      <input type="text" v-model="why.title" class="form-input" placeholder="مثال: إطلاق سريع" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">الشرح والتفاصيل *</label>
                      <textarea v-model="why.desc" class="form-textarea" rows="2" placeholder="ابدأ العمل خلال أيام معدودة..."></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Bottom CTA -->
              <div class="sub-card-section mt-4">
                <div class="sub-card-header">
                  <span class="sub-card-title">📣 دعوة اتخاذ إجراء (Bottom CTA Banner)</span>
                </div>
                <div v-if="formData.bottom_cta" class="form-grid-2">
                  <div class="form-group">
                    <label class="form-label">عنوان البانر</label>
                    <input type="text" v-model="formData.bottom_cta.title" class="form-input" placeholder="جاهز لاستكشاف نظام تجارة لمتجرك؟" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">نص زر الطلب</label>
                    <input type="text" v-model="formData.bottom_cta.button_text" class="form-input" placeholder="طلب عرض توضيحي" />
                  </div>
                  <div class="form-group" style="grid-column: 1 / -1;">
                    <label class="form-label">الوصف التشجيعي للبانر</label>
                    <textarea v-model="formData.bottom_cta.description" class="form-textarea" rows="2" placeholder="تواصل مع خبرائنا واحصل على عرض توضيحي..."></textarea>
                  </div>
                </div>
              </div>
            </div>

            <!-- ================= TAB 6: Scalability & Editions & Projects ================= -->
            <div v-show="activeTab === 'advanced'" class="tab-pane">
              <div class="section-notice">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span>مستويات التوسع السحابي، الباقات القطاعية، والمشاريع المعتمدة على هذا المنتج.</span>
              </div>

              <!-- Scalability Tiers -->
              <div class="sub-card-section mb-4">
                <div class="sub-card-header">
                  <span class="sub-card-title">📈 مستويات التوسع (Scalability Tiers)</span>
                </div>
                <div class="scale-edit-list">
                  <div v-for="(tier, tIdx) in formData.scalability" :key="tIdx" class="scale-edit-card">
                    <div class="form-grid-2">
                      <div class="form-group">
                        <label class="form-label">اسم المستوى</label>
                        <input type="text" v-model="tier.title" class="form-input" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">الميزة البارزة</label>
                        <input type="text" v-model="tier.highlight" class="form-input" />
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">المواصفات والقدرة</label>
                      <input type="text" v-model="tier.specs" class="form-input" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Editions -->
              <div class="sub-card-section mb-4">
                <div class="sub-card-header">
                  <span class="sub-card-title">🏢 الباقات والقطاعات التابعة للمنتج</span>
                  <button type="button" class="btn-add-sm" @click="addEdition">+ إضافة باقة</button>
                </div>
                <div class="editions-edit-list">
                  <div v-for="(ed, eIdx) in formData.editions" :key="eIdx" class="edition-edit-card">
                    <div class="edition-card-header">
                      <span class="ed-title">باقة {{ eIdx + 1 }}: {{ ed.name }}</span>
                      <button type="button" class="btn-del-mini" @click="removeEdition(eIdx)">✕</button>
                    </div>
                    <div class="form-grid-2">
                      <div class="form-group">
                        <label class="form-label">اسم الباقة بالعربية</label>
                        <input type="text" v-model="ed.name" class="form-input" />
                      </div>
                      <div class="form-group">
                        <label class="form-label">شرح الباقة</label>
                        <input type="text" v-model="ed.description" class="form-input" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Related Projects -->
              <div class="sub-card-section">
                <div class="sub-card-header">
                  <span class="sub-card-title">💼 المشاريع ودراسات الحالة المعتمدة على هذا النظام</span>
                </div>
                <div class="projects-select-grid">
                  <div
                    v-for="proj in allPortfolioProjects"
                    :key="proj.id || proj.slug"
                    class="project-select-card"
                    :class="{ selected: isProjectSelected(proj.slug || proj.id) }"
                    @click="toggleRelatedProject(proj.slug || proj.id)"
                  >
                    <div class="project-card-chk">
                      <input type="checkbox" :checked="isProjectSelected(proj.slug || proj.id)" />
                    </div>
                    <div class="project-card-thumb">
                      <img :src="proj.web_image || proj.image || '/images/default_project.jpg'" alt="" @error="onImgError" />
                    </div>
                    <div class="project-card-body">
                      <span class="proj-title-text">{{ proj.title }}</span>
                      <span class="proj-client-text">{{ proj.client_name }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Modal Footer Navigation & Actions -->
          <div class="modal-footer">
            <div class="modal-footer-nav">
              <button
                v-if="activeTab !== 'general'"
                type="button"
                class="btn-nav-step"
                @click="goToPrevTab"
              >
                <!-- Arrow on RIGHT side in RTL (pointing right) -->
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
                <span>الخطوة السابقة</span>
              </button>
              <button
                v-if="activeTab !== 'advanced'"
                type="button"
                class="btn-nav-step btn-nav-next"
                @click="goToNextTab"
              >
                <span>الخطوة التالية</span>
                <!-- Arrow on LEFT side in RTL (pointing left) -->
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                </svg>
              </button>
            </div>

            <div class="modal-footer-actions">
              <button type="button" class="btn-cancel" @click="closeModal">إلغاء</button>
              <button type="submit" class="btn-save" :disabled="saving">
                <span v-if="saving" class="spinner-mini"></span>
                <span>{{ saving ? 'جاري الحفظ...' : (isEdit ? 'تحديث النظام الرقمي' : 'حفظ ونشر النظام') }}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- ================= QUICK PRODUCT PREVIEW MODAL (1:1 WITH BEKITE WEBSITE) ================= -->
    <div v-if="previewModalOpen && previewProduct" class="modal-overlay" @click.self="previewModalOpen = false">
      <div class="modal-card modal-preview-card modal-preview-case-study">
        <button class="preview-close-btn" @click="previewModalOpen = false" title="إغلاق المعاينة">✕</button>

        <div class="preview-scrollable-content">
          <!-- 1. Hero Header Section -->
          <div class="preview-hero-header" :style="{ background: `linear-gradient(135deg, ${previewProduct.accent_color || '#1e3a8a'}, #0a0f1d)` }">
            <div class="preview-hero-content">
              <span class="preview-client-badge">{{ previewProduct.badge || previewProduct.category_name || 'نظام رقمي سحابي' }}</span>
              <h2 class="preview-hero-title">{{ previewProduct.name }}</h2>
              <span v-if="previewProduct.name_en" class="preview-hero-sub ltr-text" style="display:block; font-size: 1.05rem; font-weight: 700; margin-top: 0.2rem; opacity: 0.95;">
                {{ previewProduct.name_en }}
              </span>
              <p v-if="previewProduct.subtitle" class="preview-hero-sub">{{ previewProduct.subtitle }}</p>
              <p v-if="previewProduct.description" class="preview-hero-desc">{{ previewProduct.description }}</p>
              
              <div class="preview-meta-chips">
                <span v-if="previewProduct.address" class="preview-chip">
                  📍 {{ previewProduct.address }}
                </span>
                <span class="preview-chip status-chip" :class="previewProduct.is_active ? 'active' : 'inactive'">
                  {{ previewProduct.is_active ? '● منظومة مفعلة ونشطة' : '○ مسودة' }}
                </span>
                <span v-if="previewProduct.is_featured" class="preview-chip" style="background: rgba(245, 158, 11, 0.25); color: #fbbf24;">
                  ⭐ نظام مميز (Featured)
                </span>
                <a v-if="previewProduct.demo_url" :href="previewProduct.demo_url" target="_blank" class="preview-demo-chip">
                  طلب عرض توضيحي حي ↗
                </a>
              </div>
            </div>

            <div v-if="previewProduct.laptop_mockup || previewProduct.action_main_image || previewProduct.image" class="preview-hero-mockup-wrap">
              <img :src="previewProduct.laptop_mockup || previewProduct.action_main_image || previewProduct.image" :alt="previewProduct.name" @error="onImgError" />
            </div>
          </div>

          <div class="preview-body">
            <!-- 2. Overview Section -->
            <div v-if="previewProduct.overview && (previewProduct.overview.p1 || previewProduct.overview.p2 || previewProduct.overview.image)" class="preview-section overview-preview-section">
              <div class="section-pill-tag">{{ previewProduct.overview.pill || 'نظرة عامة' }}</div>
              <h3 class="preview-sec-title">{{ previewProduct.overview.title || ('ما هو نظام ' + previewProduct.name + '؟') }}</h3>
              
              <div class="overview-content-grid">
                <div class="overview-text-col">
                  <p v-if="previewProduct.overview.p1" class="overview-p">{{ previewProduct.overview.p1 }}</p>
                  <p v-if="previewProduct.overview.p2" class="overview-p mt-3">{{ previewProduct.overview.p2 }}</p>
                </div>
                <div v-if="previewProduct.overview.image" class="overview-image-col">
                  <img :src="previewProduct.overview.image" alt="Overview Tablet Display" @error="onImgError" />
                </div>
              </div>
            </div>

            <!-- 3. Built For Businesses Section -->
            <div v-if="previewProduct.built_for?.items?.length" class="preview-section">
              <div class="section-pill-tag">{{ previewProduct.built_for.pill || 'لمن صُمم النظام' }}</div>
              <h3 class="preview-sec-title">{{ previewProduct.built_for.title || 'لمن صُمم هذا النظام؟' }}</h3>
              <p v-if="previewProduct.built_for.subtitle" class="preview-sec-sub">{{ previewProduct.built_for.subtitle }}</p>

              <div class="preview-built-for-grid">
                <div v-for="(item, bIdx) in previewProduct.built_for.items" :key="bIdx" class="built-for-card">
                  <div class="built-for-icon">
                    {{ item.icon === 'shopping-cart' ? '🛒' : (item.icon === 'truck' ? '🚚' : (item.icon === 'briefcase' ? '💼' : (item.icon === 'target' ? '🎯' : '⚡'))) }}
                  </div>
                  <h4 class="built-for-card-title">{{ item.title }}</h4>
                  <p class="built-for-card-desc">{{ item.desc }}</p>
                </div>
              </div>
            </div>

            <!-- 4. Key Capabilities (What It Does) Section -->
            <div v-if="previewProduct.what_it_does?.items?.length" class="preview-section">
              <div class="section-pill-tag">{{ previewProduct.what_it_does.pill || 'المزايا والقدرات' }}</div>
              <h3 class="preview-sec-title">{{ previewProduct.what_it_does.title || 'المزايا والقدرات الأساسية' }}</h3>
              <p v-if="previewProduct.what_it_does.subtitle" class="preview-sec-sub">{{ previewProduct.what_it_does.subtitle }}</p>

              <div class="preview-capabilities-grid">
                <div v-for="(cap, cIdx) in previewProduct.what_it_does.items" :key="cIdx" class="capability-card">
                  <div class="cap-icon-box">
                    {{ getIconSymbol(cap.icon || 'layers') }}
                  </div>
                  <h4 class="cap-title">{{ cap.title }}</h4>
                  <p class="cap-desc">{{ cap.desc }}</p>
                </div>
              </div>
            </div>

            <!-- 5. See It In Action Section (Main Screen + Interactive Sub-Screens) -->
            <div v-if="previewProduct.action_main_image || previewProduct.action_screens?.length" class="preview-section">
              <div class="section-pill-tag">استعراض النظام</div>
              <h3 class="preview-sec-title">شاهد النظام أثناء العمل (See It In Action)</h3>
              
              <div v-if="previewProduct.action_main_image" class="preview-action-main-img">
                <img :src="previewProduct.action_main_image" alt="Main Action Screen" @error="onImgError" />
              </div>

              <div v-if="previewProduct.action_screens?.length" class="preview-action-screens-grid mt-4">
                <div v-for="(screen, sIdx) in previewProduct.action_screens" :key="sIdx" class="action-screen-preview-card">
                  <div class="screen-preview-thumb">
                    <img :src="screen.image" :alt="screen.title" @error="onImgError" />
                  </div>
                  <span class="screen-preview-title">{{ screen.title_ar || screen.title }}</span>
                </div>
              </div>
            </div>

            <!-- 6. How It Works Section -->
            <div v-if="previewProduct.how_it_works?.steps?.length" class="preview-section">
              <div class="section-pill-tag">{{ previewProduct.how_it_works.pill || 'كيف يعمل' }}</div>
              <h3 class="preview-sec-title">{{ previewProduct.how_it_works.title || 'سهل في البداية، قوي وقابل للتوسع' }}</h3>
              <p v-if="previewProduct.how_it_works.subtitle" class="preview-sec-sub">{{ previewProduct.how_it_works.subtitle }}</p>

              <div class="preview-steps-grid">
                <div v-for="(st, stIdx) in previewProduct.how_it_works.steps" :key="stIdx" class="preview-step-card">
                  <span class="step-num-pill">{{ st.num || (stIdx + 1) }}</span>
                  <h4 class="step-title">{{ st.title }}</h4>
                  <p class="step-desc">{{ st.desc }}</p>
                </div>
              </div>
            </div>

            <!-- 7. Why Teams Choose Section -->
            <div v-if="previewProduct.why_choose?.items?.length" class="preview-section">
              <div class="section-pill-tag">{{ previewProduct.why_choose.pill || 'المزايا التنافسية' }}</div>
              <h3 class="preview-sec-title">{{ previewProduct.why_choose.title || ('لماذا تختار الشركات نظام ' + previewProduct.name + '؟') }}</h3>

              <div class="preview-why-grid">
                <div v-for="(why, wIdx) in previewProduct.why_choose.items" :key="wIdx" class="preview-why-card">
                  <h4 class="why-card-title">✓ {{ why.title }}</h4>
                  <p class="why-card-desc">{{ why.desc }}</p>
                </div>
              </div>
            </div>

            <!-- 8. Scalability Tiers -->
            <div v-if="(previewProduct.scalability || []).length > 0" class="preview-section">
              <h3 class="preview-sec-title">📈 مستويات التوسع (Startup to Enterprise Scale)</h3>
              <div class="preview-scalability-grid">
                <div v-for="(tier, tIdx) in previewProduct.scalability" :key="tIdx" class="preview-scale-card" :class="tier.tier || 'startup'">
                  <div class="scale-header">
                    <span class="scale-emoji">{{ tier.tier === 'startup' ? '🚀' : (tier.tier === 'growth' ? '📈' : '🏢') }}</span>
                    <span class="scale-title">{{ tier.title }}</span>
                  </div>
                  <div class="scale-highlight">{{ tier.highlight }}</div>
                  <p class="scale-specs">{{ tier.specs }}</p>
                </div>
              </div>
            </div>

            <!-- 9. Editions & Packages -->
            <div v-if="(previewProduct.editions || []).length > 0" class="preview-section">
              <h3 class="preview-sec-title">🏢 الباقات والقطاعات التابعة للمنتج</h3>
              <div class="preview-editions-grid">
                <div v-for="(ed, eIdx) in previewProduct.editions" :key="eIdx" class="preview-edition-card">
                  <span class="edition-icon">{{ getIconSymbol(ed.icon || 'package') }}</span>
                  <div class="edition-texts">
                    <h4 class="edition-name">{{ ed.name }}</h4>
                    <p class="edition-desc">{{ ed.description }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 10. Linked Projects -->
            <div v-if="(previewProduct.related_projects || []).length > 0" class="preview-section">
              <h3 class="preview-sec-title">💼 مشاريع معتمدة على هذا النظام</h3>
              <div class="preview-linked-projects-row">
                <div v-for="projSlug in previewProduct.related_projects" :key="projSlug" class="linked-proj-chip">
                  <span>🌟 {{ getProjectTitle(projSlug) }}</span>
                </div>
              </div>
            </div>

            <!-- 11. Bottom CTA Section -->
            <div v-if="previewProduct.bottom_cta" class="preview-bottom-cta-banner" :style="{ background: `linear-gradient(135deg, ${previewProduct.accent_color || '#1e3a8a'}, #0a0f1d)` }">
              <h3 class="cta-banner-title">{{ previewProduct.bottom_cta.title }}</h3>
              <p class="cta-banner-desc">{{ previewProduct.bottom_cta.description }}</p>
              <button type="button" class="cta-banner-btn" @click="editFromPreview(previewProduct)">
                {{ previewProduct.bottom_cta.button_text || 'تعديل بيانات المنتج ✎' }}
              </button>
            </div>
          </div>
        </div>

        <div class="preview-footer-bar">
          <button type="button" class="btn-cancel" @click="previewModalOpen = false">إغلاق</button>
          <button type="button" class="btn-edit-from-preview" @click="editFromPreview(previewProduct)">تعديل بيانات المنتج ✎</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ProductService } from '../services/ProductService';
import { ProjectService } from '../services/ProjectService';
import { useToast } from '../composables/useToast';

const { success, error: toastError } = useToast();

const loading = ref(true);
const saving = ref(false);
const products = ref([]);
const categories = ref([]);
const allPortfolioProjects = ref([]);

const searchQuery = ref('');
const selectedCategory = ref('');
const selectedStatus = ref('');

const modalOpen = ref(false);
const isEdit = ref(false);
const currentEditId = ref(null);
const activeTab = ref('general');
const draggedId = ref(null);

// Preview modal
const previewModalOpen = ref(false);
const previewProduct = ref(null);

// Add item helpers
const newGalleryUrl = ref('');
const newGalleryTitle = ref('');
const newGalleryDevice = ref('Desktop Dashboard');

// Default initial form state matching Postman schema 100%
const defaultForm = () => ({
  name: '',
  name_ar: '',
  name_en: '',
  address_ar: '',
  address_en: '',
  description: '',
  description_ar: '',
  description_en: '',
  category_id: 1,
  category: 'ecommerce',
  slug: '',
  color: '#1E3A8A',
  accent_color: '#1E3A8A',
  is_featured_product: 1,
  is_featured: 1,
  is_active: 1,
  overview_paragraph1: '',
  overview_paragraph2: '',
  overview_tablet_image_file: null,
  overview_tablet_image_url: '',
  built_for_main_section_title: '',
  built_for_secondary_section_title: '',
  built_for_data: [],
  built_for: {
    pill: 'لمن صُمم النظام',
    pill_en: 'WHO IS IT FOR',
    title: '',
    title_en: '',
    subtitle: '',
    items: []
  },
  what_it_does_main_title: '',
  what_it_does_secondary_title: '',
  what_it_does_data: [],
  what_it_does: {
    pill: 'المزايا والقدرات',
    pill_en: 'KEY CAPABILITIES',
    title: '',
    title_en: '',
    subtitle: '',
    items: []
  },
  see_in_action_main_image_file: null,
  action_main_image: '',
  see_in_action_screen_one_title_ar: '',
  see_in_action_screen_one_title_en: '',
  see_in_action_screen_one_file: null,
  see_in_action_screen_one_url: '',
  see_in_action_screen_two_title_ar: '',
  see_in_action_screen_two_title_en: '',
  see_in_action_screen_two_file: null,
  see_in_action_screen_two_url: '',
  see_in_action_screen_three_title_ar: '',
  see_in_action_screen_three_title_en: '',
  see_in_action_screen_three_file: null,
  see_in_action_screen_three_url: '',
  action_screens: [],
  how_it_works_data: [],
  how_it_works: {
    pill: 'كيف يعمل',
    pill_en: 'HOW IT WORKS',
    title: '',
    title_en: '',
    subtitle: '',
    steps: []
  },
  why_teams_data: [],
  why_choose: {
    pill: 'المزايا التنافسية',
    pill_en: 'ADVANTAGES',
    title: '',
    title_en: '',
    subtitle: '',
    items: []
  },
  scalability_tiers: [],
  scalability: [],
  packages: [],
  editions: [],
  bottom_cta: {
    title: '',
    title_en: '',
    description: '',
    button_text: '',
    button_href: ''
  },
  modules: [],
  gallery: [],
  related_projects: [],
  image: '',
  laptop_mockup: '',
  demo_url: '',
  features: [],
  features_en: []
});

// Quick Fill Postman 1:1 JSON Template for Zalameh POS Pro
function loadPostmanJsonTemplate() {
  const sampleSlug = `zalameh-pos-pro-${Date.now().toString().slice(-4)}`;
  formData.value = {
    ...defaultForm(),
    name: 'زلمة كاشير الاحترافي',
    name_ar: 'زلمة كاشير الاحترافي',
    name_en: 'Zalameh POS Pro',
    address_ar: 'عمان، الأردن - شارع الملكة رانيا',
    address_en: 'Amman, Jordan - Queen Rania St',
    description: 'نظام نقاط بيع سحابي متكامل يخدم قطاع التجزئة والمطاعم مع مزامنة فورية وإصدار فواتير ضريبية.',
    description_ar: 'نظام نقاط بيع سحابي متكامل يخدم قطاع التجزئة والمطاعم مع مزامنة فورية وإصدار فواتير ضريبية.',
    description_en: 'All-in-one cloud POS system tailored for retail and restaurants with instant sync and e-invoicing compliance.',
    category_id: categories.value?.[0]?.id || 1,
    slug: sampleSlug,
    color: '#1E3A8A',
    accent_color: '#1E3A8A',
    is_featured_product: 1,
    is_featured: 1,
    is_active: 1,
    overview_paragraph1: 'Empower your daily frontline operations with instantaneous order routing, digital payment processing, and cross-channel sync.',
    overview_paragraph2: 'Designed to function offline with zero disruption to checkout, queuing up transactions until connectivity restores.',
    overview_tablet_image_file: null,
    overview_tablet_image_url: '/images/products/tijara_overview.png',
    built_for_main_section_title: 'Tailored for Modern Retail & Fast Dining',
    built_for_secondary_section_title: 'Engineered for speed, durability, and multi-branch scalability',
    built_for_data: [
      {
        title: 'المطاعم والكافيهات',
        description: 'إدارة الطاولات، تجزئة الفاتورة، وربط شاشات عرض المطبخ.'
      }
    ],
    built_for: {
      pill: 'لمن صُمم النظام',
      pill_en: 'WHO IS IT FOR',
      title: 'Tailored for Modern Retail & Fast Dining',
      subtitle: 'Engineered for speed, durability, and multi-branch scalability',
      items: [
        {
          title: 'المطاعم والكافيهات',
          desc: 'إدارة الطاولات، تجزئة الفاتورة، وربط شاشات عرض المطبخ.',
          icon: 'shopping-cart'
        }
      ]
    },
    what_it_does_main_title: 'Unified Front-to-Back Operations',
    what_it_does_secondary_title: 'Everything from ticket dispatch to financial ledger reconciliation',
    what_it_does_data: [
      {
        title: 'Offline-First Checkout',
        description: 'Zero downtime even during network interruptions with auto-sync fallback.'
      }
    ],
    what_it_does: {
      pill: 'المزايا والقدرات',
      pill_en: 'KEY CAPABILITIES',
      title: 'Unified Front-to-Back Operations',
      subtitle: 'Everything from ticket dispatch to financial ledger reconciliation',
      items: [
        {
          title: 'Offline-First Checkout',
          desc: 'Zero downtime even during network interruptions with auto-sync fallback.',
          icon: 'layers'
        }
      ]
    },
    see_in_action_main_image_file: null,
    action_main_image: '/images/products/tijara_action_main.png',
    see_in_action_screen_one_title_ar: 'شاشة الكاشير السريعة',
    see_in_action_screen_one_title_en: 'Rapid Checkout Terminal',
    see_in_action_screen_one_file: null,
    see_in_action_screen_one_url: '/images/products/tijara_action_1.png',
    see_in_action_screen_two_title_ar: 'لوحة تحليلات المبيعات الفورية',
    see_in_action_screen_two_title_en: 'Real-Time Sales Telemetry',
    see_in_action_screen_two_file: null,
    see_in_action_screen_two_url: '/images/products/tijara_action_2.png',
    see_in_action_screen_three_title_ar: 'شاشة تحكم المطبخ والطلبات',
    see_in_action_screen_three_title_en: 'Kitchen Display System (KDS)',
    see_in_action_screen_three_file: null,
    see_in_action_screen_three_url: '/images/products/tijara_action_3.png',
    how_it_works_data: [
      {
        title: 'Device Enrollment',
        description: 'Scan a QR code on hardware terminal.'
      }
    ],
    how_it_works: {
      pill: 'كيف يعمل',
      pill_en: 'HOW IT WORKS',
      title: 'Device Enrollment',
      steps: [
        {
          num: 1,
          title: 'Device Enrollment',
          desc: 'Scan a QR code on hardware terminal.'
        }
      ]
    },
    why_teams_data: [
      {
        title: '99.99% Guaranteed Cloud Reliability',
        description: 'Distributed edge nodes ensure zero terminal downtime.'
      }
    ],
    why_choose: {
      pill: 'المزايا التنافسية',
      pill_en: 'ADVANTAGES',
      items: [
        {
          title: '99.99% Guaranteed Cloud Reliability',
          desc: 'Distributed edge nodes ensure zero terminal downtime.'
        }
      ]
    },
    scalability_tiers: [
      {
        title: 'Single Store',
        advantage: 'Instant deployment with zero upfront infrastructure cost, engineered for single-location stability.',
        specifications_capacity: 'Up to 2 terminals, 1 branch, 5,000 SKUs, and daily automated cloud backup.'
      }
    ],
    scalability: [
      {
        title: 'Single Store',
        highlight: 'Instant deployment with zero upfront infrastructure cost, engineered for single-location stability.',
        specs: 'Up to 2 terminals, 1 branch, 5,000 SKUs, and daily automated cloud backup.'
      }
    ],
    packages: [
      {
        name: 'enterprise',
        description: 'Unlimited Terminals & Multiple Physical Warehouses'
      }
    ],
    editions: [
      {
        name: 'enterprise',
        description: 'Unlimited Terminals & Multiple Physical Warehouses'
      }
    ],
    bottom_cta: {
      title: 'جاهز لاستكشاف زلمة كاشير لمتجرك؟',
      button_text: 'طلب عرض توضيحي',
      description: 'تواصل مع فريق المبيعات واحصل على استشارة مجانية وعرض حي للنظام.'
    }
  };
  formErrors.value = {};
  success('تم تعبئة نموذج زلمة كاشير (Postman JSON) بنجاح 📋');
}

const formErrors = ref({});
const formData = ref(defaultForm());

// Tab Sequence
const tabList = ['general', 'built_for', 'capabilities', 'showcase', 'workflow', 'advanced'];

function goToNextTab() {
  const curIdx = tabList.indexOf(activeTab.value);
  if (curIdx >= 0 && curIdx < tabList.length - 1) {
    activeTab.value = tabList[curIdx + 1];
  }
}

function goToPrevTab() {
  const curIdx = tabList.indexOf(activeTab.value);
  if (curIdx > 0) {
    activeTab.value = tabList[curIdx - 1];
  }
}

// Stats Computeds
const activeProductsCount = computed(() => products.value.filter(p => p.is_active).length);
const featuredCount = computed(() => products.value.filter(p => p.is_featured).length);
const totalModulesCount = computed(() => {
  return products.value.reduce((acc, p) => acc + (p.modules?.length || 0), 0);
});

// Filters
const filteredProducts = computed(() => {
  return products.value.filter(p => {
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase();
      const matchName = (p.name || '').toLowerCase().includes(q) || (p.name_en || '').toLowerCase().includes(q);
      const matchSub = (p.subtitle || '').toLowerCase().includes(q);
      const matchMod = (p.modules || []).some(m => (m.title || '').toLowerCase().includes(q));
      if (!matchName && !matchSub && !matchMod) return false;
    }
    if (selectedCategory.value && p.category !== selectedCategory.value) return false;
    if (selectedStatus.value !== '') {
      if (String(p.is_active ? 1 : 0) !== String(selectedStatus.value)) return false;
    }
    return true;
  });
});

// Category Label Helper
function getCategoryLabel(slug) {
  const map = {
    'ecommerce': 'التجارة الإلكترونية والـ POS',
    'digital-presence': 'التواجد الرقمي والشركات',
    'enterprise': 'الأنظمة المؤسسية والسحابية',
    'mobile-apps': 'تطبيقات الهواتف الذكية'
  };
  const cat = categories.value.find(c => c.slug === slug);
  return cat ? cat.name : (map[slug] || slug || 'عام');
}

// Icon Symbol Helper
function getIconSymbol(iconName) {
  const map = {
    'package': '📦',
    'shopping-cart': '🛒',
    'credit-card': '💳',
    'truck': '🚚',
    'bar-chart': '📊',
    'users': '👥',
    'shield': '🛡️',
    'cpu': '⚡',
    'smartphone': '📱',
    'globe': '🌐',
    'shopping-bag': '🛍️',
    'utensils': '🍽️',
    'briefcase': '💼',
    'activity': '🏥',
    'book-open': '📚'
  };
  return map[iconName] || '✨';
}

// Linked Project Title Helper
function getProjectTitle(slugOrId) {
  const proj = allPortfolioProjects.value.find(p => p.slug === slugOrId || p.id === slugOrId);
  return proj ? proj.title : slugOrId;
}

// Load Data
async function loadProducts() {
  loading.value = true;
  try {
    const [prodsData, catsData, projsData] = await Promise.all([
      ProductService.getAll(),
      ProductService.getCategories(),
      ProjectService.getAll()
    ]);
    products.value = prodsData || [];
    categories.value = catsData || [];
    allPortfolioProjects.value = projsData || [];
  } catch (err) {
    toastError('حدث خطأ أثناء تحميل المنتجات الرقمية');
  } finally {
    loading.value = false;
  }
}

// Single Image Base64 Upload
function handleSingleImageUpload(event, field) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    formData.value[field] = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Gallery Multi Upload
function handleGalleryMultiUpload(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;
  
  if (!formData.value.gallery) formData.value.gallery = [];

  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      formData.value.gallery.push({
        image: e.target.result,
        title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' '),
        device: 'Desktop Dashboard'
      });
    };
    reader.readAsDataURL(file);
  });
}

function addGalleryItemFromUrl() {
  if (!newGalleryUrl.value.trim()) return;
  if (!formData.value.gallery) formData.value.gallery = [];
  formData.value.gallery.push({
    image: newGalleryUrl.value.trim(),
    title: newGalleryTitle.value.trim() || 'واجهة النظام',
    device: newGalleryDevice.value || 'Desktop Dashboard'
  });
  newGalleryUrl.value = '';
  newGalleryTitle.value = '';
}

function removeGalleryItem(index) {
  formData.value.gallery.splice(index, 1);
}

// Module Helpers
function addModule() {
  if (!formData.value.modules) formData.value.modules = [];
  formData.value.modules.push({
    icon: 'package',
    title: '',
    title_en: '',
    description: '',
    description_en: ''
  });
}

function removeModule(index) {
  formData.value.modules.splice(index, 1);
}

// Edition Helpers
function addEdition() {
  if (!formData.value.editions) formData.value.editions = [];
  formData.value.editions.push({
    name: '',
    name_en: '',
    icon: 'shopping-bag',
    description: ''
  });
}

function removeEdition(index) {
  formData.value.editions.splice(index, 1);
}

// Project Selection Helpers
function isProjectSelected(slugOrId) {
  return (formData.value.related_projects || []).includes(slugOrId);
}

function toggleRelatedProject(slugOrId) {
  if (!formData.value.related_projects) formData.value.related_projects = [];
  const idx = formData.value.related_projects.indexOf(slugOrId);
  if (idx > -1) {
    formData.value.related_projects.splice(idx, 1);
  } else {
    formData.value.related_projects.push(slugOrId);
  }
}

const getAlphaColor = (hex, alpha = '18') => {
  if (!hex || !hex.startsWith('#')) return '#7c3aed18';
  return `${hex}${alpha}`;
};

function resetFilters() {
  searchQuery.value = '';
  selectedCategory.value = '';
  selectedStatus.value = '';
}

// Normalize Product for Quick Preview (supports both Live API format and Local Mock format)
function normalizeProductForPreview(raw = {}) {
  if (!raw) return null;
  const p = JSON.parse(JSON.stringify(raw));

  const name = p.name_ar || p.translations?.ar?.name || p.name || '';
  const name_en = p.name_en || p.translations?.en?.name || (p.name !== name ? p.name : '');
  const description = p.description_ar || p.translations?.ar?.description || p.description || '';
  const description_en = p.description_en || p.translations?.en?.description || '';
  const address = p.address_ar || p.translations?.ar?.address || p.address || '';
  const subtitle = p.subtitle || p.translations?.ar?.subtitle || p.translations?.en?.subtitle || p.tagline || '';
  const accent_color = p.color || p.accent_color || '#1e3a8a';
  const category_name = p.category?.name || p.category_name || (typeof p.category === 'string' ? p.category : '');
  const badge = p.badge || category_name || 'نظام رقمي متكامل';

  // 1. Overview
  const p1 = p.overview_paragraph1 || p.overview?.paragraph1 || p.overview?.p1 || description || '';
  const p2 = p.overview_paragraph2 || p.overview?.paragraph2 || p.overview?.p2 || description_en || '';
  const image = p.overview_tablet_image_url || p.overview?.tablet_image_url || p.overview?.image || p.image || '';
  const overview = {
    pill: p.overview?.pill || 'نظرة عامة',
    title: p.overview?.title || ('ما هو نظام ' + name + '؟'),
    p1,
    p2,
    image,
  };

  // 2. Built For
  const rawBuiltFor = (Array.isArray(p.built_for_data) && p.built_for_data.length)
    ? p.built_for_data
    : (Array.isArray(p.built_for?.items) && p.built_for.items.length
      ? p.built_for.items
      : (Array.isArray(p.built_for?.data) && p.built_for.data.length ? p.built_for.data : []));

  const built_for_items = rawBuiltFor.map((item, idx) => ({
    title: item.title || `القطاع ${idx + 1}`,
    desc: item.description || item.desc || '',
    icon: item.icon || (idx === 0 ? 'shopping-cart' : (idx === 1 ? 'truck' : (idx === 2 ? 'briefcase' : 'target'))),
  }));

  const built_for = {
    pill: p.built_for?.pill || 'لمن صُمم النظام',
    title: p.built_for_main_section_title || p.built_for?.main_title || p.built_for?.title || 'لمن صُمم هذا النظام؟',
    subtitle: p.built_for_secondary_section_title || p.built_for?.secondary_title || p.built_for?.subtitle || '',
    items: built_for_items,
  };

  // 3. What It Does (Key Capabilities)
  const rawWhatItDoes = (Array.isArray(p.what_it_does_data) && p.what_it_does_data.length)
    ? p.what_it_does_data
    : (Array.isArray(p.what_it_does?.items) && p.what_it_does.items.length
      ? p.what_it_does.items
      : (Array.isArray(p.what_it_does?.data) && p.what_it_does.data.length ? p.what_it_does.data : []));

  const what_it_does_items = rawWhatItDoes.map((item, idx) => ({
    title: item.title || `ميزة ${idx + 1}`,
    desc: item.description || item.desc || '',
    icon: item.icon || (idx === 0 ? 'cpu' : (idx === 1 ? 'activity' : (idx === 2 ? 'shield' : 'layers'))),
  }));

  const what_it_does = {
    pill: p.what_it_does?.pill || 'المزايا والقدرات',
    title: p.what_it_does_main_title || p.what_it_does?.main_title || p.what_it_does?.title || 'المزايا والقدرات الأساسية',
    subtitle: p.what_it_does_secondary_title || p.what_it_does?.secondary_title || p.what_it_does?.subtitle || '',
    items: what_it_does_items,
  };

  // 4. See It In Action (Screens)
  const action_main_image = p.see_in_action_main_image_url || p.action_main_image || p.laptop_mockup || '';
  
  let action_screens = [];
  if (Array.isArray(p.action_screens) && p.action_screens.length) {
    action_screens = p.action_screens.map(s => ({
      image: s.image || s.url,
      title: s.title_ar || s.title || '',
      title_ar: s.title_ar || s.title || '',
      title_en: s.title_en || s.title || ''
    }));
  } else if (Array.isArray(p.gallery) && p.gallery.length) {
    action_screens = p.gallery.map(s => ({
      image: s.image || s.url,
      title: s.title_ar || s.title || '',
      title_ar: s.title_ar || s.title || '',
      title_en: s.title_en || s.title || ''
    }));
  } else {
    const screens = [
      {
        image: p.see_in_action_screen_one_image_url,
        title: p.see_in_action_screen_one_title_ar || p.translations?.ar?.see_in_action_screen_one_title || p.see_in_action_screen_one_title_en || 'شاشة العمليات الرئيسية',
      },
      {
        image: p.see_in_action_screen_two_image_url,
        title: p.see_in_action_screen_two_title_ar || p.translations?.ar?.see_in_action_screen_two_title || p.see_in_action_screen_two_title_en || 'لوحة التحليلات اللحظية',
      },
      {
        image: p.see_in_action_screen_three_image_url,
        title: p.see_in_action_screen_three_title_ar || p.translations?.ar?.see_in_action_screen_three_title || p.see_in_action_screen_three_title_en || 'شاشة التقارير والمتابعة',
      }
    ].filter(s => !!s.image);
    if (screens.length) action_screens = screens;
  }

  // 5. How It Works
  const rawHowItWorks = (Array.isArray(p.how_it_works_data) && p.how_it_works_data.length)
    ? p.how_it_works_data
    : (Array.isArray(p.how_it_works?.steps) && p.how_it_works.steps.length
      ? p.how_it_works.steps
      : (Array.isArray(p.how_it_works?.data) && p.how_it_works.data.length ? p.how_it_works.data : []));

  const how_it_works_steps = rawHowItWorks.map((st, idx) => ({
    num: st.num || (idx + 1),
    title: st.title || `الخطوة ${idx + 1}`,
    desc: st.description || st.desc || '',
  }));

  const how_it_works = {
    pill: p.how_it_works?.pill || 'كيف يعمل',
    title: p.how_it_works?.title || 'سهل في البداية، قوي وقابل للتوسع',
    subtitle: p.how_it_works?.subtitle || 'خطوات عملية واضحة لتشغيل المنظومة والبدء فوراً',
    steps: how_it_works_steps,
  };

  // 6. Why Teams Choose
  const rawWhyTeams = (Array.isArray(p.why_teams_data) && p.why_teams_data.length)
    ? p.why_teams_data
    : (Array.isArray(p.why_choose?.items) && p.why_choose.items.length
      ? p.why_choose.items
      : (Array.isArray(p.why_choose?.data) && p.why_choose.data.length ? p.why_choose.data : []));

  const why_choose_items = rawWhyTeams.map((w, idx) => ({
    title: w.title || `ميزة تنافسية ${idx + 1}`,
    desc: w.description || w.desc || '',
  }));

  const why_choose = {
    pill: p.why_choose?.pill || 'المزايا التنافسية',
    title: p.why_choose?.title || ('لماذا تختار الشركات نظام ' + name + '؟'),
    items: why_choose_items,
  };

  // 7. Scalability Tiers
  const rawScalability = (Array.isArray(p.scalability_tiers) && p.scalability_tiers.length)
    ? p.scalability_tiers
    : (Array.isArray(p.scalability) && p.scalability.length ? p.scalability : []);

  const scalability = rawScalability.map((s, idx) => ({
    tier: s.tier || (idx === 0 ? 'startup' : (idx === 1 ? 'growth' : 'enterprise')),
    title: s.title || (idx === 0 ? 'الشركات الناشئة (Startup)' : (idx === 1 ? 'الشركات المتنامية (Growth)' : 'المؤسسات الكبرى (Enterprise)')),
    highlight: s.advantage || s.highlight || '',
    specs: s.specifications_capacity || s.specs || '',
  }));

  // 8. Editions & Packages
  const rawPackages = (Array.isArray(p.packages) && p.packages.length)
    ? p.packages
    : (Array.isArray(p.editions) && p.editions.length ? p.editions : []);

  const editions = rawPackages.map((pkg, idx) => ({
    name: pkg.name || `باقة ${idx + 1}`,
    description: pkg.description || pkg.desc || '',
    icon: pkg.icon || (idx === 0 ? 'package' : (idx === 1 ? 'briefcase' : 'globe')),
  }));

  // 9. Related Projects
  const related_projects = Array.isArray(p.related_projects) ? p.related_projects : (Array.isArray(p.projects) ? p.projects : []);

  // 10. Bottom CTA
  const bottom_cta = p.bottom_cta || {
    title: `جاهز لتشغيل أو تخصيص نظام ${name}؟`,
    description: 'احصل على استشارة تقنية مجانية وعرض حي للنظام مصمم خصيصاً لاحتياجات مؤسستك من خبراء بي كايت.',
    button_text: 'تعديل بيانات المنتج ✎'
  };

  return {
    ...p,
    name,
    name_en,
    subtitle,
    description,
    description_en,
    address,
    category_name,
    badge,
    accent_color,
    overview,
    built_for,
    what_it_does,
    action_main_image,
    action_screens,
    how_it_works,
    why_choose,
    scalability,
    editions,
    related_projects,
    bottom_cta,
    laptop_mockup: action_main_image || p.laptop_mockup || p.overview_tablet_image_url || p.image,
    is_active: p.is_active !== undefined ? (p.is_active === 1 || p.is_active === true) : true,
    is_featured: Boolean(p.is_featured_product !== undefined ? p.is_featured_product : p.is_featured),
  };
}

// Quick Preview
function openQuickPreview(product) {
  previewProduct.value = normalizeProductForPreview(product);
  previewModalOpen.value = true;
}

function editFromPreview(product) {
  previewModalOpen.value = false;
  openEditModal(product);
}

// Modal open/close
function openAddModal() {
  isEdit.value = false;
  currentEditId.value = null;
  formErrors.value = {};
  activeTab.value = 'general';
  formData.value = defaultForm();
  modalOpen.value = true;
}

function openEditModal(product) {
  isEdit.value = true;
  currentEditId.value = product.id;
  formErrors.value = {};
  activeTab.value = 'general';
  
  const raw = JSON.parse(JSON.stringify(product));
  const def = defaultForm();
  
  formData.value = {
    ...def,
    ...raw,
    name_ar: raw.name_ar || raw.name || '',
    name_en: raw.name_en || '',
    name: raw.name_ar || raw.name || '',
    address_ar: raw.address_ar || '',
    address_en: raw.address_en || '',
    description_ar: raw.description_ar || raw.description || '',
    description_en: raw.description_en || '',
    description: raw.description_ar || raw.description || '',
    color: raw.color || raw.accent_color || '#1E3A8A',
    accent_color: raw.color || raw.accent_color || '#1E3A8A',
    category_id: raw.category_id || 1,
    slug: raw.slug || '',
    is_featured_product: raw.is_featured_product !== undefined ? raw.is_featured_product : (raw.is_featured ? 1 : 0),
    is_featured: raw.is_featured ? 1 : 0,
    is_active: raw.is_active !== undefined ? raw.is_active : 1,
    overview_paragraph1: raw.overview_paragraph1 || (raw.overview?.p1 || ''),
    overview_paragraph2: raw.overview_paragraph2 || (raw.overview?.p2 || ''),
    overview_tablet_image_url: raw.overview_tablet_image_url || raw.overview_tablet_image || (raw.overview?.image || ''),
    built_for_main_section_title: raw.built_for_main_section_title || (raw.built_for?.title || ''),
    built_for_secondary_section_title: raw.built_for_secondary_section_title || (raw.built_for?.subtitle || ''),
    what_it_does_main_title: raw.what_it_does_main_title || (raw.what_it_does?.title || ''),
    what_it_does_secondary_title: raw.what_it_does_secondary_title || (raw.what_it_does?.subtitle || ''),
    action_main_image: raw.see_in_action_main_image_url || raw.action_main_image || '',
    see_in_action_screen_one_title_ar: raw.see_in_action_screen_one_title_ar || '',
    see_in_action_screen_one_title_en: raw.see_in_action_screen_one_title_en || '',
    see_in_action_screen_one_url: raw.see_in_action_screen_one_url || '',
    see_in_action_screen_two_title_ar: raw.see_in_action_screen_two_title_ar || '',
    see_in_action_screen_two_title_en: raw.see_in_action_screen_two_title_en || '',
    see_in_action_screen_two_url: raw.see_in_action_screen_two_url || '',
    see_in_action_screen_three_title_ar: raw.see_in_action_screen_three_title_ar || '',
    see_in_action_screen_three_title_en: raw.see_in_action_screen_three_title_en || '',
    see_in_action_screen_three_url: raw.see_in_action_screen_three_url || '',
    overview: raw.overview || def.overview,
    built_for: raw.built_for || def.built_for,
    what_it_does: raw.what_it_does || def.what_it_does,
    how_it_works: raw.how_it_works || def.how_it_works,
    why_choose: raw.why_choose || def.why_choose,
    bottom_cta: raw.bottom_cta || def.bottom_cta,
    modules: raw.modules || [],
    gallery: raw.gallery || [],
    scalability: raw.scalability || def.scalability,
    editions: raw.editions || [],
    related_projects: raw.related_projects || []
  };

  modalOpen.value = true;
}

function closeModal() {
  modalOpen.value = false;
}

// Save Product
async function saveProduct() {
  formErrors.value = {};
  const name_ar = (formData.value.name_ar || formData.value.name || '').trim();
  const name_en = (formData.value.name_en || '').trim();

  let hasError = false;
  if (!name_ar) {
    formErrors.value.name = 'يرجى إدخال اسم النظام بالعربية';
    hasError = true;
  }
  if (!name_en) {
    formErrors.value.name_en = 'يرجى إدخال اسم النظام بالإنجليزية (English Name)';
    hasError = true;
  }

  if (hasError) {
    activeTab.value = 'general';
    toastError('يرجى ملء الحقول الإجبارية المحددة باللون الأحمر');
    return;
  }

  // Ensure full synchronization of Postman and UI properties
  formData.value.name_ar = name_ar;
  formData.value.name = name_ar;
  formData.value.name_en = name_en;

  const desc_ar = (formData.value.description_ar || formData.value.description || '').trim();
  formData.value.description_ar = desc_ar;
  formData.value.description = desc_ar;

  if (!formData.value.color) {
    formData.value.color = formData.value.accent_color || '#1E3A8A';
  }
  formData.value.accent_color = formData.value.color;

  // Auto slug
  if (!formData.value.slug || !formData.value.slug.trim()) {
    formData.value.slug = name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prod-${Date.now()}`;
  }

  // Sync section titles and nested data if needed
  if (!formData.value.built_for_main_section_title && formData.value.built_for?.title) {
    formData.value.built_for_main_section_title = formData.value.built_for.title;
  }
  if (!formData.value.built_for_secondary_section_title && formData.value.built_for?.subtitle) {
    formData.value.built_for_secondary_section_title = formData.value.built_for.subtitle;
  }
  if ((!formData.value.built_for_data || !formData.value.built_for_data.length) && formData.value.built_for?.items?.length) {
    formData.value.built_for_data = formData.value.built_for.items.map(it => ({
      title: it.title,
      description: it.desc || it.description || ''
    }));
  }

  if (!formData.value.what_it_does_main_title && formData.value.what_it_does?.title) {
    formData.value.what_it_does_main_title = formData.value.what_it_does.title;
  }
  if (!formData.value.what_it_does_secondary_title && formData.value.what_it_does?.subtitle) {
    formData.value.what_it_does_secondary_title = formData.value.what_it_does.subtitle;
  }
  if ((!formData.value.what_it_does_data || !formData.value.what_it_does_data.length) && formData.value.what_it_does?.items?.length) {
    formData.value.what_it_does_data = formData.value.what_it_does.items.map(it => ({
      title: it.title,
      description: it.desc || it.description || ''
    }));
  }

  if ((!formData.value.how_it_works_data || !formData.value.how_it_works_data.length) && formData.value.how_it_works?.steps?.length) {
    formData.value.how_it_works_data = formData.value.how_it_works.steps.map(st => ({
      title: st.title,
      description: st.desc || st.description || ''
    }));
  }

  if ((!formData.value.why_teams_data || !formData.value.why_teams_data.length) && formData.value.why_choose?.items?.length) {
    formData.value.why_teams_data = formData.value.why_choose.items.map(it => ({
      title: it.title,
      description: it.desc || it.description || ''
    }));
  }

  if ((!formData.value.scalability_tiers || !formData.value.scalability_tiers.length) && formData.value.scalability?.length) {
    formData.value.scalability_tiers = formData.value.scalability.map(sc => ({
      title: sc.title,
      advantage: sc.highlight || sc.advantage || '',
      specifications_capacity: sc.specs || sc.specifications_capacity || ''
    }));
  }

  if ((!formData.value.packages || !formData.value.packages.length) && formData.value.editions?.length) {
    formData.value.packages = formData.value.editions.map(ed => ({
      name: ed.name,
      description: ed.description || ''
    }));
  }

  saving.value = true;
  try {
    if (isEdit.value) {
      const updated = await ProductService.update(currentEditId.value, formData.value);
      const idx = products.value.findIndex(p => p.id === currentEditId.value);
      if (idx !== -1) {
        products.value[idx] = updated;
      }
      success('تم تحديث بيانات النظام الرقمي بنجاح');
    } else {
      const created = await ProductService.create(formData.value);
      products.value.unshift(created);
      success('تمت إضافة المنظومة الرقمية الجديدة بنجاح');
    }
    closeModal();
  } catch (err) {
    console.error('Failed to save product', err);
    const msg = err.response?.data?.message || 'حدث خطأ أثناء حفظ النظام';
    toastError(msg);
  } finally {
    saving.value = false;
  }
}

// Toggle Status
async function toggleProductStatus(product) {
  const newStatus = product.is_active ? 0 : 1;
  try {
    await ProductService.update(product.id, { ...product, is_active: newStatus });
    product.is_active = newStatus;
    success(`تم ${newStatus ? 'تفعيل' : 'تعطيل'} النظام بنجاح`);
  } catch (err) {
    toastError('تعذر تغيير حالة النظام');
  }
}

// Delete
async function confirmDelete(product) {
  if (confirm(`هل أنت متأكد من حذف نظام "${product.name}"؟`)) {
    try {
      await ProductService.delete(product.id);
      products.value = products.value.filter(p => p.id !== product.id);
      success('تم حذف النظام بنجاح');
    } catch (err) {
      toastError('تعذر حذف النظام');
    }
  }
}

// Image Error Fallback
function onImgError(e) {
  e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80';
}

// Drag & Drop Reorder
function onDragStart(product) {
  draggedId.value = product.id;
}
function onDragOver(product) {}
function onDrop(targetProduct) {
  if (draggedId.value === targetProduct.id) return;
  const fromIdx = products.value.findIndex(p => p.id === draggedId.value);
  const toIdx = products.value.findIndex(p => p.id === targetProduct.id);
  if (fromIdx !== -1 && toIdx !== -1) {
    const [moved] = products.value.splice(fromIdx, 1);
    products.value.splice(toIdx, 0, moved);
    success('تم تحديث ترتيب الأنظمة');
  }
  draggedId.value = null;
}

onMounted(() => {
  loadProducts();
});
</script>

<style scoped>
.products-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Header */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-titles {
  display: flex;
  flex-direction: column;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--text-main);
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
  line-height: 1.5;
}

.btn-add {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #4f008c, #7c3aed);
  color: #fff;
  border: none;
  padding: 0.65rem 1.2rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);
  transition: all 0.2s ease;
  white-space: nowrap;
}
.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}
.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 1.1rem;
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}
.stat-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.stat-text {
  display: flex;
  flex-direction: column;
}
.stat-value {
  font-size: 1.4rem;
  font-weight: 900;
  color: var(--text-main);
  font-family: 'Outfit', sans-serif;
}
.stat-label {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* Filters */
.filters-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  flex-wrap: wrap;
}
.search-box {
  position: relative;
  flex: 1;
  min-width: 260px;
}
.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}
.search-input {
  width: 100%;
  padding: 0.65rem 2.4rem 0.65rem 2rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-main);
  font-size: 0.85rem;
  outline: none;
}
.clear-search-btn {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
}
.filter-dropdown { min-width: 170px; }
.filter-select {
  width: 100%;
  padding: 0.65rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-main);
  font-size: 0.85rem;
  outline: none;
}

/* ================= PRODUCTS CARDS GRID (Compact Fixed Layout with Product Icons) ================= */
.products-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 330px));
  gap: 1.25rem;
  justify-content: start;
}

.product-card {
  width: 100%;
  max-width: 330px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
}
.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}
.product-card.card-dragging {
  opacity: 0.5;
  border: 2px dashed #7c3aed;
}

.product-top-bar {
  height: 4px;
  width: 100%;
}

.product-card-inner {
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  flex: 1;
}

.product-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.product-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid transparent;
}
.product-custom-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.product-header-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.35rem;
}

.product-badge-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.65rem;
  border-radius: 6px;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid;
  font-family: 'Outfit', sans-serif;
}

.product-status-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  white-space: nowrap !important;
}
.product-status-chip.active {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}
.product-status-chip.inactive {
  background: rgba(156, 163, 175, 0.15);
  color: #6b7280;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}
.product-status-chip.active .status-dot {
  background: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.25);
}
.product-status-chip.inactive .status-dot {
  background: #9ca3af;
}

/* Titles */
.product-titles-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.product-cat-row {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--text-muted);
}

.product-slug-tag {
  font-size: 0.68rem;
  color: #7c3aed;
  font-family: monospace;
  direction: ltr;
  font-weight: 600;
}

.meta-sep {
  color: var(--border-color);
  font-weight: 800;
}

.product-card-title {
  font-size: 1.15rem;
  font-weight: 900;
  color: var(--text-main);
  margin: 0;
  line-height: 1.25;
}

.product-card-sub {
  font-size: 0.82rem;
  font-weight: 700;
}

.product-tagline {
  font-size: 0.8rem;
  font-weight: 700;
  margin: 0;
}

.product-card-desc {
  font-size: 0.82rem;
  line-height: 1.55;
  color: var(--text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

/* Badges Row */
.product-badges-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  padding-top: 0.35rem;
  border-top: 1px dashed var(--border-color);
}

.prod-badge-chip {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
  border: 1px solid transparent;
}
.module-badge {
  background: rgba(124, 58, 237, 0.08);
  color: #7c3aed;
  border-color: rgba(124, 58, 237, 0.18);
}
.gallery-badge {
  background: rgba(6, 182, 212, 0.08);
  color: #0891b2;
  border-color: rgba(6, 182, 212, 0.18);
}
.tier-badge {
  background: rgba(245, 158, 11, 0.08);
  color: #d97706;
  border-color: rgba(245, 158, 11, 0.18);
}
.related-badge {
  background: rgba(59, 130, 246, 0.08);
  color: #2563eb;
  border-color: rgba(59, 130, 246, 0.18);
}

.product-pricing-row {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  margin-top: 0.15rem;
}
.price-val {
  font-size: 1rem;
  font-weight: 900;
  color: var(--text-main);
}
.price-type {
  font-size: 0.72rem;
  color: var(--text-muted);
  font-weight: 600;
}

/* Card Footer */
.product-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.35rem;
  border-top: 1px solid var(--border-color);
  background: var(--bg-main);
}

.toggle-status-action {
  font-size: 0.74rem;
  font-weight: 700;
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-deactivate {
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.2);
}
.btn-deactivate:hover { background: rgba(239, 68, 68, 0.15); }
.btn-activate {
  background: rgba(16, 185, 129, 0.08);
  color: #10b981;
  border-color: rgba(16, 185, 129, 0.2);
}
.btn-activate:hover { background: rgba(16, 185, 129, 0.15); }

.product-action-btns {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.action-icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}
.action-icon-btn:hover { color: var(--text-main); }
.preview-btn:hover { color: #0284c7; border-color: #0284c7; background: rgba(2, 132, 199, 0.08); }
.edit-btn:hover { color: #7c3aed; border-color: #7c3aed; background: rgba(124, 58, 237, 0.08); }
.delete-btn:hover { color: #ef4444; border-color: #ef4444; background: rgba(239, 68, 68, 0.08); }

/* Loading & Empty State */
.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: var(--text-muted);
  gap: 1rem;
}

.empty-icon-wrap {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(124, 58, 237, 0.08);
  color: #7c3aed;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-reset-filters {
  padding: 0.55rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-main);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(124, 58, 237, 0.2);
  border-top-color: #7c3aed;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}
.modal-large-card {
  width: 100%;
  max-width: 880px;
  max-height: 90vh;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.25rem 1.75rem;
  border-bottom: 1px solid var(--border-color);
}
.modal-title-wrap { display: flex; flex-direction: column; }
.modal-title { font-size: 1.25rem; font-weight: 900; color: var(--text-main); }
.modal-subtitle { font-size: 0.78rem; color: var(--text-muted); margin-top: 0.15rem; }
.close-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 1.2rem;
  cursor: pointer;
}

/* Tabs Nav Header */
.modal-tabs-nav {
  display: flex;
  align-items: stretch;
  width: 100%;
  border-bottom: 1px solid var(--border-color);
  background: var(--table-header-bg);
  padding: 0.5rem 0.75rem;
  gap: 0.35rem;
  position: sticky;
  top: 0;
  z-index: 20;
  flex-shrink: 0;
}
.tab-btn {
  flex: 1 1 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.65rem 0.4rem;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 10px;
  color: var(--text-muted);
  font-size: 0.8rem;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
  text-align: center;
  transition: all 0.2s ease;
}
.tab-btn:hover {
  color: var(--text-main);
  background: rgba(124, 58, 237, 0.05);
}
.tab-btn.active {
  color: #7c3aed;
  background: var(--bg-card);
  border-color: rgba(124, 58, 237, 0.25);
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.1);
}

@media (max-width: 820px) {
  .modal-tabs-nav {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 480px) {
  .modal-tabs-nav {
    grid-template-columns: repeat(2, 1fr);
  }
}

.modal-form-wrap {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}
.modal-tab-content-scroll {
  padding: 1.5rem 1.75rem;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.tab-pane {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.section-notice {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  background: rgba(124, 58, 237, 0.08);
  border: 1px solid rgba(124, 58, 237, 0.2);
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.82rem;
  color: var(--text-main);
}

/* Form Controls */
.form-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.form-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.form-group { display: flex; flex-direction: column; gap: 0.4rem; }
.form-label { font-size: 0.8rem; font-weight: 700; color: var(--text-main); }
.form-input, .form-textarea {
  width: 100%;
  padding: 0.65rem 0.9rem;
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-main);
  font-size: 0.85rem;
  outline: none;
}
.form-input:focus, .form-textarea:focus { border-color: #7c3aed; }
.form-textarea { resize: vertical; }
.ltr-text { direction: ltr; text-align: left; }

.color-wrap { display: flex; align-items: center; gap: 0.5rem; }
.color-input {
  width: 42px;
  height: 38px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  padding: 2px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-main);
  cursor: pointer;
}

/* Dropzone */
.dropzone-box {
  border: 2px dashed var(--border-color);
  border-radius: 14px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: var(--bg-main);
  transition: all 0.2s ease;
}
.dropzone-box:hover {
  border-color: #7c3aed;
  background: rgba(124, 58, 237, 0.04);
}
.dropzone-icon { color: #7c3aed; margin-bottom: 0.5rem; }
.dropzone-title { font-size: 0.88rem; font-weight: 700; color: var(--text-main); }
.dropzone-hint { font-size: 0.74rem; color: var(--text-muted); margin-top: 0.2rem; }
.or-divider {
  text-align: center;
  font-size: 0.76rem;
  color: var(--text-muted);
  position: relative;
  margin: 0.5rem 0;
}

.single-preview-wrap {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
  background: var(--bg-main);
  padding: 0.6rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}
.single-preview-wrap img {
  width: 100px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}
.btn-del-mini {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: none;
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
}

/* Modules & Editions Cards */
.module-edit-card, .edition-edit-card {
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  position: relative;
}
.module-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.module-num-badge {
  background: rgba(124, 58, 237, 0.12);
  color: #7c3aed;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
}
.btn-del-sm {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: none;
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
}
.btn-add-dashed {
  width: 100%;
  padding: 0.85rem;
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  background: transparent;
  color: #7c3aed;
  font-size: 0.85rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-add-dashed:hover {
  border-color: #7c3aed;
  background: rgba(124, 58, 237, 0.06);
}

/* Gallery Controls */
.add-gallery-item-bar {
  display: flex;
  gap: 0.65rem;
  flex-wrap: wrap;
}
.btn-sm-primary {
  background: #7c3aed;
  color: #fff;
  border: none;
  padding: 0.65rem 1.2rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.82rem;
  cursor: pointer;
  white-space: nowrap;
}
.screenshots-grid-preview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.85rem;
}
.screenshot-card-preview {
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.screenshot-img-box {
  position: relative;
  height: 110px;
  background: #000;
}
.screenshot-img-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.btn-del-screenshot {
  position: absolute;
  top: 6px;
  left: 6px;
  background: rgba(239, 68, 68, 0.85);
  color: #fff;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
}
.screenshot-info {
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.form-input-mini {
  width: 100%;
  padding: 0.35rem 0.55rem;
  font-size: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-card);
  color: var(--text-main);
}
.screenshot-device-tag {
  font-size: 0.68rem;
  color: var(--text-muted);
}

/* Scalability Tiers */
.scalability-tiers-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.scalability-tier-card {
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}
.scalability-tier-card.startup { border-right: 4px solid #3b82f6; }
.scalability-tier-card.growth { border-right: 4px solid #10b981; }
.scalability-tier-card.enterprise { border-right: 4px solid #9333ea; }
.tier-card-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: var(--text-main);
}

/* Projects Select Grid */
.projects-select-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.85rem;
}
.project-select-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  padding: 0.75rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.project-select-card:hover { border-color: #7c3aed; }
.project-select-card.selected {
  border-color: #7c3aed;
  background: rgba(124, 58, 237, 0.08);
}
.project-card-thumb img {
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 8px;
}
.project-card-body { display: flex; flex-direction: column; }
.proj-title-text { font-size: 0.82rem; font-weight: 700; color: var(--text-main); }
.proj-client-text { font-size: 0.72rem; color: var(--text-muted); }

/* Modal Footer */
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.75rem;
  border-top: 1px solid var(--border-color);
  background: var(--table-header-bg);
}
.modal-footer-nav, .modal-footer-actions {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}
.btn-nav-step {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.65rem 1.1rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-main);
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-nav-step:hover { border-color: #7c3aed; }
.btn-nav-next {
  background: rgba(124, 58, 237, 0.1);
  color: #7c3aed;
  border-color: rgba(124, 58, 237, 0.2);
}
.btn-nav-next:hover { background: rgba(124, 58, 237, 0.18); }

.btn-cancel {
  padding: 0.65rem 1.2rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-muted);
  font-weight: 700;
  cursor: pointer;
}
.btn-save {
  padding: 0.65rem 1.35rem;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #4f008c, #7c3aed);
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

/* Quick Preview Modal */
.modal-preview-card {
  width: 100%;
  max-width: 950px;
  height: 90vh;
  max-height: 90vh;
  background: var(--bg-card);
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.45);
}
.preview-scrollable-content {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}
.preview-scrollable-content::-webkit-scrollbar {
  width: 8px;
}
.preview-scrollable-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
}
.preview-scrollable-content::-webkit-scrollbar-thumb {
  background: rgba(124, 58, 237, 0.35);
  border-radius: 4px;
}
.preview-scrollable-content::-webkit-scrollbar-thumb:hover {
  background: rgba(124, 58, 237, 0.65);
}
.preview-hero-header {
  padding: 2.25rem 2.25rem 2rem;
  position: relative;
  color: #fff;
  flex-shrink: 0;
}
.preview-close-btn {
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}
.preview-close-btn:hover {
  background: rgba(239, 68, 68, 0.9);
  border-color: rgba(239, 68, 68, 1);
  transform: scale(1.08);
}
.preview-client-badge {
  display: inline-block;
  background: rgba(255,255,255,0.15);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}
.preview-hero-title { font-size: 1.8rem; font-weight: 900; }
.preview-hero-sub { font-size: 0.9rem; opacity: 0.85; margin-top: 0.25rem; }
.preview-meta-chips {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}
.preview-chip {
  background: rgba(255,255,255,0.12);
  padding: 0.35rem 0.85rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
}
.preview-demo-chip {
  background: #ffc700;
  color: #18032a;
  padding: 0.35rem 0.9rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 800;
  text-decoration: none;
}
.preview-body {
  padding: 1.75rem 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.preview-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.preview-sec-title {
  font-size: 1rem;
  font-weight: 900;
  color: var(--text-main);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.4rem;
}
.preview-desc-text {
  font-size: 0.88rem;
  color: var(--text-muted);
  line-height: 1.6;
}

/* Modules Preview Grid */
.preview-modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 0.85rem;
}
.preview-mod-card {
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 0.9rem 1rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}
.mod-icon-badge {
  font-size: 1.5rem;
  background: rgba(124, 58, 237, 0.1);
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.mod-texts { display: flex; flex-direction: column; }
.mod-title { font-size: 0.88rem; font-weight: 800; color: var(--text-main); }
.mod-desc { font-size: 0.76rem; color: var(--text-muted); line-height: 1.4; margin-top: 0.2rem; }

/* Scalability Preview Grid */
.preview-scalability-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.85rem;
}
.preview-scale-card {
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.scale-header { display: flex; align-items: center; gap: 0.5rem; }
.scale-emoji { font-size: 1.2rem; }
.scale-title { font-size: 0.85rem; font-weight: 800; color: var(--text-main); }
.scale-highlight { font-size: 0.78rem; font-weight: 700; color: #7c3aed; }
.scale-specs { font-size: 0.74rem; color: var(--text-muted); line-height: 1.4; }

/* Editions Preview Grid */
.preview-editions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 0.85rem;
}
.preview-edition-card {
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 0.85rem 1rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}
.edition-icon { font-size: 1.4rem; }
.edition-texts { display: flex; flex-direction: column; }
.edition-name { font-size: 0.85rem; font-weight: 800; color: var(--text-main); }
.edition-desc { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem; }

/* Linked Projects Row */
.preview-linked-projects-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
}
.linked-proj-chip {
  background: rgba(124, 58, 237, 0.12);
  color: #7c3aed;
  padding: 0.4rem 0.85rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
}

.preview-footer-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.75rem;
  border-top: 1px solid var(--border-color);
  background: var(--table-header-bg);
}
.btn-edit-from-preview {
  background: linear-gradient(135deg, #4f008c, #7c3aed);
  color: #fff;
  border: none;
  padding: 0.65rem 1.25rem;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
}

/* ================= CASE STUDY PREVIEW & EDITOR STYLES ================= */
.modal-preview-case-study {
  max-width: 950px;
}

.preview-hero-mockup-wrap {
  margin-top: 1.25rem;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
.preview-hero-mockup-wrap img {
  width: 100%;
  max-height: 360px;
  object-fit: cover;
  display: block;
}

.section-pill-tag {
  display: inline-block;
  background: rgba(147, 51, 234, 0.12);
  color: #9333ea;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  margin-bottom: 0.4rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.preview-sec-sub {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-top: -0.25rem;
  margin-bottom: 1rem;
}

/* Overview Grid */
.overview-content-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 1.25rem;
  align-items: center;
}
.overview-p {
  font-size: 0.88rem;
  line-height: 1.65;
  color: var(--text-color);
}
.overview-image-col img {
  width: 100%;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

/* Built For Grid */
.preview-built-for-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.9rem;
}
.built-for-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
}
.built-for-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
}
.built-for-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}
.built-for-card-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 0.35rem;
}
.built-for-card-desc {
  font-size: 0.78rem;
  line-height: 1.5;
  color: var(--text-muted);
}

/* Capabilities Grid */
.preview-capabilities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 0.9rem;
}
.capability-card {
  background: var(--table-header-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1rem;
}
.cap-icon-box {
  font-size: 1.35rem;
  margin-bottom: 0.5rem;
}
.cap-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 0.35rem;
}
.cap-desc {
  font-size: 0.78rem;
  line-height: 1.5;
  color: var(--text-muted);
}

/* Action Screens */
.preview-action-main-img img {
  width: 100%;
  border-radius: 14px;
  border: 1px solid var(--border-color);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  display: block;
}
.preview-action-screens-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.85rem;
}
.action-screen-preview-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  overflow: hidden;
}
.screen-preview-thumb img {
  width: 100%;
  height: 110px;
  object-fit: cover;
  display: block;
}
.screen-preview-title {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.5rem;
  text-align: center;
  color: var(--text-color);
}

/* Steps Grid */
.preview-steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.85rem;
}
.preview-step-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1rem;
  position: relative;
}
.step-num-pill {
  display: inline-block;
  background: #9333ea;
  color: #fff;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 0.15rem 0.55rem;
  border-radius: 6px;
  margin-bottom: 0.4rem;
}
.step-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 0.25rem;
}
.step-desc {
  font-size: 0.75rem;
  line-height: 1.45;
  color: var(--text-muted);
}

/* Why Teams Choose Grid */
.preview-why-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 0.85rem;
}
.preview-why-card {
  background: rgba(147, 51, 234, 0.04);
  border: 1px solid rgba(147, 51, 234, 0.2);
  border-radius: 12px;
  padding: 0.95rem;
}
.why-card-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #9333ea;
  margin-bottom: 0.25rem;
}
.why-card-desc {
  font-size: 0.76rem;
  line-height: 1.45;
  color: var(--text-muted);
}

/* Bottom CTA Banner */
.preview-bottom-cta-banner {
  margin: 1.5rem 0 0.5rem;
  border-radius: 16px;
  padding: 1.75rem;
  text-align: center;
  color: #fff;
}
.cta-banner-title {
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 0.4rem;
}
.cta-banner-desc {
  font-size: 0.85rem;
  opacity: 0.9;
  max-width: 500px;
  margin: 0 auto 1.1rem;
  line-height: 1.5;
}
.cta-banner-btn {
  display: inline-block;
  background: #fff;
  color: #9333ea;
  font-weight: 800;
  font-size: 0.85rem;
  padding: 0.65rem 1.4rem;
  border-radius: 10px;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}
.cta-banner-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* Form Sub Cards & Editors */
.form-sub-card {
  background: var(--table-header-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1rem;
}
.sub-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}
.sub-card-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-color);
}
.sub-card-badge {
  font-size: 0.7rem;
  background: rgba(147, 51, 234, 0.12);
  color: #9333ea;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
}
.built-for-grid-editor,
.capabilities-grid-editor,
.action-screens-grid-editor,
.steps-grid-editor,
.why-choose-grid-editor {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.85rem;
}
.persona-edit-card,
.cap-edit-card,
.action-screen-card,
.step-edit-card,
.why-edit-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 0.85rem;
}
.persona-card-header,
.cap-card-header,
.screen-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  font-weight: 700;
}
.persona-num, .cap-num, .screen-num {
  color: var(--text-color);
}
.step-badge-num {
  display: inline-block;
  background: #9333ea;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 0.1rem 0.45rem;
  border-radius: 4px;
  margin-bottom: 0.4rem;
}

.input-error {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.18) !important;
  background-color: rgba(239, 68, 68, 0.02) !important;
}

.field-error-msg {
  display: block;
  font-size: 0.75rem;
  color: #ef4444;
  font-weight: 700;
  margin-top: 0.35rem;
}
</style>
