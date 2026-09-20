/**
 * Be Kite Dashboard - Universal Excel & CSV Exporter Utility
 * Supports real .xlsx files via SheetJS (xlsx) with auto-column width & RTL support
 * and RFC-4180 CSV with UTF-8 BOM (\uFEFF) for 100% Arabic text fidelity in Excel & Sheets.
 */
import * as XLSX from 'xlsx';

/**
 * Trigger browser file download from Blob
 * @param {Blob} blob 
 * @param {string} filename 
 */
export function downloadBlob(blob, filename) {
  if (typeof window === 'undefined' || typeof document === 'undefined' || !document.createElement) {
    return;
  }

  const url = typeof URL !== 'undefined' && URL.createObjectURL ? URL.createObjectURL(blob) : '';
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Format timestamp for filenames (e.g. 2026-09-19_16-45)
 * @param {string} prefix 
 * @param {string} ext 
 * @returns {string}
 */
export function getTimestampedFilename(prefix = 'export', ext = 'xlsx') {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${prefix}_${year}-${month}-${day}_${hours}-${minutes}.${ext.replace(/^\./, '')}`;
}

/**
 * Format a cell value according to RFC-4180 for CSV
 * @param {any} value 
 * @returns {string}
 */
export function formatCsvCell(value) {
  if (value === null || value === undefined) return '""';
  const str = String(value);
  // If string contains comma, double-quote, or newline, escape quotes and wrap in quotes
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Extract value from row based on column definition
 * @param {Object} row 
 * @param {Object} col 
 * @returns {any}
 */
export function getCellValue(row, col) {
  if (typeof col.transform === 'function') {
    const raw = col.key || col.field ? row[col.key || col.field] : undefined;
    return col.transform(raw, row);
  }
  if (typeof col.field === 'function') {
    return col.field(row);
  }
  const key = col.key || col.field;
  return key && row[key] !== undefined ? row[key] : '';
}

/**
 * Generate CSV string with UTF-8 BOM
 * @param {Object} options
 * @param {Array} options.data
 * @param {Array} options.columns
 * @returns {string}
 */
export function generateCsvContent({ data, columns }) {
  if (!Array.isArray(data) || !Array.isArray(columns)) return '';

  const headers = columns.map(c => formatCsvCell(c.header || c.label || c.key)).join(',');

  const rows = data.map(item => {
    return columns.map(col => {
      const val = getCellValue(item, col);
      return formatCsvCell(val);
    }).join(',');
  });

  return [headers, ...rows].join('\r\n');
}

/**
 * Export data to real CSV file with UTF-8 BOM for Arabic compatibility
 * @param {Object} options
 * @param {Array} options.data
 * @param {Array} options.columns
 * @param {string} [options.filename]
 */
export function exportToCsv({ data, columns, filename }) {
  const name = filename || getTimestampedFilename('export', 'csv');
  const csvContent = generateCsvContent({ data, columns });
  
  // \uFEFF is UTF-8 Byte Order Mark, critical for Arabic rendering in Excel
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, name);
  return { success: true, count: data.length, filename: name };
}

/**
 * Export data to real Excel (.xlsx) file with auto-width columns and RTL sheet
 * @param {Object} options
 * @param {Array} options.data
 * @param {Array} options.columns
 * @param {string} [options.filename]
 * @param {string} [options.sheetName]
 */
export function exportToExcel({ data, columns, filename, sheetName = 'السجلات' }) {
  const name = filename || getTimestampedFilename('export', 'xlsx');

  // Map data to array of objects with localized headers as keys
  const rows = data.map(item => {
    const rowObj = {};
    for (const col of columns) {
      const headerTitle = col.header || col.label || col.key || '';
      const cellVal = getCellValue(item, col);
      rowObj[headerTitle] = cellVal ?? '';
    }
    return rowObj;
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Auto-fit column widths
  const colWidths = columns.map(col => {
    const headerTitle = col.header || col.label || col.key || '';
    let maxLen = headerTitle.toString().length;
    for (const r of rows) {
      const cellText = r[headerTitle] !== undefined ? String(r[headerTitle]) : '';
      if (cellText.length > maxLen) {
        maxLen = Math.min(cellText.length, 55); // reasonable cap
      }
    }
    return { wch: Math.max(maxLen + 4, 12) };
  });
  worksheet['!cols'] = colWidths;

  // RTL Sheet mode for Arabic layout
  if (!worksheet['!views']) {
    worksheet['!views'] = [];
  }
  worksheet['!views'].push({ rightToLeft: true });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Generate binary XLSX buffer
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  downloadBlob(blob, name);
  return { success: true, count: data.length, filename: name };
}
