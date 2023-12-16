import { storeToRefs } from "pinia";
import { useFreeLayoutStore } from "../../../../components/desk/freeLayout/store";

export const useAddCard = (data) => {
  const freeLayoutStore = useFreeLayoutStore();
  const { getCurrentDesk }: any = storeToRefs(freeLayoutStore);
  console.log("getCurrentDesk.value :>> ", getCurrentDesk.value);
  getCurrentDesk.value.cards.push({
    name: "myIcons",
    id: Date.now(),
    customData: { iconList: [{ ...data }] },
  });
};
