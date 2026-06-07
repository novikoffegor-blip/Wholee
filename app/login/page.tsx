import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage({
  searchParams
}: {
  searchParams?: {
    next?: string | string[];
  };
}) {
  const next = typeof searchParams?.next === "string" ? searchParams.next : undefined;

  return <LoginForm next={next} />;
}
