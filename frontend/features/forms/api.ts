import { backendApiBaseUrl } from "@/lib/api";
import { JnfFormValues } from "@/features/jnf/schemas";

type SaveParams = {
  token: string;
  values: JnfFormValues;
  draftId?: number | null;
};

const normalizeWorkMode = (value?: string | null) => {
  if (!value) return null;
  const normalized = value.toLowerCase();
  if (normalized === "onsite" || normalized === "remote" || normalized === "hybrid") {
    return normalized;
  }
  return null;
};

const normalizeDate = (value?: string | null) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed.toISOString().slice(0, 10);
};

const buildJnfPayload = (values: JnfFormValues) => ({
  title: values.jobProfile.jobTitle || values.jobProfile.designation || null,
  description: values.jobProfile.jdContent || values.jobProfile.additionalInfo || null,
  job_profile: {
    profile_name: values.jobProfile.jobTitle || null,
    job_designation: values.jobProfile.designation || null,
    place_of_posting: values.jobProfile.location || null,
    work_location_mode: normalizeWorkMode(values.jobProfile.workMode),
    expected_hires: values.jobProfile.expectedHires ?? null,
    minimum_hires: values.jobProfile.minimumHires ?? null,
    tentative_joining_month: normalizeDate(values.jobProfile.joiningDate),
    required_skills: values.jobProfile.skills ?? [],
    job_description: values.jobProfile.jdContent || null,
    additional_info: values.jobProfile.additionalInfo || null,
    bond_details: values.jobProfile.bondDuration || null,
    registration_link: values.jobProfile.registrationLink || null,
    onboarding_details: values.jobProfile.onboardingInfo || null,
  },
});

const buildInfPayload = (values: JnfFormValues) => ({
  title: values.jobProfile.jobTitle || values.jobProfile.designation || null,
  description: values.jobProfile.jdContent || values.jobProfile.additionalInfo || null,
  internship_profile: {
    profile_name: values.jobProfile.jobTitle || null,
    internship_role: values.jobProfile.designation || null,
    place_of_posting: values.jobProfile.location || null,
    work_location_mode: normalizeWorkMode(values.jobProfile.workMode),
    expected_hires: values.jobProfile.expectedHires ?? null,
    minimum_hires: values.jobProfile.minimumHires ?? null,
    duration_months: values.jobProfile.durationMonths ? Number(values.jobProfile.durationMonths) || null : null,
    internship_start_month: normalizeDate(values.jobProfile.joiningDate),
    required_skills: values.jobProfile.skills ?? [],
    job_description: values.jobProfile.jdContent || null,
    additional_info: values.jobProfile.additionalInfo || null,
    ppo_available: Boolean(values.jobProfile.ppoAvailable),
    registration_link: values.jobProfile.registrationLink || null,
  },
});

async function requestJson(url: string, method: "POST" | "PUT", token: string, body: unknown) {
  const response = await fetch(url, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorPayload = (await response.json().catch(() => null)) as
      | { message?: string; errors?: Record<string, string[]> }
      | null;
    const validationMessage = errorPayload?.errors
      ? Object.values(errorPayload.errors).flat().filter(Boolean).join(" ")
      : "";

    throw new Error(
      errorPayload?.message || validationMessage || `Request failed with status ${response.status}`,
    );
  }

  return response.json() as Promise<{ data?: { jnf_id?: number; inf_id?: number } }>;
}

export async function saveJnfDraft({ token, values, draftId }: SaveParams): Promise<number> {
  const payload = buildJnfPayload(values);
  const url = draftId
    ? `${backendApiBaseUrl}/company/jnfs/${draftId}`
    : `${backendApiBaseUrl}/company/jnfs`;
  const method: "POST" | "PUT" = draftId ? "PUT" : "POST";

  const json = await requestJson(url, method, token, payload);
  const id = json.data?.jnf_id ?? draftId;
  if (!id) {
    throw new Error("Unable to resolve JNF id");
  }

  return id;
}

export async function saveInfDraft({ token, values, draftId }: SaveParams): Promise<number> {
  const payload = buildInfPayload(values);
  const url = draftId
    ? `${backendApiBaseUrl}/company/infs/${draftId}`
    : `${backendApiBaseUrl}/company/infs`;
  const method: "POST" | "PUT" = draftId ? "PUT" : "POST";

  const json = await requestJson(url, method, token, payload);
  const id = json.data?.inf_id ?? draftId;
  if (!id) {
    throw new Error("Unable to resolve INF id");
  }

  return id;
}
