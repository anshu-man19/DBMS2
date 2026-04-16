import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import { authOptions } from "@/lib/auth";

type RequiredSession = Session & {
  user: Session["user"] & {
    apiToken: string;
    role: "admin" | "company";
  };
};

export async function requireRole(role: "admin" | "company"): Promise<RequiredSession> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.apiToken) {
    redirect(role === "admin" ? "/admin/login" : "/login");
  }

  if (session.user.role !== role) {
    redirect(role === "admin" ? "/admin/login" : "/login");
  }

  return session as RequiredSession;
}
