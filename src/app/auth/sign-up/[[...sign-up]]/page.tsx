import { SignUp } from "@clerk/nextjs";
import { AuthWrapper } from "@/components/auth/AuthWrapper";

export default function SignUpPage() {
  return (
    <AuthWrapper
      title="Bienvenido a nuestra historia dulce"
      subtitle="Crea tu cuenta para realizar pedidos"
    >
      <SignUp
        appearance={{
          elements: {
            rootBox: "w-full flex justify-center",
            card: "bg-white shadow-xl border border-beige-400 rounded-2xl w-full",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            socialButtonsBlockButton:
              "border-beige-400 hover:bg-beige-100 font-sans",
            formButtonPrimary:
              "bg-primary hover:bg-primary/90 font-sans font-medium",
            footerActionLink: "text-primary hover:text-primary/80 font-sans",
            identityPreviewEditButton: "text-primary",
            formFieldInput:
              "border-beige-400 focus:border-primary focus:ring-primary font-sans",
            formFieldLabel: "font-sans text-foreground text-sm",
            dividerLine: "bg-beige-300",
            dividerText: "text-muted-foreground font-sans text-sm",
            formFieldInputShowPasswordButton:
              "text-muted-foreground hover:text-foreground",
            footer: "hidden",
          },
        }}
      />
    </AuthWrapper>
  );
}
