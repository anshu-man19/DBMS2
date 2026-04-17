import { createHash, createHmac, timingSafeEqual } from "crypto";

type OtpPayload = {
  email: string;
  otpHash: string;
  exp: number;
};

function toBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signingSecret() {
  return (
    process.env.OTP_SIGNING_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.DEMO_OTP ||
    "dev-otp-secret"
  );
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function generateOtp(): string {
  const demoOtp = process.env.DEMO_OTP;
  if (demoOtp && /^\d{6}$/.test(demoOtp)) {
    return demoOtp;
  }

  return String(Math.floor(100000 + Math.random() * 900000));
}

function hashOtp(email: string, otp: string) {
  return createHash("sha256").update(`${email}:${otp.trim()}`).digest("hex");
}

function sign(value: string) {
  return createHmac("sha256", signingSecret()).update(value).digest("base64url");
}

function encodePayload(payload: OtpPayload) {
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

function decodePayload(token: string): OtpPayload | null {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = sign(encodedPayload);
  const actual = Buffer.from(signature, "utf8");
  const expected = Buffer.from(expectedSignature, "utf8");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return null;
  }

  try {
    return JSON.parse(fromBase64Url(encodedPayload)) as OtpPayload;
  } catch {
    return null;
  }
}

export function issueOtp(email: string, ttlSeconds = 300) {
  const normalized = normalizeEmail(email);
  const otp = generateOtp();
  const expiresAt = Date.now() + ttlSeconds * 1000;
  const token = encodePayload({
    email: normalized,
    otpHash: hashOtp(normalized, otp),
    exp: expiresAt,
  });

  return { email: normalized, otp, expiresAt, ttlSeconds, token };
}

export function verifyOtp(email: string, otp: string, token?: string | null) {
  if (!token) {
    return false;
  }

  const normalized = normalizeEmail(email);
  const payload = decodePayload(token);
  if (!payload) {
    return false;
  }

  if (Date.now() > payload.exp) {
    return false;
  }

  if (payload.email !== normalized) {
    return false;
  }

  return payload.otpHash === hashOtp(normalized, otp);
}
