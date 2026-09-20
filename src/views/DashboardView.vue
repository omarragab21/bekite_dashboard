<template>
  <div class="dashboard" dir="rtl">

    <!-- ===== PAGE HEADER ===== -->
    <div class="dash-header">
      <div>
        <h1 class="dash-title">الصفحة الرئيسية</h1>
        <p class="dash-subtitle">نظرة عامة لحظية على منظومة بي كايت والأنظمة الرقمية — {{ formattedDate }}</p>
      </div>
      <button class="refresh-btn" @click="fetchAll" :disabled="loading" title="تحديث البيانات">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="{ 'spin-icon': loading }">
          <polyline points="23 4 23 10 17 10"/>
          <polyline points="1 20 1 14 7 14"/>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
        </svg>
        تحديث لحظي
      </button>
    </div>

    <!-- ===== LOADING STATE ===== -->
    <div v-if="loading" class="dashboard-loading">
      <div class="spinner"></div>
      <p>جاري تحميل البيانات الحية...</p>
    </div>

    <!-- ===== ERROR STATE ===== -->
    <div v-else-if="error" class="error-alert">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <p>{{ error }}</p>
      <button @click="fetchAll" class="retry-btn">إعادة المحاولة</button>
    </div>

    <!-- ===== MAIN CONTENT ===== -->
    <template v-else>

      <!-- ===== ROW 1: STAT CARDS (6 Active Sections) ===== -->
      <div class="stats-grid">
        <router-link
          v-for="card in statCards"
          :key="card.key"
          :to="card.link"
          class="stat-card"
        >
          <div class="stat-top">
            <div class="stat-icon" :style="{ background: card.iconBg }">
              <span v-html="card.icon"></span>
            </div>
            <span v-if="card.pill" class="stat-pill" :class="card.pillClass">
              {{ card.pill }}
            </span>
          </div>
          <div class="stat-bottom">
            <div class="stat-value">{{ card.value }}</div>
            <div class="stat-label">{{ card.label }}</div>
          </div>
        </router-link>
      </div>

      <!-- ===== ROW 2: CHARTS ===== -->
      <div class="charts-row">

        <!-- Donut: System Distribution -->
        <div class="chart-card donut-card">
          <div class="chart-header">
            <h3 class="chart-title">توزيع العناصر في المنظومة</h3>
            <span class="chart-sub-tag">إجمالي: {{ totalSystemItems }} عنصر</span>
          </div>
          <div class="donut-body">
            <div class="donut-canvas-wrap">
              <canvas ref="donutCanvas" width="160" height="160"></canvas>
              <div class="donut-center-text">
                <span class="donut-total-num">{{ totalSystemItems }}</span>
                <span class="donut-total-lbl">إجمالي</span>
              </div>
            </div>
            <div class="donut-legend-grid">
              <div v-for="item in dynamicDistribution" :key="item.label" class="legend-row">
                <div class="legend-left-part">
                  <span class="legend-dot" :style="{ background: item.color }"></span>
                  <span class="legend-lbl">{{ item.label }}</span>
                </div>
                <span class="legend-count">{{ item.count }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Line: Activity Overview -->
        <div class="chart-card line-card">
          <div class="chart-header">
            <h3 class="chart-title">حالة التفاعل والطلبات والرسائل</h3>
            <div class="period-toggle">
              <span class="live-indicator">
                <span class="live-dot"></span>
                بيانات حية
              </span>
            </div>
          </div>
          <div class="activity-summary-grid">
            <div class="act-item">
              <span class="act-num text-purple">{{ newInquiriesCount }}</span>
              <span class="act-label">طلبات جديدة</span>
            </div>
            <div class="act-item">
              <span class="act-num text-amber">{{ inProgressInquiriesCount }}</span>
              <span class="act-label">طلبات قيد المتابعة</span>
            </div>
            <div class="act-item">
              <span class="act-num text-emerald">{{ convertedInquiriesCount }}</span>
              <span class="act-label">عقود منجزة</span>
            </div>
            <div class="act-item">
              <span class="act-num text-rose">{{ unreadMessagesCount }}</span>
              <span class="act-label">رسائل غير مقروءة</span>
            </div>
            <div class="act-item">
              <span class="act-num text-sky">{{ activeCareersCount }}</span>
              <span class="act-label">شواغر متاحة</span>
            </div>
          </div>
          <div class="line-wrapper">
            <canvas ref="lineCanvas"></canvas>
          </div>
        </div>
      </div>

      <!-- ===== ROW 3: RECENT INQUIRIES + MESSAGES ===== -->
      <div class="tables-row">

        <!-- Recent Inquiries -->
        <div class="section-card">
          <div class="section-header">
            <div class="section-title-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4f008c" stroke-width="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
              <span class="section-title">أحدث طلبات واستفسارات الخدمات</span>
            </div>
            <router-link to="/admin/service-requests" class="view-all-link">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
              عرض الكل
            </router-link>
          </div>
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>العميل / الجهة</th>
                  <th>الخدمة المطلوبة</th>
                  <th>الميزانية</th>
                  <th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="lead in recentInquiries" :key="lead.id">
                  <td>
                    <div class="client-info">
                      <span class="client-name">{{ lead.full_name }}</span>
                      <small v-if="lead.company" class="text-muted">{{ lead.company }}</small>
                    </div>
                  </td>
                  <td class="td-order-id">{{ lead.service_name || lead.service_type }}</td>
                  <td class="td-amount">{{ lead.budget_range || 'غير محدد' }}</td>
                  <td>
                    <span class="status-badge" :class="'status-' + lead.status">
                      {{ statusLabel(lead.status) }}
                    </span>
                  </td>
                </tr>
                <tr v-if="!recentInquiries.length">
                  <td colspan="4" class="td-empty">لا توجد طلبات جديدة حالياً</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Recent Contact Messages -->
        <div class="section-card">
          <div class="section-header">
            <div class="section-title-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffc700" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span class="section-title">أحدث رسائل التواصل الواردة</span>
            </div>
            <router-link to="/admin/messages" class="view-all-link">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
              عرض الكل
            </router-link>
          </div>
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>المرسل</th>
                  <th>الموضوع</th>
                  <th>التاريخ</th>
                  <th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="msg in recentMessages" :key="msg.id">
                  <td>
                    <div class="client-info">
                      <span class="client-name">{{ msg.name || msg.sender_name }}</span>
                      <small class="text-muted ltr-text">{{ msg.email }}</small>
                    </div>
                  </td>
                  <td class="td-subject">{{ msg.subject || '-' }}</td>
                  <td class="td-date">{{ formatShortDate(msg.created_at) }}</td>
                  <td>
                    <span class="status-badge" :class="msg.status === 'read' || msg.is_read ? 'status-converted' : 'status-new'">
                      {{ (msg.status === 'read' || msg.is_read) ? 'مقروءة' : 'غير مقروءة' }}
                    </span>
                  </td>
                </tr>
                <tr v-if="!recentMessages.length">
                  <td colspan="4" class="td-empty">لا توجد رسائل واردة حالياً</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <!-- ===== ROW 4: STRATEGIC TECHNOLOGY PARTNERS ===== -->
      <div id="partners-section" class="dash-partners-section section-card">
        <div class="section-header">
          <div class="section-title-wrap">
            <div class="partner-header-icon-box">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
            </div>
            <div>
              <div class="dash-partners-title-row">
                <span class="section-title">شركاء التكنولوجيا والاعتماد الدولي (Technology Partners)</span>
                <span class="dash-partner-count-pill">{{ strategicPartners.length }} شركاء معتمدين</span>
              </div>
              <p class="dash-section-desc">تحالفات Be Kite التقنية المعتمدة دولياً مع كبرى شركات التكنولوجيا السحابية والمنصات (Google, Apple, Microsoft, AWS, Oracle, Stripe)</p>
            </div>
          </div>
          <router-link to="/admin/partners" class="view-all-link">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            صفحة الشركاء المعتمدين ({{ strategicPartners.length }})
          </router-link>
        </div>

        <!-- Tech Partners Grid -->
        <div v-if="strategicPartners.length" class="dash-tech-partners-grid">
          <div
            v-for="partner in strategicPartners"
            :key="partner.id"
            class="dash-tech-card"
          >
            <div class="dash-tech-top-stripe" :style="{ background: partner.brand_color }"></div>
            <div class="dash-tech-body">
              <!-- Header: Logo, Status, Tier -->
              <div class="dash-tech-head">
                <div class="dash-tech-logo-wrap">
                  <!-- Google Logo -->
                  <svg v-if="partner.logoType === 'google'" width="26" height="26" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <!-- Apple Logo -->
                  <svg v-else-if="partner.logoType === 'apple'" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 0.6-2.65 1.35-.58.66-1.08 1.73-0.95 2.76 1.01.08 2.05-.51 2.68-1.26z"/>
                  </svg>
                  <!-- Microsoft Logo -->
                  <svg v-else-if="partner.logoType === 'microsoft'" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="#F25022" d="M1 1h10v10H1z"/>
                    <path fill="#00A4EF" d="M1 13h10v10H1z"/>
                    <path fill="#7FBA00" d="M13 1h10v10H13z"/>
                    <path fill="#FFB900" d="M13 13h10v10H13z"/>
                  </svg>
                  <!-- AWS Logo -->
                  <svg v-else-if="partner.logoType === 'aws'" width="26" height="26" viewBox="0 0 24 24" fill="#FF9900">
                    <path d="M19.467 14.545c-2.427 1.787-5.97 2.733-8.99 2.733-4.246 0-8.067-1.545-10.95-4.122-.227-.202-.047-.48.22-.325 3.12 1.796 6.88 2.88 10.73 2.88 2.68 0 5.617-.604 8.273-1.854.407-.193.747.275.717.688zm.97-1.127c-.31-.397-2.02-.187-2.793-.095-.236.028-.27-.16-.06-.307 1.393-.974 3.666-.694 4.02-.258.354.436-.09 2.713-1.397 3.8-.198.165-.386.077-.298-.14.286-.714.838-2.603.528-3zm-9.84-2.868c-.615-.494-1.258-.93-1.258-1.868 0-1.18 1.01-1.996 2.37-1.996 1.48 0 2.39.815 2.45 2.115l.006.18h2.09c-.066-2.186-1.748-3.79-4.546-3.79-2.584 0-4.484 1.544-4.484 3.705 0 1.942 1.344 2.86 2.617 3.738 1.096.758 1.48 1.155 1.48 2.054 0 1.25-1.15 2.14-2.71 2.14-1.782 0-2.83-.984-2.92-2.37l-.008-.184h-2.15c.1 2.42 1.97 4.05 5.078 4.05 2.796 0 4.832-1.636 4.832-3.96 0-2.15-1.464-3.136-2.847-4.074z"/>
                  </svg>
                  <!-- Oracle Logo -->
                  <svg v-else-if="partner.logoType === 'oracle'" width="26" height="26" viewBox="0 0 24 24" fill="#C74634">
                    <path d="M16.42 4H7.58C3.39 4 0 7.42 0 11.66s3.39 7.66 7.58 7.66h8.84c4.19 0 7.58-3.42 7.58-7.66S20.61 4 16.42 4zm-.24 11.75H7.82c-2.31 0-4.18-1.88-4.18-4.19 0-2.3 1.87-4.18 4.18-4.18h8.36c2.31 0 4.18 1.88 4.18 4.18 0 2.31-1.87 4.19-4.18 4.19z"/>
                  </svg>
                  <!-- Stripe Logo -->
                  <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="#635BFF">
                    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C17.652.822 15.112.25 12.353.25 6.44.25 2.38 3.39 2.38 8.163c0 6.16 6.05 6.77 8.188 7.545 2.457.893 3.3 1.657 3.3 2.754 0 1.082-.962 1.706-2.502 1.706-2.42 0-5.32-.994-7.398-2.227l-.934 5.688c2.254 1.157 5.258 1.621 8.082 1.621 6.304 0 10.648-2.923 10.648-8.158 0-6.177-5.918-6.994-7.788-7.942z"/>
                  </svg>
                </div>

                <div class="dash-tech-meta">
                  <span class="dash-tech-badge" :style="{ borderColor: partner.brand_color, color: partner.brand_color }">
                    {{ partner.badge }}
                  </span>
                  <div class="dash-partner-verified">
                    <span class="status-dot"></span>
                    <span>شريك معتمد</span>
                  </div>
                </div>
              </div>

              <!-- Titles -->
              <div class="dash-tech-titles">
                <h4 class="dash-tech-name">{{ partner.name }}</h4>
                <span class="dash-tech-tier">{{ partner.tier }}</span>
                <p class="dash-tech-sub">{{ partner.subtitle }}</p>
              </div>

              <!-- Description -->
              <p class="dash-tech-desc">{{ partner.description }}</p>

              <!-- Features / Integrations -->
              <div class="dash-tech-features-wrap">
                <span v-for="feat in partner.features" :key="feat" class="dash-tech-feat-pill">
                  ✓ {{ feat }}
                </span>
              </div>

              <!-- Links -->
              <div class="dash-tech-links-row">
                <a
                  v-for="link in partner.links"
                  :key="link.label"
                  :href="link.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="dash-tech-link-btn"
                  :class="link.type === 'primary' ? 'primary-link' : 'secondary-link'"
                >
                  <span>{{ link.label }}</span>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty-dash-brands">
          <p>لا يوجد شركاء مسجلون حالياً في المنظومة</p>
        </div>
      </div>

      <!-- ===== ROW 5: VENTURE BRANDS & CONSUMER APPS ===== -->
      <div id="brands-section" class="dash-brands-section section-card">
        <div class="section-header">
          <div class="section-title-wrap">
            <div class="brand-header-icon-box">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                <polyline points="2 17 12 22 22 17"/>
                <polyline points="2 12 12 17 22 12"/>
              </svg>
            </div>
            <div>
              <div class="dash-brands-title-row">
                <span class="section-title">العلامات التجارية والشركات التابعة (Venture Brands & Showcases)</span>
                <span class="dash-brand-count-pill">{{ brands.length }} علامة واستثمار</span>
              </div>
              <p class="dash-section-desc">العلامات الاستهلاكية وتطبيقات المتاجر الإلكترونية الرسمية (Google Play & App Store) التابعة لمنظومة Be Kite</p>
            </div>
          </div>
          <router-link to="/admin/brands" class="view-all-link">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            إدارة كافة العلامات التجارية ({{ brands.length }})
          </router-link>
        </div>

        <div v-if="!brands.length" class="empty-dash-brands">
          <p>لا توجد علامات تجارية مسجلة حالياً</p>
        </div>

        <div v-else class="dash-brands-grid">
          <div
            v-for="brand in brands"
            :key="brand.id"
            class="dash-brand-card"
          >
            <!-- Top color accent stripe -->
            <div class="dash-brand-stripe" :style="{ background: brand.brand_color || '#ea580c' }"></div>

            <div class="dash-brand-body">
              <!-- Header Meta: Badge & Status -->
              <div class="dash-brand-meta">
                <span
                  class="dash-brand-badge"
                  :style="{
                    color: brand.brand_color || '#ea580c',
                    backgroundColor: getAlphaColor(brand.brand_color, '15'),
                    borderColor: getAlphaColor(brand.brand_color, '35')
                  }"
                >
                  {{ brand.badge || (brand.is_coming_soon ? 'قيد التطوير' : 'VENTURE') }}
                </span>
                <span class="dash-brand-status" :class="brand.is_active ? 'status-active' : 'status-inactive'">
                  <span class="status-dot"></span>
                  {{ brand.is_active ? 'نشط بالسوق' : 'معطل' }}
                </span>
              </div>

              <!-- Mockup Image Preview -->
              <div class="dash-brand-mockup-box">
                <img
                  v-if="brand.image"
                  :src="brand.image"
                  :alt="brand.name"
                  class="dash-brand-mockup-img"
                  @error="onImgError"
                />
                <div v-else class="dash-brand-mockup-placeholder">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                    <polyline points="2 17 12 22 22 17"/>
                    <polyline points="2 12 12 17 22 12"/>
                  </svg>
                </div>
                <div v-if="brand.is_coming_soon" class="dash-brand-pipeline-pill">
                  {{ brand.pipeline_status || 'قيد التطوير والإعداد' }}
                </div>
              </div>

              <!-- Title & Tagline -->
              <div class="dash-brand-header-text">
                <h4 class="dash-brand-title">{{ brand.name }}</h4>
                <div
                  v-if="brand.subtitle"
                  class="dash-brand-sub"
                  :style="{ color: brand.brand_color || '#ea580c' }"
                >
                  {{ brand.subtitle }}
                </div>
              </div>

              <!-- Description -->
              <p class="dash-brand-desc">{{ brand.description }}</p>

              <!-- Tags -->
              <div v-if="brand.tags && brand.tags.length" class="dash-brand-tags-row">
                <span v-for="tag in brand.tags" :key="tag" class="dash-brand-tag-chip">
                  #{{ tag }}
                </span>
              </div>

              <!-- Store & Platform Links Section -->
              <div class="dash-brand-links-box">
                <div class="dash-links-head">
                  <span>منصات ومتاجر التحميل:</span>
                </div>
                <div class="dash-stores-row">
                  <!-- Google Play Button -->
                  <a
                    v-if="getGooglePlayLink(brand)"
                    :href="getGooglePlayLink(brand)"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="store-badge-btn google-play-btn"
                    title="تنزيل من متجر Google Play"
                  >
                    <svg class="store-icon" viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
                      <path d="M3.609 1.814L13.793 12 3.61 22.186a2.38 2.38 0 0 1-.61-1.636V3.45c0-.626.223-1.206.61-1.636zM15.207 13.414l2.774 2.774-12.87 7.373 10.096-10.147zm0-2.828L5.111.44l12.87 7.373-2.774 2.773zm1.414 1.414l3.87 2.217c.945.541.945 1.425 0 1.966l-3.87 2.217-2.434-2.434 2.434-2.434z"/>
                    </svg>
                    <div class="store-labels">
                      <span class="store-action">متوفر على</span>
                      <span class="store-name">Google Play</span>
                    </div>
                  </a>

                  <!-- Apple App Store Button -->
                  <a
                    v-if="getAppleStoreLink(brand)"
                    :href="getAppleStoreLink(brand)"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="store-badge-btn apple-store-btn"
                    title="تنزيل من متجر App Store"
                  >
                    <svg class="store-icon" viewBox="0 0 24 24" width="17" height="17" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 0.6-2.65 1.35-.58.66-1.08 1.73-0.95 2.76 1.01.08 2.05-.51 2.68-1.26z"/>
                    </svg>
                    <div class="store-labels">
                      <span class="store-action">تنزيل من</span>
                      <span class="store-name">App Store</span>
                    </div>
                  </a>

                  <!-- Website Button -->
                  <a
                    v-if="getWebsiteLink(brand)"
                    :href="getWebsiteLink(brand)"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="store-badge-btn web-store-btn"
                    title="زيارة الموقع الإلكتروني الرسمي"
                  >
                    <svg class="store-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                    <div class="store-labels">
                      <span class="store-action">زيارة</span>
                      <span class="store-name">الموقع الرسمي</span>
                    </div>
                  </a>

                  <!-- Additional Custom Links -->
                  <template v-for="lnk in getOtherLinks(brand)" :key="lnk.label">
                    <a
                      :href="lnk.href"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="store-badge-btn custom-store-btn"
                    >
                      <svg class="store-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                      <div class="store-labels">
                        <span class="store-name">{{ lnk.label }}</span>
                      </div>
                    </a>
                  </template>

                  <!-- Empty state for pipeline brands with no links yet -->
                  <div v-if="!getGooglePlayLink(brand) && !getAppleStoreLink(brand) && !getWebsiteLink(brand)" class="no-links-note">
                    <span>قيد الإعداد للإطلاق والتوزيع على المتاجر الرقمية</span>
                  </div>
                </div>

                <!-- Card Bottom Manage Action -->
                <div class="dash-brand-actions-bar">
                  <router-link to="/admin/brands" class="manage-brand-link">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    <span>تعديل وإدارة تفاصيل العلامة</span>
                  </router-link>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import { ProjectService, ProductService, SolutionService, BrandService, InquiryService, ContentService, MessageService, PartnerService } from '../services';
