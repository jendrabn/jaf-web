import type { UserTypes } from "./user";

export interface LoginTypes {
  // When OTP is not required (legacy flow), backend may return an auth token directly
  auth_token?: string;
  // OTP-first flow fields
  otp_required?: boolean;
  otp_expires_at?: string; // ISO timestamp when OTP expires
  otp_sent_to?: string; // destination email
  // Optional email context
  email?: string;
}

export type RegisterTypes = UserTypes;

export interface LoginReqTypes {
  email?: string;
  password?: string;
}

export interface RegisterReqTypes {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
}

export interface ForgotPasswordReqTypes {
  email?: string;
}

export interface ResetPasswordReqTypes {
  email?: string;
  token?: string;
  password?: string;
  password_confirmation?: string;
}
