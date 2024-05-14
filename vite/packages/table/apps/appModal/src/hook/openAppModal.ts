import { storeToRefs } from "pinia";
import { useAppModalStore } from "../store";

export const openAppModal = (options: any) => {
  const { name = "ai", logo = "" } = options;
  const { data } = storeToRefs(useAppModalStore());
  // data
};
