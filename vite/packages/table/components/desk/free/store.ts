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
    // 用于记录该桌面是否属于自由拖拽
    isFreeDesk: [],
  }),
  getters: {
    getCurrentDesk() {
      const card: any = cardStore();
      const { currentDeskId, desks, currentDeskCard } = storeToRefs(card);

      // watch(currentDeskCard.value, (newV) => {
      //   // currentDeskCard.value.forEach((item) => {
      //   //   console.log("1 :>> ", item);
      //   // });
      //   console.log("currentDeskCard.value :>> ", newV.cards);

      //   newV.cards.forEach((item) => {
      //     console.log("item :>> ", item);
      //     if (!this.freeDesk.hasOwnProperty(item.id)) {
      //       console.log("key1 not exists");
      //       const { id, name, data, customData } = item;
      //       this.freeDesk[currentDeskId.value][item.id] = {
      //         top: 0,
      //         left: 0,
      //         id,
      //         name,
      //         data,
      //         customData,
      //       };
      //     }
      //   });
      // });
      const currentDesk = computed(() => {
        console.log("更新了 :>> ");
        const desk = desks.value.filter(
          (item) => item.id == currentDeskId.value
        );
        // console.log("desk :>> ", desk[0].cards);
        // desk.cards.forEach((item) => {
        //   console.log("item :>> ", item);
        // });
        console.log("desk computed :>> ", desk);
        return desk[0];
      });

      // 属于自由拖拽
      if (this.isFreeDesk.includes(currentDeskId.value)) {
        // 取出当前的桌面数据
        return this.freeDesk[currentDeskId.value];
      }
      // 当前不存在
      else {
        const deskObject = {};
        // 数据改造
        currentDesk.value.cards.forEach((item) => {
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
      console.log(" :>> ", this.freeDesk[card.currentDeskId]);
      return this.freeDesk[card.currentDeskId];
    },
  },
  actions: {},
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