import api from '../config/axios';
import { useTheme } from '../composables/useTheme';

Chart.register(...registerables);

const { isDark } = useTheme();

// ─── Canvas refs ───────────────────────────────────────────────────────────────
const donutCanvas = ref(null);
const lineCanvas  = ref(null);
let donutChartInstance = null;
let lineChartInstance  = null;

// ─── State ────────────────────────────────────────────────────────────────     
const loading   = ref(true);
const error     = ref(null);
const solutions = ref([]);
const projects  = ref([]);
const inquiries = ref([]);
const products  = ref([]);
const careers   = ref([]);
const messages  = ref([]);
const brands    = ref([]);

// Filter tab for partners section: 'all' | 'tech' | 'ventures'
const partnerTab = ref('all');

// Global Strategic Technology & Cloud Partners (Dynamic from API)
const strategicPartners = ref([]);

const formattedDate = computed(() => {
  return new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
});

// Dynamic Counts
const newInquiriesCount = computed(() => inquiries.value.filter(i => i.status === 'new').length);
const inProgressInquiriesCount = computed(() => inquiries.value.filter(i => i.status === 'in_progress' || i.status === 'contacted').length);
const convertedInquiriesCount = computed(() => inquiries.value.filter(i => i.status === 'converted').length);
const unreadMessagesCount = computed(() => messages.value.filter(m => m.status === 'unread' || m.is_read === 0).length);
const activeCareersCount = computed(() => careers.value.filter(c => c.is_active === 1 || c.is_active === true).length);

