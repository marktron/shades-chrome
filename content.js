const cssProperties = [
  { shorthand: "color", cssName: "color", default: "#000" },
  { shorthand: "fill", cssName: "fill", default: "" },
  { shorthand: "outlineColor", cssName: "outline-color", default: "" },
  {
    shorthand: "backgroundColor",
    cssName: "background-color",
    default: "#fff",
  },
  { shorthand: "borderTopColor", cssName: "border-top-color", default: "#fff" },
  {
    shorthand: "borderBottomColor",
    cssName: "border-bottom-color",
    default: "#fff",
  },
  {
    shorthand: "borderLeftColor",
    cssName: "border-left-color",
    default: "#fff",
  },
  {
    shorthand: "borderRightColor",
    cssName: "border-right-color",
    default: "#fff",
  },
];

// Transform color
getNewColor = (currentColor) => {
  if (!chroma.valid(currentColor) || chroma(currentColor).alpha() === 0) {
    return null;
  }
  const currentColorL = chroma(currentColor).get("lch.l");
  const currentColorAlpha = chroma(currentColor).get("rgba.a");

  const newColor = chroma(currentColor)
    .set("lch.l", Math.max(10, 100 - currentColorL)) // Using a minimum lightness of 10 to prevent pure blacks
    .alpha(currentColorAlpha);
  return newColor.css();
};

// Read all current element styles and store them
setStyles = () => {
  let updatedStyles = [];

  //  NOTE: Have to do this "read all, then write" dance because reading computed styles and immediately writing to that element alters the computed styles for nested elements.
  document.body.querySelectorAll("*").forEach(function (node, index) {
    const el = window.getComputedStyle(node);
    // NOTE: Doesn't read pseudo-elements because you can't write styles for them in JS. There are ways to work around it if you want to make that work (like adding extra classes to stuff).
    updatedStyles[index] = {};
    cssProperties.forEach(function (property) {
      updatedStyles[index][property.shorthand] = getNewColor(
        el[property.shorthand]
      );
    });
  });

  // Update all element styles
  document.body.querySelectorAll("*").forEach(function (node, index) {
    node.style.setProperty(
      "transition",
      "color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease"
    );

    cssProperties.forEach(function (property) {
      node.style.setProperty(
        property.cssName,
        updatedStyles[index][property.shorthand],
        "important"
      );
    });
  });

  // Change body styles
  const body = document.querySelector("body");
  const bodyStyles = window.getComputedStyle(body);

  body.style.setProperty(
    "transition",
    "color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease"
  );

  // Use default CSS properties if none are set for the body
  cssProperties.forEach(function (property) {
    body.style.setProperty(
      property.cssName,
      bodyStyles[property.shorthand] &&
        getNewColor(bodyStyles[property.shorthand])
        ? getNewColor(bodyStyles[property.shorthand])
        : getNewColor(property.default),
      "important"
    );
  });
};

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.text === "report_back") {
    setStyles();
    sendResponse(true, sender);
  }
  return true;
});
