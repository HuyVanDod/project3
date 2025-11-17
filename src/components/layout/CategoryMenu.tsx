import { ChevronRight } from "lucide-react"; 
import { useCategories } from "@/hooks/useCategories";

export default function CategoryMenu() {
  const { categories, loading, error } = useCategories();

  if (loading) return <p>Đang tải danh mục...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <div className="border rounded-lg p-4 bg-white shadow-md w-64">
      <h2 className="text-lg font-semibold mb-3 text-center">
        Các loại sản phẩm
      </h2>

      <ul className="divide-y border rounded-md">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="flex items-center justify-between py-3 px-3 cursor-pointer hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              {/* Nếu chưa có icon thì tạm để mặc định 🥬 */}
              <span className="w-6 h-6 flex items-center justify-center">🥬</span>
              <span className="text-sm font-medium">{cat.name}</span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </li>
        ))}
      </ul>
    </div>
  );
}
