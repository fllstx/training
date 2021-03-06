"use strict";

let shootButton = document.querySelector(".btn--shoot");
let image = document.querySelector("img");
let deleteButton = document.querySelector(".btn--delete");
let video = document.querySelector("video");
let canvas = document.querySelector("canvas");
let form = document.querySelector("form");
let blurValue = "0px";
let grayscaleValue = 0;
let hueValue = "0deg";

deleteButton.addEventListener("click", reset);
shootButton.addEventListener("click", takepicture);
form.addEventListener("input", sliderOnInput);

(function initWebcam() {
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: 600,
          height: 600
        }
      })
      .then(function(stream) {
        video.srcObject = stream;
      })
      .catch(function(err) {
        console.error(err.message);
      });
  }
})();

function sliderOnInput(e) {
  const value = e.target.value;
  switch (e.target.name) {
    case "grayscale":
      updateGrayscale(value / 10);
      break;
    case "hue":
      updateHue(value * 10 + "deg");
      break;
    case "blur":
      updateBlur(value + "px");
      break;
  }
}

function updateGrayscale(value) {
  grayscaleValue = value;
  video.style.setProperty("--grayscale", value);
}

function updateHue(value) {
  hueValue = value;
  video.style.setProperty("--hue", value);
}

function updateBlur(value) {
  blurValue = value;
  video.style.setProperty("--blur", value);
}

function takepicture() {
  const context = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.filter = `grayscale(${grayscaleValue}) blur(${blurValue}) hue-rotate(${hueValue})`;
  context.drawImage(video, 0, 0);

  image.src = canvas.toDataURL("image/png");

  showImage();
  showButton(deleteButton);
  hideButton(shootButton);
}

function hideButton(button) {
  button.classList.add("btn--hidden");
}

function showButton(button) {
  button.classList.remove("btn--hidden");
}

function hideImage() {
  image.classList.add("image--hidden");
}

function showImage() {
  image.classList.remove("image--hidden");
}

function reset() {
  showButton(shootButton);
  hideButton(deleteButton);
  hideImage();
}
