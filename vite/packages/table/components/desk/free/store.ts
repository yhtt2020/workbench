import { defineStore, storeToRefs } from "pinia";
import { ref, reactive, computed, watch } from "vue";
import dbStorage from "../../../store/dbStorage";
import { cardStore } from "../../../store/card";

// @ts-ignore
export const useFreeDeskStore = defineStore("useFreeDeskStore", {
  state: () => ({
    freeDesk: {},
    freeDeskState: {},
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
        this.freeDeskState[card.currentDeskId] = {
          disable: false,
        };
        // 保存数据
        this.freeDesk[card.currentDeskId] = deskObject;
      }

      return this.freeDesk[card.currentDeskId];
    },
    addFreeDeskState(id) {
      this.initFreeDeskState();
    },
    getFreeDeskState(id) {
      return this.freeDeskState[id] && !this.freeDeskState[id]?.disable;
    },
    delFreeDeskState(id) {
      console.log('id :>> ', id);
      delete this.freeDesk[id];
      delete this.freeDeskState[id];
    },
    renewFreeDeskState(id) {
      if (!this.freeDeskState[id]) {
        this.initFreeDeskState();
      } else {
        this.freeDeskState[id].disable = !this.freeDeskState[id].disable;
      }
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ["freeDesk", "freeDeskState"],
        // storage: dbStorage,
        storage: localStorage,
      },
    ],
  },
});
