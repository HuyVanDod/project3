"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface Notification {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // load từ localStorage khi mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("notifications") || "[]");
    setNotifications(stored);
  }, []);

  const addNotification = (message: string) => {
    const newNotif: Notification = {
      id: Date.now().toString(),
      message,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => {
      const updated = [newNotif, ...prev];
      localStorage.setItem("notifications", JSON.stringify(updated));
      return updated;
    });
    toast.success(message);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      localStorage.setItem("notifications", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};
