/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disabled: StrictMode double-mounts components in dev, which tears down and
  // re-creates the converteai video player right after it initializes, causing
  // the playback to stutter/reload. (StrictMode double-mount is dev-only anyway.)
  reactStrictMode: false,
}

export default nextConfig
