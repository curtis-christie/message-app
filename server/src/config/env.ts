import dotenv from "dotenv";

dotenv.config();

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required env variable: ${name}`);
  }

  return value;
}

function getOptionalNumberEnv(name: string, fallback: number): number {
  const value = process.env[name];

  if (!value) {
    return fallback;
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    throw new Error(`Environment variable ${name} must be a number.`);
  }

  return parsed;
}

export const env = {
  PORT: getOptionalNumberEnv("PORT", 5000),
  CLIENT_ORIGIN: getRequiredEnv("CLIENT_ORIGIN"),
  DATABASE_URL: getRequiredEnv("DATABASE_URL"),
  SESSION_SECRET: getRequiredEnv("SESSION_SECRET"),
  NODE_ENV: process.env.NODE_ENV || "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
};
