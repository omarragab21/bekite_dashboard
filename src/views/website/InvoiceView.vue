<template>
  <div class="invoice-page">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>{{ t('invoice.loading') }}</p>
    </div>

    <div class="invoice-box" v-else-if="order">

      <!-- Header -->
      <div class="invoice-header">
        <div class="header-info">
          <h2 class="invoice-title">{{ t('invoice.title') }}</h2>
          <p class="invoice-detail">{{ t('checkout.order_number') }}: {{ order.orderNumber || order.order_number || order.id }}</p>
          <p class="invoice-detail">{{ t('invoice.date') }}: {{ order.date }}</p>
        </div>

        <div class="logo">
          <img v-if="siteLogo" :src="siteLogo" :alt="siteName" class="logo-img" />
          <h3 class="logo-text">{{ siteName }}</h3>
        </div>
      </div>

      <!-- Customer -->
      <div class="invoice-customer">
        <h4 class="section-title">{{ t('invoice.customer_info') }}</h4>
        <p class="customer-info">{{ order.customerName || order.customer?.name }}</p>
        <p class="customer-info">{{ order.customerPhone || order.customer?.phone }}</p>
        <p class="customer-info">{{ order.customerEmail || order.customer?.email }}</p>
        <p class="customer-info">{{ order.customerAddress || order.shipping_address }}</p>
      </div>

      <!-- Table -->
      <table class="invoice-table">
        <thead>
          <tr>
            <th>{{ t('product.title') }}</th>
            <th>{{ t('cart.quantity') }}</th>
            <th>{{ t('products.price') }}</th>
            <th>{{ t('cart.total') }}</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in (order.items || order.products)" :key="item.id">
            <td>{{ localized(item.product || item, 'name') }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ (item.price || item.unit_price).toFixed(2) }} {{ currency }}</td>
            <td>{{ ((item.price || item.unit_price) * item.quantity).toFixed(2) }} {{ currency }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Totals -->
      <div class="invoice-totals">
        <div class="total-row">
          <span>{{ t('checkout.subtotal') }}:</span>
          <strong>{{ (order.subtotal || 0).toFixed(2) }} {{ currency }}</strong>
        </div>
        <div class="total-row">
          <span>{{ t('checkout.shipping') }}:</span>
          <strong>{{ (order.shipping || 0).toFixed(2) }} {{ currency }}</strong>
        </div>
        <div class="total-row discount" v-if="order.discount > 0">
          <span>{{ t('offers.discount') }}:</span>
          <strong>-{{ (order.discount || 0).toFixed(2) }} {{ currency }}</strong>
        </div>
        <div class="total-row grand-total">
          <span>{{ t('checkout.total') }}:</span>
          <strong>{{ (order.total || order.total_amount).toFixed(2) }} {{ currency }}</strong>
        </div>
      </div>

      <!-- Footer -->
      <div class="invoice-footer">
        <p>{{ t('invoice.thank_you') }}</p>
      </div>

    </div>

    <div v-else-if="!order" class="error-state">
      <p>{{ t('invoice.not_found') }}</p>
      <button class="back-btn" @click="goBack">{{ t('common.back') }}</button>
    </div>

    <!-- Print Button -->
    <button class="print-btn" @click="printInvoice" v-if="order && !loading">
      {{ t('invoice.print') }}
    </button>

    <!-- Back Button -->
    <button class="back-btn" @click="goBack" v-if="order && !loading">
      {{ t('common.back') }}
    </button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import api from '../../config/axios'
import { useLocalized } from '../../composables/useLocalized'
import { useSettings } from '../../composables/useSettings'

export default {
  name: 'InvoiceView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { t, locale } = useI18n()
    const { localized } = useLocalized()
    const { currency } = useSettings()
    const order = ref(null)
    const loading = ref(true)
    const siteLogo = ref('')
    const siteName = ref('')

    const fetchSiteInfo = async () => {
      try {
        const res = await api.get('/frontend/settings')
        const settings = res.data.data || res.data
        
        const logoVal = settings.find(s => s.key === 'logo')
        if (logoVal && logoVal.value) {
          siteLogo.value = logoVal.value.startsWith('http') 
            ? logoVal.value 
            : `${api.defaults.baseURL.replace('/api', '')}/storage/${logoVal.value}`
        }

        const nameVal = settings.find(s => s.key === 'site_name')
        if (nameVal && nameVal.value) {
          siteName.value = nameVal.value
        }
      } catch (err) {
        console.error('Failed to fetch settings', err)
      }
    }

    const fetchOrder = async () => {
      try {
        const orderId = route.params.id
        // Try to get order from user's orders list
        const res = await api.get('/frontend/orders/me')
        const orders = res.data.data || res.data
        order.value = orders.find(o => o.id == orderId || o.order_number == orderId)
        console.log('Order data:', order.value)
      } catch (err) {
        console.error('Failed to fetch order', err)
      } finally {
        loading.value = false
      }
    }

    const printInvoice = () => {
      const isRtl = locale.value === 'ar'
      const dir = isRtl ? 'rtl' : 'ltr'
      const textAlign = isRtl ? 'right' : 'left'
      const totalsMargin = isRtl ? 'margin-right: auto;' : 'margin-left: auto;'
      // Create a new window for printing
      const printWindow = window.open('', '_blank')
      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="${dir}">
        <head>
          <title>${t('invoice.title')} - ${order.value.orderNumber || order.value.order_number || order.value.id}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; direction: ${dir}; text-align: ${textAlign}; padding: 30px; }
            .invoice-header { display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 2px solid #873260; padding-bottom: 20px; }
            .invoice-title { font-size: 32px; color: #873260; margin: 0; }
            .invoice-detail { color: #64748b; margin: 5px 0; }
            .logo { text-align: ${isRtl ? 'left' : 'right'}; }
            .logo-img { height: 60px; }
            .logo-text { font-size: 24px; color: #873260; font-weight: bold; margin: 0; }
            .invoice-customer { background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
            .section-title { font-size: 16px; color: #873260; font-weight: bold; margin: 0 0 15px 0; grid-column: span 2; }
            .customer-info { color: #1e293b; margin: 5px 0; }
            .invoice-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .invoice-table thead { background: #873260; }
            .invoice-table th { color: white; padding: 12px 15px; text-align: ${textAlign}; font-weight: bold; }
            .invoice-table td { padding: 12px 15px; border-bottom: 1px solid #e2e8f0; }
            .invoice-totals { width: 300px; ${totalsMargin} display: flex; flex-direction: column; gap: 10px; }
            .total-row { display: flex; justify-content: space-between; padding: 10px 15px; background: #f8fafc; border-radius: 6px; }
            .total-row.grand-total { background: #873260; color: white; }
            .invoice-footer { text-align: center; padding-top: 20px; border-top: 2px solid #e2e8f0; color: #873260; font-weight: bold; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <div>
              <h2 class="invoice-title">${t('invoice.title')}</h2>
              <p class="invoice-detail">${t('checkout.order_number')}: ${order.value.orderNumber || order.value.order_number || order.value.id}</p>
              <p class="invoice-detail">${t('invoice.date')}: ${order.value.date}</p>
            </div>
            <div class="logo">
              ${siteLogo.value ? `<img src="${siteLogo.value}" alt="${siteName.value}" class="logo-img" />` : ''}
              <h3 class="logo-text">${siteName.value}</h3>
            </div>
          </div>
          <div class="invoice-customer">
            <h4 class="section-title">${t('invoice.customer_info')}</h4>
            <p class="customer-info"><strong>${t('auth.name')}:</strong> ${order.value.customerName || order.value.customer?.name}</p>
            <p class="customer-info"><strong>${t('auth.phone')}:</strong> ${order.value.customerPhone || order.value.customer?.phone}</p>
            <p class="customer-info"><strong>${t('auth.email')}:</strong> ${order.value.customerEmail || order.value.customer?.email}</p>
            <p class="customer-info"><strong>${t('checkout.shipping_address')}:</strong> ${order.value.customerAddress || order.value.shipping_address}</p>
          </div>
          <table class="invoice-table">
            <thead>
              <tr>
                <th>${t('product.title')}</th>
                <th>${t('cart.quantity')}</th>
                <th>${t('products.price')}</th>
                <th>${t('cart.total')}</th>
              </tr>
            </thead>
            <tbody>
              ${(order.value.items || order.value.products || []).map(item => `
                <tr>
                  <td>${localized(item.product || item, 'name')}</td>
                  <td>${item.quantity}</td>
                  <td>${(item.price || item.unit_price).toFixed(2)} ${t('currency')}</td>
                  <td>${((item.price || item.unit_price) * item.quantity).toFixed(2)} ${t('currency')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="invoice-totals">
            <div class="total-row">
              <span>${t('checkout.subtotal')}:</span>
              <strong>${(order.value.subtotal || 0).toFixed(2)} ${t('currency')}</strong>
            </div>
            <div class="total-row">
              <span>${t('checkout.shipping')}:</span>
              <strong>${(order.value.shipping || 0).toFixed(2)} ${t('currency')}</strong>
            </div>
            ${(order.value.discount > 0 ? `
            <div class="total-row">
              <span>${t('offers.discount')}:</span>
              <strong>-${(order.value.discount || 0).toFixed(2)} ${t('currency')}</strong>
            </div>
            ` : '')}
            <div class="total-row grand-total">
              <span>${t('checkout.total')}:</span>
              <strong>${(order.value.total || order.value.total_amount).toFixed(2)} ${t('currency')}</strong>
            </div>
          </div>
          <div class="invoice-footer">
            <p>${t('invoice.thank_you')}</p>
          </div>
        </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }

    const goBack = () => {
      router.back()
    }

    onMounted(() => {
      fetchSiteInfo()
      fetchOrder()
    })

    return {
      order,
      loading,
      siteLogo,
      siteName,
      currency,
      printInvoice,
      goBack
    }
  }
}
</script>

<style scoped>
/* Scoped styles for screen */
.invoice-page {
  background: #f5f6f8;
  padding: 30px;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .invoice-page { padding: 15px; }
  .invoice-box { padding: 20px; }
}

/* الفاتورة */
.invoice-box {
  background: #fff;
  padding: 40px;
  max-width: 800px;
  margin: auto;
  border-radius: 12px;
  box-shadow: 0 5px 25px rgba(0,0,0,0.05);
  font-family: 'Cairo', 'Arial', sans-serif;
}

/* header */
.invoice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #873260;
}

.header-info h2.invoice-title {
  margin: 0 0 10px 0;
  font-size: 32px;
  color: #873260;
  font-weight: 900;
}

.header-info p.invoice-detail {
  margin: 5px 0;
  font-size: 14px;
  color: #64748b;
}

.logo {
  text-align: left;
}

.logo-img {
  height: 60px;
  margin-bottom: 10px;
}

.logo-text {
  margin: 0;
  font-size: 24px;
  color: #873260;
  font-weight: bold;
}

/* customer */
.invoice-customer {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.invoice-customer h4.section-title {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #873260;
  font-weight: bold;
  grid-column: span 2;
}

.invoice-customer p.customer-info {
  margin: 5px 0;
  font-size: 14px;
  color: #1e293b;
}

/* table */
.invoice-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
}

.invoice-table thead {
  background: #873260;
}

.invoice-table th {
  padding: 12px 15px;
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.invoice-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 14px;
  color: #1e293b;
}

.invoice-table tbody tr:nth-child(even) {
  background: #f8fafc;
}

/* totals */
.invoice-totals {
  width: 300px;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 30px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  background: #f8fafc;
  border-radius: 6px;
  font-size: 14px;
}

.total-row span {
  color: #64748b;
  font-weight: 500;
}

.total-row strong {
  color: #1e293b;
  font-weight: bold;
}

.total-row.discount span {
  color: #10b981;
}

.total-row.discount strong {
  color: #10b981;
}

.total-row.grand-total {
  background: #873260;
  color: white;
  font-size: 16px;
}

.total-row.grand-total span {
  color: white;
}

.total-row.grand-total strong {
  color: white;
  font-size: 18px;
}

/* footer */
.invoice-footer {
  padding-top: 20px;
  border-top: 2px solid #e2e8f0;
  text-align: center;
}

.invoice-footer p {
  margin: 0;
  font-size: 16px;
  color: #873260;
  font-weight: bold;
}

/* زر الطباعة */
.print-btn {
  display: block;
  margin: 20px auto;
  padding: 12px 30px;
  background: #873260;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s;
}

.print-btn:hover {
  background: #6d284d;
  transform: translateY(-2px);
}

.back-btn {
  display: block;
  margin: 10px auto;
  padding: 10px 25px;
  background: #64748b;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s;
}

.back-btn:hover {
  background: #475569;
}

/* Loading & Error States */
.loading-state, .error-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  max-width: 600px;
  margin: 40px auto;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #873260;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p, .error-state p {
  color: #64748b;
  font-size: 16px;
  margin: 0;
}

.error-state p {
  color: #ef4444;
}
</style>
