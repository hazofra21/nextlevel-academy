import { requireAdminContext } from "@/auth/user";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminContext();

  return children;
}
