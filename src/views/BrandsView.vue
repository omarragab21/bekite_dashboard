<template>
  <div class="brands-page" dir="rtl">
    <!-- ================= PAGE HEADER ================= -->
    <div class="page-header">
      <div class="header-titles">
        <div class="header-badge-pill">
          <span class="pill-dot"></span>
          <span>منظومة استثمارات Be Kite</span>
        </div>
        <h1 class="page-title">علاماتنا والشركات التابعة (Venture Brands)</h1>
        <p class="page-subtitle">
          إدارة وتطوير المنصات والعلامات التجارية المستقلة التابعة لـ Be Kite — تطبيق زلمة، هدايا آب، والمشاريع الاستثمارية القادمة
        </p>
      </div>
      <div class="header-actions">
        <button class="btn-add" @click="openAddModal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          إضافة علامة تابعة جديدة
        </button>
      </div>
    </div>

    <!-- ================= STATS KPI CARDS ================= -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon purple">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-val">{{ brands.length }}</span>
          <span class="stat-label">إجمالي العلامات والاستثمارات</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon emerald">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-val">{{ activeLiveCount }}</span>
          <span class="stat-label">علامات نشطة في السوق</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon amber">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-val">{{ pipelineCount }}</span>
          <span class="stat-label">مشاريع قيد التطوير (Pipeline)</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon blue">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-val">100%</span>
          <span class="stat-label">استقلالية المنصات والعلامات</span>
        </div>
      </div>
    </div>

    <!-- ================= CONTROLS & FILTER BAR ================= -->
    <div class="controls-card">
      <div class="search-box">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          v-model="searchQuery"
          class="search-input"
          placeholder="البحث باسم العلامة، الرابط، الشارة، أو الوسوم..."
        />
        <button v-if="searchQuery" class="clear-search-btn" @click="searchQuery = ''">✕</button>
      </div>

      <div class="filter-pills-group">
        <button
          class="filter-pill"
          :class="{ active: filterTab === 'all' }"
          @click="filterTab = 'all'"
        >
          كافة العلامات ({{ brands.length }})
        </button>
        <button
          class="filter-pill"
          :class="{ active: filterTab === 'active' }"
          @click="filterTab = 'active'"
        >
          النشطة في السوق ({{ activeLiveCount }})
        </button>
        <button
          class="filter-pill"
          :class="{ active: filterTab === 'pipeline' }"
          @click="filterTab = 'pipeline'"
        >
          قيد التطوير ({{ pipelineCount }})
        </button>
      </div>
    </div>

    <!-- ================= BRANDS GRID ================= -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>جاري تحميل العلامات التابعة من الخادم...</p>
    </div>

    <div v-else-if="filteredBrands.length === 0" class="empty-state">
      <div class="empty-icon-wrap">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
        </svg>
      </div>
      <h3>لا توجد نتائج مطابقة</h3>
      <p>لم يتم العثور على أي علامة تجارية تطابق معايير البحث الحالية.</p>
      <button class="btn-reset-filters" @click="resetFilters">إعادة ضبط الفلاتر</button>
    </div>

    <div v-else class="brands-grid">
      <div
        v-for="brand in filteredBrands"
        :key="brand.id"
        class="brand-card"
        :class="{ 'card-pipeline': brand.is_coming_soon }"
      >
        <!-- Top Branded Accent Bar -->
        <div class="brand-top-bar" :style="{ background: brand.brand_color || '#7c3aed' }"></div>

        <div class="brand-card-inner">
          <!-- Card Header (Badge & Status) -->
          <div class="brand-header-flex">
            <span
              class="brand-badge-tag"
              :style="{
                color: brand.brand_color || '#7c3aed',
                backgroundColor: getAlphaColor(brand.brand_color, '15'),
                borderColor: getAlphaColor(brand.brand_color, '35')
              }"
            >
              {{ brand.badge || (brand.is_coming_soon ? 'قيد التطوير' : 'VENTURE') }}
            </span>

            <div class="brand-status-chip" :class="brand.is_active ? 'active' : 'inactive'">
              <span class="status-dot"></span>
              <span>{{ brand.is_active ? 'نشط' : 'معطل' }}</span>
            </div>
          </div>

          <!-- Mockup Image Preview -->
          <div class="brand-mockup-wrap" @click="openPreviewModal(brand)" title="اضغط للمعاينة الحية">
            <img
              :src="brand.image || '/images/brands/zalameh_mockup.png'"
              :alt="brand.name"
              class="brand-mockup-img"
              @error="onImgError"
            />
            <div class="mockup-overlay">
              <span class="btn-overlay-preview">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                معاينة المظهر في الموقع
              </span>
            </div>
            <div v-if="brand.is_coming_soon" class="coming-soon-ribbon">
              <span>{{ brand.pipeline_status || 'قيد التطوير' }}</span>
            </div>
          </div>

          <!-- Title & Subtitle -->
          <div class="brand-titles-wrap">
            <h3 class="brand-card-title">{{ brand.name }}</h3>
            <span
              class="brand-card-sub"
              :style="{ color: brand.brand_color || '#7c3aed' }"
            >
              {{ brand.subtitle }}
            </span>
          </div>

          <!-- Description -->
          <p class="brand-card-desc">{{ brand.description }}</p>

          <!-- Tags -->
          <div v-if="brand.tags && brand.tags.length" class="brand-tags-list">
            <span v-for="tag in brand.tags" :key="tag" class="brand-tag-chip">
              #{{ tag }}
            </span>
          </div>

          <!-- Links Bar -->
          <div class="brand-links-row">
            <template v-if="brand.links && brand.links.length">
              <a
                v-for="link in brand.links"
                :key="link.label"
                :href="link.href"
                target="_blank"
                class="brand-link-chip"
                :class="link.type === 'primary' ? 'primary-link' : 'secondary-link'"
                :style="link.type === 'primary' ? {
                  backgroundColor: brand.brand_color || '#ea580c',
                  color: '#ffffff',
                  boxShadow: `0 4px 14px ${getAlphaColor(brand.brand_color, '40')}`
                } : {}"
              >
                <span>{{ link.label }}</span>
                <svg v-if="link.type === 'primary'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            </template>
            <span v-else class="text-muted text-xs">لا توجد روابط خارجية محددة</span>
          </div>
        </div>

        <!-- Footer Actions Bar -->
        <div class="brand-card-footer">
          <button
            class="toggle-status-action"
            :class="brand.is_active ? 'btn-deactivate' : 'btn-activate'"
            @click="toggleBrandStatus(brand)"
          >
            {{ brand.is_active ? 'إيقاف مؤقت' : 'تفعيل ونشر' }}
          </button>

          <div class="brand-action-btns">
            <button
              class="action-icon-btn preview-btn"
              @click="openPreviewModal(brand)"
              title="معاينة حية للمظهر كما هو في موقع Be Kite"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
            <button
              class="action-icon-btn edit-btn"
              @click="openEditModal(brand)"
              title="تعديل بيانات العلامة"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button
              class="action-icon-btn delete-btn"
              @click="confirmDelete(brand)"
              title="حذف العلامة"
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

    <!-- ================= ADD / EDIT BRAND MODAL ================= -->
    <div v-if="modalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-card modal-brand-edit">
        <div class="modal-header">
          <div class="modal-title-wrap">
            <h2 class="modal-title">{{ isEdit ? 'تعديل بيانات العلامة والمنصة' : 'إضافة علامة استثمارية جديدة' }}</h2>
            <span class="modal-subtitle">يرجى تعبئة كافة التفاصيل والهوية البصرية وروابط التحميل بدقة</span>
          </div>
          <button class="close-btn" @click="closeModal">✕</button>
        </div>

        <!-- Modal Tabs Nav -->
        <div class="modal-tabs-nav">
          <button
            class="tab-btn"
            :class="{ active: formTab === 'identity' }"
            @click="formTab = 'identity'"
          >
            1. الهوية والبيانات الأساسية
          </button>
          <button
            class="tab-btn"
            :class="{ active: formTab === 'content' }"
            @click="formTab = 'content'"
          >
            2. الوصف والموك آب والوسوم
          </button>
          <button
            class="tab-btn"
            :class="{ active: formTab === 'links' }"
            @click="formTab = 'links'"
          >
            3. المنصات والروابط والمرحلة
          </button>
        </div>

        <form @submit.prevent="saveBrand" class="modal-form-wrap">
          <div class="modal-tab-content-scroll">
            <!-- TAB 1: Identity -->
            <div v-show="formTab === 'identity'" class="tab-pane">
              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label">اسم العلامة (بالعربية) *</label>
                  <input
                    type="text"
                    v-model="formData.name"
                    class="form-input"
                    required
                    placeholder="مثال: تطبيق زلمة | Zalameh App"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">اسم العلامة (English) *</label>
                  <input
                    type="text"
                    v-model="formData.name_en"
                    class="form-input ltr-text"
                    required
                    placeholder="e.g. Zalameh App"
                  />
                </div>
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label">العنوان الفرعي (Subtitle)</label>
                  <input
                    type="text"
                    v-model="formData.subtitle"
                    class="form-input"
                    placeholder="مثال: منصة رقمية لصناعة روابط حقيقية"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">العنوان الفرعي (English)</label>
                  <input
                    type="text"
                    v-model="formData.subtitle_en"
                    class="form-input ltr-text"
                    placeholder="e.g. A Digital Platform for Real Connections"
                  />
                </div>
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label">الرابط الدائم (Slug) *</label>
                  <input
                    type="text"
                    v-model="formData.slug"
                    class="form-input ltr-text"
                    required
                    placeholder="zalameh-app"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">الشارة البارزة (Badge)</label>
                  <input
                    type="text"
                    v-model="formData.badge"
                    class="form-input"
                    placeholder="مثال: CONSUMER APP أو تطبيق للمستهلكين"
                  />
                </div>
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label">لون العلامة الرئيسي (Brand Color)</label>
                  <div class="color-picker-wrap">
                    <input type="color" v-model="formData.brand_color" class="color-picker-input" />
                    <input type="text" v-model="formData.brand_color" class="form-input ltr-text" />
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">اللون الثانوي (Accent Color)</label>
                  <div class="color-picker-wrap">
                    <input type="color" v-model="formData.accent_color" class="color-picker-input" />
                    <input type="text" v-model="formData.accent_color" class="form-input ltr-text" />
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">طريقة المحاذاة في الموقع (Layout)</label>
                <div class="layout-selector">
                  <label class="layout-radio" :class="{ active: formData.layout === 'image-left' }">
                    <input type="radio" v-model="formData.layout" value="image-left" />
                    <span>الصورة على اليسار (Image Left)</span>
                  </label>
                  <label class="layout-radio" :class="{ active: formData.layout === 'image-right' }">
                    <input type="radio" v-model="formData.layout" value="image-right" />
                    <span>الصورة على اليمين (Image Right)</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- TAB 2: Content & Visuals -->
            <div v-show="formTab === 'content'" class="tab-pane">
              <div class="form-group">
                <label class="form-label">رابط صورة الموك آب (Mockup Image URL)</label>
                <div class="image-input-wrap">
                  <input
                    type="text"
                    v-model="formData.image"
                    class="form-input ltr-text"
                    placeholder="/images/brands/zalameh_mockup.png"
                  />
                  <div class="presets-row">
                    <span class="preset-label">نماذج سريعة:</span>
                    <button
                      type="button"
                      class="preset-btn"
                      @click="formData.image = '/images/brands/zalameh_mockup.png'"
                    >
                      زلمة (Zalameh)
                    </button>
                    <button
                      type="button"
                      class="preset-btn"
                      @click="formData.image = '/images/brands/hadayapp_mockup.png'"
                    >
                      هدايا آب (HadayApp)
                    </button>
                  </div>
                </div>
                <div v-if="formData.image" class="modal-mockup-preview">
                  <img :src="formData.image" alt="Preview" @error="onImgError" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">الوصف التفصيلي (بالعربية)</label>
                <textarea
                  v-model="formData.description"
                  class="form-textarea"
                  rows="3"
                  placeholder="اكتب نبذة شاملة عن رسومة العلامة والقيمة المضافة التي تقدمها..."
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">الوصف التفصيلي (English)</label>
                <textarea
                  v-model="formData.description_en"
                  class="form-textarea ltr-text"
                  rows="3"
                  placeholder="Comprehensive description of the brand venture..."
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">الوسوم والتصنيفات (مفصولة بفواصل)</label>
                <input
                  type="text"
                  :value="formData.tags?.join(', ')"
                  @input="formData.tags = $event.target.value.split(',').map(s => s.trim()).filter(Boolean)"
                  class="form-input"
                  placeholder="تطبيق مجتمعي, علامة تجارية للمستهلك, ثقافة وأسلوب حياة"
                />
              </div>
            </div>

            <!-- TAB 3: Links & Stage -->
            <div v-show="formTab === 'links'" class="tab-pane">
              <div class="section-hint">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span>روابط المنصات الخارجية التي ستظهر كأزرار إطلاق في صفحة العلامات التجارية</span>
              </div>

              <div class="form-group">
                <label class="form-label">رابط الموقع الرسمي (Website URL)</label>
                <input
                  type="url"
                  v-model="formDataLinks.website"
                  class="form-input ltr-text"
                  placeholder="https://zalameh.com"
                />
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label">رابط تطبيق iOS (App Store)</label>
                  <input
                    type="text"
                    v-model="formDataLinks.ios"
                    class="form-input ltr-text"
                    placeholder="https://apps.apple.com/app/id..."
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">رابط تطبيق Android (Google Play)</label>
                  <input
                    type="text"
                    v-model="formDataLinks.android"
                    class="form-input ltr-text"
                    placeholder="https://play.google.com/store/apps/details?id=..."
                  />
                </div>
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label">حالة المشروع الاستثماري</label>
                  <select v-model="formData.pipeline_status" class="form-select">
                    <option value="متاح في السوق">متاح في السوق (Live in Market)</option>
                    <option value="قيد التجهيز والإعداد">قيد التجهيز والإعداد (In Pipeline)</option>
                    <option value="أبحاث ودراسة السوق">أبحاث ودراسة السوق (Research & Ideation)</option>
                    <option value="النمذجة الأولية والبرمجة">النمذجة الأولية والبرمجة (Prototyping & Dev)</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">خيارات النشر والحالة</label>
                  <div class="checkboxes-stack">
                    <label class="checkbox-row">
                      <input type="checkbox" v-model="formData.is_coming_soon" :true-value="1" :false-value="0" />
                      <span>مشروع مستقبلي قيد التطوير (Coming Soon)</span>
                    </label>
                    <label class="checkbox-row">
                      <input type="checkbox" v-model="formData.is_active" :true-value="1" :false-value="0" />
                      <span>تفعيل وإظهار العلامة في الموقع</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="modal-footer">
            <div class="modal-footer-nav">
              <button
                type="button"
                v-if="formTab !== 'identity'"
                class="btn-step-nav"
                @click="goToPrevTab"
              >
                ← الخطوة السابقة
              </button>
              <button
                type="button"
                v-if="formTab !== 'links'"
                class="btn-step-nav next"
                @click="goToNextTab"
              >
                الخطوة التالية →
              </button>
            </div>

            <div class="modal-footer-actions">
              <button type="button" class="btn-cancel" @click="closeModal">إلغاء</button>
              <button type="submit" class="btn-save" :disabled="saving">
                {{ saving ? 'جاري الحفظ...' : (isEdit ? 'تحديث بيانات العلامة' : 'حفظ ونشر العلامة') }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- ================= LIVE PREVIEW MODAL (1:1 with BrandsPage.jsx) ================= -->
    <div v-if="previewModalOpen && previewBrand" class="modal-overlay" @click.self="previewModalOpen = false">
      <div class="modal-card modal-preview-brand">
        <div class="preview-site-bar">
          <div class="site-bar-info">
            <span class="site-dot"></span>
            <span>معاينة حية لصفحة العلامات التجارية (Be Kite Brands Page Preview)</span>
          </div>
          <button class="close-btn" @click="previewModalOpen = false">✕</button>
        </div>

        <div class="preview-brand-body">
          <div
            class="preview-brand-layout"
            :class="{ 'layout-image-right': previewBrand.layout === 'image-right' }"
          >
            <!-- Image Column -->
            <div class="preview-image-col">
              <div class="preview-mockup-frame">
                <img
                  :src="previewBrand.image || '/images/brands/zalameh_mockup.png'"
                  :alt="previewBrand.name"
                  @error="onImgError"
                />
              </div>
            </div>

            <!-- Text Column -->
            <div class="preview-text-col">
              <!-- Branded Badge -->
              <div class="preview-badge-row">
                <span
                  class="preview-badge-pill"
                  :style="{
                    backgroundColor: getAlphaColor(previewBrand.brand_color, '15'),
                    color: previewBrand.brand_color || '#ea580c',
                    borderColor: getAlphaColor(previewBrand.brand_color, '30')
                  }"
                >
                  {{ previewBrand.badge || 'CONSUMER APP' }}
                </span>
              </div>

              <!-- Title -->
              <h2 class="preview-brand-title">{{ previewBrand.name }}</h2>

              <!-- Subtitle -->
              <p
                class="preview-brand-sub"
                :style="{ color: previewBrand.brand_color || '#ea580c' }"
              >
                {{ previewBrand.subtitle }}
              </p>

              <!-- Description -->
              <p class="preview-brand-desc">{{ previewBrand.description }}</p>

              <!-- Tags -->
              <div v-if="previewBrand.tags && previewBrand.tags.length" class="preview-tags-row">
                <span v-for="tag in previewBrand.tags" :key="tag" class="preview-tag-chip">
                  {{ tag }}
                </span>
              </div>

              <!-- Action Links -->
              <div class="preview-launch-btns">
                <template v-if="previewBrand.links && previewBrand.links.length">
                  <a
                    v-for="link in previewBrand.links"
                    :key="link.label"
                    :href="link.href"
                    target="_blank"
                    class="preview-action-btn"
                    :class="link.type === 'primary' ? 'btn-primary-launch' : 'btn-secondary-launch'"
                    :style="link.type === 'primary' ? {
                      backgroundColor: previewBrand.brand_color || '#ea580c',
                      boxShadow: `0 10px 25px -5px ${getAlphaColor(previewBrand.brand_color, '40')}`
                    } : {}"
                  >
                    <span>{{ link.label }}</span>
                    <svg v-if="link.type === 'primary'" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- Preview Footer -->
        <div class="preview-footer-actions">
          <button class="btn-cancel" @click="previewModalOpen = false">إغلاق المعاينة</button>
          <button class="btn-edit-direct" @click="editFromPreview(previewBrand)">
            تعديل بيانات هذه العلامة
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { BrandService } from '../services/BrandService';
import { useToast } from '../composables/useToast';

