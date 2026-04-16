"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Grid2 as Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { backendApiBaseUrl } from "@/lib/api";

type Props = {
  token: string;
  companyId: number;
  initialCompanyName: string;
  initialWebsite: string;
  initialSector: string;
};

export function AdminCompanyEditor({
  token,
  companyId,
  initialCompanyName,
  initialWebsite,
  initialSector,
}: Props) {
  const router = useRouter();
  const [companyName, setCompanyName] = useState(initialCompanyName);
  const [website, setWebsite] = useState(initialWebsite);
  const [sector, setSector] = useState(initialSector);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);

    const response = await fetch(
      `${backendApiBaseUrl}/admin/companies/${companyId}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          company_name: companyName,
          website,
          sector,
        }),
      },
    ).catch(() => null);

    setSaving(false);

    if (!response?.ok) {
      return;
    }

    router.refresh();
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6" fontWeight={800}>
        Edit Company Profile
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Company Name"
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Website"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Sector"
            value={sector}
            onChange={(event) => setSector(event.target.value)}
            fullWidth
          />
        </Grid>
      </Grid>
      <Button
        variant="contained"
        onClick={save}
        disabled={saving}
        sx={{ alignSelf: "flex-start" }}
      >
        Save Company
      </Button>
    </Stack>
  );
}
