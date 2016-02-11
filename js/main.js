'use strict';

var videoElement = document.querySelector('video');
var audioSelect = document.querySelector('select#audioSource');
var videoSelect = document.querySelector('select#videoSource');


navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;


var $videoWrapper = $('<div class="handler draggable resizable"><video muted autoplay ></video></div>');

function gotSources(sourceInfos) {
  for (var i = 0; i !== sourceInfos.length; ++i) {
    var sourceInfo = sourceInfos[i];
    if (sourceInfo.kind === 'video') {
      startVideo(sourceInfo.id);
    }
  }
}

if (typeof MediaStreamTrack === 'undefined' ||
    typeof MediaStreamTrack.getSources === 'undefined') {
  alert('This browser does not support MediaStreamTrack.\n\nTry Chrome.');
} else {
  MediaStreamTrack.getSources(gotSources);
}

function successCallback(stream) {
  window.stream = stream; // make stream available to console
  var $videoWrapperInstance = $videoWrapper.clone();
  $('.videoContainer').append($videoWrapperInstance);

  var $videoElement = $videoWrapperInstance.find('video');
  $videoElement.attr('src', window.URL.createObjectURL(stream));
  $videoElement[0].play();

  initDraggable();
}

function errorCallback(error) {
  console.log('navigator.getUserMedia error: ', error);
}

function startVideo(videoSource) {
  var constraints = {
    video: {
      optional: [{
        sourceId: videoSource
      }]
    }
  };
  navigator.getUserMedia(constraints, successCallback, errorCallback);
}

function initDraggable() {
  console.log('jquery');
    $('.draggable').each(function() {
      $(this).draggable({
      stack: ".handler"
    });
    });
    $('.resizable').each(function() {
      console.log('bla');
      $(this).resizable();
    });
}

