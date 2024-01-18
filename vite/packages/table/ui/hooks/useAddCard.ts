import { storeToRefs } from "pinia";
import { useFreeLayoutStore } from "../../components/desk/freeLayout/store";
import { cardStore } from "../../store/card";

export const useAddCard = (name, customData = {}, id: any = Date.now()) => {
  const freeLayoutStore = useFreeLayoutStore();
  const { getCurrentDesk }: any = storeToRefs(freeLayoutStore);
  const card: any = cardStore();
  card.addCard(
    {
      name,
      id,
      customData,
    },
    getCurrentDesk.value
  );
  return id;
};

export const file = (item) => {
  return {
    model: "file",
    size: "mini",
    open: {
      type: item.type,
      value: item.value,
    },
    titleValue: item.name,
    isTitle: true,
    src: item.icon,
    isRadius: true,
    radius: 5,
    imgState: "cover",
    imgShape: "square",
    isBackground: item.isBg,
    backgroundColor: item.bg,
    backgroundIndex: 0,
  };
};
