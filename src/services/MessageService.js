/**
 * Contact Form & Direct Messages Service
 * Fully integrated with Firebase Firestore (bekite-86b37)
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase.js';

/**
 * Format Firestore document into uniform message object
 */
export function formatMessageDoc(docSnap) {
  const data = docSnap.data ? docSnap.data() : docSnap;
  const id = docSnap.id || data.id || 'msg-' + Math.random().toString(36).substring(2, 9);
  const rawDate = data.created_at || data.createdAt || (data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : null) || new Date().toISOString();
  
  return {
    id,
    name: data.name || data.sender_name || data.fullName || 'زائر',
    email: data.email || data.workEmail || '',
    phone_number: data.phone_number || data.phone || '',
    phone: data.phone || data.phone_number || '',
    company: data.company || '',
    service: data.service || data.service_type || '',
    budget: data.budget || data.budget_range || '',
    contact_method: data.contact_method || data.contactMethod || 'email',
    subject: data.subject || (data.service ? `استفسار عن خدمة: ${data.service}` : 'استفسار عام'),
    message: data.message || '',
    status: data.status || (data.is_read ? 'read' : 'unread'),
    is_read: (data.status === 'read' || data.is_read === 1) ? 1 : 0,
    source: data.source || 'website_contact_form',
    created_at: rawDate,
    createdAt: rawDate,
  };
}

export class MessageService {
  /**
   * Fetch all contact messages from Firestore
   */
  static async getAll(params = {}) {
    try {
      const colRef = collection(db, 'messages');
      let snapshot;
      try {
        const q = query(colRef, orderBy('created_at', 'desc'));
        snapshot = await getDocs(q);
      } catch (err) {
        // Fallback without orderBy in case composite index is not set
        snapshot = await getDocs(colRef);
      }

      let messages = snapshot.docs.map(formatMessageDoc);

      // Sort client-side if needed
      messages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      // Filter by status if provided
      if (params.status) {
        messages = messages.filter(m => m.status === params.status);
      }

      // Filter by search query if provided
      if (params.search) {
        const q = params.search.toLowerCase();
        messages = messages.filter(m =>
          (m.name && m.name.toLowerCase().includes(q)) ||
          (m.email && m.email.toLowerCase().includes(q)) ||
          (m.phone_number && m.phone_number.includes(q)) ||
          (m.subject && m.subject.toLowerCase().includes(q)) ||
          (m.message && m.message.toLowerCase().includes(q))
        );
      }

      return messages;
    } catch (error) {
      console.error('[MessageService] getAll error:', error);
      return [];
    }
  }

  /**
   * Fetch message by ID from Firestore
   */
  static async getById(id) {
    try {
      const docRef = doc(db, 'messages', id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error(`Message with ID ${id} not found`);
      }
      return formatMessageDoc(docSnap);
    } catch (error) {
      console.error(`[MessageService] getById(${id}) error:`, error);
      throw error;
    }
  }

  /**
   * Create a message in Firestore (admin or test)
   */
  static async create(payload) {
    const nowIso = new Date().toISOString();
    const docData = {
      name: (payload.name || payload.fullName || 'زائر').trim(),
      email: (payload.email || payload.workEmail || '').trim(),
      phone_number: (payload.phone_number || payload.phone || '').trim(),
      phone: (payload.phone_number || payload.phone || '').trim(),
      company: (payload.company || '').trim(),
      service: payload.service || payload.service_type || '',
      budget: payload.budget || '',
      contact_method: payload.contact_method || payload.contactMethod || 'email',
      subject: payload.subject || 'استفسار عام',
      message: (payload.message || '').trim(),
      status: payload.status || 'unread',
      is_read: payload.status === 'read' ? 1 : 0,
      source: payload.source || 'admin_dashboard',
      created_at: nowIso,
      createdAt: nowIso,
      timestamp: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'messages'), docData);
    return { id: docRef.id, ...docData };
  }

  /**
   * Update message status (read / unread) in Firestore
   */
  static async updateStatus(id, status = 'read') {
    try {
      const docRef = doc(db, 'messages', id);
      const isRead = status === 'read' ? 1 : 0;
      await updateDoc(docRef, {
        status,
        is_read: isRead,
        updated_at: new Date().toISOString()
      });
      return { success: true, id, status, is_read: isRead };
    } catch (error) {
      console.error(`[MessageService] updateStatus(${id}, ${status}) error:`, error);
      throw error;
    }
  }

  /**
   * Delete a message from Firestore
   */
  static async delete(id) {
    try {
      const docRef = doc(db, 'messages', id);
      await deleteDoc(docRef);
      return { success: true, id };
    } catch (error) {
      console.error(`[MessageService] delete(${id}) error:`, error);
      throw error;
    }
  }

  /**
   * Mark all unread messages as read in Firestore
   */
  static async markAllAsRead() {
    try {
      const colRef = collection(db, 'messages');
      const snapshot = await getDocs(colRef);
      const batch = writeBatch(db);
      let count = 0;

      snapshot.docs.forEach((d) => {
        const data = d.data();
        if (data.status === 'unread' || data.is_read === 0) {
          batch.update(d.ref, {
            status: 'read',
            is_read: 1,
            updated_at: new Date().toISOString()
          });
          count++;
        }
      });

      if (count > 0) {
        await batch.commit();
      }
      return { success: true, count };
    } catch (error) {
      console.error('[MessageService] markAllAsRead error:', error);
      throw error;
    }
  }

  /**
   * Submit contact message (public website or test)
   */
  static async submitPublicMessage(payload) {
    return this.create({
      ...payload,
      source: 'website_contact_form'
    });
  }

  /**
   * Real-time subscription to messages collection
   * Fires immediately and whenever any message is added, updated, or deleted.
   * @param {Function} callback Function that receives updated messages array
   * @returns {Function} Unsubscribe function
   */
  static subscribeMessages(callback) {
    const colRef = collection(db, 'messages');
    return onSnapshot(
      colRef,
      (snapshot) => {
        const msgs = snapshot.docs.map(formatMessageDoc);
        msgs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        callback(msgs);
      },
      (error) => {
        console.error('[MessageService] subscribeMessages error:', error);
      }
    );
  }

  /**
   * Real-time subscription to unread message count and latest notifications
   * Fires whenever unread count changes (streaming: 1, 2, 3...)
   * @param {Function} callback Function that receives (unreadCount, latestMessages)
   * @returns {Function} Unsubscribe function
   */
  static subscribeUnreadCount(callback) {
    const colRef = collection(db, 'messages');
    return onSnapshot(
      colRef,
      (snapshot) => {
        const all = snapshot.docs.map(formatMessageDoc);
        all.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const unreadList = all.filter(m => m.status === 'unread' || m.is_read === 0);
        callback(unreadList.length, all);
      },
      (error) => {
        console.error('[MessageService] subscribeUnreadCount error:', error);
      }
    );
  }
}

export default MessageService;
