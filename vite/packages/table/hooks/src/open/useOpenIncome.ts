import { storeToRefs } from "pinia";
import { incomeStore } from "../../../apps/income/incomeStore";
import { useAppModalStore } from "../../../apps/appModal/src/store";
export const useOpenIncome = () => {
  const appModalStore: any = useAppModalStore();
  const { runList } = storeToRefs(appModalStore);
  const income = incomeStore();
  const { useMode } = storeToRefs(income);
  if (useMode.value === "modal") {
    appModalStore.getApp("income").visible = true;
  } else {
    window.$ui.router.push({ name: "income" });
  }
};
