import { ref, computed } from 'vue';
import { ProjectService } from '../services/ProjectService';
import { useToast } from './useToast';

export function useProjects() {
  const projects = ref([]);
  const categories = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const { success, error: toastError } = useToast();

  const fetchProjects = async () => {
    loading.value = true;
    error.value = null;
    try {
      projects.value = await ProjectService.getAll();
    } catch (err) {
      console.error('Failed to fetch projects', err);
      error.value = 'تعذر تحميل المشاريع';
      toastError('تعذر تحميل المشاريع');
    } finally {
      loading.value = false;
    }
  };

  const fetchCategories = async () => {
    try {
      categories.value = await ProjectService.getCategories();
    } catch (err) {
      console.error('Failed to fetch project categories', err);
    }
  };

  const createProject = async (payload) => {
    try {
      const created = await ProjectService.create(payload);
      projects.value.unshift(created);
      success('تمت إضافة المشروع بنجاح');
      return created;
    } catch (err) {
      toastError('حدث خطأ أثناء إضافة المشروع');
      throw err;
    }
  };

  const updateProject = async (id, payload) => {
    try {
      const updated = await ProjectService.update(id, payload);
      const idx = projects.value.findIndex(p => String(p.id) === String(id));
      if (idx !== -1) {
        projects.value[idx] = updated;
      }
      success('تم تحديث المشروع بنجاح');
      return updated;
    } catch (err) {
      toastError('حدث خطأ أثناء تحديث المشروع');
      throw err;
    }
  };

  const deleteProject = async (id) => {
    try {
      await ProjectService.delete(id);
      projects.value = projects.value.filter(p => String(p.id) !== String(id));
      success('تم حذف المشروع بنجاح');
      return true;
    } catch (err) {
      toastError('حدث خطأ أثناء حذف المشروع');
      throw err;
    }
  };

  const activeProjectsCount = computed(() => {
    return projects.value.filter(p => p.is_active).length;
  });

  const featuredProjectsCount = computed(() => {
    return projects.value.filter(p => p.is_featured).length;
  });

  return {
    projects,
    categories,
    loading,
    error,
    activeProjectsCount,
    featuredProjectsCount,
    fetchProjects,
    fetchCategories,
    createProject,
    updateProject,
    deleteProject,
  };
}

export default useProjects;
