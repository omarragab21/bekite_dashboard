<template>
  <div class="partners-page" dir="rtl">
    <!-- ================= PAGE HEADER ================= -->
    <div class="page-header">
      <div class="header-titles">
        <div class="header-badge-pill">
          <span class="pill-dot"></span>
          <span>تحالفات واعتمادات دولية معتمدة لـ Be Kite</span>
        </div>
        <h1 class="page-title">شركاء التكنولوجيا والاعتماد الدولي (Strategic Partners)</h1>
        <p class="page-subtitle">
          منظومة التحالفات الاستراتيجية المعتمدة لـ Be Kite مع كبرى شركات التكنولوجيا العالمية، الحوسبة السحابية، ومتاجر التطبيقات (Google Play, Apple App Store, AWS, Microsoft, Oracle, Stripe)
        </p>
      </div>

      <div class="header-actions">
        <button class="btn-add-partner" @click="openAddModal" id="btn-add-partner">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          <span>إضافة شريك جديد</span>
        </button>
      </div>
    </div>

    <!-- ================= STATS KPI CARDS ================= -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon blue">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-val">{{ partnersList.length }}</span>
          <span class="stat-label">إجمالي الشركاء المسجلين</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon purple">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-val">{{ cloudPartnersCount }}</span>
          <span class="stat-label">منصات حوسبة سحابية (Cloud & AI)</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon amber">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-val">{{ storePartnersCount }}</span>
          <span class="stat-label">متاجر تطبيقات معتمدة (Stores)</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon emerald">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-val">{{ activePartnersCount }}</span>
          <span class="stat-label">شركاء نشطون ومعتمدون رسمياً</span>
        </div>
      </div>
    </div>

    <!-- ================= CONTROLS ROW: SEARCH & CATEGORY TABS ================= -->
    <div class="controls-card">
      <!-- Search -->
      <div class="search-box">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ابحث بالاسم، الفئة، المتجر، أو الخدمة السحابية..."
          class="search-input"
        />
        <button v-if="searchQuery" class="clear-search-btn" @click="searchQuery = ''">✕</button>
      </div>

      <!-- Filter Tabs -->
      <div class="filter-tabs">
        <button
          v-for="cat in categories"
          :key="cat.key"
          class="filter-tab-btn"
          :class="{ active: selectedCategory === cat.key }"
          @click="selectedCategory = cat.key"
        >
          {{ cat.label }} ({{ getCategoryCount(cat.key) }})
        </button>
      </div>
    </div>

    <!-- ================= LOADING / EMPTY STATES ================= -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>جاري تحميل قائمة الشركاء الاستراتيجيين...</p>
    </div>

    <div v-else-if="filteredPartners.length === 0" class="empty-state">
      <div class="empty-icon-wrap">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
        </svg>
      </div>
      <h3>لا توجد نتائج مطابقة</h3>
      <p>لم يتم العثور على أي شريك يطابق معايير البحث أو الفلتر المحددة.</p>
      <button class="btn-reset-filters" @click="resetFilters">إعادة ضبط الفلاتر</button>
    </div>

    <!-- ================= PARTNERS GRID ================= -->
    <div v-else class="partners-grid">
      <div
        v-for="partner in filteredPartners"
        :key="partner.id"
        class="partner-card"
        :class="{ 'partner-inactive': partner.is_active === 0 || partner.is_active === false }"
      >
        <!-- Top color accent stripe -->
        <div class="partner-stripe" :style="{ background: partner.brand_color || '#4f008c' }"></div>

        <div class="partner-card-body">
          <!-- Head: Logo, Badge, Active Toggle -->
          <div class="partner-head">
            <div class="partner-logo-box" :style="{ borderColor: getAlphaColor(partner.brand_color || '#4f008c', '30') }">
              <!-- Preset Google Logo -->
              <svg v-if="partner.logoType === 'google'" width="32" height="32" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <!-- Preset Apple Logo -->
              <svg v-else-if="partner.logoType === 'apple'" width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 0.6-2.65 1.35-.58.66-1.08 1.73-0.95 2.76 1.01.08 2.05-.51 2.68-1.26z"/>
              </svg>
              <!-- Preset Microsoft Logo -->
              <svg v-else-if="partner.logoType === 'microsoft'" width="28" height="28" viewBox="0 0 24 24">
                <path fill="#F25022" d="M1 1h10v10H1z"/>
                <path fill="#00A4EF" d="M1 13h10v10H1z"/>
                <path fill="#7FBA00" d="M13 1h10v10H13z"/>
                <path fill="#FFB900" d="M13 13h10v10H13z"/>
              </svg>
              <!-- Preset AWS Logo -->
              <svg v-else-if="partner.logoType === 'aws'" width="32" height="32" viewBox="0 0 24 24" fill="#FF9900">
                <path d="M19.467 14.545c-2.427 1.787-5.97 2.733-8.99 2.733-4.246 0-8.067-1.545-10.95-4.122-.227-.202-.047-.48.22-.325 3.12 1.796 6.88 2.88 10.73 2.88 2.68 0 5.617-.604 8.273-1.854.407-.193.747.275.717.688zm.97-1.127c-.31-.397-2.02-.187-2.793-.095-.236.028-.27-.16-.06-.307 1.393-.974 3.666-.694 4.02-.258.354.436-.09 2.713-1.397 3.8-.198.165-.386.077-.298-.14.286-.714.838-2.603.528-3zm-9.84-2.868c-.615-.494-1.258-.93-1.258-1.868 0-1.18 1.01-1.996 2.37-1.996 1.48 0 2.39.815 2.45 2.115l.006.18h2.09c-.066-2.186-1.748-3.79-4.546-3.79-2.584 0-4.484 1.544-4.484 3.705 0 1.942 1.344 2.86 2.617 3.738 1.096.758 1.48 1.155 1.48 2.054 0 1.25-1.15 2.14-2.71 2.14-1.782 0-2.83-.984-2.92-2.37l-.008-.184h-2.15c.1 2.42 1.97 4.05 5.078 4.05 2.796 0 4.832-1.636 4.832-3.96 0-2.15-1.464-3.136-2.847-4.074z"/>
              </svg>
              <!-- Preset Oracle Logo -->
              <svg v-else-if="partner.logoType === 'oracle'" width="32" height="32" viewBox="0 0 24 24" fill="#C74634">
                <path d="M16.42 4H7.58C3.39 4 0 7.42 0 11.66s3.39 7.66 7.58 7.66h8.84c4.19 0 7.58-3.42 7.58-7.66S20.61 4 16.42 4zm-.24 11.75H7.82c-2.31 0-4.18-1.88-4.18-4.19 0-2.3 1.87-4.18 4.18-4.18h8.36c2.31 0 4.18 1.88 4.18 4.18 0 2.31-1.87 4.19-4.18 4.19z"/>
              </svg>
              <!-- Preset Stripe Logo -->
              <svg v-else-if="partner.logoType === 'stripe'" width="30" height="30" viewBox="0 0 24 24" fill="#635BFF">
                <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C17.652.822 15.112.25 12.353.25 6.44.25 2.38 3.39 2.38 8.163c0 6.16 6.05 6.77 8.188 7.545 2.457.893 3.3 1.657 3.3 2.754 0 1.082-.962 1.706-2.502 1.706-2.42 0-5.32-.994-7.398-2.227l-.934 5.688c2.254 1.157 5.258 1.621 8.082 1.621 6.304 0 10.648-2.923 10.648-8.158 0-6.177-5.918-6.994-7.788-7.942z"/>
              </svg>
              <!-- Preset NVIDIA Logo -->
              <svg v-else-if="partner.logoType === 'nvidia'" width="30" height="30" viewBox="0 0 24 24" fill="#76B900">
                <path d="M7.747 8.683c-.075.845.02 1.725.26 2.545C6.1 10.3 4.8 8.6 4.8 6.6c0-2.8 2.5-5.1 5.6-5.1 3.5 0 6.3 2.6 6.5 6-.8-.6-1.8-1-2.9-1-2.9 0-5.2 2.1-5.2 5zm5.7 6.4c-2 0-3.6-1.6-3.6-3.6s1.6-3.6 3.6-3.6 3.6 1.6 3.6 3.6-1.6 3.6-3.6 3.6zm0-8.7c-2.8 0-5.1 2.3-5.1 5.1 0 1.4.6 2.7 1.5 3.6-1.5 1.2-3.4 2-5.5 2-4.1 0-7.4-3.3-7.4-7.4 0-4.1 3.3-7.4 7.4-7.4 3.7 0 6.8 2.7 7.3 6.3-.6-.1-1.3-.2-1.9-.2zm6.2 8.7c-1.3 1.3-3.1 2.2-5.1 2.2-1.2 0-2.3-.3-3.3-.8 1.4-.7 2.4-2.1 2.4-3.7 0-.5-.1-1-.3-1.4 1.6.4 2.8 1.8 2.8 3.5 0 .1 0 .2-.1.3 1.3-.9 2.2-2.3 2.5-4 1.1 1.4 1.8 3.1 1.8 5 0 2.2-.9 4.2-2.4 5.6.8-.7 1.5-1.5 2-2.4-.1.6-.2 1.2-.4 1.7-1.1 1.7-3 2.9-5.1 3.3-.8.2-1.7.3-2.6.3-4.4 0-8.4-2.3-10.6-5.9 1.8 2.2 4.5 3.6 7.6 3.6 3.5 0 6.6-1.8 8.4-4.6.6-.9 1.1-1.9 1.3-3 .2-.6.3-1.2.4-1.8z"/>
              </svg>
              <!-- Custom Uploaded or Direct URL Logo -->
              <img
                v-else-if="partner.logo_url || partner.image"
                :src="partner.logo_url || partner.image"
                :alt="partner.name"
                class="partner-custom-logo-img"
                @error="onPartnerImgError"
              />
              <!-- Default Fallback SVG -->
              <svg v-else width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>

            <div class="partner-meta">
              <span
                class="partner-badge-chip"
                :style="{
                  borderColor: getAlphaColor(partner.brand_color || '#4f008c', '50'),
                  color: partner.brand_color || '#4f008c',
                  backgroundColor: getAlphaColor(partner.brand_color || '#4f008c', '10')
                }"
              >
                {{ partner.badge || 'شريك معتمد' }}
              </span>

              <div class="partner-status-row">
                <button
                  class="btn-status-toggle"
                  :class="partner.is_active ? 'active' : 'inactive'"
                  @click="handleToggleStatus(partner)"
                  :title="partner.is_active ? 'تعطيل الشريك' : 'تفعيل الشريك'"
                >
                  <span class="status-dot"></span>
                  <span>{{ partner.is_active ? 'معتمد ونشط' : 'غير نشط' }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Titles -->
          <div class="partner-titles">
            <div class="partner-name-wrap">
              <h3 class="partner-name">{{ partner.name_ar || partner.name }}</h3>
              <span v-if="partner.name_ar && partner.name" class="partner-name-en">({{ partner.name }})</span>
            </div>
            <span class="partner-tier" :style="{ color: partner.brand_color || '#4f008c' }">{{ partner.tier }}</span>
            <p class="partner-sub">{{ partner.subtitle }}</p>
          </div>

          <!-- Description -->
          <p class="partner-desc">{{ partner.description }}</p>

          <!-- Verified Features (Chips) -->
          <div class="partner-features" v-if="partner.features && partner.features.length">
            <span class="features-label">أبرز محاور وقدرات التكامل:</span>
            <div class="feat-pills-wrap">
              <span v-for="feat in partner.features" :key="feat" class="feat-pill">
                ✓ {{ feat }}
              </span>
            </div>
          </div>

          <!-- Store and Platform Badges -->
          <div class="partner-platforms-summary">
            <span v-if="partner.google_play_url" class="platform-chip gplay" title="تكامل مع Google Play">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 20.5v-17c0-.83.67-1.5 1.5-1.5.34 0 .66.12.92.31l13.5 8.5c.67.42.87 1.3.45 1.97-.11.18-.26.33-.45.45l-13.5 8.5c-.26.19-.58.31-.92.31-.83 0-1.5-.67-1.5-1.5z"/>
              </svg>
              Google Play
            </span>
            <span v-if="partner.apple_store_url" class="platform-chip apple" title="تكامل مع App Store">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 0.6-2.65 1.35-.58.66-1.08 1.73-0.95 2.76 1.01.08 2.05-.51 2.68-1.26z"/>
              </svg>
              App Store
            </span>
            <span v-if="partner.website_url" class="platform-chip web" title="بوابة سحابية رسمية">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              Official Portal
            </span>
          </div>

          <!-- Action Links to Official Portals -->
          <div class="partner-links-footer">
            <a
              v-for="link in partner.links"
              :key="link.label"
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
              class="partner-btn"
              :class="link.type === 'primary' ? 'primary-btn' : 'secondary-btn'"
            >
              <span>{{ link.label }}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          </div>

          <!-- Card Admin Toolbar (Preview, Edit, Delete) -->
          <div class="partner-admin-toolbar">
            <button class="btn-card-action preview" @click="openPreviewModal(partner)" title="معاينة حية للمظهر">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              <span>معاينة العرض</span>
            </button>
            <button class="btn-card-action edit" @click="openEditModal(partner)" title="تعديل بيانات الشريك">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              <span>تعديل</span>
            </button>
            <button class="btn-card-action delete" @click="confirmDeletePartner(partner)" title="حذف الشريك">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
              <span>حذف</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= ADD / EDIT PARTNER MODAL ================= -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="partner-modal-box">
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="modal-header-text">
            <div class="modal-badge-pill">
              <span class="pill-dot"></span>
              <span>{{ isEdit ? 'تحديث بيانات الشريك' : 'تسجيل شريك جديد في منظومة Be Kite' }}</span>
            </div>
            <h2 class="modal-title">{{ isEdit ? 'تعديل بيانات الشريك التكنولوجي' : 'إضافة شريك استراتيجي وتكنولوجي جديد' }}</h2>
            <p class="modal-sub">قم بإدخال بيانات الشريك، منصات المتاجر، محاور التكامل، وشعار الشراكة المعتمدة</p>
          </div>
          <button class="btn-modal-close" @click="closeModal" title="إغلاق">✕</button>
        </div>

        <!-- Wizard Tabs Header -->
        <div class="modal-tabs-header">
          <button
            class="tab-btn"
            :class="{ active: formTab === 'identity' }"
            @click="formTab = 'identity'"
          >
            1. الهوية والتصنيف والاعتماد
          </button>
          <button
            class="tab-btn"
            :class="{ active: formTab === 'visuals' }"
            @click="formTab = 'visuals'"
          >
            2. الشعار والقدرات والوصف
          </button>
          <button
            class="tab-btn"
            :class="{ active: formTab === 'platforms' }"
            @click="formTab = 'platforms'"
          >
            3. منصات المتاجر والروابط
          </button>
        </div>

        <!-- Modal Form Form Body -->
        <form @submit.prevent="handleSavePartner" class="modal-form-content">
          <div class="modal-scroll-body">
            <!-- TAB 1: Identity & Tier -->
            <div v-show="formTab === 'identity'" class="tab-pane">
              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label">اسم الشريك (English) *</label>
                  <input
                    v-model="formData.name"
                    type="text"
                    required
                    class="form-input ltr-text"
                    placeholder="e.g. Google, Apple, AWS, Cloudflare"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">اسم الشريك (بالعربية) *</label>
                  <input
                    v-model="formData.name_ar"
                    type="text"
                    required
                    class="form-input"
                    placeholder="مثال: جوجل العالمية، أبل، أمازون ويب سيرفسز"
                  />
                </div>
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label">العنوان الفرعي للشراكة (Subtitle)</label>
                  <input
                    v-model="formData.subtitle"
                    type="text"
                    class="form-input"
                    placeholder="مثال: Google Cloud & Google Play Official Partner"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">فئة الشراكة (Category) *</label>
                  <select v-model="formData.category" class="form-select" required>
                    <option value="cloud">الحوسبة السحابية والبنية التحتية (Cloud & AI)</option>
                    <option value="stores">منصات ومتاجر التطبيقات (Stores & Platforms)</option>
                    <option value="fintech">المدفوعات والتكنولوجيا المالية (FinTech & Data)</option>
                    <option value="ai">الذكاء الاصطناعي وعلوم البيانات (AI & Machine Learning)</option>
                    <option value="infrastructure">الأمان وقواعد البيانات (Enterprise Security)</option>
                  </select>
                </div>
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label">المستوى والاعتماد الرسمي (Partner Tier)</label>
                  <input
                    v-model="formData.tier"
                    type="text"
                    class="form-input"
                    placeholder="مثال: Google Premier Partner, Apple Developer Enterprise"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">الشارة البارزة (Badge Chip)</label>
                  <input
                    v-model="formData.badge"
                    type="text"
                    class="form-input"
                    placeholder="مثال: شريك تكنولوجي معتمد, شريك مطوري iOS"
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
                  <label class="form-label">لون التمييز الثانوي (Accent Color)</label>
                  <div class="color-picker-wrap">
                    <input type="color" v-model="formData.accent_color" class="color-picker-input" />
                    <input type="text" v-model="formData.accent_color" class="form-input ltr-text" />
                  </div>
                </div>
              </div>
            </div>

            <!-- TAB 2: Visuals, Logo & Capabilities -->
            <div v-show="formTab === 'visuals'" class="tab-pane">
              <div class="form-group">
                <label class="form-label">شعار الشريك (Partner Brand Logo) *</label>
                <div class="logo-selection-box">
                  <div class="presets-section">
                    <span class="presets-label">اختر شعاراً سريعاً معتمداً:</span>
                    <div class="logo-presets-grid">
                      <button
                        type="button"
                        v-for="preset in logoPresets"
                        :key="preset.type"
                        class="preset-logo-btn"
                        :class="{ active: formData.logoType === preset.type }"
                        @click="selectLogoPreset(preset)"
                      >
                        <span class="preset-icon" v-html="preset.svg"></span>
                        <span class="preset-name">{{ preset.label }}</span>
                      </button>
                    </div>
                  </div>

                  <div class="logo-divider"><span>أو ارفع شعاراً مخصصاً</span></div>

                  <div class="custom-logo-uploader">
                    <div class="custom-logo-preview">
                      <img
                        v-if="formData.logo_url || logoPreviewUrl"
                        :src="logoPreviewUrl || formData.logo_url"
                        alt="Logo Preview"
                        class="preview-thumb"
                        @error="onPartnerImgError"
                      />
                      <div v-else class="preview-placeholder">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                        </svg>
                        <span>معاينة الشعار</span>
                      </div>
                    </div>

                    <div class="custom-logo-inputs">
                      <label class="btn-file-upload">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                        رفع شعار من جهازك
                        <input type="file" accept="image/*" @change="onLogoFileChange" style="display: none;" />
                      </label>
                      <input
                        type="text"
                        v-model="formData.logo_url"
                        class="form-input ltr-text"
                        placeholder="أو ضع رابط الشعار المباشر: https://... / png / svg"
                        @input="formData.logoType = 'custom'"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Integration Features Tag Adder -->
              <div class="form-group">
                <label class="form-label">محاور وقدرات التكامل والاعتماد (Integration Features)</label>
                <div class="tag-input-wrapper">
                  <input
                    v-model="newFeatureInput"
                    type="text"
                    class="form-input"
                    placeholder="اكتب محور تكامل (مثال: متجر Google Play، سحابة Firebase، تكامل Apple Pay) واضغط Enter"
                    @keydown.enter.prevent="addFeatureTag"
                  />
                  <button type="button" class="btn-add-tag" @click="addFeatureTag">إضافة محور</button>
                </div>
                <div class="tags-chips-container" v-if="formData.features.length > 0">
                  <span v-for="(feat, index) in formData.features" :key="index" class="feature-tag-chip">
                    <span>{{ feat }}</span>
                    <button type="button" class="remove-tag-btn" @click="removeFeatureTag(index)">✕</button>
                  </span>
                </div>
              </div>

              <!-- Detailed Description -->
              <div class="form-group">
                <label class="form-label">الوصف التفصيلي للشراكة وقيمتها لمنظومة Be Kite</label>
                <textarea
                  v-model="formData.description"
                  rows="3"
                  class="form-textarea"
                  placeholder="اشرح طبيعة الشراكة والاعتماد، نطاق الحلول، وتأثيره على منتجات وعملاء بي كايت..."
                ></textarea>
              </div>
            </div>

            <!-- TAB 3: Platforms & Store Integration Links -->
            <div v-show="formTab === 'platforms'" class="tab-pane">
              <div class="section-hint">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span>روابط منصات المتاجر ووحدات التحكم السحابية (مبنية بنفس معايير ستور استعراض العلامات التجارية)</span>
              </div>

              <!-- Google Play Console -->
              <div class="form-group">
                <label class="form-label flex-between">
                  <span>رابط منصة Google Play (Console / Store Link)</span>
                  <span class="platform-indicator gplay">متجر أندرويد الرسمي</span>
                </label>
                <input
                  v-model="formData.google_play_url"
                  type="url"
                  class="form-input ltr-text"
                  placeholder="https://play.google.com/console أو رابط متجر التطبيقات"
                />
              </div>

              <!-- Apple App Store / Developer -->
              <div class="form-group">
                <label class="form-label flex-between">
                  <span>رابط منصة Apple Developer / App Store Connect</span>
                  <span class="platform-indicator apple">متجر iOS الرسمي</span>
                </label>
                <input
                  v-model="formData.apple_store_url"
                  type="url"
                  class="form-input ltr-text"
                  placeholder="https://appstoreconnect.apple.com أو رابط المطورين"
                />
              </div>

              <!-- Official Website / Cloud Portal -->
              <div class="form-group">
                <label class="form-label flex-between">
                  <span>رابط البوابة السحابية الرسمية (Website / Cloud Console)</span>
                  <span class="platform-indicator web">البوابة الرسمية</span>
                </label>
                <input
                  v-model="formData.website_url"
                  type="url"
                  class="form-input ltr-text"
                  placeholder="https://cloud.google.com أو رابط البوابة الرسمية"
                />
              </div>

              <!-- Custom Link 1 & 2 -->
              <div class="custom-links-section">
                <label class="form-label">روابط البوابات التفاعلية (Action Portal Buttons):</label>
                <div class="form-grid-2">
                  <div class="form-group">
                    <input
                      v-model="linkOneLabel"
                      type="text"
                      class="form-input"
                      placeholder="عنوان الزر الأول (مثال: Google Play Console)"
                    />
                    <input
                      v-model="linkOneHref"
                      type="url"
                      class="form-input ltr-text mt-1"
                      placeholder="رابط الزر الأول: https://..."
                    />
                  </div>
                  <div class="form-group">
                    <input
                      v-model="linkTwoLabel"
                      type="text"
                      class="form-input"
                      placeholder="عنوان الزر الثاني (مثال: Cloud Portal)"
                    />
                    <input
                      v-model="linkTwoHref"
                      type="url"
                      class="form-input ltr-text mt-1"
                      placeholder="رابط الزر الثاني: https://..."
                    />
                  </div>
                </div>
              </div>

              <!-- Status Toggle -->
              <div class="status-toggle-box">
                <label class="toggle-checkbox-label">
                  <input
                    type="checkbox"
                    v-model="formData.is_active"
                    :true-value="1"
                    :false-value="0"
                  />
                  <span class="toggle-text">تفعيل الشريك وإظهاره رسمياً في الموقع ولوحة القيادة</span>
                </label>
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
                v-if="formTab !== 'platforms'"
                class="btn-step-nav next"
                @click="goToNextTab"
              >
                الخطوة التالية →
              </button>
            </div>

            <div class="modal-footer-actions">
              <button type="button" class="btn-cancel" @click="closeModal">إلغاء</button>
              <button type="submit" class="btn-save" :disabled="saving">
                {{ saving ? 'جاري الحفظ...' : (isEdit ? 'تحديث بيانات الشريك' : 'حفظ ونشر الشريك') }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- ================= LIVE PREVIEW MODAL ================= -->
    <div v-if="previewPartner" class="modal-overlay" @click.self="previewPartner = null">
      <div class="preview-modal-box">
        <div class="preview-modal-head">
          <div class="modal-badge-pill">
            <span class="pill-dot"></span>
            <span>معاينة العرض في موقع Be Kite الرسمي</span>
          </div>
          <button class="btn-modal-close" @click="previewPartner = null">✕</button>
        </div>

        <div class="preview-partner-card">
          <div class="preview-stripe" :style="{ background: previewPartner.brand_color || '#4f008c' }"></div>
          <div class="preview-body">
            <div class="preview-top-flex">
              <div class="preview-logo-circle" :style="{ borderColor: previewPartner.brand_color || '#4f008c' }">
                <svg v-if="previewPartner.logoType === 'google'" width="36" height="36" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <svg v-else-if="previewPartner.logoType === 'apple'" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 0.6-2.65 1.35-.58.66-1.08 1.73-0.95 2.76 1.01.08 2.05-.51 2.68-1.26z"/>
                </svg>
                <img
                  v-else-if="previewPartner.logo_url || previewPartner.image"
                  :src="previewPartner.logo_url || previewPartner.image"
                  alt="Logo"
                  class="partner-custom-logo-img"
                  @error="onPartnerImgError"
                />
                <span v-else class="preview-fallback-txt">{{ previewPartner.name.slice(0, 2).toUpperCase() }}</span>
              </div>

              <div class="preview-badge-status">
                <span class="partner-badge-chip" :style="{ color: previewPartner.brand_color, borderColor: previewPartner.brand_color }">
                  {{ previewPartner.badge }}
                </span>
                <span class="verified-pill">✓ شريك معتمد</span>
              </div>
            </div>

            <h3 class="preview-title">{{ previewPartner.name_ar || previewPartner.name }}</h3>
            <span class="preview-tier" :style="{ color: previewPartner.brand_color }">{{ previewPartner.tier }}</span>
            <p class="preview-subtitle">{{ previewPartner.subtitle }}</p>
            <p class="preview-desc">{{ previewPartner.description }}</p>

            <div class="preview-features-box" v-if="previewPartner.features?.length">
              <span class="features-label">أبرز محاور التكامل:</span>
              <div class="feat-pills-wrap">
                <span v-for="feat in previewPartner.features" :key="feat" class="feat-pill">
                  ✓ {{ feat }}
                </span>
              </div>
            </div>

            <div class="preview-store-buttons">
              <a
                v-if="previewPartner.google_play_url"
                :href="previewPartner.google_play_url"
                target="_blank"
                class="store-btn gplay"
              >
                <span>Google Play Console</span>
              </a>
              <a
                v-if="previewPartner.apple_store_url"
                :href="previewPartner.apple_store_url"
                target="_blank"
                class="store-btn apple"
              >
                <span>App Store Connect</span>
              </a>
              <a
                v-if="previewPartner.website_url"
                :href="previewPartner.website_url"
                target="_blank"
                class="store-btn web"
              >
                <span>Official Web Portal</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= DELETE CONFIRMATION MODAL ================= -->
    <div v-if="partnerToDelete" class="modal-overlay" @click.self="partnerToDelete = null">
      <div class="confirm-modal-box">
        <div class="confirm-icon danger">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <h3 class="confirm-title">تأكيد حذف الشريك</h3>
        <p class="confirm-msg">
          هل أنت متأكد من رغبتك في حذف الشريك
          <strong>"{{ partnerToDelete.name_ar || partnerToDelete.name }}"</strong>؟
          سيتم إزالته من الموقع والداشبورد نهائياً.
        </p>
        <div class="confirm-actions">
          <button class="btn-cancel" @click="partnerToDelete = null">إلغاء</button>
          <button class="btn-delete-confirm" @click="handleDeletePartner">نعم، احذف الشريك</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { PartnerService, DEFAULT_PARTNERS } from '../services';

const searchQuery = ref('');
const selectedCategory = ref('all');
const loading = ref(false);
const saving = ref(false);
const partnersList = ref([]);

// Modal states
const showModal = ref(false);
const isEdit = ref(false);
const formTab = ref('identity');
const previewPartner = ref(null);
const partnerToDelete = ref(null);
const logoPreviewUrl = ref('');
const newFeatureInput = ref('');

// Extra links fields
const linkOneLabel = ref('');
const linkOneHref = ref('');
const linkTwoLabel = ref('');
const linkTwoHref = ref('');

// Categories definition
const categories = [
  { key: 'all', label: 'كافة الشركاء' },
  { key: 'cloud', label: 'الحوسبة السحابية (Cloud & AI)' },
  { key: 'stores', label: 'منصات ومتاجر التطبيقات (Stores)' },
  { key: 'fintech', label: 'المدفوعات وقواعد البيانات (FinTech)' },
  { key: 'ai', label: 'الذكاء الاصطناعي (AI)' },
];

// Preset logos
const logoPresets = [
  {
    type: 'google',
    label: 'Google',
    brand_color: '#4285F4',
    accent_color: '#34A853',
    svg: `<svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/><path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/></svg>`
  },
  {
    type: 'apple',
    label: 'Apple',
    brand_color: '#18181b',
    accent_color: '#52525b',
    svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 0.6-2.65 1.35-.58.66-1.08 1.73-0.95 2.76 1.01.08 2.05-.51 2.68-1.26z"/></svg>`
  },
  {
    type: 'microsoft',
    label: 'Microsoft',
    brand_color: '#00A4EF',
    accent_color: '#7FBA00',
    svg: `<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#F25022" d="M1 1h10v10H1z"/><path fill="#00A4EF" d="M1 13h10v10H1z"/><path fill="#7FBA00" d="M13 1h10v10H13z"/><path fill="#FFB900" d="M13 13h10v10H13z"/></svg>`
  },
  {
    type: 'aws',
    label: 'AWS',
    brand_color: '#FF9900',
    accent_color: '#232F3E',
    svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="#FF9900"><path d="M19.467 14.545c-2.427 1.787-5.97 2.733-8.99 2.733-4.246 0-8.067-1.545-10.95-4.122-.227-.202-.047-.48.22-.325 3.12 1.796 6.88 2.88 10.73 2.88 2.68 0 5.617-.604 8.273-1.854.407-.193.747.275.717.688zm.97-1.127c-.31-.397-2.02-.187-2.793-.095-.236.028-.27-.16-.06-.307 1.393-.974 3.666-.694 4.02-.258.354.436-.09 2.713-1.397 3.8-.198.165-.386.077-.298-.14.286-.714.838-2.603.528-3zm-9.84-2.868c-.615-.494-1.258-.93-1.258-1.868 0-1.18 1.01-1.996 2.37-1.996 1.48 0 2.39.815 2.45 2.115l.006.18h2.09c-.066-2.186-1.748-3.79-4.546-3.79-2.584 0-4.484 1.544-4.484 3.705 0 1.942 1.344 2.86 2.617 3.738 1.096.758 1.48 1.155 1.48 2.054 0 1.25-1.15 2.14-2.71 2.14-1.782 0-2.83-.984-2.92-2.37l-.008-.184h-2.15c.1 2.42 1.97 4.05 5.078 4.05 2.796 0 4.832-1.636 4.832-3.96 0-2.15-1.464-3.136-2.847-4.074z"/></svg>`
  },
  {
    type: 'oracle',
    label: 'Oracle',
    brand_color: '#C74634',
    accent_color: '#000000',
    svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="#C74634"><path d="M16.42 4H7.58C3.39 4 0 7.42 0 11.66s3.39 7.66 7.58 7.66h8.84c4.19 0 7.58-3.42 7.58-7.66S20.61 4 16.42 4zm-.24 11.75H7.82c-2.31 0-4.18-1.88-4.18-4.19 0-2.3 1.87-4.18 4.18-4.18h8.36c2.31 0 4.18 1.88 4.18 4.18 0 2.31-1.87 4.19-4.18 4.19z"/></svg>`
  },
  {
    type: 'stripe',
    label: 'Stripe',
    brand_color: '#635BFF',
    accent_color: '#0A2540',
    svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="#635BFF"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C17.652.822 15.112.25 12.353.25 6.44.25 2.38 3.39 2.38 8.163c0 6.16 6.05 6.77 8.188 7.545 2.457.893 3.3 1.657 3.3 2.754 0 1.082-.962 1.706-2.502 1.706-2.42 0-5.32-.994-7.398-2.227l-.934 5.688c2.254 1.157 5.258 1.621 8.082 1.621 6.304 0 10.648-2.923 10.648-8.158 0-6.177-5.918-6.994-7.788-7.942z"/></svg>`
  },
  {
    type: 'nvidia',
    label: 'NVIDIA',
    brand_color: '#76B900',
    accent_color: '#111111',
    svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="#76B900"><path d="M7.747 8.683c-.075.845.02 1.725.26 2.545C6.1 10.3 4.8 8.6 4.8 6.6c0-2.8 2.5-5.1 5.6-5.1 3.5 0 6.3 2.6 6.5 6-.8-.6-1.8-1-2.9-1-2.9 0-5.2 2.1-5.2 5zm5.7 6.4c-2 0-3.6-1.6-3.6-3.6s1.6-3.6 3.6-3.6 3.6 1.6 3.6 3.6-1.6 3.6-3.6 3.6zm0-8.7c-2.8 0-5.1 2.3-5.1 5.1 0 1.4.6 2.7 1.5 3.6-1.5 1.2-3.4 2-5.5 2-4.1 0-7.4-3.3-7.4-7.4 0-4.1 3.3-7.4 7.4-7.4 3.7 0 6.8 2.7 7.3 6.3-.6-.1-1.3-.2-1.9-.2zm6.2 8.7c-1.3 1.3-3.1 2.2-5.1 2.2-1.2 0-2.3-.3-3.3-.8 1.4-.7 2.4-2.1 2.4-3.7 0-.5-.1-1-.3-1.4 1.6.4 2.8 1.8 2.8 3.5 0 .1 0 .2-.1.3 1.3-.9 2.2-2.3 2.5-4 1.1 1.4 1.8 3.1 1.8 5 0 2.2-.9 4.2-2.4 5.6.8-.7 1.5-1.5 2-2.4-.1.6-.2 1.2-.4 1.7-1.1 1.7-3 2.9-5.1 3.3-.8.2-1.7.3-2.6.3-4.4 0-8.4-2.3-10.6-5.9 1.8 2.2 4.5 3.6 7.6 3.6 3.5 0 6.6-1.8 8.4-4.6.6-.9 1.1-1.9 1.3-3 .2-.6.3-1.2.4-1.8z"/></svg>`
  },
];

// Active form state
const currentEditingId = ref(null);
const formData = ref({
  name: '',
  name_ar: '',
  subtitle: '',
  badge: 'شريك تكنولوجي معتمد',
  tier: 'Technology Partner',
  category: 'cloud',
  brand_color: '#4f008c',
  accent_color: '#ffc700',
  logoType: 'google',
  logo_url: '',
  description: '',
  features: [],
  links: [],
  google_play_url: '',
  apple_store_url: '',
  website_url: '',
  is_active: 1,
});

// KPI Counts
const cloudPartnersCount = computed(() => {
  return partnersList.value.filter(p => p.category === 'cloud' || p.category === 'ai').length;
});

const storePartnersCount = computed(() => {
  return partnersList.value.filter(p => p.category === 'stores' || Boolean(p.google_play_url) || Boolean(p.apple_store_url)).length;
});

const activePartnersCount = computed(() => {
  return partnersList.value.filter(p => p.is_active === 1 || p.is_active === true).length;
});

const getCategoryCount = (catKey) => {
  if (catKey === 'all') return partnersList.value.length;
  if (catKey === 'stores') {
    return partnersList.value.filter(p => p.category === 'stores' || Boolean(p.google_play_url) || Boolean(p.apple_store_url)).length;
  }
  return partnersList.value.filter(p => p.category === catKey).length;
};

const filteredPartners = computed(() => {
  let list = partnersList.value;
  if (selectedCategory.value !== 'all') {
    if (selectedCategory.value === 'stores') {
      list = list.filter(p => p.category === 'stores' || Boolean(p.google_play_url) || Boolean(p.apple_store_url));
    } else {
      list = list.filter(p => p.category === selectedCategory.value);
    }
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(p =>
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.name_ar && p.name_ar.toLowerCase().includes(q)) ||
      (p.subtitle && p.subtitle.toLowerCase().includes(q)) ||
      (p.tier && p.tier.toLowerCase().includes(q)) ||
      (p.features && p.features.some(f => f.toLowerCase().includes(q)))
    );
  }
  return list;
});

const getAlphaColor = (hex, alphaPercent = '15') => {
  if (!hex || !hex.startsWith('#') || hex.length < 7) {
    return `rgba(79, 0, 140, 0.${alphaPercent})`;
  }
  return `${hex}${alphaPercent}`;
};

const onPartnerImgError = (e) => {
  e.target.style.display = 'none';
};

const resetFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = 'all';
};

// Fetch partners
const fetchPartners = async () => {
  loading.value = true;
  try {
    const data = await PartnerService.getAll();
    partnersList.value = Array.isArray(data) && data.length > 0 ? data : DEFAULT_PARTNERS;
  } catch (err) {
    console.error('Error fetching partners:', err);
    partnersList.value = DEFAULT_PARTNERS;
  } finally {
    loading.value = false;
  }
};

// Modal Management
const openAddModal = () => {
  isEdit.value = false;
  currentEditingId.value = null;
  formTab.value = 'identity';
  logoPreviewUrl.value = '';
  newFeatureInput.value = '';
  linkOneLabel.value = 'Google Play Console';
  linkOneHref.value = '';
  linkTwoLabel.value = 'Official Cloud Portal';
  linkTwoHref.value = '';

  formData.value = {
    name: '',
    name_ar: '',
    subtitle: '',
    badge: 'شريك تكنولوجي معتمد',
    tier: 'Technology Partner',
    category: 'cloud',
    brand_color: '#4f008c',
    accent_color: '#ffc700',
    logoType: 'google',
    logo_url: '',
    description: '',
    features: ['بنية سحابية مؤسسية', 'توثيق واعتماد رسمي'],
    links: [],
    google_play_url: '',
    apple_store_url: '',
    website_url: '',
    is_active: 1,
  };
  showModal.value = true;
};

const openEditModal = (partner) => {
  isEdit.value = true;
  currentEditingId.value = partner.id;
  formTab.value = 'identity';
  logoPreviewUrl.value = partner.logo_url || partner.image || '';
  newFeatureInput.value = '';

  const links = Array.isArray(partner.links) ? partner.links : [];
  linkOneLabel.value = links[0]?.label || '';
  linkOneHref.value = links[0]?.href || '';
  linkTwoLabel.value = links[1]?.label || '';
  linkTwoHref.value = links[1]?.href || '';

  formData.value = {
    name: partner.name || '',
    name_ar: partner.name_ar || '',
    subtitle: partner.subtitle || '',
    badge: partner.badge || 'شريك معتمد',
    tier: partner.tier || '',
    category: partner.category || 'cloud',
    brand_color: partner.brand_color || '#4f008c',
    accent_color: partner.accent_color || '#ffc700',
    logoType: partner.logoType || 'custom',
    logo_url: partner.logo_url || partner.image || '',
    description: partner.description || '',
    features: Array.isArray(partner.features) ? [...partner.features] : [],
    links: links,
    google_play_url: partner.google_play_url || '',
    apple_store_url: partner.apple_store_url || '',
    website_url: partner.website_url || '',
    is_active: partner.is_active !== undefined ? Number(partner.is_active) : 1,
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  logoPreviewUrl.value = '';
};

const selectLogoPreset = (preset) => {
  formData.value.logoType = preset.type;
  formData.value.brand_color = preset.brand_color;
  formData.value.accent_color = preset.accent_color;
  formData.value.logo_url = '';
  logoPreviewUrl.value = '';
};

const onLogoFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    formData.value.logoType = 'custom';
    formData.value.logo_file = file;
    const reader = new FileReader();
    reader.onload = (ev) => {
      logoPreviewUrl.value = ev.target.result;
      formData.value.logo_url = ev.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const addFeatureTag = () => {
  const val = newFeatureInput.value.trim();
  if (val && !formData.value.features.includes(val)) {
    formData.value.features.push(val);
    newFeatureInput.value = '';
  }
};

const removeFeatureTag = (index) => {
  formData.value.features.splice(index, 1);
};

const goToPrevTab = () => {
  if (formTab.value === 'platforms') formTab.value = 'visuals';
  else if (formTab.value === 'visuals') formTab.value = 'identity';
};

const goToNextTab = () => {
  if (formTab.value === 'identity') formTab.value = 'visuals';
  else if (formTab.value === 'visuals') formTab.value = 'platforms';
};

// Save Partner
const handleSavePartner = async () => {
  saving.value = true;
  try {
    const builtLinks = [];
    if (linkOneLabel.value && linkOneHref.value) {
      builtLinks.push({ label: linkOneLabel.value, href: linkOneHref.value, type: 'primary' });
    }
    if (linkTwoLabel.value && linkTwoHref.value) {
      builtLinks.push({ label: linkTwoLabel.value, href: linkTwoHref.value, type: 'secondary' });
    }

    const payload = {
      ...formData.value,
      links: builtLinks.length > 0 ? builtLinks : (formData.value.links || []),
    };

    if (isEdit.value && currentEditingId.value) {
      await PartnerService.update(currentEditingId.value, payload);
    } else {
      await PartnerService.create(payload);
    }

    await fetchPartners();
    closeModal();
  } catch (err) {
    console.error('Error saving partner:', err);
    alert('حدث خطأ أثناء حفظ بيانات الشريك');
  } finally {
    saving.value = false;
  }
};

// Toggle active status
const handleToggleStatus = async (partner) => {
  try {
    await PartnerService.toggleStatus(partner.id);
    await fetchPartners();
  } catch (err) {
    console.error('Error toggling status:', err);
  }
};

// Delete Partner
const confirmDeletePartner = (partner) => {
  partnerToDelete.value = partner;
};

const handleDeletePartner = async () => {
  if (!partnerToDelete.value) return;
  try {
    await PartnerService.delete(partnerToDelete.value.id);
    partnerToDelete.value = null;
    await fetchPartners();
  } catch (err) {
    console.error('Error deleting partner:', err);
    alert('تعذر حذف الشريك');
  }
};

// Preview Partner Modal
const openPreviewModal = (partner) => {
  previewPartner.value = partner;
};

onMounted(fetchPartners);
</script>

<style scoped>
.partners-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0.5rem 0 2rem;
}

/* Page Header */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.25rem;
}

.header-badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.3rem 0.85rem;
  border-radius: 9999px;
  background: rgba(79, 0, 140, 0.08);
  color: #4f008c;
  border: 1px solid rgba(79, 0, 140, 0.2);
  font-size: 0.76rem;
  font-weight: 700;
  margin-bottom: 0.45rem;
}

.dark .header-badge-pill {
  background: rgba(255, 199, 0, 0.12);
  color: #ffc700;
  border-color: rgba(255, 199, 0, 0.25);
}

.pill-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}

.page-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text-main);
  margin: 0;
  line-height: 1.3;
}

.page-subtitle {
  font-size: 0.86rem;
  color: var(--text-muted);
  margin: 0.35rem 0 0;
  max-width: 760px;
  line-height: 1.65;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-add-partner {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.35rem;
  border-radius: 10px;
  background: linear-gradient(135deg, #4f008c 0%, #7c3aed 100%);
  color: #ffffff;
  border: none;
  font-size: 0.84rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(79, 0, 140, 0.25);
  transition: all 0.2s ease;
}

.btn-add-partner:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79, 0, 140, 0.35);
}

.dark .btn-add-partner {
  background: linear-gradient(135deg, #ffc700 0%, #e6b400 100%);
  color: #150522;
  box-shadow: 0 4px 14px rgba(255, 199, 0, 0.25);
}

.dark .btn-add-partner:hover {
  box-shadow: 0 6px 20px rgba(255, 199, 0, 0.35);
}

/* Stats Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.blue {
  background: rgba(37, 99, 235, 0.12);
  color: #2563eb;
}

.stat-icon.purple {
  background: rgba(79, 0, 140, 0.12);
  color: #4f008c;
}

.dark .stat-icon.purple {
  background: rgba(255, 199, 0, 0.12);
  color: #ffc700;
}

.stat-icon.amber {
  background: rgba(217, 119, 6, 0.12);
  color: #d97706;
}

.stat-icon.emerald {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-val {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text-main);
  line-height: 1.2;
}

.stat-label {
  font-size: 0.76rem;
  color: var(--text-muted);
  margin-top: 0.2rem;
  font-weight: 600;
}

/* Controls Bar */
.controls-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 0.85rem 1.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 260px;
}

.search-icon {
  position: absolute;
  right: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.6rem 2.4rem 0.6rem 2rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-main);
  color: var(--text-main);
  font-size: 0.84rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  border-color: #4f008c;
}

.dark .search-input:focus {
  border-color: #ffc700;
}

.clear-search-btn {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 0.8rem;
}

.filter-tabs {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.filter-tab-btn {
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  padding: 0.5rem 0.9rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-tab-btn:hover {
  color: var(--text-main);
  border-color: #4f008c;
}

.filter-tab-btn.active {
  background: rgba(79, 0, 140, 0.1);
  color: #4f008c;
  border-color: #4f008c;
  font-weight: 700;
}

.dark .filter-tab-btn.active {
  background: rgba(255, 199, 0, 0.15);
  color: #ffc700;
  border-color: #ffc700;
}

/* Loading & Empty */
.loading-state, .empty-state {
  background: var(--bg-card);
  border: 1px dashed var(--border-color);
  border-radius: 14px;
  padding: 3.5rem 1.5rem;
  text-align: center;
  color: var(--text-muted);
}

.spinner {
  width: 38px;
  height: 38px;
  border: 3px solid rgba(79, 0, 140, 0.15);
  border-top-color: #4f008c;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(79, 0, 140, 0.08);
  color: #4f008c;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.btn-reset-filters {
  margin-top: 1rem;
  padding: 0.55rem 1.25rem;
  border-radius: 8px;
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
}

/* Partners Grid */
.partners-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

@media (max-width: 1200px) {
  .partners-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .partners-grid {
    grid-template-columns: 1fr;
  }
}

.partner-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.partner-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.partner-card.partner-inactive {
  opacity: 0.65;
  filter: grayscale(0.2);
}

.partner-stripe {
  height: 5px;
  width: 100%;
}

.partner-card-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.partner-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.9rem;
}

.partner-logo-box {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: var(--bg-main);
  border: 1.5px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.partner-custom-logo-img {
  max-width: 40px;
  max-height: 40px;
  object-fit: contain;
}

.partner-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.35rem;
}

.partner-badge-chip {
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  border: 1px solid;
}

.btn-status-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.55rem;
  border-radius: 9999px;
  font-size: 0.68rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
  transition: all 0.2s ease;
}

.btn-status-toggle.inactive {
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

/* Titles */
.partner-titles {
  margin-bottom: 0.7rem;
}

.partner-name-wrap {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.partner-name {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-main);
  margin: 0;
}

.partner-name-en {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 600;
}

.partner-tier {
  display: block;
  font-size: 0.76rem;
  font-weight: 700;
  margin-top: 0.15rem;
}

.partner-sub {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin: 0.2rem 0 0;
}

.partner-desc {
  font-size: 0.82rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0 0 0.9rem;
  flex: 1;
}

/* Features */
.partner-features {
  background: var(--bg-main);
  border-radius: 10px;
  padding: 0.75rem;
  margin-bottom: 0.85rem;
}

.features-label {
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--text-muted);
  display: block;
  margin-bottom: 0.45rem;
}

.feat-pills-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.feat-pill {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  background: var(--bg-card);
  color: var(--text-main);
  border: 1px solid var(--border-color);
}

/* Platforms Summary */
.partner-platforms-summary {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.85rem;
  flex-wrap: wrap;
}

.platform-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.55rem;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 700;
}

.platform-chip.gplay {
  background: rgba(66, 133, 244, 0.1);
  color: #4285f4;
}

.platform-chip.apple {
  background: rgba(82, 82, 91, 0.12);
  color: var(--text-main);
}

.platform-chip.web {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

/* Footer Links */
.partner-links-footer {
  display: flex;
  gap: 0.4rem;
  margin-bottom: 0.85rem;
}

.partner-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.5rem 0.6rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.partner-btn.primary-btn {
  background: #2563eb;
  color: #ffffff;
}

.partner-btn.primary-btn:hover {
  background: #1d4ed8;
}

.partner-btn.secondary-btn {
  background: var(--bg-main);
  color: var(--text-main);
  border: 1px solid var(--border-color);
}

.partner-btn.secondary-btn:hover {
  border-color: #4f008c;
}

/* Admin Toolbar */
.partner-admin-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-color);
}

.btn-card-action {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.45rem 0.5rem;
  border-radius: 7px;
  font-size: 0.74rem;
  font-weight: 700;
  border: 1px solid var(--border-color);
  background: var(--bg-main);
  color: var(--text-main);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-card-action:hover {
  background: var(--bg-card);
  border-color: #4f008c;
}

.btn-card-action.preview:hover {
  color: #2563eb;
  border-color: #2563eb;
}

.btn-card-action.edit:hover {
  color: #4f008c;
  border-color: #4f008c;
}

.dark .btn-card-action.edit:hover {
  color: #ffc700;
  border-color: #ffc700;
}

.btn-card-action.delete:hover {
  color: #ef4444;
  border-color: #ef4444;
}

/* ================= MODAL STYLING ================= */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 5, 20, 0.75);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1.25rem;
}

.partner-modal-box {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 18px;
  width: 100%;
  max-width: 820px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
  animation: modalIn 0.25s ease-out;
}

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.96) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.modal-badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.7rem;
  border-radius: 9999px;
  background: rgba(79, 0, 140, 0.08);
  color: #4f008c;
  font-size: 0.72rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
}

.dark .modal-badge-pill {
  background: rgba(255, 199, 0, 0.12);
  color: #ffc700;
}

.modal-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-main);
  margin: 0;
}

.modal-sub {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0.2rem 0 0;
}

.btn-modal-close {
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
}

.btn-modal-close:hover {
  color: var(--text-main);
  border-color: #ef4444;
}

/* Tabs Header */
.modal-tabs-header {
  display: flex;
  background: var(--bg-main);
  border-bottom: 1px solid var(--border-color);
}

.tab-btn {
  flex: 1;
  padding: 0.8rem 0.5rem;
  background: none;
  border: none;
  border-bottom: 2.5px solid transparent;
  color: var(--text-muted);
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn.active {
  color: #4f008c;
  border-bottom-color: #4f008c;
  background: var(--bg-card);
}

.dark .tab-btn.active {
  color: #ffc700;
  border-bottom-color: #ffc700;
}

/* Form Body */
.modal-form-content {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;
}

.modal-scroll-body {
  padding: 1.5rem;
  overflow-y: auto;
  max-height: 55vh;
}

.tab-pane {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.form-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 640px) {
  .form-grid-2 {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-main);
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.platform-indicator {
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}

.platform-indicator.gplay {
  background: rgba(66, 133, 244, 0.12);
  color: #4285f4;
}

.platform-indicator.apple {
  background: rgba(82, 82, 91, 0.12);
  color: var(--text-main);
}

.platform-indicator.web {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
}

.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 0.65rem 0.85rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-main);
  color: var(--text-main);
  font-size: 0.84rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s ease;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: #4f008c;
}

.dark .form-input:focus, .dark .form-select:focus, .dark .form-textarea:focus {
  border-color: #ffc700;
}

.ltr-text {
  direction: ltr;
  text-align: left;
}

.mt-1 {
  margin-top: 0.4rem;
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
  background: none;
  cursor: pointer;
  padding: 0;
}

/* Logo selection */
.logo-selection-box {
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.1rem;
}

.presets-label {
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--text-muted);
  display: block;
  margin-bottom: 0.6rem;
}

.logo-presets-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .logo-presets-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.preset-logo-btn {
  background: var(--bg-card);
  border: 1.5px solid var(--border-color);
  border-radius: 10px;
  padding: 0.6rem 0.4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.preset-logo-btn:hover {
  border-color: #4f008c;
  transform: translateY(-2px);
}

.preset-logo-btn.active {
  border-color: #4f008c;
  background: rgba(79, 0, 140, 0.08);
  box-shadow: 0 0 0 2px rgba(79, 0, 140, 0.2);
}

.dark .preset-logo-btn.active {
  border-color: #ffc700;
  background: rgba(255, 199, 0, 0.12);
}

.preset-name {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-main);
}

.logo-divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1rem 0;
  color: var(--text-muted);
  font-size: 0.72rem;
  font-weight: 700;
}

.logo-divider::before, .logo-divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px dashed var(--border-color);
}

.logo-divider span {
  padding: 0 0.8rem;
}

.custom-logo-uploader {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.custom-logo-preview {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.preview-thumb {
  max-width: 50px;
  max-height: 50px;
  object-fit: contain;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.62rem;
  color: var(--text-muted);
}

.custom-logo-inputs {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.btn-file-upload {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 1rem;
  border-radius: 8px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  width: fit-content;
  transition: all 0.2s ease;
}

.btn-file-upload:hover {
  border-color: #4f008c;
}

/* Tags Adder */
.tag-input-wrapper {
  display: flex;
  gap: 0.5rem;
}

.btn-add-tag {
  background: #4f008c;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 0 1rem;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.dark .btn-add-tag {
  background: #ffc700;
  color: #150522;
}

.tags-chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.4rem;
}

.feature-tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  background: rgba(79, 0, 140, 0.08);
  color: #4f008c;
  border: 1px solid rgba(79, 0, 140, 0.2);
  font-size: 0.75rem;
  font-weight: 700;
}

.dark .feature-tag-chip {
  background: rgba(255, 199, 0, 0.12);
  color: #ffc700;
  border-color: rgba(255, 199, 0, 0.25);
}

.remove-tag-btn {
  background: none;
  border: none;
  color: currentColor;
  cursor: pointer;
  font-size: 0.7rem;
  padding: 0;
}

/* Hint & Toggle */
.section-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1rem;
  border-radius: 10px;
  background: rgba(37, 99, 235, 0.08);
  color: #2563eb;
  border: 1px solid rgba(37, 99, 235, 0.2);
  font-size: 0.78rem;
  font-weight: 600;
}

.status-toggle-box {
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 0.9rem 1.1rem;
}

.toggle-checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.84rem;
  font-weight: 700;
  color: var(--text-main);
  cursor: pointer;
}

/* Modal Footer */
.modal-footer {
  padding: 1.1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background: var(--bg-card);
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 18px;
}

.modal-footer-nav {
  display: flex;
  gap: 0.5rem;
}

.btn-step-nav {
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 0.55rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}

.modal-footer-actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.btn-cancel {
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  padding: 0.65rem 1.25rem;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
}

.btn-save {
  background: linear-gradient(135deg, #4f008c 0%, #7c3aed 100%);
  color: #ffffff;
  border: none;
  padding: 0.65rem 1.5rem;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(79, 0, 140, 0.25);
  transition: all 0.2s ease;
}

.btn-save:hover {
  transform: translateY(-1px);
}

.dark .btn-save {
  background: linear-gradient(135deg, #ffc700 0%, #e6b400 100%);
  color: #150522;
}

/* ================= LIVE PREVIEW MODAL ================= */
.preview-modal-box {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 18px;
  width: 100%;
  max-width: 580px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  overflow: hidden;
  animation: modalIn 0.25s ease-out;
}

.preview-modal-head {
  padding: 1.1rem 1.3rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.preview-partner-card {
  display: flex;
  flex-direction: column;
}

.preview-stripe {
  height: 6px;
  width: 100%;
}

.preview-body {
  padding: 1.5rem;
}

.preview-top-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.preview-logo-circle {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  background: var(--bg-main);
  border: 2px solid;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-badge-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.35rem;
}

.verified-pill {
  font-size: 0.7rem;
  font-weight: 700;
  color: #10b981;
}

.preview-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-main);
  margin: 0;
}

.preview-tier {
  display: block;
  font-size: 0.8rem;
  font-weight: 700;
  margin-top: 0.2rem;
}

.preview-subtitle {
  font-size: 0.84rem;
  color: var(--text-muted);
  margin: 0.3rem 0 0.8rem;
}

.preview-desc {
  font-size: 0.84rem;
  color: var(--text-muted);
  line-height: 1.65;
  margin-bottom: 1rem;
}

.preview-features-box {
  background: var(--bg-main);
  border-radius: 10px;
  padding: 0.8rem;
  margin-bottom: 1.1rem;
}

.preview-store-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.store-btn {
  flex: 1;
  min-width: 140px;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
  transition: all 0.2s ease;
}

.store-btn.gplay {
  background: #4285f4;
  color: #ffffff;
}

.store-btn.apple {
  background: #18181b;
  color: #ffffff;
}

.store-btn.web {
  background: #10b981;
  color: #ffffff;
}

/* ================= CONFIRM MODAL ================= */
.confirm-modal-box {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  width: 100%;
  max-width: 440px;
  padding: 1.75rem;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
}

.confirm-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.confirm-icon.danger {
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
}

.confirm-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-main);
  margin: 0 0 0.5rem;
}

.confirm-msg {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0 0 1.5rem;
}

.confirm-actions {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

.btn-delete-confirm {
  background: #ef4444;
  color: #ffffff;
  border: none;
  padding: 0.65rem 1.4rem;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-delete-confirm:hover {
  background: #dc2626;
}
</style>
