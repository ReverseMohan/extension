# extension
# EXTENSION - API Inspector 🔍

**Short description:**
A lightweight Chrome extension that captures and displays API requests made by web pages. Use the popup to filter requests, copy requests as `fetch` or `curl`, view headers, and export captured requests as a JSON file.

---

## ✨ Features

- Live list of captured requests (URL, method, status, headers)
- Search and filter by method and status
- Quick-copy helpers: copy as `fetch`, `curl`, or headers
- Export all captured requests as a JSON file
- Sensitive headers (e.g., `Authorization`, `Cookie`, `x-api-key`) are masked by default for privacy

---

## 🧭 How it works

- `background.js` listens to `chrome.webRequest.onCompleted` and sends request data to the popup via `chrome.runtime.sendMessage`.
- `popup.js` receives messages and maintains an in-memory `requests` array that the UI renders and filters.
- The Export button creates a JSON file from the `requests` data and triggers a download (uses the `chrome.downloads` API).

---

## 🚀 Installation / Usage

1. Open `chrome://extensions`
2. Enable **Developer mode** (toggle in the top-right)
3. Click **Load unpacked** and select this extension's folder (the folder containing `manifest.json`)
4. Click the extension action (toolbar icon) to open the popup and start viewing requests
5. Use the search field, **Method** and **Status** filters to narrow results
6. Click the `fetch`, `curl`, or `headers` buttons to copy snippets to the clipboard
7. Click **Export** to download `api-requests.json` containing all captured requests

---

## ⚙️ Notes & Troubleshooting

- The provided `manifest.json` currently contains these permissions:

```
"permissions": [ "webRequest", "storage", "tabs" ],
"host_permissions": [ "<all_urls>" ]
```

- Exporting requires the `chrome.downloads` permission. If the export button doesn't start a download, add `"downloads"` to the `permissions` array in `manifest.json`:

```json
"permissions": [ "webRequest", "storage", "tabs", "downloads" ]
```

- The extension masks sensitive headers in `background.js` using `maskHeaders()` — bodies are not captured.
- If no requests appear, ensure the extension has the necessary permissions and `background.js` is active.
- Open the extension DevTools (right-click inside popup -> Inspect) to view console errors for debugging.

---

## ⚠️ Disclaimer (Educational Use) 💡

This extension is provided for educational and testing purposes only. Do not use it to intercept, collect, or expose private or sensitive information without proper authorization. Respect privacy, applicable laws, and service terms. The author is not responsible for misuse or damages resulting from the extension.

---

## 🛠️ Development

Key files:

- `manifest.json` — extension metadata & permissions
- `background.js` — captures network requests and forwards them to the popup
- `popup.html`, `popup.css`, `popup.js` — popup UI and logic
- `icons/` — extension icons

Local dev tips:
- Make small changes, then reload the extension on `chrome://extensions` to test them.
- Use `console.log` in `background.js` and the popup DevTools to inspect messages.

---

## Contributing & License

Contributions are welcome — open an issue or submit a PR. Include short, focused changes and a clear description of why.

This project has no explicit license in the repo; add a `LICENSE` file if needed.

