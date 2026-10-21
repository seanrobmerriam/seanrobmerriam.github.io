/** Site name. Appended to every page title and used as `og:site_name`. */
export const SITE_NAME = "Sean Merriam - Astro Content Management Systems";
/** Fallback meta description for pages that don't set their own. */
export const SITE_DESCRIPTION =
  "Custom content management systems built with Astro. Software development, thoughtful design, and open-source experiments by Sean Merriam.";
/** Canonical origin. Resolves canonical URLs, social images, and the sitemap. */
export const SITE_URL = "https://seanrobmerriam.github.io";
/** BCP 47 locale tag used to format dates and numbers. */
export const SITE_LOCALE = "en-US";
/** Routes excluded from search and the sitemap. Surrounding slashes are ignored. */
export const NOINDEX_ROUTES: string[] = ["/404"];
