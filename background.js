const activeTabs = {};
const readyTabs = {};

function start(tab) {
  if (activeTabs[tab.id]) {
    activeTabs[tab.id] = false;

    chrome.browserAction.setIcon({
      path: {
        "16": "b16.png",
        "24": "b24.png",
        "32": "b32.png"
      }
    });

    chrome.tabs.sendMessage(tab.id, { type: "stop" });
  } else {
    if (!readyTabs[tab.id]) {
      chrome.tabs.executeScript(tab.id, {
        file: "content.js"
      });

      readyTabs[tab.id] = true;
    }

    activeTabs[tab.id] = true;

    chrome.browserAction.setIcon({
      path: {
        "16": "m16.png",
        "24": "m24.png",
        "32": "m32.png"
      }
    });

    chrome.tabs.sendMessage(tab.id, { type: "start" });
  }
}

function restart(tab) {
  if (activeTabs[tab.id]) {
    chrome.browserAction.setIcon({
      path: {
        "16": "m16.png",
        "24": "m24.png",
        "32": "m32.png"
      }
    });

    chrome.tabs.sendMessage(tab.id, { type: "start" });
  } else {
    chrome.browserAction.setIcon({
      path: {
        "16": "b16.png",
        "24": "b24.png",
        "32": "b32.png"
      }
    });
  }
}

chrome.browserAction.onClicked.addListener(function(tab) {
  if (!readyTabs[tab.id]) {
    chrome.tabs.executeScript(tab.id, {
      file: "content.js"
    });

    readyTabs[tab.id] = true;
  }

  start(tab);
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
  restart({ id: activeInfo.tabId });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    readyTabs[tabId] = false;
    activeTabs[tabId] = false;

    chrome.browserAction.setIcon({
      path: {
        "16": "b16.png",
        "24": "b24.png",
        "32": "b32.png"
      }
    });
  }
});
