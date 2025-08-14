"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
const sans_1 = require("geist/font/sans");
const mono_1 = require("geist/font/mono");
require("./globals.css");
const theme_provider_1 = require("@/components/theme-provider");
exports.metadata = {
    title: "v0 App",
    description: "Created with v0",
    generator: "v0.dev",
};
function RootLayout({ children, }) {
    return (<html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${sans_1.GeistSans.style.fontFamily};
  --font-sans: ${sans_1.GeistSans.variable};
  --font-mono: ${mono_1.GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <theme_provider_1.ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </theme_provider_1.ThemeProvider>
      </body>
    </html>);
}
