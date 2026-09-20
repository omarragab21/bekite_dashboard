<template>
  <div class="leads-page" dir="rtl">
    <!-- Header -->
    <div class="page-header">
      <div class="header-titles">
        <h1 class="page-title">طلبات واستفسارات العملاء (CRM Leads)</h1>
        <p class="page-subtitle">إدارة طلبات عروض الأسعار واستشارات التحول الرقمي والخدمات الواردة من عملاء Be Kite</p>
      </div>
      <div class="header-counts">
        <span class="count-pill badge-new"><b>{{ newCount }}</b> طلب جديد</span>
        <span class="count-pill badge-prog"><b>{{ inProgressCount }}</b> قيد المتابعة</span>
        <span class="count-pill badge-conv"><b>{{ convertedCount }}</b> تم التحويل لعقد</span>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="filters-row">
      <div class="search-box">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="search-icon">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input type="text" v-model="searchQuery" placeholder="البحث باسم العميل، الشركة، البريد أو الهاتف..." class="search-input" />
      </div>

      <div class="filter-dropdown">
        <select v-model="selectedStatus" class="filter-select">
          <option value="">كافة الحالات</option>
          <option value="new">جديد (New)</option>
          <option value="contacted">تم التواصل (Contacted)</option>
          <option value="in_progress">قيد التنفيذ (In Progress)</option>
          <option value="converted">تم التحويل (Converted)</option>
          <option value="archived">مؤرشف (Archived)</option>
        </select>
      </div>

      <div class="filter-dropdown">
        <select v-model="selectedService" class="filter-select">
          <option value="">كافة الخدمات والأنظمة</option>
          <option value="web-development">تطوير المواقع والمنصات</option>
          <option value="mobile-apps">تطبيقات الهواتف الذكية</option>
          <option value="erp-systems">أنظمة ERP السحابية</option>
          <option value="tijara">نظام تجارة (Tijara)</option>
          <option value="branding">الهوية البصرية والعلامة</option>
          <option value="digital-marketing">التسويق الرقمي</option>
        </select>
      </div>

      <!-- Export Action -->
      <div class="export-dropdown-wrapper" ref="exportMenuRef">
        <button class="export-btn" @click.stop="toggleExportMenu" :disabled="isExporting" title="تصدير السجلات">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span>{{ isExporting ? 'جاري التصدير...' : 'تصدير السجلات' }}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="dropdown-arrow">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        <div v-if="showExportMenu" class="export-menu">
          <button class="export-menu-item" @click="handleExport('xlsx')">
            <span class="export-icon xlsx">
              <i class="fas fa-file-excel"></i>
            </span>
            <div class="export-item-meta">
              <span class="export-title">تصدير كملف Excel (.xlsx)</span>
              <span class="export-desc">جدول طلبات واستفسارات العملاء CRM</span>
            </div>
          </button>
          <button class="export-menu-item" @click="handleExport('csv')">
            <span class="export-icon csv">
              <i class="fas fa-file-csv"></i>
            </span>
            <div class="export-item-meta">
              <span class="export-title">تصدير كملف CSV (.csv)</span>
              <span class="export-desc">ترميز UTF-8 سليم لأنظمة المحاسبة وشيتس</span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Leads Table -->
    <div class="table-card">
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>العميل والشركة</th>
              <th>الخدمة المطلوبة</th>
              <th>الميزانية المتوقعة</th>
              <th>معلومات التواصل</th>
              <th>تاريخ الطلب</th>
              <th>حالة الطلب</th>
              <th class="text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading" class="state-row"><td colspan="7">جاري تحميل استفسارات ومشاريع العملاء...</td></tr>
            <tr v-else-if="filteredInquiries.length === 0" class="state-row"><td colspan="7">لا توجد طلبات مطابقة لمعايير البحث</td></tr>
            <template v-else>
              <tr v-for="lead in filteredInquiries" :key="lead.id" class="data-row">
                <td>
                  <div class="client-cell">
                    <div class="client-avatar" :class="'avatar-' + lead.status">
                      {{ lead.full_name?.charAt(0) || 'ع' }}
                    </div>
                    <div class="client-meta">
                      <span class="client-name">{{ lead.full_name }}</span>
                      <span class="client-company">{{ lead.company || 'عميل فردي / ناشئ' }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="service-pill">{{ lead.service_name || lead.service_type }}</span>
                </td>
                <td>
                  <span class="budget-badge">{{ lead.budget_range || 'غير محدد' }}</span>
                </td>
                <td>
                  <div class="contact-info-cell">
                    <span class="contact-item" dir="ltr">{{ lead.phone }}</span>
                    <span class="contact-item email-txt" dir="ltr">{{ lead.email }}</span>
                  </div>
                </td>
                <td class="td-date">{{ lead.created_at }}</td>
                <td>
                  <select
                    :value="lead.status"
                    @change="updateStatus(lead, $event.target.value)"
                    class="status-select"
                    :class="'status-' + lead.status"
                  >
                    <option value="new">جديد (New)</option>
                    <option value="contacted">تم التواصل (Contacted)</option>
                    <option value="in_progress">قيد التنفيذ (In Progress)</option>
                    <option value="converted">تم التحويل (Converted)</option>
                    <option value="archived">مؤرشف (Archived)</option>
                  </select>
                </td>
                <td>
                  <div class="actions-cell">
                    <button class="action-btn view-btn" @click="viewDetails(lead)" title="عرض التفاصيل">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                    <button class="action-btn delete-btn" @click="confirmDelete(lead)" title="حذف">
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

    <!-- Lead Details Modal -->
    <div v-if="selectedLead" class="modal-overlay" @click.self="selectedLead = null">
      <div class="modal-card">
        <div class="modal-header">
          <div class="modal-header-titles">
            <h2 class="modal-title">تفاصيل طلب المشروع #{{ selectedLead.id }}</h2>
            <span class="lead-modal-date">{{ selectedLead.created_at }}</span>
          </div>
          <button class="close-btn" @click="selectedLead = null">✕</button>
        </div>

        <div class="modal-body">
          <div class="info-grid-2">
            <div class="info-item">
              <span class="info-label">اسم العميل:</span>
              <span class="info-val font-bold">{{ selectedLead.full_name }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">الشركة أو المؤسسة:</span>
              <span class="info-val">{{ selectedLead.company || 'غير متوفر' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">البريد الإلكتروني:</span>
              <span class="info-val" dir="ltr">{{ selectedLead.email }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">رقم الهاتف / الواتساب:</span>
              <span class="info-val" dir="ltr">{{ selectedLead.phone }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">الخدمة المطلوبة:</span>
              <span class="info-val font-bold text-purple">{{ selectedLead.service_name || selectedLead.service_type }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">الميزانية المتوقعة:</span>
              <span class="info-val font-bold text-green">{{ selectedLead.budget_range || 'غير محدد' }}</span>
            </div>
          </div>

          <div class="message-box">
            <span class="msg-title">نص الرسالة / نطاق عمل المشروع:</span>
            <p class="msg-content">{{ selectedLead.message || 'لا توجد تفاصيل إضافية مكتوبة.' }}</p>
          </div>

          <div class="form-group">
            <label class="form-label">ملاحظات فريق العمل والمتابعة (CRM Notes)</label>
            <textarea v-model="selectedLead.admin_notes" class="form-textarea" rows="3" placeholder="أضف ملاحظات الاجتماع أو الاتصال..."></textarea>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">تحديث حالة الطلب</label>
              <select v-model="selectedLead.status" class="form-input">
                <option value="new">جديد (New)</option>
                <option value="contacted">تم التواصل وتحديد موعد (Contacted)</option>
                <option value="in_progress">قيد إعداد العرض والتنفيذ (In Progress)</option>
                <option value="converted">تم التحويل لعقد رسمي (Converted)</option>
                <option value="archived">مؤرشف / ملغي (Archived)</option>
              </select>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-cancel" @click="selectedLead = null">إغلاق</button>
          <button type="button" class="btn-save" @click="saveLeadNotes">حفظ التغييرات</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { InquiryService } from '../services/InquiryService';
import { useToast } from '../composables/useToast';
import { exportToExcel, exportToCsv, getTimestampedFilename } from '../utils/exporter';

const { success, error: toastError } = useToast();

const loading = ref(true);
const inquiries = ref([]);
const searchQuery = ref('');
const selectedStatus = ref('');
const selectedService = ref('');

const selectedLead = ref(null);

const newCount = computed(() => inquiries.value.filter(i => i.status === 'new').length);
const inProgressCount = computed(() => inquiries.value.filter(i => i.status === 'in_progress' || i.status === 'contacted').length);
const convertedCount = computed(() => inquiries.value.filter(i => i.status === 'converted').length);

const filteredInquiries = computed(() => {
  return inquiries.value.filter(lead => {
    const matchesSearch = !searchQuery.value ||
      lead.full_name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      lead.phone?.includes(searchQuery.value);
    const matchesStatus = !selectedStatus.value || lead.status === selectedStatus.value;
    const matchesService = !selectedService.value || (lead.service_type && lead.service_type.includes(selectedService.value));
    return matchesSearch && matchesStatus && matchesService;
  });
});

const fetchInquiries = async () => {
  loading.value = true;
  try {
    inquiries.value = await InquiryService.getAll();
  } catch (err) {
    console.error('Failed to fetch leads', err);
    toastError('تعذر تحميل طلبات واستفسارات العملاء');
  } finally {
    loading.value = false;
  }
};

const updateStatus = async (lead, newStatus) => {
  try {
    await InquiryService.updateStatus(lead.id, newStatus);
    lead.status = newStatus;
    success('تم تحديث حالة الطلب بنجاح');
  } catch (err) {
    console.error('Failed to update status', err);
    toastError('حدث خطأ أثناء تحديث حالة الطلب');
  }
};

const viewDetails = (lead) => {
  selectedLead.value = JSON.parse(JSON.stringify(lead));
};

const saveLeadNotes = async () => {
  if (!selectedLead.value) return;
  try {
    const updated = await InquiryService.update(selectedLead.value.id, selectedLead.value);
    const idx = inquiries.value.findIndex(i => i.id === selectedLead.value.id);
    if (idx !== -1) inquiries.value[idx] = updated;
    selectedLead.value = null;
    success('تم حفظ ملاحظات وبيانات الطلب');
  } catch (err) {
    console.error('Failed to save notes', err);
    toastError('حدث خطأ أثناء حفظ الملاحظات');
  }
};

const confirmDelete = async (lead) => {
  if (confirm(`هل أنت متأكد من حذف طلب العميل "${lead.full_name}"؟`)) {
    try {
      await InquiryService.delete(lead.id);
      inquiries.value = inquiries.value.filter(i => i.id !== lead.id);
      success('تم حذف الطلب بنجاح');
    } catch (err) {
      console.error('Failed to delete lead', err);
      toastError('حدث خطأ أثناء حذف الطلب');
    }
  }
};

// Export functionality
const showExportMenu = ref(false);
const isExporting = ref(false);
const exportMenuRef = ref(null);

const toggleExportMenu = () => {
  showExportMenu.value = !showExportMenu.value;
};

const handleOutsideClick = (e) => {
  if (exportMenuRef.value && !exportMenuRef.value.contains(e.target)) {
    showExportMenu.value = false;
  }
};

onMounted(() => {
  window.addEventListener('click', handleOutsideClick);
  fetchInquiries();
});

onUnmounted(() => {
  window.removeEventListener('click', handleOutsideClick);
});

const serviceNameMap = {
  'web-development': 'تطوير المواقع والمنصات',
  'mobile-apps': 'تطبيقات الهواتف الذكية',
  'erp-systems': 'أنظمة ERP السحابية',
  'tijara': 'نظام تجارة (Tijara)',
  'branding': 'الهوية البصرية والعلامة',
  'digital-marketing': 'التسويق الرقمي'
};

const statusNameMap = {
  'new': 'جديد (New)',
  'contacted': 'تم التواصل (Contacted)',
  'in_progress': 'قيد التنفيذ (In Progress)',
  'converted': 'تم التحويل لعقد (Converted)',
  'archived': 'مؤرشف (Archived)'
};

const leadExportColumns = [
  { header: 'رقم الطلب', key: 'id' },
  { header: 'اسم العميل', key: 'full_name' },
  { header: 'الشركة / المؤسسة', field: (l) => l.company || 'عميل فردي / ناشئ' },
  { header: 'البريد الإلكتروني', key: 'email' },
  { header: 'رقم الهاتف / واتساب', key: 'phone' },
  { header: 'الخدمة المطلوبة', field: (l) => l.service_name || serviceNameMap[l.service_type] || l.service_type || 'غير محدد' },
  { header: 'الميزانية المتوقعة', field: (l) => l.budget_range || 'غير محدد' },
  { header: 'حالة الطلب', field: (l) => statusNameMap[l.status] || l.status },
  { header: 'نطاق وتفاصيل المشروع', field: (l) => l.message || '-' },
  { header: 'ملاحظات فريق العمل (CRM)', field: (l) => l.admin_notes || '-' },
  { header: 'تاريخ الطلب', key: 'created_at' }
];

const handleExport = (format = 'xlsx') => {
  const dataToExport = filteredInquiries.value.length > 0 ? filteredInquiries.value : inquiries.value;
  if (!dataToExport || dataToExport.length === 0) {
    toastError('لا توجد طلبات لتصديرها حالياً');
    showExportMenu.value = false;
    return;
  }

  isExporting.value = true;
  showExportMenu.value = false;

  try {
    const filename = getTimestampedFilename('bekite_crm_leads', format);
    if (format === 'xlsx') {
      exportToExcel({
        data: dataToExport,
        columns: leadExportColumns,
        filename,
        sheetName: 'طلبات العملاء CRM'
      });
      success(`تم تصدير ${dataToExport.length} طلب إلى ملف Excel بنجاح!`);
    } else {
      exportToCsv({
        data: dataToExport,
        columns: leadExportColumns,
        filename
      });
      success(`تم تصدير ${dataToExport.length} طلب إلى ملف CSV بنجاح!`);
    }
  } catch (err) {
    console.error('Export failed:', err);
    toastError('حدث خطأ أثناء تصدير السجلات');
  } finally {
    isExporting.value = false;
  }
};
</script>

<style scoped>
.leads-page {
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

.header-counts {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.count-pill {
  font-size: 0.78rem;
  padding: 0.35rem 0.8rem;
  border-radius: 8px;
  font-weight: 700;
}
.badge-new { background: rgba(239, 68, 68, 0.12); color: #ef4444; }
.badge-prog { background: rgba(37, 99, 235, 0.12); color: #2563eb; }
.badge-conv { background: rgba(16, 185, 129, 0.12); color: #10b981; }

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

.table-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.table-responsive {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: right;
}

.data-table th {
  background: var(--table-header-bg);
  color: var(--text-muted);
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--border-color);
}

.data-table td {
  padding: 0.9rem 1rem;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.85rem;
  vertical-align: middle;
}

.client-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.client-avatar {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  background: rgba(124, 58, 237, 0.12);
  color: #7c3aed;
}

.client-meta {
  display: flex;
  flex-direction: column;
}

.client-name {
  font-weight: 800;
  color: var(--text-main);
}

.client-company {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.service-pill {
  font-size: 0.74rem;
  font-weight: 700;
  background: rgba(124, 58, 237, 0.08);
  color: #7c3aed;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
}

.budget-badge {
  font-size: 0.76rem;
  font-weight: 800;
  color: #059669;
  font-family: 'Outfit', sans-serif;
}

.contact-info-cell {
  display: flex;
  flex-direction: column;
  font-size: 0.76rem;
  font-family: 'Outfit', sans-serif;
}
.email-txt { color: var(--text-muted); font-size: 0.72rem; }

.td-date {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.status-select {
  padding: 0.35rem 0.65rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid transparent;
  cursor: pointer;
}
.status-new { background: rgba(239, 68, 68, 0.12); color: #ef4444; border-color: rgba(239, 68, 68, 0.2); }
.status-contacted { background: rgba(234, 88, 12, 0.12); color: #ea580c; border-color: rgba(234, 88, 12, 0.2); }
.status-in_progress { background: rgba(37, 99, 235, 0.12); color: #2563eb; border-color: rgba(37, 99, 235, 0.2); }
.status-converted { background: rgba(16, 185, 129, 0.12); color: #10b981; border-color: rgba(16, 185, 129, 0.2); }
.status-archived { background: rgba(100, 116, 139, 0.12); color: #64748b; border-color: rgba(100, 116, 139, 0.2); }

.actions-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-main);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.view-btn:hover { color: #7c3aed; border-color: #7c3aed; }
.delete-btn:hover { color: #ef4444; border-color: #ef4444; }

.state-row td {
  text-align: center;
  padding: 2.5rem;
  color: var(--text-muted);
}

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
.lead-modal-date {
  font-size: 0.72rem;
  color: var(--text-muted);
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

.info-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
  background: var(--bg-main);
  padding: 1rem;
  border-radius: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.info-label {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.info-val {
  font-size: 0.82rem;
  color: var(--text-main);
}

.text-purple { color: #7c3aed !important; }
.text-green { color: #059669 !important; }
.font-bold { font-weight: 800; }

.message-box {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  background: var(--bg-main);
  padding: 1rem;
  border-radius: 12px;
}

.msg-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-main);
}

.msg-content {
  font-size: 0.82rem;
  color: var(--text-muted);
  line-height: 1.5;
  white-space: pre-wrap;
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

/* Export Dropdown Styles */
.export-dropdown-wrapper {
  position: relative;
  margin-right: auto;
}
.export-btn {
  background: var(--card-bg, #ffffff);
  color: var(--text-main, #374151);
  border: 1px solid var(--border-color, #e5e7eb);
  padding: 0.6rem 1.1rem;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.25s ease;
  font-size: 0.85rem;
}
.export-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #111827;
}
.dropdown-arrow {
  transition: transform 0.2s ease;
}
.export-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 290px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  padding: 8px;
  z-index: 50;
  animation: fadeInMenu 0.15s ease-out;
}
@keyframes fadeInMenu {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}
.export-menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: right;
  transition: background 0.2s;
  font-family: inherit;
}
.export-menu-item:hover {
  background: #f5f3ff;
}
.export-icon {
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #f3f4f6;
  flex-shrink: 0;
}
.export-icon.xlsx {
  background: #ecfdf5;
  color: #107c41;
}
.export-icon.csv {
  background: #eff6ff;
  color: #0284c7;
}
.export-item-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.export-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #1f2937;
}
.export-desc {
  font-size: 0.75rem;
  color: #6b7280;
}
</style>
