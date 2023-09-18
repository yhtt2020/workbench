import { cardStore } from "../../../store/card";
const delDesk = () => {
  const store: any = cardStore();
  store.desks = store.desks.filter((item) => item.name !== "任务桌面");
};
export const endGuide = {
  M0202: () => {
    delDesk();
  },
  M0303: () => {
    delDesk();
  },
};
