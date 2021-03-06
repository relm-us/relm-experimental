import { DEFAULT_RELM_ID, DEFAULT_ENTRYWAY } from "./constants";

export type Config = {
  serverUrl: string;
  serverYjsUrl: string;
  serverUploadUrl: string;
  subrelm: string;
  entryway: string;
};

export const config: Config = getConfig(window.location);

/**
 * Helper functions
 */

function canonicalIdentifier(id: string) {
  return id.toLowerCase().replace(/[^a-z0-9\-]+/, "-");
}

function getSubrelmAndEntryway(
  location: Location
): { subrelm: string; entryway: string } {
  const params = new URLSearchParams(location.search.substring(1));

  const pathParts = location.pathname
    .split("/")
    .map((part) => (part === "" ? null : part));

  // Normally, the subrelm is specified as part of the path, e.g. "/demo", but
  // allow a `?subrelm=[value]` to override it.
  const subrelm = params.get("subrelm") || pathParts[1] || DEFAULT_RELM_ID;
  const entryway = params.get("entryway") || pathParts[2] || DEFAULT_ENTRYWAY;

  return {
    subrelm: canonicalIdentifier(subrelm),
    entryway: canonicalIdentifier(entryway),
  };
}

function getConfig(location): Config {
  let serverUrl: string;
  let serverYjsUrl: string;
  let serverUploadUrl: string;
  if (location.origin === "https://relm.us") {
    serverUrl = "https://y.relm.us";
    serverYjsUrl = "wss://y.relm.us";
  } else if (location.origin === "https://staging.relm.us") {
    serverUrl = "https://y-staging.relm.us";
    serverYjsUrl = "wss://y-staging.relm.us";
  } else {
    serverUrl = `http://${location.hostname}:3000`;
    serverYjsUrl = `ws://${location.hostname}:3000`;
  }
  serverUploadUrl = `${serverUrl}/asset`;

  return {
    serverUrl,
    serverYjsUrl,
    serverUploadUrl,
    ...getSubrelmAndEntryway(location)
  };
}

