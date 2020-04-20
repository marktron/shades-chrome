"use strict";

function setIconToComplete(payload) {
  chrome.browserAction.setIcon({
    path: {
      "16": "assets/images/icon_on_16.png",
      "32": "assets/images/icon_on_32.png",
      "48": "assets/images/icon_on_48.png",
      "64": "assets/images/icon_on_64.png",
      "128": "assets/images/icon_on_128.png",
      "256": "assets/images/icon_on_256.png",
      "512": "assets/images/icon_on_512.png",
      "1024": "assets/images/icon_on_1024.png",
    },
    tabId: payload.tab_id,
  });
}

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.browserAction.setIcon({
    path: {
      "16": "assets/images/loading_static_16.png",
      "32": "assets/images/loading_static_32.png",
      "48": "assets/images/loading_static_48.png",
      "64": "assets/images/loading_static_64.png",
      "128": "assets/images/loading_static_128.png",
      "256": "assets/images/loading_static_256.png",
      "512": "assets/images/loading_static_512.png",
      "1024": "assets/images/loading_static_1024.png",
    },
    tabId: tab.id,
  });
  chrome.tabs.sendMessage(
    tab.id,
    { text: "report_back", tab_id: tab.id },
    setIconToComplete
  );
});
