import { ClerkProvider } from "@clerk/nextjs";
import { esES } from "@clerk/localizations";

export default function AuthLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <ClerkProvider localization={esES}>{children}</ClerkProvider>;
}
