"use client";

import { useEffect, useState } from "react";
import {
  getCustomerAddresses,
  addCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
  getProvinces,
  getDistricts,
  getWards,
} from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";

interface Province { code: string; name: string }
interface District { code: string; name: string }
interface Ward { code: string; name: string }

interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
  province_name?: string;
  district_name?: string;
  ward_name?: string;
  province_code?: string;
  district_code?: string;
  ward_code?: string;
  is_default: boolean;
}

export default function AddressListPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    detail: "",
  });

  // --- Lấy danh sách địa chỉ ---
  const fetchAddresses = async () => {
    const data = await getCustomerAddresses();
    setAddresses(data);
  };

  useEffect(() => {
    fetchAddresses();
    getProvinces().then(setProvinces);
  }, []);

  useEffect(() => {
    if (form.province) getDistricts(form.province).then(setDistricts);
    else setDistricts([]);
  }, [form.province]);

  useEffect(() => {
    if (form.district) getWards(form.district).then(setWards);
    else setWards([]);
  }, [form.district]);

  // --- Thêm hoặc cập nhật địa chỉ ---
  const handleSave = async () => {
    if (!form.name || !form.phone || !form.detail || !form.province || !form.district || !form.ward) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const data = {
      name: form.name,
      phone: form.phone,
      address: form.detail,
      province_code: form.province,
      district_code: form.district,
      ward_code: form.ward,
      is_default: editing?.is_default || false,
    };

    try {
      if (editing) {
        await updateCustomerAddress(editing.id, data);
        alert("✅ Đã cập nhật địa chỉ");
      } else {
        await addCustomerAddress(data);
        alert("✅ Đã thêm địa chỉ mới");
      }
      setShowForm(false);
      setEditing(null);
      fetchAddresses();
    } catch {
      alert("❌ Lưu địa chỉ thất bại!");
    }
  };

  // --- Xóa địa chỉ ---
  const handleDelete = async (id: number) => {
    if (confirm("🗑️ Bạn có chắc muốn xóa địa chỉ này?")) {
      await deleteCustomerAddress(id);
      alert("✅ Đã xóa địa chỉ");
      fetchAddresses();
    }
  };

  // --- Đặt địa chỉ làm mặc định ---
  // --- Đặt địa chỉ làm mặc định ---
// --- Đặt địa chỉ làm mặc định ---
const handleSetDefault = async (id: number) => {
  try {
    const addr = addresses.find((a) => a.id === id);
    if (!addr) return;

    // ✅ Gọi API chỉ với field cần thiết
    await updateCustomerAddress(id, { is_default: true });

    // ✅ Cập nhật lại danh sách địa chỉ trong UI
    const updated = addresses.map((a) =>
      a.id === id ? { ...a, is_default: true } : { ...a, is_default: false }
    );
    setAddresses(updated);

    alert("⭐ Đã đặt làm địa chỉ mặc định");
  } catch (error) {
    console.error("❌ Lỗi khi đặt mặc định:", error);
    alert("Không thể đặt địa chỉ mặc định!");
  }
};


  // --- Khi bấm “Sửa” ---
  const handleEdit = (a: Address) => {
    setEditing(a);
    setForm({
      name: a.name,
      phone: a.phone,
      detail: a.address,
      province: a.province_code || "",
      district: a.district_code || "",
      ward: a.ward_code || "",
    });
    setShowForm(true);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">📍 Quản lý địa chỉ</h1>

      {/* Danh sách địa chỉ */}
      <div className="space-y-4">
        {addresses.length > 0 ? (
          addresses.map((a) => (
            <div
              key={a.id}
              className={`border rounded-xl p-4 flex justify-between items-start ${
                a.is_default ? "border-green-500 bg-green-50" : "border-gray-200"
              }`}
            >
              <div>
                <p className="font-medium text-gray-900">
                  {a.name} - {a.phone}
                </p>
                <p className="text-sm text-gray-600">
                  {a.address}, {a.ward_name}, {a.district_name}, {a.province_name}
                </p>
                {a.is_default && (
                  <span className="text-xs text-green-600 font-semibold">★ Địa chỉ mặc định</span>
                )}
              </div>

              <div className="flex gap-2 text-sm">
                <button
                  onClick={() => handleEdit(a)}
                  className="text-blue-600 hover:underline"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="text-red-500 hover:underline"
                >
                  Xóa
                </button>
                {!a.is_default && (
                  <button
                    onClick={() => handleSetDefault(a.id)}
                    className="text-green-600 hover:underline"
                  >
                    Đặt mặc định
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">Chưa có địa chỉ nào.</p>
        )}
      </div>

      <Button
        onClick={() => {
          setEditing(null);
          setForm({ name: "", phone: "", province: "", district: "", ward: "", detail: "" });
          setShowForm(true);
        }}
        className="mt-6 bg-green-600 text-white hover:bg-green-700"
      >
        + Thêm địa chỉ
      </Button>

      {/* Form thêm/sửa địa chỉ */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/30 z-[1000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowForm(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative"
            >
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-3 right-4 text-2xl hover:text-gray-600"
              >
                ×
              </button>

              <h2 className="text-xl font-bold mb-4 text-gray-900">
                {editing ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
              </h2>

              <div className="space-y-3">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Họ và tên"
                  className="w-full border rounded-lg px-3 py-2"
                />
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Số điện thoại"
                  className="w-full border rounded-lg px-3 py-2"
                />

                <select
                  value={form.province}
                  onChange={(e) =>
                    setForm({ ...form, province: e.target.value, district: "", ward: "" })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">-- Chọn Tỉnh/Thành phố --</option>
                  {provinces.map((p) => (
                    <option key={p.code} value={p.code}>
                      {p.name}
                    </option>
                  ))}
                </select>

                <select
                  value={form.district}
                  onChange={(e) =>
                    setForm({ ...form, district: e.target.value, ward: "" })
                  }
                  disabled={!form.province}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">-- Chọn Quận/Huyện --</option>
                  {districts.map((d) => (
                    <option key={d.code} value={d.code}>
                      {d.name}
                    </option>
                  ))}
                </select>

                <select
                  value={form.ward}
                  onChange={(e) => setForm({ ...form, ward: e.target.value })}
                  disabled={!form.district}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">-- Chọn Phường/Xã --</option>
                  {wards.map((w) => (
                    <option key={w.code} value={w.code}>
                      {w.name}
                    </option>
                  ))}
                </select>

                <input
                  value={form.detail}
                  onChange={(e) => setForm({ ...form, detail: e.target.value })}
                  placeholder="Số nhà, tên đường..."
                  className="w-full border rounded-lg px-3 py-2"
                />

                <Button
                  onClick={handleSave}
                  className="w-full bg-green-600 text-white hover:bg-green-700"
                >
                  Lưu địa chỉ
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
