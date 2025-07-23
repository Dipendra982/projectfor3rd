import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Add a proxy for your Cloudinary API requests
      "/api/cloudinary": {
        target: "https://api.cloudinary.com/v1_1/dbi711hvu/image/upload",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cloudinary/, ""),
        secure: false, // Set this to false if using HTTPS and you experience issues
      },
    },
  },
});
