const path = require("path");
const fs = require("fs");
var electron = require("electron");
var ipc = electron.ipcRenderer;

let mainWindowId = 0;

window.globalArgs = {};
let loaded = false;
process.argv.forEach(function (arg) {
  if (arg.startsWith("--")) {
    var key = arg.split("=")[0].replace("--", "");
    var value = arg.split("=")[1];
    globalArgs[key] = value;
  }
});
if (navigator.platform === "MacIntel") {
  window.platformType = "mac";
} else if (navigator.platform === "Win32") {
  window.platformType = "windows";
} else {
  window.platformType = "linux";
}
var savePath =
  window.globalArgs["user-data-path"] +
  (platformType === "windows"
    ? "\\sessionRestore.json"
    : "/sessionRestore.json");
var savedStringData = null;
var tasks = [];
try {
  savedStringData = fs.readFileSync(savePath, "utf-8");
} catch (e) {
  console.warn("failed to read session restore data", e);
}
try {
  var data = JSON.parse(savedStringData);
  data.state.tasks.forEach(function (task) {
    tasks.push(task);
  });
} catch (e) {
  console.error("restoring session failed: ", e, savedStringData);
}
console.log(tasks);
window.tasks = tasks;

window.addEventListener("message", function (e) {
  if (!e.origin.startsWith("file://")) {
    return;
  }
  let messageType = getMessageType(e.data);
  switch (messageType) {
    case "closeWin":
      ipc.send("closeTaskSelect");
      break;
    case "insertTab":
      ipc.send("insertTab", {
        taskId: e.data.taskId,
        tabIndex: e.data.tabIndex,
        tab: e.data.addTab,
      });
      break;
    case "refresh":
      ipc.send("refresh");
      break;
    case "endMoveApps":
      ipc.send("closeTaskSelect");
      ipc.send("refresh", { taskId: e.data.taskId });
      break;
  }
});

function getMessageType(data) {
  if (data && data.message) return data.message;
  else return "";
}

ipc.on("appsCartList", (event, arg) => {
  window.selectedApps = arg;
});
