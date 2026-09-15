<template>
  <div class="solutions-page" dir="rtl">
    <!-- Header -->
    <div class="page-header">
      <div class="header-titles">
        <h1 class="page-title">دليل الحلول والخدمات (Digital Solutions)</h1>
        <p class="page-subtitle">إدارة حلول Be Kite التخصصية — الحلول التقنية والبرمجية، التسويق الرقمي، والإنتاج الإبداعي</p>
      </div>
      <button class="btn-add" @click="openAddModal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        إضافة حل تخصصي جديد
      </button>
    </div>

    <!-- Category Filter Tabs -->
    <div class="category-tabs">
      <button
        class="cat-tab-btn"
        :class="{ active: selectedCategory === '' }"
        @click="selectedCategory = ''"
      >
        كافة الحلول ({{ solutions.length }})
      </button>
      <button
        class="cat-tab-btn"
        :class="{ active: selectedCategory === 'technology' }"
        @click="selectedCategory = 'technology'"
      >
        الحلول التقنية و ERP ({{ techCount }})
      </button>
      <button
        class="cat-tab-btn"
        :class="{ active: selectedCategory === 'marketing' }"
        @click="selectedCategory = 'marketing'"
      >
        التسويق ونمو العلامات ({{ marketingCount }})
      </button>
      <button
        class="cat-tab-btn"
        :class="{ active: selectedCategory === 'creative' }"
        @click="selectedCategory = 'creative'"
      >
        الإنتاج الإبداعي والمرئي ({{ creativeCount }})
      </button>
    </div>

    <!-- Search & Status Filter -->
    <div class="filters-row">
      <div class="search-box">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input type="text" v-model="searchQuery" placeholder="البحث في الحلول، التقنيات، أو الميزات..." class="search-input" />
      </div>

      <div class="filter-dropdown">
        <select v-model="selectedStatus" class="filter-select">
          <option value="">جميع الحالات</option>
          <option value="1">مفعل (Active)</option>
          <option value="0">غير مفعل (Inactive)</option>
        </select>
      </div>
    </div>

    <!-- Solutions Grid -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>جاري تحميل الحلول التخصصية...</p>
    </div>

    <div v-else-if="filteredSolutions.length === 0" class="empty-state">
      <p>لا توجد حلول مطابقة للبحث المحدد</p>
    </div>

    <div v-else class="solutions-grid">
      <div
        v-for="sol in filteredSolutions"
        :key="sol.id"
        class="solution-card"
        :class="{ 'card-inactive': !sol.is_active }"
      >
        <div class="sol-top">
          <div class="sol-icon-box" :class="'cat-' + sol.category">
            <img
              v-if="sol.icon_image"
              :src="sol.icon_image"
              class="sol-custom-icon"
              alt="Icon"
            />
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <g v-if="sol.icon_name === 'Code'">
                <path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>
              </g>
              <g v-else-if="sol.icon_name === 'Smartphone'">
                <path d="M12 18h.01M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
              </g>
              <g v-else-if="sol.icon_name === 'Database'">
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5M3 12c0 1.66 4 3 9 3s9-1.34 9-3M3 5c0 1.66 4 3 9 3s9-1.34 9-3s-4-3-9-3s-9 1.34-9 3"/>
              </g>
              <g v-else-if="sol.icon_name === 'Cloud'">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
              </g>
              <g v-else-if="sol.icon_name === 'Palette'">
                <path d="M12 2C6.5 2 2 6.5 2 12c0 3.6 2.4 6.6 5.7 7.6.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.4-3.4-1.4-.4-1.1-1-1.4-1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.3-1.1.6-1.4-2.2-.2-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1 .8-.2 1.7-.3 2.5-.3s1.7.1 2.5.3c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.8-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5C19.6 18.6 22 15.6 22 12c0-5.5-4.5-10-10-10z"/>
              </g>
              <g v-else-if="sol.icon_name === 'TrendingUp'">
                <path d="M23 6l-9.5 9.5-5-5L1 18M17 6h6v6"/>
              </g>
              <g v-else-if="sol.icon_name === 'Camera'">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </g>
              <g v-else>
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </g>
            </svg>
          </div>
          <div class="sol-badge-wrap">
            <span class="sol-badge">{{ sol.badge || sol.category }}</span>
          </div>
        </div>

        <div class="sol-body">
          <h3 class="sol-title">{{ sol.title }}</h3>
          <p class="sol-desc">{{ sol.description }}</p>

          <!-- Tech Stack Tags -->
          <div class="tech-stack-wrap">
            <span v-for="tech in sol.technologies" :key="tech" class="tech-tag">{{ tech }}</span>
          </div>

          <!-- Capabilities Highlights -->
          <div v-if="sol.capabilities && sol.capabilities.length" class="capabilities-list">
            <div v-for="(cap, cIdx) in sol.capabilities.slice(0, 2)" :key="cIdx" class="cap-item">
              <span class="cap-check">✓</span>
              <span class="cap-text">{{ cap.title }}</span>
            </div>
          </div>
        </div>

        <div class="sol-footer">
          <button
            class="status-btn"
            :class="sol.is_active ? 'active' : 'inactive'"
            @click="toggleSolutionStatus(sol)"
          >
            {{ sol.is_active ? 'مفعل على الموقع' : 'معطل' }}
          </button>

          <div class="sol-actions">
            <button class="action-btn preview-btn" @click="openPreviewModal(sol)" title="معاينة تفاصيل ودراسة الحل">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
            <button class="action-btn edit-btn" @click="openEditModal(sol)" title="تعديل">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="action-btn delete-btn" @click="confirmDelete(sol)" title="حذف">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= ADD / EDIT SOLUTION MODAL ================= -->
    <div v-if="modalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-card modal-edit-solution">
        <div class="modal-header">
          <h2 class="modal-title">{{ isEdit ? 'تعديل بيانات ودراسة الحل التخصصي' : 'إضافة حل تخصصي ودراسة حالة جديدة' }}</h2>
          <button class="close-btn" @click="closeModal">✕</button>
        </div>

        <!-- 5 Tabs Navigation Header -->
        <div class="modal-tabs-nav">
          <button
            type="button"
            class="tab-btn"
            :class="{ active: activeTab === 'general' }"
            @click="activeTab = 'general'"
          >
            📋 البيانات والواجهة
          </button>
          <button
            type="button"
            class="tab-btn"
            :class="{ active: activeTab === 'problem' }"
            @click="activeTab = 'problem'"
          >
            ⚠️ تحديات الأعمال (Problem)
          </button>
          <button
            type="button"
            class="tab-btn"
            :class="{ active: activeTab === 'solve' }"
            @click="activeTab = 'solve'"
          >
            💡 الحل المبتكر (Solve)
          </button>
          <button
            type="button"
            class="tab-btn"
            :class="{ active: activeTab === 'deliver' }"
            @click="activeTab = 'deliver'"
          >
            📦 نطاق التسليم (Deliver)
          </button>
          <button
            type="button"
            class="tab-btn"
            :class="{ active: activeTab === 'process_why' }"
            @click="activeTab = 'process_why'"
          >
            🔄 مسار العمل ولماذا Be Kite
          </button>
        </div>

        <form @submit.prevent="saveSolution" class="modal-form-wrap">
          <div class="modal-tab-content-scroll">
            
            <!-- ================= TAB 1: General Info ================= -->
            <div v-show="activeTab === 'general'" class="tab-pane">
              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label">عنوان الحل (بالعربية) *</label>
                  <input type="text" v-model="formData.title" class="form-input" required placeholder="مثال: تصميم وتطوير المواقع والمنصات" />
                </div>
                <div class="form-group">
                  <label class="form-label">عنوان الحل (English) *</label>
                  <input type="text" v-model="formData.title_en" class="form-input ltr-text" required placeholder="e.g. Web Design & Development" />
                </div>
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label">العنوان البارز الملون (Headline Highlight Ar)</label>
                  <input type="text" v-model="formData.title_highlight" class="form-input" placeholder="والمنصات الرقمية المتطورة" />
                </div>
                <div class="form-group">
                  <label class="form-label">Headline Highlight (English)</label>
                  <input type="text" v-model="formData.title_highlight_en" class="form-input ltr-text" placeholder="Digital Platforms" />
                </div>
              </div>

              <div class="form-grid-3">
                <div class="form-group">
                  <label class="form-label">القطاع الرئيسي *</label>
                  <select v-model="formData.category" class="form-input" required>
                    <option value="technology">الحلول التقنية والبرمجية (Technology)</option>
                    <option value="marketing">التسويق ونمو العلامات (Marketing)</option>
                    <option value="creative">الإنتاج الإبداعي والمرئي (Creative)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">الرابط المخصص (Slug) *</label>
                  <input type="text" v-model="formData.slug" class="form-input ltr-text" required placeholder="web-development" />
                </div>
                <div class="form-group">
                  <label class="form-label">الشارة (Badge)</label>
                  <input type="text" v-model="formData.badge" class="form-input" placeholder="DEVELOPMENT" />
                </div>
              </div>

              <div class="form-grid-2">
                <div class="form-group icon-upload-form-group">
                  <div class="label-with-hint">
                    <label class="form-label">أيقونة الحل (رفع أيقونة)</label>
                    <span class="icon-format-tag">SVG / PNG / WebP</span>
                  </div>

                  <input
                    type="file"
                    ref="iconFileInput"
                    class="hidden-file-input"
                    accept="image/*,.svg"
                    @change="handleIconUpload"
                  />

                  <!-- Uploaded Icon Box -->
                  <div v-if="formData.icon_image" class="icon-uploaded-box">
                    <div class="icon-uploaded-preview-wrap" :class="'cat-' + formData.category">
                      <img :src="formData.icon_image" alt="Uploaded Icon" class="icon-uploaded-img" />
                    </div>
                    <div class="icon-uploaded-meta">
                      <span class="icon-uploaded-name">تم رفع الأيقونة بنجاح</span>
                      <div class="icon-uploaded-actions">
                        <button type="button" class="btn-icon-action change-btn" @click="triggerIconInput">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                          </svg>
                          <span>تغيير</span>
                        </button>
                        <button type="button" class="btn-icon-action remove-btn" @click="removeIcon">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                          <span>إزالة</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Empty Dropzone State -->
                  <div
                    v-else
                    class="icon-dropzone"
                    :class="{ 'is-dragover': isDraggingIcon }"
                    @click="triggerIconInput"
                    @dragover.prevent="isDraggingIcon = true"
                    @dragleave.prevent="isDraggingIcon = false"
                    @drop.prevent="handleIconDrop"
                  >
                    <div class="icon-dropzone-icon">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                    </div>
                    <div class="icon-dropzone-content">
                      <span class="icon-dropzone-title">انقر لرفع أيقونة أو اسحبها هنا</span>
                      <span class="icon-dropzone-hint">يدعم SVG أو PNG بخلفية شفافة (حتى 2MB)</span>
                    </div>
                  </div>

                  <div v-if="!formData.icon_image && formData.icon_name" class="icon-current-notice">
                    <span class="notice-dot"></span>
                    <span>الأيقونة الحالية: <strong>{{ formData.icon_name }}</strong> (ارفع ملفاً جديداً لاستبدالها)</span>
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">صورة الهيرو الاستعراضية (Hero Image URL)</label>
                  <input type="text" v-model="formData.hero_image" class="form-input ltr-text" placeholder="https://images.unsplash.com/photo-1547658719-da2b51169166?w=1200&q=80" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">الوصف والملخص</label>
                <textarea v-model="formData.description" class="form-textarea" rows="3" placeholder="نبذة عن القيمة المضافة للحل التقني..."></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">التقنيات المستخدمة (مفصولة بفواصل)</label>
                <input
                  type="text"
                  :value="formData.technologies?.join(', ')"
                  @input="formData.technologies = $event.target.value.split(',').map(s => s.trim())"
                  class="form-input ltr-text"
                  placeholder="React 18, Vue 3, Laravel 11, AWS, PostgreSQL"
                />
              </div>

              <div class="form-group checkbox-row">
                <label class="toggle-switch-label">
                  <input type="checkbox" v-model="formData.is_active" :true-value="1" :false-value="0" />
                  <span>تفعيل وإظهار هذا الحل في دليل الحلول بالموقع</span>
                </label>
              </div>
            </div>

            <!-- ================= TAB 2: The Business Problem ================= -->
            <div v-show="activeTab === 'problem'" class="tab-pane">
              <div class="section-notice">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span>قسم تحديات الأعمال ونقاط الألم (The Business Problem) — توضح للمؤسسات الأسباب الحقيقية التي تؤدي لفشل الحلول التقليدية.</span>
              </div>

              <div v-if="formData.problem_section" class="problem-editor">
                <div class="form-grid-3 mb-4">
                  <div class="form-group">
                    <label class="form-label">شارة القسم</label>
                    <input type="text" v-model="formData.problem_section.badge" class="form-input" placeholder="التحدي والمشكلة" />
                  </div>
                  <div class="form-group" style="grid-column: span 2;">
                    <label class="form-label">عنوان القسم الرئيسي</label>
                    <input type="text" v-model="formData.problem_section.title" class="form-input" placeholder="لماذا تفشل معظم المواقع والمنصات؟" />
                  </div>
                </div>

                <div class="form-group mb-4">
                  <label class="form-label">العنوان الفرعي للقسم</label>
                  <input type="text" v-model="formData.problem_section.subtitle" class="form-input" placeholder="معظم الشركات تعاني من مواقع بطيئة وصعبة التحديث..." />
                </div>

                <div class="challenge-cards-editor">
                  <div v-for="(item, pIdx) in formData.problem_section.items" :key="pIdx" class="challenge-edit-card">
                    <div class="card-edit-header">
                      <span class="card-num-badge">تحدي {{ pIdx + 1 }}</span>
                      <span class="warn-badge">⚠️ نقطة ألم</span>
                    </div>
                    <div class="form-group">
                      <label class="form-label">عنوان التحدي *</label>
                      <input type="text" v-model="item.title" class="form-input" placeholder="مثال: بطء التحميل وسوء تجربة المستخدم" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">شرح التحدي وتأثيره السلبي *</label>
                      <textarea v-model="item.description" class="form-textarea" rows="2" placeholder="شرح النتيجة السلبية على المبيعات والعملاء..."></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ================= TAB 3: How We Solve It ================= -->
            <div v-show="activeTab === 'solve'" class="tab-pane">
              <div class="section-notice">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span>قسم الحل المبتكر (How We Solve It) — يوضح طريقة Be Kite المتطورة لإعادة صياغة الحل مع الصورة الاستعراضية وزر الدعوة للعمل.</span>
              </div>

              <div v-if="formData.solve_section" class="solve-editor">
                <div class="form-grid-2">
                  <div class="form-group">
                    <label class="form-label">شارة القسم</label>
                    <input type="text" v-model="formData.solve_section.badge" class="form-input" placeholder="الحل المبتكر" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">عنوان القسم</label>
                    <input type="text" v-model="formData.solve_section.title" class="form-input" placeholder="كيف نعيد هندسة حضورك الرقمي؟" />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">العنوان الفرعي</label>
                  <input type="text" v-model="formData.solve_section.subtitle" class="form-input" placeholder="نهج شامل يجمع بين الفن البرمجي والأداء التجاري..." />
                </div>

                <div class="form-group">
                  <label class="form-label">الشرح التفصيلي للحل والقيمة المضافة</label>
                  <textarea v-model="formData.solve_section.description" class="form-textarea" rows="3" placeholder="نبني منصات ويب مخصصة بالكامل وفق أعلى المعايير..."></textarea>
                </div>

                <div class="form-grid-2">
                  <div class="form-group">
                    <label class="form-label">صورة الحل التوضيحية (Solve Image URL)</label>
                    <input type="text" v-model="formData.solve_section.image" class="form-input ltr-text" placeholder="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&q=80" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">نص زر الإجراء (CTA Text)</label>
                    <input type="text" v-model="formData.solve_section.ctaText" class="form-input" placeholder="ابدأ مشروعك الآن مع استشارة مجانية" />
                  </div>
                </div>
              </div>
            </div>

            <!-- ================= TAB 4: What We Deliver ================= -->
            <div v-show="activeTab === 'deliver'" class="tab-pane">
              <div class="section-notice">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span>مخرجات ونطاق التسليم (What We Deliver) — بطاقات المخرجات الستة المحددة التي يستلمها العميل بدقة.</span>
              </div>

              <div v-if="formData.deliver_section" class="deliver-editor">
                <div class="form-grid-2 mb-4">
                  <div class="form-group">
                    <label class="form-label">عنوان القسم</label>
                    <input type="text" v-model="formData.deliver_section.title" class="form-input" placeholder="ما ستحصل عليه بدقة واحترافية" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">العنوان الفرعي</label>
                    <input type="text" v-model="formData.deliver_section.subtitle" class="form-input" placeholder="مخرجات متكاملة تضمن لك التفوق الرقمي..." />
                  </div>
                </div>

                <div class="deliver-cards-editor">
                  <div v-for="(item, dIdx) in formData.deliver_section.items" :key="dIdx" class="deliver-edit-card">
                    <div class="card-edit-header">
                      <span class="card-num-badge">مخرج {{ dIdx + 1 }}</span>
                      <span class="check-badge">✓ تسليم مؤكد</span>
                    </div>
                    <div class="form-group">
                      <label class="form-label">عنوان المخرج *</label>
                      <input type="text" v-model="item.title" class="form-input" placeholder="مثال: تصميم واجهات مخصص (UI/UX)" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">تفاصيل التسليم *</label>
                      <textarea v-model="item.description" class="form-textarea" rows="2" placeholder="تصاميم فريدة تعكس هوية علامتك وتضمن أعلى معدلات تحويل..."></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ================= TAB 5: Process & Why Be Kite ================= -->
            <div v-show="activeTab === 'process_why'" class="tab-pane">
              <!-- Execution Process (5 Steps) -->
              <div class="sub-card-section mb-4">
                <div class="sub-card-header">
                  <span class="sub-card-title">🔄 منهجية التنفيذ (Proven Execution Framework - 5 Steps)</span>
                </div>
                <div v-if="formData.process_section" class="process-steps-editor">
                  <div v-for="(step, sIdx) in formData.process_section.steps" :key="sIdx" class="step-edit-card">
                    <div class="step-badge-num">{{ step.number || ('0' + (sIdx + 1)) }}</div>
                    <div class="form-group">
                      <label class="form-label">اسم المرحلة *</label>
                      <input type="text" v-model="step.title" class="form-input" placeholder="مثال: الاكتشاف والتخطيط" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">شرح المرحلة ومخرجاتها *</label>
                      <textarea v-model="step.description" class="form-textarea" rows="2" placeholder="تحليل أهداف المشروع ودراسة المنافسين..."></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Why Be Kite (4 Cards) -->
              <div class="sub-card-section">
                <div class="sub-card-header">
                  <span class="sub-card-title">⭐ لماذا تختار BE KITE؟ (Why Choose Us - 4 Reasons)</span>
                </div>
                <div v-if="formData.why_section" class="why-cards-editor">
                  <div v-for="(why, wIdx) in formData.why_section.items" :key="wIdx" class="why-edit-card">
                    <div class="form-group">
                      <label class="form-label">السبب {{ wIdx + 1 }} - العنوان *</label>
                      <input type="text" v-model="why.title" class="form-input" placeholder="مثال: فريق هندسي نخبوي" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">الشرح والتفاصيل *</label>
                      <textarea v-model="why.description" class="form-textarea" rows="2" placeholder="مهندسون ومصممون ذوو خبرات عميقة..."></textarea>
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
                <span>الخطوة السابقة</span>
              </button>
              <button
                v-if="activeTab !== 'process_why'"
                type="button"
                class="btn-nav-step btn-nav-next"
                @click="goToNextTab"
              >
                <span>الخطوة التالية</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                </svg>
              </button>
            </div>

            <div class="modal-footer-actions">
              <button type="button" class="btn-cancel" @click="closeModal">إلغاء</button>
              <button type="submit" class="btn-save" :disabled="saving">
                <span v-if="saving" class="spinner-mini"></span>
                <span>{{ saving ? 'جاري الحفظ...' : (isEdit ? 'تحديث الحل البرمجي' : 'حفظ ونشر الحل') }}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- ================= SOLUTION PREVIEW MODAL (1:1 WITH BEKITE WEBSITE) ================= -->
    <div v-if="previewModalOpen && previewSolution" class="modal-overlay" @click.self="previewModalOpen = false">
      <div class="modal-card modal-preview-card modal-preview-solution">
        <!-- 1. Hero Header Section -->
        <div class="preview-hero-header" style="background: linear-gradient(135deg, #4f008c, #150522);">
          <button class="preview-close-btn" @click="previewModalOpen = false">✕</button>
          
          <div class="preview-hero-content">
            <div class="preview-hero-top-row">
              <span class="preview-client-badge">{{ previewSolution.badge || 'DIGITAL SOLUTION' }}</span>
              <div v-if="previewSolution.icon_image" class="preview-hero-icon-pill">
                <img :src="previewSolution.icon_image" alt="icon" class="preview-hero-icon-img" />
              </div>
            </div>
            <h2 class="preview-hero-title">{{ previewSolution.title }}</h2>
            <h3 v-if="previewSolution.title_highlight" class="preview-highlight-headline">
              {{ previewSolution.title_highlight }}
            </h3>
            <p v-if="previewSolution.description" class="preview-hero-desc">{{ previewSolution.description }}</p>
            
            <div class="preview-meta-chips">
              <span v-for="tech in (previewSolution.technologies || [])" :key="tech" class="preview-tech-chip">
                {{ tech }}
              </span>
              <span class="preview-chip status-chip" :class="previewSolution.is_active ? 'active' : 'inactive'">
                {{ previewSolution.is_active ? 'حل مفعل ونشط' : 'معطل' }}
              </span>
            </div>
          </div>

          <div v-if="previewSolution.hero_image" class="preview-hero-mockup-wrap">
            <img :src="previewSolution.hero_image" :alt="previewSolution.title" @error="onImgError" />
          </div>
        </div>

        <div class="preview-body">
          <!-- 1. The Business Problem (التحديات ونقاط الألم) -->
          <div v-if="previewSolution.problem_section?.items?.length" class="preview-section">
            <div class="section-pill-tag red-pill">{{ previewSolution.problem_section.badge || 'التحدي والمشكلة' }}</div>
            <h3 class="preview-sec-title">{{ previewSolution.problem_section.title || 'لماذا تفشل الحلول التقليدية؟' }}</h3>
            <p v-if="previewSolution.problem_section.subtitle" class="preview-sec-sub">{{ previewSolution.problem_section.subtitle }}</p>

            <div class="preview-problem-grid">
              <div v-for="(prob, pIdx) in previewSolution.problem_section.items" :key="pIdx" class="problem-card">
                <div class="problem-warn-icon">⚠️</div>
                <h4 class="problem-card-title">{{ prob.title }}</h4>
                <p class="problem-card-desc">{{ prob.description }}</p>
              </div>
            </div>
          </div>

          <!-- 2. How We Solve It (كيف نعيد صياغة الحل) -->
          <div v-if="previewSolution.solve_section" class="preview-section solve-preview-section">
            <div class="section-pill-tag">{{ previewSolution.solve_section.badge || 'الحل المبتكر' }}</div>
            <h3 class="preview-sec-title">{{ previewSolution.solve_section.title || 'كيف نعيد صياغة الحل؟' }}</h3>
            <p v-if="previewSolution.solve_section.subtitle" class="preview-sec-sub">{{ previewSolution.solve_section.subtitle }}</p>

            <div class="solve-content-box">
              <div class="solve-text-col">
                <p class="solve-desc-text">{{ previewSolution.solve_section.description }}</p>
                <div v-if="previewSolution.solve_section.ctaText" class="solve-cta-badge">
                  🚀 {{ previewSolution.solve_section.ctaText }}
                </div>
              </div>
              <div v-if="previewSolution.solve_section.image" class="solve-image-col">
                <img :src="previewSolution.solve_section.image" alt="How We Solve It" @error="onImgError" />
              </div>
            </div>
          </div>

          <!-- 3. What We Deliver (ما ستحصل عليه / نطاق التسليم) -->
          <div v-if="previewSolution.deliver_section?.items?.length" class="preview-section">
            <div class="section-pill-tag">{{ previewSolution.deliver_section.badge || 'المخرجات ونطاق التسليم' }}</div>
            <h3 class="preview-sec-title">{{ previewSolution.deliver_section.title || 'ما ستحصل عليه بدقة واحترافية' }}</h3>
            <p v-if="previewSolution.deliver_section.subtitle" class="preview-sec-sub">{{ previewSolution.deliver_section.subtitle }}</p>

            <div class="preview-deliver-grid">
              <div v-for="(del, dIdx) in previewSolution.deliver_section.items" :key="dIdx" class="deliver-card">
                <div class="deliver-check-badge">✓</div>
                <h4 class="deliver-card-title">{{ del.title }}</h4>
                <p class="deliver-card-desc">{{ del.description }}</p>
              </div>
            </div>
          </div>

          <!-- 4. Execution Process (منهجية العمل) -->
          <div v-if="previewSolution.process_section?.steps?.length" class="preview-section">
            <div class="section-pill-tag">{{ previewSolution.process_section.badge || 'منهجية التنفيذ' }}</div>
            <h3 class="preview-sec-title">{{ previewSolution.process_section.title || 'مسار عمل هندسي دقيق من 5 مراحل' }}</h3>
            <p v-if="previewSolution.process_section.subtitle" class="preview-sec-sub">{{ previewSolution.process_section.subtitle }}</p>

            <div class="preview-process-steps">
              <div v-for="(step, sIdx) in previewSolution.process_section.steps" :key="sIdx" class="process-step-item">
                <div class="step-circle">{{ step.number || (sIdx + 1) }}</div>
                <div class="step-content">
                  <h4 class="step-item-title">{{ step.title }}</h4>
                  <p class="step-item-desc">{{ step.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 5. Why Be Kite (لماذا Be Kite) -->
          <div v-if="previewSolution.why_section?.items?.length" class="preview-section">
            <div class="section-pill-tag">{{ previewSolution.why_section.badge || 'لماذا BE KITE' }}</div>
            <h3 class="preview-sec-title">{{ previewSolution.why_section.title || 'لماذا تختار شراكتنا؟' }}</h3>

            <div class="preview-why-grid">
              <div v-for="(why, wIdx) in previewSolution.why_section.items" :key="wIdx" class="solution-why-card">
                <h4 class="sol-why-title">⭐ {{ why.title }}</h4>
                <p class="sol-why-desc">{{ why.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="preview-footer-bar">
          <button type="button" class="btn-cancel" @click="previewModalOpen = false">إغلاق</button>
          <button type="button" class="btn-edit-from-preview" @click="editFromPreview(previewSolution)">تعديل بيانات الحل ✎</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { SolutionService } from '../services/SolutionService';
import { useToast } from '../composables/useToast';

const { success, error: toastError } = useToast();

const loading = ref(true);
const saving = ref(false);
const solutions = ref([]);
const searchQuery = ref('');
const selectedCategory = ref('');
const selectedStatus = ref('');

const modalOpen = ref(false);
const isEdit = ref(false);
const currentEditId = ref(null);
const activeTab = ref('general');

// Preview Modal State
const previewModalOpen = ref(false);
const previewSolution = ref(null);

const tabList = ['general', 'problem', 'solve', 'deliver', 'process_why'];

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

function onImgError(e) {
  e.target.src = 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=1200&q=80';
}

const defaultSolutionForm = () => ({
  title: 'تصميم وتطوير المواقع والمنصات',
  title_en: 'Web Design & Development',
  title_highlight: 'والمنصات الرقمية المتطورة',
  title_highlight_en: 'Digital Platforms',
  slug: 'web-development',
  category: 'technology',
  badge: 'DEVELOPMENT',
  icon_name: 'Code',
  icon_image: '',
  hero_image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=1200&q=80',
  description: 'نطور مواقع وتطبيقات ويب استثنائية تجمع بين التصميم المبتكر والأداء الفائق وأعلى معايير الأمان.',
  technologies: ['React 18', 'Vue 3', 'TailwindCSS', 'Node.js', 'PostgreSQL'],
  is_active: 1,

  problem_section: {
    badge: 'التحدي والمشكلة',
    title: 'لماذا تفشل معظم المواقع والمنصات؟',
    subtitle: 'معظم الشركات تعاني من مواقع بطيئة، صعبة التحديث، ولا تحقق أي مبيعات أو تحويلات فعلية.',
    items: [
      { title: 'بطء التحميل وسوء تجربة المستخدم', description: 'كل ثانية تأخير في تحميل الموقع تفقدك ما يصل إلى 20% من عملائك المحتملين.' },
      { title: 'تصاميم قوالب مكررة وغير احترافية', description: 'المواقع المبنية على قوالب جاهزة تفتقر للهوية المميزة وتفقد ثقة العملاء المؤسسيين.' },
      { title: 'صعوبة التوسع والأمان الهش', description: 'البنى التحتية الضعيفة تنهار عند زيادة الزيارات وتكون عرضة للاختراقات المتكررة.' },
      { title: 'غياب التحسين لمحركات البحث (SEO)', description: 'موقع غير مهيأ تقنياً لمحركات البحث يعني عدم ظهورك أمام العملاء الذين يبحثون عنك.' }
    ]
  },

  solve_section: {
    badge: 'الحل المبتكر',
    title: 'كيف نعيد هندسة حضورك الرقمي؟',
    subtitle: 'نهج شامل يجمع بين الفن البرمجي والأداء التجاري القابل للتوسع.',
    description: 'نبني منصات ويب مخصصة بالكامل وفق أعلى المعايير العالمية، مع التركيز على سرعة استجابة فائقة، تجربة مستخدم سلسة، وتهيئة متكاملة لمحركات البحث لضمان تحقيق أعلى عوائد استثمار.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&q=80',
    ctaText: 'ابدأ مشروعك الآن مع استشارة مجانية'
  },

  deliver_section: {
    badge: 'المخرجات ونطاق التسليم',
    title: 'ما ستحصل عليه بدقة واحترافية',
    subtitle: 'مخرجات متكاملة تضمن لك التفوق الرقمي والاستقرار التام.',
    items: [
      { title: 'تصميم واجهات مخصص (UI/UX)', description: 'تصاميم فريدة تعكس هوية علامتك وتضمن أعلى معدلات تحويل.' },
      { title: 'أداء فائق وسرعة قياسية', description: 'درجات 95+ في تقييمات Google Core Web Vitals لضمان سرعة لحظية.' },
      { title: 'لوحة تحكم مخصصة لإدارة المحتوى', description: 'إدارة كاملة لمنتجاتك ومحتواك بسهولة تامة وبدون تعقيد تقني.' },
      { title: 'تكامل كامل مع بوابات الدفع وERP', description: 'ربط سلس مع أنظمة الفواتير، بوابات الدفع، وإدارة المخزون.' },
      { title: 'تهيئة متقدمة لمحركات البحث (SEO)', description: 'بنية تقنية متوافقة مع أحدث معايير Google لضمان الصدارة.' },
      { title: 'استضافة سحابية وأمان مشدد', description: 'حماية SSL وشهادات حماية متقدمة مع نسخ احتياطي آلي يومي.' }
    ]
  },

  process_section: {
    badge: 'منهجية التنفيذ',
    title: 'مسار عمل هندسي دقيق من 5 مراحل',
    subtitle: 'من الفكرة حتى الإطلاق والنمو المستمر.',
    steps: [
      { number: '01', title: 'الاكتشاف والتخطيط', description: 'تحليل أهداف المشروع، دراسة المنافسين، وبناء المخطط الهيكلي.' },
      { number: '02', title: 'التصميم وتجربة المستخدم', description: 'تصميم النماذج التفاعلية (Figma Prototypes) واعتماد هوية الواجهات.' },
      { number: '03', title: 'التطوير البرمجي المتقدم', description: 'كتابة كود نظيف وقابل للتوسع باستخدام أحدث أطر العمل العالمية.' },
      { number: '04', title: 'فحص الجودة والأمان (QA)', description: 'اختبارات مكثفة للأداء والتوافق والأمان على مختلف الأجهزة.' },
      { number: '05', title: 'الإطلاق والدعم المستمر', description: 'نشر النظام على السحابة مع تدريب الفريق ودعم فني ممتد.' }
    ]
  },

  why_section: {
    badge: 'لماذا BE KITE',
    title: 'لماذا تختار شراكتنا؟',
    items: [
      { title: 'فريق هندسي نخبوي', description: 'مهندسون ومصممون ذوو خبرات عميقة في بناء المنصات المؤسسية الضخمة.' },
      { title: 'التزام صارم بالمواعيد والجودة', description: 'تسليم المشاريع في جداول زمنية محددة وفق معايير تسليم دولية.' },
      { title: 'كود نظيف وملكية كاملة', description: 'ملكية تامة بنسبة 100% للشفرة المصدرية وحقوق الملكية الفكرية.' },
      { title: 'شراكة استراتيجية مستمرة', description: 'لا نتوقف عند الإطلاق؛ بل نرافقك في التحديث والتطوير والنمو.' }
    ]
  }
});

const formData = ref(defaultSolutionForm());

// Custom Icon Upload Handling
const iconFileInput = ref(null);
const isDraggingIcon = ref(false);

const triggerIconInput = () => {
  iconFileInput.value?.click();
};

const processIconFile = (file) => {
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    toastError('حجم ملف الأيقونة يجب ألا يتجاوز 2 ميجابايت');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    formData.value.icon_image = e.target.result;
    formData.value.icon = e.target.result;
    success('تم رفع الأيقونة بنجاح');
  };
  reader.onerror = () => {
    toastError('تعذر قراءة ملف الأيقونة');
  };
  reader.readAsDataURL(file);
};

const handleIconUpload = (e) => {
  const file = e.target.files?.[0];
  processIconFile(file);
  e.target.value = '';
};

const handleIconDrop = (e) => {
  isDraggingIcon.value = false;
  const file = e.dataTransfer?.files?.[0];
  processIconFile(file);
};

const removeIcon = () => {
  formData.value.icon_image = '';
  if (iconFileInput.value) iconFileInput.value.value = '';
  success('تمت إزالة الأيقونة');
};

const openPreviewModal = (sol) => {
  previewSolution.value = JSON.parse(JSON.stringify(sol));
  const def = defaultSolutionForm();
  if (!previewSolution.value.icon_image) {
    previewSolution.value.icon_image = sol.icon_image || (sol.icon && (sol.icon.startsWith('data:') || sol.icon.startsWith('http') || sol.icon.startsWith('/')) ? sol.icon : '');
  }
  if (!previewSolution.value.problem_section) previewSolution.value.problem_section = def.problem_section;
  if (!previewSolution.value.solve_section) previewSolution.value.solve_section = def.solve_section;
  if (!previewSolution.value.deliver_section) previewSolution.value.deliver_section = def.deliver_section;
  if (!previewSolution.value.process_section) previewSolution.value.process_section = def.process_section;
  if (!previewSolution.value.why_section) previewSolution.value.why_section = def.why_section;
  previewModalOpen.value = true;
};

const editFromPreview = (sol) => {
  previewModalOpen.value = false;
  openEditModal(sol);
};

const openAddModal = () => {
  isEdit.value = false;
  currentEditId.value = null;
  activeTab.value = 'general';
  formData.value = defaultSolutionForm();
  if (iconFileInput.value) iconFileInput.value.value = '';
  modalOpen.value = true;
};

const openEditModal = (sol) => {
  isEdit.value = true;
  currentEditId.value = sol.id;
  activeTab.value = 'general';
  formData.value = JSON.parse(JSON.stringify(sol));
  
  const def = defaultSolutionForm();
  if (!formData.value.technologies) formData.value.technologies = [];
  if (!formData.value.title_highlight) formData.value.title_highlight = '';
  if (!formData.value.hero_image) formData.value.hero_image = def.hero_image;
  if (!formData.value.icon_image) {
    formData.value.icon_image = sol.icon_image || (sol.icon && (sol.icon.startsWith('data:') || sol.icon.startsWith('http') || sol.icon.startsWith('/')) ? sol.icon : '');
  }
  if (!formData.value.problem_section) formData.value.problem_section = def.problem_section;
  if (!formData.value.solve_section) formData.value.solve_section = def.solve_section;
  if (!formData.value.deliver_section) formData.value.deliver_section = def.deliver_section;
  if (!formData.value.process_section) formData.value.process_section = def.process_section;
  if (!formData.value.why_section) formData.value.why_section = def.why_section;

  if (iconFileInput.value) iconFileInput.value.value = '';
  modalOpen.value = true;
};

const techCount = computed(() => solutions.value.filter(s => s.category === 'technology').length);
const marketingCount = computed(() => solutions.value.filter(s => s.category === 'marketing').length);
const creativeCount = computed(() => solutions.value.filter(s => s.category === 'creative').length);

const filteredSolutions = computed(() => {
  return solutions.value.filter(s => {
    const matchesSearch = !searchQuery.value ||
      s.title?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.description?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (s.technologies && s.technologies.some(t => t.toLowerCase().includes(searchQuery.value.toLowerCase())));
    const matchesCat = !selectedCategory.value || s.category === selectedCategory.value;
    const matchesStatus = selectedStatus.value === '' || String(s.is_active) === String(selectedStatus.value);
    return matchesSearch && matchesCat && matchesStatus;
  });
});

const fetchSolutions = async () => {
  loading.value = true;
  try {
    solutions.value = await SolutionService.getAll();
  } catch (err) {
    console.error('Failed to fetch solutions', err);
    toastError('تعذر تحميل الحلول والخدمات');
  } finally {
    loading.value = false;
  }
};

const toggleSolutionStatus = async (sol) => {
  const newStatus = sol.is_active ? 0 : 1;
  try {
    await SolutionService.update(sol.id, { is_active: newStatus });
    sol.is_active = newStatus;
    success('تم تحديث حالة الخدمة');
  } catch (err) {
    console.error('Failed to update status', err);
    toastError('حدث خطأ أثناء تحديث الحالة');
  }
};



const closeModal = () => {
  modalOpen.value = false;
};

const saveSolution = async () => {
  saving.value = true;
  try {
    if (formData.value.icon_image) {
      formData.value.icon = formData.value.icon_image;
    }
    if (isEdit.value) {
      const updated = await SolutionService.update(currentEditId.value, formData.value);
      const idx = solutions.value.findIndex(s => s.id === currentEditId.value);
      if (idx !== -1) solutions.value[idx] = updated;
      success('تم تحديث الخدمة بنجاح');
    } else {
      const created = await SolutionService.create(formData.value);
      solutions.value.push(created);
      success('تمت إضافة الخدمة بنجاح');
    }
    closeModal();
  } catch (err) {
    console.error('Failed to save solution', err);
    toastError('حدث خطأ أثناء حفظ الخدمة');
  } finally {
    saving.value = false;
  }
};

const confirmDelete = async (sol) => {
  if (confirm(`هل أنت متأكد من حذف حل "${sol.title}"؟`)) {
    try {
      await SolutionService.delete(sol.id);
      solutions.value = solutions.value.filter(s => s.id !== sol.id);
      success('تم حذف الخدمة بنجاح');
    } catch (err) {
      console.error('Failed to delete solution', err);
      toastError('حدث خطأ أثناء حذف الخدمة');
    }
  }
};

onMounted(() => {
  fetchSolutions();
});
</script>

<style scoped>
.solutions-page {
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
  background: linear-gradient(135deg, #4f008c, #7c3aed);
  color: #fff;
  border: none;
  padding: 0.65rem 1.1rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);
  transition: transform 0.15s ease;
}
.btn-add:hover { transform: translateY(-2px); }

/* Tabs */
.category-tabs {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  background: var(--bg-card);
  padding: 0.4rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  width: fit-content;
}

.cat-tab-btn {
  padding: 0.55rem 1.1rem;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
}
.cat-tab-btn.active {
  background: linear-gradient(135deg, #4f008c, #7c3aed);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.25);
}

/* Filters */
.filters-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 250px;
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
  padding: 0.65rem 2.4rem 0.65rem 1rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-main);
  font-size: 0.85rem;
}

.filter-select {
  padding: 0.65rem 1rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-main);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

/* Grid */
.solutions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
}

.solution-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.35rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.solution-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}
.card-inactive {
  opacity: 0.65;
}

