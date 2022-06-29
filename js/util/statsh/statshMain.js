var statsh = {
  lock: false,
  filePath:
    userDataPath + (process.platform === "win32" ? "\\" : "/") + "statsh.json",
  fileWritePromise: null,
  list: {},
  writeFile: function () {
    function newFileWrite() {
      return fs.promises.writeFile(
        statsh.filePath,
        JSON.stringify(statsh.list)
      );
    }

    function ongoingFileWrite() {
      return statsh.fileWritePromise || Promise.resolve();
    }

    statsh.fileWritePromise = ongoingFileWrite()
      .then(newFileWrite)
      .then(() => (statsh.fileWritePromise = null));
  },
  get: function (key) {
    return statsh.list[key];
  },
  /**
   * 埋点函数
   * @param {Object} buryObj action行为属性、key键名、value键值。当action为increase时，vaule必须为number类型
   * @returns
   */
  do: function (buryObj) {
    if (
      !buryObj.hasOwnProperty("action") ||
      !buryObj.hasOwnProperty("key") ||
      !buryObj.hasOwnProperty("value")
    )
      return;
    if (
      buryObj.hasOwnProperty("action") &&
      buryObj.action === "increase" &&
      (!statsh.get(buryObj.key) || typeof buryObj.value !== number)
    )
      return;
    if (buryObj.hasOwnProperty("action") && buryObj.action === "increase") {
      statsh.list[buryObj.key] = statsh.get(buryObj.key) + buryObj.value;
    }
    if (buryObj.hasOwnProperty("action") && buryObj.action === "set") {
      statsh.list[buryObj.key] = buryObj.value;
    }

    if(!statsh.lock) {
      statsh.writeFile();
      if (mainWindow) {
        mainWindow.webContents.send("statshChanged", buryObj);
      }
    }
  },
  initialize: function () {
    console.log('执行了！！！！！！！！', statsh.filePath)
    var fileData;
    try {
      fileData = fs.readFileSync(statsh.filePath, "utf-8");
    } catch (e) {
      if (e.code !== "ENOENT") {
        console.warn(e);
      }
    }
    if (fileData) {
      statsh.list = JSON.parse(fileData);
    }

    //这里是在主进程中接收来自子进程的同步
    ipc.on("statshChanged", function (e, buryObj) {
      if (buryObj.hasOwnProperty("action") && buryObj.action === "increase") {
        let prevValue = statsh.get(buryObj.key) ?? 0
        statsh.list[buryObj.key] = prevValue + buryObj.value;
      }
      if (buryObj.hasOwnProperty("action") && buryObj.action === "set") {
        statsh.list[buryObj.key] = buryObj.value;
      }

      if(!statsh.lock) {
        statsh.writeFile();
      }
    });

    //重置的监听
    ipc.on('statshReset', () => {
      statsh.lock = true
      statsh.fileWritePromise = null
      fs.writeFileSync(statsh.filePath, JSON.stringify({}))
      statsh.lock = false
    })
  },
};

statsh.initialize();
module.exports = statsh;