const totalSystemItems = computed(() => {
  return (
    solutions.value.length +
    projects.value.length +
    inquiries.value.length +
    products.value.length +
    brands.value.length +
    strategicPartners.value.length +
    careers.value.length +
    messages.value.length
  );
});

// 7 Core Stat Cards directly linked to live database counts
const statCards = computed(() => [
  {
    key: 'solutions',
    label: 'حلول',
    value: String(solutions.value.length),
    pill: 'دليل الحلول',
    pillClass: 'pill-neutral',
    link: '/admin/solutions',
    iconBg: 'rgba(79, 0, 140, 0.1)',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4f008c" stroke-width="1.8"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>`,
  },
  {
    key: 'projects',
    label: 'مشاريع',
    value: String(projects.value.length),
    pill: 'البورتفوليو',
    pillClass: 'pill-neutral',
    link: '/admin/projects',
    iconBg: 'rgba(8, 145, 178, 0.1)',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0891b2" stroke-width="1.8"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  },
  {
    key: 'services',
    label: 'الطلبات والخدمات',
    value: String(inquiries.value.length),
    pill: `${newInquiriesCount.value} طلب جديد`,
    pillClass: newInquiriesCount.value > 0 ? 'pill-danger' : 'pill-neutral',
    link: '/admin/service-requests',
    iconBg: 'rgba(16, 185, 129, 0.1)',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="1.8"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  },
  {
    key: 'products',
    label: 'المنتجات',
    value: String(products.value.length),
    pill: 'كتالوج المنتجات',
    pillClass: 'pill-neutral',
    link: '/admin/products',
    iconBg: 'rgba(255, 199, 0, 0.15)',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e6b400" stroke-width="1.8"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  },
  {
    key: 'partners',
    label: 'الشركاء',
    value: String(strategicPartners.value.length),
    pill: 'تحالفات معتمدة',
    pillClass: 'pill-info',
    link: '/admin/partners',
    iconBg: 'rgba(37, 99, 235, 0.1)',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>`,
  },
  {
    key: 'brands',
    label: 'العلامات التجارية',
    value: String(brands.value.length),
    pill: 'استثمارات Be Kite',
    pillClass: 'pill-neutral',
    link: '/admin/brands',
    iconBg: 'rgba(234, 88, 12, 0.1)',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ea580c" stroke-width="1.8"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  },
  {
    key: 'careers',
    label: 'الوظائف',
    value: String(careers.value.length),
    pill: `${activeCareersCount.value} شاغر متاح`,
    pillClass: 'pill-info',
    link: '/admin/careers',
    iconBg: 'rgba(124, 58, 237, 0.1)',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="1.8"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><circle cx="12" cy="12" r="1"/></svg>`,
  },
  {
    key: 'messages',
    label: 'الرسائل',
    value: String(messages.value.length),
    pill: unreadMessagesCount.value > 0 ? `${unreadMessagesCount.value} غير مقروء` : 'الكل مقروء',
    pillClass: unreadMessagesCount.value > 0 ? 'pill-danger' : 'pill-success',
    link: '/admin/messages',
    iconBg: 'rgba(244, 63, 94, 0.1)',
    icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  },
]);

// Dynamic distribution for donut chart
const dynamicDistribution = computed(() => [
  { label: 'حلول', count: solutions.value.length, color: '#4f008c' },
  { label: 'مشاريع', count: projects.value.length, color: '#0891b2' },
  { label: 'خدمات', count: inquiries.value.length, color: '#10b981' },
  { label: 'منتجات', count: products.value.length, color: '#ffc700' },
  { label: 'الشركاء', count: strategicPartners.value.length, color: '#2563eb' },
  { label: 'العلامات التجارية', count: brands.value.length, color: '#ea580c' },
  { label: 'الوظائف', count: careers.value.length, color: '#7c3aed' },
  { label: 'الرسائل', count: messages.value.length, color: '#f43f5e' },
]);

const recentInquiries = computed(() => inquiries.value.slice(0, 5));
const recentMessages = computed(() => messages.value.slice(0, 5));

const statusLabel = (status) => {
  const map = {
    new: 'جديد',
    contacted: 'تم التواصل',
    in_progress: 'قيد التنفيذ',
    converted: 'تم التحويل',
    archived: 'مؤرشف',
  };
  return map[status] || status;
};

const formatShortDate = (dateString) => {
  if (!dateString) return '-';
  const d = new Date(dateString);
  return d.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' });
};

// Brand helpers for styling & store links
const getAlphaColor = (colorHex, alphaHex = '15') => {
  if (!colorHex || typeof colorHex !== 'string' || !colorHex.startsWith('#')) {
    return 'rgba(234, 88, 12, 0.1)';
  }
  if (colorHex.length === 7) {
    return `${colorHex}${alphaHex}`;
  }
  return colorHex;
};

const getGooglePlayLink = (brand) => {
  if (brand.google_play_url && brand.google_play_url !== '#') return brand.google_play_url;
  const link = (brand.links || []).find(l => {
    const lbl = (l.label || '').toLowerCase();
    const lblEn = (l.label_en || '').toLowerCase();
    const href = (l.href || '').toLowerCase();
    return lbl.includes('android') || lbl.includes('google') || lbl.includes('أندرويد') || lbl.includes('جوجل') || lblEn.includes('android') || href.includes('play.google');
  });
  return link && link.href !== '#' ? link.href : null;
};

const getAppleStoreLink = (brand) => {
  if (brand.apple_store_url && brand.apple_store_url !== '#') return brand.apple_store_url;
  const link = (brand.links || []).find(l => {
    const lbl = (l.label || '').toLowerCase();
    const lblEn = (l.label_en || '').toLowerCase();
    const href = (l.href || '').toLowerCase();
    return lbl.includes('ios') || lbl.includes('apple') || lbl.includes('آبل') || lblEn.includes('ios') || href.includes('apps.apple');
  });
  return link && link.href !== '#' ? link.href : null;
};

const getWebsiteLink = (brand) => {
  if (brand.website_url && brand.website_url !== '#') return brand.website_url;
  const link = (brand.links || []).find(l => {
    const lbl = (l.label || '').toLowerCase();
    const lblEn = (l.label_en || '').toLowerCase();
    return lbl.includes('موقع') || lblEn.includes('web') || l.type === 'primary';
  });
  return link && link.href !== '#' ? link.href : null;
};

const getOtherLinks = (brand) => {
  const gPlay = getGooglePlayLink(brand);
  const apple = getAppleStoreLink(brand);
  const web = getWebsiteLink(brand);

  return (brand.links || []).filter(l => {
    if (!l.href || l.href === '#') return false;
    if (gPlay && l.href === gPlay) return false;
    if (apple && l.href === apple) return false;
    if (web && l.href === web) return false;
    return true;
  });
};

const onImgError = (e) => {
  e.target.style.display = 'none';
};

const fetchAll = async () => {
  loading.value = true;
  error.value = null;
  try {
    const [solData, projData, inqData, prodData, carData, msgRes, brandData, partnerData] = await Promise.all([
      SolutionService.getAll().catch(() => []),
      ProjectService.getAll().catch(() => []),
      InquiryService.getAll().catch(() => []),
      ProductService.getAll().catch(() => []),
      ContentService.getCareers().catch(() => []),
      MessageService.getAll().catch(() => []),
      BrandService.getAll().catch(() => []),
      PartnerService.getAll().catch(() => []),
    ]);

    solutions.value = solData || [];
    projects.value  = projData || [];
    inquiries.value = inqData || [];
    products.value  = prodData || [];
    careers.value   = carData || [];
    messages.value  = msgRes || [];
    brands.value    = brandData || [];
    strategicPartners.value = Array.isArray(partnerData) ? partnerData : [];

    await nextTick();
    renderDonutChart();
    renderBarChart();
  } catch (err) {
    console.error('Dashboard live data fetch error', err);
    error.value = 'تعذر تحميل بيانات لوحة القيادة';
  } finally {
    loading.value = false;
  }
};

const renderDonutChart = () => {
  if (!donutCanvas.value) return;
  if (donutChartInstance) donutChartInstance.destroy();

  const ctx = donutCanvas.value.getContext('2d');
  donutChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: dynamicDistribution.value.map(s => s.label),
      datasets: [
        {
          data: dynamicDistribution.value.map(s => s.count),
          backgroundColor: dynamicDistribution.value.map(s => s.color),
          borderWidth: 0,
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: { display: false },
        tooltip: {
          rtl: true,
          callbacks: {
            label: (c) => ` ${c.label}: ${c.raw} عنصر`,
          },
        },
      },
    },
  });
};