.sol-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sol-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cat-technology { background: rgba(124, 58, 237, 0.12); color: #7c3aed; }
.cat-marketing { background: rgba(8, 145, 178, 0.12); color: #0891b2; }
.cat-creative { background: rgba(219, 39, 119, 0.12); color: #db2777; }

.sol-badge {
  font-size: 0.68rem;
  font-weight: 800;
  color: var(--text-muted);
  background: var(--bg-main);
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-family: 'Outfit', sans-serif;
}

.sol-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sol-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text-main);
  line-height: 1.3;
}

.sol-desc {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.5;
}

.tech-stack-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.tech-tag {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-main);
  background: var(--bg-main);
  border: 1px solid var(--border-color);
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
  font-family: 'Outfit', sans-serif;
}

.capabilities-list {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  background: var(--bg-main);
  padding: 0.65rem 0.8rem;
  border-radius: 8px;
}

.cap-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
}

.cap-check {
  color: #10b981;
  font-weight: 800;
}

.cap-text {
  color: var(--text-main);
  font-weight: 600;
}

.sol-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.85rem;
  border-top: 1px solid var(--border-color);
}

.status-btn {
  padding: 0.3rem 0.7rem;
  border-radius: 8px;
  font-size: 0.72rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
}
.status-btn.active { background: rgba(16, 185, 129, 0.12); color: #10b981; }
.status-btn.inactive { background: rgba(239, 68, 68, 0.12); color: #ef4444; }

.sol-actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.action-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-main);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.edit-btn:hover { color: #7c3aed; border-color: #7c3aed; }
.delete-btn:hover { color: #ef4444; border-color: #ef4444; }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  z-index: 60;
}

.modal-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 18px;
  width: 100%;
  max-width: 650px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-main);
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  color: var(--text-muted);
  cursor: pointer;
}

