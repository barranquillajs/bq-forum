import { defineConfig, envField } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import netlify from "@astrojs/netlify";

export default defineConfig({
  site: "https://foro.barranquillajs.org",
  output: "server",
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
  },
  adapter: netlify({
    edgeMiddleware: false,
    binaryMediaTypes: [],
    session: false,
  }),
  env: {
    schema: {
      PUBLIC_GITHUB_CLIENT_ID: envField.string({
        context: "client",
        access: "public",
      }),
      GITHUB_CLIENT_SECRET: envField.string({
        context: "server",
        access: "secret",
      }),
      PUBLIC_APP_URL: envField.string({
        context: "client",
        access: "public",
      }),
      PUBLIC_GITHUB_URL: envField.string({
        context: "client",
        access: "public",
      }),
      PUBLIC_GITHUB_API_URL: envField.string({
        context: "client",
        access: "public",
      }),
    },
  },
});
