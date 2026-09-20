<template>
  <div class="projects-page" dir="rtl">
    <!-- Header -->
    <div class="page-header">
      <div class="header-titles">
        <h1 class="page-title">إدارة مشاريع البورتفوليو (Portfolio)</h1>
        <p class="page-subtitle">إضافة وتعديل وإدارة دراسات الحالة ومشاريع العملاء وقصص النجاح لـ Be Kite مع ربط الويب والتطبيقات والسوشيال ميديا والبراندنج</p>
      </div>
      <button class="btn-add" @click="openAddModal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        إضافة مشروع جديد
      </button>
    </div>

    <!-- Stats Cards Grid -->
    <div class="stats-cards-grid">
      <div class="stat-card">
        <div class="stat-icon-wrap bg-purple">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
          </svg>
        </div>
        <div class="stat-text">
          <span class="stat-value">{{ projects.length }}</span>
          <span class="stat-label">إجمالي المشاريع</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-wrap bg-emerald">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div class="stat-text">
          <span class="stat-value">{{ activeProjectsCount }}</span>
          <span class="stat-label">مشاريع منشورة</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-wrap bg-cyan">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
          </svg>
        </div>
        <div class="stat-text">
          <span class="stat-value">{{ mobileProjectsCount }}</span>
          <span class="stat-label">تطبيقات موبايل</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-wrap bg-amber">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
        </div>
        <div class="stat-text">
          <span class="stat-value">{{ brandingPdfCount }}</span>
          <span class="stat-label">أدلة هوية PDF</span>
        </div>
      </div>
    </div>

    <!-- Filters Row -->
    <div class="filters-row">
      <div class="search-box">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input type="text" v-model="searchQuery" placeholder="البحث عن اسم المشروع، العميل، أو الكلمات المفتاحية..." class="search-input" />
        <button v-if="searchQuery" class="clear-search-btn" @click="searchQuery = ''">✕</button>
      </div>

      <div class="filter-dropdown">
        <select v-model="selectedCategory" class="filter-select">
          <option value="">جميع التصنيفات</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.slug">{{ cat.name }}</option>
        </select>
      </div>

      <div class="filter-dropdown">
        <select v-model="selectedStatus" class="filter-select">
          <option value="">جميع الحالات</option>
          <option value="1">منشور (Active)</option>
          <option value="0">مسودة (Draft)</option>
        </select>
      </div>

      <div class="filter-dropdown">
        <select v-model="selectedFeature" class="filter-select">
          <option value="">جميع القنوات</option>
          <option value="web">منصة ويب 🌐</option>
          <option value="mobile">تطبيق موبايل 📱</option>
          <option value="social">سوشيال ميديا 📸</option>
          <option value="branding_pdf">دليل هوية PDF 📄</option>
        </select>
      </div>
    </div>

    <!-- Projects Cards Grid (Same Style as Brands) -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>جاري تحميل مشاريع البورتفوليو من الخادم...</p>
    </div>

    <div v-else-if="filteredProjects.length === 0" class="empty-state">
      <div class="empty-icon-wrap">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
      </div>
      <h3>لا توجد مشاريع مطابقة</h3>
      <p>لم يتم العثور على أي مشروع يطابق معايير البحث والفلترة الحالية.</p>
      <button class="btn-reset-filters" @click="resetFilters">إعادة ضبط الفلاتر</button>
    </div>

    <div v-else class="projects-cards-grid">
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        class="project-card"
        :class="{ 'card-dragging': draggedId === project.id }"
        draggable="true"
        @dragstart="onDragStart(project)"
        @dragover.prevent="onDragOver(project)"
        @drop.prevent="onDrop(project)"
      >
        <!-- Top Branded Accent Bar -->
        <div class="project-top-bar" :style="{ background: project.accent_color || '#7c3aed' }"></div>

        <div class="project-card-inner">
          <!-- Top Row: Icon Box + Header Badges -->
          <div class="project-top">
            <div
              class="project-icon-box"
              :style="{
                backgroundColor: getAlphaColor(project.accent_color, '15'),
                borderColor: getAlphaColor(project.accent_color, '35')
              }"
            >
              <img
                v-if="project.client_logo || project.icon_image || project.icon"
                :src="project.client_logo || project.icon_image || project.icon"
                class="project-custom-icon"
                alt="Logo"
                @error="onImgError"
              />
              <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" :stroke="project.accent_color || '#7c3aed'" stroke-width="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                <polyline points="2 17 12 22 22 17"/>
                <polyline points="2 12 12 17 22 12"/>
              </svg>
            </div>

            <div class="project-header-meta">
              <span
                class="project-badge-tag"
                :style="{
                  color: project.accent_color || '#7c3aed',
                  backgroundColor: getAlphaColor(project.accent_color, '15'),
                  borderColor: getAlphaColor(project.accent_color, '35')
                }"
              >
                {{ project.badge || 'PORTFOLIO' }}
              </span>

              <div class="project-status-chip" :class="project.is_active ? 'active' : 'inactive'">
                <span class="status-dot"></span>
                <span>{{ project.is_active ? 'منشور' : 'مسودة' }}</span>
              </div>
            </div>
          </div>

          <!-- Titles & Client -->
          <div class="project-titles-wrap">
            <div v-if="project.client_name" class="project-client-name">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              <span>{{ project.client_name }}</span>
              <span class="meta-sep">·</span>
              <span class="project-slug-tag ltr-text">/{{ project.slug }}</span>
            </div>

            <h3 class="project-card-title">{{ project.title }}</h3>
            
            <span
              v-if="project.title_en && project.title_en.trim().toLowerCase() !== project.title.trim().toLowerCase()"
              class="project-card-sub"
              :style="{ color: project.accent_color || '#7c3aed' }"
            >
              {{ project.title_en }}
            </span>
          </div>

          <!-- Location & Year Meta -->
          <div class="project-meta-row">
            <span class="meta-item">📍 {{ project.location || 'عمان، الأردن' }}</span>
            <span class="meta-sep">·</span>
            <span class="meta-item ltr-text" dir="ltr">📅 {{ project.year || '2025 - 2026' }}</span>
          </div>

          <!-- Description -->
          <p class="project-card-desc">{{ project.description || 'مشروع رقمي متكامل تم تنفيذه بأعلى معايير الجودة والأداء والتصميم المتناسق.' }}</p>

          <!-- Categories & Tags -->
          <div class="project-cats-tags-wrap">
            <div v-if="project.filter_categories && project.filter_categories.length" class="project-cats-row">
              <span v-for="catSlug in project.filter_categories" :key="catSlug" class="cat-pill">
                {{ getCategoryName(catSlug) }}
              </span>
            </div>
            <div v-if="project.tags && project.tags.length" class="project-tags-row">
              <span v-for="tag in project.tags.slice(0, 3)" :key="tag" class="project-tag-chip">
                #{{ tag }}
              </span>
              <span v-if="project.tags.length > 3" class="project-tag-more" :title="project.tags.slice(3).join(', ')">
                +{{ project.tags.length - 3 }}
              </span>
            </div>
          </div>

          <!-- Available Channels -->
          <div class="channels-badges-row">
            <span v-if="project.website_url || project.web_image" class="channel-chip web" title="منصة ويب متوفرة">
              🌐 ويب
            </span>
            <span v-if="project.has_mobile_app || project.mobile_image || project.ios_url || project.android_url" class="channel-chip mobile" title="تطبيق موبايل">
              📱 موبايل
            </span>
            <span v-if="getSocialImagesCount(project) > 0 || hasSocialLinks(project)" class="channel-chip social" :title="`${getSocialImagesCount(project)} صور سوشيال ميديا`">
              📸 سوشيال ({{ getSocialImagesCount(project) }})
            </span>
            <span v-if="project.branding_pdf_url || getBrandingImagesCount(project) > 0" class="channel-chip branding" :title="project.branding_pdf_url ? 'يتضمن ملف PDF للهوية' : 'صور هوية بصرية'">
              📄 هوية {{ project.branding_pdf_url ? '+ PDF' : '' }}
            </span>
          </div>
        </div>

        <!-- Footer Actions Bar -->
        <div class="project-card-footer">
          <button
            class="toggle-status-action"
            :class="project.is_active ? 'btn-deactivate' : 'btn-activate'"
            @click="toggleProjectStatus(project)"
            :title="project.is_active ? 'اضغط للتحويل إلى مسودة' : 'اضغط للنشر الفوري'"
          >
            {{ project.is_active ? 'إيقاف النشر (مسودة)' : 'نشر المشروع' }}
          </button>

          <div class="project-action-btns">
            <button
              class="action-icon-btn preview-btn"
              @click="openPreviewModal(project)"
              title="معاينة سريعة شاملة"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
            <button
              class="action-icon-btn edit-btn"
              @click="openEditModal(project)"
              title="تعديل المشروع"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button
              class="action-icon-btn delete-btn"
              @click="confirmDelete(project)"
              title="حذف المشروع"
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

    <!-- ================= ADD / EDIT PROJECT MODAL ================= -->
    <div v-if="modalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-card modal-card-large">
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="modal-title-wrap">
            <h2 class="modal-title">{{ isEdit ? 'تعديل مشروع البورتفوليو' : 'إضافة مشروع جديد للبورتفوليو' }}</h2>
            <span class="modal-subtitle">يرجى تعبئة بيانات المشروع والوسائط والقنوات المتاحة بدقة</span>
          </div>
          <button class="close-btn" @click="closeModal" title="إغلاق">✕</button>
        </div>

        <form @submit.prevent="saveProject" class="modal-form">
          <!-- Form Steps Tabs Navigation -->
          <div class="form-tabs-bar">
            <button
              type="button"
              class="tab-btn"
              :class="{ active: activeTab === 'general' }"
              @click="activeTab = 'general'"
            >
              <span class="tab-num">1</span>
              <span>البيانات والتصنيفات</span>
            </button>
            <button
              type="button"
              class="tab-btn"
              :class="{ active: activeTab === 'web' }"
              @click="activeTab = 'web'"
            >
              <span class="tab-num">2</span>
              <span>منصة الويب (Web UI)</span>
            </button>
            <button
              type="button"
              class="tab-btn"
              :class="{ active: activeTab === 'mobile' }"
              @click="activeTab = 'mobile'"
            >
              <span class="tab-num">3</span>
              <span>تطبيق الموبايل</span>
            </button>
            <button
              type="button"
              class="tab-btn"
              :class="{ active: activeTab === 'social' }"
              @click="activeTab = 'social'"
            >
              <span class="tab-num">4</span>
              <span>السوشيال ميديا</span>
            </button>
            <button
              type="button"
              class="tab-btn"
              :class="{ active: activeTab === 'branding' }"
              @click="activeTab = 'branding'"
            >
              <span class="tab-num">5</span>
              <span>البراندنج والـ PDF</span>
            </button>
            <button
              type="button"
              class="tab-btn"
              :class="{ active: activeTab === 'stats' }"
              @click="activeTab = 'stats'"
            >
              <span class="tab-num">6</span>
              <span>النتائج والإحصائيات</span>
            </button>
          </div>

          <div class="modal-body-content">
            <!-- ================= TAB 1: General & Categories ================= -->
            <div v-show="activeTab === 'general'" class="tab-pane">
              <div class="section-notice">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>أدخل الاسم والوصف الأساسي، وحدد كافة التصنيفات التي ينتمي إليها المشروع (يمكن اختيار أكثر من قسم).</span>
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label">اسم / عنوان المشروع (بالعربية) *</label>
                  <input
                    type="text"
                    v-model="formData.title"
                    class="form-input"
                    :class="{ 'input-error': formErrors.title }"
                    @input="formErrors.title = null; autoGenerateSlug()"
                    required
                    placeholder="مثال: Iris Flowers"
                  />
                  <span v-if="formErrors.title" class="field-error-msg">{{ formErrors.title }}</span>
                </div>
                <div class="form-group">
                  <label class="form-label">عنوان المشروع (English) *</label>
                  <input
                    type="text"
                    v-model="formData.title_en"
                    class="form-input ltr-text"
                    :class="{ 'input-error': formErrors.title_en }"
                    @input="formErrors.title_en = null"
                    required
                    placeholder="e.g. Iris Flowers"
                  />
                  <span v-if="formErrors.title_en" class="field-error-msg">{{ formErrors.title_en }}</span>
                </div>
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label">اسم العميل / الشركة *</label>
                  <input
                    type="text"
                    v-model="formData.client_name"
                    class="form-input"
                    :class="{ 'input-error': formErrors.client_name }"
                    @input="formErrors.client_name = null"
                    required
                    placeholder="مثال: مجموعة Iris للزهور والهدايا"
                  />
                  <span v-if="formErrors.client_name" class="field-error-msg">{{ formErrors.client_name }}</span>
                </div>
                <div class="form-group">
                  <label class="form-label">الرابط التعريفي المخصص (Slug) *</label>
                  <input
                    type="text"
                    v-model="formData.slug"
                    class="form-input ltr-text"
                    required
                    placeholder="iris-flowers"
                  />
                </div>
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label">الموقع والمدينة</label>
                  <input
                    type="text"
                    v-model="formData.location"
                    class="form-input"
                    placeholder="عمان، الأردن"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">سنة التنفيذ</label>
                  <input
                    type="text"
                    v-model="formData.year"
                    class="form-input"
                    placeholder="2025 - 2026"
                  />
                </div>
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label">شارة وتصنيف المشروع البارز (Badge) *</label>
                  <input
                    type="text"
                    v-model="formData.badge"
                    class="form-input"
                    placeholder="مثال: الهوية والتجارة الإلكترونية"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">الكلمات المفتاحية والوسوم (Tags - مفصولة بفواصل)</label>
                  <input
                    type="text"
                    :value="formData.tags?.join(', ')"
                    @input="formData.tags = $event.target.value.split(',').map(s => s.trim()).filter(Boolean)"
                    class="form-input"
                    placeholder="تجارة إلكترونية, تطبيق جوال, هوية بصرية"
                  />
                </div>
              </div>

              <!-- Multi-Category Selector -->
              <div class="form-group">
                <div class="label-with-meta">
                  <label class="form-label">أقسام وتصنيفات المشروع (اختر أكثر من قسم ينطبق على المشروع) *</label>
                  <div class="multi-select-actions">
                    <button type="button" class="btn-text-sm" @click="selectAllCategories">تحديد الكل</button>
                    <span class="sep-dot">•</span>
                    <button type="button" class="btn-text-sm" @click="clearAllCategories">إلغاء التحديد</button>
                  </div>
                </div>

                <div class="categories-selector-grid">
                  <label
                    v-for="cat in categories"
                    :key="cat.slug"
                    class="cat-chip-card"
                    :class="{ selected: formData.filter_categories?.includes(cat.slug) }"
                  >
                    <input
                      type="checkbox"
                      :value="cat.slug"
                      v-model="formData.filter_categories"
                      class="hidden-checkbox"
                    />
                    <div class="cat-chip-content">
                      <span class="cat-check-box">
                        <svg v-if="formData.filter_categories?.includes(cat.slug)" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </span>
                      <div class="cat-info">
                        <span class="cat-title">{{ cat.name }}</span>
                        <span class="cat-slug-sub ltr-text">{{ cat.slug }}</span>
                      </div>
                    </div>
                  </label>
                </div>
                <span v-if="!formData.filter_categories?.length" class="field-hint text-warning">
                  ⚠️ يرجى اختيار تصنيف واحد على الأقل للمشروع.
                </span>
              </div>

              <!-- Description -->
              <div class="form-group">
                <label class="form-label">وصف المشروع ودراسة الحالة (بالعربية)</label>
                <textarea
                  v-model="formData.description"
                  class="form-textarea"
                  rows="3"
                  placeholder="اكتب نبذة شاملة عن المشروع، التحديات التي واجهت العميل، والحلول الرقمية التي تم تقديمها..."
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">وصف المشروع (English Description)</label>
                <textarea
                  v-model="formData.description_en"
                  class="form-textarea ltr-text"
                  rows="2"
                  placeholder="Project overview, digital transformation, and business achievements..."
                ></textarea>
              </div>
            </div>

            <!-- ================= TAB 2: Web Platform & UI Showcase ================= -->
            <div v-show="activeTab === 'web'" class="tab-pane">
              <div class="section-notice">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                <span>أضف رابط الموقع أو واجهة المستخدم (Web UI) وارفع صورة لمعاينة واجهة الموقع الرئيسية.</span>
              </div>

              <div class="form-group">
                <label class="form-label">رابط الموقع المنفذ / واجهة المستخدم (Live Website URL)</label>
                <div class="input-with-action">
                  <input
                    type="url"
                    v-model="formData.website_url"
                    class="form-input ltr-text flex-1"
                    placeholder="https://client-website.com"
                  />
                  <a
                    v-if="formData.website_url"
                    :href="formData.website_url"
                    target="_blank"
                    class="btn-icon-test"
                    title="فتح واختبار الرابط في نافذة جديدة"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    اختبار
                  </a>
                </div>
              </div>

              <!-- Web Image Upload / Preview -->
              <div class="form-group">
                <label class="form-label">صورة واجهة الموقع (Web UI Showcase Image) *</label>
                
                <div class="upload-dual-mode">
                  <!-- File Upload Dropzone -->
                  <div class="file-dropzone" @click="triggerFileInput('webImageInput')">
                    <input
                      type="file"
                      ref="webImageInput"
                      class="hidden-file-input"
                      accept="image/*"
                      @change="handleSingleImageUpload($event, 'web_image')"
                    />
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="dropzone-icon">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <span class="dropzone-title">انقر لاختيار صورة من جهازك أو اسحبها هنا</span>
                    <span class="dropzone-hint">يدعم PNG, JPG, WebP بحجم حتى 5MB</span>
                  </div>

                  <div class="or-divider">أو ضع رابط مباشر للصورة</div>

                  <input
                    type="text"
                    v-model="formData.web_image"
                    class="form-input ltr-text"
                    placeholder="https://example.com/images/web_showcase.jpg"
                  />
                </div>

                <!-- Preview Web Image Box -->
                <div v-if="formData.web_image" class="image-preview-card">
                  <div class="preview-browser-bar">
                    <div class="browser-dots">
                      <span class="dot dot-red"></span>
                      <span class="dot dot-yellow"></span>
                      <span class="dot dot-green"></span>
                    </div>
                    <span class="browser-address ltr-text">{{ formData.website_url || 'https://client-web-showcase.com' }}</span>
                  </div>
                  <div class="preview-img-wrap">
                    <img :src="formData.web_image" alt="Web UI Preview" @error="onImgError" />
                  </div>
                  <div class="preview-footer">
                    <span class="preview-label">معاينة واجهة الموقع</span>
                    <button type="button" class="btn-del-mini" @click="formData.web_image = ''">إزالة الصورة ✕</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- ================= TAB 3: Mobile Application ================= -->
            <div v-show="activeTab === 'mobile'" class="tab-pane">
              <div class="section-notice">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
                </svg>
                <span>إذا كان للمشروع تطبيق هاتف ذكي، ارفع صورة واجهة التطبيق وضع روابط متاجر Apple Store و Google Play.</span>
              </div>

              <div class="toggle-card-box">
                <label class="toggle-label-wrap">
                  <input type="checkbox" v-model="formData.has_mobile_app" class="toggle-checkbox" />
                  <div class="toggle-switch"></div>
                  <div class="toggle-text-block">
                    <span class="toggle-main-text">تفعيل قسم تطبيق الموبايل للمشروع</span>
                    <span class="toggle-sub-text">إظهار شاشات التطبيق وروابط التحميل على البورتفوليو</span>
                  </div>
                </label>
              </div>

              <div v-if="formData.has_mobile_app" class="mobile-fields-wrapper">
                <!-- App Store & Google Play Links -->
                <div class="form-grid-2">
                  <div class="form-group">
                    <label class="form-label">رابط تطبيق iOS (Apple App Store URL)</label>
                    <div class="input-with-icon">
                      <span class="input-icon-pill">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.04-2.85 0-.15-.01-.29-.04-.44-.99.04-2.19.66-2.9 1.49-.55.63-.99 1.66-.99 2.73 0 .15.02.3.05.42 1.09.08 2.22-.6 2.84-1.35z"/>
                        </svg>
                      </span>
                      <input
                        type="url"
                        v-model="formData.ios_url"
                        class="form-input ltr-text"
                        placeholder="https://apps.apple.com/app/id..."
                      />
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">رابط تطبيق Android (Google Play Store URL)</label>
                    <div class="input-with-icon">
                      <span class="input-icon-pill">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3.609 1.814L13.792 12 3.61 22.186a2.11 2.11 0 0 1-.61-1.496V3.31a2.11 2.11 0 0 1 .61-1.496zm11.24 11.24l2.502 2.502-12.742 7.373 10.24-9.875zm0-2.108L4.609.971l12.742 7.373-2.502 2.502zm1.06 1.054l3.14-1.818c1.082-.627 1.082-1.644 0-2.271l-3.14-1.818-2.203 2.203 2.203 2.203z"/>
                        </svg>
                      </span>
                      <input
                        type="url"
                        v-model="formData.android_url"
                        class="form-input ltr-text"
                        placeholder="https://play.google.com/store/apps/details?id=..."
                      />
                    </div>
                  </div>
                </div>

                <!-- Mobile App Image -->
                <div class="form-group">
                  <label class="form-label">صورة واجهة تطبيق الموبايل (Mobile Mockup Image)</label>
                  
                  <div class="upload-dual-mode">
                    <div class="file-dropzone" @click="triggerFileInput('mobileImageInput')">
                      <input
                        type="file"
                        ref="mobileImageInput"
                        class="hidden-file-input"
                        accept="image/*"
                        @change="handleSingleImageUpload($event, 'mobile_image')"
                      />
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="dropzone-icon">
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
                      </svg>
                      <span class="dropzone-title">انقر لرفع لقطة شاشة تطبيق الموبايل</span>
                      <span class="dropzone-hint">PNG, JPG مع خلفية شفافة أو Mockup</span>
                    </div>

                    <div class="or-divider">أو ضع رابط مباشر للصورة</div>

                    <input
                      type="text"
                      v-model="formData.mobile_image"
                      class="form-input ltr-text"
                      placeholder="https://example.com/images/mobile_mockup.png"
                    />
                  </div>

                  <!-- Mobile Preview -->
                  <div v-if="formData.mobile_image" class="mobile-preview-frame-wrap">
                    <div class="mobile-phone-frame">
                      <div class="phone-notch"></div>
                      <img :src="formData.mobile_image" alt="Mobile App Preview" @error="onImgError" />
                    </div>
                    <button type="button" class="btn-del-mini" @click="formData.mobile_image = ''">إزالة الصورة ✕</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- ================= TAB 4: Social Media ================= -->
            <div v-show="activeTab === 'social'" class="tab-pane">
              <div class="section-notice">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
                <span>ارفع عدة صور لحملات ومنشورات السوشيال ميديا للمشروع، وأضف روابط حسابات التواصل الاجتماعي الرسمية.</span>
              </div>

              <!-- Multi-Image Upload for Social Media -->
              <div class="form-group">
                <div class="label-with-meta">
                  <label class="form-label">معرض صور السوشيال ميديا (رفع واختيار أكثر من صورة)</label>
                  <span class="badge-mini-count">{{ (formData.social_media_images || []).length }} صور مضافة</span>
                </div>

                <!-- Dropzone for Multiple Images -->
                <div class="file-dropzone multi-dropzone" @click="triggerFileInput('socialMultiInput')">
                  <input
                    type="file"
                    ref="socialMultiInput"
                    class="hidden-file-input"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                    @change="handleMultipleImagesUpload($event, 'social_media_images')"
                  />
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="dropzone-icon">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span class="dropzone-title">انقر لاختيار عدة صور دفعة واحدة أو اسحبها هنا</span>
                  <span class="dropzone-hint">يمكنك رفع 1 إلى 10 صور (JPG, PNG, WEBP, GIF, SVG)</span>
                </div>

                <!-- Add via URL Row -->
                <div class="url-adder-row">
                  <input
                    type="text"
                    v-model="newSocialImageUrl"
                    class="form-input ltr-text flex-1"
                    placeholder="https://example.com/social-post.jpg"
                    @keyup.enter.prevent="addSocialImageByUrl"
                  />
                  <input
                    type="text"
                    v-model="newSocialImageTitle"
                    class="form-input flex-1"
                    placeholder="عنوان توضيحي اختياري للصورة"
                    @keyup.enter.prevent="addSocialImageByUrl"
                  />
                  <button type="button" class="btn-add-url" @click="addSocialImageByUrl">+ إضافة الرابط</button>
                </div>

                <!-- Gallery Grid of Social Images -->
                <div v-if="formData.social_media_images?.length" class="gallery-preview-grid">
                  <div
                    v-for="(item, idx) in formData.social_media_images"
                    :key="idx"
                    class="gallery-preview-card"
                  >
                    <div class="gallery-card-thumb">
                      <img :src="item.image || item.url || item" :alt="item.title || 'Social Image'" @error="onImgError" />
                      <button type="button" class="btn-remove-thumb" @click="removeSocialImage(idx)" title="حذف الصورة">✕</button>
                    </div>
                    <input
                      type="text"
                      v-if="typeof item === 'object'"
                      v-model="item.title"
                      placeholder="عنوان المنشور..."
                      class="gallery-caption-input"
                    />
                  </div>
                </div>
              </div>

              <!-- Social Media Links Grid -->
              <div class="form-group mt-6">
                <label class="form-label">روابط منصات السوشيال ميديا (Social Media Links)</label>
                
                <div class="social-links-form-grid">
                  <!-- Facebook -->
                  <div class="social-input-row">
                    <span class="social-icon fb">Facebook</span>
                    <input
                      type="url"
                      v-model="formData.social_links.facebook"
                      class="form-input ltr-text"
                      placeholder="https://facebook.com/page"
                    />
                  </div>

                  <!-- Instagram -->
                  <div class="social-input-row">
                    <span class="social-icon insta">Instagram</span>
                    <input
                      type="url"
                      v-model="formData.social_links.instagram"
                      class="form-input ltr-text"
                      placeholder="https://instagram.com/account"
                    />
                  </div>

                  <!-- Twitter / X -->
                  <div class="social-input-row">
                    <span class="social-icon x-tw">X (Twitter)</span>
                    <input
                      type="url"
                      v-model="formData.social_links.twitter"
                      class="form-input ltr-text"
                      placeholder="https://x.com/handle"
                    />
                  </div>

                  <!-- LinkedIn -->
                  <div class="social-input-row">
                    <span class="social-icon ln">LinkedIn</span>
                    <input
                      type="url"
                      v-model="formData.social_links.linkedin"
                      class="form-input ltr-text"
                      placeholder="https://linkedin.com/company/..."
                    />
                  </div>

                  <!-- TikTok -->
                  <div class="social-input-row">
                    <span class="social-icon tt">TikTok</span>
                    <input
                      type="url"
                      v-model="formData.social_links.tiktok"
                      class="form-input ltr-text"
                      placeholder="https://tiktok.com/@..."
                    />
                  </div>

                  <!-- YouTube -->
                  <div class="social-input-row">
                    <span class="social-icon yt">YouTube</span>
                    <input
                      type="url"
                      v-model="formData.social_links.youtube"
                      class="form-input ltr-text"
                      placeholder="https://youtube.com/@..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- ================= TAB 5: Branding & PDF ================= -->
            <div v-show="activeTab === 'branding'" class="tab-pane">
              <div class="section-notice">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
                <span>ارفع صور نماذج وشاشات الهوية البصرية (Branding Showcase) وأرفق ملف أو رابط PDF يجمع دليل وصور الهوية بالكامل.</span>
              </div>

              <!-- Brand Identity PDF Document -->
              <div class="form-group">
                <label class="form-label">ملف أو رابط PDF لدليل الهوية البصرية (Brand Guidelines PDF) 📄</label>
                
                <div class="pdf-upload-card">
                  <div class="pdf-drop-area" @click="triggerFileInput('brandingPdfInput')">
                    <input
                      type="file"
                      ref="brandingPdfInput"
                      class="hidden-file-input"
                      accept=".pdf,application/pdf"
                      @change="handlePdfUpload"
                    />
                    <div class="pdf-icon-circle">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                      </svg>
                    </div>
                    <div class="pdf-text-info">
                      <span class="pdf-title">ارفع ملف PDF للهوية البصرية من جهازك</span>
                      <span class="pdf-sub">يجمع صور الهوية، الخطوط، الألوان، والقواعد الإرشادية</span>
                    </div>
                  </div>

                  <div class="or-divider-sm">أو ضع رابط PDF خارجي</div>

                  <div class="pdf-url-row">
                    <input
                      type="text"
                      v-model="formData.branding_pdf_url"
                      class="form-input ltr-text flex-1"
                      placeholder="https://example.com/brand-guidelines.pdf"
                    />
                  </div>

                  <!-- Active PDF Card -->
                  <div v-if="formData.branding_pdf_url" class="active-pdf-badge-card">
                    <div class="pdf-badge-meta">
                      <span class="pdf-tag">PDF</span>
                      <div class="pdf-meta-texts">
                        <span class="pdf-name">{{ formData.branding_pdf_name || 'Brand_Identity_Guidelines.pdf' }}</span>
                        <span class="pdf-url-text ltr-text">{{ formData.branding_pdf_url.slice(0, 50) }}...</span>
                      </div>
                    </div>
                    <div class="pdf-card-actions">
                      <a :href="formData.branding_pdf_url" target="_blank" class="btn-pdf-view">معاينة الـ PDF ↗</a>
                      <button type="button" class="btn-del-mini" @click="clearPdf">إزالة ✕</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Multiple Branding Images -->
              <div class="form-group mt-6">
                <div class="label-with-meta">
                  <label class="form-label">صور نماذج وتطبيقات الهوية البصرية (Branding Showcase)</label>
                  <span class="badge-mini-count">{{ (formData.branding_images || []).length }} صور هوية</span>
                </div>

                <div class="file-dropzone multi-dropzone" @click="triggerFileInput('brandingMultiInput')">
                  <input
                    type="file"
                    ref="brandingMultiInput"
                    class="hidden-file-input"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                    @change="handleMultipleImagesUpload($event, 'branding_images')"
                  />
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="dropzone-icon">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span class="dropzone-title">انقر لرفع صور الهوية البصرية (Mockups, Packaging, Stationery)</span>
                  <span class="dropzone-hint">يمكنك اختيار حتى 10 صور دفعة واحدة (بحد أقصى 5MB للصورة)</span>
                </div>

                <!-- Add via URL Row -->
                <div class="url-adder-row">
                  <input
                    type="text"
                    v-model="newBrandingImageUrl"
                    class="form-input ltr-text flex-1"
                    placeholder="https://example.com/brand-mockup.jpg"
                    @keyup.enter.prevent="addBrandingImageByUrl"
                  />
                  <input
                    type="text"
                    v-model="newBrandingImageTitle"
                    class="form-input flex-1"
                    placeholder="عنوان الصورة (مثال: شعار مذهب، بطاقات عمل)"
                    @keyup.enter.prevent="addBrandingImageByUrl"
                  />
                  <button type="button" class="btn-add-url" @click="addBrandingImageByUrl">+ إضافة الصورة</button>
                </div>

                <!-- Branding Images Preview Grid -->
                <div v-if="formData.branding_images?.length" class="gallery-preview-grid">
                  <div
                    v-for="(item, idx) in formData.branding_images"
                    :key="idx"
                    class="gallery-preview-card"
                  >
                    <div class="gallery-card-thumb">
                      <img :src="item.image || item.url || item" :alt="item.title || 'Brand Image'" @error="onImgError" />
                      <button type="button" class="btn-remove-thumb" @click="removeBrandingImage(idx)" title="حذف الصورة">✕</button>
                    </div>
                    <input
                      type="text"
                      v-if="typeof item === 'object'"
                      v-model="item.title"
                      placeholder="عنوان نموذج الهوية..."
                      class="gallery-caption-input"
                    />
                  </div>
                </div>
              </div>

              <!-- Brand Accent Color & Logo -->
              <div class="form-grid-2 mt-4">
                <div class="form-group">
                  <label class="form-label">اللون المميز للهوية (Accent Color)</label>
                  <div class="color-picker-row">
                    <input type="color" v-model="formData.accent_color" class="color-picker-input" />
                    <input type="text" v-model="formData.accent_color" class="form-input ltr-text" />
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">لوجو العميل (Client Logo URL)</label>
                  <input
                    type="text"
                    v-model="formData.logo"
                    class="form-input ltr-text"
                    placeholder="/images/projects/logo.svg"
                  />
                </div>
              </div>
            </div>

            <!-- ================= TAB 6: Stats & Deliverables ================= -->
            <div v-show="activeTab === 'stats'" class="tab-pane">
              <div class="form-group">
                <div class="label-with-btn">
                  <label class="form-label">إحصائيات ونتائج المشروع الملموسة (KPIs)</label>
                  <button type="button" class="btn-add-stat" @click="addStatField">+ إضافة إحصائية جديدة</button>
                </div>
                
                <div class="stats-dynamic-list">
                  <div v-for="(stat, idx) in formData.stats" :key="idx" class="stat-row-card">
                    <input
                      type="text"
                      v-model="stat.value"
                      placeholder="القيمة (مثال: +240%)"
                      class="form-input stat-val-input ltr-text"
                    />
                    <input
                      type="text"
                      v-model="stat.label"
                      placeholder="العنوان بالعربية (مثال: نمو المبيعات)"
                      class="form-input flex-1"
                    />
                    <button type="button" class="btn-remove-stat" @click="removeStatField(idx)">✕</button>
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">مخرجات المشروع (Deliverables - مفصولة بفواصل)</label>
                <input
                  type="text"
                  :value="formData.deliverables?.join(', ')"
                  @input="formData.deliverables = $event.target.value.split(',').map(s => s.trim()).filter(Boolean)"
                  class="form-input"
                  placeholder="Web Platform, iOS & Android App, Brand Identity, Social Media Management"
                />
              </div>

              <div class="form-group checkbox-row-card">
                <label class="toggle-switch-label">
                  <input type="checkbox" v-model="formData.is_active" :true-value="1" :false-value="0" />
                  <div class="toggle-info">
                    <span class="toggle-text-bold">نشر المشروع فوراً على البورتفوليو للزوار</span>
                    <span class="toggle-sub">يمكنك إيقاف النشر في أي وقت لتحويله إلى مسودة</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <!-- Modal Footer Actions -->
          <div class="modal-footer">
            <div class="modal-footer-nav">
              <button
                v-if="activeTab !== 'general'"
                type="button"
                class="btn-nav-step"
                @click="goToPrevTab"
              >
                <!-- Arrow on the RIGHT side in RTL (pointing right) -->
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
                <span>الخطوة السابقة</span>
              </button>
              <button
                v-if="activeTab !== 'stats'"
                type="button"
                class="btn-nav-step btn-nav-next"
                @click="goToNextTab"
              >
                <span>الخطوة التالية</span>
                <!-- Arrow on the LEFT side in RTL (pointing left) -->
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                </svg>
              </button>
            </div>

            <div class="modal-footer-actions">
              <button type="button" class="btn-cancel" @click="closeModal">إلغاء</button>
              <button type="submit" class="btn-save" :disabled="saving">
                <span v-if="saving" class="spinner-mini"></span>
                <span>{{ saving ? 'جاري الحفظ...' : (isEdit ? 'تحديث المشروع' : 'حفظ ونشر المشروع') }}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- ================= QUICK PROJECT PREVIEW MODAL ================= -->
    <div v-if="previewModalOpen && previewProject" class="modal-overlay" @click.self="previewModalOpen = false">
      <div class="modal-card modal-preview-card">
        <div class="preview-hero-header" :style="{ background: `linear-gradient(135deg, ${previewProject.accent_color || '#4f008c'}, #23113b)` }">
          <button class="preview-close-btn" @click="previewModalOpen = false">✕</button>
          
          <div class="preview-hero-content">
            <div class="preview-hero-badges-row">
              <span v-if="previewProject.badge" class="preview-project-badge">★ {{ previewProject.badge }}</span>
              <span class="preview-client-badge">العميل: {{ previewProject.client_name }}</span>
            </div>
            <h2 class="preview-hero-title">{{ previewProject.title }}</h2>
            <p v-if="previewProject.title_en" class="preview-hero-sub ltr-text">{{ previewProject.title_en }}</p>
            
            <!-- Tags row -->
            <div v-if="previewProject.tags && previewProject.tags.length" class="preview-tags-row">
              <span v-for="tag in previewProject.tags" :key="tag" class="preview-tag-chip">#{{ tag }}</span>
            </div>

            <div class="preview-meta-chips">
              <span class="preview-chip">{{ previewProject.location || 'عمان، الأردن' }}</span>
              <span class="preview-chip">{{ previewProject.year || '2025 - 2026' }}</span>
              <span class="preview-chip status-chip" :class="previewProject.is_active ? 'active' : 'inactive'">
                {{ previewProject.is_active ? 'منشور نشط' : 'مسودة' }}
              </span>
            </div>
          </div>

          <!-- Official Logo Card in Header -->
          <div v-if="previewProject.logo" class="preview-brand-logo-card">
            <img :src="previewProject.logo" :alt="previewProject.client_name" @error="onImgError" />
            <span class="logo-caption">شعار المشروع الرسمي</span>
          </div>
        </div>

        <div class="preview-body">
          <!-- Categories -->
          <div class="preview-section">
            <h3 class="preview-sec-title">التصنيفات المعتمدة</h3>
            <div class="categories-tags-wrap">
              <span v-for="cat in previewProject.filter_categories" :key="cat" class="cat-pill-large">
                {{ getCategoryName(cat) }}
              </span>
            </div>
          </div>

          <!-- Description -->
          <div v-if="previewProject.description" class="preview-section">
            <h3 class="preview-sec-title">نبذة عن المشروع ودراسة الحالة</h3>
            <p class="preview-desc-text">{{ previewProject.description }}</p>
          </div>

          <!-- Web Section -->
          <div v-if="previewProject.website_url || previewProject.web_image" class="preview-section">
            <div class="preview-sec-header">
              <h3 class="preview-sec-title">🌐 منصة الويب (Web UI)</h3>
              <a v-if="previewProject.website_url" :href="previewProject.website_url" target="_blank" class="btn-live-link">
                زيارة الموقع مباشرة ↗
              </a>
            </div>
            <div v-if="previewProject.web_image" class="preview-media-box">
              <img :src="previewProject.web_image" alt="Web UI" @error="onImgError" />
            </div>
          </div>

          <!-- Mobile App Section -->
          <div v-if="previewProject.has_mobile_app || previewProject.mobile_image || previewProject.ios_url || previewProject.android_url" class="preview-section">
            <h3 class="preview-sec-title">📱 تطبيق الهاتف الذكي (Mobile App)</h3>
            <div class="preview-store-buttons">
              <a v-if="previewProject.ios_url" :href="previewProject.ios_url" target="_blank" class="store-btn ios-btn">
                <span>تحميل من App Store (iOS)</span>
              </a>
              <a v-if="previewProject.android_url" :href="previewProject.android_url" target="_blank" class="store-btn android-btn">
                <span>تحميل من Google Play (Android)</span>
              </a>
            </div>
            <div v-if="previewProject.mobile_image" class="preview-mobile-box">
              <img :src="previewProject.mobile_image" alt="Mobile App" @error="onImgError" />
            </div>
          </div>

          <!-- Social Media Section -->
          <div v-if="getSocialImagesCount(previewProject) > 0 || hasSocialLinks(previewProject)" class="preview-section">
            <h3 class="preview-sec-title">📸 السوشيال ميديا والتسويق</h3>
            
            <div v-if="hasSocialLinks(previewProject)" class="preview-social-links-row">
              <a v-if="previewProject.social_links?.facebook" :href="previewProject.social_links.facebook" target="_blank" class="social-chip-link fb">Facebook</a>
              <a v-if="previewProject.social_links?.instagram" :href="previewProject.social_links.instagram" target="_blank" class="social-chip-link insta">Instagram</a>
              <a v-if="previewProject.social_links?.twitter" :href="previewProject.social_links.twitter" target="_blank" class="social-chip-link x-tw">X (Twitter)</a>
              <a v-if="previewProject.social_links?.linkedin" :href="previewProject.social_links.linkedin" target="_blank" class="social-chip-link ln">LinkedIn</a>
              <a v-if="previewProject.social_links?.tiktok" :href="previewProject.social_links.tiktok" target="_blank" class="social-chip-link tt">TikTok</a>
              <a v-if="previewProject.social_links?.youtube" :href="previewProject.social_links.youtube" target="_blank" class="social-chip-link yt">YouTube</a>
            </div>

            <div v-if="getSocialImagesCount(previewProject) > 0" class="preview-gallery-grid">
              <div v-for="(imgItem, idx) in previewProject.social_media_images" :key="idx" class="preview-gallery-item">
                <img :src="imgItem.image || imgItem.url || imgItem" :alt="imgItem.title || 'Social Media'" @error="onImgError" />
                <span v-if="imgItem.title" class="preview-gallery-caption">{{ imgItem.title }}</span>
              </div>
            </div>
          </div>

          <!-- Branding & PDF Section -->
          <div v-if="previewProject.branding_pdf_url || getBrandingImagesCount(previewProject) > 0" class="preview-section">
            <h3 class="preview-sec-title">🎨 الهوية البصرية ودليل البراندنج (Branding & PDF)</h3>
            
            <div v-if="previewProject.branding_pdf_url" class="preview-pdf-download-card">
              <div class="pdf-icon-big">📄</div>
              <div class="pdf-info-texts">
                <span class="pdf-title-text">{{ previewProject.branding_pdf_name || 'Brand_Identity_Guidelines.pdf' }}</span>
                <span class="pdf-sub-text">دليل الهوية البصرية المعتمد للمشروع</span>
              </div>
              <a :href="previewProject.branding_pdf_url" target="_blank" class="btn-download-pdf">
                فتح واستعراض الـ PDF ↗
              </a>
            </div>

            <div v-if="getBrandingImagesCount(previewProject) > 0" class="preview-gallery-grid mt-4">
              <div v-for="(bItem, idx) in previewProject.branding_images" :key="idx" class="preview-gallery-item">
                <img :src="bItem.image || bItem.url || bItem" :alt="bItem.title || 'Brand Showcase'" @error="onImgError" />
                <span v-if="bItem.title" class="preview-gallery-caption">{{ bItem.title }}</span>
              </div>
            </div>
          </div>

          <!-- Stats & Deliverables -->
          <div v-if="(previewProject.stats && previewProject.stats.length) || (previewProject.deliverables && previewProject.deliverables.length)" class="preview-section">
            <h3 class="preview-sec-title">📊 نتائج ومخرجات المشروع (Results & Deliverables)</h3>
            
            <div v-if="previewProject.stats && previewProject.stats.length" class="preview-stats-grid">
              <div v-for="(st, idx) in previewProject.stats" :key="idx" class="preview-stat-card">
                <span class="preview-stat-val">{{ st.value }}</span>
                <span class="preview-stat-lbl">{{ st.label }}</span>
              </div>
            </div>

            <div v-if="previewProject.deliverables && previewProject.deliverables.length" class="preview-deliverables-wrap mt-4">
              <span class="deliverables-heading">📦 المخرجات والخدمات المسلمة للعميل:</span>
              <div class="preview-deliverables-list">
                <span v-for="(del, dIdx) in previewProject.deliverables" :key="dIdx" class="preview-deliverable-badge">
                  ✓ {{ del }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="preview-footer-bar">
          <button class="btn-cancel" @click="previewModalOpen = false">إغلاق</button>
          <button class="btn-edit-from-preview" @click="openEditFromPreview(previewProject)">تعديل هذا المشروع ✏️</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ProjectService } from '../services/ProjectService';
