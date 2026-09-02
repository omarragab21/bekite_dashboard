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
        إضافة نظام برمجى جديد
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

    <!-- Products Table -->
    <div class="table-card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th class="th-drag"></th>
              <th>المنتج والنظام</th>
              <th>القطاع والتصنيف</th>
              <th>الموديولات والشاشات</th>
              <th>قدرات التوسع والمشاريع</th>
              <th>الحالة</th>
              <th class="text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading" class="state-row"><td colspan="7">جاري تحميل المنتجات الرقمية...</td></tr>
            <tr v-else-if="filteredProducts.length === 0" class="state-row"><td colspan="7">لا توجد أنظمة مطابقة للبحث</td></tr>
            <template v-else>
              <tr
                v-for="product in filteredProducts"
                :key="product.id"
                class="data-row"
                :class="{ 'row-dragging': draggedId === product.id }"
                draggable="true"
                @dragstart="onDragStart(product)"
                @dragover.prevent="onDragOver(product)"
                @drop.prevent="onDrop(product)"
              >
                <td class="td-drag">
                  <span class="drag-handle">⋮⋮</span>
                </td>
                <td>
                  <div class="product-cell">
                    <div class="prod-color-indicator" :style="{ background: product.accent_color || '#7c3aed' }"></div>
                    <div class="product-meta">
                      <div class="title-with-badge">
                        <span class="product-name">{{ product.name }}</span>
                        <span v-if="product.is_featured" class="featured-badge">★ مميز</span>
                      </div>
                      <span class="product-subtitle">{{ product.subtitle }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="cat-tag">{{ getCategoryLabel(product.category) }}</span>
                </td>
                <td>
                  <div class="channels-cell-wrap">
                    <span class="channel-badge" title="موديولات ومكونات النظام">
                      🧩 {{ (product.modules || []).length }} موديول
                    </span>
                    <span v-if="(product.gallery || []).length > 0" class="channel-badge badge-cyan" title="معرض شاشات الواجهات">
                      📸 {{ (product.gallery || []).length }} شاشات
                    </span>
                  </div>
                </td>
                <td>
                  <div class="channels-cell-wrap">
                    <span class="channel-badge badge-amber" title="مستويات التوسع السحابي">
                      📈 3 باقات توسع
                    </span>
                    <span v-if="(product.related_projects || []).length > 0" class="channel-badge badge-purple" title="مشاريع مبنية على النظام">
                      💼 {{ (product.related_projects || []).length }} مشروع مرتبط
                    </span>
                  </div>
                </td>
                <td>
                  <button
                    class="status-toggle-btn"
                    :class="product.is_active ? 'active' : 'inactive'"
                    @click="toggleProductStatus(product)"
                  >
                    {{ product.is_active ? 'مفعل' : 'معطل' }}
                  </button>
                </td>
                <td>
                  <div class="actions-cell">
                    <!-- Quick Preview Button -->
                    <button class="action-btn preview-btn" @click="openQuickPreview(product)" title="معاينة المنتج الشاملة">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                    <!-- Edit Button -->
                    <button class="action-btn edit-btn" @click="openEditModal(product)" title="تعديل">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <!-- Delete Button -->
                    <button class="action-btn delete-btn" @click="confirmDelete(product)" title="حذف">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ================= ADD / EDIT PRODUCT MODAL ================= -->
    <div v-if="modalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-card modal-large-card">
        <div class="modal-header">
          <div class="modal-title-wrap">
            <h2 class="modal-title">{{ isEdit ? 'تعديل المنظومة الرقمية' : 'إضافة منظومة رقمية جديدة (Digital Product)' }}</h2>
            <span class="modal-subtitle">قم بتعبئة بيانات النظام، موديولات ما يتضمنه، معرض الشاشات، مستويات التوسع، والقطاعات</span>
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
            📋 البيانات الأساسية
          </button>
          <button
            type="button"
            class="tab-btn"
            :class="{ active: activeTab === 'modules' }"
            @click="activeTab = 'modules'"
          >
            🧩 ماذا يتضمن؟ ({{ (formData.modules || []).length }})
          </button>
          <button
            type="button"
            class="tab-btn"
            :class="{ active: activeTab === 'gallery' }"
            @click="activeTab = 'gallery'"
          >
            📸 واجهات النظام ({{ (formData.gallery || []).length }})
          </button>
          <button
            type="button"
            class="tab-btn"
            :class="{ active: activeTab === 'scalability' }"
            @click="activeTab = 'scalability'"
          >
            📈 التوسع السحابي
          </button>
          <button
            type="button"
            class="tab-btn"
            :class="{ active: activeTab === 'editions' }"
            @click="activeTab = 'editions'"
          >
            🏢 الباقات والقطاعات ({{ (formData.editions || []).length }})
          </button>
          <button
            type="button"
            class="tab-btn"
            :class="{ active: activeTab === 'projects' }"
            @click="activeTab = 'projects'"
          >
            💼 المشاريع المعتمدة ({{ (formData.related_projects || []).length }})
          </button>
        </div>

        <form @submit.prevent="saveProduct" class="modal-form-wrap">
          <div class="modal-tab-content-scroll">
            
            <!-- ================= TAB 1: General Info ================= -->
            <div v-show="activeTab === 'general'" class="tab-pane">
              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label">اسم النظام (بالعربية) *</label>
                  <input type="text" v-model="formData.name" class="form-input" required placeholder="مثال: تجارة | Tijara" />
                </div>
                <div class="form-group">
                  <label class="form-label">اسم النظام (English) *</label>
                  <input type="text" v-model="formData.name_en" class="form-input ltr-text" required placeholder="e.g. Tijara Omnichannel Platform" />
                </div>
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label">العنوان الفرعي (بالعربية)</label>
                  <input type="text" v-model="formData.subtitle" class="form-input" placeholder="النظام الذكي لإدارة المتاجر والتجارة الإلكترونية المتكاملة" />
                </div>
                <div class="form-group">
                  <label class="form-label">العنوان الفرعي (English)</label>
                  <input type="text" v-model="formData.subtitle_en" class="form-input ltr-text" placeholder="The Smart Omnichannel E-Commerce & Retail Platform" />
                </div>
              </div>

              <div class="form-grid-3">
                <div class="form-group">
                  <label class="form-label">الرابط المخصص (Slug) *</label>
                  <input type="text" v-model="formData.slug" class="form-input ltr-text" required placeholder="tijara" />
                </div>
                <div class="form-group">
                  <label class="form-label">القطاع / التصنيف</label>
                  <select v-model="formData.category" class="form-input">
                    <option v-for="cat in categories" :key="cat.slug" :value="cat.slug">{{ cat.name }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">اللون المميز (Accent Color)</label>
                  <div class="color-wrap">
                    <input type="color" v-model="formData.accent_color" class="color-input" />
                    <input type="text" v-model="formData.accent_color" class="form-input ltr-text" />
                  </div>
                </div>
              </div>

              <div class="form-grid-2">
                <div class="form-group">
                  <label class="form-label">شارة النظام (Badge Ar)</label>
                  <input type="text" v-model="formData.badge" class="form-input" placeholder="إدارة التجارة الإلكترونية والـ POS" />
                </div>
                <div class="form-group">
                  <label class="form-label">رابط المعاينة المباشرة (Demo URL)</label>
                  <input type="text" v-model="formData.demo_url" class="form-input ltr-text" placeholder="https://demo.bekite.com/tijara" />
                </div>
              </div>

              <!-- Main Mockup Upload -->
              <div class="form-group">
                <label class="form-label">صورة النظام الرئيسية / Mockup</label>
                <div class="dropzone-box" @click="$refs.mainImgInput.click()">
                  <input
                    ref="mainImgInput"
                    type="file"
                    style="display:none;"
                    accept="image/*"
                    @change="handleSingleImageUpload($event, 'image')"
                  />
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="dropzone-icon">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span class="dropzone-title">انقر لرفع صورة النظام الرئيسية أو الموك آب</span>
                  <span class="dropzone-hint">PNG, JPG, WebP بدقة عالية</span>
                </div>
                <div class="or-divider">أو ضع رابط مباشر للصورة</div>
                <input type="text" v-model="formData.image" class="form-input ltr-text" placeholder="https://example.com/images/tijara_mockup.png" />
                
                <div v-if="formData.image" class="single-preview-wrap">
                  <img :src="formData.image" alt="Product Mockup Preview" @error="onImgError" />
                  <button type="button" class="btn-del-mini" @click="formData.image = ''">إزالة الصورة ✕</button>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">الوصف التفصيلي للمنظومة (بالعربية)</label>
                <textarea v-model="formData.description" class="form-textarea" rows="3" placeholder="شرح شامل للمنظومة وإمكانياتها وقيمتها للعملاء..."></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">الوصف التفصيلي (English)</label>
                <textarea v-model="formData.description_en" class="form-textarea ltr-text" rows="3" placeholder="Full product summary and capabilities in English..."></textarea>
              </div>

              <div class="form-grid-2">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="formData.is_featured" :true-value="1" :false-value="0" />
                  <span>تمييز المنتج في الصفحة الرئيسية (Featured Product)</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" v-model="formData.is_active" :true-value="1" :false-value="0" />
                  <span>نشر وتفعيل المنتج لجميع العملاء</span>
                </label>
              </div>
            </div>

            <!-- ================= TAB 2: What Does It Include ================= -->
            <div v-show="activeTab === 'modules'" class="tab-pane">
              <div class="section-notice">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span>أضف وحدات وموديولات النظام (What Does It Include) مع الأيقونة والعنوان والشرح التفصيلي لمهام الموديول.</span>
              </div>

              <div class="modules-dynamic-list">
                <div v-for="(mod, mIdx) in formData.modules" :key="mIdx" class="module-edit-card">
                  <div class="module-card-header">
                    <span class="module-num-badge">موديول {{ mIdx + 1 }}</span>
                    <button type="button" class="btn-del-sm" @click="removeModule(mIdx)" title="حذف الموديول">✕ حذف</button>
                  </div>

                  <div class="form-grid-3">
                    <div class="form-group">
                      <label class="form-label">الأيقونة (Icon)</label>
                      <select v-model="mod.icon" class="form-input">
                        <option value="package">📦 منتجات ومخزون (package)</option>
                        <option value="shopping-cart">🛒 معالجة الطلبات (shopping-cart)</option>
                        <option value="credit-card">💳 بوابات الدفع وPOS (credit-card)</option>
                        <option value="truck">🚚 شحن ولوجستيات (truck)</option>
                        <option value="bar-chart">📊 تحليلات ومؤشرات (bar-chart)</option>
                        <option value="users">👥 عملاء وولاء (users)</option>
                        <option value="shield">🛡️ أمان وحماية (shield)</option>
                        <option value="cpu">⚡ أتمتة وذكاء (cpu)</option>
                        <option value="smartphone">📱 تطبيق جوال (smartphone)</option>
                        <option value="globe">🌐 تكاملات وسحابة (globe)</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label class="form-label">اسم الموديول (بالعربية) *</label>
                      <input type="text" v-model="mod.title" class="form-input" placeholder="مثال: إدارة المنتجات والمخزون المتقدم" required />
                    </div>
                    <div class="form-group">
                      <label class="form-label">اسم الموديول (English)</label>
                      <input type="text" v-model="mod.title_en" class="form-input ltr-text" placeholder="e.g. Multi-Warehouse Inventory Control" />
                    </div>
                  </div>

                  <div class="form-grid-2">
                    <div class="form-group">
                      <label class="form-label">شرح ما يتضمنه الموديول (بالعربية)</label>
                      <textarea v-model="mod.description" class="form-textarea" rows="2" placeholder="إدارة شاملة للمتغيرات، الباركود، وتنبيهات انخفاض المخزون..."></textarea>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Module Details (English)</label>
                      <textarea v-model="mod.description_en" class="form-textarea ltr-text" rows="2" placeholder="Complete variants, barcode generation, low stock alerts..."></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <button type="button" class="btn-add-dashed" @click="addModule">
                + إضافة موديول جديد للنظام (Add Included Module)
              </button>
            </div>

            <!-- ================= TAB 3: See It In Action (Gallery) ================= -->
            <div v-show="activeTab === 'gallery'" class="tab-pane">
              <div class="section-notice">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span>معرض شاشات وواجهات النظام (See It In Action) — ارفع عدة لقطات شاشة للشاشات الرئيسية ولوحات التحكم وتطبيق الجوال.</span>
              </div>

              <!-- Multi Upload Dropzone -->
              <div class="dropzone-box" @click="$refs.galleryMultiInput.click()">
                <input
                  ref="galleryMultiInput"
                  type="file"
                  multiple
                  style="display:none;"
                  accept="image/*"
                  @change="handleGalleryMultiUpload"
                />
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="dropzone-icon">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
                <span class="dropzone-title">انقر أو اسحب لرفع لقطات شاشة متعددة دفعة واحدة</span>
                <span class="dropzone-hint">يمكنك تحديد عدة صور من لوحة التحكم، نقاط البيع، أو الجوال</span>
              </div>

              <div class="or-divider">أو أضف صورة جديدة بالرابط</div>

              <!-- Add Gallery Item by URL -->
              <div class="add-gallery-item-bar">
                <input type="text" v-model="newGalleryUrl" placeholder="https://example.com/screenshot.png" class="form-input flex-1 ltr-text" />
                <input type="text" v-model="newGalleryTitle" placeholder="عنوان الشاشة (مثال: لوحة التحكم الرئيسية)" class="form-input flex-1" />
                <select v-model="newGalleryDevice" class="form-input w-auto">
                  <option value="Desktop Dashboard">🖥️ سطح المكتب (Desktop)</option>
                  <option value="POS & Tablet">📟 نقاط البيع (POS)</option>
                  <option value="Mobile App">📱 تطبيق الجوال (Mobile)</option>
                  <option value="Warehouse Barcode">📦 مستودعات وباركود</option>
                </select>
                <button type="button" class="btn-sm-primary" @click="addGalleryItemFromUrl">+ إضافة</button>
              </div>

              <!-- Gallery Grid Preview -->
              <div v-if="(formData.gallery || []).length > 0" class="screenshots-grid-preview">
                <div v-for="(item, gIdx) in formData.gallery" :key="gIdx" class="screenshot-card-preview">
                  <div class="screenshot-img-box">
                    <img :src="item.image || item.url || item" :alt="item.title || 'Screenshot'" @error="onImgError" />
                    <button type="button" class="btn-del-screenshot" @click="removeGalleryItem(gIdx)" title="حذف الشاشة">✕</button>
                  </div>
                  <div class="screenshot-info">
                    <input type="text" v-model="item.title" class="form-input-mini" placeholder="عنوان الشاشة..." />
                    <span class="screenshot-device-tag">{{ item.device || 'Desktop Dashboard' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- ================= TAB 4: Scalability ================= -->
            <div v-show="activeTab === 'scalability'" class="tab-pane">
              <div class="section-notice">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span>مستويات التوسع السحابي (Scalable from Startup to Enterprise Scale) — خصائص وقدرات كل باقة حسب حجم عمل العميل.</span>
              </div>

              <div class="scalability-tiers-list">
                <div v-for="(tierItem, tIdx) in formData.scalability" :key="tIdx" class="scalability-tier-card" :class="tierItem.tier">
                  <div class="tier-card-badge">
                    <span>{{ tierItem.tier === 'startup' ? '🚀' : (tierItem.tier === 'growth' ? '📈' : '🏢') }}</span>
                    <strong>{{ tierItem.title }}</strong>
                  </div>

                  <div class="form-grid-2">
                    <div class="form-group">
                      <label class="form-label">العنوان والمستوى (Ar)</label>
                      <input type="text" v-model="tierItem.title" class="form-input" />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Tier Title (En)</label>
                      <input type="text" v-model="tierItem.title_en" class="form-input ltr-text" />
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">أبرز ميزة / الوعد الأساسي (Key Highlight)</label>
                    <input type="text" v-model="tierItem.highlight" class="form-input" placeholder="مثال: إطلاق سريع في 48 ساعة أو بنية مخصصة SLA 99.99%" />
                  </div>

                  <div class="form-grid-2">
                    <div class="form-group">
                      <label class="form-label">المواصفات والقدرات (بالعربية)</label>
                      <textarea v-model="tierItem.specs" class="form-textarea" rows="2" placeholder="عدد الطلبات، الفروع، بوابات الدفع، الدعم الفني..."></textarea>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Technical Specs (English)</label>
                      <textarea v-model="tierItem.specs_en" class="form-textarea ltr-text" rows="2" placeholder="Order limits, POS branches, SLAs, custom APIs..."></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ================= TAB 5: Brands & Editions ================= -->
            <div v-show="activeTab === 'editions'" class="tab-pane">
              <div class="section-notice">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span>الباقات والقطاعات التابعة للمنظومة (Industry Brands & Editions) — مثل تجارة للأزياء والتجزئة، تجارة للمطاعم، أو تجارة للبيع بالجملة B2B.</span>
              </div>

              <div class="editions-dynamic-list">
                <div v-for="(ed, eIdx) in formData.editions" :key="eIdx" class="edition-edit-card">
                  <div class="module-card-header">
                    <span class="module-num-badge">قطاع / باقة {{ eIdx + 1 }}</span>
                    <button type="button" class="btn-del-sm" @click="removeEdition(eIdx)">✕ حذف</button>
                  </div>

                  <div class="form-grid-3">
                    <div class="form-group">
                      <label class="form-label">الأيقونة</label>
                      <select v-model="ed.icon" class="form-input">
                        <option value="shopping-bag">🛍️ أزياء وتجزئة (shopping-bag)</option>
                        <option value="utensils">🍽️ مطاعم ومقاهي (utensils)</option>
                        <option value="briefcase">💼 بيع بالجملة B2B (briefcase)</option>
                        <option value="cpu">💻 إلكترونيات وأجهزة (cpu)</option>
                        <option value="activity">🏥 عيادات ومراكز طبية (activity)</option>
                        <option value="book-open">📚 تعليم وأكاديميات (book-open)</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label class="form-label">اسم الباقة / القطاع (Ar) *</label>
                      <input type="text" v-model="ed.name" class="form-input" placeholder="مثال: تجارة للأزياء والتجزئة" required />
                    </div>
                    <div class="form-group">
                      <label class="form-label">Edition Name (En)</label>
                      <input type="text" v-model="ed.name_en" class="form-input ltr-text" placeholder="e.g. Tijara Fashion & Retail" />
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">الميزات المخصصة لهذا القطاع</label>
                    <textarea v-model="ed.description" class="form-textarea" rows="2" placeholder="مصفوفة المقاسات والألوان، طباعة الباركود، تكامل التبديل..."></textarea>
                  </div>
                </div>
              </div>

              <button type="button" class="btn-add-dashed" @click="addEdition">
                + إضافة قطاع / باقة فرعية تابعة للنظام (Add Industry Edition)
              </button>
            </div>

            <!-- ================= TAB 6: Powered Projects ================= -->
            <div v-show="activeTab === 'projects'" class="tab-pane">
              <div class="section-notice">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span>المشاريع ودراسات الحالة المعتمدة على هذا النظام (Powered Projects) — اختر المشاريع التي تم بناؤها باستخدام هذه المنظومة.</span>
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
                v-if="activeTab !== 'projects'"
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

    <!-- ================= QUICK PRODUCT PREVIEW MODAL ================= -->
    <div v-if="previewModalOpen && previewProduct" class="modal-overlay" @click.self="previewModalOpen = false">
      <div class="modal-card modal-preview-card">
        <!-- Hero Header -->
        <div class="preview-hero-header" :style="{ background: `linear-gradient(135deg, ${previewProduct.accent_color || '#7c3aed'}, #18032a)` }">
          <button class="preview-close-btn" @click="previewModalOpen = false">✕</button>
          
          <div class="preview-hero-content">
            <span class="preview-client-badge">{{ previewProduct.badge || getCategoryLabel(previewProduct.category) }}</span>
            <h2 class="preview-hero-title">{{ previewProduct.name }}</h2>
            <p v-if="previewProduct.name_en" class="preview-hero-sub ltr-text">{{ previewProduct.name_en }} — {{ previewProduct.subtitle_en }}</p>
            
            <div class="preview-meta-chips">
              <span class="preview-chip">{{ previewProduct.subtitle }}</span>
              <span class="preview-chip status-chip" :class="previewProduct.is_active ? 'active' : 'inactive'">
                {{ previewProduct.is_active ? 'منظومة مفعلة' : 'مسودة' }}
              </span>
              <a v-if="previewProduct.demo_url" :href="previewProduct.demo_url" target="_blank" class="preview-demo-chip">
                معاينة المنظومة الحية ↗
              </a>
            </div>
          </div>
        </div>

        <div class="preview-body">
          <!-- Description -->
          <div v-if="previewProduct.description" class="preview-section">
            <h3 class="preview-sec-title">نبذة عن المنظومة</h3>
            <p class="preview-desc-text">{{ previewProduct.description }}</p>
          </div>

          <!-- 1. What does it include -->
          <div v-if="(previewProduct.modules || []).length > 0" class="preview-section">
            <h3 class="preview-sec-title">🧩 ماذا يتضمن النظام؟ (What Does It Include)</h3>
            <div class="preview-modules-grid">
              <div v-for="(mod, mIdx) in previewProduct.modules" :key="mIdx" class="preview-mod-card">
                <div class="mod-icon-badge">
                  {{ getIconSymbol(mod.icon) }}
                </div>
                <div class="mod-texts">
                  <h4 class="mod-title">{{ mod.title }}</h4>
                  <p class="mod-desc">{{ mod.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. See It In Action (Screenshots Gallery) -->
          <div v-if="(previewProduct.gallery || []).length > 0" class="preview-section">
            <h3 class="preview-sec-title">📸 واجهات النظام والشاشات (See It In Action)</h3>
            <div class="preview-gallery-grid">
              <div v-for="(gItem, gIdx) in previewProduct.gallery" :key="gIdx" class="preview-gallery-item">
                <img :src="gItem.image || gItem.url || gItem" :alt="gItem.title || 'Screenshot'" @error="onImgError" />
                <span v-if="gItem.title" class="preview-gallery-caption">{{ gItem.title }}</span>
              </div>
            </div>
          </div>

          <!-- 3. Scalability Tiers -->
          <div v-if="(previewProduct.scalability || []).length > 0" class="preview-section">
            <h3 class="preview-sec-title">📈 مستويات التوسع (Startup to Enterprise Scale)</h3>
            <div class="preview-scalability-grid">
              <div v-for="(tier, tIdx) in previewProduct.scalability" :key="tIdx" class="preview-scale-card" :class="tier.tier">
                <div class="scale-header">
                  <span class="scale-emoji">{{ tier.tier === 'startup' ? '🚀' : (tier.tier === 'growth' ? '📈' : '🏢') }}</span>
                  <span class="scale-title">{{ tier.title }}</span>
                </div>
                <div class="scale-highlight">{{ tier.highlight }}</div>
                <p class="scale-specs">{{ tier.specs }}</p>
              </div>
            </div>
          </div>

          <!-- 4. Editions & Brands -->
          <div v-if="(previewProduct.editions || []).length > 0" class="preview-section">
            <h3 class="preview-sec-title">🏢 الباقات والقطاعات التابعة للمنتج</h3>
            <div class="preview-editions-grid">
              <div v-for="(ed, eIdx) in previewProduct.editions" :key="eIdx" class="preview-edition-card">
                <span class="edition-icon">{{ getIconSymbol(ed.icon) }}</span>
                <div class="edition-texts">
                  <h4 class="edition-name">{{ ed.name }}</h4>
                  <p class="edition-desc">{{ ed.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 5. Linked Projects -->
          <div v-if="(previewProduct.related_projects || []).length > 0" class="preview-section">
            <h3 class="preview-sec-title">💼 مشاريع معتمدة على هذا النظام</h3>
            <div class="preview-linked-projects-row">
              <div v-for="projSlug in previewProduct.related_projects" :key="projSlug" class="linked-proj-chip">
                <span>🌟 {{ getProjectTitle(projSlug) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="preview-footer-bar">
          <button type="button" class="btn-cancel" @click="previewModalOpen = false">إغلاق</button>
          <button type="button" class="btn-edit-from-preview" @click="editFromPreview(previewProduct)">تعديل بيانات النظام ✎</button>
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

// Default initial form state
const defaultForm = () => ({
  name: '',
  name_en: '',
  subtitle: '',
  subtitle_en: '',
  slug: '',
  category: 'ecommerce',
  category_id: 1,
  badge: 'إدارة التجارة الإلكترونية والـ POS',
  badge_en: 'E-COMMERCE ENGINE',
  accent_color: '#9333ea',
  image: '',
  laptop_mockup: '',
  demo_url: '',
  description: '',
  description_en: '',
  features: ['إدارة المنتجات والمخازن', 'معالجة الطلبات اللحظي', 'بوابات الدفع والـ POS'],
  features_en: [],
  modules: [
    {
      icon: 'package',
      title: 'إدارة المنتجات والمخزون المتقدم',
      title_en: 'Advanced Product Catalog',
      description: 'إدارة شاملة للمتغيرات والباركود وتنبيهات انخفاض المخزون.',
      description_en: 'Complete variant management and inventory control.'
    },
    {
      icon: 'shopping-cart',
      title: 'معالجة وتتبع الطلبات اللحظي',
      title_en: 'Real-time Order Management',
      description: 'مسار آلي لتجهيز الشحنات وبوالص الشحن وتحديثات SMS.',
      description_en: 'Automated fulfillment workflow and live tracking.'
    }
  ],
  gallery: [],
  scalability: [
    {
      tier: 'startup',
      title: 'الشركات الناشئة (Startup Scale)',
      title_en: 'Startup Tier',
      highlight: 'إطلاق متجر متكامل في 48 ساعة',
      specs: 'حتى 10,000 طلب شهرياً، متجر إلكتروني + كاشير فرع واحد، نطاق مخصص.',
      specs_en: 'Up to 10k orders/mo, 1 branch POS, custom domain.'
    },
    {
      tier: 'growth',
      title: 'الشركات المتنامية (Growth Scale)',
      title_en: 'Growth Tier',
      highlight: 'إدارة سلاسل الفروع المتعددة والمبيعات المكثفة',
      specs: 'حتى 100,000 طلب شهرياً، مستودعات متعددة، نقاط بيع غير محدودة.',
      specs_en: 'Up to 100k orders/mo, unlimited POS registers, multi-warehouse.'
    },
    {
      tier: 'enterprise',
      title: 'المؤسسات الكبرى (Enterprise Scale)',
      title_en: 'Enterprise Tier',
      highlight: 'بنية تحتية سحابية مخصصة ومعدل استجابة فائق السرعة',
      specs: 'طلبات وترافيك غير محدود، SLA 99.99%، ربط مخصص مع ERP، دعم VIP 24/7.',
      specs_en: 'Unlimited throughput, 99.99% SLA, custom ERP integrations.'
    }
  ],
  editions: [
    {
      name: 'تجارة للأزياء والتجزئة',
      name_en: 'Tijara Fashion & Retail',
      icon: 'shopping-bag',
      description: 'مصفوفة متكاملة للمقاسات والألوان وطباعة الباركود.'
    }
  ],
  related_projects: [],
  is_featured: 1,
  is_active: 1,
});

const formData = ref(defaultForm());

// Tab Sequence
const tabList = ['general', 'modules', 'gallery', 'scalability', 'editions', 'projects'];

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

// Quick Preview
function openQuickPreview(product) {
  previewProduct.value = product;
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
  activeTab.value = 'general';
  formData.value = defaultForm();
  modalOpen.value = true;
}

function openEditModal(product) {
  isEdit.value = true;
  currentEditId.value = product.id;
  activeTab.value = 'general';
  formData.value = JSON.parse(JSON.stringify(product));
  
  if (!formData.value.modules) formData.value.modules = [];
  if (!formData.value.gallery) formData.value.gallery = [];
  if (!formData.value.scalability) formData.value.scalability = defaultForm().scalability;
  if (!formData.value.editions) formData.value.editions = [];
  if (!formData.value.related_projects) formData.value.related_projects = [];

  modalOpen.value = true;
}

function closeModal() {
  modalOpen.value = false;
}

// Save Product
async function saveProduct() {
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
      success('تم إضافة المنظومة الرقمية الجديدة بنجاح');
    }
    closeModal();
  } catch (err) {
    toastError('حدث خطأ أثناء حفظ النظام');
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

/* Table */
.table-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.03);
}
.table-responsive { overflow-x: auto; }
.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: right;
}
.data-table th {
  background: var(--table-header-bg);
  padding: 0.9rem 1.1rem;
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-color);
}
.data-table td {
  padding: 0.9rem 1.1rem;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.85rem;
  vertical-align: middle;
}
.data-row:hover { background: var(--table-row-hover); }
.th-drag, .td-drag { width: 35px; text-align: center; }
.drag-handle { color: var(--text-muted); cursor: grab; font-size: 1rem; }

/* Product Cell */
.product-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.prod-color-indicator {
  width: 12px;
  height: 38px;
  border-radius: 6px;
  flex-shrink: 0;
}
.product-meta {
  display: flex;
  flex-direction: column;
}
.title-with-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.product-name {
  font-weight: 800;
  color: var(--text-main);
  font-size: 0.95rem;
}
.product-subtitle {
  font-size: 0.76rem;
  color: var(--text-muted);
}
.featured-badge {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  font-size: 0.68rem;
  font-weight: 800;
  padding: 0.15rem 0.45rem;
  border-radius: 6px;
}

.cat-tag {
  background: var(--tag-bg);
  color: var(--text-main);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: 8px;
}

.channels-cell-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.channel-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: rgba(147, 51, 234, 0.1);
  color: #9333ea;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
  width: fit-content;
}
.badge-cyan { background: rgba(6, 182, 212, 0.1); color: #0891b2; }
.badge-amber { background: rgba(245, 158, 11, 0.1); color: #d97706; }
.badge-purple { background: rgba(124, 58, 237, 0.12); color: #7c3aed; }

.status-toggle-btn {
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  border: none;
  font-size: 0.75rem;
  font-weight: 800;
  cursor: pointer;
}
.status-toggle-btn.active { background: rgba(16, 185, 129, 0.12); color: #10b981; }
.status-toggle-btn.inactive { background: rgba(239, 68, 68, 0.12); color: #ef4444; }

.actions-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
}
.action-btn {
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
.preview-btn:hover { color: #0891b2; border-color: #0891b2; background: rgba(6, 182, 212, 0.08); }
.edit-btn:hover { color: #7c3aed; border-color: #7c3aed; background: rgba(124, 58, 237, 0.08); }
.delete-btn:hover { color: #ef4444; border-color: #ef4444; background: rgba(239, 68, 68, 0.08); }

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
  max-width: 920px;
  max-height: 90vh;
  background: var(--bg-card);
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.preview-hero-header {
  padding: 2rem 2rem 1.5rem;
  position: relative;
  color: #fff;
}
.preview-close-btn {
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(255,255,255,0.15);
  border: none;
  color: #fff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
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
  padding: 1.5rem 2rem;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
</style>