.modal-body {
  padding: 1.25rem 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
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

.form-input, .form-textarea {
  padding: 0.65rem 0.85rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  background: var(--input-bg);
  color: var(--text-main);
  font-size: 0.85rem;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
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
  padding: 0.65rem 1.4rem;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #4f008c, #7c3aed);
  color: #fff;
  font-weight: 700;
  cursor: pointer;
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  color: var(--text-muted);
  gap: 1rem;
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

/* ================= PREVIEW & CASE STUDY STYLES ================= */
.preview-btn:hover {
  color: #10b981;
  border-color: #10b981;
}

.modal-edit-solution {
  max-width: 900px;
}

.modal-tabs-nav {
  display: flex;
  gap: 0.4rem;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-card);
  overflow-x: auto;
}

.tab-btn {
  padding: 0.55rem 0.95rem;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.tab-btn.active {
  background: linear-gradient(135deg, #4f008c, #7c3aed);
  color: #fff;
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.25);
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

.section-notice {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  background: rgba(124, 58, 237, 0.08);
  color: #7c3aed;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  background: var(--bg-card);
}

.modal-footer-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-nav-step {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 1rem;
  border-radius: 9px;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-main);
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}

.btn-nav-next {
  background: rgba(124, 58, 237, 0.1);
  color: #7c3aed;
  border-color: rgba(124, 58, 237, 0.3);
}

.modal-footer-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* Solution Preview Modal */
.modal-preview-solution {
  max-width: 950px;
}

.preview-hero-header {
  position: relative;
  padding: 2rem;
  color: #fff;
}

.preview-close-btn {
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
}

.preview-client-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #ffce00;
  padding: 0.25rem 0.8rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.75rem;
}

.preview-hero-title {
  font-size: 1.8rem;
  font-weight: 900;
  margin-bottom: 0.35rem;
  line-height: 1.25;
}

.preview-highlight-headline {
  font-size: 1.25rem;
  font-weight: 800;
  color: #ffc700;
  margin-bottom: 0.75rem;
}

.preview-hero-desc {
  font-size: 0.9rem;
  line-height: 1.6;
  opacity: 0.9;
  max-width: 650px;
  margin-bottom: 1.1rem;
}

.preview-meta-chips {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.preview-tech-chip {
  background: #3b0069;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.preview-chip {
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
}

.preview-hero-mockup-wrap {
  margin-top: 1.5rem;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.preview-hero-mockup-wrap img {
  width: 100%;
  max-height: 380px;
  object-fit: cover;
  display: block;
}

.preview-body {
  padding: 1.75rem;
  overflow-y: auto;
  max-height: 65vh;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.preview-section {
  display: flex;
  flex-direction: column;
}

.section-pill-tag {
  display: inline-block;
  background: rgba(79, 0, 140, 0.08);
  color: #4f008c;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  margin-bottom: 0.4rem;
  text-transform: uppercase;
  width: fit-content;
}

.section-pill-tag.red-pill {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.preview-sec-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 0.35rem;
}

.preview-sec-sub {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 1.1rem;
}

/* Problem Grid */
.preview-problem-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 0.85rem;
}

.problem-card {
  background: rgba(239, 68, 68, 0.03);
  border: 1px solid rgba(239, 68, 68, 0.18);
  border-radius: 12px;
  padding: 1rem;
}

.problem-warn-icon {
  font-size: 1.35rem;
  margin-bottom: 0.4rem;
}

.problem-card-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: #b91c1c;
  margin-bottom: 0.3rem;
}

.problem-card-desc {
  font-size: 0.78rem;
  line-height: 1.5;
  color: var(--text-muted);
}

/* Solve Box */
.solve-content-box {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 1.25rem;
  align-items: center;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 1.25rem;
}

.solve-desc-text {
  font-size: 0.88rem;
  line-height: 1.65;
  color: var(--text-main);
  margin-bottom: 0.9rem;
}

.solve-cta-badge {
  display: inline-block;
  background: rgba(124, 58, 237, 0.1);
  color: #7c3aed;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.45rem 0.85rem;
  border-radius: 8px;
  border: 1px solid rgba(124, 58, 237, 0.2);
}

.solve-image-col img {
  width: 100%;
  border-radius: 10px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

/* Deliver Grid */
.preview-deliver-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 0.85rem;
}

.deliver-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1rem;
}

.deliver-check-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  font-weight: 900;
  font-size: 0.8rem;
  margin-bottom: 0.45rem;
}

