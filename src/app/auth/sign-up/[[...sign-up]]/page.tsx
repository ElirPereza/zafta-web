import { redirect } from "next/navigation";

export default function SignUpPage() {
  // Registro desactivado - redirigir a login
  redirect("/auth/sign-in");
}
