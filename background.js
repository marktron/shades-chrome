"use strict";

function doStuffWithDom(msg) {
  console.log(msg);
}

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.sendMessage(tab.id, { text: "report_back" }, doStuffWithDom);
});
