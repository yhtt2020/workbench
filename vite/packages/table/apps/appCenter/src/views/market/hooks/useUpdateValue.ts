import {usePlat} from "../../../../../../permission/usePlat";
let model
if(usePlat('client')){
  model = window.$models.appModel;
}


/**
 * 更新应用市场安装的轻应用的value值，兼容工作台打开轻应用的方式
 * @param item
 * @returns
 */
export const updateValue = async (item: object) => {
  const allApps = await model.getAllApps();
  console.log(allApps);
  // setTimeout(() => {
  const app = allApps.find((appItem) => {
    return appItem.appid === item.id;
  });
  //   console.log(app);
  item.value = app;
  return item;
  // }, 0);
};
