import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    ERXES_API_URL: "http://localhost:4000/graphql",
    ERXES_URL: "http://localhost:4000",
    ERXES_FILE_URL: "http://localhost:4000/read-file?key=",
    ERXES_APP_TOKEN:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHAiOnsibmFtZSI6IkJNUyB0ZXN0IiwiY3JlYXRlZEF0IjoiMjAyNC0xMi0wMlQxMTowOTowOC42MDNaIiwidXNlckdyb3VwSWQiOiJuTlBtbmtKbXdHdHEycXVoeiIsImV4cGlyZURhdGUiOiIyMDI1LTAxLTAzVDAyOjU0OjU2LjIwOFoiLCJub0V4cGlyZSI6dHJ1ZSwiYWxsb3dBbGxQZXJtaXNzaW9uIjp0cnVlLCJfaWQiOiJiYU5DZ0FTVXNkMWdheFBYVV83VGUiLCJfX3YiOjB9LCJpYXQiOjE3MzMyODA5MDh9.xPo9ijx7LsHfs3NamL836hFhJMtUnnB0sGbDztSKi3E",
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname);
    return config;
  },
};

export default nextConfig;
