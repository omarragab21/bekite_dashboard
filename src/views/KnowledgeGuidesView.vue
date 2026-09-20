<template>
  <div class="careers-page" dir="rtl">
    <!-- Header -->
    <div class="page-header">
      <div class="header-titles">
        <h1 class="page-title">إدارة الشواغر والفرص الوظيفية (Careers & Positions)</h1>
        <p class="page-subtitle">نشر وإدارة الوظائف الشاغرة لدى Be Kite — مهندسي البرمجيات، مصممي واجهات المستخدم، والتسويق الرقمي</p>
      </div>
      <button class="btn-add" @click="openAddModal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        إضافة شاغر وظيفي
      </button>
    </div>

    <!-- KPI Stats Bar (Crisp SVGs with Unified Be Kite Theme) -->
    <div class="stats-bar">
      <div class="stat-card">
        <div class="stat-icon icon-brand">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ careers.length }}</span>
          <span class="stat-label">إجمالي الشواغر</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon icon-active">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ activeCareersCount }}</span>
          <span class="stat-label">متاح للتقديم حالياً</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon icon-brand">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="16 18 22 12 16 6"/>
            <polyline points="8 6 2 12 8 18"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ engineeringCount }}</span>
          <span class="stat-label">الهندسة والبرمجيات</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon icon-brand">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20V10"/>
            <path d="M18 20V4"/>
            <path d="M6 20v-4"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ designGrowthCount }}</span>
          <span class="stat-label">التصميم والنمو والمبيعات</span>
        </div>
      </div>
    </div>

    <!-- Filters & Search Bar -->
    <div class="filters-row">
      <div class="search-box">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="البحث في الشواغر بالمسمى الوظيفي، القسم، المهارات أو الموقع..."
          class="search-input"
        />
      </div>

      <div class="filter-dropdown">
        <select v-model="selectedDepartment" class="filter-select">
          <option value="">جميع الأقسام</option>
          <option value="الهندسة والتطوير">الهندسة والتطوير (Engineering)</option>
          <option value="التصميم والإبداع">التصميم والإبداع (Design)</option>
          <option value="التسويق الرقمي">التسويق الرقمي (Marketing)</option>
          <option value="تطوير الأعمال والمبيعات">تطوير الأعمال والمبيعات (Business)</option>
        </select>
      </div>

      <div class="filter-dropdown">
        <select v-model="selectedStatus" class="filter-select">
          <option value="">جميع الحالات</option>
          <option value="1">متاح للتقديم (Active)</option>
          <option value="0">مغلق (Closed)</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>جاري تحميل الشواغر والفرص الوظيفية من الخادم...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredCareers.length === 0" class="empty-state">
      <div class="empty-icon-wrap">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
      </div>
      <h3>لا توجد شواغر مطابقة</h3>
      <p>لم يتم العثور على أي فرصة وظيفية تطابق معايير البحث والفلترة المحددة.</p>
      <button class="btn-reset-filters" @click="resetFilters">إعادة ضبط الفلاتر</button>
    </div>

    <!-- Careers Cards Grid (Exact Same Design & Motion as Products & Projects) -->
    <div v-else class="careers-cards-grid">
      <div
        v-for="job in filteredCareers"
        :key="job.id"
        class="career-card"
      >
        <!-- Top Branded Accent Bar -->
        <div class="career-top-bar" :class="getDeptClass(job.department)"></div>

        <div class="career-card-inner">
          <!-- Top Row: Icon Box + Header Badges -->
          <div class="career-top">
            <div class="career-icon-box" :class="getDeptClass(job.department)">
              <img v-if="job.icon_image || job.icon" :src="job.icon_image || job.icon" class="career-custom-icon" alt="Icon" />
              <svg v-else-if="getDeptClass(job.department) === 'dept-design'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
                <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
                <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
                <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z"/>
              </svg>
              <svg v-else-if="getDeptClass(job.department) === 'dept-marketing'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
              <svg v-else-if="getDeptClass(job.department) === 'dept-business'" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
              </svg>
            </div>

            <div class="career-header-meta">
              <span class="career-badge-tag">
                {{ job.badge || job.department || 'JOB OPENING' }}
              </span>

              <div class="career-status-chip" :class="job.is_active ? 'active' : 'inactive'">
                <span class="status-dot"></span>
                <span>{{ job.is_active ? 'متاح للتقديم' : 'مغلق' }}</span>
              </div>
            </div>
          </div>

          <!-- Titles & Department -->
          <div class="career-titles-wrap">
            <h3 class="career-card-title single-line" :title="job.title">{{ job.title }}</h3>

            <span
              v-if="job.title_en"
              class="career-card-sub single-line"
              :title="job.title_en"
            >
              {{ job.title_en }}
            </span>
          </div>

          <!-- Subtitle Tagline -->
          <p v-if="job.subtitle" class="career-tagline">
            {{ job.subtitle }}
          </p>

          <!-- Description -->
          <p class="career-card-desc">{{ job.description }}</p>

          <!-- Meta Badges Row (Location, Type, Experience - Crisp SVGs) -->
          <div class="career-badges-row">
            <span class="career-badge-chip loc-badge" title="موقع العمل">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <span>{{ job.location }}</span>
            </span>
            <span class="career-badge-chip type-badge" title="نوع الدوام">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <span>{{ job.type }}</span>
            </span>
            <span class="career-badge-chip exp-badge" title="الخبرة المطلوبة">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
              <span>{{ job.experience }}</span>
            </span>
          </div>

          <!-- Skills / Requirements Tags -->
          <div v-if="job.skills && job.skills.length" class="career-skills-row">
            <span v-for="(skill, idx) in job.skills.slice(0, 4)" :key="idx" class="skill-tag">
              #{{ skill }}
            </span>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="career-card-footer">
          <button
            class="toggle-status-action"
            :class="job.is_active ? 'btn-deactivate' : 'btn-activate'"
            @click="toggleStatus(job)"
            :title="job.is_active ? 'اضغط لإغلاق باب التقديم' : 'اضغط لإتاحة الشاغر للتقديم'"
          >
            {{ job.is_active ? 'إغلاق التقديم' : 'إتاحة الشاغر' }}
          </button>

          <div class="career-action-btns">
            <button
              class="action-icon-btn preview-btn"
              @click="openPreviewModal(job)"
              title="معاينة دراسة الشاغر الوظيفي"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
            <button
              class="action-icon-btn edit-btn"
              @click="openEditModal(job)"
              title="تعديل بيانات الشاغر"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button
              class="action-icon-btn delete-btn"
              @click="confirmDelete(job)"
              title="حذف الشاغر"
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

    <!-- ================= ADD / EDIT CAREER MODAL ================= -->
    <div v-if="modalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-card modal-large-card">
        <div class="modal-header">
          <div class="modal-title-wrap">
            <h2 class="modal-title">{{ isEdit ? 'تعديل الشاغر الوظيفي' : 'إضافة شاغر وظيفي جديد (Job Opening)' }}</h2>
            <span class="modal-subtitle">قم بتحديد صورة الشاغر، بيانات الدور الوظيفي، الشروط، والمهارات المطلوبة</span>
          </div>
          <button class="close-btn" @click="closeModal" title="إغلاق">✕</button>
        </div>

        <form @submit.prevent="saveJob" class="modal-body">
          <!-- Image Selection & Upload Section (Direct Upload Only - No Presets) -->
          <div class="form-section-card">
            <h4 class="section-title">🖼️ صورة وخلفية الشاغر الوظيفي (Job Artwork) *</h4>
            <div class="image-uploader-flex">
              <div class="image-preview-frame">
                <img
                  :src="formData.image || formData.heroImage || '/images/careers/job_hero_infinity.jpg'"
                  alt="Job Preview"
                  class="preview-img"
                  @error="onImgError"
                />
              </div>

              <div class="image-inputs-col">
                <p class="upload-hint">ارفع صورة للشاغر الوظيفي لتظهر كغلاف في الكارت والمعاينة:</p>
                <div class="upload-controls-row">
                  <label class="btn-file-upload">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    رفع صورة من الجهاز
                    <input type="file" accept="image/*" @change="handleImageUpload" style="display: none;" />
                  </label>
                  <span class="or-separator">أو رابط مباشر:</span>
                  <input
                    type="text"
                    v-model="formData.image"
                    class="form-input ltr-text flex-1"
                    placeholder="https://... أو /images/careers/..."
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Basic Data Grid -->
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">المسمى الوظيفي (بالعربية) *</label>
              <input
                type="text"
                v-model="formData.title"
                class="form-input"
                :class="{ 'input-error': formErrors.title }"
                @input="formErrors.title = null"
                required
                placeholder="مثال: مطور Full-Stack أول"
              />
              <span v-if="formErrors.title" class="field-error-msg">{{ formErrors.title }}</span>
            </div>
            <div class="form-group">
              <label class="form-label">المسمى الوظيفي (English) *</label>
              <input
                type="text"
                v-model="formData.title_en"
                class="form-input ltr-text"
                :class="{ 'input-error': formErrors.title_en }"
                @input="formErrors.title_en = null"
                required
                placeholder="Senior Full-Stack Developer"
              />
              <span v-if="formErrors.title_en" class="field-error-msg">{{ formErrors.title_en }}</span>
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">القسم / الإدارة (بالعربية) *</label>
              <select
                v-model="formData.department"
                class="form-input"
                :class="{ 'input-error': formErrors.department }"
                @change="formErrors.department = null"
              >
                <option value="الهندسة والتطوير">الهندسة والتطوير (Engineering)</option>
                <option value="التصميم والإبداع">التصميم والإبداع (Design)</option>
                <option value="التسويق الرقمي">التسويق الرقمي (Marketing)</option>
                <option value="تطوير الأعمال والمبيعات">تطوير الأعمال والمبيعات (Business Development)</option>
              </select>
              <span v-if="formErrors.department" class="field-error-msg">{{ formErrors.department }}</span>
            </div>
            <div class="form-group">
              <label class="form-label">المعرف البرمجي للرابط (Slug) *</label>
              <input type="text" v-model="formData.slug" class="form-input ltr-text" required placeholder="senior-full-stack-developer" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">شارة التخصص (Badge)</label>
            <input type="text" v-model="formData.badge" class="form-input ltr-text" placeholder="TECH & ENGINEERING" />
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">نوع الدوام *</label>
              <input type="text" v-model="formData.type" class="form-input" placeholder="دوام كامل / دائم" />
            </div>
            <div class="form-group">
              <label class="form-label">موقع العمل *</label>
              <input type="text" v-model="formData.location" class="form-input" placeholder="الرياض، السعودية / عمان، الأردن — هجين" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">الخبرة المطلوبة *</label>
            <input type="text" v-model="formData.experience" class="form-input" placeholder="+3 سنوات خبرة (مثال: +4 سنوات خبرة عملية)" />
          </div>

          <div class="form-group">
            <label class="form-label">الشعار الترويجي / العنوان الفرعي (Subtitle)</label>
            <input type="text" v-model="formData.subtitle" class="form-input" placeholder="عبارة تشويقية قصيرة تلخص الدور الوظيفي..." />
          </div>

          <div class="form-group">
            <label class="form-label">الوصف والمسؤوليات (Description)</label>
            <textarea v-model="formData.description" class="form-textarea" rows="3" placeholder="تفاصيل الدور الوظيفي والتحديات والمهام اليومية..."></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">المهارات والتقنيات (مفصولة بفواصل)</label>
            <input
              type="text"
              v-model="skillsInput"
              class="form-input ltr-text"
              placeholder="React, Node.js, TypeScript, PostgreSQL"
            />
            <small class="text-muted">أدخل المهارات مفصولة بفواصل ليتم عرضها كشارات هوياتية في الكارت.</small>
          </div>

          <div class="form-group checkbox-row">
            <label class="checkbox-label">
              <input type="checkbox" v-model="formData.is_active" :true-value="1" :false-value="0" />
              <span>إتاحة الشاغر واستقبال طلبات التوظيف فورا في الموقع</span>
            </label>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-cancel" @click="closeModal">إلغاء</button>
            <button type="submit" class="btn-save" :disabled="saving">
              {{ saving ? 'جاري الحفظ...' : (isEdit ? 'تحديث الشاغر الوظيفي' : 'نشر الشاغر الوظيفي') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ================= LIVE PREVIEW MODAL (Matching JobDetailsPage.jsx) ================= -->
    <div v-if="previewModalOpen && previewJob" class="modal-overlay" @click.self="previewModalOpen = false">
      <div class="modal-card modal-preview-card">
        <!-- Floating Fixed Close Button -->
        <button class="preview-close-btn" @click="previewModalOpen = false" title="إغلاق المعاينة">✕</button>

        <!-- Entire Scrollable Content Wrapper -->
        <div class="preview-scrollable-content">
          <div class="preview-hero-banner">
            <div class="preview-hero-content">
              <div class="preview-top-row">
                <span class="preview-badge-pill">
                  ● {{ previewJob.badge || 'JOB OPENING' }}
                </span>
              </div>

              <h1 class="preview-job-title">{{ previewJob.title || previewJob.job_title_ar }}</h1>
              <h3 class="preview-job-title-en ltr-text">{{ previewJob.title_en || previewJob.job_title_en }}</h3>
              <p class="preview-job-sub">{{ previewJob.subtitle || previewJob.description }}</p>

              <div class="preview-meta-chips">
                <span class="p-chip">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>{{ previewJob.location || previewJob.job_location }}</span>
                </span>
                <span class="p-chip">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span>{{ previewJob.type || previewJob.job_type }}</span>
                </span>
                <span class="p-chip">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                  <span>{{ previewJob.experience }}</span>
                </span>
              </div>
            </div>

            <div class="preview-hero-image-wrap">
              <img
                :src="previewJob.image || previewJob.heroImage || previewJob.job_image_url || '/images/careers/job_hero_infinity.jpg'"
                :alt="previewJob.title"
                class="preview-hero-img"
                @error="onImgError"
              />
            </div>
          </div>

          <div class="preview-body">
            <div class="preview-section">
              <h4 class="preview-sec-title">نبذة عن الدور والمهام (About the Role)</h4>
              <p class="preview-desc-text">{{ previewJob.description }}</p>
            </div>

            <div v-if="previewJob.requirements && previewJob.requirements.length" class="preview-section">
              <h4 class="preview-sec-title">المتطلبات والخبرات (Key Qualifications)</h4>
              <ul class="preview-req-list">
                <li v-for="(req, idx) in previewJob.requirements" :key="idx">
                  <span class="check-icon">✓</span>
                  <span>{{ req }}</span>
                </li>
              </ul>
            </div>

            <div v-if="previewJob.skills && previewJob.skills.length" class="preview-section">
              <h4 class="preview-sec-title">المهارات والتقنيات المطلوبة</h4>
              <div class="preview-skills-flex">
                <span v-for="(s, idx) in previewJob.skills" :key="idx" class="preview-skill-badge">
                  {{ s }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Fixed Bottom Footer -->
        <div class="preview-footer">
          <div class="footer-actions-flex">
            <span class="status-indicator-badge" :class="previewJob.is_active ? 'active' : 'inactive'">
              <span class="status-dot"></span>
              <span>{{ previewJob.is_active ? 'الشاغر متاح للتقديم في الموقع' : 'الشاغر مغلق حالياً' }}</span>
            </span>
            <button class="btn-edit-from-preview" @click="editFromPreview(previewJob)">
              ✏️ تعديل بيانات الشاغر
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ContentService } from '../services/ContentService';
import { useToast } from '../composables/useToast';

const { success, error: toastError } = useToast();

const loading = ref(true);
const saving = ref(false);
const careers = ref([]);
const searchQuery = ref('');
const selectedDepartment = ref('');
const selectedStatus = ref('');

// Modals
const modalOpen = ref(false);
const isEdit = ref(false);
const currentEditId = ref(null);
const previewModalOpen = ref(false);
const previewJob = ref(null);

const skillsInput = ref('');

const defaultForm = () => ({
  title: '',
  title_en: '',
  job_title_ar: '',
  job_title_en: '',
  department: 'الهندسة والتطوير',
  departement: 'الهندسة والتطوير',
  department_en: 'Engineering',
  slug: '',
  badge: 'TECH & ENGINEERING',
  accent_color: '#4f008c',
  image: '',
  heroImage: '',
  job_image_file: null,
  location: 'الرياض / عمان — هجين',
  job_location: 'الرياض / عمان — هجين',
  type: 'دوام كامل / دائم',
  job_type: 'دوام كامل / دائم',
  experience: '+3 سنوات خبرة',
  subtitle: '',
  description: '',
  skills: ['Vue.js', 'React', 'TypeScript'],
  requirements: [],
  is_active: 1,
});

const formErrors = ref({});
const formData = ref(defaultForm());

// Computed Stats
const activeCareersCount = computed(() => careers.value.filter(c => c.is_active).length);
const engineeringCount = computed(() => careers.value.filter(c => c.department?.includes('الهندسة') || c.department_en === 'Engineering').length);
const designGrowthCount = computed(() => careers.value.filter(c => !c.department?.includes('الهندسة')).length);

// Filtered Careers
const filteredCareers = computed(() => {
  return careers.value.filter(job => {
    // Search query
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim();
      const matchTitle = job.title?.toLowerCase().includes(q) || job.title_en?.toLowerCase().includes(q);
      const matchDept = job.department?.toLowerCase().includes(q) || job.department_en?.toLowerCase().includes(q);
      const matchLoc = job.location?.toLowerCase().includes(q);
      const matchSkills = (job.skills || []).some(s => s.toLowerCase().includes(q));
      if (!matchTitle && !matchDept && !matchLoc && !matchSkills) return false;
    }

    // Department filter
    if (selectedDepartment.value) {
      if (job.department !== selectedDepartment.value) return false;
    }

    // Status filter
    if (selectedStatus.value !== '') {
      if (Number(job.is_active) !== Number(selectedStatus.value)) return false;
    }

    return true;
  });
});



const getDeptClass = (dept) => {
  if (!dept) return 'dept-engineering';
  if (dept.includes('تصميم') || dept.includes('إبداع') || dept.toLowerCase().includes('design')) return 'dept-design';
  if (dept.includes('تسويق') || dept.toLowerCase().includes('market')) return 'dept-marketing';
  if (dept.includes('أعمال') || dept.includes('مبيعات') || dept.toLowerCase().includes('business')) return 'dept-business';
  return 'dept-engineering';
};

function resetFilters() {
  searchQuery.value = '';
  selectedDepartment.value = '';
  selectedStatus.value = '';
}

function onImgError(e) {
  e.target.src = '/images/careers/job_hero_infinity.jpg';
}

function handleImageUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  formData.value.job_image_file = file;
  const reader = new FileReader();
  reader.onload = (event) => {
    formData.value.image = event.target.result;
    formData.value.heroImage = event.target.result;
  };
  reader.readAsDataURL(file);
}

