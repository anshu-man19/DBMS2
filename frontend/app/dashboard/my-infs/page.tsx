import { Grid2 as Grid } from "@mui/material";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { mapInfToProposal } from "@/features/dashboard/proposals";
import { ProposalList } from "@/features/dashboard/components/ProposalList";
import { backendApiBaseUrl } from "@/lib/api";
import { requireRole } from "@/lib/server-auth";

type Submission = {
  inf_id?: number;
  title?: string | null;
  status?: string | null;
  created_at?: string | null;
};

export default async function MyInfsPage() {
  const session = await requireRole("company");

  const response = await fetch(`${backendApiBaseUrl}/company/infs`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session.user.apiToken}`,
    },
    cache: "no-store",
  }).catch(() => null);

  const infs = response?.ok
    ? (((await response.json()) as { data: Submission[] }).data ?? [])
    : [];
  const proposals = infs
    .map((item) => mapInfToProposal(item))
    .filter((item) => item !== null);

  return (
    <DashboardShell title="Recruiter Dashboard">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <ProposalList title="My INFs" proposals={proposals} />
        </Grid>
      </Grid>
    </DashboardShell>
  );
}
