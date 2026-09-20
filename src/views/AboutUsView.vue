<template>
  <div class="about-us-manager" :dir="isArabic ? 'rtl' : 'ltr'">
    <!-- Header -->
    <div class="page-header">
      <div class="header-titles">
        <h1 class="page-title">{{ isArabic ? 'معلومات التواصل' : 'About Us' }}</h1>
        <p class="page-subtitle">
          {{ isArabic
            ? 'إدارة أرقام الهواتف، عناوين البريد الإلكتروني، وروابط منصات التواصل الاجتماعي.'
            : 'Manage phone numbers, official emails, and social media channels.' }}
        </p>
      </div>

      <div class="header-actions">
        <button class="btn-refresh" @click="loadData" :disabled="loading" title="تحديث البيانات">
          <svg class="spin-on-load" :class="{ 'rotating': loading }" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10"/>
            <polyline points="1 20 1 14 7 14"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          <span>تحديث</span>
        </button>

        <button class="btn-save-primary" @click="saveAll" :disabled="saving">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
          </svg>
          <span>{{ saving ? 'جاري الحفظ في Firebase...' : 'حفظ التعديلات' }}</span>
        </button>
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="stats-banner">
      <div class="stat-pill">
        <div class="pill-icon social-gradient">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
        </div>
        <div class="pill-data">
          <span class="pill-count">{{ data.socialLinks?.length || 0 }}</span>
          <span class="pill-label">{{ isArabic ? 'منصات تواصل اجتماعي' : 'Social Channels' }}</span>
        </div>
      </div>

      <div class="stat-pill">
        <div class="pill-icon phone-gradient">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        </div>
        <div class="pill-data">
          <span class="pill-count">{{ data.phones?.length || 0 }}</span>
          <span class="pill-label">{{ isArabic ? 'أرقام هواتف نشطة (الأردن والسعودية)' : 'Active Phone Numbers' }}</span>
        </div>
      </div>

      <div class="stat-pill">
        <div class="pill-icon email-gradient">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </div>
        <div class="pill-data">
          <span class="pill-count">{{ data.emails?.length || 0 }}</span>
          <span class="pill-label">{{ isArabic ? 'عناوين بريد إلكتروني رسمية' : 'Official Email Addresses' }}</span>
        </div>
      </div>
    </div>

    <!-- MAIN SECTIONS GRID -->
    <div class="sections-layout">
      
      <!-- ==============================================
           SECTION 1: SOCIAL MEDIA CHANNELS (السوشيال ميديا)
           ============================================== -->
      <div class="content-card">
        <div class="card-top-bar">
          <div class="card-heading-box">
            <div class="heading-icon-circle bg-purple-tint">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" stroke-width="2">
                <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            </div>
            <div>
              <h2 class="section-card-title">{{ isArabic ? 'روابط منصات التواصل الاجتماعي' : 'Social Media Links' }}</h2>
              <p class="section-card-desc">{{ isArabic ? 'الحسابات والروابط الرسمية لشركة Be Kite عبر المنصات' : 'Official Be Kite accounts across social platforms' }}</p>
            </div>
          </div>
          <button class="btn-add-action" @click="openSocialModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            إضافة منصة جديدة
          </button>
        </div>

        <div class="social-cards-grid">
          <div
            v-for="item in data.socialLinks"
            :key="item.id"
            class="social-item-card"
            :style="{ '--accent-color': item.color || '#4f008c' }"
          >
            <div class="social-card-inner">
              <div class="social-icon-wrapper" :style="{ backgroundColor: (item.color || '#4f008c') + '18', color: item.color || '#4f008c' }">
                <span v-html="getSocialSvg(item.platform || item.id)"></span>
              </div>
              <div class="social-info">
                <div class="social-title-row">
                  <span class="social-platform-name">{{ item.name || item.platform }}</span>
                  <span class="social-tag" v-if="item.username">{{ item.username }}</span>
                </div>
                <a :href="item.url" target="_blank" rel="noopener noreferrer" class="social-url-link ltr-text" dir="ltr">
                  <span>{{ item.url }}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
              </div>
            </div>

            <div class="item-actions">
              <button class="btn-icon edit" @click="openSocialModal(item)" title="تعديل الرابط">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="btn-icon delete" @click="deleteSocialLink(item.id)" title="حذف الرابط">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ==============================================
           SECTION 2: PHONE NUMBERS (أرقام الهواتف)
           ============================================== -->
      <div class="content-card">
        <div class="card-top-bar">
          <div class="card-heading-box">
            <div class="heading-icon-circle bg-emerald-tint">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <div>
              <h2 class="section-card-title">{{ isArabic ? 'أرقام الهواتف وقنوات الاتصال' : 'Phone Numbers & Channels' }}</h2>
              <p class="section-card-desc">{{ isArabic ? 'خطوط الاتصال والواتساب لمكتبي الأردن والمملكة العربية السعودية' : 'Direct calling & WhatsApp lines for Jordan and Saudi Arabia offices' }}</p>
            </div>
          </div>
          <button class="btn-add-action" @click="openPhoneModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            إضافة رقم جديد
          </button>
        </div>

        <div class="phones-table-wrapper">
          <table class="custom-table">
            <thead>
              <tr>
                <th>الدولة / المنطقة</th>
                <th>التسمية والوصف</th>
                <th>رقم الهاتف</th>
                <th>الحالة</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="phone in data.phones" :key="phone.id">
                <td>
                  <div class="country-badge-cell">
                    <span class="flag-icon">{{ getCountryFlag(phone.countryCode || phone.country) }}</span>
                    <span class="country-name">{{ phone.country }}</span>
                  </div>
                </td>
                <td>
                  <span class="label-text">{{ phone.label || 'خط اتصال مباشر' }}</span>
                </td>
                <td>
                  <div class="phone-number-cell" dir="ltr">
                    <a :href="'tel:' + phone.number.replace(/\s+/g, '')" class="phone-link">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      <strong>{{ phone.number }}</strong>
                    </a>
                    <button class="btn-copy-mini" @click="copyText(phone.number)" title="نسخ الرقم">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    </button>
                  </div>
                </td>
                <td>
                  <span class="status-chip" :class="phone.isPrimary ? 'primary' : 'secondary'">
                    {{ phone.isPrimary ? 'رقم رئيسي' : 'رقم فرعي' }}
                  </span>
                </td>
                <td>
                  <div class="table-actions">
                    <button class="btn-table-action edit" @click="openPhoneModal(phone)" title="تعديل">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="btn-table-action delete" @click="deletePhone(phone.id)" title="حذف">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ==============================================
           SECTION 3: EMAILS (عناوين البريد الإلكتروني)
           ============================================== -->
      <div class="content-card">
        <div class="card-top-bar">
          <div class="card-heading-box">
            <div class="heading-icon-circle bg-blue-tint">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div>
              <h2 class="section-card-title">{{ isArabic ? 'عناوين البريد الإلكتروني' : 'Official Emails' }}</h2>
              <p class="section-card-desc">{{ isArabic ? 'قنوات المراسلات الرسمية للاستفسارات والمبيعات والشراكات' : 'Official correspondence channels for inquiries, sales, and partnerships' }}</p>
            </div>
          </div>
          <button class="btn-add-action" @click="openEmailModal()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            إضافة بريد إلكتروني
          </button>
        </div>

        <div class="emails-grid">
          <div v-for="item in data.emails" :key="item.id" class="email-card">
            <div class="email-main-row">
              <div class="email-icon-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div class="email-content">
                <div class="email-title-line">
                  <span class="email-label-badge">{{ item.label }}</span>
                  <span v-if="item.isPrimary" class="primary-tag">البريد الرئيسي</span>
                </div>
                <a :href="'mailto:' + item.email" class="email-address ltr-text" dir="ltr">
                  {{ item.email }}
                </a>
              </div>
            </div>

            <div class="email-card-actions">
              <button class="btn-copy-pill" @click="copyText(item.email)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                نسخ
              </button>
              <button class="btn-icon edit" @click="openEmailModal(item)" title="تعديل">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="btn-icon delete" @click="deleteEmail(item.id)" title="حذف">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ==============================================
           SECTION 4: COMPANY INFO & LOCATIONS (المقرات والهوية)
           ============================================== -->
      <div class="content-card">
        <div class="card-top-bar">
          <div class="card-heading-box">
            <div class="heading-icon-circle bg-amber-tint">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div>
              <h2 class="section-card-title">{{ isArabic ? 'مقرات الشركة وعناوين العمل' : 'Company Locations & Hours' }}</h2>
              <p class="section-card-desc">{{ isArabic ? 'المقر الرئيسي ومكاتب Be Kite الميدانية المعروضة في تذييل الموقع وصفحة الاتصال' : 'Headquarters and field offices displayed in website footer and contact page' }}</p>
            </div>
          </div>
        </div>

        <div class="form-grid-3">
          <div class="form-group">
            <label class="form-label">عنوان مقر الأردن (Jordan Office)</label>
            <input type="text" v-model="data.company.addressJordan" class="form-input" placeholder="عمان، الأردن..." />
          </div>

          <div class="form-group">
            <label class="form-label">عنوان مقر السعودية (Saudi Arabia Office)</label>
            <input type="text" v-model="data.company.addressSaudi" class="form-input" placeholder="الرياض، المملكة العربية السعودية..." />
          </div>

          <div class="form-group">
            <label class="form-label">ساعات الدوام وأوقات العمل</label>
            <input type="text" v-model="data.company.workingHours" class="form-input" placeholder="الأحد - الخميس: 9:00 ص - 6:00 م" />
          </div>
        </div>
      </div>

    </div>

    <!-- ==============================================
         MODAL: ADD / EDIT SOCIAL LINK
         ============================================== -->
    <div v-if="socialModal.open" class="modal-overlay" @click.self="socialModal.open = false">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title">{{ socialModal.isEdit ? 'تعديل رابط منصة تواصل' : 'إضافة منصة تواصل اجتماعي' }}</h3>
          <button class="btn-close-modal" @click="socialModal.open = false">✕</button>
        </div>
        <form @submit.prevent="saveSocialItem" class="modal-body">
          <div class="form-group">
            <label class="form-label">المنصة الاجتماعية</label>
            <select v-model="socialModal.form.platform" class="form-select" @change="handlePlatformPreset">
              <option value="Facebook">فيسبوك (Facebook)</option>
              <option value="Instagram">انستغرام (Instagram)</option>
              <option value="LinkedIn">لينكد إن (LinkedIn)</option>
              <option value="YouTube">يوتيوب (YouTube)</option>
              <option value="Twitter">إكس / تويتر (X - Twitter)</option>
              <option value="TikTok">تيك توك (TikTok)</option>
              <option value="WhatsApp">واتساب أعمال (WhatsApp)</option>
              <option value="Other">منصة أخرى</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">اسم المنصة أو التسمية</label>
            <input type="text" v-model="socialModal.form.name" required class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label">اسم المستخدم / المعرف (Username)</label>
            <input type="text" v-model="socialModal.form.username" class="form-input ltr-text" dir="ltr" placeholder="@bekite..." />
          </div>

          <div class="form-group">
            <label class="form-label">الرابط الكامل (Full URL)</label>
            <input type="url" v-model="socialModal.form.url" required class="form-input ltr-text" dir="ltr" placeholder="https://..." />
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="socialModal.open = false">إلغاء</button>
            <button type="submit" class="btn-modal-submit">حفظ التغييرات</button>
          </div>
        </form>
      </div>
    </div>

    <!-- ==============================================
         MODAL: ADD / EDIT PHONE
         ============================================== -->
    <div v-if="phoneModal.open" class="modal-overlay" @click.self="phoneModal.open = false">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title">{{ phoneModal.isEdit ? 'تعديل رقم الهاتف' : 'إضافة رقم هاتف جديد' }}</h3>
          <button class="btn-close-modal" @click="phoneModal.open = false">✕</button>
        </div>
        <form @submit.prevent="savePhoneItem" class="modal-body">
          <div class="form-group">
            <label class="form-label">الدولة</label>
            <select v-model="phoneModal.form.countryCode" class="form-select" @change="handleCountryPreset">
              <option value="JO">🇯🇴 الأردن (Jordan)</option>
              <option value="SA">🇸🇦 المملكة العربية السعودية (KSA)</option>
              <option value="AE">🇦🇪 الإمارات العربية المتحدة (UAE)</option>
              <option value="OTHER">🌍 دولة أخرى</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">اسم الدولة المكتوب</label>
            <input type="text" v-model="phoneModal.form.country" required class="form-input" />
          </div>

          <div class="form-group">
            <label class="form-label">رقم الهاتف (مع رمز الدولة)</label>
            <input type="text" v-model="phoneModal.form.number" required class="form-input ltr-text" dir="ltr" placeholder="+962 ... / +966 ..." />
          </div>

          <div class="form-group">
            <label class="form-label">الوصف / الاستخدام (مثل: هاتف رئيسي، واتساب، مبيعات)</label>
            <input type="text" v-model="phoneModal.form.label" class="form-input" placeholder="خط خدمة العملاء..." />
          </div>

          <div class="form-checkbox-row">
            <label class="checkbox-label">
              <input type="checkbox" v-model="phoneModal.form.isPrimary" />
              <span>تعيين كرقم رئيسي للمنطقة</span>
            </label>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="phoneModal.open = false">إلغاء</button>
            <button type="submit" class="btn-modal-submit">حفظ الرقم</button>
          </div>
        </form>
      </div>
    </div>

    <!-- ==============================================
         MODAL: ADD / EDIT EMAIL
         ============================================== -->
    <div v-if="emailModal.open" class="modal-overlay" @click.self="emailModal.open = false">
      <div class="modal-card">
        <div class="modal-header">
          <h3 class="modal-title">{{ emailModal.isEdit ? 'تعديل البريد الإلكتروني' : 'إضافة عنوان بريد إلكتروني' }}</h3>
          <button class="btn-close-modal" @click="emailModal.open = false">✕</button>
        </div>
        <form @submit.prevent="saveEmailItem" class="modal-body">
          <div class="form-group">
            <label class="form-label">عنوان البريد الإلكتروني</label>
            <input type="email" v-model="emailModal.form.email" required class="form-input ltr-text" dir="ltr" placeholder="example@be-kite.com" />
          </div>

          <div class="form-group">
            <label class="form-label">التصنيف / الاستخدام</label>
            <input type="text" v-model="emailModal.form.label" required class="form-input" placeholder="الاستفسارات والمعلومات (Info)..." />
          </div>

          <div class="form-checkbox-row">
            <label class="checkbox-label">
              <input type="checkbox" v-model="emailModal.form.isPrimary" />
              <span>تعيين كبريد إلكتروني رئيسي</span>
            </label>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="emailModal.open = false">إلغاء</button>
            <button type="submit" class="btn-modal-submit">حفظ البريد</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { AboutUsFirebaseService, DEFAULT_ABOUT_US } from '../services/AboutUsFirebaseService';
