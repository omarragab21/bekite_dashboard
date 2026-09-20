import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

export const DEFAULT_ABOUT_US = {
  phones: [
    {
      id: 'phone-jo-1',
      country: 'الأردن',
      countryCode: 'JO',
      number: '+962 7 9739 5785',
      label: 'هاتف الأردن 1 (رئيسي)',
      isPrimary: true
    },
    {
      id: 'phone-jo-2',
      country: 'الأردن',
      countryCode: 'JO',
      number: '+962 7 9892 2574',
      label: 'هاتف الأردن 2',
      isPrimary: false
    },
    {
      id: 'phone-sa-1',
      country: 'المملكة العربية السعودية',
      countryCode: 'SA',
      number: '+966545016722',
      label: 'هاتف السعودية 1 (رئيسي)',
      isPrimary: true
    },
    {
      id: 'phone-sa-2',
      country: 'المملكة العربية السعودية',
      countryCode: 'SA',
      number: '+966503481298',
      label: 'هاتف السعودية 2',
      isPrimary: false
    }
  ],
  emails: [
    {
      id: 'email-info',
      email: 'info@be-kite.com',
      label: 'الاستفسارات والمعلومات العامة (Info)',
      isPrimary: true
    },
    {
      id: 'email-sales',
      email: 'sales@be-kite.com',
      label: 'المبيعات وتطوير الأعمال (Sales)',
      isPrimary: false
    }
  ],
  socialLinks: [
    {
      id: 'facebook',
      platform: 'Facebook',
      name: 'فيسبوك',
      url: 'https://www.facebook.com/bekite86',
      username: 'bekite86',
      icon: 'facebook',
      color: '#1877F2'
    },
    {
      id: 'instagram',
      platform: 'Instagram',
      name: 'انستغرام',
      url: 'https://www.instagram.com/bekite__',
      username: 'bekite__',
      icon: 'instagram',
      color: '#E4405F'
    },
    {
      id: 'linkedin',
      platform: 'LinkedIn',
      name: 'لينكد إن',
      url: 'https://www.linkedin.com/company/be-kite',
      username: 'be-kite',
      icon: 'linkedin',
      color: '#0A66C2'
    },
    {
      id: 'youtube',
      platform: 'YouTube',
      name: 'يوتيوب',
      url: 'https://www.youtube.com/@Be-kite',
      username: '@Be-kite',
      icon: 'youtube',
      color: '#FF0000'
    }
  ],
  company: {
    nameAr: 'بي كايت | Be Kite',
    nameEn: 'Be Kite Systems & Platforms',
    taglineAr: 'الابتكار الرقمي، تطوير الأنظمة، وبناء المنصات السحابية المتكاملة',
    addressJordan: 'عمان، الأردن - مجمع الملك حسين للأعمال',
    addressSaudi: 'الرياض، المملكة العربية السعودية - واحة الملك سلمان للعلوم',
    workingHours: 'الأحد - الخميس: 9:00 ص - 6:00 م'
  },
  updatedAt: new Date().toISOString()
};

const DOC_PATH = { collection: 'about_us', id: 'contact_info' };

export class AboutUsFirebaseService {
  /**
   * Fetch about_us contact info from Firestore
   */
  static async getContactInfo() {
    try {
      const docRef = doc(db, DOC_PATH.collection, DOC_PATH.id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        return {
          phones: Array.isArray(data.phones) ? data.phones : DEFAULT_ABOUT_US.phones,
          emails: Array.isArray(data.emails) ? data.emails : DEFAULT_ABOUT_US.emails,
          socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : DEFAULT_ABOUT_US.socialLinks,
          company: { ...DEFAULT_ABOUT_US.company, ...(data.company || {}) },
          updatedAt: data.updatedAt || new Date().toISOString()
        };
      }
      // If document doesn't exist, seed it with default data
      await this.saveContactInfo(DEFAULT_ABOUT_US);
      return DEFAULT_ABOUT_US;
    } catch (error) {
      console.warn('[AboutUsService] Failed to load from Firestore, using default fallback:', error);
      return DEFAULT_ABOUT_US;
    }
  }

  /**
   * Save full contact info to Firestore
   */
  static async saveContactInfo(payload) {
    const docRef = doc(db, DOC_PATH.collection, DOC_PATH.id);
    const dataToSave = {
      ...payload,
      updatedAt: new Date().toISOString()
    };
    await setDoc(docRef, dataToSave, { merge: true });
    return dataToSave;
  }

  /**
   * Realtime listener for Firestore document
   */
  static subscribeContactInfo(onUpdate, onError) {
    try {
      const docRef = doc(db, DOC_PATH.collection, DOC_PATH.id);
      return onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            onUpdate({
              phones: Array.isArray(data.phones) ? data.phones : DEFAULT_ABOUT_US.phones,
              emails: Array.isArray(data.emails) ? data.emails : DEFAULT_ABOUT_US.emails,
              socialLinks: Array.isArray(data.socialLinks) ? data.socialLinks : DEFAULT_ABOUT_US.socialLinks,
              company: { ...DEFAULT_ABOUT_US.company, ...(data.company || {}) },
              updatedAt: data.updatedAt || new Date().toISOString()
            });
          } else {
            onUpdate(DEFAULT_ABOUT_US);
          }
        },
        (err) => {
          console.error('[AboutUsService] Realtime sync error:', err);
          if (onError) onError(err);
        }
      );
    } catch (err) {
      console.error('[AboutUsService] Failed to start listener:', err);
      if (onError) onError(err);
      return () => {};
    }
  }
}

export default AboutUsFirebaseService;
