import { storeToRefs } from "pinia";
import { useFreeLayoutStore } from "../../components/desk/freeLayout/store";
import { cardStore } from "../../store/card";

export const useAddCard = (name, customData) => {
  const freeLayoutStore = useFreeLayoutStore();
  const { getCurrentDesk }: any = storeToRefs(freeLayoutStore);
  const card: any = cardStore();
  card.addCard(
    {
      name,
      id: Date.now(),
      customData,
    },
    getCurrentDesk.value
  );
};