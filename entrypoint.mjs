"use strict";

const mode = process.argv[2];

switch (mode) {
  case "run":
    console.log("[ENTRYPOINT] Starting application...");
    import("./dist/index.mjs");
    break;

  case "migrate":
    console.log("[ENTRYPOINT] Running migrations...");
    import("./dist/migrate.mjs");
    break;

  default:
    console.log(
      [
        "Usage:", //
        "  entrypoint.sh run",
        "  entrypoint.sh migrate",
      ].join("\n"),
    );
    process.exit(1);
}
