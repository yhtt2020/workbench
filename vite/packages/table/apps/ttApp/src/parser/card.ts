/**
 * 小组件解析器 ttapp.js
 */
export const useParserCard = (props: any) => {
  /**
   * 边界处理
   */
  // 请求失败
  if (props?.code !== 200) {
    return;
  }
  // 解析modules
  const modules = JSON.parse(props.data.modules);
  // 数据不存在card对象
  if (!modules?.card) {
    return;
  }
  /**
   * 解析数据
   */
  const oldCardData = modules.card;
  let cardData: any = {};

  // 解析卡片头部
  if (oldCardData?.header) {
    cardData.header = parserHeader(oldCardData.header);
  }
  // 解析无界配置
  cardData.wujie = parserWuJie(props.data, oldCardData);
  return cardData;
};

const parserHeader = (props: any) => {
  let headerObj: any = {};
  // 解析卡片标题
  if (props?.title) {
    headerObj.title = props.title;
  } else {
    headerObj.title = "小组件";
  }
  // 解析卡片图标
  if (props?.showIcon) {
    headerObj.showIcon = props.icon;
  } else if (props?.ifyIcon) {
    headerObj.ifyIcon = props.ifyIcon;
  } else {
    headerObj.ifyIcon = "fluent:grid-20-regular";
  }

  return headerObj;
};

const parserWuJie = (props: any, oldCardData) => {
  let wujie: any = {};
  wujie.name = props.id;
  wujie.url = "ttapp://" + props.id + "/" + oldCardData.entry;

  // 解析卡片大小
  if (props.size) {
    wujie.customSize = props.size;
  } else {
    wujie.customSize = "2x2";
  }

  return wujie;
};
