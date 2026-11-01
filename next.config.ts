import type { NextConfig } from "next";

const nextConfig: NextConfig = { agentRules: false, async headers() { return [{ source: "/:path*", headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0" }] }]; } };
export default nextConfig;
