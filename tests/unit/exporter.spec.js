import { describe, it, expect, vi } from 'vitest';
import {
  formatCsvCell,
  getCellValue,
  generateCsvContent,
  getTimestampedFilename,
  exportToCsv,
  exportToExcel
} from '../../src/utils/exporter';

describe('Exporter Utility Suite', () => {
  it('correctly escapes and formats CSV cells with Arabic characters and quotes', () => {
    expect(formatCsvCell('مرحبا')).toBe('"مرحبا"');
    expect(formatCsvCell('نص يحتوي, على فاصلة')).toBe('"نص يحتوي, على فاصلة"');
    expect(formatCsvCell('نص "مقتبس"')).toBe('"نص ""مقتبس"""');
    expect(formatCsvCell(null)).toBe('""');
    expect(formatCsvCell(undefined)).toBe('""');
    expect(formatCsvCell(1234)).toBe('"1234"');
  });

  it('correctly extracts cell value using keys, fields, and transforms', () => {
    const row = { id: 101, full_name: 'أحمد علي', status: 'new' };
    
    // Direct key
    expect(getCellValue(row, { key: 'full_name' })).toBe('أحمد علي');
    
    // Transform function
    const colWithTransform = {
      key: 'status',
      transform: (val) => val === 'new' ? 'جديد' : 'غير معروف'
    };
    expect(getCellValue(row, colWithTransform)).toBe('جديد');

    // Field function
    const colWithFieldFunc = {
      field: (r) => `رقم: ${r.id}`
    };
    expect(getCellValue(row, colWithFieldFunc)).toBe('رقم: 101');
  });

  it('generates well-formed CSV content with headers and Arabic data', () => {
    const data = [
      { id: 1, name: 'سارة محمد', email: 'sara@example.com', notes: 'طلب مستعجل, يرجى التواصل' },
      { id: 2, name: 'خالد عمر', email: 'khaled@example.com', notes: 'عرض سعر "نظام تجارة"' }
    ];

    const columns = [
      { header: 'المعرف', key: 'id' },
      { header: 'الاسم', key: 'name' },
      { header: 'البريد', key: 'email' },
      { header: 'ملاحظات', key: 'notes' }
    ];

    const csv = generateCsvContent({ data, columns });
    expect(csv).toContain('"المعرف","الاسم","البريد","ملاحظات"');
    expect(csv).toContain('"1","سارة محمد","sara@example.com","طلب مستعجل, يرجى التواصل"');
    expect(csv).toContain('"2","خالد عمر","khaled@example.com","عرض سعر ""نظام تجارة"""');
  });

  it('generates a timestamped filename with correct extension', () => {
    const filenameXlsx = getTimestampedFilename('bekite_test', 'xlsx');
    expect(filenameXlsx).toMatch(/^bekite_test_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}\.xlsx$/);

    const filenameCsv = getTimestampedFilename('leads', 'csv');
    expect(filenameCsv).toMatch(/^leads_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}\.csv$/);
  });
});