// Fetch Careers
const fetchCareers = async () => {
  loading.value = true;
  try {
    careers.value = await ContentService.getCareers();
  } catch (err) {
    console.error('Failed to fetch careers', err);
    toastError('تعذر تحميل شواغر التوظيف');
  } finally {
    loading.value = false;
  }
};

// Actions
const toggleStatus = async (job) => {
  const newStatus = job.is_active ? 0 : 1;
  try {
    await ContentService.updateCareer(job.id, { is_active: newStatus });
    job.is_active = newStatus;
    success(newStatus ? 'تمت إتاحة الشاغر للتقديم' : 'تم إغلاق التقديم للشاغر');
  } catch (err) {
    console.error('Failed to update status', err);
    toastError('حدث خطأ أثناء تحديث الحالة');
  }
};

const openAddModal = () => {
  isEdit.value = false;
  currentEditId.value = null;
  formErrors.value = {};
  formData.value = defaultForm();
  skillsInput.value = (formData.value.skills || []).join(', ');
  modalOpen.value = true;
};

const openEditModal = (job) => {
  isEdit.value = true;
  currentEditId.value = job.id;
  formErrors.value = {};
  formData.value = JSON.parse(JSON.stringify(job));

  formData.value.title = job.title || job.job_title_ar || '';
  formData.value.title_en = job.title_en || job.job_title_en || '';
  formData.value.job_title_ar = formData.value.title;
  formData.value.job_title_en = formData.value.title_en;
  formData.value.department = job.department || job.departement || 'الهندسة والتطوير';
  formData.value.departement = formData.value.department;
  formData.value.location = job.location || job.job_location || 'الرياض / عمان — هجين';
  formData.value.job_location = formData.value.location;
  formData.value.type = job.type || job.job_type || 'دوام كامل / دائم';
  formData.value.job_type = formData.value.type;
  formData.value.experience = job.experience || '+3 سنوات خبرة';
  formData.value.image = job.image || job.heroImage || job.job_image_url || '';
  formData.value.heroImage = formData.value.image;
  formData.value.job_image_file = null;

  skillsInput.value = (formData.value.skills || []).join(', ');
  modalOpen.value = true;
};

