import { Grid2 as Grid } from "@mui/material";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { mapJnfToProposal } from "@/features/dashboard/proposals";
import { ProposalList } from "@/features/dashboard/components/ProposalList";
import { backendApiBaseUrl } from "@/lib/api";
import { requireRole } from "@/lib/server-auth";

type Submission = {
  jnf_id?: number;
  title?: string | null;
  status?: string | null;
  created_at?: string | null;
};

export default async function MyJnfsPage() {
  const session = await requireRole("company");

  const response = await fetch(`${backendApiBaseUrl}/company/jnfs`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session.user.apiToken}`,
    },
    cache: "no-store",
  }).catch(() => null);

  const jnfs = response?.ok
    ? (((await response.json()) as { data: Submission[] }).data ?? [])
    : [];
  const proposals = jnfs
    .map((item) => mapJnfToProposal(item))
    .filter((item) => item !== null);

  return (
    <DashboardShell title="Recruiter Dashboard">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <ProposalList title="My JNFs" proposals={proposals} />
        </Grid>
      </Grid>
    </DashboardShell>
  );
}
