/**
 * Aborts requests to the ad and analytics hosts.
 *
 * This is not only about speed: Google's ad script injects a full-page
 * "vignette" overlay that swallows clicks, which makes navigation tests fail
 * at random. Blocking it keeps the suite stable.
 */
const AD_HOSTS =
  /googlesyndication|doubleclick|google-analytics|googletagmanager|adtrafficquality|adsbygoogle/;

export async function blockAds(page) {
  await page.route(AD_HOSTS, (route) => route.abort());
}
