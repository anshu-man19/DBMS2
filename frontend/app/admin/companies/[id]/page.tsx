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
import { AdminCompanyEditor } from "@/features/admin/components/AdminCompanyEditor";
import { backendApiBaseUrl } from "@/lib/api";
import { requireRole } from "@/lib/server-auth";

type Params = {
  params: Promise<{ id: string }>;
};

type Company = {
  company_id: number;
  company_name?: string | null;
  website?: string | null;
  sector?: string | null;
};

export default async function AdminCompanyDetailPage({ params }: Params) {
  const { id } = await params;
  const session = await requireRole("admin");

  const response = await fetch(`${backendApiBaseUrl}/admin/companies/${id}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session.user.apiToken}`,
    },
    cache: "no-store",
  }).catch(() => null);

  if (!response?.ok) {
    notFound();
  }

  const payload = (await response.json()) as { data: Company };
  const company = payload.data;

  return (
    <Box>
      <PublicNavbar />
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack spacing={2}>
          <Card>
            <CardContent>
              <Typography variant="h4" fontWeight={900}>
                {company.company_name ?? "Company"}
              </Typography>
              <Typography color="text.secondary">
                Company ID: {company.company_id}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <AdminCompanyEditor
                token={session.user.apiToken}
                companyId={company.company_id}
                initialCompanyName={company.company_name ?? ""}
                initialWebsite={company.website ?? ""}
                initialSector={company.sector ?? ""}
              />
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