import { useToast } from '../composables/useToast';
import { readFileAsDataUrl, validateImageFile, validateImageFiles } from '../utils/imageUpload';

const { success, error: toastError } = useToast();

const loading = ref(true);
const saving = ref(false);
const projects = ref([]);
const categories = ref([]);
const searchQuery = ref('');
const selectedCategory = ref('');
const selectedStatus = ref('');
const selectedFeature = ref('');

const modalOpen = ref(false);
const isEdit = ref(false);
const activeTab = ref('general');
const currentEditId = ref(null);

const previewModalOpen = ref(false);
const previewProject = ref(null);

const draggedId = ref(null);

// Temporary inputs for URL adding
const newSocialImageUrl = ref('');
const newSocialImageTitle = ref('');
const newBrandingImageUrl = ref('');
const newBrandingImageTitle = ref('');

// Refs for hidden file inputs
const webImageInput = ref(null);
const mobileImageInput = ref(null);
const socialMultiInput = ref(null);
const brandingMultiInput = ref(null);
const brandingPdfInput = ref(null);

const getInitialFormData = () => ({
  title: '',
  title_en: '',
  slug: '',
  client_name: '',
  location: '',
  location_en: '',
  year: new Date().getFullYear().toString(),
  badge: '',
  badge_en: '',
  description: '',
  description_en: '',
  card_image: '',
  image: '',
  logo: '',
  accent_color: '#7c3aed',
  filter_categories: ['websites'],
  
  // Web
  web_image: '',
  website_url: '',
  
  // Mobile
  has_mobile_app: false,
  mobile_image: '',
  ios_url: '',
  android_url: '',

  // Social Media
  social_media_images: [],
  social_links: {
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    tiktok: '',
    youtube: '',
  },

  // Branding & PDF
  branding_images: [],
  branding_pdf_url: '',
  branding_pdf_name: '',

  stats: [],
  tags: [],
  deliverables: [],
  is_active: 1,
});