const { success, error: toastError } = useToast();

const loading = ref(true);
const saving = ref(false);
const brands = ref([]);
const searchQuery = ref('');
const filterTab = ref('all'); // all, active, pipeline

// Modals
const modalOpen = ref(false);
const isEdit = ref(false);
const currentEditId = ref(null);
const formTab = ref('identity'); // identity, content, links

const previewModalOpen = ref(false);
const previewBrand = ref(null);

const formDataLinks = ref({
  website: 'https://zalameh.com',
  ios: '#',
  android: '#',
});

const defaultBrandForm = () => ({
  name: '',
  name_en: '',
  subtitle: '',
  subtitle_en: '',
  slug: '',
  badge: 'CONSUMER APP',
  badge_en: 'CONSUMER APP',
  description: '',
  description_en: '',
  tags: ['تطبيق مجتمعي', 'علامة تجارية للمستهلك', 'ثقافة وأسلوب حياة'],
  tags_en: ['Community App', 'Consumer Brand'],
  brand_color: '#ea580c',
  accent_color: '#c2410c',
  layout: 'image-left',
  image: '/images/brands/zalameh_mockup.png',
  is_coming_soon: 0,
  pipeline_status: 'متاح في السوق',
  is_active: 1,
});

const formData = ref(defaultBrandForm());

