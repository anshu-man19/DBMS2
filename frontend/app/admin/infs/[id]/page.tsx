import { notFound } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { AdminStatusUpdater } from "@/features/admin/components/AdminStatusUpdater";
import { backendApiBaseUrl } from "@/lib/api";
import { requireRole } from "@/lib/server-auth";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function AdminInfDetailPage({ params }: Params) {
  const { id } = await params;
  const session = await requireRole("admin");

  const response = await fetch(`${backendApiBaseUrl}/admin/infs/${id}`, {
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
      status?: string | null;
      description?: string | null;
    };
  };
  const data = payload.data;

  return (
    <Box>
      <PublicNavbar />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack spacing={2}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight={900} gutterBottom>
                {data.title ?? "Untitled INF"}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                Current status: {data.status ?? "unknown"}
              </Typography>
              <Typography>
                {data.description ?? "No description provided."}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <AdminStatusUpdater
                type="inf"
                id={Number(id)}
                token={session.user.apiToken}
              />
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
