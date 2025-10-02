import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import tailwindcss from "@tailwindcss/vite";

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  appType: "mpa",
  base: "",
  build: {
    target: "esnext",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "./index.html"),
        auth: resolve(__dirname, "./auth/index.html"),
        profileWins: resolve(__dirname, "./profile/wins/index.html"),
        profileBids: resolve(__dirname, "./profile/bids/index.html"),
        profileList: resolve(__dirname, "./profile/listing/index.html"),
        post: resolve(__dirname, "./post/index.html"),
        postCreate: resolve(__dirname, "./post/create/index.html"),
      },
    },
  },
  plugins: [tailwindcss()],
});
