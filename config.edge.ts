import type { AppConfig } from "./lib/edge/types.ts";

import { prompts } from "./prompts/prompts.ts";
// import { prompt as TourPrompt } from "./prompts/tour-guide.ts";

const COOKIE_NAME = "study_cond";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 1 day in seconds

function parseCookies(cookieHeader: string | null) {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [k, ...v] = c.trim().split("=");
      return [k, decodeURIComponent(v.join("="))];
    })
  );
}

export const appConfig: AppConfig = {
  // This should be set in an environment variable
  // See https://platform.openai.com/account/api-keys
  OPENAI_API_KEY: Netlify.env.get("OPENAI_API_KEY") ?? "",

  // The maximum number of message in the history to send to the API
  // You should also set this in the config.browser.ts file.
  historyLength: 8,

  // The maximum length in characters of each message sent to the API
  // You should also set this in the config.browser.ts file.
  maxMessageLength: 1000,

  // The config values sent to the OpenAI API
  // See https://platform.openai.com/docs/api-reference/chat/create
  apiConfig: {
    model: "gpt-3.5-turbo-1106",
  },

  // This is where the magic happens. See the README for details
  // This can be a plain string if you'd prefer, or you can use
  // information from the request or context to generate it.
  systemPrompt: (_req, context) => {
    // 1) Check URL param override
    const url = new URL(_req.url);
    const override = url.searchParams.get("cond")?.toUpperCase();

    // 2) Check cookies
    const cookieHeader = _req.headers.get("cookie") || null;
    const cookies = parseCookies(cookieHeader);

    // 3) Determine condition
    let cond = override ?? cookies[COOKIE_NAME];
    cond = cond?.toUpperCase();

    // 4) Assign randomly if invalid
    if (!cond || !prompts[cond]) {
      const keys = Object.keys(prompts);
      cond = keys[Math.floor(Math.random() * keys.length)];
      try {
        context.cookies.set(COOKIE_NAME, cond, {
          path: "/",
          maxAge: COOKIE_MAX_AGE,
          httpOnly: false,
          sameSite: "Lax",
        });
      } catch (e) {}
    }

    // 5) Pick correct prompt
    const prompt = prompts[cond] ?? prompts["CONTROL"];

    // 6) Return system prompt in template style
    return `${prompt}
Respond with valid markdown. Knowledge cutoff September 2021.
Current date: ${new Date().toDateString()}.
User location: ${context.geo.city}, ${context.geo.country}
__EXPERIMENT_CONDITION__: ${cond}`;
  },
};

export default appConfig;
