const appModel = window.$models.appModel;
export const appHelper = {
  checkInstalled: (appid: string) => {
    return window.localApps.some((installedApp) => {
      return appid === installedApp.appid;
    });
  },
  run: (appid: string) => {
    let local = appHelper.findLocal(appid);
    if (local) {
    
      window.tsbApi.app.run(local.nanoid, false, local);
    }
  },
  findLocal: async (appid: string) => {
    let list = await appModel.getAllApps();
    return list.find((item) => {
      return item.appid === appid;
    });
  },
  async reloadList() {
    window.localApps = await window.tsbApi.app.getAll();
  },
};
