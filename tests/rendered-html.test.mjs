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

test("server-renders the JacksonTheDev landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>JacksonTheDev — Practical AI Systems<\/title>/i);
  assert.match(html, /Turn the work you repeat into a system that/);
  assert.match(html, /Get your free AI blueprint/);
  assert.match(html, /AI isn’t the offer/);
  assert.match(html, /Founding engineer/);
  assert.match(html, /SpotX Games/);
  assert.match(html, /DM “BLUEPRINT”/);
  assert.match(html, /aria-label="Primary navigation"/);
  assert.doesNotMatch(
    html,
    /codex-preview|react-loading-skeleton|Starter Project/i,
  );
});

test("server-renders the design lab without replacing the current homepage", async () => {
  const response = await render("/concepts");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>JacksonTheDev Design Lab — Three Directions<\/title>/i);
  assert.match(html, /Selfrow Editorial/);
  assert.match(html, /Peacock Signal/);
  assert.match(html, /California Circuit/);
  assert.match(html, /Turn what’s in your head into systems your business can/);
  assert.match(html, /Book a Brain-to-System Audit/);
  assert.match(html, /aria-pressed="true"/);
});

test("keeps all three visual systems and the social preview in source", async () => {
  const [page, css, layout] = await Promise.all([
    readFile(new URL("../app/concepts/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/concepts/concepts.module.css", import.meta.url), "utf8"),
    readFile(new URL("../app/concepts/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(page, /SelfrowConcept/);
  assert.match(page, /PeacockConcept/);
  assert.match(page, /CaliforniaConcept/);
  assert.match(page, /StanHandoff/);
  assert.match(css, /#0b1c48/i);
  assert.match(css, /--emerald: #1ed89a/i);
  assert.match(css, /--forest: #193c2c/i);
  assert.match(layout, /summary_large_image/);
  await access(new URL("public/og.png", templateRoot));
});

test("removes the disposable starter and keeps launch metadata", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /instagram\.com\/jacksonthedev/);
  assert.match(page, /Human in the loop/i);
  assert.match(layout, /jacksonthedev\.com/);
  assert.match(layout, /Practical AI Systems/);
  assert.doesNotMatch(page, /_sites-preview|SkeletonPreview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await assert.rejects(access(new URL("../app/_sites-preview", templateRoot)));
});
