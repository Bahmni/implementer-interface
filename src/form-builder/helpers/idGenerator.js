export class IDGenerator {
  constructor(controls = []) {
    this.controlIDs = this.getControlIDs(controls);
    this.maxId = Math.max(...this.controlIDs) || 0;
    this.maxId = this.maxId === -Infinity ? 1 : this.maxId + 1;
  }

  getControlIDs(controls) {
    const controlIDs = controls.map(control => {
      if (control.controls) {
        return [].concat(control.id, this.getControlIDs(control.controls));
      }
      return control.id;
    });
    return [].concat(...controlIDs);
  }

  getId() {
    return this.maxId++;
  }
}
