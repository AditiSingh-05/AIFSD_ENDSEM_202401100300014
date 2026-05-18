const fs = require("fs");
const path = require("path");

const distDir = path.resolve(__dirname, "../dist");
const indexPath = path.join(distDir, "index.html");
const routes = [
  "dashboard",
  "employees",
  "performance",
  "ai",
  "trainings",
  "reports",
  "departments",
  "skills",
  "users",
  "roles",
  "login",
  "signup"
];

if (!fs.existsSync(indexPath)) {
  throw new Error("Cannot create SPA route fallbacks before dist/index.html exists.");
}

for (const route of routes) {
  const routeDir = path.join(distDir, route);
  fs.mkdirSync(routeDir, { recursive: true });
  fs.copyFileSync(indexPath, path.join(routeDir, "index.html"));
}

console.log(`Created static fallbacks for ${routes.length} frontend routes.`);
