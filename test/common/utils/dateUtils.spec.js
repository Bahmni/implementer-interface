/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import { expect } from 'chai';
import { dateUtils } from 'common/utils/dateUtils';

describe('dateUtils', () => {
  it('should format given date based on the format mentioned', () => {
    const inputDate = '2016-07-25T15:21:17.000+0530';
    expect(dateUtils.getDateWithoutTime(inputDate, 'DD-MM-YYYY')).to.eql('25-07-2016');
  });

  it('should format given date to default format', () => {
    const inputDate = '2016-07-25T15:21:17.000+0530';
    expect(dateUtils.getDateWithoutTime(inputDate)).to.eql('25 Jul 16');
  });

  it('should return null if input date is null', () => {
    expect(dateUtils.getDateWithoutTime(null)).to.eql(null);
  });
});