const formErrors = ref({});
const formData = ref(getInitialFormData());

const getAlphaColor = (hex, alpha = '18') => {
  if (!hex || !hex.startsWith('#')) return '#7c3aed18';
  return `${hex}${alpha}`;
};

// Computed Stats
const activeProjectsCount = computed(() => projects.value.filter(p => p.is_active === 1 || p.is_active === true).length);
const mobileProjectsCount = computed(() => projects.value.filter(p => p.has_mobile_app || p.mobile_image || p.ios_url || p.android_url).length);
const brandingPdfCount = computed(() => projects.value.filter(p => p.branding_pdf_url).length);

// Filtered Projects
const filteredProjects = computed(() => {
  return projects.value.filter(p => {
    const q = searchQuery.value?.toLowerCase().trim();
    const matchesSearch = !q ||
      p.title?.toLowerCase().includes(q) ||
      p.title_en?.toLowerCase().includes(q) ||
      p.client_name?.toLowerCase().includes(q) ||
      p.slug?.toLowerCase().includes(q);

    const matchesCat = !selectedCategory.value ||
      (p.filter_categories && p.filter_categories.includes(selectedCategory.value));

    const matchesStatus = selectedStatus.value === '' ||
      String(p.is_active ? 1 : 0) === String(selectedStatus.value);

    let matchesFeature = true;
    if (selectedFeature.value === 'web') {
      matchesFeature = Boolean(p.website_url || p.web_image);
    } else if (selectedFeature.value === 'mobile') {
      matchesFeature = Boolean(p.has_mobile_app || p.mobile_image || p.ios_url || p.android_url);
    } else if (selectedFeature.value === 'social') {
      matchesFeature = Boolean(getSocialImagesCount(p) > 0 || hasSocialLinks(p));
    } else if (selectedFeature.value === 'branding_pdf') {
      matchesFeature = Boolean(p.branding_pdf_url);
    }

    return matchesSearch && matchesCat && matchesStatus && matchesFeature;
  });
});

