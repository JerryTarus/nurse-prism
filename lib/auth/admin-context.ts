export function buildAdminContextPayload(input: {
  canAccessAdmin: boolean
  isSuperAdmin: boolean
}) {
  return {
    canAccessAdmin: input.canAccessAdmin,
    isSuperAdmin: input.isSuperAdmin,
    adminPath: "/admin",
  }
}
