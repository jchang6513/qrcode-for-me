'use strict';
const QRCode = require('qrcode')
import './popup.css';

const generateQRCode = (message) => {
  QRCode.toCanvas(
    canvas,
    message,
    {
      margin: 1,
      width: 220,
    },
    (error) => {
      if (error) console.error(error)
      console.log('success!');
    }
  );
}

(function () {
  const canvas = document.getElementById('canvas')
  const messageText = document.getElementById('message')

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const currentTab = tabs[0];
    const currentUrl = currentTab.url;
    messageText.value = currentUrl;
    generateQRCode(currentUrl);
  });

  messageText.addEventListener('keyup', (event) => {
    generateQRCode(event.currentTarget.value);
  });

  canvas.addEventListener("dblclick", function() {
    canvas.toBlob(function(blob) {
      const item = new ClipboardItem({ "image/png": blob });

      navigator.clipboard.write([item])
        .then(function() {
          console.log("Image copied to clipboard successfully.");
        })
        .catch(function(error) {
          console.error("Unable to copy image to clipboard:", error);
        });
    });
  });
})();
