export function utf8ToBase64(str) {
  if (str === undefined || str === null || str === '') {
    return '';
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(str);

  const binaryString = String.fromCharCode.apply(null, data);
  return btoa(binaryString);
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
