require('jquery-ui/ui/widgets/draggable');
require('jquery-ui/ui/widgets/resizable');
require('jquery-ui/themes/base/base.css');
require('jquery-ui/themes/base/theme.css');


const $ = require('jquery');

export class TransformHandler {

  constructor(domEl) {
    if (!domEl) {
      console.log('Error invalid DOM Element'); // eslint-disable-line
    }
    this.domEl = domEl;
    this.initDragResize();
    this.setRotateVideoBtnListener();
  }

  initDragResize() {
    $(this.domEl).draggable({
      stack: '.handler',
    });
    $(this.domEl).resizable({
      handles: 'all',
      aspectRatio: true,
      autoHide: true,
    });
  }

  /**
   * This is buggy
   */
  destroyDragResize() {
    $(this.domEl).draggable('destroy');
    $(this.domEl).resizable('destroy');
  }

  reloadDragResize(domEl) {
    this.destroyDragResize(domEl);
    this.initDragResize(domEl);
  }

  /**
   * Set a rotation click handler
   */
  setRotateVideoBtnListener() {
    if (typeof this.domEl.addEventListener !== 'function') {
      return;
    }
    this.domEl.addEventListener('click', this.clickHandler.bind(this));
  }

  clickHandler(e) {
    e.preventDefault();
    if (!e.target || !e.target.classList.contains('rotatebutton')) {
      return false;
    }

    const initialRotation = this.domEl.getAttribute('data-rotation') || 0;
    const initialRotationInt = parseInt(initialRotation, 10);
    const newRotationInt = initialRotationInt + 90;

    this.domEl.style.transform = `rotate(${newRotationInt} deg)`;
    this.domEl.setAttribute('data-rotation', newRotationInt);

    this.reloadDragResize(this.domEl);
    return false;
  }

}
