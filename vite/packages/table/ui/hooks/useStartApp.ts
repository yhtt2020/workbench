import { teamStore } from "./../../store/team";
import { tt } from "./../../permission/global/global";
import { useMit, useAppModal } from "./../../hooks";
// import { isObject } from "./../../TUIKit/TUICore/utils/index";
import { useOpenAi } from "../../hooks/src/open/useOpenAi";

import browser from "../../js/common/browser";
import { appStore } from "../../store";
import { taskStore } from "../../apps/task/store";
import { favoStore } from "../../apps/favorites/store";
import { useComStore } from "../../components/bottomPanel/comStore";
import { useTTAppStore } from "../../apps/ttApp/src/store";
import { storeToRefs } from "pinia";
import fs from "fs";
import { appsStore } from "../../store/apps";
import { useAppCenterStore } from "../../apps/appCenter/src/store";
import {ActionHandler} from "../../js/action/actionHandler";
import {message} from "ant-design-vue";
import {useNavigationStore} from "../../components/desk/navigationBar/navigationStore";

// @ts-ignore

async function runApp(uri) {
  console.log("打开uri", uri);
  try {
    var cp = require("child_process");
    let realPath = uri;
    let isDir = false;
    if (uri.endsWith(".url") || uri.endsWith(".lnk")) {
      realPath = await tsbApi.system.getRealPath(uri);
      if (!realPath) {
        realPath = uri;
      }
    }
    if (uri.endsWith(".url") || uri.endsWith(".lnk")) {
      if (realPath.startsWith("steam://")) {
        console.log("执行路径A,steam游戏模式", realPath);
        cp.spawn("start", [realPath], {
          detached: true,
          shell: true,
          windowsHide: true,
          stdio: "ignore",
        });
      } else {
        console.log(
          "执行路径B,普通快捷方式",
          "cwd",
          require("path").dirname(realPath)
        );
        (window as any).$models.win32.openApp(realPath, "", "", false, true);
        //let child=cp.spawn(realPath, {detached: true,cwd:require('path').dirname(realPath),stdio: 'ignore',windowsHide:true,})
        //child.unref()
        // setTimeout(()=>{
        //   console.log('自动关闭')
        //   window.$models.win32.killProcess(child.pid)
        // },5000)
      }
    } else {
      var fs = require("fs");
      if (realPath === "我的电脑") {
        (window as any).$models.win32.openApp(
          "explorer",
          "shell:MyComputerFolder",
          "",
          false,
          true
        );
        return true;
      }
      if (realPath === "回收站") {
        (window as any).$models.win32.openApp(
          "explorer",
          "shell:RecycleBinFolder",
          "",
          false,
          true
        );
        return true;
      }

      var stat = fs.lstatSync(realPath);

      console.log(
        "执行路径B,普通文件",
        "cwd",
        require("path").dirname(realPath)
      );
      isDir = stat.isDirectory();
      if (isDir) {
        console.log("执行路径D，文件夹", realPath);
        cp.spawn("start", ["\"\"","\""+require("path").normalize(realPath)+"\""], {
          detached: true,
          cwd: require("path").dirname(realPath),
          shell: true,
          windowsHide: true,
          stdio: "ignore",
        });
      } else {
        console.log("执行路径C，普通文件", realPath);
        (window as any).$models.win32.openApp(realPath, "", "", false, true);
        //cp.spawn(realPath, {detached: true,cwd:require('path').dirname(realPath),stdio: 'ignore',windowsVerbatimArguments:true})
      }
    }

    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
/**
 *
 * @param type
 * @param value
 * @param router
 * @param data 额外提供的完整参数
 */
export const startApp = async (type, value, router?,data?) => {
  if (type === "" || value === "") {
    console.warn("startApp :>> type or value 不能为空");
  }
  switch (type) {
    case "ttapp":
      const ttappStore:any = useTTAppStore();
      const { modal } = storeToRefs(ttappStore);
      ttappStore.enterApp(value);
      break;
    case "fixed":
      openFixedApp[value]();
      break;
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
    case "mob":
      browser.openInMobMod(value, {
        partition: "persist:webcontent",
        newName: "手机模式",
      });
      break;
    // 轻应用
    case "lightApp":
      // let isObject = typeof value == 'object'
      // ipc.send("executeAppByPackage", {
      //   package: isObject ? value.package :  value,
      // });
      // 更换打开方式，打开新增应用
      (ipc as any).send("executeApp", { app: JSON.parse(JSON.stringify(value)) });
      break;
    // 酷应用
    case "coolApp":
      // router.push({ name: "app", params: value });
      // console.log('value = ;' ,value)
      // 新版打开方式,详细细节可以在vite\packages\table\page\AppFrame.vue中查看
      const useAppStore:any = appsStore();
      const info = {
        type,
        ...value,
      };
      useAppStore.openApp(info);
      break;
    // 本地应用
    case "tableApp":
      return await runApp(value);
      //window.$models.win32.openPath(require("path").normalize(value));
      break;
    // 系统应用
    case "systemApp":
      // router.push({ name: value });
      openSysApp(value, router,data);
      break;
    // 不知道是什么场景
    case "localApp":
      return await runApp(value);
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
    // 桌面卡片
    case "card":
      // useMit.emit("openCard");
      break;
    case 'action':
      console.log('执行actions',value)
      let done = []
      let success = []
      let failure = []
      let unknown = []
      let actions =value
      if (actions) {
        for (const action of actions) {
          let handler = new ActionHandler(action)
          let result = await handler.doAction()
          done.push(result)
          if (result.status === 1) {
            success.push(result)
          } else if (result.status === 0) {
            failure.push(result)
          } else {
            unknown.push(result)
          }
        }
        if (failure.length === 0) {
          if (unknown.length) {
            console.log('333 :>> ', 333);
            message.success({
              content: `共为您执行${done.length}个动作，成功${success.length}个，未知${unknown.length}个`,
              key: 'action'
            })
          } else {
            message.success({content: `共为您成功执行${done.length}个动作`, key: 'action'})
          }

        } else {
          if (success.length > 0) {
            message.warn({
              content: `共为您执行${done.length}个动作，其中失败${failure.length}个，成功${success.length}，未知${unknown.length}个`,
              key: 'action'
            })
          } else {
            message.error({
              content: `共为您执行${done.length}个动作，其中失败${failure.length}个，成功${success.length}，未知${unknown.length}个`,
              key: 'action'
            })
          }
        }
        if (failure.length > 0) {
          console.warn({content: '打印失败日志：', key: 'action'})
          failure.forEach(f => {
            console.warn(f.message)
          })
        }
      } else {
      }
  }
  return true;
};

// 打开特殊系统应用，无需要通过路由打开的图标
export const openSysApp = (value,router, data) => {
  const useAppStore: any = appStore();
  const useTakeStore = taskStore();
  const usefavoStore = favoStore();
  console.log("value :>> ", value);
  // // 全屏
  // if (value === "fullscreen") {
  //   useAppStore.toggleFullScreen();
  // } else if (value === "task") {
  //   // 任务
  //   useTakeStore.isTaskDrawer = true;
  //   useTakeStore.smallMize = true;
  // } else if (value === "commun") {
  //   // 社区中心
  // } else if (value === "favorites") {
  //   // 收藏夹
  //   usefavoStore.isFavorites = !usefavoStore.isFavorites;
  // } else if (value === "control") {
  //   // 控制中心
  // } else if (value === "setting") {
  //   // 设置
  //   Mit.emit("openSystemSet");
  // } else if (value === "status") {
  //   Mit.emit("openSystemSet");
  //   setTimeout(() => {
  //     Mit.emit("selectSystemNav", 3);
  //   }, 100);
  // } else {
  //   // 通过路由打开
  //   router.push({ name: value });
  // }
  switch (value) {
    case "fullscreen":
      // 全屏
      useAppStore.toggleFullScreen();
      break;
    case "task":
      // 任务
      useTakeStore.isTaskDrawer = true;
      useTakeStore.smallMize = true;
      break;
    case "commun":
      // 社区中心
      break;
    case "favorites":
      // 收藏夹
      usefavoStore.isFavorites = !usefavoStore.isFavorites;
      break;
    case "control":
      // 控制中心
      break;
    case "setting":
      // 设置
      useMit.emit("openSystemSet");
      break;
    case "status":
      // 设置
      useMit.emit("openSystemSet");
      setTimeout(() => {
        useMit.emit("selectSystemNav", 4);
      }, 100);
      break;
    case "home":
      useAppStore.settings.isCommunity = true;
      useNavigationStore().jumpDesk = data.home||'';
      window.$ui.router.push({ name: value });
      break;
    case "ai":
      const { openApp : aiOpen } = useAppModal("ai");
      aiOpen();
      break;
    case "note":
      const { openApp:noteOpen } = useAppModal("note");
      noteOpen();
      break;
    case "income":
      useAppModal("income").openApp();
      break;
    case "my":
      useAppModal("galleryModalApp").openApp();
      break;
    case 'apps':
      // useMit.emit('openAppCenter')
      // 跳转到新版应用中心
      const appCenterStore = useAppCenterStore();
      const { visible } = storeToRefs(appCenterStore);
      visible.value = true;
      break;
    default:
      // 通过路由打开
      (window as any).$ui.router.push({ name: value });
      break;
  }
};

// 打开固定应用
const openFixedApp = {
  // 系统设置
  systemSet: () => {
    window.tt.sys.openSystemSet();
  },
  // 我的道具
  myProp: () => {
    const store = useComStore();
    store.showMyProp = true;
  },
  // 小队
  team: () => {
    openTeam();
  },
};

// 打开小队判断
const openTeam = async () => {
  const store = useComStore();
  const team:any = teamStore();
  await team.updateMy(0);
  if (team.team?.status === false) {
    store.showTeamTip = true;
  } else {
    team.teamVisible = !team.teamVisible;
  }
};
