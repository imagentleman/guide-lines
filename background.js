function start(tab) {
  chrome.storage.local.get(
    ["activeTabs", "readyTabs"],
    ({ activeTabs = {}, readyTabs = {} }) => {
      if (activeTabs[tab.id]) {
        activeTabs[tab.id] = false;

        chrome.storage.local.set({ activeTabs });

        chrome.action.setIcon({
          path: {
            16: "b16.png",
            24: "b24.png",
            32: "b32.png",
          },
        });

        chrome.tabs.sendMessage(tab.id, { type: "stop" });
      } else {
        if (!readyTabs[tab.id]) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content.js"],
          });

          readyTabs[tab.id] = true;
        }

        activeTabs[tab.id] = true;

        chrome.storage.local.set({ readyTabs, activeTabs });

        chrome.action.setIcon({
          path: {
            16: "m16.png",
            24: "m24.png",
            32: "m32.png",
          },
        });

        chrome.tabs.sendMessage(tab.id, { type: "start" });
      }
    }
  );
}

function restart(tab) {
  chrome.storage.local.get(["activeTabs"], ({ activeTabs = {} }) => {
    if (activeTabs[tab.id]) {
      chrome.action.setIcon({
        path: {
          16: "m16.png",
          24: "m24.png",
          32: "m32.png",
        },
      });

      chrome.tabs.sendMessage(tab.id, { type: "start" });
    } else {
      chrome.action.setIcon({
        path: {
          16: "b16.png",
          24: "b24.png",
          32: "b32.png",
        },
      });
    }
  });
}

chrome.action.onClicked.addListener(function (tab) {
  chrome.storage.local.get(["readyTabs"], ({ readyTabs = {} }) => {
    if (!readyTabs[tab.id]) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"],
      });

      readyTabs[tab.id] = true;

      chrome.storage.local.set({ readyTabs });
    }

    start(tab);
  });
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
  restart({ id: activeInfo.tabId });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  chrome.storage.local.get(
    ["activeTabs", "readyTabs"],
    ({ activeTabs = {}, readyTabs = {} }) => {
      if (changeInfo.status === "complete") {
        readyTabs[tabId] = false;
        activeTabs[tabId] = false;

        chrome.storage.local.set({ readyTabs, activeTabs });

        chrome.action.setIcon({
          path: {
            16: "b16.png",
            24: "b24.png",
            32: "b32.png",
          },
        });
      }
    }
  );
});
