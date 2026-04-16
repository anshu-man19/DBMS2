"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

type DraftItem = {
  type: "JNF" | "INF";
  title: string;
  href: string;
  details: string;
};

type DraftState = {
  jobProfile?: {
    jobTitle?: string | null;
    designation?: string | null;
  };
};

const JNF_STORAGE_KEY = "iit-ism-jnf-draft";
const INF_STORAGE_KEY = "iit-ism-inf-draft";

const makeDraftItem = (
  type: "JNF" | "INF",
  stored: DraftState | null,
): DraftItem | null => {
  if (!stored) {
    return null;
  }

  const title =
    stored.jobProfile?.jobTitle?.trim() ||
    stored.jobProfile?.designation?.trim() ||
    `${type} draft`;

  return {
    type,
    title,
    href: type === "JNF" ? "/jnf/new?loadDraft=1" : "/inf/new?loadDraft=1",
    details:
      type === "JNF"
        ? "Open the JNF builder and load the saved browser draft."
        : "Open the INF builder and load the saved browser draft.",
  };
};

export function SavedDraftsPanel() {
  const [drafts, setDrafts] = useState<DraftItem[]>([]);

  useEffect(() => {
    const items: DraftItem[] = [];

    try {
      const jnfStored = window.localStorage.getItem(JNF_STORAGE_KEY);
      if (jnfStored) {
        const parsed = JSON.parse(jnfStored) as DraftState;
        const item = makeDraftItem("JNF", parsed);
        if (item) {
          items.push(item);
        }
      }
    } catch {
      // Ignore malformed local draft data.
    }

    try {
      const infStored = window.localStorage.getItem(INF_STORAGE_KEY);
      if (infStored) {
        const parsed = JSON.parse(infStored) as DraftState;
        const item = makeDraftItem("INF", parsed);
        if (item) {
          items.push(item);
        }
      }
    } catch {
      // Ignore malformed local draft data.
    }

    setDrafts(items);
  }, []);

  return (
    <Card>
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={2}>
          <Stack spacing={0.5}>
            <Typography variant="h5" fontWeight={900}>
              Saved Drafts
            </Typography>
            <Typography color="text.secondary">
              These drafts are stored in this browser only. Use them to resume a
              form you started earlier.
            </Typography>
          </Stack>

          {drafts.length > 0 ? (
            <Stack spacing={2}>
              {drafts.map((draft) => (
                <Card key={`${draft.type}-${draft.title}`} variant="outlined">
                  <CardContent>
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", md: "center" }}
                      spacing={2}
                    >
                      <div>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip
                            label={draft.type}
                            size="small"
                            color="primary"
                          />
                          <Typography fontWeight={800}>
                            {draft.title}
                          </Typography>
                        </Stack>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mt={0.5}
                        >
                          {draft.details}
                        </Typography>
                      </div>
                      <Button
                        component={Link}
                        href={draft.href}
                        variant="contained"
                      >
                        Resume Draft
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          ) : (
            <Typography color="text.secondary">
              No browser draft found here yet. Start a JNF or INF to create one.
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
