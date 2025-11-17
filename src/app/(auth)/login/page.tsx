// src/app/(auth)/register/page.tsx
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-green-50">
      <LoginForm />
    </main>
  );
}
