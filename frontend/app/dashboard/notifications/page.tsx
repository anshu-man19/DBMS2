import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { backendApiBaseUrl } from "@/lib/api";
import { requireRole } from "@/lib/server-auth";

type Notification = {
  notification_id: number;
  title: string;
  message?: string | null;
};

export default async function CompanyNotificationsPage() {
  const session = await requireRole("company");

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
    <DashboardShell title="Notifications">
      <Card>
        <CardContent>
          <Typography variant="h5" fontWeight={900} gutterBottom>
            Company Notifications
          </Typography>
          <List>
            {payload.data.map((item) => (
              <ListItem key={item.notification_id} divider>
                <ListItemText
                  primary={item.title}
                  secondary={item.message ?? ""}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
