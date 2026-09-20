<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { MessageService } from '../services';
import { exportToExcel, exportToCsv, getTimestampedFilename } from '../utils/exporter';


// State
const rawMessages = ref([]);
const messages = ref([]);
const loading = ref(false);
const searchQuery = ref('');
const statusFilter = ref('');
const showViewModal = ref(false);
const currentMessage = ref(null);

let unsubscribe = null;

// Filter messages locally based on search query and status
const applyFilter = () => {
    let list = [...rawMessages.value];
    if (statusFilter.value) {
        list = list.filter(m => m.status === statusFilter.value);
    }
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase().trim();
        list = list.filter(m =>
            (m.name && m.name.toLowerCase().includes(q)) ||
            (m.email && m.email.toLowerCase().includes(q)) ||
            ((m.phone_number || m.phone) && String(m.phone_number || m.phone).includes(q)) ||
            (m.subject && m.subject.toLowerCase().includes(q)) ||
            (m.message && m.message.toLowerCase().includes(q)) ||
            (m.company && m.company.toLowerCase().includes(q)) ||
            (m.service && m.service.toLowerCase().includes(q))
        );
    }
    messages.value = list;
};

// New Message Modal State
const showNewMessageModal = ref(false);
const isSubmittingMessage = ref(false);
const newMessageForm = ref({
    name: '',
    email: '',
    phone_number: '',
    subject: 'استفسار عام',
    message: ''
});

// Fetch Messages (manual refresh or initial load)
const fetchMessages = async () => {
    loading.value = true;
    try {
        const data = await MessageService.getAll();
        rawMessages.value = data;
        applyFilter();
    } catch (error) {
        console.error('Failed to fetch messages', error);
        triggerAlert('فشل تحميل الرسائل', 'error');
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loading.value = true;
    // Real-time Firestore streaming
    unsubscribe = MessageService.subscribeMessages((liveMsgs) => {
        rawMessages.value = liveMsgs;
        applyFilter();
        loading.value = false;
    });
});

onUnmounted(() => {
    if (unsubscribe) {
        unsubscribe();
    }
});

// Actions
const openViewModal = async (message) => {
    currentMessage.value = message;
    showViewModal.value = true;
    
    // Auto mark as read in Firebase if it was unread
    if (message.status === 'unread' || message.is_read === 0) {
        try {
            await MessageService.updateStatus(message.id, 'read');
            message.status = 'read';
            message.is_read = 1;
        } catch (error) {
            console.error('Failed to mark as read in Firebase', error);
        }
    }
};

const openCreateModal = () => {
    newMessageForm.value = {
        name: '',
        email: '',
        phone_number: '',
        subject: 'استفسار عام',
        message: ''
    };
    showNewMessageModal.value = true;
};

const handleSendMessage = async () => {
    if (!newMessageForm.value.name || !newMessageForm.value.email || !newMessageForm.value.message) {
        triggerAlert('يرجى تعبئة الاسم والبريد الإلكتروني والرسالة', 'error');
        return;
    }
    isSubmittingMessage.value = true;
    try {
        const fullMessage = newMessageForm.value.subject
            ? `[${newMessageForm.value.subject}] ${newMessageForm.value.message.trim()}`
            : newMessageForm.value.message.trim();

        await MessageService.submitPublicMessage({
            name: newMessageForm.value.name.trim(),
            email: newMessageForm.value.email.trim(),
            phone_number: newMessageForm.value.phone_number ? newMessageForm.value.phone_number.trim() : null,
            subject: newMessageForm.value.subject,
            message: fullMessage
        });

        triggerAlert('تم إرسال الرسالة بنجاح وحفظها في Firebase');
        showNewMessageModal.value = false;
    } catch (error) {
        console.error('Failed to send message', error);
        triggerAlert(error.message || 'فشل إرسال الرسالة', 'error');
    } finally {
        isSubmittingMessage.value = false;
    }
};

