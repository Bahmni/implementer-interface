import 'whatwg-fetch';

export const httpInterceptor = {
  get: (url) =>
    fetch(url, { credentials: 'same-origin', Accept: 'application/json' })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else if (response.status === 401) {
          window.location.pathname = '/home';
          return null;
        }
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
      }),

  post: (url, jsonBody) =>
    fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonBody),
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        }
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
      }),
};
