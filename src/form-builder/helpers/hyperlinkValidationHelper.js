import { validateHyperlink } from 'bahmni-form-controls';

function collectHyperlinkUrls(controls, acc) {
  if (!controls) return acc;
  controls.forEach((control) => {
    if (control.type === 'label' && control.properties && control.properties.hyperlinkUrl) {
      acc.push(control.properties.hyperlinkUrl);
    }
    if (control.label) collectHyperlinkUrls([control.label], acc);
    if (control.controls) collectHyperlinkUrls(control.controls, acc);
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