// Counts
const activeLiveCount = computed(() => brands.value.filter(b => b.is_active && !b.is_coming_soon).length);
const pipelineCount = computed(() => brands.value.filter(b => b.is_coming_soon).length);

// Filtered brands
const filteredBrands = computed(() => {
  return brands.value.filter(b => {
    // Tab filter
    if (filterTab.value === 'active' && (b.is_coming_soon || !b.is_active)) return false;
    if (filterTab.value === 'pipeline' && !b.is_coming_soon) return false;

    // Search query
    if (!searchQuery.value) return true;
    const q = searchQuery.value.toLowerCase();
    return (
      (b.name && b.name.toLowerCase().includes(q)) ||
      (b.name_en && b.name_en.toLowerCase().includes(q)) ||
      (b.slug && b.slug.toLowerCase().includes(q)) ||
      (b.badge && b.badge.toLowerCase().includes(q)) ||
      (b.description && b.description.toLowerCase().includes(q)) ||
      (b.tags && b.tags.some(t => t.toLowerCase().includes(q)))
    );
  });
});

const getAlphaColor = (hex, alpha = '18') => {
  if (!hex || !hex.startsWith('#')) return '#7c3aed18';
  return `${hex}${alpha}`;
};

const onImgError = (e) => {
  e.target.src = '/images/brands/zalameh_mockup.png';
};

