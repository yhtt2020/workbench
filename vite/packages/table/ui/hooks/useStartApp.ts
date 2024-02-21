import { isObject } from './../../TUIKit/TUICore/utils/index';
import browser from "../../js/common/browser";
import { appStore } from "../../store";
import { taskStore } from "../../apps/task/store";
import cp from "child_process";
import fs from "fs";
async function runApp(uri) {
  try{
    var cp = require("child_process");
    let realPath = uri
    let isDir=false
    if (uri.endsWith('.url') || uri.endsWith('.lnk')) {
      realPath = await tsbApi.system.getRealPath(uri)
    }
    if (uri.endsWith('.url') || uri.endsWith('.lnk')) {
      if(realPath.startsWith('steam://')){
        console.log('执行路径A,steam游戏模式',realPath)
        cp.spawn('start',[realPath], {detached: true,shell:true,windowsHide:true,stdio: 'ignore',})
      }else{
        console.log('执行路径B,普通快捷方式','cwd',require('path').dirname(realPath))
        window.$models.win32.openApp(realPath,'','',false,true)
        //let child=cp.spawn(realPath, {detached: true,cwd:require('path').dirname(realPath),stdio: 'ignore',windowsHide:true,})
        //child.unref()
        // setTimeout(()=>{
        //   console.log('自动关闭')
        //   window.$models.win32.killProcess(child.pid)
        // },5000)
      }
    }else{
      var fs = require('fs');
      var stat = fs.lstatSync(realPath);
      console.log('执行路径B,普通文件','cwd',require('path').dirname(realPath))
      isDir=stat.isDirectory()
      if(isDir){
        console.log('执行路径D，文件夹',realPath)
        cp.spawn('start',[ require("path").normalize(realPath)], {detached: true,cwd:require('path').dirname(realPath),shell:true,windowsHide:true,stdio: 'ignore',})
      }else{
        console.log('执行路径C，普通文件',realPath)
        window.$models.win32.openApp(realPath,'','',false,true)
        //cp.spawn(realPath, {detached: true,cwd:require('path').dirname(realPath),stdio: 'ignore',windowsVerbatimArguments:true})
      }
    }

    return true
  }catch (e) {
    return false
  }
}
/**
 *
 * @param type
 * @param value
 * @param router 这个是路由 ts无法调用 得手动传入
 */
export const startApp =async  (type, value, router?) => {
  if (type === "" || value === "") {
    console.warn("startApp :>> type or value 不能为空");
  }
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
      let isObject = typeof value == 'object'
      ipc.send("executeAppByPackage", {
        package: isObject ? value.package :  value,
      });
      // ipc.send('executeApp', { app: JSON.parse(JSON.stringify(value)) })
      break;
    // 酷应用
    case "coolApp":
      router.push({ name: "app", params: value });
      break;
    // 本地应用
    case "tableApp":
      return await  runApp(value)
      //window.$models.win32.openPath(require("path").normalize(value));
      break;
    // 系统应用
    case "systemApp":
      // router.push({ name: value });
      openSysApp(value, router);
      break;
    // 不知道是什么场景
    case "localApp":
      return await runApp(value)
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
      break;
  }
  return true
};

export const openSysApp = (value, router) => {
  const useAppStore: any = appStore();
  const useTakeStore = taskStore();
  if (value === "fullscreen") {
    useAppStore.toggleFullScreen();
  } else if (value === "task") {
    useTakeStore.isTaskDrawer = true;
    useTakeStore.smallMize = true;
  } else if (value === "commun") {
    return;
  } else if(value === "control"){
    return;
  }else {
    router.push({ name: value });
  }
};