const getCategoryName = (slug) => {
  const c = categories.value.find(cat => cat.slug === slug);
  return c ? c.name : slug;
};

const getSocialImagesCount = (p) => {
  if (Array.isArray(p.social_media_images)) return p.social_media_images.length;
  if (Array.isArray(p.social_media_grid)) return p.social_media_grid.length;
  return 0;
};

const getBrandingImagesCount = (p) => {
  if (Array.isArray(p.branding_images)) return p.branding_images.length;
  if (Array.isArray(p.branding_showcase)) return p.branding_showcase.length;
  return 0;
};

const hasSocialLinks = (p) => {
  if (!p.social_links) return false;
  return Boolean(
    p.social_links.facebook ||
    p.social_links.instagram ||
    p.social_links.twitter ||
    p.social_links.linkedin ||
    p.social_links.tiktok ||
    p.social_links.youtube
  );
};

const resetFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = '';
  selectedStatus.value = '';
  selectedFeature.value = '';
};

const onImgError = (e) => {
  e.target.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80';
};

const autoGenerateSlug = () => {
  if (!isEdit.value && formData.value.title && !formData.value.slug) {
    formData.value.slug = formData.value.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\u0621-\u064A-]/g, '');
  }
};

const selectAllCategories = () => {
  formData.value.filter_categories = categories.value.map(c => c.slug);
};

