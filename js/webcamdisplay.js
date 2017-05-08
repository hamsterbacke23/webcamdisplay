import { TransformHandler } from './transform-handler';
import { Timer } from './timer';

require('../sass/main.scss');
require('../templates/index.html');

export class WebcamDisplay {

  constructor() {
    this.setElements();
    this.startWebcams();
    this.timer = new Timer();

    if (!this.checkCompatiblity) {
      alert('Sorry, your browser might not be working with this.'); // eslint-disable-line
    }
  }

  setElements() {
    this.ui = {};

    this.ui.videoHandler = document.getElementsByClassName('handler')[0];
    this.ui.video = document.createElement('video');
    this.ui.videoContainer = document.getElementsByClassName('videoContainer')[0];

    this.ui.video.setAttribute('autoplay', true);
  }

  checkCompatiblity() {
    return this.navigator.mediaDevices && this.navigator.mediaDevices.enumerateDevices;
  }

  startVideo(deviceId) {
    const constraints = {
      deviceId:  {exact: deviceId},
      video: { width: 1280, height: 720 },
    };

    navigator.mediaDevices.getUserMedia({video: constraints})
      .then(this.successCallback.bind(this))
      .catch(this.errorCallback);
  }

  static errorCallback(err) {
    console.log(`${err.name} : ${err.message}`);  // eslint-disable-line
  }

  startWebcams() {
    navigator.mediaDevices.enumerateDevices()
      .then(this.onStartWebcams.bind(this))
      .catch();
  }

  static startWebcamErrorHandler(err) {
    console.log(`${err.name} : ${err.message}`);  // eslint-disable-line
  }

  onStartWebcams(devices) {
    devices.forEach((device) => {
      if (device.kind === 'videoinput') {
        this.startVideo(device.deviceId);
      }
    });
  }

  successCallback(stream) {
    const videoHandlerInstance = this.ui.videoHandler.cloneNode(true);
    videoHandlerInstance.className = videoHandlerInstance.className.replace(/\bhidden\b/, '');

    const videoInstance = this.ui.video.cloneNode(true);
    videoHandlerInstance.appendChild(videoInstance);
    this.ui.videoContainer.appendChild(videoHandlerInstance);

    // Let's play
    videoInstance.srcObject = stream;
    videoInstance.onloadedmetadata = videoInstance.play;

    // Add transform handlers
    this.transformHandler = new TransformHandler(videoHandlerInstance);
  }
}