.deliver-card-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.3rem;
}

.deliver-card-desc {
  font-size: 0.78rem;
  line-height: 1.5;
  color: var(--text-muted);
}

/* Process Steps */
.preview-process-steps {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.process-step-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1rem;
}

.step-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f008c, #7c3aed);
  color: #fff;
  font-weight: 900;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-item-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.25rem;
}

.step-item-desc {
  font-size: 0.78rem;
  line-height: 1.5;
  color: var(--text-muted);
}

/* Why Be Kite Grid */
.preview-why-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 0.85rem;
}

.solution-why-card {
  background: rgba(124, 58, 237, 0.04);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 12px;
  padding: 1rem;
}

.sol-why-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: #7c3aed;
  margin-bottom: 0.3rem;
}

.sol-why-desc {
  font-size: 0.78rem;
  line-height: 1.5;
  color: var(--text-muted);
}

.preview-footer-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.75rem;
  border-top: 1px solid var(--border-color);
  background: var(--bg-card);
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

/* Form Editors in Modal */
.challenge-cards-editor,
.deliver-cards-editor,
.process-steps-editor,
.why-cards-editor {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 0.85rem;
}

.challenge-edit-card,
.deliver-edit-card,
.step-edit-card,
.why-edit-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 0.85rem;
}

.card-edit-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
}

