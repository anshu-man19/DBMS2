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
  initialCompanyName: string;
  initialWebsite: string;
  initialSector: string;
};

export function CompanyProfileEditor({
  token,
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

    const payload = { company_name: companyName, website, sector };

    const updateResponse = await fetch(`${backendApiBaseUrl}/company/profile`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }).catch(() => null);

    if (!updateResponse?.ok && updateResponse?.status === 404) {
      const createResponse = await fetch(`${backendApiBaseUrl}/companies`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }).catch(() => null);

      setSaving(false);

      if (!createResponse?.ok) {
        return;
      }

      router.refresh();
      return;
    }

    setSaving(false);

    if (!updateResponse?.ok) {
      return;
    }

    router.refresh();
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={900}>
        Recruiter Profile
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <TextField
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            label="Company Name"
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            label="Website"
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            value={sector}
            onChange={(event) => setSector(event.target.value)}
            label="Sector"
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
        Save Profile
      </Button>
    </Stack>
  );
}
