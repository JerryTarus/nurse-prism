import type { PackageConfig } from "@/types/admin"

type PricingConfigTableProps = {
  packages: PackageConfig[]
}

function formatKes(value: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(value)
}

export function PricingConfigTable({ packages }: PricingConfigTableProps) {
  if (packages.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/70 p-5 text-sm text-muted-foreground">
        Pricing packages are not available yet. Run migrations to start managing
        pricing from CMS.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-card/95">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Package</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price (KES)</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.id} className="border-t border-border/70">
                <td className="px-4 py-3 align-top">
                  <p className="font-medium text-foreground">{pkg.name}</p>
                  <p className="text-xs text-muted-foreground">{pkg.packageKey}</p>
                </td>
                <td className="px-4 py-3 align-top text-foreground/90">{pkg.category}</td>
                <td className="px-4 py-3 align-top text-foreground/90">
                  {formatKes(pkg.basePriceKes)}
                </td>
                <td className="px-4 py-3 align-top">
                  <span className="inline-flex rounded-full border border-border bg-background px-2 py-0.5 text-xs">
                    {pkg.isActive ? "active" : "inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
