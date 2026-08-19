/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { expect } from 'chai';
import sinon from 'sinon';
import { httpInterceptor } from 'common/utils/httpInterceptor';
import {
  validateFormHyperlinks,
  fetchAllowedDomains,
} from 'form-builder/helpers/hyperlinkValidationHelper';

const ALLOWED_DOMAINS = ['who.int', 'usda.gov'];

function labelControl(hyperlinkUrl) {
  return { type: 'label', properties: { hyperlinkUrl } };
}

describe('hyperlinkValidationHelper', () => {
  describe('validateFormHyperlinks', () => {
    it('returns no errors for an empty form', () => {
      const errors = validateFormHyperlinks({ controls: [] }, ALLOWED_DOMAINS);
      expect(errors).to.eql([]);
    });

    it('returns no errors when form has no label controls', () => {
      const formJson = { controls: [{ type: 'obsControl', properties: {} }] };
      const errors = validateFormHyperlinks(formJson, ALLOWED_DOMAINS);
      expect(errors).to.eql([]);
    });

    it('returns no errors for a label with a valid allowed-domain URL', () => {
      const formJson = { controls: [labelControl('https://who.int/some-page')] };
      const errors = validateFormHyperlinks(formJson, ALLOWED_DOMAINS);
      expect(errors).to.eql([]);
    });

    it('returns no errors for a label with a valid internal URL', () => {
      const formJson = { controls: [labelControl('/patient/summary')] };
      const errors = validateFormHyperlinks(formJson, ALLOWED_DOMAINS);
      expect(errors).to.eql([]);
    });

    it('returns an error for a label with a disallowed external domain', () => {
      const formJson = { controls: [labelControl('https://evil.com/page')] };
      const errors = validateFormHyperlinks(formJson, ALLOWED_DOMAINS);
      expect(errors).to.have.length(1);
      expect(errors[0]).to.include('Invalid hyperlink');
    });

    it('returns an error for a javascript: URL', () => {
      const formJson = { controls: [labelControl('javascript:alert(1)')] };
      const errors = validateFormHyperlinks(formJson, ALLOWED_DOMAINS);
      expect(errors).to.have.length(1);
      expect(errors[0]).to.include('Invalid hyperlink');
    });

    it('returns errors for all invalid labels in a flat list', () => {
      const formJson = {
        controls: [
          labelControl('https://evil.com'),
          labelControl('https://who.int/ok'),
          labelControl('javascript:void(0)'),
        ],
      };
      const errors = validateFormHyperlinks(formJson, ALLOWED_DOMAINS);
      expect(errors).to.have.length(2);
    });

    it('traverses nested controls via control.controls', () => {
      const formJson = {
        controls: [{
          type: 'section',
          controls: [labelControl('https://evil.com')],
        }],
      };
      const errors = validateFormHyperlinks(formJson, ALLOWED_DOMAINS);
      expect(errors).to.have.length(1);
    });

    it('traverses nested label via control.label', () => {
      const formJson = {
        controls: [{
          type: 'obsControl',
          label: { type: 'label', properties: { hyperlinkUrl: 'https://evil.com' } },
        }],
      };
      const errors = validateFormHyperlinks(formJson, ALLOWED_DOMAINS);
      expect(errors).to.have.length(1);
    });

    it('returns errors for all external URLs when allowedDomains is empty', () => {
      const formJson = { controls: [labelControl('https://who.int/page')] };
      const errors = validateFormHyperlinks(formJson, []);
      expect(errors).to.have.length(1);
    });

    it('handles missing controls key on formJson gracefully', () => {
      const errors = validateFormHyperlinks({}, ALLOWED_DOMAINS);
      expect(errors).to.eql([]);
    });

    it('does not infinitely recurse on circular control references', () => {
      const control = labelControl('https://evil.com');
      control.controls = [control];
      const formJson = { controls: [control] };
      expect(() => validateFormHyperlinks(formJson, ALLOWED_DOMAINS)).to.not.throw();
    });
  });

  describe('fetchAllowedDomains', () => {
    afterEach(() => {
      if (httpInterceptor.get.restore) httpInterceptor.get.restore();
    });

    it('returns parsed domain list on successful fetch', () => {
      sinon.stub(httpInterceptor, 'get').returns(Promise.resolve('who.int, usda.gov'));
      return fetchAllowedDomains().then((domains) => {
        expect(domains).to.eql(['who.int', 'usda.gov']);
      });
    });

    it('filters out empty strings from domain list', () => {
      sinon.stub(httpInterceptor, 'get').returns(Promise.resolve('who.int,,usda.gov,'));
      return fetchAllowedDomains().then((domains) => {
        expect(domains).to.eql(['who.int', 'usda.gov']);
      });
    });

    it('returns empty array on fetch failure', () => {
      sinon.stub(httpInterceptor, 'get').returns(Promise.reject(new Error('network error')));
      return fetchAllowedDomains().then((domains) => {
        expect(domains).to.eql([]);
      });
    });

    it('returns empty array when response is null', () => {
      sinon.stub(httpInterceptor, 'get').returns(Promise.resolve(null));
      return fetchAllowedDomains().then((domains) => {
        expect(domains).to.eql([]);
      });
    });
  });
});
