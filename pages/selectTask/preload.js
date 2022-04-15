var ipc = require("electron").ipcRenderer;

function getMessageType(data) {
  if (data && data.message) return data.message;
  else return "";
}


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
    case "endInsertOp":
      ipc.send("closeTaskSelect");
      ipc.send("reloadTask");
      break;
  }
});

//从应用购物车跳转过来的
ipc.on("appsCartList", (event, arg) => {
  window.selectedApps = arg;
});

//从tabBar右键跳转过来的
ipc.on("fromTabBarOp", (event, arg) => {
  window.selectedApps = arg;
});
