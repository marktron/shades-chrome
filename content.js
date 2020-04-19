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
    .set("lch.l", Math.max(3, 100 - currentColorL)) // Using a minimum lightness of 3 to prevent pure blacks, which can cause scrolling problems on some displays
    .alpha(currentColorAlpha);
  return newColor.css();
};

// Transform gradient backgrounds
transformGradient = (backgroundImageString, parsedGradient) => {
  for (
    let gradientIndex = 0;
    gradientIndex < parsedGradient.length;
    gradientIndex++
  ) {
    for (
      let stopIndex = 0;
      stopIndex < parsedGradient[gradientIndex].colorStops.length;
      stopIndex++
    ) {
      let gradientColor = null;
      const colorStop = parsedGradient[gradientIndex].colorStops[stopIndex];
      switch (colorStop.type) {
        case "rgb":
          gradientColor = `rgb(${colorStop.value[0]}, ${colorStop.value[1]}, ${colorStop.value[2]})`;
          break;
        case "rgba":
          gradientColor = `rgba(${colorStop.value[0]}, ${colorStop.value[1]}, ${colorStop.value[2]}, ${colorStop.value[3]})`;
          break;
        case "hex":
          gradientColor = `#${colorStop.value}`;
          break;
        case "literal":
        default:
          gradientColor = colorStop.value;
          break;
      }
      let newGradientColor = getNewColor(gradientColor);

      backgroundImageString = backgroundImageString.replace(
        gradientColor,
        newGradientColor
      );
    }
  }
  return backgroundImageString;
};

// Read all current element styles and store them
setStyles = () => {
  const allElements = document.body.querySelectorAll("*");
  let updatedStyles = [];

  //  NOTE: Have to do this "read all, then write" dance because reading computed styles and immediately writing to that element alters the computed styles for nested elements.

  for (let index = 0; index < allElements.length; index++) {
    const node = allElements[index];
    const el = window.getComputedStyle(node);
    updatedStyles[index] = {};

    for (
      let propertyIndex = 0;
      propertyIndex < cssProperties.length;
      propertyIndex++
    ) {
      const property = cssProperties[propertyIndex];
      updatedStyles[index][property.shorthand] = getNewColor(
        el[property.shorthand]
      );
    }

    // Try to parse background-image gradient colors
    if (
      el.backgroundImage !== "none" &&
      el.backgroundImage.includes("-gradient(")
    ) {
      const parsedGradient = GradientParser.parse(el.backgroundImage);
      if (parsedGradient) {
        backgroundImageString = transformGradient(
          el.backgroundImage,
          parsedGradient
        );
        node.style.setProperty(
          "background-image",
          backgroundImageString,
          "important"
        );
      }
    }
  }

  // Update all element styles
  for (let index = 0; index < allElements.length; index++) {
    const node = allElements[index];
    node.style.setProperty(
      "transition",
      "color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease"
    );

    for (let i = 0; i < cssProperties.length; i++) {
      node.style.setProperty(
        cssProperties[i].cssName,
        updatedStyles[index][cssProperties[i].shorthand],
        "important"
      );
    }
  }

  // Change body styles
  const body = document.querySelector("body");
  const bodyStyles = window.getComputedStyle(body);

  body.style.setProperty(
    "transition",
    "color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease"
  );

  // Use default CSS properties if none are set for the body
  for (let index = 0; index < cssProperties.length; index++) {
    const property = cssProperties[index];
    body.style.setProperty(
      property.cssName,
      bodyStyles[property.shorthand] &&
        getNewColor(bodyStyles[property.shorthand])
        ? getNewColor(bodyStyles[property.shorthand])
        : getNewColor(property.default),
      "important"
    );
  }
};

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.text === "report_back") {
    setStyles();
    sendResponse(true, sender);
  }
  return true;
});