const clearAllCategories = () => {
  formData.value.filter_categories = [];
};

// Tabs navigation
const tabsOrder = ['general', 'web', 'mobile', 'social', 'branding', 'stats'];
const goToNextTab = () => {
  const idx = tabsOrder.indexOf(activeTab.value);
  if (idx !== -1 && idx < tabsOrder.length - 1) {
    activeTab.value = tabsOrder[idx + 1];
  }
};
const goToPrevTab = () => {
  const idx = tabsOrder.indexOf(activeTab.value);
  if (idx > 0) {
    activeTab.value = tabsOrder[idx - 1];
  }
};

// File Triggers
const triggerFileInput = (inputRefName) => {
  if (inputRefName === 'webImageInput' && webImageInput.value) webImageInput.value.click();
  if (inputRefName === 'mobileImageInput' && mobileImageInput.value) mobileImageInput.value.click();
  if (inputRefName === 'socialMultiInput' && socialMultiInput.value) socialMultiInput.value.click();
  if (inputRefName === 'brandingMultiInput' && brandingMultiInput.value) brandingMultiInput.value.click();
  if (inputRefName === 'brandingPdfInput' && brandingPdfInput.value) brandingPdfInput.value.click();
};

// Single Image Upload (Web / Mobile)
const handleSingleImageUpload = (e, field) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const validationError = validateImageFile(file);
  if (validationError) {
    toastError(validationError);
    e.target.value = null;
    return;
  }
  const reader = new FileReader();
  reader.onload = (event) => {
    formData.value[field] = event.target.result;
    if (field === 'web_image') {
      formData.value.card_image = event.target.result;
      formData.value.image = event.target.result;
    }
    success('تم تحميل الصورة بنجاح');
  };
  reader.readAsDataURL(file);
  e.target.value = null;
};

