import { defineStore } from "pinia";
import dbStorage from "../../store/dbStorage";

// @ts-ignore
export const keyCutStore = defineStore("keyCutStore", {
  state: () => ({
    keys:{//默认键位
      table: {
        keys:['Alt','Z'],
        title:'天天工作台',
        keyArr:[
          {
            field:'modifierKeyOne',
            index: 5,
            key: 'Alt',
          },
          {
            field:'keyList[1]',
            index: 25,
            key: 'Z',
          },
        ]
      },
      globalSearch: {
        keys:['Alt','X'],
        title:'想天浏览器',
        keyArr:[
          {
            field:'modifierKeyOne',
            index: 5,
            key: 'Alt',
          },
          {
            field:'keyList[1]',
            index: 23,
            key: 'X',
          },
        ]
      },
      superTools:{
        keys:['Alt','F'],
        title:'超级工具箱',
        keyArr:[
          {
            field:'modifierKeyOne',
            index: 5,
            key: 'Alt',
          },
          {
            field:'keyList[1]',
            index: 5,
            key: 'F',
          },
        ]
      },
    },
  }),
  getters: {},
  actions: {},
  persist: {
    enabled: true,
    strategies: [
      {
        paths: ['keys'],
        storage: dbStorage,
      },
    ],
  },
});
