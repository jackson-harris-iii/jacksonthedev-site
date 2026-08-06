import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", String(process.pid) + "-" + Date.now());
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

async function readPngDimensions(relativePath) {
  const buffer = await readFile(new URL(relativePath, templateRoot));
  assert.equal(buffer.subarray(1, 4).toString("ascii"), "PNG");
  return [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];
}

test("server-renders the JacksonTheDev landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>JacksonTheDev — Human in the Loop<\/title>/i);
  assert.match(html, /Your expertise should create/);
  assert.match(html, /Book your call/);
  assert.match(html, /https:\/\/stan\.store\/jacksonthedev/);
  assert.match(html, /AI isn’t the offer/);
  assert.match(html, /Founding engineer/);
  assert.match(html, /SpotX Games/);
  assert.match(html, /Human Current/i);
  assert.match(html, /aria-label="Primary navigation"/);
  assert.doesNotMatch(
    html,
    /codex-preview|react-loading-skeleton|Starter Project/i,
  );
});

test("server-renders the retained design lab alongside the Human Current homepage", async () => {
  const response = await render("/concepts");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>JacksonTheDev Design Lab — Three Directions<\/title>/i);
  assert.match(html, /Selfrow Editorial/);
  assert.match(html, /Human Current/);
  assert.match(html, /California Circuit/);
  assert.match(html, /Turn what’s in your head into systems your business can/);
  assert.match(html, /Book a Brain-to-System Audit/);
  assert.match(html, /aria-pressed="true"/);
});

test("keeps all three visual systems and the social preview in source", async () => {
  const [page, css, layout, manifestText] = await Promise.all([
    readFile(new URL("../app/concepts/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/concepts/concepts.module.css", import.meta.url), "utf8"),
    readFile(new URL("../app/concepts/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/brand/manifest.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /SelfrowConcept/);
  assert.match(page, /HumanCurrentConcept/);
  assert.match(page, /Human Current/);
  assert.doesNotMatch(page, /Peacock Atelier/);
  assert.match(page, /THE HUMAN THESIS/);
  assert.match(page, /HUMAN IN THE LOOP/);
  assert.match(page, /WHAT DO YOU WANT TO BUILD\?/);
  assert.match(page, /Book your call/);
  assert.match(page, /https:\/\/stan\.store\/jacksonthedev/);
  assert.doesNotMatch(page, /Reserve through Stan|Apply via Stan|STAN HANDOFF/);
  assert.match(page, /CaliforniaConcept/);
  assert.match(page, /BookingHandoff/);
  assert.doesNotMatch(page, /StanHandoff/);
  assert.match(css, /#0b1c48/i);
  assert.match(css, /--emerald: #1ed89a/i);
  assert.match(css, /--electric-red: #d12a55/i);
  assert.match(css, /humanCurrent/);
  assert.doesNotMatch(css, /identityPulse/);
  assert.match(css, /orbitOne/);
  assert.match(css, /signalCards article:hover/);
  assert.doesNotMatch(css, /atelierFeather/);
  assert.doesNotMatch(css, /#8247ff|#aa6aff/i);
  assert.match(css, /tower-bridge-peacock-master\.png/);
  assert.match(css, /--forest: #193c2c/i);
  assert.match(layout, /summary_large_image/);
  assert.match(layout, /og-peacock-atelier\.png/);

  const manifest = JSON.parse(manifestText);
  assert.equal(manifest.accent, "#d12a55");
  assert.deepEqual(manifest.lockup_copy, ["JACKSONTHEDEV", "HUMAN IN THE LOOP"]);
  assert.equal(manifest.booking_url, "https://stan.store/jacksonthedev");
  assert.deepEqual(
    manifest.outputs.map(({ file, width, height }) => [file, width, height]),
    [
      ["jacksonthedev-linkedin-banner.png", 1584, 396],
      ["jacksonthedev-x-banner.png", 1500, 500],
      ["jacksonthedev-business-card-front.png", 1050, 600],
      ["og-peacock-atelier.png", 1600, 900],
    ],
  );

  await Promise.all([
    access(new URL("public/brand/tower-bridge-peacock-master.png", templateRoot)),
    access(new URL("public/brand/jacksonthedev-linkedin-banner.png", templateRoot)),
    access(new URL("public/brand/jacksonthedev-x-banner.png", templateRoot)),
    access(new URL("public/brand/jacksonthedev-business-card-front.png", templateRoot)),
    access(new URL("public/og-peacock-atelier.png", templateRoot)),
  ]);

  assert.deepEqual(
    await Promise.all([
      readPngDimensions("public/brand/jacksonthedev-linkedin-banner.png"),
      readPngDimensions("public/brand/jacksonthedev-x-banner.png"),
      readPngDimensions("public/brand/jacksonthedev-business-card-front.png"),
      readPngDimensions("public/og-peacock-atelier.png"),
    ]),
    [
      [1584, 396],
      [1500, 500],
      [1050, 600],
      [1600, 900],
    ],
  );
});

test("keeps the production homepage, Human Current styling, and launch metadata", async () => {
  const [page, css, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /instagram\.com\/jacksonthedev/);
  assert.match(page, /HUMAN CURRENT/);
  assert.match(page, /HUMAN IN THE LOOP/);
  assert.match(page, /stan\.store\/jacksonthedev/);
  assert.match(css, /--electric-red: #d12a55/i);
  assert.match(css, /tower-bridge-peacock-master\.png/);
  assert.match(css, /system-card:hover/);
  assert.match(layout, /jacksonthedev\.jacksonthedev\.chatgpt\.site/);
  assert.match(layout, /Human in the Loop/);
  assert.match(layout, /summary_large_image/);
  assert.doesNotMatch(page, /_sites-preview|SkeletonPreview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await assert.rejects(access(new URL("../app/_sites-preview", templateRoot)));
});
