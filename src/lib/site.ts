// Central site settings, used by the layout, SEO metadata, sitemap and nav.
export const siteConfig = {
  name: "PeoplesHR",
  // Set NEXT_PUBLIC_SITE_URL to your Vercel URL once deployed.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Free tools and guides from PeoplesHR to help growing businesses measure HR admin costs, choose the right HR and payroll software, and fix everyday HR processes.",
};

export const mainNav = [
  { href: "/cost-calculator", label: "Cost calculator" },
  { href: "/plan-finder", label: "Plan finder" },
  { href: "/resources", label: "HR guides" },
] as const;
