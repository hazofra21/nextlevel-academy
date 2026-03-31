import { requireUserContext } from "@/auth/user";
import UserShell from "@/components/dashboard/UserShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, role } = await requireUserContext();

  return (
    <UserShell
      profileName={`${profile.nombre} ${profile.apellidos}`.trim()}
      email={profile.email}
      role={role}
    >
      {children}
    </UserShell>
  );
}