const resetFilters = () => {
  searchQuery.value = '';
  filterTab.value = 'all';
};

const fetchBrands = async () => {
  loading.value = true;
  try {
    brands.value = await BrandService.getAll();
  } catch (err) {
    console.error('Failed to fetch brands', err);
    toastError('تعذر تحميل قائمة العلامات التجارية');
  } finally {
    loading.value = false;
  }
};

const toggleBrandStatus = async (brand) => {
  const newStatus = brand.is_active ? 0 : 1;
  try {
    await BrandService.update(brand.id, { is_active: newStatus });
    brand.is_active = newStatus;
    success(newStatus ? 'تم تفعيل العلامة ونشرها بنجاح' : 'تم إيقاف العلامة مؤقتاً');
  } catch (err) {
    console.error('Failed to update status', err);
    toastError('حدث خطأ أثناء تحديث حالة العلامة');
  }
};

const openAddModal = () => {
  isEdit.value = false;
  currentEditId.value = null;
  formTab.value = 'identity';
  formData.value = defaultBrandForm();
  formDataLinks.value = { website: '', ios: '', android: '' };
  modalOpen.value = true;
};

const openEditModal = (brand) => {
  isEdit.value = true;
  currentEditId.value = brand.id;
  formTab.value = 'identity';
  formData.value = JSON.parse(JSON.stringify(brand));
  
  // Extract links
  formDataLinks.value = {
    website: brand.links?.find(l => l.label?.includes('موقع') || l.label?.toLowerCase()?.includes('web'))?.href || '',
    ios: brand.links?.find(l => l.label?.toLowerCase()?.includes('ios') || l.label?.includes('آبل'))?.href || '',
    android: brand.links?.find(l => l.label?.toLowerCase()?.includes('android') || l.label?.includes('أندرويد'))?.href || '',
  };

  modalOpen.value = true;
};

