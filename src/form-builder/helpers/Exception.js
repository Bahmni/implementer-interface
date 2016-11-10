export class Exception {
  constructor(message) {
    this.message = message;
  }

  getException() {
    return { type: 'Exception', message: this.message };
  }
}
