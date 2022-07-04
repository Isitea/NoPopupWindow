"use strict";
{
    const Tabs = {};
    let Layering = true;
    function promisize(fn, params) {
        return new Promise(response => fn(...params, response));
    }
    function logger(type) {
        return function () { console.log(type, ...arguments); };
    }
    function keepAlive(message, sender, sendResponse) {
        sendResponse(true);
    }
    function BeforeNavigate({ tabId, timeStamp, url }) {
        console.log("BeforeNavigate", tabId, timeStamp, url);
        Tabs[tabId] = { timeStamp, url };
    }
    async function CreatedNavigationTarget({ sourceTabId, tabId, url }) {
        chrome.tabs.get(tabId)
            .then(({ windowId }) => chrome.windows.get(windowId))
            .then(({ type, id }) => new Promise((res, rej) => (type === "popup" ? res(id) : rej())))
            .then(function (windowId) {
            if (Layering) {
                chrome.windows.remove(windowId);
                chrome.tabs.sendMessage(sourceTabId, { type: "layering", url });
            }
            else {
                chrome.tabs.get(sourceTabId)
                    .then(({ windowId, index }) => chrome.tabs.move(tabId, { windowId, index: index + 1 }))
                    .then(() => chrome.tabs.update(tabId, { active: true }));
            }
        })
            .catch(() => false);
    }
    function activate() {
        chrome.runtime.onMessage.addListener(keepAlive);
        //chrome.webNavigation.onBeforeNavigate.addListener( logger( "BeforeNavigate" ) )
        //chrome.webNavigation.onCreatedNavigationTarget.addListener( logger( "CreatedNavigationTarget" ) )
        chrome.webNavigation.onBeforeNavigate.addListener(BeforeNavigate);
        chrome.webNavigation.onCreatedNavigationTarget.addListener(CreatedNavigationTarget);
    }
    activate();
}
