import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin Turbopack root so it always resolves `next` from this project
  // (avoids "Next.js package not found" when root detection misfires).
  turbopack: {
    root: __dirname,
  },
  experimental: {
    serverActions: {
      // CV uploads up to 5MB + multipart overhead; About images up to 3MB
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
