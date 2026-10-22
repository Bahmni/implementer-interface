/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

// OpenMRS builds absolute pagination links from the request it sees behind the proxy
// (e.g. http://localhost/openmrs/...), which need not match the origin of the browser.
// Only the path and query of the `next` link are kept so that the request is made to the
// current origin. Returns undefined when there is no next page and throws for an invalid link.
export function getNextPageUrl(response) {
  const links = (response && response.links) || [];
  const nextLink = links.find((link) => link.rel === 'next');
  if (!nextLink) {
    return undefined;
  }
  let nextUrl;
  try {
    if (!nextLink.uri) {
      throw new Error('missing uri');
    }
    nextUrl = new URL(nextLink.uri, window.location.origin);
  } catch (e) {
    throw new Error(`Invalid pagination link: ${nextLink.uri}`);
  }
  if (nextUrl.protocol !== 'http:' && nextUrl.protocol !== 'https:') {
    throw new Error(`Invalid pagination link: ${nextLink.uri}`);
  }
  return `${nextUrl.pathname}${nextUrl.search}`;
}
