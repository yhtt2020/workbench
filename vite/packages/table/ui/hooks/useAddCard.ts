// 添加桌面卡片api
import { storeToRefs } from "pinia";
import { useFreeLayoutStore } from "../../components/desk/freeLayout/store";
import { cardStore } from "../../store/card";

export const useAddCard = (name, customData = {}, id: any = Date.now(),desk?) => {
  const freeLayoutStore = useFreeLayoutStore();
  const { getCurrentDesk }: any = storeToRefs(freeLayoutStore);
  const card: any = cardStore();
  card.addCard(
    {
      name,
      id,
      customData,
    },
    desk?desk:getCurrentDesk.value
  );
  return id;
};

export const useDelCard = (id, desk = null) => {
  const freeLayoutStore = useFreeLayoutStore();
  const { getCurrentDeskId, freeLayoutData }: any =
    storeToRefs(freeLayoutStore);


  delete freeLayoutData.value[getCurrentDeskId.value].id;
  const card: any = cardStore();
  card.removeCard(id, desk);
};
