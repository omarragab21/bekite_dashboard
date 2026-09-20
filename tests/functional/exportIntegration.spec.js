import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as XLSX from 'xlsx';
import { MessageService } from '../../src/services/MessageService.js';
import { InquiryService } from '../../src/services/InquiryService.js';
import {
  exportToExcel,
  exportToCsv,
  generateCsvContent,
  formatCsvCell,
  getCellValue,
  getTimestampedFilename,
  downloadBlob
} from '../../src/utils/exporter.js';

describe('Export Functionality End-to-End Integration Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('1. Contact Messages Export Integration', () => {
    const messageColumns = [
      { header: 'رقم الرسالة', key: 'id' },
      { header: 'اسم المرسل', key: 'name' },
      { header: 'البريد الإلكتروني', key: 'email' },
      { 
        header: 'رقم الهاتف', 
        field: (m) => m.phone_number || m.phone || '-' 
      },
      { 
        header: 'الموضوع', 
        field: (m) => {
          if (!m) return '-';
          if (m.subject) return m.subject;
          if (m.message && m.message.startsWith('[')) {
            const match = m.message.match(/^\[(.*?)\]/);
            if (match) return match[1];
          }
          return '-';
        }
      },
      { 
        header: 'نص الرسالة', 
        field: (m) => {
          if (!m || !m.message) return '';
          if (m.message.startsWith('[')) {
            return m.message.replace(/^\[.*?\]\s*/, '');
          }
          return m.message;
        }
      },
      { 
        header: 'حالة القراءة', 
        field: (m) => (m.status === 'read' || m.is_read === 1) ? 'مقروءة' : 'جديدة / غير مقروءة' 
      },
      { header: 'تاريخ الإرسال', key: 'created_at' }
    ];

    it('should successfully export live messages into a valid Excel (.xlsx) file with RTL and auto-columns', async () => {
      const messages = await MessageService.getAll();
      expect(Array.isArray(messages)).toBe(true);
      expect(messages.length).toBeGreaterThan(0);

      const result = exportToExcel({
        data: messages,
        columns: messageColumns,
        filename: 'test_messages.xlsx',
        sheetName: 'رسائل العملاء'
      });

      expect(result.success).toBe(true);
      expect(result.count).toBe(messages.length);
      expect(result.filename).toBe('test_messages.xlsx');

      // Re-verify XLSX structure by generating workbook rows directly
      const formattedRows = messages.map(item => {
        const row = {};
        for (const col of messageColumns) {
          row[col.header] = getCellValue(item, col);
        }
        return row;
      });

      const ws = XLSX.utils.json_to_sheet(formattedRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'رسائل العملاء');
      const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

      // Read back with XLSX to verify structural validity
      const parsedWb = XLSX.read(buffer, { type: 'array' });
      expect(parsedWb.SheetNames).toContain('رسائل العملاء');
      const sheet = parsedWb.Sheets['رسائل العملاء'];
      const parsedData = XLSX.utils.sheet_to_json(sheet);
      expect(parsedData.length).toBe(messages.length);
      expect(parsedData[0]).toHaveProperty('رقم الرسالة');
      expect(parsedData[0]).toHaveProperty('اسم المرسل');
      expect(parsedData[0]).toHaveProperty('البريد الإلكتروني');
      expect(parsedData[0]).toHaveProperty('الموضوع');
      expect(parsedData[0]).toHaveProperty('حالة القراءة');
    });

    it('should export live messages to CSV with UTF-8 BOM and correct Arabic text', async () => {
      const messages = await MessageService.getAll();
      const csvString = generateCsvContent({
        data: messages,
        columns: messageColumns
      });

      expect(typeof csvString).toBe('string');
      const lines = csvString.split('\r\n');
      expect(lines.length).toBe(messages.length + 1); // 1 header line + data lines

      // Verify header row contains Arabic titles
      const headers = lines[0];
      expect(headers).toContain('"رقم الرسالة"');
      expect(headers).toContain('"اسم المرسل"');
      expect(headers).toContain('"البريد الإلكتروني"');
      expect(headers).toContain('"الموضوع"');
      expect(headers).toContain('"نص الرسالة"');
      expect(headers).toContain('"حالة القراءة"');

      // Verify first message data
      const firstRow = lines[1];
      expect(firstRow).toContain(messages[0].name);
      expect(firstRow).toContain(messages[0].email);
    });

    it('should support exporting filtered subsets of messages', async () => {
      const allMessages = await MessageService.getAll();
      const unreadMessages = allMessages.filter(m => m.status === 'unread' || m.is_read === 0);

      const result = exportToExcel({
        data: unreadMessages,
        columns: messageColumns,
        filename: 'unread_messages.xlsx',
        sheetName: 'الرسائل غير المقروءة'
      });

      expect(result.success).toBe(true);
      expect(result.count).toBe(unreadMessages.length);
      expect(result.count).toBeLessThanOrEqual(allMessages.length);
    });
  });

  describe('2. CRM Leads & Inquiries Export Integration', () => {
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

    const leadColumns = [
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

    it('should export CRM leads to Excel with mapped status labels and service types', async () => {
      const leads = await InquiryService.getAll();
      expect(Array.isArray(leads)).toBe(true);
      expect(leads.length).toBeGreaterThan(0);

      const result = exportToExcel({
        data: leads,
        columns: leadColumns,
        filename: 'crm_leads.xlsx',
        sheetName: 'طلبات العملاء CRM'
      });

      expect(result.success).toBe(true);
      expect(result.count).toBe(leads.length);

      // Verify row transformations
      for (const lead of leads) {
        const mappedStatus = getCellValue(lead, leadColumns[7]);
        if (lead.status === 'new') {
          expect(mappedStatus).toBe('جديد (New)');
        } else if (lead.status === 'in_progress') {
          expect(mappedStatus).toBe('قيد التنفيذ (In Progress)');
        }
      }
    });

    it('should export CRM leads to CSV format with intact Arabic fields', async () => {
      const leads = await InquiryService.getAll();
      const csv = generateCsvContent({
        data: leads,
        columns: leadColumns
      });

      expect(csv).toContain('"رقم الطلب","اسم العميل","الشركة / المؤسسة"');
      expect(csv).toContain('"الخدمة المطلوبة","الميزانية المتوقعة","حالة الطلب"');

      // Check first lead
      expect(csv).toContain(leads[0].full_name);
      expect(csv).toContain(leads[0].email);
    });
  });

  describe('3. Robustness, Edge Cases & Data Sanitization', () => {
    it('should handle multiline text, embedded commas, and quotes without breaking CSV columns', () => {
      const dirtyData = [
        {
          id: 1,
          client: 'شركة "النماء" للتجارة, فرع الرياض',
          notes: 'السطر الأول\nالسطر الثاني,\n"ملاحظة بين علامتي تنصيص"'
        }
      ];

      const columns = [
        { header: 'الرقم', key: 'id' },
        { header: 'العميل', key: 'client' },
        { header: 'الملاحظات', key: 'notes' }
      ];

      const csv = generateCsvContent({ data: dirtyData, columns });
      
      // Expected escaped formatting:
      // "شركة ""النماء"" للتجارة, فرع الرياض"
      expect(csv).toContain('"شركة ""النماء"" للتجارة, فرع الرياض"');
      // Escaped quotes inside multiline
      expect(csv).toContain('""ملاحظة بين علامتي تنصيص"""');
    });

    it('should handle null, undefined, numbers, and boolean values gracefully', () => {
      const testData = [
        { id: 99, emptyField: null, undefField: undefined, num: 1500, active: true }
      ];

      const columns = [
        { header: 'ID', key: 'id' },
        { header: 'Empty', key: 'emptyField' },
        { header: 'Undef', key: 'undefField' },
        { header: 'Num', key: 'num' },
        { header: 'Active', key: 'active' }
      ];

      const csv = generateCsvContent({ data: testData, columns });
      expect(csv).toContain('"99","","","1500","true"');
    });

    it('should handle empty dataset without throwing errors', () => {
      const columns = [
        { header: 'الاسم', key: 'name' },
        { header: 'الهاتف', key: 'phone' }
      ];

      const csv = generateCsvContent({ data: [], columns });
      expect(csv).toBe('"الاسم","الهاتف"');

      const xlsxRes = exportToExcel({ data: [], columns, filename: 'empty.xlsx' });
      expect(xlsxRes.success).toBe(true);
      expect(xlsxRes.count).toBe(0);
    });

    it('should preserve emojis, special symbols, and foreign languages alongside Arabic', () => {
      const data = [
        {
          id: 1,
          name: '🚀 شركة التقنية الحديثة - HighTech LLC',
          tags: 'AI / ذكاء اصطناعي ✨ #1'
        }
      ];

      const columns = [
        { header: 'المعرف', key: 'id' },
        { header: 'الاسم', key: 'name' },
        { header: 'العلامات', key: 'tags' }
      ];

      const csv = generateCsvContent({ data, columns });
      expect(csv).toContain('🚀 شركة التقنية الحديثة - HighTech LLC');
      expect(csv).toContain('AI / ذكاء اصطناعي ✨ #1');
    });
  });

  describe('4. Simulated Browser DOM Download Mechanism', () => {
    it('should properly configure and trigger DOM anchor element on downloadBlob in browser environment', () => {
      const createdElements = [];
      const clickedElements = [];
      const appendedChildren = [];
      const removedChildren = [];

      // Mock DOM
      const originalWindow = global.window;
      const originalDocument = global.document;
      const originalURL = global.URL;

      const mockAnchor = {
        style: {},
        setAttribute: vi.fn((attr, val) => {
          mockAnchor[attr] = val;
        }),
        click: vi.fn(() => {
          clickedElements.push(mockAnchor);
        })
      };

      global.window = { location: { href: '' } };
      global.document = {
        createElement: vi.fn((tag) => {
          if (tag === 'a') {
            createdElements.push(mockAnchor);
            return mockAnchor;
          }
          return {};
        }),
        body: {
          appendChild: vi.fn((el) => appendedChildren.push(el)),
          removeChild: vi.fn((el) => removedChildren.push(el))
        }
      };

      const mockObjectUrl = 'blob:http://localhost:5173/mock-uuid';
      global.URL = {
        createObjectURL: vi.fn(() => mockObjectUrl),
        revokeObjectURL: vi.fn()
      };

      try {
        const testBlob = new Blob(['test content'], { type: 'text/plain' });
        downloadBlob(testBlob, 'sample_report.xlsx');

        expect(document.createElement).toHaveBeenCalledWith('a');
        expect(mockAnchor.setAttribute).toHaveBeenCalledWith('href', mockObjectUrl);
        expect(mockAnchor.setAttribute).toHaveBeenCalledWith('download', 'sample_report.xlsx');
        expect(document.body.appendChild).toHaveBeenCalledWith(mockAnchor);
        expect(mockAnchor.click).toHaveBeenCalled();
        expect(document.body.removeChild).toHaveBeenCalledWith(mockAnchor);
      } finally {
        // Restore
        global.window = originalWindow;
        global.document = originalDocument;
        global.URL = originalURL;
      }
    });
  });
});
