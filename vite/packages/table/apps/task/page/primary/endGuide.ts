import { cardStore } from "../../../../store/card";
import { taskStore } from "../../store";
const delDesk = () => {
  const store: any = cardStore();
  const task: any = taskStore();

  store.desks = store.desks.filter((item) => item.id !== task.deskID);
};
export const endGuide = {
  M0202: () => {
    delDesk();
  },
  M0303: () => {
    delDesk();
  },
};