const confirmDelete = async (message) => {
    if (confirm(`هل أنت متأكد من حذف رسالة "${message.name || message.sender_name}"؟`)) {
        try {
            await MessageService.delete(message.id);
            triggerAlert('تم حذف الرسالة بنجاح من Firebase');
        } catch (error) {
            triggerAlert('فشل عملية الحذف من Firebase', 'error');
        }
    }
};

const toggleReadStatus = async (message) => {
    try {
        const newStatus = (message.status === 'read' || message.is_read === 1) ? 'unread' : 'read';
        await MessageService.updateStatus(message.id, newStatus);
        message.status = newStatus;
        message.is_read = newStatus === 'read' ? 1 : 0;
        triggerAlert(newStatus === 'read' ? 'تم تعيين الرسالة كمقروءة' : 'تم تعيين الرسالة كغير مقروءة');
    } catch (error) {
        triggerAlert('فشل تحديث الحالة في Firebase', 'error');
    }
};

// Helpers computed from rawMessages (live from Firebase)
const totalMessages = computed(() => rawMessages.value.length);
const unreadCount = computed(() => rawMessages.value.filter(m => m.status === 'unread' || m.is_read === 0).length);
const readCount = computed(() => rawMessages.value.filter(m => m.status === 'read' || m.is_read === 1).length);

const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const getSubject = (msg) => {
    if (!msg) return '-';
    if (msg.subject) return msg.subject;
    if (msg.message && msg.message.startsWith('[')) {
        const match = msg.message.match(/^\[(.*?)\]/);
        if (match) return match[1];
    }
    return '-';
};

const getCleanMessage = (msg) => {
    if (!msg || !msg.message) return '';
    if (msg.message.startsWith('[')) {
        return msg.message.replace(/^\[.*?\]\s*/, '');
    }
    return msg.message;
};

// Export Functionality
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
});

onUnmounted(() => {
    window.removeEventListener('click', handleOutsideClick);
});

const messageExportColumns = [
    { header: 'رقم الرسالة', key: 'id' },
    { header: 'اسم المرسل', key: 'name' },
    { header: 'البريد الإلكتروني', key: 'email' },
    { 
        header: 'رقم الهاتف', 
        field: (m) => m.phone_number || m.phone || '-' 
    },
    { 
        header: 'الموضوع', 
        field: (m) => getSubject(m) 
    },
    { 
        header: 'نص الرسالة', 
        field: (m) => getCleanMessage(m) 
    },
    { 
        header: 'حالة القراءة', 
        field: (m) => (m.status === 'read' || m.is_read === 1) ? 'مقروءة' : 'جديدة / غير مقروءة' 
    },
    { 
        header: 'تاريخ الإرسال', 
        field: (m) => formatDate(m.created_at) 
    }
];

const handleExport = (format = 'xlsx') => {
    if (!messages.value || messages.value.length === 0) {
        triggerAlert('لا توجد رسائل لتصديرها حالياً', 'error');
        showExportMenu.value = false;
        return;
    }

    isExporting.value = true;
    showExportMenu.value = false;

    try {
        const filename = getTimestampedFilename('bekite_messages', format);
        if (format === 'xlsx') {
            exportToExcel({
                data: messages.value,
                columns: messageExportColumns,
                filename,
                sheetName: 'رسائل العملاء'
            });
            triggerAlert(`تم تصدير ${messages.value.length} رسالة إلى ملف Excel بنجاح!`, 'success');
        } else {
            exportToCsv({
                data: messages.value,
                columns: messageExportColumns,
                filename
            });
            triggerAlert(`تم تصدير ${messages.value.length} رسالة إلى ملف CSV بنجاح!`, 'success');
        }
    } catch (err) {
        console.error('Export failed:', err);
        triggerAlert('حدث خطأ أثناء تصدير السجلات', 'error');
    } finally {
        isExporting.value = false;
    }
};

// Alert State
const showAlert = ref(false);
const alertMessage = ref('');
const alertType = ref('success');