const renderBarChart = () => {
  if (!lineCanvas.value) return;
  if (lineChartInstance) lineChartInstance.destroy();

  const ctx = lineCanvas.value.getContext('2d');
  const labels = ['حلول', 'مشاريع', 'خدمات', 'منتجات', 'الشركاء', 'علامات', 'الوظائف', 'الرسائل'];
  const counts = [
    solutions.value.length,
    projects.value.length,
    inquiries.value.length,
    products.value.length,
    strategicPartners.value.length,
    brands.value.length,
    careers.value.length,
    messages.value.length,
  ];

  lineChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'إجمالي العناصر المسجلة',
          data: counts,
          backgroundColor: ['#4f008c', '#0891b2', '#10b981', '#ffc700', '#2563eb', '#ea580c', '#7c3aed', '#f43f5e'],
          borderRadius: 8,
          barThickness: 28,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { rtl: true },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Cairo', size: 12 } },
        },
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(150, 150, 150, 0.08)' },
          ticks: { precision: 0, font: { family: 'Cairo', size: 11 } },
        },
      },
    },
  });
};

watch(isDark, () => {
  nextTick(() => {
    renderDonutChart();
    renderBarChart();
  });
});

onMounted(fetchAll);
</script>

<style scoped>
.dashboard {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Page Header */
.dash-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dash-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 0.2rem;
}
.dash-subtitle {
  font-size: 0.82rem;
  color: var(--text-muted);
}
.refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.9rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-main);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.refresh-btn:hover:not(:disabled) {
  background: rgba(79, 0, 140, 0.05);
  border-color: #4f008c;
  color: #4f008c;
}
.spin-icon {
  animation: spin 1s linear infinite;
}

