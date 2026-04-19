"use client";

import { Button } from "@mui/material";
import { signOut } from "next-auth/react";

export function AdminLogoutButton() {
  return (
    <Button
      variant="outlined"
      size="large"
      sx={{
        minWidth: 120,
        fontWeight: 600,
        borderColor: "primary.main",
        color: "primary.main",
        "&:hover": {
          borderColor: "primary.dark",
          bgcolor: "primary.50"
        }
      }}
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
    >
      Logout
    </Button>
  );
}
