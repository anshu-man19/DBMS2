import Link from "next/link";
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid2 as Grid,
  Stack,
  Typography,
} from "@mui/material";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { AdminLogoutButton } from "@/features/admin/components/AdminLogoutButton";
import { backendApiBaseUrl } from "@/lib/api";
import { requireRole } from "@/lib/server-auth";

export default async function AdminDashboardPage() {
  const session = await requireRole("admin");

  const response = await fetch(`${backendApiBaseUrl}/admin/dashboard`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session.user.apiToken}`,
    },
    cache: "no-store",
  }).catch(() => null);

  const payload = response?.ok ? await response.json() : { data: {} };
  const data = (payload.data ?? {}) as Record<string, number>;

  return (
    <Box>
      <PublicNavbar />
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack spacing={3}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Typography variant="h4" fontWeight={900}>
              Admin Dashboard
            </Typography>
            <AdminLogoutButton />
          </Stack>

          <Grid container spacing={2}>
            <StatCard
              label="Total Companies"
              value={data.total_companies ?? 0}
            />
            <StatCard label="Submitted JNFs" value={data.submitted_jnfs ?? 0} />
            <StatCard label="Submitted INFs" value={data.submitted_infs ?? 0} />
            <StatCard
              label="Unread Notifications"
              value={data.unread_notifications ?? 0}
            />
          </Grid>

          <Card>
            <CardContent>
              <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
                <Link href="/admin/jnfs">JNF Queue</Link>
                <Link href="/admin/infs">INF Queue</Link>
                <Link href="/admin/companies">Companies</Link>
                <Link href="/admin/notifications">Notifications</Link>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
      <Card>
        <CardContent>
          <Typography color="text.secondary">{label}</Typography>
          <Typography variant="h4" fontWeight={900}>
            {value}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}
