import { defineStore } from "pinia";

import dbStorage from "../../../../store/dbStorage";
// @ts-ignore

export const controlStore = defineStore('control',{
 state: () => ({}),

 actions: {

 },

 persist: {
  enabled: true,
  strategies: [
    {
      paths: [""],
      // storage: localStorage,
      storage: dbStorage,
    },
  ],
},
})