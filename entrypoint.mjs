"use strict";

const mode = process.argv[2];

switch (mode) {
  case "run":
    console.log("[ENTRYPOINT] Starting application...");
    import("./dist/index.mjs");
    break;

  case "cleanup-files":
    console.log("[ENTRYPOINT] Running migrations...");
    import("./dist/cleanup-files.mjs");
    break;

  default:
    console.log(
      [
        "Usage:", //
        "  entrypoint.sh run",
        "  entrypoint.sh cleanup-files",
      ].join("\n"),
    );
    process.exit(1);
}
