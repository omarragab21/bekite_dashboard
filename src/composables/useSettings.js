import { ref, computed } from 'vue'
import api from '../config/axios'
import { useI18n } from 'vue-i18n'

const settings = ref(null)
const loading = ref(false)

export function useSettings() {
  const { locale } = useI18n()

  const fetchSettings = async () => {
    loading.value = true
    try {
      const response = await api.get('/frontend/settings')
      const data = response.data.data || response.data
      
      // Convert array to object
      const settingsObj = {}
      data.forEach(s => {
        settingsObj[s.key] = s.value
      })
      
      settings.value = settingsObj
      return settings.value
    } catch (error) {
      console.error('Failed to fetch settings:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  const currency = computed(() => {
    if (!settings.value) return locale.value === 'ar' ? 'د.أ' : 'JOD'
    return locale.value === 'ar' 
      ? (settings.value.currency_ar || 'د.أ')
      : (settings.value.currency_en || 'JOD')
  })

  const getSetting = (key, defaultValue = null) => {
    return settings.value?.[key] ?? defaultValue
  }

  return {
    settings,
    loading,
    fetchSettings,
    currency,
    getSetting
  }
}
