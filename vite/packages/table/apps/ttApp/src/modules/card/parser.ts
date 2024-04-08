/**
 * 小组件解析器 ttapp.js
 */
export const useParserCard = (data: any) => {
  /**
   * 边界处理
   */
  // 解析modules
  const card = data.modules?.card;
  // 数据不存在card对象
  if (!card) return;
  /**
   * 解析数据
   */
  let cardData: any = {};

  // 解析卡片头部

  cardData.header = parserHeader(data, card);
  // 解析无界配置
  cardData.wujie = parserWuJie(data, card);

  if (card.customSize) {
    cardData.customSize = card.customSize;
  } else {
    cardData.customSize = "2x2";
  }

  return cardData;
};

const parserHeader = (props: any, card: any) => {
  let obj: any = {};
  // 解析卡片标题
  if (props?.name) {
    obj.title = props.name;
  } else {
    obj.title = "小组件";
  }
  // 解析卡片图标
  if (card?.showIcon) {
    obj.showIcon = card.icon;
  } else if (card?.ifyIcon) {
    obj.ifyIcon = card.ifyIcon;
  } else {
    obj.ifyIcon = "fluent:grid-20-regular";
  }
  // 解析卡片大小

  return obj;
};

const parserWuJie = (props: any, card: any) => {
  let wujie: any = {};
  wujie.name = props.id;
  wujie.url = "ttapp://" + props.id + "/" + card.entry;

  return wujie;
};
