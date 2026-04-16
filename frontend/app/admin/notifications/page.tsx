import {
  Box,
  Card,
  CardContent,
  Container,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { backendApiBaseUrl } from "@/lib/api";
import { requireRole } from "@/lib/server-auth";

type Notification = {
  notification_id: number;
  title: string;
  message?: string | null;
  type: string;
  is_read: boolean;
};

export default async function AdminNotificationsPage() {
  const session = await requireRole("admin");

  const response = await fetch(`${backendApiBaseUrl}/auth/notifications`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session.user.apiToken}`,
    },
    cache: "no-store",
  }).catch(() => null);

  const payload = response?.ok
    ? ((await response.json()) as { data: Notification[] })
    : { data: [] as Notification[] };

  return (
    <Box>
      <PublicNavbar />
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h4" fontWeight={900}>
                Admin Notifications
              </Typography>
              <List>
                {payload.data.map((notification) => (
                  <ListItem key={notification.notification_id} divider>
                    <ListItemText
                      primary={notification.title}
                      secondary={notification.message ?? notification.type}
                    />
                  </ListItem>
                ))}
              </List>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
