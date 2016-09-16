import { Component } from 'react';

export class DraggableComponent extends Component {
  constructor(data) {
    super(data);
    this.data = data;
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy'; // eslint-disable-line no-param-reassign
  }

  onDrop(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData('data');
    this.postDragProcess(data);
  }

  postDragProcess(data) {
    return data;
  }
}