.card-num-badge {
  color: var(--text-main);
}

.warn-badge {
  color: #ef4444;
}

.check-badge {
  color: #10b981;
}

.step-badge-num {
  display: inline-block;
  background: linear-gradient(135deg, #4f008c, #7c3aed);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 0.1rem 0.45rem;
  border-radius: 4px;
  margin-bottom: 0.4rem;
}

/* Custom Icon Upload & Presentation */
.hidden-file-input {
  display: none !important;
}

.sol-custom-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.icon-upload-form-group {
  display: flex;
  flex-direction: column;
}

.label-with-hint {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.4rem;
}

.icon-format-tag {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--text-muted);
  background: rgba(124, 58, 237, 0.08);
  border: 1px solid rgba(124, 58, 237, 0.15);
  padding: 0.15rem 0.5rem;
  border-radius: 6px;
  font-family: 'Outfit', sans-serif;
}

.icon-dropzone {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1rem;
  border: 1.5px dashed var(--border-color);
  border-radius: 12px;
  background: var(--bg-card);
  cursor: pointer;
  transition: all 0.25s ease;
  min-height: 72px;
}

.icon-dropzone:hover {
  border-color: #7c3aed;
  background: rgba(124, 58, 237, 0.03);
}

.icon-dropzone.is-dragover {
  border-color: #7c3aed;
  background: rgba(124, 58, 237, 0.08);
  transform: scale(1.01);
}

