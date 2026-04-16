import { notFound } from "next/navigation";
import { Card, CardContent, Stack, Typography } from "@mui/material";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { backendApiBaseUrl } from "@/lib/api";
import { requireRole } from "@/lib/server-auth";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function CompanyJnfDetailPage({ params }: Params) {
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
    notFound();
  }

  const payload = (await response.json()) as {
    data: {
      title?: string | null;
      description?: string | null;
      status?: string | null;
    };
  };

  return (
    <DashboardShell title="JNF Detail">
      <Card>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h5" fontWeight={900}>
              {payload.data.title ?? `JNF ${id}`}
            </Typography>
            <Typography color="text.secondary">
              Status: {payload.data.status ?? "draft"}
            </Typography>
            <Typography>
              {payload.data.description ?? "No description available."}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
