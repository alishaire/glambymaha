/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com", "img.freepik.com", "cdn.pixabay.com"],
  },
  env: {
    MONGO_URI:
      "mongodb+srv://alishabbir3151:iloveyoumorethenanythingelse@uncroped.fnfrefx.mongodb.net/glambymaha?retryWrites=true&w=majority",
    NEXTAUTH_SECRET: "wiuroiewmx#$#13213",
    SECURE_URL: "AhmadUShopEComeraceStore",
  },

  reactStrictMode: true,
};

module.exports = nextConfig;
