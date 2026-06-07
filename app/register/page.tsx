import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage({
  searchParams
}: {
  searchParams?: {
    next?: string | string[];
    role?: string | string[];
  };
}) {
  const next = typeof searchParams?.next === "string" ? searchParams.next : undefined;
  const initialRole =
    searchParams?.role === "buyer" || searchParams?.role === "brand" ? searchParams.role : undefined;

  return <RegisterForm next={next} initialRole={initialRole} />;
}
