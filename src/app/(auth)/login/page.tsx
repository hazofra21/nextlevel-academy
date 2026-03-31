import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCurrentUserContext } from "@/auth/user";
import LoginForm from "./LoginForm";

interface LoginPageProps {
  searchParams?: Promise<{
    next?: string;
    error?: string;
  }>;
}

function getSafeNextPath(nextPath: string | undefined) {
  if (!nextPath || !nextPath.startsWith("/")) {
    return "/dashboard";
  }

  return nextPath;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const params = (await searchParams) ?? {};
  const nextPath = getSafeNextPath(params.next);

  if (user) {
    const context = await getCurrentUserContext();

    if (context?.profile.activo) {
      redirect(nextPath);
    }
  }

  return <LoginForm nextPath={nextPath} error={params.error} />;
}
