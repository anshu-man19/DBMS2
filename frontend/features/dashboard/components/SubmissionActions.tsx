"use client";

import { useRouter } from "next/navigation";
import { Button, Stack } from "@mui/material";
import { backendApiBaseUrl } from "@/lib/api";

type Props = {
  id: number;
  type: "jnf" | "inf";
  token: string;
  canDelete?: boolean;
};

export function SubmissionActions({
  id,
  type,
  token,
  canDelete = false,
}: Props) {
  const router = useRouter();

  const duplicate = async () => {
    const response = await fetch(
      `${backendApiBaseUrl}/company/${type}s/${id}/duplicate`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    ).catch(() => null);

    if (!response?.ok) {
      return;
    }

    router.refresh();
  };

  const remove = async () => {
    const response = await fetch(
      `${backendApiBaseUrl}/company/${type}s/${id}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    ).catch(() => null);

    if (!response?.ok) {
      return;
    }

    router.refresh();
  };

  return (
    <Stack direction="row" spacing={1.2}>
      <Button variant="outlined" onClick={duplicate}>
        Duplicate
      </Button>
      {canDelete ? (
        <Button variant="outlined" color="error" onClick={remove}>
          Delete
        </Button>
      ) : null}
    </Stack>
  );
}
