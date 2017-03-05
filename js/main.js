require('modules/jquery-ui/themes/base/base.css');
// require('modules/jquery-ui/themes/base/structure.css');
require('modules/jquery-ui/themes/base/draggable.css');
require('modules/jquery-ui/themes/base/resizable.css');
require('modules/jquery-ui/themes/base/theme.css');
require('../sass/main.scss');
var $ = jQuery = require('jquery');
require('jquery-ui');
require('jquery-ui/ui/widgets/draggable');
require('jquery-ui/ui/widgets/resizable');
require('./stopwatch');
require('./jquery.fittext.js');
require('../templates/index.html');


$(function () {

  navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    alert('Sorry, this browser does not support MediaStreamTrack.');
    return;
  }

  var $videoHandler = $('.handler');
  var $video = $('<video muted autoplay ></video>');
  var $videoContainer = $('.videoContainer');
  var $rotateButton = $('.rotateButton');

  // init stuff
  $('#clock').fitText(0.3);
  setRotateVideoBtnListener();
  start();

  function startVideo(deviceId) {
    var constraints = {
      video: { width: 1280, height: 720 } // Prefer camera resolution nearest to 1280x720.
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then(function(mediaStream) {
        successCallback(mediaStream);
      })
      .catch(function(err) { console.log(err.name + ": " + err.message); });

  }

  function start() {
    navigator.mediaDevices.enumerateDevices()
      .then(function(devices) {
        devices.forEach(function(device) {
          if (device.kind === 'videoinput') {
            startVideo(device.id);
          }
        });
      })
      .catch(function(err) {
        console.log(err.name + ": " + err.message);
      });
  }

  function successCallback(stream) {
    var $videoHandlerInstance = $videoHandler.clone().removeClass('hidden');
    var $videoInstance = $video.clone();
    $videoContainer.append($videoHandlerInstance.append($videoInstance));

    $videoInstance[0].srcObject = stream;
    $videoInstance[0].onloadedmetadata = function(e) {
      $videoInstance[0].play();
    };

    initDragResize();
  }

  function errorCallback(error) {
    console.log('navigator.getUserMedia error: ', error);
  }


  function initDragResize() {
      $('.draggable').each(function() {
        $(this).draggable({
          stack: '.handler'
        });
      });
      $('.resizable').each(function() {
        $(this).resizable({
          handles: 'all',
          aspectRatio: true,
          autoHide: true
        });
      });
  }


  function setRotateVideoBtnListener() {
    $videoContainer.on('click', '.rotateButton', function (e) {
      e.preventDefault();

      $videoHandler = $(this).closest('.handler');
      var currentRotation = $videoHandler.data('rotation') || 0;
      var newRotation = currentRotation + 90;
      $videoHandler.animateRotate(newRotation, 0);
      $videoHandler.data('rotation', newRotation);
      initDragResize();

      return false;
    });
  }

});

$.fn.animateRotate = function(angle, duration, easing, complete) {
  var args = $.speed(duration, easing, complete);
  var step = args.step;
  return this.each(function(i, e) {
    args.complete = $.proxy(args.complete, e);
    args.step = function(now) {
      $.style(e, 'transform', 'rotate(' + now + 'deg)');
      if (step) return step.apply(e, arguments);
    };

    $({deg: 0}).animate({deg: angle}, args);
  });
};
