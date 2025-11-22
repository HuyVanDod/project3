// lib/profile.ts
import { BASE_URL } from "@/lib/api";

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  user_type: number;
  customer_id: string;
  total_spent: string;
  order_count: number;
  last_order_date: string | null;
}

export interface UpdateProfileData {
  name?: string;
  avatar?: string;
  phone?: string | null;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export async function getProfile(token: string): Promise<Profile> {
  const res = await fetch(`${BASE_URL}/api/v1/profile/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch profile');
  }

  return res.json();
}

export async function updateProfile(token: string, data: UpdateProfileData): Promise<Profile> {
  const res = await fetch(`${BASE_URL}/api/v1/profile/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to update profile');
  }

  return res.json();
}

export async function changePassword(token: string, data: ChangePasswordData): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/api/v1/profile/me/change-password`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to change password');
  }

  return res.json();
}
