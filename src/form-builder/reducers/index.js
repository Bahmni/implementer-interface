/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at https://www.bahmni.org/license/mplv2hd.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */

import controlDetails from './controlDetails';
import conceptToControlMap from './conceptToControlMap';
import controlProperty from './controlProperty';
import formDetails from './formDetails';
import translations from './translations';


const formBuilder = {
  controlDetails,
  conceptToControlMap,
  controlProperty,
  formDetails,
  translations,
};

export default formBuilder;