import { useToast } from '../composables/useToast';

const { locale } = useI18n();
const isArabic = computed(() => (locale.value || 'ar') === 'ar');

const { success, error: toastError, info: toastInfo } = useToast();

const loading = ref(false);
const saving = ref(false);
const isConnected = ref(false);

const data = reactive({
  phones: JSON.parse(JSON.stringify(DEFAULT_ABOUT_US.phones)),
  emails: JSON.parse(JSON.stringify(DEFAULT_ABOUT_US.emails)),
  socialLinks: JSON.parse(JSON.stringify(DEFAULT_ABOUT_US.socialLinks)),
  company: JSON.parse(JSON.stringify(DEFAULT_ABOUT_US.company)),
  updatedAt: ''
});

// Modals State
const socialModal = reactive({
  open: false,
  isEdit: false,
  form: { id: '', platform: 'Facebook', name: '', username: '', url: '', color: '#1877F2' }
});

const phoneModal = reactive({
  open: false,
  isEdit: false,
  form: { id: '', country: 'الأردن', countryCode: 'JO', number: '', label: '', isPrimary: false }
});

const emailModal = reactive({
  open: false,
  isEdit: false,
  form: { id: '', email: '', label: '', isPrimary: false }
});

let unsubscribe = null;

// Platform presets
const handlePlatformPreset = () => {
  const p = socialModal.form.platform;
  if (p === 'Facebook') {
    socialModal.form.name = 'فيسبوك';
    socialModal.form.color = '#1877F2';
    if (!socialModal.form.url) socialModal.form.url = 'https://www.facebook.com/bekite86';
  } else if (p === 'Instagram') {
    socialModal.form.name = 'انستغرام';
    socialModal.form.color = '#E4405F';
    if (!socialModal.form.url) socialModal.form.url = 'https://www.instagram.com/bekite__';
  } else if (p === 'LinkedIn') {
    socialModal.form.name = 'لينكد إن';
    socialModal.form.color = '#0A66C2';
    if (!socialModal.form.url) socialModal.form.url = 'https://www.linkedin.com/company/be-kite';
  } else if (p === 'YouTube') {
    socialModal.form.name = 'يوتيوب';
    socialModal.form.color = '#FF0000';
    if (!socialModal.form.url) socialModal.form.url = 'https://www.youtube.com/@Be-kite';
  } else if (p === 'Twitter') {
    socialModal.form.name = 'إكس (تويتر)';
    socialModal.form.color = '#111827';
  } else if (p === 'TikTok') {
    socialModal.form.name = 'تيك توك';
    socialModal.form.color = '#000000';
  } else if (p === 'WhatsApp') {
    socialModal.form.name = 'واتساب أعمال';
    socialModal.form.color = '#25D366';
  }
};

