import { validateHyperlink } from 'bahmni-form-controls';
import { httpInterceptor } from 'common/utils/httpInterceptor';
import { formBuilderConstants } from 'form-builder/constants';

function collectHyperlinkUrls(controls, acc, visited = new Set()) {
  if (!controls) return acc;
  controls.forEach((control) => {
    if (visited.has(control)) return;
    visited.add(control);
    if (control.type === 'label' && control.properties && control.properties.hyperlinkUrl) {
      acc.push(control.properties.hyperlinkUrl);
    }
    if (control.label) collectHyperlinkUrls([control.label], acc, visited);
    if (control.controls) collectHyperlinkUrls(control.controls, acc, visited);
  });
  return acc;
}

export function validateFormHyperlinks(formJson, allowedDomains) {
  const urls = collectHyperlinkUrls(formJson.controls || [], []);
  return urls
    .map((url) => validateHyperlink(url, allowedDomains))
    .filter((result) => !result.valid)
    .map((result) => `Invalid hyperlink: ${result.error}`);
}

export function fetchAllowedDomains() {
  return httpInterceptor
    .get(formBuilderConstants.allowedDomainsGPUrl, 'text')
    .then((data) => (data || '').split(',').map((d) => d.trim()).filter(Boolean))
    .catch(() => []);
}
