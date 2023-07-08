'use strict';
const QRCode = require('qrcode')
import './popup.css';

const generateQRCode = (message) => {
  QRCode.toCanvas(
    canvas,
    message,
    {
      width: 240,
    },
    (error) => {
      if (error) console.error(error)
      console.log('success!');
    }
  );
}

const toggleTooltip = (event, tip) => {
  tooltip.style.display = "block";
  tooltip.style.left = `${event.clientX}px`;
  tooltip.style.top = `${event.clientY - 25}px`;
  tooltip.innerText = tip;
  setTimeout(() => {
    tooltip.style.display = "none";
  }, 1000)
}

const copyQRCode = (event) => {
  const tooltip = document.getElementById("tooltip");

  canvas.toBlob(function(blob) {
    const item = new ClipboardItem({ "image/png": blob });

    navigator.clipboard.write([item])
      .then(function() {
        toggleTooltip(event, 'COPIED!');
      })
      .catch(function(error) {
        toggleTooltip(event, 'FAILED!');
      });
  });
}

const downloadQRCode = () => {
  const downloadLink = document.createElement("a");
  const dataURL = canvas.toDataURL("image/png");

  downloadLink.href = dataURL;
  downloadLink.download = "qrcode.png";
  downloadLink.click();
}

(function () {
  const canvas = document.getElementById('canvas')
  const messageText = document.getElementById('message')
  const copyBtn = document.getElementById('copy')
  const downloadBtn = document.getElementById('download')

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const currentTab = tabs[0];
    const currentUrl = currentTab.url;
    messageText.value = currentUrl;
    generateQRCode(currentUrl);
  });

  messageText.addEventListener('keyup', (event) => {
    generateQRCode(event.currentTarget.value);
  });

  canvas.addEventListener('dblclick', copyQRCode);
  copyBtn.addEventListener('click', copyQRCode);
  downloadBtn.addEventListener('click', downloadQRCode);
})();
