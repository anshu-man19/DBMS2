import Link from "next/link";
import {
  Card,
  CardContent,
  Chip,
  Grid2 as Grid,
  Stack,
  Typography,
} from "@mui/material";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { SubmissionActions } from "@/features/dashboard/components/SubmissionActions";
import { backendApiBaseUrl } from "@/lib/api";
import { requireRole } from "@/lib/server-auth";

type Submission = {
  jnf_id?: number;
  inf_id?: number;
  title?: string | null;
  status?: string | null;
};

export default async function SubmissionsPage() {
  const session = await requireRole("company");

  const [jnfResponse, infResponse] = await Promise.all([
    fetch(`${backendApiBaseUrl}/company/jnfs`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${session.user.apiToken}`,
      },
      cache: "no-store",
    }).catch(() => null),
    fetch(`${backendApiBaseUrl}/company/infs`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${session.user.apiToken}`,
      },
      cache: "no-store",
    }).catch(() => null),
  ]);

  const jnfs = jnfResponse?.ok
    ? (((await jnfResponse.json()) as { data: Submission[] }).data ?? [])
    : [];
  const infs = infResponse?.ok
    ? (((await infResponse.json()) as { data: Submission[] }).data ?? [])
    : [];

  return (
    <DashboardShell title="Submissions">
      <Grid container spacing={2}>
        {[
          ...jnfs.map((item) => ({ ...item, type: "jnf" as const })),
          ...infs.map((item) => ({ ...item, type: "inf" as const })),
        ].map((item) => {
          const id = item.type === "jnf" ? item.jnf_id : item.inf_id;
          if (!id) return null;

          return (
            <Grid size={{ xs: 12, md: 6 }} key={`${item.type}-${id}`}>
              <Card>
                <CardContent>
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="h6" fontWeight={800}>
                        {item.title ?? `${item.type.toUpperCase()} ${id}`}
                      </Typography>
                      <Chip label={item.status ?? "draft"} size="small" />
                    </Stack>
                    <Stack direction="row" spacing={2}>
                      <Link
                        href={
                          item.type === "jnf"
                            ? `/dashboard/my-jnfs/${id}`
                            : `/dashboard/my-infs/${id}`
                        }
                      >
                        Detail
                      </Link>
                      <Link
                        href={
                          item.type === "jnf"
                            ? `/jnf/${id}/edit`
                            : `/inf/${id}/edit`
                        }
                      >
                        Edit
                      </Link>
                    </Stack>
                    <SubmissionActions
                      id={id}
                      type={item.type}
                      token={session.user.apiToken}
                      canDelete={(item.status ?? "") === "draft"}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </DashboardShell>
  );
}
