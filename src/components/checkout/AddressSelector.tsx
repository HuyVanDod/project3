"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  getProvinces,
  getDistricts,
  getWards,
  getCustomerAddresses,
  addCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
} from "@/lib/api";
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

export function AddressSelector({
  selectedAddress,
  onSelect,
}: {
  selectedAddress: Address | null;
  onSelect: (address: Address) => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
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

  // --- Load dữ liệu ban đầu ---
  useEffect(() => {
    getProvinces().then(setProvinces);
    fetchAddresses();
  }, []);

  // --- Hàm load danh sách địa chỉ ---
  const fetchAddresses = async () => {
    const data = await getCustomerAddresses();
    setAddresses(data);

    // ✅ Nếu trong localStorage có địa chỉ mặc định → tự chọn lại
    const savedId = localStorage.getItem("defaultAddressId");
    if (savedId) {
      const found = data.find((a) => String(a.id) === savedId);
      if (found) {
        onSelect(found);
        return;
      }
    }

    // Nếu chưa có lưu mặc định, chọn địa chỉ đầu tiên hoặc có is_default = true
    const defaultAddr = data.find((a) => a.is_default) || data[0];
    if (defaultAddr) {
      onSelect(defaultAddr);
      localStorage.setItem("defaultAddressId", String(defaultAddr.id));
    }
  };

  useEffect(() => {
    if (form.province) getDistricts(form.province).then(setDistricts);
    else setDistricts([]);
  }, [form.province]);

  useEffect(() => {
    if (form.district) getWards(form.district).then(setWards);
    else setWards([]);
  }, [form.district]);

  // --- Lưu hoặc cập nhật địa chỉ ---
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
      is_default: false,
    };

    try {
      if (editing) {
        await updateCustomerAddress(editing.id, data);
        alert("✅ Đã cập nhật địa chỉ");
      } else {
        await addCustomerAddress(data);
        alert("✅ Đã thêm địa chỉ mới");
      }
      setShowEdit(false);
      setEditing(null);
      fetchAddresses();
    } catch {
      alert("❌ Lưu địa chỉ thất bại!");
    }
  };

  // --- Chọn địa chỉ (và lưu mặc định) ---
  const handleSelectAddress = (a: Address) => {
    onSelect(a);
    localStorage.setItem("defaultAddressId", String(a.id)); // ✅ lưu lại id vào localStorage
    setShowModal(false);
  };

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
    setShowModal(false);
    setShowEdit(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("🗑️ Bạn có chắc muốn xóa địa chỉ này?")) {
      await deleteCustomerAddress(id);

      // Nếu xóa địa chỉ đang mặc định → xóa khỏi localStorage
      const savedId = localStorage.getItem("defaultAddressId");
      if (savedId && Number(savedId) === id) {
        localStorage.removeItem("defaultAddressId");
      }

      fetchAddresses();
    }
  };

  return (
    <>
      {/* Hiển thị địa chỉ hiện tại */}
      <div
        onClick={() => setShowModal(true)}
        className="flex items-center justify-between p-4 border rounded-xl bg-white shadow cursor-pointer hover:bg-gray-50"
      >
        <div>
          <h3 className="font-semibold text-gray-900">📍 Địa chỉ giao hàng</h3>
          {selectedAddress ? (
            <p className="text-green-600 text-sm mt-1">
              {selectedAddress.name} - {selectedAddress.phone} | {selectedAddress.address},{" "}
              {selectedAddress.ward_name}, {selectedAddress.district_name}, {selectedAddress.province_name}
            </p>
          ) : (
            <p className="text-gray-500 text-sm mt-1">Chưa chọn địa chỉ giao hàng</p>
          )}
        </div>
        <span className="text-green-600 text-lg">›</span>
      </div>

      {/* Modal danh sách địa chỉ */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/30 z-[1000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
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
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-4 text-2xl hover:text-gray-600"
              >
                ×
              </button>

              <h2 className="text-xl font-bold mb-4 text-gray-900">Chọn địa chỉ giao hàng</h2>

              {addresses.length > 0 ? (
                addresses.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => handleSelectAddress(a)}
                    className={`border rounded-lg p-3 mb-2 cursor-pointer transition ${
                      a.id === selectedAddress?.id
                        ? "border-green-500 bg-green-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">
                          {a.name} - {a.phone}
                        </p>
                        <p className="text-sm text-gray-600">
                          {a.address}, {a.ward_name}, {a.district_name}, {a.province_name}
                        </p>
                      </div>
                      <div className="flex gap-2 text-sm">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(a);
                          }}
                          className="text-green-600 hover:underline"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(a.id);
                          }}
                          className="text-red-500 hover:underline"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Chưa có địa chỉ nào.</p>
              )}

              <Button
                onClick={() => {
                  setEditing(null);
                  setForm({ name: "", phone: "", province: "", district: "", ward: "", detail: "" });
                  setShowModal(false);
                  setShowEdit(true);
                }}
                className="w-full mt-3 bg-green-600 text-white hover:bg-green-700"
              >
                + Thêm địa chỉ
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal thêm/sửa địa chỉ */}
      <AnimatePresence>
        {showEdit && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/30 z-[1100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEdit(false)}
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
                onClick={() => setShowEdit(false)}
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
    </>
  );
}
