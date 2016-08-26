 import React, { Component } from 'react';

 export default class Canvas extends Component {
   constructor() {
     super();
   }

   render() {
     return (
       <div id="form-builder-canvas">
         <div className="canvas-placeholder">Drag & Drop controls to create a form</div>
       </div>
     );
   }
 }