// Multiple Images Upload (Social / Branding)
const handleMultipleImagesUpload = async (e, field) => {
  const files = Array.from(e.target.files || []);
  if (!files.length) return;

  if (!Array.isArray(formData.value[field])) {
    formData.value[field] = [];
  }

  const { accepted, errors } = validateImageFiles(files, {
    currentCount: formData.value[field].length,
    maxFiles: 10,
  });
  const existing = new Set(formData.value[field].map((item) => `${item.name || item.title || item.image}:${item.size || ''}`));
  const uniqueFiles = accepted.filter((file) => {
    const key = `${file.name}:${file.size}`;
    if (existing.has(key)) return false;
    existing.add(key);
    return true;
  });

  if (uniqueFiles.length) {
    const images = await Promise.all(uniqueFiles.map(async (file) => {
      const dataUrl = await readFileAsDataUrl(file);
      return {
        id: `${Date.now()}-${crypto.randomUUID?.() || Math.random().toString(36).slice(2)}`,
        image: dataUrl,
        url: dataUrl,
        name: file.name,
        size: file.size,
        title: file.name.replace(/\.[^/.]+$/, ''),
      };
    }));
    formData.value[field].push(...images);
    success(`تمت إضافة ${images.length} صور بنجاح`);
  }
  if (errors.length) toastError(errors.join(' • '));
  if (accepted.length && !uniqueFiles.length) toastError('الصور المحددة مضافة بالفعل');
  e.target.value = null;
};

// Social Image by URL
const addSocialImageByUrl = () => {
  if (!newSocialImageUrl.value.trim()) return;
  if (!Array.isArray(formData.value.social_media_images)) formData.value.social_media_images = [];
  
  formData.value.social_media_images.push({
    id: Date.now(),
    image: newSocialImageUrl.value.trim(),
    url: newSocialImageUrl.value.trim(),
    title: newSocialImageTitle.value.trim() || 'منشور سوشيال ميديا',
  });
  newSocialImageUrl.value = '';
  newSocialImageTitle.value = '';
  success('تمت إضافة صورة السوشيال ميديا');
};

const removeSocialImage = (idx) => {
  formData.value.social_media_images.splice(idx, 1);
};

// Branding Image by URL
const addBrandingImageByUrl = () => {
  if (!newBrandingImageUrl.value.trim()) return;
  if (!Array.isArray(formData.value.branding_images)) formData.value.branding_images = [];

  formData.value.branding_images.push({
    id: Date.now(),
    image: newBrandingImageUrl.value.trim(),
    url: newBrandingImageUrl.value.trim(),
    title: newBrandingImageTitle.value.trim() || 'نموذج هوية بصرية',
  });
  newBrandingImageUrl.value = '';
  newBrandingImageTitle.value = '';
  success('تمت إضافة صورة الهوية البصرية');
};

const removeBrandingImage = (idx) => {
  formData.value.branding_images.splice(idx, 1);
};

// PDF Upload
const handlePdfUpload = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  formData.value.branding_pdf_name = file.name;
  const reader = new FileReader();
  reader.onload = (event) => {
    formData.value.branding_pdf_url = event.target.result;
    success('تم إرفاق ملف الـ PDF بنجاح');
  };
  reader.readAsDataURL(file);
  e.target.value = null;
};

const clearPdf = () => {
  formData.value.branding_pdf_url = '';
  formData.value.branding_pdf_name = '';
};

// Stats Fields
const addStatField = () => {
  if (!formData.value.stats) formData.value.stats = [];
  formData.value.stats.push({ label: '', value: '' });
};

const removeStatField = (idx) => {
  formData.value.stats.splice(idx, 1);
};

// API Fetching
const fetchProjects = async () => {
  loading.value = true;
  try {
    const [projData, catData] = await Promise.all([
      ProjectService.getAll(),
      ProjectService.getCategories(),
    ]);
    projects.value = projData;
    categories.value = catData;
  } catch (err) {
    console.error('Failed to fetch projects', err);
    toastError('تعذر تحميل مشاريع البورتفوليو');
  } finally {
    loading.value = false;
  }
};

const toggleProjectStatus = async (project) => {
  const newStatus = project.is_active ? 0 : 1;
  try {
    await ProjectService.update(project.id, { is_active: newStatus });
    project.is_active = newStatus;
    success(newStatus ? 'تم نشر المشروع بنجاح' : 'تم تحويل المشروع إلى مسودة');
  } catch (err) {
    console.error('Failed to toggle status', err);
    toastError('حدث خطأ أثناء تحديث الحالة');
  }
};

const openAddModal = () => {
  isEdit.value = false;
  currentEditId.value = null;
  formErrors.value = {};
  activeTab.value = 'general';
  formData.value = getInitialFormData();
  newSocialImageUrl.value = '';
  newSocialImageTitle.value = '';
  newBrandingImageUrl.value = '';
  newBrandingImageTitle.value = '';
  modalOpen.value = true;
};

const openEditModal = (project) => {
  isEdit.value = true;
  currentEditId.value = project.id;
  formErrors.value = {};
  activeTab.value = 'general';
  
  const cloned = JSON.parse(JSON.stringify(project));
  if (!cloned.filter_categories) cloned.filter_categories = ['websites'];
  if (!cloned.stats) cloned.stats = [];
  if (!Array.isArray(cloned.tags)) cloned.tags = [];
  if (!Array.isArray(cloned.deliverables)) cloned.deliverables = ['منصة ويب متكاملة'];
  if (!cloned.badge) cloned.badge = 'مشروع رقمي';
  if (!cloned.social_links) {
    cloned.social_links = { facebook: '', instagram: '', twitter: '', linkedin: '', tiktok: '', youtube: '' };
  }
  if (!cloned.social_media_images) {
    cloned.social_media_images = cloned.social_media_grid || [];
  }
  if (!cloned.branding_images) {
    cloned.branding_images = cloned.branding_showcase || [];
  }
  if (!cloned.web_image && (cloned.card_image || cloned.image)) {
    cloned.web_image = cloned.card_image || cloned.image;
  }

  formData.value = cloned;
  newSocialImageUrl.value = '';
  newSocialImageTitle.value = '';
  newBrandingImageUrl.value = '';
  newBrandingImageTitle.value = '';
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
};

const openPreviewModal = (project) => {
  previewProject.value = project;
  previewModalOpen.value = true;
};

const openEditFromPreview = (project) => {
  previewModalOpen.value = false;
  openEditModal(project);
};

const saveProject = async () => {
  formErrors.value = {};
  // Front-end Validation
  const name_ar = (formData.value.title || formData.value.name_ar || '').trim();
  const name_en = (formData.value.title_en || formData.value.name_en || '').trim();
  const client_name = (formData.value.client_name || '').trim();

  let hasError = false;
  if (!name_ar) {
    formErrors.value.title = 'يرجى إدخال اسم المشروع بالعربية';
    hasError = true;
  }
  if (!name_en) {
    formErrors.value.title_en = 'يرجى إدخال عنوان المشروع بالإنجليزية (English Title)';
    hasError = true;
  }
  if (!client_name) {
    formErrors.value.client_name = 'يرجى إدخال اسم العميل أو الشركة المالكة';
    hasError = true;
  }

  if (hasError) {
    activeTab.value = 'general';
    toastError('يرجى ملء الحقول الإجبارية المحددة باللون الأحمر');
    return;
  }

  // Ensure slug is populated
  if (!formData.value.slug || !formData.value.slug.trim()) {
    formData.value.slug = name_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `project-${Date.now()}`;
  }

  // Ensure filter_categories has at least 1
  if (!formData.value.filter_categories || !formData.value.filter_categories.length) {
    formData.value.filter_categories = ['websites'];
  }

  // Ensure category_ids has at least 1 valid id
  if (!formData.value.category_ids || !formData.value.category_ids.length) {
    formData.value.category_ids = [1];
  }

  saving.value = true;
  try {
    // Ensure default images
    if (!formData.value.web_image && formData.value.card_image) {
      formData.value.web_image = formData.value.card_image;
    }
    if (!formData.value.card_image && formData.value.web_image) {
      formData.value.card_image = formData.value.web_image;
    }
    if (!formData.value.card_image) {
      formData.value.card_image = '/images/projects/iris_website_showcase.jpg';
      formData.value.web_image = '/images/projects/iris_website_showcase.jpg';
    }
    formData.value.image = formData.value.card_image;

    if (isEdit.value) {
      const updated = await ProjectService.update(currentEditId.value, formData.value);
      const idx = projects.value.findIndex(p => p.id === currentEditId.value);
      if (idx !== -1) projects.value[idx] = updated;
      success('تم تحديث مشروع البورتفوليو بنجاح');
    } else {
      const created = await ProjectService.create(formData.value);
      projects.value.unshift(created);
      success('تمت إضافة المشروع الجديد بنجاح');
    }
    closeModal();
  } catch (err) {
    console.error('Failed to save project', err);
    const msg = err.response?.data?.message || 'حدث خطأ أثناء حفظ المشروع';
    toastError(msg);
  } finally {
    saving.value = false;
  }
};

const confirmDelete = async (project) => {
  if (confirm(`هل أنت متأكد من حذف مشروع "${project.title}" نهائياً من البورتفوليو؟`)) {
    try {
      await ProjectService.delete(project.id);
      projects.value = projects.value.filter(p => p.id !== project.id);
      success('تم حذف المشروع بنجاح');
    } catch (err) {
      console.error('Failed to delete project', err);
      toastError('حدث خطأ أثناء حذف المشروع');
    }
  }
};

// Drag & Drop Sorting
const onDragStart = (project) => {
  draggedId.value = project.id;
};

const onDragOver = (project) => {
  // Allow drop
};

const onDrop = async (targetProject) => {
  if (!draggedId.value || draggedId.value === targetProject.id) return;
  const list = [...projects.value];
  const fromIndex = list.findIndex(p => p.id === draggedId.value);
  const toIndex = list.findIndex(p => p.id === targetProject.id);

  if (fromIndex !== -1 && toIndex !== -1) {
    const [moved] = list.splice(fromIndex, 1);
    list.splice(toIndex, 0, moved);
    projects.value = list;
    try {
      await ProjectService.reorder(list.map(p => p.id));
      success('تم حفظ ترتيب المشاريع الجديد');
    } catch (err) {
      console.error('Failed to reorder projects', err);
      toastError('حدث خطأ أثناء إعادة الترتيب');
    }
  }
  draggedId.value = null;
};