const handleCountryPreset = () => {
  const c = phoneModal.form.countryCode;
  if (c === 'JO') {
    phoneModal.form.country = 'الأردن';
    if (!phoneModal.form.number) phoneModal.form.number = '+962 7 9892 2574';
  } else if (c === 'SA') {
    phoneModal.form.country = 'المملكة العربية السعودية';
    if (!phoneModal.form.number) phoneModal.form.number = '+966545016722';
  } else if (c === 'AE') {
    phoneModal.form.country = 'الإمارات العربية المتحدة';
  }
};

// Social Icons SVGs
const getSocialSvg = (platform) => {
  const p = (platform || '').toLowerCase();
  if (p.includes('facebook') || p.includes('فيسبوك')) {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`;
  }
  if (p.includes('instagram') || p.includes('انستغرام')) {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`;
  }
  if (p.includes('linkedin') || p.includes('لينكد')) {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`;
  }
  if (p.includes('youtube') || p.includes('يوتيوب')) {
    return `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`;
  }
  return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
};

const getCountryFlag = (code) => {
  const c = (code || '').toUpperCase();
  if (c.includes('JO') || c.includes('أردن') || c.includes('JORDAN')) return '🇯🇴';
  if (c.includes('SA') || c.includes('سعودي') || c.includes('KSA')) return '🇸🇦';
  if (c.includes('AE') || c.includes('إمارات')) return '🇦🇪';
  return '📍';
};

const copyText = (txt) => {
  if (!txt) return;
  navigator.clipboard.writeText(txt);
  toastInfo('تم نسخ النص إلى الحافظة');
};

// Data Management
const loadData = async () => {
  loading.value = true;
  try {
    const res = await AboutUsFirebaseService.getContactInfo();
    data.phones = res.phones || [];
    data.emails = res.emails || [];
    data.socialLinks = res.socialLinks || [];
    data.company = { ...data.company, ...(res.company || {}) };
    data.updatedAt = res.updatedAt || '';
    isConnected.value = true;
  } catch (err) {
    console.error('Failed to load About Us data', err);
    toastError('تعذر تحميل البيانات من Firebase');
  } finally {
    loading.value = false;
  }
};

const saveAll = async () => {
  saving.value = true;
  try {
    await AboutUsFirebaseService.saveContactInfo({
      phones: data.phones,
      emails: data.emails,
      socialLinks: data.socialLinks,
      company: data.company
    });
    success('تم حفظ وتحديث بيانات About Us في Firebase بنجاح!');
  } catch (err) {
    console.error('Failed to save to Firebase', err);
    toastError('حدث خطأ أثناء الحفظ في Firebase: ' + (err.message || ''));
  } finally {
    saving.value = false;
  }
};

// Social Modal actions
const openSocialModal = (item = null) => {
  if (item) {
    socialModal.isEdit = true;
    socialModal.form = { ...item };
  } else {
    socialModal.isEdit = false;
    socialModal.form = {
      id: 'social-' + Date.now(),
      platform: 'Facebook',
      name: 'فيسبوك',
      username: '',
      url: 'https://',
      color: '#1877F2'
    };
    handlePlatformPreset();
  }
  socialModal.open = true;
};

const saveSocialItem = async () => {
  if (socialModal.isEdit) {
    const idx = data.socialLinks.findIndex(s => s.id === socialModal.form.id);
    if (idx !== -1) data.socialLinks[idx] = { ...socialModal.form };
  } else {
    data.socialLinks.push({ ...socialModal.form });
  }
  socialModal.open = false;
  await saveAll();
};

const deleteSocialLink = async (id) => {
  if (confirm('هل أنت متأكد من حذف هذا الرابط؟')) {
    data.socialLinks = data.socialLinks.filter(s => s.id !== id);
    await saveAll();
  }
};

// Phone Modal actions
const openPhoneModal = (phone = null) => {
  if (phone) {
    phoneModal.isEdit = true;
    phoneModal.form = { ...phone };
  } else {
    phoneModal.isEdit = false;
    phoneModal.form = {
      id: 'phone-' + Date.now(),
      country: 'الأردن',
      countryCode: 'JO',
      number: '+962 ',
      label: 'هاتف التواصل',
      isPrimary: false
    };
  }
  phoneModal.open = true;
};

const savePhoneItem = async () => {
  if (phoneModal.form.isPrimary) {
    data.phones.forEach(p => {
      if (p.countryCode === phoneModal.form.countryCode) p.isPrimary = false;
    });
  }
  if (phoneModal.isEdit) {
    const idx = data.phones.findIndex(p => p.id === phoneModal.form.id);
    if (idx !== -1) data.phones[idx] = { ...phoneModal.form };
  } else {
    data.phones.push({ ...phoneModal.form });
  }
  phoneModal.open = false;
  await saveAll();
};

const deletePhone = async (id) => {
  if (confirm('هل أنت متأكد من حذف رقم الهاتف؟')) {
    data.phones = data.phones.filter(p => p.id !== id);
    await saveAll();
  }
};

// Email Modal actions
const openEmailModal = (item = null) => {
  if (item) {
    emailModal.isEdit = true;
    emailModal.form = { ...item };
  } else {
    emailModal.isEdit = false;
    emailModal.form = {
      id: 'email-' + Date.now(),
      email: '',
      label: 'الاستفسارات',
      isPrimary: false
    };
  }
  emailModal.open = true;
};

const saveEmailItem = async () => {
  if (emailModal.form.isPrimary) {
    data.emails.forEach(e => e.isPrimary = false);
  }
  if (emailModal.isEdit) {
    const idx = data.emails.findIndex(e => e.id === emailModal.form.id);
    if (idx !== -1) data.emails[idx] = { ...emailModal.form };
  } else {
    data.emails.push({ ...emailModal.form });
  }
  emailModal.open = false;
  await saveAll();
};

const deleteEmail = async (id) => {
  if (confirm('هل أنت متأكد من حذف هذا البريد الإلكتروني؟')) {
    data.emails = data.emails.filter(e => e.id !== id);
    await saveAll();
  }
};

onMounted(() => {
  loadData();
  // Listen for real-time changes
  unsubscribe = AboutUsFirebaseService.subscribeContactInfo((liveData) => {
    data.phones = liveData.phones || [];
    data.emails = liveData.emails || [];
    data.socialLinks = liveData.socialLinks || [];
    data.company = { ...data.company, ...(liveData.company || {}) };
    data.updatedAt = liveData.updatedAt || '';
    isConnected.value = true;
  });
});

onUnmounted(() => {
  if (typeof unsubscribe === 'function') unsubscribe();
});
</script>

<style scoped>
.about-us-manager {
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
  background: var(--bg-card);
  padding: 1.5rem 1.75rem;
  border-radius: 18px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 15px rgba(0,0,0,0.02);
}

.title-with-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--text-main);
  letter-spacing: -0.5px;
  margin: 0;
}

.page-subtitle {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 0.35rem;
  max-width: 800px;
  line-height: 1.5;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--input-bg);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 0.65rem 1rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-refresh:hover {
  background: var(--border-color);
}

.btn-save-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #4f008c, #7c3aed);
  color: #fff;
  border: none;
  padding: 0.7rem 1.4rem;
  border-radius: 12px;
  font-weight: 800;
  font-size: 0.85rem;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.btn-save-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(124, 58, 237, 0.45);
}

.rotating {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Stats Banner */
.stats-banner {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
}

.stat-pill {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.15rem 1.25rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}

.pill-icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.social-gradient {
  background: linear-gradient(135deg, #ec4899, #8b5cf6);
}

.phone-gradient {
  background: linear-gradient(135deg, #10b981, #059669);
}

.email-gradient {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.pill-data {
  display: flex;
  flex-direction: column;
}

.pill-count {
  font-size: 1.35rem;
  font-weight: 900;
  color: var(--text-main);
  line-height: 1.2;
}

.pill-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
}

/* Sections Layout */
.sections-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.content-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 18px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}

.card-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.card-heading-box {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.heading-icon-circle {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.bg-purple-tint { background: rgba(124, 58, 237, 0.12); }
.bg-emerald-tint { background: rgba(16, 185, 129, 0.12); }
.bg-blue-tint { background: rgba(37, 99, 235, 0.12); }
.bg-amber-tint { background: rgba(217, 119, 6, 0.12); }

.section-card-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-main);
  margin: 0;
}

.section-card-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.15rem;
}

.btn-add-action {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1rem;
  border-radius: 10px;
  background: rgba(124, 58, 237, 0.1);
  color: #7c3aed;
  border: 1px solid rgba(124, 58, 237, 0.2);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-add-action:hover {
  background: #7c3aed;
  color: #fff;
}

/* Social Cards Grid */
.social-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.social-item-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.15rem;
  border-radius: 14px;
  border: 1px solid var(--border-color);
  background: var(--input-bg);
  transition: transform 0.2s, border-color 0.2s;
  position: relative;
  overflow: hidden;
}

.social-item-card:hover {
  transform: translateY(-2px);
  border-color: var(--accent-color);
}

.social-item-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 4px;
  background-color: var(--accent-color);
}

.social-card-inner {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  overflow: hidden;
}

.social-icon-wrapper {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.social-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
}

.social-title-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.social-platform-name {
  font-weight: 800;
  font-size: 0.9rem;
  color: var(--text-main);
}

.social-tag {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--accent-color);
  background: rgba(0,0,0,0.04);
  padding: 0.15rem 0.45rem;
  border-radius: 6px;
}

.social-url-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 170px;
}

.social-url-link:hover {
  color: var(--accent-color);
  text-decoration: underline;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.15s;
}

.btn-icon.edit:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
  border-color: rgba(59, 130, 246, 0.3);
}

.btn-icon.delete:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.3);
}

/* Phone Numbers Table */
.phones-table-wrapper {
  overflow-x: auto;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  text-align: right;
  font-size: 0.85rem;
}

.custom-table th {
  padding: 0.75rem 1rem;
  background: var(--input-bg);
  color: var(--text-muted);
  font-weight: 700;
  font-size: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.custom-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-main);
  vertical-align: middle;
}

.country-badge-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.flag-icon {
  font-size: 1.25rem;
}

.country-name {
  font-weight: 800;
}

.phone-number-cell {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.phone-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--text-main);
  text-decoration: none;
  font-size: 0.9rem;
  font-family: monospace;
}

.phone-link:hover {
  color: #10b981;
}

.btn-copy-mini {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.2rem;
  border-radius: 4px;
}

.btn-copy-mini:hover {
  color: #4f008c;
}

.status-chip {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
}

.status-chip.primary {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
}

.status-chip.secondary {
  background: rgba(100, 116, 139, 0.12);
  color: #64748b;
}

.table-actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.btn-table-action {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-table-action.edit:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
  border-color: rgba(59, 130, 246, 0.3);
}

.btn-table-action.delete:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.3);
}

/* Emails Grid */
.emails-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1rem;
}

.email-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.15rem 1.25rem;
  border-radius: 14px;
  border: 1px solid var(--border-color);
  background: var(--input-bg);
}

.email-main-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.email-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.email-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.email-title-line {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.email-label-badge {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--text-main);
}

.primary-tag {
  font-size: 0.65rem;
  font-weight: 700;
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}

.email-address {
  font-size: 0.85rem;
  font-weight: 700;
  color: #2563eb;
  text-decoration: none;
}

.email-address:hover {
  text-decoration: underline;
}

.email-card-actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.btn-copy-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  padding: 0.35rem 0.65rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
}

.btn-copy-pill:hover {
  color: var(--text-main);
  background: var(--border-color);
}

/* Forms & Inputs */
.form-grid-3 {
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

.form-input, .form-select {
  padding: 0.7rem 0.9rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--input-bg);
  color: var(--text-main);
  font-size: 0.85rem;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus, .form-select:focus {
  border-color: #7c3aed;
}

.ltr-text {
  text-align: left;
  direction: ltr;
}

/* Modals */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: modalPop 0.2s ease-out;
}

@keyframes modalPop {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-title {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-main);
  margin: 0;
}

.btn-close-modal {
  background: transparent;
  border: none;
  font-size: 1.1rem;
  color: var(--text-muted);
  cursor: pointer;
}

.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-checkbox-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-main);
  cursor: pointer;
}

.modal-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.btn-cancel {
  padding: 0.65rem 1.15rem;
  border-radius: 10px;
  background: var(--input-bg);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
}

.btn-modal-submit {
  padding: 0.65rem 1.25rem;
  border-radius: 10px;
  background: linear-gradient(135deg, #4f008c, #7c3aed);
  border: none;
  color: #fff;
  font-weight: 800;
  font-size: 0.85rem;
  cursor: pointer;
}
</style>
