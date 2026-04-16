import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { JnfBuilder } from "@/features/jnf/components/JnfBuilder";
import { backendApiBaseUrl } from "@/lib/api";
import { requireRole } from "@/lib/server-auth";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function EditJnfPage({ params }: Params) {
  const { id } = await params;
  const session = await requireRole("company");

  const response = await fetch(`${backendApiBaseUrl}/company/jnfs/${id}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session.user.apiToken}`,
    },
    cache: "no-store",
  }).catch(() => null);

  if (!response?.ok) {
    redirect("/dashboard/submissions");
  }

  const payload = await response.json();

  return (
    <DashboardShell title="Edit JNF">
      <JnfBuilder />
    </DashboardShell>
  );
}
