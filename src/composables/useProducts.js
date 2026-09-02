import { ref, computed } from 'vue';
import { ProductService } from '../services/ProductService';
import { useToast } from './useToast';

export function useProducts() {
  const products = ref([]);
  const categories = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const { success, error: toastError } = useToast();

  const fetchProducts = async () => {
    loading.value = true;
    error.value = null;
    try {
      products.value = await ProductService.getAll();
    } catch (err) {
      console.error('Failed to fetch products', err);
      error.value = 'تعذر تحميل المنتجات';
      toastError('تعذر تحميل المنتجات');
    } finally {
      loading.value = false;
    }
  };

  const fetchCategories = async () => {
    try {
      categories.value = await ProductService.getCategories();
    } catch (err) {
      console.error('Failed to fetch product categories', err);
    }
  };

  const createProduct = async (payload) => {
    try {
      const created = await ProductService.create(payload);
      products.value.unshift(created);
      success('تمت إضافة النظام الرقمي بنجاح');
      return created;
    } catch (err) {
      toastError('حدث خطأ أثناء إضافة النظام الرقمي');
      throw err;
    }
  };

  const updateProduct = async (id, payload) => {
    try {
      const updated = await ProductService.update(id, payload);
      const idx = products.value.findIndex(p => String(p.id) === String(id));
      if (idx !== -1) {
        products.value[idx] = updated;
      }
      success('تم تحديث النظام بنجاح');
      return updated;
    } catch (err) {
      toastError('حدث خطأ أثناء تحديث النظام');
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await ProductService.delete(id);
      products.value = products.value.filter(p => String(p.id) !== String(id));
      success('تم حذف النظام بنجاح');
      return true;
    } catch (err) {
      toastError('حدث خطأ أثناء حذف النظام');
      throw err;
    }
  };

  const activeProductsCount = computed(() => {
    return products.value.filter(p => p.is_active).length;
  });

  return {
    products,
    categories,
    loading,
    error,
    activeProductsCount,
    fetchProducts,
    fetchCategories,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}

export default useProducts;
