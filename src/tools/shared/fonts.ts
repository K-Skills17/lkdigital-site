// Self-hosted fonts for the free tools, exposed as --tool-font-* on each tool
// wrapper so tool CSS (scoped by postcss-tool-scope) has its own variables.
import { Cormorant_Garamond, Inter } from "next/font/google";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--tool-font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--tool-font-body",
  display: "swap",
});

export const toolFontVars = `${display.variable} ${body.variable}`;
