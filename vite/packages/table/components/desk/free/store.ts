import { defineStore, storeToRefs } from "pinia";
import { ref, reactive, computed, watch } from "vue";
import dbStorage from "../../../store/dbStorage";
import { cardStore } from "../../../store/card";

// @ts-ignore
export const useFreeDeskStore = defineStore("useFreeDeskStore", {
  state: () => ({
    freeDesk: {
      // id { flag : true}
    },
    currentId: "",
    // 用于记录该桌面是否属于自由拖拽
    isFreeDesk: [],
  }),
  getters: {
    getCurrentDesk() {
      const card: any = cardStore();
      const { currentDeskId } = storeToRefs(card);
      return this.freeDesk[card.currentDeskId];
    },
  },
  actions: {
    initFreeDeskState() {
      const card: any = cardStore();
      const { currentDeskId, desks, currentDeskCard } = storeToRefs(card);
      const desk = desks.value.filter((item) => item.id == currentDeskId.value);
      const currentDesk = ref(desk[0]);
      // 属于自由拖拽
      if (this.freeDesk?.hasOwnProperty(currentDeskId.value)) {
        // 取出当前的桌面数据
        // return this.freeDesk[currentDeskId.value];
      }
      // 当前不存在
      else {
        const deskObject = {};
        // 数据改造
        if (currentDesk.value?.length <= 0) return;
        currentDesk.value?.cards.forEach((item) => {
          const { id, name, data, customData } = item;
          deskObject[item.id] = {
            top: 0,
            left: 0,
            id,
            name,
            data,
            customData,
          };
        });
        this.isFreeDesk.push(card.currentDeskId);
        // 保存数据
        this.freeDesk[card.currentDeskId] = deskObject;

      }

      return this.freeDesk[card.currentDeskId];
    },
    addFreeDeskState(id) {
      this.isFreeDesk.push(id);
      this.isFreeDesk = [...new Set(this.isFreeDesk)];
      this.initFreeDeskState();
      this.currentId = id;
    },
    getFreeDeskState(id) {
      if (this.isFreeDesk.includes(id)) {
        this.currentId = id;

        return true;
      }
    },
    delFreeDeskState(id) {
      let isFreeDeskSet = new Set(this.isFreeDesk);
      isFreeDeskSet.delete(id);
      this.isFreeDesk = [...isFreeDeskSet];

      delete this.freeDesk[id];
    },
    renewFreeDeskState(id) {},
  },
  persist: {
    enabled: true,
    strategies: [
      {
        paths: [""],
        storage: dbStorage,
      },
    ],
  },
});
