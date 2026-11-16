// Monorepo Metro config: watch the shared packages and resolve React / React Native from this app only,
// so the web apps' React version in the root node_modules never leaks into the native bundle.
const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");
const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, "node_modules"), path.resolve(workspaceRoot, "node_modules")];
const pinned = ["react", "react-native", "@tanstack/react-query"];
const upstream = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const root = pinned.find((p) => moduleName === p || moduleName.startsWith(`${p}/`));
  if (root) {
    try {
      const resolved = require.resolve(moduleName, { paths: [projectRoot] });
      return { type: "sourceFile", filePath: resolved };
    } catch {}
  }
  return (upstream ?? context.resolveRequest)(context, moduleName, platform);
};
module.exports = config;