const openPreviewModal = (brand) => {
  previewBrand.value = brand;
  previewModalOpen.value = true;
};

const editFromPreview = (brand) => {
  previewModalOpen.value = false;
  openEditModal(brand);
};

const closeModal = () => {
  modalOpen.value = false;
};

const goToNextTab = () => {
  if (formTab.value === 'identity') formTab.value = 'content';
  else if (formTab.value === 'content') formTab.value = 'links';
};

const goToPrevTab = () => {
  if (formTab.value === 'links') formTab.value = 'content';
  else if (formTab.value === 'content') formTab.value = 'identity';
};

const saveBrand = async () => {
  saving.value = true;
  try {
    // Assemble links array
    const links = [];
    if (formDataLinks.value.website) {
      links.push({ label: 'الموقع الإلكتروني', label_en: 'Website', href: formDataLinks.value.website, type: 'primary' });
    }
    if (formDataLinks.value.ios) {
      links.push({ label: 'iOS', label_en: 'iOS', href: formDataLinks.value.ios, type: 'secondary' });
    }
    if (formDataLinks.value.android) {
      links.push({ label: 'Android', label_en: 'Android', href: formDataLinks.value.android, type: 'secondary' });
    }
    formData.value.links = links;

    if (isEdit.value) {
      const updated = await BrandService.update(currentEditId.value, formData.value);
      const idx = brands.value.findIndex(b => b.id === currentEditId.value);
      if (idx !== -1) brands.value[idx] = updated;
      success('تم تحديث بيانات العلامة بنجاح');
    } else {
      const created = await BrandService.create(formData.value);
      brands.value.push(created);
      success('تمت إضافة العلامة الجديدة بنجاح');
    }
    closeModal();
  } catch (err) {
    console.error('Failed to save brand', err);
    toastError('حدث خطأ أثناء حفظ بيانات العلامة');
  } finally {
    saving.value = false;
  }
};

