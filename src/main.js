import carlo from "carlo";
import path from "path";
import theme from "./renderer/theme";

const exts =
  "/Users/grenaudeau/Library/Application Support/Electron/extensions/fmkadmapgofadopljbjfkapdkoienihi";

(async () => {
  const app = await carlo.launch({
    bgcolor: theme.background,
    args:
      process.env.NODE_ENV === "development"
        ? ["--load-extension=" + exts, "--disable-extensions-except=" + exts]
        : []
  });
  app.on("exit", () => process.exit());
  console.log(path.join(__dirname, "../www"));
  app.serveFolder(path.join(__dirname, "../www"));
  await app.load("index.html");
})();