onMounted(() => {
  fetchProjects();
});
</script>

<style scoped>
.projects-page {
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

/* Stats Cards */
.stats-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.1rem;
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
}

.stat-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.bg-purple { background: rgba(124, 58, 237, 0.12); color: #7c3aed; }
.bg-emerald { background: rgba(16, 185, 129, 0.12); color: #10b981; }
.bg-cyan { background: rgba(6, 182, 212, 0.12); color: #0891b2; }
.bg-amber { background: rgba(245, 158, 11, 0.12); color: #d97706; }

.stat-text {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.65rem;
  font-weight: 900;
  color: var(--text-main);
  line-height: 1.1;
  font-family: 'Outfit', sans-serif;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 600;
  margin-top: 0.15rem;
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
  top: 50%;
  right: 14px;
  transform: translateY(-50%);
  color: var(--text-muted);
}

.search-input {
  width: 100%;
  padding: 0.7rem 2.6rem 0.7rem 2.4rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-main);
  font-size: 0.85rem;
  transition: border-color 0.2s;
}
.search-input:focus {
  outline: none;
  border-color: #7c3aed;
}

.clear-search-btn {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 0.8rem;
}

.filter-select {
  padding: 0.7rem 1.1rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-main);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

/* ================= PROJECTS CARDS GRID (Compact Fixed Layout with Project Icons) ================= */
.projects-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 330px));
  gap: 1.25rem;
  justify-content: start;
}

.project-card {
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
.project-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}
.project-card.card-dragging {
  opacity: 0.5;
  border: 2px dashed #7c3aed;
}

.project-top-bar {
  height: 4px;
  width: 100%;
}

.project-card-inner {
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  flex: 1;
}

.project-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.project-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid transparent;
}
.project-custom-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.project-header-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.35rem;
}

.project-badge-tag {
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

.project-status-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  white-space: nowrap !important;
}
.project-status-chip.active {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}
.project-status-chip.inactive {
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
.project-status-chip.active .status-dot {
  background: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.25);
}
.project-status-chip.inactive .status-dot {
  background: #9ca3af;
}

/* Titles */
.project-titles-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.project-client-name {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--text-muted);
}

.project-slug-tag {
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

.project-card-title {
  font-size: 1.15rem;
  font-weight: 900;
  color: var(--text-main);
  margin: 0;
  line-height: 1.25;
}

.project-card-sub {
  font-size: 0.82rem;
  font-weight: 700;
}

.project-meta-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.74rem;
  color: var(--text-muted);
  font-weight: 600;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.project-card-desc {
  font-size: 0.82rem;
  line-height: 1.55;
  color: var(--text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

/* Categories & Tags */
.project-cats-tags-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.project-cats-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.cat-pill {
  font-size: 0.68rem;
  font-weight: 700;
  background: rgba(124, 58, 237, 0.08);
  color: #7c3aed;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  border: 1px solid rgba(124, 58, 237, 0.16);
}

.project-tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  align-items: center;
}

.project-tag-chip {
  font-size: 0.68rem;
  font-weight: 600;
  background: var(--bg-main);
  color: var(--text-muted);
  border: 1px solid var(--border-color);
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
}

.project-tag-more {
  font-size: 0.65rem;
  font-weight: 700;
  color: #7c3aed;
  background: rgba(124, 58, 237, 0.06);
  padding: 0.15rem 0.4rem;
  border-radius: 6px;
  cursor: help;
}

/* Channels Badges */
.channels-badges-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  padding-top: 0.35rem;
  border-top: 1px dashed var(--border-color);
}

.channel-chip {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
  border: 1px solid transparent;
}
.channel-chip.web {
  background: rgba(59, 130, 246, 0.08);
  color: #2563eb;
  border-color: rgba(59, 130, 246, 0.2);
}
.channel-chip.mobile {
  background: rgba(16, 185, 129, 0.08);
  color: #10b981;
  border-color: rgba(16, 185, 129, 0.2);
}
.channel-chip.social {
  background: rgba(236, 72, 153, 0.08);
  color: #db2777;
  border-color: rgba(236, 72, 153, 0.2);
}
.channel-chip.branding {
  background: rgba(245, 158, 11, 0.08);
  color: #d97706;
  border-color: rgba(245, 158, 11, 0.2);
}

/* Card Footer */
.project-card-footer {
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

.project-action-btns {
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

.spinner-mini {
  width: 22px;
  height: 22px;
  border: 2.5px solid rgba(124, 58, 237, 0.2);
  border-top-color: #7c3aed;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.btn-reset-filters {
  margin-top: 0.5rem;
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  padding: 0.4rem 0.9rem;
  border-radius: 8px;
  font-size: 0.8rem;
  color: #7c3aed;
  cursor: pointer;
}

/* ================= MODAL STYLES ================= */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 5, 20, 0.65);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  z-index: 100;
}

.modal-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  width: 100%;
  max-width: 820px;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
  overflow: hidden;
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--table-header-bg);
}

.modal-title-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.modal-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--text-main);
}

.modal-subtitle {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.close-btn {
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  width: 32px;
  height: 32px;
  border-radius: 8px;
  font-size: 0.9rem;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.close-btn:hover { color: #ef4444; border-color: #ef4444; }

.modal-form {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

/* Tabs Bar */
.form-tabs-bar {
  display: flex;
  align-items: stretch;
  width: 100%;
  gap: 0.35rem;
  padding: 0.5rem 0.75rem;
  background: var(--table-header-bg);
  border-bottom: 1px solid var(--border-color);
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
  padding: 0.6rem 0.4rem;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-muted);
  font-weight: 800;
  font-size: 0.78rem;
  border-radius: 10px;
  cursor: pointer;
  white-space: nowrap;
  text-align: center;
  transition: all 0.2s ease;
}
.tab-btn .tab-num {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.08);
  font-size: 0.68rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tab-btn:hover {
  background: rgba(124, 58, 237, 0.05);
  color: var(--text-main);
}
.tab-btn.active {
  background: var(--bg-card);
  color: #7c3aed;
  border-color: rgba(124, 58, 237, 0.25);
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.1);
}
.tab-btn.active .tab-num {
  background: #7c3aed;
  color: #fff;
}

@media (max-width: 820px) {
  .form-tabs-bar {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 480px) {
  .form-tabs-bar {
    grid-template-columns: repeat(2, 1fr);
  }
}

.modal-body-content {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
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
  background: rgba(124, 58, 237, 0.06);
  border: 1px solid rgba(124, 58, 237, 0.15);
  padding: 0.75rem 1rem;
  border-radius: 12px;
  color: #7c3aed;
  font-size: 0.82rem;
  font-weight: 600;
  line-height: 1.4;
}

.form-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.label-with-meta, .label-with-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-main);
}

.form-input, .form-textarea {
  padding: 0.7rem 0.9rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--input-bg);
  color: var(--text-main);
  font-size: 0.85rem;
  transition: border-color 0.2s;
}
.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #7c3aed;
}

.multi-select-actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.btn-text-sm {
  background: transparent;
  border: none;
  color: #7c3aed;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
}
.btn-text-sm:hover { text-decoration: underline; }
.sep-dot { color: var(--text-muted); font-size: 0.7rem; }

/* Categories Selector Grid */
.categories-selector-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.65rem;
  background: var(--bg-main);
  padding: 0.85rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.cat-chip-card {
  display: flex;
  align-items: center;
  padding: 0.65rem 0.85rem;
  background: var(--bg-card);
  border: 1.5px solid var(--border-color);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.cat-chip-card:hover {
  border-color: #7c3aed;
}
.cat-chip-card.selected {
  border-color: #7c3aed;
  background: rgba(124, 58, 237, 0.08);
}

.hidden-checkbox, .hidden-file-input {
  display: none;
}

.cat-chip-content {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
}

.cat-check-box {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 1.5px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-main);
  flex-shrink: 0;
  color: #fff;
}
.cat-chip-card.selected .cat-check-box {
  background: #7c3aed;
  border-color: #7c3aed;
}

.cat-info {
  display: flex;
  flex-direction: column;
}
.cat-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-main);
}
.cat-slug-sub {
  font-size: 0.68rem;
  color: var(--text-muted);
}

/* Upload Dual Mode */
.upload-dual-mode {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.file-dropzone {
  border: 2px dashed var(--border-color);
  border-radius: 14px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  background: var(--bg-main);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}
.file-dropzone:hover {
  border-color: #7c3aed;
  background: rgba(124, 58, 237, 0.03);
}

.dropzone-icon {
  color: #7c3aed;
}
.dropzone-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-main);
}
.dropzone-hint {
  font-size: 0.74rem;
  color: var(--text-muted);
}

.or-divider {
  text-align: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  position: relative;
  margin: 0.2rem 0;
}

.image-preview-card {
  border: 1px solid var(--border-color);
  border-radius: 14px;
  overflow: hidden;
  background: var(--bg-card);
  margin-top: 0.5rem;
}

.preview-browser-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.45rem 0.85rem;
  background: var(--table-header-bg);
  border-bottom: 1px solid var(--border-color);
}
.browser-dots {
  display: flex;
  gap: 0.3rem;
}
.dot { width: 8px; height: 8px; border-radius: 50%; }
.dot-red { background: #ef4444; }
.dot-yellow { background: #f59e0b; }
.dot-green { background: #10b981; }
.browser-address { font-size: 0.72rem; color: var(--text-muted); }

.preview-img-wrap {
  max-height: 240px;
  overflow: hidden;
  background: #000;
}
.preview-img-wrap img {
  width: 100%;
  height: 240px;
  object-fit: cover;
}

.preview-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.85rem;
  background: var(--bg-main);
}

.btn-del-mini {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: none;
  padding: 0.3rem 0.65rem;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
}

/* Mobile App Styles */
.toggle-card-box {
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  padding: 0.85rem 1rem;
  border-radius: 12px;
}
.toggle-label-wrap {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  cursor: pointer;
}
.toggle-checkbox { display: none; }
.toggle-switch {
  width: 44px;
  height: 24px;
  background: #d1d5db;
  border-radius: 20px;
  position: relative;
  transition: background 0.2s;
  flex-shrink: 0;
}
.toggle-switch::after {
  content: '';
  position: absolute;
  top: 2px;
  right: 2px;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.2s;
}
.toggle-checkbox:checked + .toggle-switch {
  background: #7c3aed;
}
.toggle-checkbox:checked + .toggle-switch::after {
  transform: translateX(-20px);
}
.toggle-text-block { display: flex; flex-direction: column; }
.toggle-main-text { font-size: 0.85rem; font-weight: 700; color: var(--text-main); }
.toggle-sub-text { font-size: 0.74rem; color: var(--text-muted); }

.mobile-fields-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

.input-with-icon {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--input-bg);
  overflow: hidden;
}
.input-icon-pill {
  padding: 0 0.85rem;
  color: var(--text-muted);
}
.input-with-icon .form-input {
  border: none;
  flex: 1;
}

.mobile-preview-frame-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
}
.mobile-phone-frame {
  width: 170px;
  height: 320px;
  border: 8px solid #1e293b;
  border-radius: 28px;
  overflow: hidden;
  position: relative;
  background: #000;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}
.phone-notch {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 12px;
  background: #1e293b;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  z-index: 2;
}
.mobile-phone-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Gallery and Social Media Multi Upload */
.url-adder-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-top: 0.5rem;
}
.btn-add-url {
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  color: #7c3aed;
  padding: 0.7rem 1rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  white-space: nowrap;
}