const confirmDelete = async (brand) => {
  if (confirm(`هل أنت متأكد من حذف علامة "${brand.name}" نهائياً من المنظومة؟`)) {
    try {
      await BrandService.delete(brand.id);
      brands.value = brands.value.filter(b => b.id !== brand.id);
      success('تم حذف العلامة بنجاح');
    } catch (err) {
      console.error('Failed to delete brand', err);
      toastError('تعذر حذف العلامة');
    }
  }
};

onMounted(() => {
  fetchBrands();
});
</script>

<style scoped>
.brands-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Page Header */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  background: rgba(124, 58, 237, 0.08);
  color: #7c3aed;
  font-size: 0.72rem;
  font-weight: 800;
  margin-bottom: 0.4rem;
}

.pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #7c3aed;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--text-main);
  margin: 0;
}

.page-subtitle {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 0.3rem;
  max-width: 700px;
  line-height: 1.5;
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.4rem;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #4f008c, #7c3aed);
  color: #fff;
  font-size: 0.88rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
  transition: all 0.2s ease;
}
.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
}

.stat-icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.stat-icon.purple { background: rgba(124, 58, 237, 0.1); color: #7c3aed; }
.stat-icon.emerald { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.stat-icon.amber { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
.stat-icon.blue { background: rgba(59, 130, 246, 0.1); color: #2563eb; }

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-val {
  font-size: 1.4rem;
  font-weight: 900;
  color: var(--text-main);
  line-height: 1.1;
}

.stat-label {
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

/* Controls Card */
.controls-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 0.85rem 1.1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 260px;
  max-width: 450px;
}

.search-icon {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  color: var(--text-muted);
}

.search-input {
  width: 100%;
  padding: 0.65rem 2.4rem 0.65rem 2rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--bg-main);
  color: var(--text-main);
  font-size: 0.84rem;
  outline: none;
}
.search-input:focus {
  border-color: #7c3aed;
}

.clear-search-btn {
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
}

.filter-pills-group {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.filter-pill {
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: var(--bg-main);
  color: var(--text-muted);
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}
.filter-pill.active {
  background: linear-gradient(135deg, #4f008c, #7c3aed);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.25);
}

/* Brands Grid */
.brands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 1.5rem;
}

.brand-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  transition: all 0.25s ease;
}
.brand-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.brand-top-bar {
  height: 5px;
  width: 100%;
}

.brand-card-inner {
  padding: 1.35rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  flex: 1;
}

.brand-header-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-badge-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid;
}

.brand-status-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
}
.brand-status-chip.active {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}
.brand-status-chip.inactive {
  background: rgba(156, 163, 175, 0.15);
  color: #6b7280;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}
.brand-status-chip.active .status-dot {
  background: #10b981;
}
.brand-status-chip.inactive .status-dot {
  background: #9ca3af;
}

/* Mockup Frame */
.brand-mockup-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: 14px;
  overflow: hidden;
  background: #0f172a;
  border: 1px solid var(--border-color);
  cursor: pointer;
}

.brand-mockup-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.brand-mockup-wrap:hover .brand-mockup-img {
  transform: scale(1.04);
}

.mockup-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.brand-mockup-wrap:hover .mockup-overlay {
  opacity: 1;
}

.btn-overlay-preview {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1rem;
  border-radius: 999px;
  background: #fff;
  color: #0f172a;
  font-size: 0.78rem;
  font-weight: 800;
  box-shadow: 0 4px 15px rgba(0,0,0,0.25);
}

.coming-soon-ribbon {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(245, 158, 11, 0.9);
  color: #fff;
  font-size: 0.68rem;
  font-weight: 800;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
  backdrop-filter: blur(4px);
}

/* Titles */
.brand-titles-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.brand-card-title {
  font-size: 1.15rem;
  font-weight: 900;
  color: var(--text-main);
  margin: 0;
  line-height: 1.25;
}

.brand-card-sub {
  font-size: 0.82rem;
  font-weight: 700;
}

.brand-card-desc {
  font-size: 0.82rem;
  line-height: 1.55;
  color: var(--text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.brand-tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.brand-tag-chip {
  font-size: 0.68rem;
  font-weight: 600;
  background: var(--bg-main);
  color: var(--text-muted);
  border: 1px solid var(--border-color);
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
}

.brand-links-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem;
  margin-top: 0.3rem;
}

.brand-link-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.15s ease;
}
.secondary-link {
  background: var(--bg-main);
  color: var(--text-main);
  border: 1px solid var(--border-color);
}
.secondary-link:hover {
  background: var(--bg-card);
  border-color: #7c3aed;
}

/* Card Footer */
.brand-card-footer {
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

.brand-action-btns {
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

/* Modal & Dialogs */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
}
.modal-brand-edit { max-width: 820px; }
.modal-preview-brand { max-width: 950px; }

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-title-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.modal-title { font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin: 0; }
.modal-subtitle { font-size: 0.78rem; color: var(--text-muted); }

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background: var(--bg-main);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* Modal Tabs */
.modal-tabs-nav {
  display: flex;
  gap: 0.4rem;
  padding: 0.65rem 1.5rem;
  background: var(--bg-main);
  border-bottom: 1px solid var(--border-color);
  overflow-x: auto;
}

.tab-btn {
  padding: 0.45rem 0.9rem;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}
.tab-btn.active {
  background: linear-gradient(135deg, #4f008c, #7c3aed);
  color: #fff;
}

.modal-form-wrap {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-tab-content-scroll {
  padding: 1.5rem;
  overflow-y: auto;
  max-height: calc(85vh - 160px);
}

.tab-pane {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-main);
}

.form-input, .form-textarea, .form-select {
  padding: 0.65rem 0.9rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--bg-main);
  color: var(--text-main);
  font-size: 0.84rem;
  outline: none;
}
.form-input:focus, .form-textarea:focus, .form-select:focus {
  border-color: #7c3aed;
}

.color-picker-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.color-picker-input {
  width: 44px;
  height: 38px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  cursor: pointer;
  background: transparent;
}

.layout-selector {
  display: flex;
  gap: 0.75rem;
}

.layout-radio {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 1rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--bg-main);
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
}
.layout-radio.active {
  border-color: #7c3aed;
  background: rgba(124, 58, 237, 0.06);
  color: #7c3aed;
}

.image-input-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.presets-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.preset-label {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.preset-btn {
  font-size: 0.72rem;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background: var(--bg-main);
  color: var(--text-main);
  cursor: pointer;
}
.preset-btn:hover { border-color: #7c3aed; color: #7c3aed; }

.modal-mockup-preview {
  max-height: 180px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  background: #0f172a;
  margin-top: 0.5rem;
}
.modal-mockup-preview img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
}

.section-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 0.95rem;
  border-radius: 8px;
  background: rgba(124, 58, 237, 0.08);
  color: #7c3aed;
  font-size: 0.78rem;
  font-weight: 600;
}

.checkboxes-stack {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.checkbox-row {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  background: var(--bg-main);
}

.modal-footer-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-step-nav {
  padding: 0.55rem 0.95rem;
  border-radius: 999px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-main);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}
.btn-step-nav.next {
  background: rgba(124, 58, 237, 0.1);
  color: #7c3aed;
  border-color: rgba(124, 58, 237, 0.3);
}

.modal-footer-actions {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.btn-cancel {
  padding: 0.65rem 1.2rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-muted);
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
}

.btn-save {
  padding: 0.65rem 1.4rem;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #4f008c, #7c3aed);
  color: #fff;
  font-size: 0.84rem;
  font-weight: 800;
  cursor: pointer;
}

/* ================= LIVE PREVIEW MODAL (1:1 with BrandsPage.jsx) ================= */
.preview-site-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  background: #1e1b4b;
  color: #fff;
}

