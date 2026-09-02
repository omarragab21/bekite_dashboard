import { ref, computed } from 'vue'
import api from '../config/axios'

const offers = ref([])
const loading = ref(false)

export function useOffers() {
  const fetchOffers = async () => {
    if (loading.value) return
    loading.value = true
    try {
      const res = await api.get('/frontend/offers?is_active=1')
      offers.value = res.data.data || res.data
    } catch (err) {
      console.error('Failed to fetch offers', err)
    } finally {
      loading.value = false
    }
  }

  const getActiveOfferForProduct = (product) => {
    if (!offers.value.length) return null
    
    // Find an offer that applies to this product
    for (const offer of offers.value) {
      if (!offer.is_active) continue
      
      // Check if offer is valid (dates)
      const now = new Date()
      const startDate = offer.start_date ? new Date(offer.start_date) : null
      const endDate = offer.end_date ? new Date(offer.end_date) : null
      
      if (startDate && now < startDate) continue
      if (endDate && now > endDate) continue
      
      // Check if offer applies to this product
      if (offer.applies_to === 'all') {
        return offer
      } else if (offer.applies_to === 'products' && offer.selected_products?.length > 0) {
        if (offer.selected_products.includes(product.id)) {
          return offer
        }
      } else if (offer.applies_to === 'categories' && offer.selected_categories?.length > 0) {
        if (offer.selected_categories.includes(product.category_id)) {
          return offer
        }
      }
    }
    
    return null
  }

  const calculateDiscountFromOffer = (product, offer) => {
    if (!offer) return 0
    
    if (offer.type === 'percentage') {
      return parseFloat(offer.value)
    } else if (offer.type === 'fixed') {
      const price = parseFloat(product.price)
      const discountValue = parseFloat(offer.value)
      if (price > 0) {
        return (discountValue / price) * 100
      }
    }
    
    return 0
  }

  const calculatePriceWithOffer = (product, offer) => {
    const discount = calculateDiscountFromOffer(product, offer)
    const price = parseFloat(product.price)
    return price * (1 - (discount / 100))
  }

  return {
    offers,
    loading,
    fetchOffers,
    getActiveOfferForProduct,
    calculateDiscountFromOffer,
    calculatePriceWithOffer
  }
}