.gallery-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
  margin-top: 0.75rem;
  background: var(--bg-main);
  padding: 0.85rem;
  border-radius: 12px;
}

.gallery-preview-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.gallery-card-thumb {
  position: relative;
  width: 100%;
  height: 100px;
}
.gallery-card-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-remove-thumb {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.9);
  color: #fff;
  border: none;
  font-size: 0.7rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gallery-caption-input {
  padding: 0.35rem 0.5rem;
  border: none;
  border-top: 1px solid var(--border-color);
  background: transparent;
  font-size: 0.72rem;
  color: var(--text-main);
}

.social-links-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}
.social-input-row {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--input-bg);
  overflow: hidden;
}
.social-icon {
  padding: 0.65rem 0.8rem;
  font-size: 0.75rem;
  font-weight: 700;
  min-width: 90px;
  background: var(--bg-main);
  border-left: 1px solid var(--border-color);
  color: var(--text-muted);
}
.social-input-row .form-input {
  border: none;
  flex: 1;
}

/* PDF Card */
.pdf-upload-card {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  background: var(--bg-main);
  padding: 1rem;
  border-radius: 14px;
  border: 1px solid var(--border-color);
}

.pdf-drop-area {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-card);
  border: 2px dashed rgba(245, 158, 11, 0.4);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.pdf-drop-area:hover {
  border-color: #d97706;
  background: rgba(245, 158, 11, 0.04);
}

.pdf-icon-circle {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(245, 158, 11, 0.15);
  color: #d97706;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pdf-text-info { display: flex; flex-direction: column; }
.pdf-title { font-size: 0.85rem; font-weight: 700; color: var(--text-main); }
.pdf-sub { font-size: 0.74rem; color: var(--text-muted); }

.or-divider-sm { font-size: 0.72rem; color: var(--text-muted); text-align: center; }

.active-pdf-badge-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-card);
  border: 1px solid rgba(245, 158, 11, 0.3);
  padding: 0.65rem 1rem;
  border-radius: 10px;
}
.pdf-badge-meta { display: flex; align-items: center; gap: 0.65rem; }
.pdf-tag {
  background: #d97706;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 900;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
}
.pdf-meta-texts { display: flex; flex-direction: column; }
.pdf-name { font-size: 0.82rem; font-weight: 700; color: var(--text-main); }
.pdf-url-text { font-size: 0.68rem; color: var(--text-muted); }
.pdf-card-actions { display: flex; align-items: center; gap: 0.5rem; }
.btn-pdf-view {
  font-size: 0.75rem;
  font-weight: 700;
  color: #d97706;
  text-decoration: none;
  background: rgba(245, 158, 11, 0.1);
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
}

/* Color Picker */
.color-picker-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.color-picker-input {
  width: 44px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  cursor: pointer;
}

/* Stats dynamic list */
.stats-dynamic-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.stat-row-card {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.stat-val-input { width: 140px; }
.btn-remove-stat {
  width: 32px;
  height: 38px;
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: #ef4444;
  cursor: pointer;
}
.btn-add-stat {
  background: transparent;
  border: none;
  color: #7c3aed;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
}

.checkbox-row-card {
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  padding: 0.85rem 1rem;
  border-radius: 12px;
}
.toggle-switch-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}
.toggle-info { display: flex; flex-direction: column; }
.toggle-text-bold { font-size: 0.85rem; font-weight: 700; color: var(--text-main); }
.toggle-sub { font-size: 0.74rem; color: var(--text-muted); }

/* Modal Footer */
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 1.5rem;
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
.btn-nav-step:hover {
  border-color: #7c3aed;
}
.btn-nav-next {
  background: rgba(124, 58, 237, 0.1);
  color: #7c3aed;
  border-color: rgba(124, 58, 237, 0.2);
}
.btn-nav-next:hover {
  background: rgba(124, 58, 237, 0.18);
}

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
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.5rem;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #4f008c, #7c3aed);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);
}

/* ================= QUICK PREVIEW MODAL ================= */
.modal-preview-card {
  max-width: 780px;
}

.preview-hero-header {
  padding: 2rem;
  color: #fff;
  position: relative;
}
.preview-close-btn {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(0,0,0,0.3);
  border: none;
  color: #fff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.9rem;
}

.preview-hero-content {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.preview-client-badge {
  font-size: 0.8rem;
  font-weight: 700;
  color: #ffc700;
  text-transform: uppercase;
}
.preview-hero-title {
  font-size: 1.8rem;
  font-weight: 900;
  margin: 0;
}
.preview-hero-sub {
  font-size: 0.9rem;
  opacity: 0.85;
}
.preview-meta-chips {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.preview-chip {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}
.status-chip.active { background: #10b981; }
.status-chip.inactive { background: #ef4444; }

.preview-body {
  padding: 1.5rem;
  overflow-y: auto;
  max-height: 60vh;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.preview-section {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}
.preview-sec-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.preview-sec-title {
  font-size: 1rem;
  font-weight: 800;
  color: var(--text-main);
  border-bottom: 2px solid rgba(124, 58, 237, 0.1);
  padding-bottom: 0.35rem;
}
.preview-desc-text {
  font-size: 0.88rem;
  line-height: 1.7;
  color: var(--text-main);
}
.btn-live-link {
  font-size: 0.8rem;
  font-weight: 700;
  color: #2563eb;
  text-decoration: none;
  background: rgba(37, 99, 235, 0.1);
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
}
.preview-media-box {
  border-radius: 12px;
  overflow: hidden;
  max-height: 280px;
  border: 1px solid var(--border-color);
}
.preview-media-box img { width: 100%; height: 100%; object-fit: cover; }

.preview-store-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.store-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  text-decoration: none;
  background: #1e293b;
  color: #fff;
}
.preview-mobile-box {
  max-width: 180px;
  margin: 0.5rem auto;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}
.preview-mobile-box img { width: 100%; display: block; }

.preview-social-links-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.social-chip-link {
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  text-decoration: none;
  background: var(--bg-main);
  color: var(--text-main);
  border: 1px solid var(--border-color);
}
.preview-gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 0.65rem;
}
.preview-gallery-item {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  background: var(--bg-main);
  display: flex;
  flex-direction: column;
}
.preview-gallery-item img {
  width: 100%;
  height: 90px;
  object-fit: cover;
}
.preview-gallery-caption {
  font-size: 0.7rem;
  padding: 0.3rem 0.45rem;
  color: var(--text-muted);
  text-align: center;
}

.preview-pdf-download-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.25);
  padding: 0.85rem 1.1rem;
  border-radius: 12px;
}
.pdf-icon-big { font-size: 1.5rem; }
.pdf-info-texts { display: flex; flex-direction: column; }
.pdf-title-text { font-size: 0.85rem; font-weight: 700; color: var(--text-main); }
.pdf-sub-text { font-size: 0.74rem; color: var(--text-muted); }
.btn-download-pdf {
  background: #d97706;
  color: #fff;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
}

.preview-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
}
.preview-stat-card {
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  padding: 0.85rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
}
.preview-stat-val { font-size: 1.3rem; font-weight: 900; color: #7c3aed; font-family: 'Outfit', sans-serif; }
.preview-stat-lbl { font-size: 0.75rem; color: var(--text-muted); }

.preview-footer-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
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

/* Badge, Tags & Deliverables styles */
.project-badge-tag {
  display: inline-block;
  padding: 0.15rem 0.45rem;
  font-size: 0.68rem;
  font-weight: 700;
  color: #7c3aed;
  background: rgba(124, 58, 237, 0.12);
  border: 1px solid rgba(124, 58, 237, 0.25);
  border-radius: 6px;
  margin-right: 0.4rem;
}

.project-sub-meta {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.project-table-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: 0.25rem;
}

.table-tag-chip {
  font-size: 0.65rem;
  color: var(--text-muted);
  background: var(--bg-main);
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

.preview-hero-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
}

.preview-hero-badges-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.preview-project-badge {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.4);
  font-size: 0.72rem;
  font-weight: 800;
  padding: 0.2rem 0.65rem;
  border-radius: 20px;
}

.preview-tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin: 0.4rem 0 0.6rem 0;
}

.preview-tag-chip {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  font-size: 0.72rem;
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
  backdrop-filter: blur(4px);
}

.preview-brand-logo-card {
  background: #ffffff;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  max-width: 140px;
  flex-shrink: 0;
}

.preview-brand-logo-card img {
  max-height: 48px;
  max-width: 110px;
  object-fit: contain;
}

.logo-caption {
  font-size: 0.62rem;
  color: #64748b;
  font-weight: 600;
  text-align: center;
}

.preview-deliverables-wrap {
  background: rgba(124, 58, 237, 0.04);
  border: 1px solid rgba(124, 58, 237, 0.15);
  border-radius: 12px;
  padding: 1rem;
}

.deliverables-heading {
  display: block;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.6rem;
}

.preview-deliverables-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.preview-deliverable-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: var(--card-bg);
  border: 1px solid rgba(124, 58, 237, 0.25);
  color: #7c3aed;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.03);
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
