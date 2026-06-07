import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Notification {
  id: string;
  type: "swap" | "claim" | "deposit" | "vault_created" | "referral";
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  vaultId?: string;
  txHash?: string;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    type: Notification["type"],
    title: string,
    message: string,
    vaultId?: string,
    txHash?: string
  ) => void;
  markAllRead: () => void;
  clearAll: () => void;
  dismissOne: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      addNotification: (type, title, message, vaultId, txHash) => {
        const newNotification: Notification = {
          id: Math.random().toString(36).substring(2, 9),
          type,
          title,
          message,
          timestamp: Date.now(),
          read: false,
          vaultId,
          txHash,
        };

        set((state) => {
          const updated = [newNotification, ...state.notifications].slice(0, 50); // limit to 50
          return {
            notifications: updated,
            unreadCount: updated.filter((n) => !n.read).length,
          };
        });
      },
      markAllRead: () => {
        set((state) => {
          const updated = state.notifications.map((n) => ({ ...n, read: true }));
          return {
            notifications: updated,
            unreadCount: 0,
          };
        });
      },
      clearAll: () => {
        set({ notifications: [], unreadCount: 0 });
      },
      dismissOne: (id) => {
        set((state) => {
          const updated = state.notifications.filter((n) => n.id !== id);
          return {
            notifications: updated,
            unreadCount: updated.filter((n) => !n.read).length,
          };
        });
      },
    }),
    {
      name: "ther_notifications",
    }
  )
);
