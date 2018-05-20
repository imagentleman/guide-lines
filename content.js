let start;

function mouseMoveHandler(e) {
  if (!start) {
    return;
  }

  vertical.attributeStyleMap.set("left", CSS.px(CSS.number(e.clientX)));
  horizontal.attributeStyleMap.set("top", CSS.px(CSS.number(e.clientY)));
}

function init() {
  if (!document.querySelector("#chrome-guide-lines-extension-vertical")) {
    const vertical = document.createElement("div");
    vertical.id = "chrome-guide-lines-extension-vertical";
    vertical.attributeStyleMap.set("background-color", "#EA178C");
    vertical.attributeStyleMap.set("position", new CSSKeywordValue("fixed"));
    vertical.attributeStyleMap.set("height", CSS.vh(100));
    vertical.attributeStyleMap.set("top", CSS.px(0));
    vertical.attributeStyleMap.set("width", CSS.px(1));
    vertical.attributeStyleMap.set("z-index", 13371337);

    document.body.appendChild(vertical);
  }

  if (!document.querySelector("#chrome-guide-lines-extension-horizontal")) {
    const horizontal = document.createElement("div");
    horizontal.id = "chrome-guide-lines-extension-horizontal";
    horizontal.attributeStyleMap.set("background-color", "#EA178C");
    horizontal.attributeStyleMap.set("left", CSS.px(0));
    horizontal.attributeStyleMap.set("position", new CSSKeywordValue("fixed"));
    horizontal.attributeStyleMap.set("height", CSS.px(1));
    horizontal.attributeStyleMap.set("width", CSS.vw(100));
    horizontal.attributeStyleMap.set("z-index", 13371337);

    document.body.appendChild(horizontal);
  }

  window.vertical = document.querySelector(
    "#chrome-guide-lines-extension-vertical"
  );
  window.horizontal = document.querySelector(
    "#chrome-guide-lines-extension-horizontal"
  );

  window.removeEventListener("mousemove", mouseMoveHandler);
  window.addEventListener("mousemove", mouseMoveHandler);
}

function destroy() {
  vertical.remove();
  horizontal.remove();

  window.removeEventListener("mousemove", mouseMoveHandler);
}

chrome.runtime.onMessage.addListener(function(request) {
  if (request.type === "stop") {
    start = false;
    destroy();
  } else if (request.type === "start") {
    start = true;
    init();
  }
});
