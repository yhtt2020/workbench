import { defineStore } from "pinia";

export const useAppStateStore = defineStore("useAppStateStore", {
  state: () => {
    return {
      appsList: [
        {
          icon: "https://a.apps.vip/icons/ppet.png",
          name: "PPet桌面宠物",
          summary: "一款开源桌面看板娘，让你不再孤单。",
          needInstall: true,
          installPath: "C:\\Program Files\\PPet3\\PPet3.exe",
          downloadUrl: "https://a.apps.vip/download/ppet3330.exe",
          data: {
            security: true,
          },
          defaultFolder: "\\Program Files\\PPet3",
          downloading: false,
          installing: false,
          percent: 0,
          done: null,
          type:'localApp',
        },
        {
          icon: "https://a.apps.vip/icons/debugtron.svg",
          name: "Debugtron",
          summary: "基于Electron的调试工具，用于发现问题。",
          needInstall: true,
          installPath: "%LOCALAPPDATA%\\debugtron\\Debugtron.exe",
          downloadUrl: "https://a.apps.vip/download/debugtron.exe",
          data: {
            security: true,
          },
          defaultFolder:'\\debugtron\\Debugtron.exe',
          downloading: false,
          installing: false,
          percent: 0,
          done: null,
          type:'localApp',
        },
        {
          icon: "https://a.apps.vip/download/aida64.jpg",
          name: "AIDA64",
          summary: "一款商业级计算机硬件状态监控软件。",
          needInstall: true,
          silent: false, //静默安装
          installPath:
            "C:\\Program Files (x86)\\FinalWire\\AIDA64 Extreme\\aida64.exe",
          downloadUrl: "https://a.apps.vip/download/aida64extreme685.exe",
          data: {
            security: true,
          },
          defaultFolder:'\\AIDA64 Extreme\\aida64.exe',
          downloading: false,
          installing: false,
          percent: 0,
          done: null,
          type:'localApp',
        },
        {
          icon: "https://a.apps.vip/download/rtss.png",
          name: "RTSS",
          summary: "一款免费的游戏帧数监测软件。",
          needInstall: true,
          installPath:
            "C:\\Program Files (x86)\\RivaTuner Statistics Server\\RTSS.exe",
          defaultFolder:'\\RivaTuner Statistics Server\\RTSS.exe',
          downloadUrl: "https://a.apps.vip/download/rtss.exe",
          data: {
            security: true,
          },
          downloading: false,
          installing: false,
          percent: 0,
          done: null,
          type:'localApp',
        },
        {
          icon: "https://a.apps.vip/download/dsf.svg",
          name: "DisplayFusion",
          summary: "解决游戏触摸最小化问题。一款用来提升副屏体验的商业软件。",
          needInstall: true,
          silent: false, //非静默安装
          installPath: "C:\\Program Files\\DisplayFusion\\DisplayFusion.exe",
          downloadUrl:
            "https://a.apps.vip/download/DisplayFusionSetup-10.0.exe",
          data: {
            security: true,
          },
          defaultFolder:'\\DisplayFusion\\DisplayFusion.exe',
          downloading: false,
          installing: false,
          percent: 0,
          done: null,
          type:'localApp',
        },
      ],
    };
  },
});
