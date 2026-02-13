# 👷‍♂️ Xcavator 🪏

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Chrome Web Extension](https://img.shields.io/badge/Chrome-Extension-orange)](https://developer.chrome.com/docs/extensions/)

**Xcavator** is a Chrome extension web crawler for X (Twitter), designed to safely mine posts, including full content, date, and link, and store them via a local API server for permanent storage.

---

## Features

- 🔹 Automatic scrolling to load new posts.
- 🔹 Safe expansion of "Read more" / "Meer weergeven" buttons.
- 🔹 Avoids accidental expansion of nested or quoted tweets.
- 🔹 Maintains a rolling buffer of the latest 20 mined posts.
- 🔹 Sends mined tweets to a **local API server** for permanent storage.
- 🔹 Captures: **Tweet ID**, **Date**, **Text**, **Link**.
- 🔹 Multi-language support for X/Twitter interface.

---

## Installation

1. Clone or download this repository:

```bash
git clone git@github.com:dvdkwak/Xcavator.git
```

1. Open Chrome and go to ```chrome://extensions/```.
2. Enable Developer Mode.
3. Click Load unpacked and select the extension folder.
4. Start the local API server (see below).

---

## Local API Server

Xcavator includes a local server for storing mined tweets permanently in CSV format.

### Setup

```bash
# Navigate to the server folder
cd api-server

# Install dependencies
npm install

# Start the server
node server.js
```

---

## Usage

1. Open X (Twitter) in Chrome.
2. Cleck the Xcavator extension Icon.
3. Press Start, to start mining.
4. Press Start scrolling to automatically scroll.
5. Stop anytime with the opropriate stop buttons.

---

| Tweet ID   | Date             | Text                       | Link                                                           |
| ---------- | ---------------- | -------------------------- | -------------------------------------------------------------- |
| 1234567890 | 2026-02-12 10:30 | Example tweet text here... | [https://x.com/user/status/123](https://x.com/user/status/123) |

---

## License

This project is licensed under the [MIT license](https://opensource.org/license/mit)