const triggerAlert = (message, type = 'success') => {
    alertMessage.value = message;
    alertType.value = type;
    showAlert.value = true;
    setTimeout(() => showAlert.value = false, 3000);
};
</script>

<template>
  <div class="messages-page p-6">
    <!-- Header -->
    <div class="header-section mb-6">
        <div class="page-title-area">
          <div class="title-with-icon">
             <div class="icon-box">
                <i class="fas fa-comments text-xl"></i>
             </div>
             <div>
                <h1>رسائل العملاء</h1>
                <p>إدارة رسائل العملاء من نموذج الاتصال في الموقع</p>
             </div>
          </div>
       </div>

       <div class="left-actions">
           <button class="refresh-btn" @click="fetchMessages" :disabled="loading" title="تحديث القائمة">
              <i class="fas fa-sync-alt" :class="{ 'fa-spin': loading }"></i>
              <span>تحديث</span>
           </button>
           <button class="create-btn" @click="openCreateModal">
              <i class="fas fa-plus"></i>
              <span>إرسال رسالة جديدة</span>
           </button>
           <!-- Export Dropdown -->
           <div class="export-dropdown-wrapper" ref="exportMenuRef">
              <button class="export-btn" @click.stop="toggleExportMenu" :disabled="isExporting" title="تصدير السجلات">
                 <i class="fas fa-file-export"></i>
                 <span>{{ isExporting ? 'جاري التصدير...' : 'تصدير البيانات' }}</span>
                 <i class="fas fa-chevron-down dropdown-arrow" :class="{ 'rotate-180': showExportMenu }"></i>
              </button>

              <div v-if="showExportMenu" class="export-menu">
                 <button class="export-menu-item" @click="handleExport('xlsx')">
                    <span class="export-icon xlsx">
                       <i class="fas fa-file-excel"></i>
                    </span>
                    <div class="export-item-meta">
                       <span class="export-title">تصدير كملف Excel (.xlsx)</span>
                       <span class="export-desc">جدول رسمي منسق يدعم اللغة العربية</span>
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
    </div>

    <!-- Stats Bar -->
    <div class="stats-grid mb-6">
       <div class="stat-card">
          <div class="stat-icon total">
             <i class="fas fa-inbox text-lg"></i>
          </div>
          <div class="stat-info">
             <span class="stat-val">{{ totalMessages }}</span>
             <span class="stat-label">إجمالي الرسائل</span>
          </div>
       </div>
       <div class="stat-card">
          <div class="stat-icon unread">
             <i class="fas fa-envelope text-lg"></i>
          </div>
          <div class="stat-info">
             <span class="stat-val">{{ unreadCount }}</span>
             <span class="stat-label">غير مقروءة</span>
          </div>
       </div>
       <div class="stat-card">
          <div class="stat-icon read">
             <i class="fas fa-envelope-open-text text-lg"></i>
          </div>
          <div class="stat-info">
             <span class="stat-val">{{ readCount }}</span>
             <span class="stat-label">مقروءة</span>
          </div>
       </div>
    </div>

    <!-- Filters -->
    <div class="filters-card shadow-sm mb-6">
       <div class="filter-row">
           <div class="search-group flex-1">
              <div class="search-input-wrapper">
                 <i class="fas fa-search search-icon"></i>
                 <input type="text" v-model="searchQuery" @input="applyFilter" placeholder="البحث في الرسائل..." class="search-input" />
              </div>
           </div>
          <div class="filter-group">
             <select v-model="statusFilter" @change="applyFilter" class="filter-select">
                <option value="">جميع الرسائل</option>
                <option value="unread">غير مقروءة</option>
                <option value="read">مقروءة</option>
             </select>
          </div>
       </div>
    </div>

    <!-- Table -->
    <div class="table-container shadow-sm">
       <table class="data-table">
          <thead>
             <tr>
                <th class="col-name text-right">الاسم</th>
                <th class="col-phone">رقم الجوال</th>
                <th class="col-email">البريد الإلكتروني</th>
                <th class="col-subject">الموضوع</th>
                <th class="col-status">الحالة</th>
                <th class="col-actions">الإجراءات</th>
             </tr>
          </thead>
          <tbody>
             <tr v-if="loading" class="state-row"><td colspan="6">جاري التحميل...</td></tr>
             <tr v-else-if="messages.length === 0" class="state-row"><td colspan="6">لا توجد رسائل حالياً</td></tr>
             <template v-else>
                <tr v-for="msg in messages" :key="msg.id" class="data-row" :class="{ 'is-unread': msg.status === 'unread' }">
                   <td class="col-name text-right">
                      <div class="name-cell">
                         <span class="unread-dot" v-if="msg.status === 'unread'"></span>
                         <span class="sender-name">{{ msg.name }}</span>
                      </div>
                   </td>
                   <td class="col-phone ltr-text">{{ msg.phone_number || msg.phone || '-' }}</td>
                   <td class="col-email ltr-text">{{ msg.email || '-' }}</td>
                   <td class="col-subject">{{ getSubject(msg) }}</td>
                   <td class="col-status">
                      <button
                         type="button"
                         :class="['status-badge-table', msg.status]"
                         @click="toggleReadStatus(msg)"
                         :title="msg.status === 'read' ? 'انقر للتعيين كغير مقروء' : 'انقر للتعيين كمقروء'"
                      >
                         <span class="badge-dot"></span>
                         <span class="badge-text">{{ msg.status === 'read' ? 'مقروءة' : 'غير مقروءة' }}</span>
                      </button>
                   </td>
                   <td class="col-actions">
                      <div class="actions-group">
                         <button class="action-btn view" title="عرض التفاصيل" @click="openViewModal(msg)">
                            <i class="fas fa-eye"></i>
                         </button>
                         <button class="action-btn delete" title="حذف" @click="confirmDelete(msg)">
                            <i class="fas fa-trash"></i>
                         </button>
                      </div>
                   </td>
                </tr>
             </template>
          </tbody>
       </table>
    </div>

    <!-- View Modal -->
    <div class="modal-overlay" v-if="showViewModal" @click.self="showViewModal = false">
       <div class="modal-content info-modal fade-in">
          <div class="modal-header">
             <button class="close-modal-btn" @click="showViewModal = false" title="إغلاق">
                <i class="fas fa-times"></i>
             </button>
             <h2>تفاصيل الرسالة</h2>
             <p>معلومات مرسلة من نموذج الاتصال</p>
          </div>
          
          <div class="modal-body" v-if="currentMessage">
             <div class="msg-detail-grid">
                <div class="detail-item">
                   <label>الاسم:</label>
                   <span>{{ currentMessage.name }}</span>
                </div>
                <div class="detail-item">
                   <label>رقم الجوال:</label>
                   <span class="ltr-text" style="text-align: right !important;">{{ currentMessage.phone_number || currentMessage.phone || '-' }}</span>
                </div>
                <div class="detail-item">
                   <label>البريد الإلكتروني:</label>
                   <span>{{ currentMessage.email || '-' }}</span>
                </div>
                <div class="detail-item">
                   <label>التاريخ والوقت:</label>
                   <span>{{ formatDate(currentMessage.created_at) }}</span>
                </div>
                <div class="detail-item" v-if="currentMessage.company">
                   <label>الشركة / المؤسسة:</label>
                   <span>{{ currentMessage.company }}</span>
                </div>
                <div class="detail-item" v-if="currentMessage.service">
                   <label>الخدمة المطلوبة:</label>
                   <span>{{ currentMessage.service }}</span>
                </div>
                <div class="detail-item" v-if="currentMessage.budget">
                   <label>الميزانية المقدرة:</label>
                   <span>{{ currentMessage.budget }}</span>
                </div>
                <div class="detail-item" v-if="currentMessage.contact_method">
                   <label>طريقة التواصل المفضلة:</label>
                   <span>{{ currentMessage.contact_method }}</span>
                </div>
                <div class="detail-item full-width mt-4">
                   <label>الموضوع:</label>
                   <span class="subject-text">{{ getSubject(currentMessage) }}</span>
                </div>
                <div class="detail-item full-width">
                   <label>الرسالة:</label>
                   <div class="message-content-box">
                      {{ getCleanMessage(currentMessage) }}
                   </div>
                </div>
                 <div class="detail-item mt-4">
                    <label>حالة الرسالة:</label>
                    <div class="modal-status-box">
                       <span :class="['status-badge-table', currentMessage.status]">
                          <span class="badge-dot"></span>
                          <span class="badge-text">{{ currentMessage.status === 'read' ? 'مقروءة' : 'غير مقروءة' }}</span>
                       </span>
                       <button type="button" class="btn-toggle-modal" @click="toggleReadStatus(currentMessage)">
                          <i :class="currentMessage.status === 'read' ? 'fas fa-envelope' : 'fas fa-envelope-open'"></i>
                          <span>{{ currentMessage.status === 'read' ? 'تعيين كغير مقروءة' : 'تعيين كمقروءة' }}</span>
                       </button>
                    </div>
                 </div>
             </div>
          </div>
          
          <div class="modal-footer">
             <button class="btn-close-alt" @click="showViewModal = false">
                <i class="fas fa-times"></i>
                <span>إغلاق</span>
             </button>
          </div>
       </div>
    </div>

    <!-- Send New Message Modal -->
    <div class="modal-overlay" v-if="showNewMessageModal" @click.self="showNewMessageModal = false">
       <div class="modal-content info-modal fade-in">
          <div class="modal-header">
             <button class="close-modal-btn" @click="showNewMessageModal = false" title="إغلاق">
                <i class="fas fa-times"></i>
             </button>
             <h2>إرسال رسالة تواصل جديدة</h2>
             <p>إرسال رسالة مباشرة عبر واجهة الـ API العامة</p>
          </div>
          
          <form @submit.prevent="handleSendMessage" class="modal-body form-body">
             <div class="modal-form-group mb-3">
                <label class="form-label">الاسم الكامل <span class="req">*</span></label>
                <input type="text" v-model="newMessageForm.name" required placeholder="مثال: أحمد محمد" class="modal-input" />
             </div>
             <div class="form-grid-2 mb-3">
                <div class="modal-form-group">
                   <label class="form-label">البريد الإلكتروني <span class="req">*</span></label>
                   <input type="email" v-model="newMessageForm.email" required placeholder="name@example.com" class="modal-input ltr-text" />
                </div>
                <div class="modal-form-group">
                   <label class="form-label">رقم الجوال</label>
                   <input type="tel" v-model="newMessageForm.phone_number" placeholder="+962 79 123 4567" class="modal-input ltr-text" />
                </div>
             </div>
             <div class="modal-form-group mb-3">
                <label class="form-label">الموضوع</label>
                <select v-model="newMessageForm.subject" class="modal-input">
                   <option value="استفسار عام">استفسار عام</option>
                   <option value="طلب خاص">طلب خاص</option>
                   <option value="شكوى">شكوى</option>
                   <option value="اقتراح">اقتراح</option>
                </select>
             </div>
             <div class="modal-form-group mb-4">
                <label class="form-label">نص الرسالة <span class="req">*</span></label>
                <textarea v-model="newMessageForm.message" required rows="4" placeholder="اكتب نص الرسالة هنا..." class="modal-input modal-textarea"></textarea>
             </div>
             <div class="modal-footer-form">
                <button type="button" class="btn-cancel" @click="showNewMessageModal = false">
                   <i class="fas fa-times"></i>
                   <span>إلغاء</span>
                </button>
                <button type="submit" class="btn-submit-msg" :disabled="isSubmittingMessage">
                   <i v-if="isSubmittingMessage" class="fas fa-spinner fa-spin"></i>
                   <i v-else class="fas fa-paper-plane"></i>
                   <span v-if="isSubmittingMessage">جاري الإرسال عبر الـ API...</span>
                   <span v-else>إرسال الرسالة</span>
                </button>
             </div>
          </form>
       </div>
    </div>

    <!-- Alert Toast -->
    <div v-if="showAlert" :class="['alert-toast', alertType]">
       {{ alertMessage }}
    </div>
  </div>
