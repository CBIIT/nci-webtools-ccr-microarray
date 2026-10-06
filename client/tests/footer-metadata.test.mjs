import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { parseFooterMetadata } from "../src/components/footerMetadata.mjs";

test("uses the explicit deployment date without changing version parsing", () => {
  assert.deepEqual(
    parseFooterMetadata("1.2.3_dev-build", "2026-10-06"),
    { version: "1.2.3_dev", date: "2026-10-06" },
  );
  assert.deepEqual(
    parseFooterMetadata("dev_11327", "20261006"),
    { version: "dev_11327", date: "2026-10-06" },
  );
});

test("keeps an embedded version date as a compatibility fallback", () => {
  assert.deepEqual(
    parseFooterMetadata("1.2.3_20250914", undefined),
    { version: "1.2.3", date: "2025-09-14" },
  );
});

test("uses a stable fallback instead of the browser date", () => {
  assert.deepEqual(parseFooterMetadata("local", undefined), {
    version: "dev",
    date: "Unknown",
  });
  assert.deepEqual(parseFooterMetadata("dev_11327", "2026-02-30"), {
    version: "dev_11327",
    date: "Unknown",
  });
});

test("footer reads both public build values and renders the parsed date", async () => {
  const footer = await readFile(
    new URL("../src/components/Footer.tsx", import.meta.url),
    "utf8",
  );

  assert.match(footer, /process\.env\.NEXT_PUBLIC_APP_VERSION/);
  assert.match(footer, /process\.env\.NEXT_PUBLIC_DEPLOY_DATE/);
  assert.match(footer, /Last Updated: \{date\}/);
  assert.doesNotMatch(footer, /new Date\(/);
});

test("deployment surfaces pass the controlled date into the frontend build", async () => {
  const workflow = await readFile(
    new URL("../../.github/workflows/deploy-app.yml", import.meta.url),
    "utf8",
  );
  const dockerfile = await readFile(
    new URL("../../docker/frontend.dockerfile", import.meta.url),
    "utf8",
  );
  const compose = await readFile(
    new URL("../../docker-compose.yml", import.meta.url),
    "utf8",
  );

  assert.match(workflow, /DEPLOY_DATE=\$\(date \+"%Y-%m-%d"\)/);
  assert.match(
    workflow,
    /NEXT_PUBLIC_DEPLOY_DATE=\$\{\{ env\.DEPLOY_DATE \}\}/,
  );
  assert.match(dockerfile, /ARG NEXT_PUBLIC_DEPLOY_DATE=Unknown/);
  assert.match(
    dockerfile,
    /ENV NEXT_PUBLIC_DEPLOY_DATE=\$\{NEXT_PUBLIC_DEPLOY_DATE\}/,
  );
  assert.match(compose, /NEXT_PUBLIC_DEPLOY_DATE=Unknown/);
});
