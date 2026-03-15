export function utf8ToBase64(str) {
  if (str === undefined || str === null || str === '') {
    return '';
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(str);

  const binaryString = String.fromCharCode.apply(null, data);
  return btoa(binaryString);
}

export function unescapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

export function deepUnescapeStrings(obj) {
  if (typeof obj === 'string') {
    return unescapeHtml(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(deepUnescapeStrings);
  }
  if (typeof obj === 'object' && obj !== null) {
    const result = {};
    for (const key of Object.keys(obj)) {
      result[key] = deepUnescapeStrings(obj[key]);
    }
    return result;
  }
  return obj;
}

export function unescapeFormResourceValue(valueString) {
  if (!valueString) return valueString;
  try {
    const parsed = JSON.parse(valueString);
    const unescaped = deepUnescapeStrings(parsed);
    return JSON.stringify(unescaped);
  } catch (e) {
    return valueString;
  }
}

export function base64ToUtf8(b64) {
  if (b64 === undefined || b64 === null || b64 === '') {
    return '';
  }
  try {
    const binaryString = atob(b64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  } catch (e) {
    console.error('Error decoding base64 string:', e);
    return '';
  }
}
