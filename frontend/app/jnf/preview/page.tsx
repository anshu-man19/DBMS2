"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { jnfDefaultValues } from "@/features/jnf/defaultValues";
import { PreviewSummary } from "@/features/jnf/components/PreviewSummary";
import { JnfFormValues } from "@/features/jnf/schemas";
import { backendApiBaseUrl } from "@/lib/api";

const STORAGE_KEY = "iit-ism-jnf-draft";
const STORAGE_ID_KEY = "iit-ism-jnf-draft-id";

function PreviewPageContent() {
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const mode =
    searchParams.get("mode") === "dedicated" ? "dedicated" : "review";
  const [data, setData] = useState<JnfFormValues | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    setData(stored ? JSON.parse(stored) : jnfDefaultValues);
  }, []);

  if (!data) {
    return (
      <DashboardShell title="Job Notification Form">
        <Card>
          <CardContent>
            <Typography>Loading preview...</Typography>
          </CardContent>
        </Card>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell title="Job Notification Form">
      <PreviewSummary
        data={data}
        mode={mode}
        basePath="/jnf"
        submitLabel="Submit JNF"
        onSubmit={async () => {
          const token = session?.user?.apiToken;
          const id = Number(window.localStorage.getItem(STORAGE_ID_KEY));

          if (!token || !id) {
            enqueueSnackbar("Save draft first before submitting JNF.", {
              variant: "warning",
            });
            return;
          }

          setSubmitting(true);

          const response = await fetch(
            `${backendApiBaseUrl}/company/jnfs/${id}/submit`,
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
            },
          ).catch(() => null);

          setSubmitting(false);

          if (!response?.ok) {
            enqueueSnackbar("Unable to submit JNF. Please try again.", {
              variant: "error",
            });
            return;
          }

          enqueueSnackbar("JNF submitted successfully", { variant: "success" });
          router.push("/dashboard/submissions");
        }}
        submitting={submitting}
      />
    </DashboardShell>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={null}>
      <PreviewPageContent />
    </Suspense>
  );
}
