import { NextResponse } from "next/server";
import { registrationSchema } from "@/features/auth/schemas";
import { backendApiBaseUrl } from "@/lib/api";
import { verifyOtp } from "@/lib/otp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registrationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Please enter valid registration details." }, { status: 400 });
  }

  const values = parsed.data;
  const otpValid = verifyOtp(values.email, values.otp);
  if (!otpValid) {
    return NextResponse.json({ ok: false, message: "Invalid or expired OTP. Please request a new OTP." }, { status: 400 });
  }

  try {
    const backendResponse = await fetch(`${backendApiBaseUrl}/auth/company/register`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
        password_confirmation: values.password,
        name: values.recruiterName,
        company_name: values.recruiterName,
        website: null
      })
    });

    const payload = await backendResponse.json().catch(() => null) as { token?: string; user?: { user_id?: number | string; email?: string; company?: { company_name?: string } }; company?: { company_name?: string }; message?: string } | null;

    if (!backendResponse.ok || !payload?.token || !payload.user) {
      return NextResponse.json(
        {
          ok: false,
          message: payload?.message ?? "Unable to create recruiter account."
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      recruiter: {
        id: String(payload.user.user_id ?? values.email),
        email: payload.user.email ?? values.email,
        recruiterName: payload.company?.company_name ?? values.recruiterName
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create recruiter account.";
    return NextResponse.json({ ok: false, message }, { status: 400 });
  }
}

