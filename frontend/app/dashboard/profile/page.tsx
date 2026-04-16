import { Card, CardContent } from "@mui/material";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { CompanyProfileEditor } from "@/features/dashboard/components/CompanyProfileEditor";
import { backendApiBaseUrl } from "@/lib/api";
import { requireRole } from "@/lib/server-auth";

type CompanyProfile = {
  company_name?: string | null;
  website?: string | null;
  sector?: string | null;
};

export default async function ProfilePage() {
  const session = await requireRole("company");

  const response = await fetch(`${backendApiBaseUrl}/company/profile`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session.user.apiToken}`,
    },
    cache: "no-store",
  }).catch(() => null);

  const payload = response?.ok
    ? ((await response.json()) as { data: CompanyProfile })
    : { data: {} as CompanyProfile };

  return (
    <DashboardShell title="Company Profile">
      <Card>
        <CardContent>
          <CompanyProfileEditor
            token={session.user.apiToken}
            initialCompanyName={payload.data.company_name ?? ""}
            initialWebsite={payload.data.website ?? ""}
            initialSector={payload.data.sector ?? ""}
          />
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
