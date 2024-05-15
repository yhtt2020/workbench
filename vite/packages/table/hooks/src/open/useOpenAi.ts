import { storeToRefs } from "pinia";
import { aiStore } from "../../../store/ai";
import { useAppModalStore } from "../../../apps/appModal/src/store";
export const useOpenAi = () => {
  const appModalStore: any = useAppModalStore();
  const { runList } = storeToRefs(appModalStore);
  const ai = aiStore();
  const { useMode } = storeToRefs(ai);
  if (useMode.value === "modal") {
    appModalStore.getApp("ai").visible = true;
  } else {
    window.$ui.router.push({ name: "ai" });
  }
};