const openPreviewModal = (job) => {
  previewJob.value = {
    ...job,
    title: job.title || job.job_title_ar || '',
    title_en: job.title_en || job.job_title_en || '',
    department: job.department || job.departement || 'الهندسة والتطوير',
    location: job.location || job.job_location || 'الرياض / عمان — هجين',
    type: job.type || job.job_type || 'دوام كامل / دائم',
    experience: job.experience || '+3 سنوات خبرة',
    image: job.image || job.heroImage || job.job_image_url || '/images/careers/job_hero_infinity.jpg',
  };
  previewModalOpen.value = true;
};

const editFromPreview = (job) => {
  previewModalOpen.value = false;
  openEditModal(job);
};

const closeModal = () => {
  modalOpen.value = false;
};

const saveJob = async () => {
  formErrors.value = {};
  // Front-end Validation
  const title_ar = (formData.value.title || formData.value.job_title_ar || '').trim();
  const title_en = (formData.value.title_en || formData.value.job_title_en || '').trim();
  const department = (formData.value.department || formData.value.departement || '').trim();

  let hasError = false;
  if (!title_ar) {
    formErrors.value.title = 'يرجى إدخال المسمى الوظيفي بالعربية';
    hasError = true;
  }
  if (!title_en) {
    formErrors.value.title_en = 'يرجى إدخال المسمى الوظيفي بالإنجليزية (English Job Title)';
    hasError = true;
  }
  if (!department) {
    formErrors.value.department = 'يرجى اختيار أو تحديد القسم المعني';
    hasError = true;
  }

  if (hasError) {
    toastError('يرجى ملء الحقول الإجبارية المحددة باللون الأحمر');
    return;
  }

  // Auto-generate slug if empty
  if (!formData.value.slug || !formData.value.slug.trim()) {
    formData.value.slug = title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `job-${Date.now()}`;
  }

  // Populate aliases
  formData.value.job_title_ar = title_ar;
  formData.value.job_title_en = title_en;
  formData.value.title = title_ar;
  formData.value.title_en = title_en;
  formData.value.departement = department;
  formData.value.department = department;
  formData.value.job_location = formData.value.location || 'الرياض / عمان — هجين';
  formData.value.location = formData.value.job_location;
  formData.value.job_type = formData.value.type || 'دوام كامل / دائم';
  formData.value.type = formData.value.job_type;

  saving.value = true;
  try {
    // Process skills
    if (skillsInput.value.trim()) {
      formData.value.skills = skillsInput.value.split(',').map(s => s.trim()).filter(Boolean);
    } else {
      formData.value.skills = [];
    }

    if (isEdit.value) {
      const updated = await ContentService.updateCareer(currentEditId.value, formData.value);
      const idx = careers.value.findIndex(c => c.id === currentEditId.value);
      if (idx !== -1) careers.value[idx] = updated;
      success('تم تحديث الشاغر الوظيفي بنجاح');
    } else {
      const created = await ContentService.createCareer(formData.value);
      careers.value.unshift(created);
      success('تم نشر الشاغر الوظيفي بنجاح');
    }
    closeModal();
  } catch (err) {
    console.error('Failed to save career', err);
    const msg = err.response?.data?.message || 'حدث خطأ أثناء حفظ الشاغر';
    toastError(msg);
  } finally {
    saving.value = false;
  }
};

