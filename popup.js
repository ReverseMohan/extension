const search = document.getElementById("search");
const methodFilter = document.getElementById("methodFilter");
const statusFilter = document.getElementById("statusFilter");
const requestsDiv = document.getElementById("requests");
const stats = document.getElementById("stats");
const exportBtn = document.getElementById("export");

let requests = [];

chrome.runtime.onMessage.addListener(msg => {
  if (msg.type === "request") {
    requests.unshift(msg.data);
    render();
  }
});

search.oninput = methodFilter.onchange = statusFilter.onchange = render;

function render() {
  const q = search.value.toLowerCase();
  const m = methodFilter.value;
  const s = statusFilter.value;

  const filtered = requests.filter(r => {
    if (m && r.method !== m) return false;
    if (s && !String(r.status).startsWith(s)) return false;
    if (q && !r.url.toLowerCase().includes(q) && !r.method.toLowerCase().includes(q)) return false;
    return true;
  });

  stats.innerText = `Requests: ${filtered.length} | Errors: ${filtered.filter(r => r.status >= 400).length}`;
  requestsDiv.innerHTML = filtered.map(renderRow).join("");
}

function copy(text) {
  navigator.clipboard.writeText(text);
}

function asFetch(r) {
  return `fetch("${r.url}", {
  method: "${r.method}",
  headers: ${JSON.stringify(r.headers, null, 2)}
});`;
}

function asCurl(r) {
  let cmd = `curl -X ${r.method} "${r.url}"`;
  for (const k in r.headers) {
    cmd += ` -H "${k}: ${r.headers[k]}"`;
  }
  return cmd;
}

function renderRow(r) {
  return `
  <div class="req">
    <div class="top">
      <span class="method ${r.method}">${r.method}</span>
      <span class="status s${String(r.status)[0]}">${r.status}</span>
    </div>

    <div class="url">${r.url}</div>

    <div class="buttons">
      <button onclick='copy(${JSON.stringify(asFetch(r))})'>fetch</button>
      <button onclick='copy(${JSON.stringify(asCurl(r))})'>curl</button>
      <button onclick='copy(${JSON.stringify(JSON.stringify(r.headers, null, 2))})'>headers</button>
    </div>
  </div>`;
}

exportBtn.onclick = () => {
  const blob = new Blob([JSON.stringify(requests, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  chrome.downloads.download({ url, filename: "api-requests.json" });
};
 