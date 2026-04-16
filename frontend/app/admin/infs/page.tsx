import {
  Box,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { AdminLogoutButton } from "@/features/admin/components/AdminLogoutButton";
import { AdminJnfReviewList } from "@/features/admin/components/AdminJnfReviewList";
import { backendApiBaseUrl } from "@/lib/api";
import { requireRole } from "@/lib/server-auth";

export default async function AdminInfReviewPage() {
  const session = await requireRole("admin");

  const response = await fetch(`${backendApiBaseUrl}/admin/infs`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session.user.apiToken}`,
    },
    cache: "no-store",
  }).catch(() => null);

  const payload = response?.ok
    ? await response.json()
    : { data: [] as unknown[] };

  return (
    <Box>
      <PublicNavbar />
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack spacing={3}>
          <Card>
            <CardContent>
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                spacing={2}
              >
                <Box>
                  <Typography variant="h4" fontWeight={900}>
                    INF Review Queue
                  </Typography>
                  <Typography color="text.secondary">
                    Review INF submissions and update status workflow.
                  </Typography>
                </Box>
                <AdminLogoutButton />
              </Stack>
            </CardContent>
          </Card>

          <AdminJnfReviewList
            initialJnfs={payload.data}
            token={session.user.apiToken}
          />
        </Stack>
      </Container>
    </Box>
  );
}
