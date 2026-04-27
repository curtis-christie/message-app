export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isValidUsername(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  const trimmedValue = value.trim();

  return /^[a-zA-Z0-9_]{3,30}$/.test(trimmedValue);
}

export function isValidBio(value: unknown): value is string | null | undefined {
  if (value === undefined || value === null) {
    return true;
  }

  if (typeof value !== "string") {
    return false;
  }

  return value.length <= 250;
}

export function isValidAvatarInitials(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  const trimmedValue = value.trim();

  return /^[a-zA-Z]{1,3}$/.test(trimmedValue);
}