const confirmDelete = async (job) => {
  if (confirm(`هل أنت متأكد من حذف شاغر "${job.title}"؟`)) {
    try {
      await ContentService.deleteCareer(job.id);
      careers.value = careers.value.filter(c => c.id !== job.id);
      success('تم حذف الشاغر الوظيفي بنجاح');
    } catch (err) {
      console.error('Failed to delete job', err);
      toastError('حدث خطأ أثناء حذف الشاغر');
    }
  }
};

onMounted(() => {
  fetchCareers();
});
</script>

<style scoped>
.careers-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--text-main);
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 0.2rem;
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.4rem;
  background: #7c3aed;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 0.88rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);
}
.btn-add:hover {
  background: #6d28d9;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
}

/* Stats Bar */
.stats-bar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.15rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  flex-shrink: 0;
}
.icon-brand {
  background: rgba(79, 0, 140, 0.08);
  color: #7c3aed;
  border: 1px solid rgba(124, 58, 237, 0.15);
}
.icon-active {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.stat-content { display: flex; flex-direction: column; gap: 0.15rem; }
.stat-value { font-size: 1.4rem; font-weight: 900; color: var(--text-main); }
.stat-label { font-size: 0.78rem; font-weight: 700; color: var(--text-muted); }

/* Filters */
.filters-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 280px;
  position: relative;
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}

