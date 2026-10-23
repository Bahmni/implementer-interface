/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { expect } from 'chai';
import { getNextPageUrl } from 'common/utils/paginationUtils';

describe('paginationUtils', () => {
  describe('getNextPageUrl', () => {
    it('should drop the origin of an absolute http link and keep path and encoded query', () => {
      const uri = 'http://localhost/openmrs/ws/rest/v1/form?v=custom%3A%28id%2Cuuid%2Cname%29' +
        '&limit=2&startIndex=2';
      expect(getNextPageUrl({ links: [{ rel: 'next', uri }] }))
        .to.eql('/openmrs/ws/rest/v1/form?v=custom%3A%28id%2Cuuid%2Cname%29&limit=2&startIndex=2');
    });

    it('should return the path and query of a link on the current origin', () => {
      const uri = `${window.location.origin}/openmrs/ws/rest/v1/form?limit=2&startIndex=4`;
      expect(getNextPageUrl({ links: [{ rel: 'next', uri }] }))
        .to.eql('/openmrs/ws/rest/v1/form?limit=2&startIndex=4');
    });

    it('should keep a relative link unchanged', () => {
      expect(getNextPageUrl({ links: [{ rel: 'next', uri: '/openmrs/ws/rest/v1/form?limit=2' }] }))
        .to.eql('/openmrs/ws/rest/v1/form?limit=2');
    });

    it('should pick the link with rel next when it is not the first link', () => {
      const response = { links: [
        { rel: 'prev', uri: 'http://localhost/openmrs/ws/rest/v1/form?limit=2&' },
        { rel: 'next', uri: 'http://localhost/openmrs/ws/rest/v1/form?limit=2&startIndex=6' },
      ] };
      expect(getNextPageUrl(response)).to.eql('/openmrs/ws/rest/v1/form?limit=2&startIndex=6');
    });

    it('should return undefined when there is no next link', () => {
      expect(getNextPageUrl({ results: [] })).to.eql(undefined);
      expect(getNextPageUrl({ links: [] })).to.eql(undefined);
      expect(getNextPageUrl({ links: [{ rel: 'prev', uri: '/a' }] })).to.eql(undefined);
      expect(getNextPageUrl(undefined)).to.eql(undefined);
    });

    it('should throw for a next link that is missing or invalid', () => {
      expect(() => getNextPageUrl({ links: [{ rel: 'next' }] })).to.throw('Invalid pagination');
      expect(() => getNextPageUrl({ links: [{ rel: 'next', uri: 'http://' }] }))
        .to.throw('Invalid pagination');
      expect(() => getNextPageUrl({ links: [{ rel: 'next', uri: 'ftp://localhost/openmrs' }] }))
        .to.throw('Invalid pagination');
    });

    it('should throw for a next link whose path could resolve to another host', () => {
      ['http://localhost//evil.com/a', 'http://localhost/\\evil.com/a', 'http://localhost///evil.com']
        .forEach((uri) => {
          expect(() => getNextPageUrl({ links: [{ rel: 'next', uri }] }))
            .to.throw('Invalid pagination');
        });
    });

    it('should ignore links that are not an array', () => {
      expect(getNextPageUrl({ links: {} })).to.eql(undefined);
      expect(getNextPageUrl({ links: 'next' })).to.eql(undefined);
    });
  });
});
