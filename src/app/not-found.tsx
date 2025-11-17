export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h2 className="text-3xl font-bold text-red-600 mb-4">404</h2>
      <p className="text-lg">Trang bạn tìm không tồn tại.</p>
      <a
        href="/"
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Về trang chủ
      </a>
    </div>
  );
}
