var electron = require("electron");
var ipc = electron.ipcRenderer;
const { config } = require("../../server-config");

window.$ipc = ipc;

let oldXHROpen = window.XMLHttpRequest.prototype.open;
window.XMLHttpRequest.prototype.open = function (
  method,
  url,
  async,
  user,
  password
) {
  this.addEventListener("load", function () {
    if (url === `${config.SERVER_BACKEND_URL}${config.OSX.CREATE_CIRCLE}`) {
      var resObj = JSON.parse(this.responseText);
      console.log(resObj, '????????');
      if(resObj.code == 200 && resObj.msg == 'ok') {
        //todo 等志杰完成对id的返回
        ipc.send('teamTip', resObj.data)
      }
    }
  });

  return oldXHROpen.apply(this, arguments);
};