.site-bar-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  font-weight: 700;
}

.site-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
}

.preview-brand-body {
  padding: 2.5rem 2rem;
  background: #f8f9fb;
  color: #150522;
  overflow-y: auto;
  max-height: 70vh;
}

.preview-brand-layout {
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 2.5rem;
  align-items: center;
}
.preview-brand-layout.layout-image-right {
  grid-template-columns: 1.15fr 1fr;
}
.preview-brand-layout.layout-image-right .preview-image-col {
  order: 2;
}
.preview-brand-layout.layout-image-right .preview-text-col {
  order: 1;
}

.preview-image-col {
  width: 100%;
}

.preview-mockup-frame {
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(226, 232, 240, 0.8);
  background: #0f172a;
}
.preview-mockup-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.preview-text-col {
  display: flex;
  flex-direction: column;
}

.preview-badge-row {
  margin-bottom: 0.65rem;
}

.preview-badge-pill {
  display: inline-block;
  padding: 0.25rem 0.85rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border: 1px solid;
}

.preview-brand-title {
  font-size: 2rem;
  font-weight: 900;
  color: #150522;
  line-height: 1.2;
  margin: 0 0 0.35rem 0;
  letter-spacing: -0.5px;
}

.preview-brand-sub {
  font-size: 1.05rem;
  font-weight: 800;
  margin: 0 0 0.9rem 0;
}

.preview-brand-desc {
  font-size: 0.9rem;
  line-height: 1.65;
  color: #475569;
  margin: 0 0 1.25rem 0;
}

.preview-tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: 1.5rem;
}

.preview-tag-chip {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background: #f1f5f9;
  color: #334155;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid rgba(226, 232, 240, 0.9);
}

.preview-launch-btns {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.preview-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.65rem 1.4rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 800;
  text-decoration: none;
  transition: all 0.2s ease;
}
.btn-primary-launch {
  color: #fff;
}
.btn-primary-launch:hover {
  transform: translateY(-2px);
}
.btn-secondary-launch {
  background: #fff;
  color: #334155;
  border: 1px solid #cbd5e1;
}
.btn-secondary-launch:hover {
  background: #f8fafc;
  border-color: #94a3b8;
}

.preview-footer-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  background: var(--bg-card);
}

.btn-edit-direct {
  padding: 0.65rem 1.3rem;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #4f008c, #7c3aed);
  color: #fff;
  font-size: 0.84rem;
  font-weight: 800;
  cursor: pointer;
}

/* Spinner & States */
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
</style>