</template>

<style scoped>
.messages-page { font-family: 'Cairo', sans-serif; direction: rtl; }

/* Header Section */
.header-section { display: flex; justify-content: space-between; align-items: center; }
.export-dropdown-wrapper { position: relative; }
.export-btn { background: white; color: #4b5563; border: 1px solid #e5e7eb; padding: 10px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.3s; font-size: 0.875rem; }
.export-btn:hover { background: #f9fafb; border-color: #d1d5db; color: #111827; }
.dropdown-arrow { transition: transform 0.2s ease; font-size: 0.75rem; }
.dropdown-arrow.rotate-180 { transform: rotate(180deg); }
.export-menu { position: absolute; top: calc(100% + 8px); left: 0; min-width: 280px; background: white; border: 1px solid #e5e7eb; border-radius: 12px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); padding: 8px; z-index: 50; animation: fadeInMenu 0.15s ease-out; }
@keyframes fadeInMenu { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
.export-menu-item { width: 100%; display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 8px; border: none; background: transparent; cursor: pointer; text-align: right; transition: background 0.2s; font-family: inherit; }
.export-menu-item:hover { background: #faf5ff; }
.export-icon { font-size: 1.15rem; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 8px; background: #f3f4f6; flex-shrink: 0; }
.export-icon.xlsx { background: #ecfdf5; color: #107c41; }
.export-icon.csv { background: #eff6ff; color: #0284c7; }
.export-item-meta { display: flex; flex-direction: column; gap: 2px; }
.export-title { font-size: 0.875rem; font-weight: 700; color: #1f2937; }
.export-desc { font-size: 0.75rem; color: #6b7280; }

.page-title-area h1 { font-size: 1.5rem; font-weight: 800; color: #1f2937; margin: 0; }
.page-title-area p { color: #6b7280; font-size: 0.875rem; margin: 0; }
.title-with-icon { display: flex; align-items: center; gap: 12px; }
.icon-box { background: rgba(79, 0, 140, 0.08); color: #4f008c; width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; }

/* Stats Bar */
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.stat-card { background: white; border-radius: 12px; padding: 20px; border: 1px solid #e5e7eb; display: flex; align-items: center; gap: 15px; }
.stat-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; }
.stat-icon.total { background: rgba(79, 0, 140, 0.08); color: #4f008c; }
.stat-icon.unread { background: #fff1f2; color: #e11d48; }
.stat-icon.read { background: #f0fdf4; color: #16a34a; }
.stat-val { display: block; font-size: 1.25rem; font-weight: 800; color: #111827; }
.stat-label { font-size: 0.8rem; color: #6b7280; }

/* Filters Card */
.filters-card { background: white; border-radius: 12px; padding: 8px; border: 1px solid #e5e7eb; }
.filter-row { display: flex; gap: 12px; align-items: center; }
.filter-select { padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 8px; outline: none; background: #f9fafb; color: #4b5563; font-family: inherit; font-size: 0.875rem; cursor: pointer; }
.search-input-wrapper { position: relative; width: 100%; }
.search-icon { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: #9ca3af; font-size: 0.95rem; }
.search-input { width: 100%; padding: 10px 44px 10px 12px; border: 1px solid #e5e7eb; border-radius: 8px; outline: none; transition: 0.3s; font-family: inherit; font-size: 0.875rem; background: #fff; }
.search-input:focus { border-color: #4f008c; box-shadow: 0 0 0 3px rgba(79, 0, 140, 0.12); }
.flex-1 { flex: 1; }

/* Table Section */
.table-container { background: white; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th { background: #f9fafb; padding: 14px; font-weight: 700; color: #4b5563; font-size: 0.85rem; border-bottom: 2px solid #f3f4f6; text-align: center; }
.data-table td { padding: 14px; border-bottom: 1px solid #f3f4f6; vertical-align: middle; color: #374151; font-size: 0.875rem; text-align: center; }

.data-row { transition: 0.2s; }
.data-row:hover { background: #faf5ff; }
.data-row.is-unread { background: #fffbfb; }

.name-cell { display: flex; align-items: center; gap: 8px; justify-content: flex-start; }
.unread-dot { width: 8px; height: 8px; border-radius: 50%; background: #ef4444; box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.25); flex-shrink: 0; }
.sender-name { font-weight: 700; color: #111827; }

.ltr-text { direction: ltr; text-align: left; }

.col-status {
  width: 140px;
  min-width: 140px;
  text-align: center;
  white-space: nowrap !important;
}

.status-badge-table {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 800;
  white-space: nowrap !important;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  line-height: 1;
  user-select: none;
}

.status-badge-table .badge-text {
  white-space: nowrap !important;
  display: inline-block;
}

.badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}

/* UNREAD: RED */
.status-badge-table.unread {
  background: rgba(239, 68, 68, 0.1) !important;
  color: #ef4444 !important;
  border-color: rgba(239, 68, 68, 0.25) !important;
}
.status-badge-table.unread:hover {
  background: rgba(239, 68, 68, 0.18) !important;
  border-color: rgba(239, 68, 68, 0.45) !important;
}
.status-badge-table.unread .badge-dot {
  background: #ef4444 !important;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.25);
  animation: pulse-red 2s infinite;
}

/* READ: GREEN */
.status-badge-table.read {
  background: rgba(16, 185, 129, 0.1) !important;
  color: #10b981 !important;
  border-color: rgba(16, 185, 129, 0.25) !important;
}
.status-badge-table.read:hover {
  background: rgba(16, 185, 129, 0.18) !important;
  border-color: rgba(16, 185, 129, 0.45) !important;
}
.status-badge-table.read .badge-dot {
  background: #10b981 !important;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

@keyframes pulse-red {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
  70% { transform: scale(1); box-shadow: 0 0 0 4px rgba(239, 68, 68, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

.modal-status-box {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
}
.btn-toggle-modal {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #4b5563;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
  white-space: nowrap;
}
.btn-toggle-modal:hover {
  background: #f3f4f6;
  color: #111827;
}

.actions-group { display: flex; gap: 8px; justify-content: center; align-items: center; }
.action-btn { width: 32px; height: 32px; border-radius: 6px; border: none; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; font-size: 0.85rem; padding: 0; line-height: 1; flex-shrink: 0; }
.action-btn i { font-size: 0.85rem; line-height: 1; display: inline-block; }
.action-btn.view { background: #f5f3ff; color: #7c3aed; }
.action-btn.view:hover { background: #ede9fe; color: #4f008c; }
.action-btn.delete { background: #fef2f2; color: #ef4444; }
.action-btn.delete:hover { background: #fee2e2; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.modal-content { background: white; border-radius: 20px; overflow: hidden; width: 100%; max-width: 550px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
.fade-in { animation: fadeIn 0.3s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.modal-header { padding: 24px; border-bottom: 1px solid #f3f4f6; position: relative; }
.close-modal-btn {
  position: absolute;
  left: 24px;
  top: 24px;
  border: none;
  background: #f3f4f6;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
}
.close-modal-btn:hover {
  background: #e5e7eb;
  color: #111827;
}
.modal-header h2 { font-weight: 800; font-size: 1.25rem; margin: 0 0 4px 0; color: #111827; }
.modal-header p { color: #6b7280; font-size: 0.875rem; margin: 0; }

.modal-body { padding: 24px; }
.msg-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.detail-item { display: flex; flex-direction: column; gap: 4px; }
.detail-item label { font-size: 0.75rem; font-weight: 700; color: #9ca3af; text-transform: uppercase; }
.detail-item span { font-weight: 700; color: #374151; font-size: 0.95rem; }
.full-width { grid-column: span 2; }
.message-content-box { background: #f9fafb; padding: 16px; border-radius: 12px; border: 1px solid #e5e7eb; min-height: 100px; color: #4b5563; line-height: 1.6; font-size: 0.9rem; margin-top: 4px; }
.subject-text { color: #111827 !important; font-size: 1.05rem !important; }

.modal-footer { padding: 20px 24px; background: #f9fafb; border-top: 1px solid #f3f4f6; text-align: left; }
.btn-close-alt {
  background: #4f008c;
  color: white;
  border: none;
  padding: 10px 26px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
}
.btn-close-alt:hover { background: #370062; }

/* Alert */
.alert-toast { position: fixed; top: 24px; left: 50%; transform: translateX(-50%); padding: 12px 24px; border-radius: 10px; color: white; font-weight: 700; z-index: 2000; box-shadow: 0 10px 15px rgba(0,0,0,0.1); animation: toastIn 0.3s ease-out; }
@keyframes toastIn { from { top: -50px; opacity: 0; } to { top: 24px; opacity: 1; } }
.alert-toast.success { background: #10b981; }
.alert-toast.error { background: #ef4444; }

/* Utils */
.mb-6 { margin-bottom: 24px !important; }
.mb-4 { margin-bottom: 16px !important; }
.mt-4 { margin-top: 16px !important; }
.full-width { grid-column: span 2; }

/* Actions in Header */
.left-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.create-btn {
  background: linear-gradient(135deg, #4f008c, #7c3aed);
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  box-shadow: 0 4px 14px rgba(79, 0, 140, 0.28);
}
.create-btn:hover {
  background: linear-gradient(135deg, #3f0070, #6d28d9);
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(79, 0, 140, 0.38);
}
.refresh-btn { background: white; color: #4b5563; border: 1px solid #e5e7eb; padding: 10px 14px; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: 0.2s; font-size: 0.875rem; }
.refresh-btn:hover { background: #f9fafb; border-color: #d1d5db; color: #111827; }

/* Modal Form Styles */
.form-body { padding: 20px 24px; }
.modal-form-group { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 0.85rem; font-weight: 700; color: #374151; }
.req { color: #ef4444; }
.form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.modal-input { width: 100%; padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 8px; font-family: inherit; font-size: 0.9rem; outline: none; transition: 0.2s; background: #fff; }
.modal-input:focus { border-color: #4f008c; box-shadow: 0 0 0 3px rgba(79, 0, 140, 0.12); }
.modal-textarea { resize: vertical; }
.modal-footer-form { display: flex; justify-content: flex-end; gap: 12px; padding-top: 16px; border-top: 1px solid #f3f4f6; margin-top: 8px; }
.btn-cancel {
  background: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.btn-cancel:hover { background: #e5e7eb; color: #111827; }
.btn-submit-msg {
  background: linear-gradient(135deg, #4f008c, #7c3aed);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(79, 0, 140, 0.25);
}
.btn-submit-msg:hover:not(:disabled) {
  background: linear-gradient(135deg, #3f0070, #6d28d9);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(79, 0, 140, 0.35);
}
.btn-submit-msg:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

/* Responsive */
@media (max-width: 768px) {
    .msg-detail-grid { grid-template-columns: 1fr; }
    .form-grid-2 { grid-template-columns: 1fr; }
    .header-section { flex-direction: column-reverse; gap: 16px; align-items: stretch; }
    .left-actions { justify-content: flex-start; }
    .col-phone, .col-email { display: none; }
}
</style>
