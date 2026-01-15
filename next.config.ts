import path from "path"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  env: {
    ERXES_API_URL: "https://meetmongolia.app.erxes.io/gateway/graphql",
    ERXES_URL: "https://meetmongolia.app.erxes.io/gateway",
    ERXES_FILE_URL: "https://meetmongolia.app.erxes.io/gateway/read-file?key=",
    ERXES_CP_ID: "Xi_XyNdE0MyH4qxhQgj2d",
    TEMPLATE_TYPE: "tours",
    ERXES_APP_TOKEN:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHAiOnsibmFtZSI6Ik1lZXQgTW9uZ29saWEiLCJjcmVhdGVkQXQiOiIyMDI1LTA1LTI3VDA0OjIzOjUxLjIxMFoiLCJ1c2VyR3JvdXBJZCI6IjRFSHlkVERBaXMyTGRRblpuIiwiZXhwaXJlRGF0ZSI6IjIwMjUtMDYtMjZUMDg6NTc6MzEuNzA1WiIsIm5vRXhwaXJlIjp0cnVlLCJhbGxvd0FsbFBlcm1pc3Npb24iOnRydWUsIl9pZCI6Im9oZW44LW9qY3N0bXBtLW5Zb2dWUiIsIl9fdiI6MH0sImlhdCI6MTc0ODMzNjI4MH0.09smswpoLOXd4emEX4BiT4oh1ofFSrXuhJbeyEVNcec",
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname)
    return config
  },
}

export default nextConfig
