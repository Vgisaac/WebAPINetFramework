const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

interface JwtPayload {
  role?: string | string[];
  roles?: string | string[];
  [ROLE_CLAIM]?: string | string[];
}

export const getRoleFromToken = (token?: string): string | null => {
  if (!token) return null;

  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;

    const base64 = payloadPart
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payloadPart.length / 4) * 4, "=");

    const payload = JSON.parse(atob(base64)) as JwtPayload;
    const role = payload.role ?? payload.roles ?? payload[ROLE_CLAIM];

    return Array.isArray(role) ? role[0] ?? null : role ?? null;
  } catch {
    return null;
  }
};
