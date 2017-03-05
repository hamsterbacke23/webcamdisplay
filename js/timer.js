import { TransformHandler } from './transform-handler';

require('./vendor/stopwatch');
require('./vendor/jquery.fittext');

const $ = require('jquery');

export class Timer {

  constructor() {
    this.ui = {};
    this.ui.clock = document.getElementById('clock');
    this.ui.timer = document.getElementsByClassName('clockwrapper');
    this.initClock();
  }

  initClock() {
    this.transformHandler = new TransformHandler(this.ui.timer);
    $(this.ui.clock).fitText(0.3);
  }
}
