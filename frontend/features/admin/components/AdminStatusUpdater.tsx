"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { backendApiBaseUrl } from "@/lib/api";

type Props = {
  type: "jnf" | "inf";
  id: number;
  token: string;
};

export function AdminStatusUpdater({ type, id, token }: Props) {
  const router = useRouter();
  const [remarks, setRemarks] = useState("");
  const [busy, setBusy] = useState<null | string>(null);

  const updateStatus = async (
    status: "under_review" | "accepted" | "rejected",
  ) => {
    setBusy(status);

    const response = await fetch(
      `${backendApiBaseUrl}/admin/${type}s/${id}/status`,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, remarks: remarks || null }),
      },
    ).catch(() => null);

    setBusy(null);

    if (!response?.ok) {
      return;
    }

    router.refresh();
  };

  return (
    <Stack spacing={1.5}>
      <Typography variant="h6" fontWeight={800}>
        Review Actions
      </Typography>
      <TextField
        label="Remarks"
        value={remarks}
        onChange={(event) => setRemarks(event.target.value)}
        multiline
        minRows={2}
        placeholder="Optional remarks sent to company"
      />
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <Button
          variant="outlined"
          disabled={busy !== null}
          onClick={() => updateStatus("under_review")}
        >
          Move to Under Review
        </Button>
        <Button
          variant="contained"
          disabled={busy !== null}
          onClick={() => updateStatus("accepted")}
        >
          Accept
        </Button>
        <Button
          variant="outlined"
          color="error"
          disabled={busy !== null}
          onClick={() => updateStatus("rejected")}
        >
          Reject
        </Button>
      </Stack>
    </Stack>
  );
}