/* Loading & Error */
.dashboard-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  gap: 0.75rem;
  color: var(--text-muted);
}
.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(79, 0, 140, 0.15);
  border-top-color: #4f008c;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.error-alert {
  background: #fef2f2;
  border: 1px solid #fee2e2;
  color: #dc2626;
  border-radius: 10px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}
.retry-btn {
  margin-inline-start: auto;
  background: #dc2626;
  color: #fff;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
}

/* Row 1: Stat Cards (7 Columns / Responsive Grid) */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1rem;
}
@media (max-width: 1400px) {
  .stats-grid { grid-template-columns: repeat(4, 1fr); }
}
@media (max-width: 992px) {
  .stats-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 640px) {
  .stats-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 400px) {
  .stats-grid { grid-template-columns: 1fr; }
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-decoration: none;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  transition: all 0.2s ease;
}
.stat-card:hover {
  transform: translateY(-2px);
  border-color: #4f008c44;
  box-shadow: 0 6px 16px rgba(0,0,0,0.04);
}
.stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.stat-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.stat-pill {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
}
.pill-neutral { background: var(--bg-main); color: var(--text-muted); }
.pill-danger { background: #fee2e2; color: #dc2626; }
.pill-success { background: #dcfce7; color: #16a34a; }
.pill-info { background: #ede9fe; color: #7c3aed; }

.stat-bottom {
  display: flex;
  flex-direction: column;
}
.stat-value {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text-main);
  line-height: 1.1;
  font-family: 'Outfit', sans-serif;
}
.stat-label {
  font-size: 0.78rem;
  color: var(--text-muted);
  font-weight: 600;
  margin-top: 0.25rem;
}

/* Row 2: Charts */
.charts-row {
  display: grid;
  grid-template-columns: 1.1fr 2fr;
  gap: 1rem;
}
@media (max-width: 1024px) {
  .charts-row { grid-template-columns: 1fr; }
}

.chart-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}
.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.chart-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-main);
}
.chart-sub-tag {
  font-size: 0.75rem;
  color: var(--text-muted);
  background: var(--bg-main);
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
}
.live-indicator {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #10b981;
}
.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* Donut */
.donut-body {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
}
@media (max-width: 480px) {
  .donut-body { flex-direction: column; }
}
.donut-canvas-wrap {
  position: relative;
  width: 140px;
  height: 140px;
  flex-shrink: 0;
}
.donut-center-text {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.donut-total-num {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--text-main);
  font-family: 'Outfit', sans-serif;
  line-height: 1;
}
.donut-total-lbl {
  font-size: 0.65rem;
  color: var(--text-muted);
  margin-top: 0.15rem;
}
.donut-legend-grid {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  flex: 1;
}
.legend-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.78rem;
}
.legend-left-part {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.legend-lbl {
  color: var(--text-muted);
}
.legend-count {
  font-weight: 700;
  color: var(--text-main);
  font-family: 'Outfit', sans-serif;
}

/* Activity Summary Grid */
.activity-summary-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  background: var(--bg-main);
  padding: 0.75rem;
  border-radius: 10px;
}
@media (max-width: 768px) {
  .activity-summary-grid { grid-template-columns: repeat(3, 1fr); }
}
.act-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.act-num {
  font-size: 1.25rem;
  font-weight: 800;
  font-family: 'Outfit', sans-serif;
  line-height: 1.1;
}
.act-label {
  font-size: 0.68rem;
  color: var(--text-muted);
  margin-top: 0.2rem;
}
.text-purple { color: #4f008c; }
.text-amber { color: #d97706; }
.text-emerald { color: #10b981; }
.text-rose { color: #f43f5e; }
.text-sky { color: #0284c7; }

.line-wrapper {
  height: 160px;
  width: 100%;
}

/* Row 3: Tables */
.tables-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
@media (max-width: 1024px) {
  .tables-row { grid-template-columns: 1fr; }
}

.section-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.section-title-wrap {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.section-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-main);
}
.view-all-link {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #4f008c;
  text-decoration: none;
}
.dark .view-all-link { color: #ffc700; }

.table-wrap {
  overflow-x: auto;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.78rem;
}
.data-table th {
  padding: 0.5rem 0.6rem;
  color: var(--text-muted);
  font-weight: 600;
  border-bottom: 1px solid var(--border-color);
  text-align: right;
}
.data-table td {
  padding: 0.65rem 0.6rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-main);
}
.data-table tr:last-child td {
  border-bottom: none;
}

.client-info {
  display: flex;
  flex-direction: column;
}
.client-name {
  font-weight: 600;
}
.td-order-id {
  font-weight: 500;
}
.td-amount {
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
}
.td-subject {
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.td-date {
  font-size: 0.72rem;
  color: var(--text-muted);
}
.td-empty {
  text-align: center;
  padding: 1.5rem;
  color: var(--text-muted);
}
.text-muted { color: var(--text-muted); }
.ltr-text { direction: ltr; text-align: left; }

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.68rem;
  font-weight: 800;
  white-space: nowrap !important;
}
.status-new { background: #fee2e2; color: #dc2626; }
.status-contacted { background: #fef3c7; color: #d97706; }
.status-in_progress { background: #ede9fe; color: #7c3aed; }
.status-converted { background: #dcfce7; color: #16a34a; }
.status-archived { background: var(--bg-main); color: var(--text-muted); }

/* ===== ROW 4: BRAND SHOWCASES SECTION ===== */
.dash-brands-section {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);
}

.partner-header-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(37, 99, 235, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dash-partners-title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.dash-partner-count-pill {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.2rem 0.65rem;
  background: rgba(37, 99, 235, 0.12);
  color: #2563eb;
  border-radius: 9999px;
  border: 1px solid rgba(37, 99, 235, 0.25);
}

.dash-partners-section {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.brand-header-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(234, 88, 12, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dash-brands-title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.dash-brand-count-pill {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.2rem 0.65rem;
  background: rgba(234, 88, 12, 0.12);
  color: #ea580c;
  border-radius: 9999px;
  border: 1px solid rgba(234, 88, 12, 0.25);
}

.dash-section-desc {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-top: 0.2rem;
}

.empty-dash-brands {
  text-align: center;
  padding: 2.5rem;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.dash-brands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
}

.dash-brand-card {
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.dash-brand-card:hover {
  transform: translateY(-3px);
  border-color: rgba(234, 88, 12, 0.4);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
}

.dash-brand-stripe {
  height: 4px;
  width: 100%;
}

.dash-brand-body {
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  flex: 1;
}

.dash-brand-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dash-brand-badge {
  font-size: 0.68rem;
  font-weight: 800;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  border: 1px solid;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.dash-brand-status {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 9999px;
}

.dash-brand-status.status-active {
  background: #dcfce7;
  color: #16a34a;
}

.dark .dash-brand-status.status-active {
  background: rgba(22, 163, 74, 0.2);
  color: #4ade80;
}

.dash-brand-status.status-inactive {
  background: #fee2e2;
  color: #dc2626;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.dash-brand-mockup-box {
  position: relative;
  width: 100%;
  height: 160px;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark .dash-brand-mockup-box {
  background: rgba(255, 255, 255, 0.02);
}

.dash-brand-mockup-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.dash-brand-card:hover .dash-brand-mockup-img {
  transform: scale(1.04);
}

.dash-brand-pipeline-pill {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(4px);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.3);
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
}

.dash-brand-header-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.dash-brand-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text-main);
  margin: 0;
  line-height: 1.3;
}

.dash-brand-sub {
  font-size: 0.78rem;
  font-weight: 700;
}

.dash-brand-desc {
  font-size: 0.78rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.dash-brand-tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.dash-brand-tag-chip {
  font-size: 0.68rem;
  color: var(--text-muted);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

/* Store Buttons & Links */
.dash-brand-links-box {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: auto;
}

.dash-links-head {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-muted);
}

.dash-stores-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.store-badge-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.75rem;
  border-radius: 8px;
  text-decoration: none;
  font-family: inherit;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  flex: 1;
  min-width: 130px;
}

.store-icon {
  flex-shrink: 0;
}

.store-labels {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
  text-align: right;
}

.store-action {
  font-size: 0.62rem;
  opacity: 0.85;
}

.store-name {
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.2px;
}

/* Google Play specific styling */
.google-play-btn {
  background: #0f172a;
  color: #ffffff;
  border-color: #334155;
}

.google-play-btn:hover {
  background: #1e293b;
  border-color: #10b981;
  color: #34d399;
  transform: translateY(-1px);
}

/* Apple Store specific styling */
.apple-store-btn {
  background: #18181b;
  color: #ffffff;
  border-color: #3f3f46;
}

.apple-store-btn:hover {
  background: #27272a;
  border-color: #a1a1aa;
  color: #f4f4f5;
  transform: translateY(-1px);
}

/* Web button */
.web-store-btn {
  background: rgba(79, 0, 140, 0.08);
  color: #4f008c;
  border-color: rgba(79, 0, 140, 0.25);
}

.dark .web-store-btn {
  background: rgba(255, 199, 0, 0.1);
  color: #ffc700;
  border-color: rgba(255, 199, 0, 0.25);
}

.web-store-btn:hover {
  background: #4f008c;
  color: #ffffff;
  transform: translateY(-1px);
}

.dark .web-store-btn:hover {
  background: #ffc700;
  color: #000000;
}

/* Custom Link button */
.custom-store-btn {
  background: var(--bg-main);
  color: var(--text-main);
  border-color: var(--border-color);
}

.custom-store-btn:hover {
  border-color: #ea580c;
  color: #ea580c;
}

.no-links-note {
  font-size: 0.72rem;
  color: var(--text-muted);
  padding: 0.35rem;
  text-align: center;
  width: 100%;
}

.dash-brand-actions-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: 0.4rem;
  border-top: 1px dashed var(--border-color);
}

.manage-brand-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #ea580c;
  text-decoration: none;
  transition: opacity 0.2s;
}

.manage-brand-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

/* ========================================================
   PARTNERS & BRANDS SUBGROUPS & TECH PARTNERS GRID
   ======================================================== */
.dash-partners-filter-pills {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.25rem;
  margin-bottom: 0.75rem;
}

.dash-filter-pill {
  padding: 0.42rem 0.95rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 700;
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.dash-filter-pill:hover {
  border-color: #4f008c;
  color: var(--text-main);
}

.dark .dash-filter-pill:hover {
  border-color: #ffc700;
}

.dash-filter-pill.active {
  background: #4f008c;
  color: #ffffff;
  border-color: #4f008c;
  box-shadow: 0 2px 8px rgba(79, 0, 140, 0.25);
}

.dark .dash-filter-pill.active {
  background: #ffc700;
  color: #000000;
  border-color: #ffc700;
  box-shadow: 0 2px 8px rgba(255, 199, 0, 0.25);
}

.dash-subgroup-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-top: 0.35rem;
}

.dash-subgroup-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.dash-subgroup-title-box {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.dash-subgroup-badge {
  font-size: 0.68rem;
  font-weight: 800;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  background: rgba(59, 130, 246, 0.12);
  color: #2563eb;
  border: 1px solid rgba(59, 130, 246, 0.25);
}

.dark .dash-subgroup-badge {
  background: rgba(96, 165, 250, 0.15);
  color: #60a5fa;
  border-color: rgba(96, 165, 250, 0.3);
}

.dash-subgroup-badge.venture-badge-style {
  background: rgba(234, 88, 12, 0.12);
  color: #ea580c;
  border-color: rgba(234, 88, 12, 0.25);
}

.dark .dash-subgroup-badge.venture-badge-style {
  background: rgba(251, 146, 60, 0.15);
  color: #fb923c;
  border-color: rgba(251, 146, 60, 0.3);
}

.dash-subgroup-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--text-main);
  margin: 0;
}

.dash-subgroup-desc {
  font-size: 0.76rem;
  color: var(--text-muted);
}

.dash-tech-partners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
}

.dash-tech-card {
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.dash-tech-card:hover {
  transform: translateY(-3px);
  border-color: rgba(79, 0, 140, 0.35);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
}

.dark .dash-tech-card:hover {
  border-color: rgba(255, 199, 0, 0.35);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
}

.dash-tech-top-stripe {
  height: 4px;
  width: 100%;
}

.dash-tech-body {
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  flex: 1;
}

.dash-tech-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.dash-tech-logo-wrap {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
}

.dash-tech-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.dash-tech-badge {
  font-size: 0.68rem;
  font-weight: 800;
  padding: 0.18rem 0.55rem;
  border-radius: 6px;
  border: 1px solid;
  letter-spacing: 0.3px;
  font-family: 'Outfit', sans-serif;
}

.dash-partner-verified {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.7rem;
  font-weight: 700;
  color: #16a34a;
  background: #dcfce7;
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
}

.dark .dash-partner-verified {
  background: rgba(22, 163, 74, 0.2);
  color: #4ade80;
}

.dash-tech-titles {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.dash-tech-name {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text-main);
  margin: 0;
  line-height: 1.3;
}

.dash-tech-tier {
  font-size: 0.76rem;
  font-weight: 800;
  color: #4f008c;
  font-family: 'Outfit', sans-serif;
}

.dark .dash-tech-tier {
  color: #ffc700;
}

.dash-tech-sub {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0;
  font-weight: 600;
}

.dash-tech-desc {
  font-size: 0.78rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin: 0;
}

.dash-tech-features-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.dash-tech-feat-pill {
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--text-main);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
}

.dash-tech-links-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 0.6rem;
  border-top: 1px dashed var(--border-color);
}

.dash-tech-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.45rem 0.75rem;
  border-radius: 7px;
  text-decoration: none;
  transition: all 0.2s ease;
  flex: 1;
  min-width: 120px;
  justify-content: center;
  font-family: inherit;
}

.dash-tech-link-btn.primary-link {
  background: #4f008c;
  color: #ffffff;
  border: 1px solid #4f008c;
}

.dash-tech-link-btn.primary-link:hover {
  background: #3c006b;
  border-color: #3c006b;
}

.dark .dash-tech-link-btn.primary-link {
  background: #ffc700;
  color: #000000;
  border-color: #ffc700;
}

.dark .dash-tech-link-btn.primary-link:hover {
  background: #e5b300;
  border-color: #e5b300;
}

.dash-tech-link-btn.secondary-link {
  background: var(--bg-card);
  color: var(--text-main);
  border: 1px solid var(--border-color);
}

.dash-tech-link-btn.secondary-link:hover {
  border-color: #4f008c;
  color: #4f008c;
}

.dark .dash-tech-link-btn.secondary-link:hover {
  border-color: #ffc700;
  color: #ffc700;
}
</style>