.search-input {
  width: 100%;
  padding: 0.75rem 2.8rem 0.75rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-main);
  font-size: 0.88rem;
  outline: none;
  transition: border-color 0.2s;
}
.search-input:focus { border-color: #7c3aed; }

.filter-dropdown { min-width: 190px; }
.filter-select {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-main);
  font-size: 0.85rem;
  outline: none;
}

/* ================= CAREERS CARDS GRID (Compact Fixed Layout with Department Icons) ================= */
.careers-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 330px));
  gap: 1.25rem;
  justify-content: start;
}

.career-card {
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
.career-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.career-top-bar {
  height: 4px;
  width: 100%;
}
.career-top-bar.dept-engineering { background: linear-gradient(90deg, #4f008c, #7c3aed); }
.career-top-bar.dept-design { background: linear-gradient(90deg, #db2777, #f43f5e); }
.career-top-bar.dept-marketing { background: linear-gradient(90deg, #0891b2, #06b6d4); }
.career-top-bar.dept-business { background: linear-gradient(90deg, #d97706, #f59e0b); }

.career-card-inner {
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  flex: 1;
}

.career-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.career-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.career-custom-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.dept-engineering { background: rgba(124, 58, 237, 0.12); color: #7c3aed; }
.dept-design { background: rgba(219, 39, 119, 0.12); color: #db2777; }
.dept-marketing { background: rgba(8, 145, 178, 0.12); color: #0891b2; }
.dept-business { background: rgba(245, 158, 11, 0.12); color: #d97706; }

.career-header-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.35rem;
}

.career-badge-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.65rem;
  border-radius: 6px;
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-muted);
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  font-family: 'Outfit', sans-serif;
}

.career-status-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  white-space: nowrap !important;
}
.career-status-chip.active {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}
.career-status-chip.inactive {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}
.career-status-chip.active .status-dot {
  background: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.25);
}
.career-status-chip.inactive .status-dot {
  background: #ef4444;
}

/* Titles */
.career-titles-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow: hidden;
}

.career-cat-row {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--text-muted);
  white-space: nowrap !important;
}

.career-dept-label {
  white-space: nowrap !important;
}

.career-card-title {
  font-size: 1.15rem;
  font-weight: 900;
  color: var(--text-main);
  margin: 0;
  line-height: 1.3;
}

.career-card-sub {
  font-size: 0.82rem;
  font-weight: 700;
  color: #7c3aed;
}

.single-line {
  white-space: nowrap !important;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.career-tagline {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-muted);
  margin: 0;
}

.career-card-desc {
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
.career-badges-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  padding-top: 0.35rem;
  border-top: 1px dashed var(--border-color);
}

.career-badge-chip {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}
.career-badge-chip svg { flex-shrink: 0; }
.loc-badge { background: rgba(59, 130, 246, 0.08); color: #2563eb; border-color: rgba(59, 130, 246, 0.18); }
.type-badge { background: rgba(124, 58, 237, 0.08); color: #7c3aed; border-color: rgba(124, 58, 237, 0.18); }
.exp-badge { background: rgba(16, 185, 129, 0.08); color: #10b981; border-color: rgba(16, 185, 129, 0.18); }

.career-skills-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}
.skill-tag {
  font-size: 0.68rem;
  color: var(--text-muted);
  font-family: monospace;
  background: var(--tag-bg, rgba(0,0,0,0.03));
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

/* Card Footer */
.career-card-footer {
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
  white-space: nowrap !important;
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

.career-action-btns {
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

/* ================= MODAL STYLES ================= */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-card {
  background: var(--bg-card);
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
  border: 1px solid var(--border-color);
}
.modal-large-card { max-width: 860px; }

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.modal-title-wrap { display: flex; flex-direction: column; gap: 0.2rem; }
.modal-title { font-size: 1.25rem; font-weight: 800; color: var(--text-main); }
.modal-subtitle { font-size: 0.8rem; color: var(--text-muted); }

.close-btn {
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}
.close-btn:hover { color: var(--text-main); transform: rotate(90deg); }

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

/* Image Uploader Card in Modal */
.form-section-card {
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.section-title {
  font-size: 0.92rem;
  font-weight: 800;
  color: var(--text-main);
  margin: 0;
}

.image-uploader-flex {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
  flex-wrap: wrap;
}

.image-preview-frame {
  width: 220px;
  aspect-ratio: 16 / 10;
  border-radius: 12px;
  overflow: hidden;
  background: #0f172a;
  border: 1px solid var(--border-color);
  flex-shrink: 0;
}
.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-inputs-col {
  flex: 1;
  min-width: 260px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.upload-hint {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-muted);
  margin: 0;
}

.upload-controls-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.btn-file-upload {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 0.9rem;
  border-radius: 10px;
  background: #7c3aed;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s;
  white-space: nowrap;
}
.btn-file-upload:hover { background: #6d28d9; }
.or-separator { font-size: 0.75rem; color: var(--text-muted); font-weight: 700; }

/* Form Fields */
.form-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
@media (max-width: 640px) { .form-grid-2 { grid-template-columns: 1fr; } }

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

.form-input, .form-textarea {
  padding: 0.65rem 0.85rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--input-bg, var(--bg-card));
  color: var(--text-main);
  font-size: 0.85rem;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
}
.form-input:focus, .form-textarea:focus { border-color: #7c3aed; }
.form-textarea { resize: vertical; }

.ltr-text { direction: ltr; text-align: left; }



.checkbox-row { margin-top: 0.25rem; }
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-main);
  cursor: pointer;
}

.modal-footer {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-cancel {
  padding: 0.65rem 1.2rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-main);
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
}
.btn-save {
  padding: 0.65rem 1.5rem;
  border-radius: 10px;
  border: none;
  background: #7c3aed;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);
}
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

/* ================= LIVE PREVIEW MODAL ================= */
.modal-preview-card {
  max-width: 900px;
  height: 90vh;
  max-height: 90vh;
  border: none;
  background: #0f172a;
  color: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.preview-close-btn {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 60;
  transition: all 0.2s ease;
}
.preview-close-btn:hover {
  background: rgba(239, 68, 68, 0.9);
  transform: scale(1.08);
}

.preview-scrollable-content {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  display: flex;
  flex-direction: column;
}

.preview-scrollable-content::-webkit-scrollbar {
  width: 8px;
}
.preview-scrollable-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
}
.preview-scrollable-content::-webkit-scrollbar-thumb {
  background: rgba(124, 58, 237, 0.4);
  border-radius: 4px;
}
.preview-scrollable-content::-webkit-scrollbar-thumb:hover {
  background: rgba(124, 58, 237, 0.7);
}

.preview-hero-banner {
  padding: 2.5rem 2rem;
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 2rem;
  align-items: center;
  position: relative;
  background: linear-gradient(135deg, #150522 0%, #2e0854 50%, #4f008c 100%);
  flex-shrink: 0;
}
@media (max-width: 768px) { .preview-hero-banner { grid-template-columns: 1fr; padding: 1.5rem; } }

.preview-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.8rem;
}
.preview-badge-pill {
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: #ffce00;
  border: 1px solid rgba(255, 206, 0, 0.4);
  background: rgba(255, 206, 0, 0.1);
}

.preview-job-title {
  font-size: 1.9rem;
  font-weight: 900;
  line-height: 1.25;
  margin: 0 0 0.25rem 0;
}
.preview-job-title-en {
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffce00;
  margin: 0 0 0.8rem 0;
}
.preview-job-sub {
  font-size: 0.88rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 1.2rem 0;
}

.preview-meta-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.p-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  font-size: 0.78rem;
  font-weight: 700;
}
.p-chip svg {
  flex-shrink: 0;
}

.preview-hero-image-wrap {
  aspect-ratio: 16 / 10;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
}
.preview-hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-body {
  background: #ffffff;
  color: #1e293b;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1 0 auto;
}

.preview-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.preview-sec-title {
  font-size: 1.05rem;
  font-weight: 900;
  color: #0f172a;
  margin: 0;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 0.4rem;
}
.preview-desc-text {
  font-size: 0.88rem;
  line-height: 1.7;
  color: #475569;
  margin: 0;
}

.preview-req-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.preview-req-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  font-size: 0.85rem;
  color: #334155;
  line-height: 1.5;
}
.check-icon {
  color: #10b981;
  font-weight: 900;
  background: #d1fae5;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0.75rem;
}

.preview-skills-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.preview-skill-badge {
  padding: 0.35rem 0.8rem;
  border-radius: 8px;
  background: #ede9fe;
  color: #7c3aed;
  font-size: 0.8rem;
  font-weight: 800;
  border: 1px solid #ddd6fe;
}

.preview-footer {
  padding: 1.25rem 2rem;
  background: #0f172a;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}
.footer-actions-flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.status-indicator-badge {
  font-size: 0.82rem;
  font-weight: 800;
}
.btn-edit-from-preview {
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  background: #7c3aed;
  color: #fff;
  border: none;
  font-size: 0.82rem;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s;
}
.btn-edit-from-preview:hover { background: #6d28d9; }

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