.icon-dropzone-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: rgba(124, 58, 237, 0.1);
  color: #7c3aed;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.icon-dropzone:hover .icon-dropzone-icon {
  transform: scale(1.08);
}

.icon-dropzone-content {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  text-align: right;
}

.icon-dropzone-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-main);
}

.icon-dropzone-hint {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.icon-uploaded-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: var(--bg-card);
  border: 1.5px solid rgba(16, 185, 129, 0.35);
  border-radius: 12px;
  min-height: 72px;
}

.icon-uploaded-preview-wrap {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-uploaded-img {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.icon-uploaded-meta {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
}

.icon-uploaded-name {
  font-size: 0.8rem;
  font-weight: 700;
  color: #10b981;
}

.icon-uploaded-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-icon-action {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
  font-size: 0.73rem;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.btn-icon-action.change-btn {
  background: rgba(124, 58, 237, 0.1);
  color: #7c3aed;
  border-color: rgba(124, 58, 237, 0.25);
}
.btn-icon-action.change-btn:hover {
  background: #7c3aed;
  color: #fff;
}

.btn-icon-action.remove-btn {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.25);
}
.btn-icon-action.remove-btn:hover {
  background: #ef4444;
  color: #fff;
}

.icon-current-notice {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-top: 0.4rem;
  padding: 0.25rem 0.5rem;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 6px;
}

.notice-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #7c3aed;
  flex-shrink: 0;
}

.preview-hero-top-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.preview-hero-icon-pill {
  width: 34px;
  height: 34px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.preview-hero-icon-img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}
</style>
