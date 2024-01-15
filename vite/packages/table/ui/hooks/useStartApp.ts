import browser from "../../js/common/browser";
import { appStore } from "../../store";
import { taskStore } from "../../apps/task/store";
import cp from "child_process";
import fs from "fs";
async function runApp(uri) {
  // window.$models.win32.openPath(uri);
  // return
  var cp = require("child_process");
  let realPath = uri
  let isDir=false
  if (uri.endsWith('.url') || uri.endsWith('.lnk')) {
    realPath = await tsbApi.system.getRealPath(uri)
  }
  if (uri.endsWith('.url') || uri.endsWith('.lnk')) {
    cp.spawn(require("path").normalize(realPath), [], {detached: true})
  }else{
    cp.spawn('start',[ require("path").normalize(realPath)], {detached: true,shell:true,windowsHide:true})
  }
  return


  var fs = require('fs');
  var stat = fs.lstatSync(realPath);
  isDir=stat.isDirectory()
  let cmd=require("path").normalize(realPath)
  if(isDir){
    cmd='start '
  }else{
    if (uri.endsWith('.url') || uri.endsWith('.lnk')) {
      return cp.spawn(cmd, [], {detached: true})
    }
    cmd= require("path").normalize(realPath)
  }
  console.log(require("path").normalize(realPath),'ccc')
  return cp.spawn('start',[ require("path").normalize(realPath)], {detached: true,shell:true,windowsHide:true})

  // cp.spawn(cmd, [], {detached: true}, function (err, stdout, stderr) {
  //   if (err) {
  //     console.error(err);
  //   }
  // });
}
/**
 *
 * @param type
 * @param value
 * @param router 这个是路由 ts无法调用 得手动传入
 */
export const startApp = (type, value, router?) => {
  if (type === "" || value === "") {
    console.warn("startApp :>> type or value 不能为空");
  }
  console.log("type,value :>> ", type, value);
  switch (type) {
    // 默认浏览器
    case "default":
      browser.openInSystem(value);
      break;
    // 嵌入浏览器
    case "internal":
      browser.openInTable(value, {});
      break;
    // 想天浏览器
    case "thinksky":
      browser.openInInner(value);
      break;
    // 轻应用
    case "lightApp":
      ipc.send("executeAppByPackage", {
        package: value,
      });
      break;
    // 酷应用
    case "coolApp":
      router.push({ name: "app", params: value });
      break;
    // 本地应用
    case "tableApp":
      runApp(value)
      //window.$models.win32.openPath(require("path").normalize(value));
      break;
    // 系统应用
    case "systemApp":
      // router.push({ name: value });
      openSysApp(value, router);
      break;
    // 不知道是什么场景
    case "localApp":
      runApp(value)
      // cp.spawn(require("path").normalize(value),[],{detached:true},function(err,stdout,stderr){
      //   if(err){
      //     console.error(err);
      //   }
      //   console.log("stdout:",stdout)
      //   console.log("stderr:",stderr);
      // });
      //window.$models.win32.openPath(value);
      break;
    // 导航栏文件夹
    case "folder":
      // console.log(2222);
      break;
  }
};

export const openSysApp = (value, router) => {
  const useAppStore: any = appStore();
  const useTakeStore = taskStore();
  if (value === "fullscreen") {
    useAppStore.toggleFullScreen();
  } else if (value === "task") {
    useTakeStore.isTaskDrawer = true;
  } else if (value === "commun") {
    console.log(1111);
    return;
  } else if(value === "control"){
    return;
  }else {
    router.push({ name: value });
  }
};
