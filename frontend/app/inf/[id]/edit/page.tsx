import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { InfBuilder } from "@/features/inf/components/InfBuilder";
import { backendApiBaseUrl } from "@/lib/api";
import { requireRole } from "@/lib/server-auth";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function EditInfPage({ params }: Params) {
  const { id } = await params;
  const session = await requireRole("company");

  const response = await fetch(`${backendApiBaseUrl}/company/infs/${id}`, {
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
    <DashboardShell title="Edit INF">
      <InfBuilder />
    </DashboardShell>
  );
}
