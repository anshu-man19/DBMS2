import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { LandingPage } from "@/features/landing/components/LandingPage";
import { authOptions } from "@/lib/auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (session?.user.role === "admin" && session.user.apiToken) {
    redirect("/admin/jnfs");
  }

  if (session?.user.role === "company" && session.user.apiToken) {
    redirect("/dashboard");
  }

  return <LandingPage />;
}
