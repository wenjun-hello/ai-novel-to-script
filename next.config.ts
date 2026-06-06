import type { NextConfig } from 'next';

const isGithubPages = process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'github-pages';
const basePath = isGithubPages ? (process.env.NEXT_PUBLIC_BASE_PATH || '') : '';

const nextConfig: NextConfig = {
  output: isGithubPages ? 'export' : undefined,
  basePath: basePath || '',
  assetPrefix: basePath || '',
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
