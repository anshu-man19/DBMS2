import Link from "next/link";
import {
  Box,
  Card,
  CardContent,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { backendApiBaseUrl } from "@/lib/api";
import { requireRole } from "@/lib/server-auth";

type CompanyRow = {
  company_id: number;
  company_name?: string | null;
  sector?: string | null;
  website?: string | null;
};

export default async function AdminCompaniesPage() {
  const session = await requireRole("admin");

  const response = await fetch(`${backendApiBaseUrl}/admin/companies`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${session.user.apiToken}`,
    },
    cache: "no-store",
  }).catch(() => null);

  const payload = response?.ok
    ? ((await response.json()) as { data: CompanyRow[] })
    : { data: [] as CompanyRow[] };

  return (
    <Box>
      <PublicNavbar />
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h4" fontWeight={900}>
                Companies
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Sector</TableCell>
                    <TableCell>Website</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payload.data.map((company) => (
                    <TableRow key={company.company_id}>
                      <TableCell>{company.company_name ?? "Unnamed"}</TableCell>
                      <TableCell>{company.sector ?? "-"}</TableCell>
                      <TableCell>{company.website ?? "-"}</TableCell>
                      <TableCell>
                        <Link href={`/admin/companies/${company.company_id}`}>
                          View
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
