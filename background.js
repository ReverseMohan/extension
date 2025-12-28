chrome.webRequest.onCompleted.addListener(
  details => {
    chrome.runtime.sendMessage({
      type: "request",
      data: {
        url: details.url,
        method: details.method,
        status: details.statusCode,
        headers: maskHeaders(details.responseHeaders || {}),
        body: null
      }
    });
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);

function maskHeaders(headers) {
  const sensitive = ["authorization", "cookie", "x-api-key"];
  const out = {};
  headers.forEach(h => {
    out[h.name] = sensitive.includes(h.name.toLowerCase())
      ? "⚠️ hidden"
      : h.value;
  });
  return out;
}
