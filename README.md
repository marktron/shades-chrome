# 🕶 Shades for Chrome

**🚧 Work in progress 🚧**

This extension adds a sensible dark mode to any web page. Can you believe that it’s 2020 and some websites still don’t have built-in dark mode support?

## Installation

Until Shades is available in the [Chrome Web Store](https://chrome.google.com/webstore/category/extensions), you will need to manually load the unpacked extension into Chrome. Follow these easy steps:

1. Clone this repo or download the .zip file to your computer.
1. Open the Extension Management page by navigating to [chrome://extensions](chrome://extensions). The Extension Management page can also be opened by clicking on the Chrome menu, hovering over More Tools then selecting Extensions.
1. If you don’t already have Developer Mode enabled in Chrome, enable it by clicking the Developer Mode toggle switch.
1. Click the LOAD UNPACKED button and select the extension directory.

![load_extension](https://user-images.githubusercontent.com/867615/79625096-8e89ea00-80f4-11ea-952f-ac5b8540c1be.png)

## How it works

When you click the Shades button in your toolbar, the extension scans the page and transforms the text, background, and border colors for every element into corresponding dark versions. Unlike every other dark mode extension I’ve used, Shades maintains the site’s design aesthetic and visual hierarchies as much as possible. It tries to mimic what a real designer would choose if they were adding a dark mode to their site.

## Shortcomings / To do

A partial list of things that don’t work well yet, or haven’t been attempted:

- The toolbar icon does not currently indicate whether you activated Shades or not. This would be useful since very large pages can take a few moments to render, creating a delay between pressing the toolbar button and seeing an updated page in dark mode.
- Dark modes don’t persist yet from page to page on a site – you have to manually toggle the switch on every page load or refresh.
- If HTML elements are inserted or loaded on the the page after you apply Shades, it doesn’t receive updated styles and can look out of place.
- HTML elements with `:before` or `:after` pseudo-selectors aren’t being styled by Shades right now.
- Shades does not check to ensure updated text and background colors have sufficient contrast for accessibility.
- Some sites have a dark header or footer and light body section. When you toggle Shades, it reverses this and the header section looks a little goofy. It might be nice to have a way to keep the header dark (try Shades on Github for an example of this problem).

Shades is open source, so please contribute Pull Requests to fix any of these issues! If you run into any problems, [open a new issue](https://github.com/marktron/shades-chrome/issues/new) with steps to reproduce it.

## Examples of the Shades extension in use

Here's how Shades look when applied to some websites that don’t have a dark theme.

**New York Times**
![NY Times](http://markallen.io.s3-us-east-2.amazonaws.com/1587319556.png)

**Reddit**
![Reddit](http://markallen.io.s3-us-east-2.amazonaws.com/1587319555.png)

**Medium**
![Medium](http://markallen.io.s3-us-east-2.amazonaws.com/1587319557.png)
