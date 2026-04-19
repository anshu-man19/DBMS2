"use client";

import { useState } from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Button,
  Card,
  CardContent,
  Grid2 as Grid,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { Controller, Control, UseFormSetValue } from "react-hook-form";
import { useSession } from "next-auth/react";
import { enqueueSnackbar } from "notistack";
import { ChipInput } from "@/components/common/ChipInput";
import { FileUploadField } from "@/components/common/FileUploadField";
import { FormTextField } from "@/components/common/FormTextField";
import { RichTextEditor } from "@/components/common/RichTextEditor";
import { orgTypes, sectors } from "@/constants/auth";
import { JnfFormValues } from "@/features/jnf/schemas";
import { backendApiBaseUrl } from "@/lib/api";

type Props = {
  control: Control<JnfFormValues>;
  setValue: UseFormSetValue<JnfFormValues>;
};

export function CompanyProfileSection({ control, setValue }: Props) {
  const [descriptionPdfName, setDescriptionPdfName] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const { data: session } = useSession();

  const loadCompanyProfile = async () => {
    const token = session?.user?.apiToken;
    if (!token) {
      enqueueSnackbar("Sign in first to load your saved company profile.", {
        variant: "warning",
      });
      return;
    }

    setLoadingProfile(true);
    try {
      const response = await fetch(`${backendApiBaseUrl}/company/profile`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load company profile");
      }

      const payload = (await response.json()) as {
        data?: Record<string, unknown> | null;
      };
      const company = payload.data ?? {};

      const city = typeof company.hq_city === "string" ? company.hq_city : "";
      const country =
        typeof company.hq_country === "string" ? company.hq_country : "";
      const location = [city, country].filter(Boolean).join(", ");
      const establishmentDate =
        typeof company.date_of_establishment === "string"
          ? company.date_of_establishment.slice(0, 10)
          : "";

      setValue(
        "companyProfile.companyName",
        typeof company.company_name === "string" ? company.company_name : "",
      );
      setValue(
        "companyProfile.website",
        typeof company.website === "string" ? company.website : "",
      );
      setValue(
        "companyProfile.address",
        typeof company.postal_address === "string"
          ? company.postal_address
          : "",
      );
      setValue(
        "companyProfile.employees",
        company.no_of_employees != null ? String(company.no_of_employees) : "",
      );
      setValue(
        "companyProfile.sector",
        typeof company.sector === "string" ? company.sector : "",
      );
      setValue(
        "companyProfile.orgType",
        typeof company.category === "string"
          ? ({
              startup: "Startup",
              mnc: "MNC",
              psu: "PSU",
              private: "Private Limited",
              other: "Research Lab",
            }[company.category] ?? "")
          : "",
      );
      setValue("companyProfile.establishmentDate", establishmentDate);
      setValue(
        "companyProfile.annualTurnover",
        company.annual_turnover != null ? String(company.annual_turnover) : "",
      );
      setValue(
        "companyProfile.linkedInUrl",
        typeof company.linkedin_url === "string" ? company.linkedin_url : "",
      );
      setValue(
        "companyProfile.hqLocation",
        location ||
          (typeof company.postal_address === "string"
            ? company.postal_address
            : ""),
      );
      setValue(
        "companyProfile.industryTags",
        Array.isArray(company.industry_tags)
          ? company.industry_tags.filter(
              (tag): tag is string => typeof tag === "string",
            )
          : [],
      );
      setValue(
        "companyProfile.description",
        typeof company.company_description === "string"
          ? company.company_description
          : "",
      );

      enqueueSnackbar(
        "Company profile loaded from your saved account details.",
        { variant: "success" },
      );
    } catch {
      enqueueSnackbar("Unable to load saved company profile.", {
        variant: "error",
      });
    } finally {
      setLoadingProfile(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2.5}>
          <Stack spacing={0.5}>
            <Typography variant="h6" fontWeight={800}>
              Company Profile
            </Typography>
            <Typography color="text.secondary">
              Provide your organisation details before filling the Job Profile
              section.
            </Typography>
          </Stack>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormTextField<JnfFormValues>
                name="companyProfile.companyName"
                control={control}
                label="Company Name"
                required
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormTextField<JnfFormValues>
                name="companyProfile.website"
                control={control}
                label="Website"
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormTextField<JnfFormValues>
                name="companyProfile.address"
                control={control}
                label="Address"
                multiline
                rows={3}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormTextField<JnfFormValues>
                name="companyProfile.employees"
                control={control}
                label="Employees"
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormTextField<JnfFormValues>
                name="companyProfile.sector"
                control={control}
                label="Sector"
                select
                fullWidth
              >
                {sectors.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </FormTextField>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormTextField<JnfFormValues>
                name="companyProfile.orgType"
                control={control}
                label="Organisation Type"
                select
                fullWidth
              >
                {orgTypes.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </FormTextField>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormTextField<JnfFormValues>
                name="companyProfile.establishmentDate"
                control={control}
                label="Date of Establishment"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormTextField<JnfFormValues>
                name="companyProfile.annualTurnover"
                control={control}
                label="Annual Turnover"
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormTextField<JnfFormValues>
                name="companyProfile.linkedInUrl"
                control={control}
                label="LinkedIn URL"
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormTextField<JnfFormValues>
                name="companyProfile.hqLocation"
                control={control}
                label="HQ Location"
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="companyProfile.industryTags"
                control={control}
                render={({ field }) => (
                  <ChipInput
                    label="Industry Tags"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Press Enter to add tag"
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Controller
                name="companyProfile.logoFile"
                control={control}
                render={({ field }) => (
                  <FileUploadField
                    label="Company Logo Upload"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Controller
                name="companyProfile.description"
                control={control}
                render={({ field }) => (
                  <Stack spacing={2}>
                    <Typography variant="subtitle1" fontWeight={700}>
                      Company Description
                    </Typography>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      alignItems={{ sm: "center" }}
                    >
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<UploadFileIcon />}
                        sx={{ width: { xs: "100%", sm: "fit-content" } }}
                      >
                        Upload PDF for Company Description
                        <input
                          hidden
                          type="file"
                          accept="application/pdf,.pdf"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) {
                              setDescriptionPdfName(file.name);
                              enqueueSnackbar(
                                "PDF uploaded. Parsing can be connected later.",
                                { variant: "info" },
                              );
                            }
                            event.currentTarget.value = "";
                          }}
                        />
                      </Button>
                      <Button
                        variant="text"
                        color="error"
                        startIcon={<DeleteOutlineIcon />}
                        disabled={!descriptionPdfName}
                        onClick={() => setDescriptionPdfName("")}
                      >
                        Remove
                      </Button>
                      <Typography variant="body2" color="text.secondary">
                        {descriptionPdfName ||
                          "Frontend upload is ready. PDF parsing can be connected later."}
                      </Typography>
                    </Stack>
                    <RichTextEditor
                      label="Company Description"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </Stack>
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button
                variant="outlined"
                onClick={loadCompanyProfile}
                disabled={loadingProfile}
              >
                {loadingProfile
                  ? "Loading saved company profile..."
                  : "Load saved company profile"}
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
}
