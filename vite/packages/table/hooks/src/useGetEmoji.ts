import emojis from "../../ui/components/SelectIcon/iconList/emojis";
export const useGetEmoji = () => {
  const list = emojis.list;
  // 获取list的随机值
  let randomIndex = Math.floor(Math.random() * list.length);
  let emoji = `https://a.apps.vip/icons/iconSelect/emoji/${list[randomIndex].name}.svg`;

  return emoji;
};
