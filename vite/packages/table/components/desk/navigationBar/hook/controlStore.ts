import { defineStore } from "pinia";
// import dbStorage from "../../../../store/dbStorage";

// @ts-ignore
export const controlStore = defineStore('control',{
 state: () => ({
   control:{
    addList:[],
    removeList:[
      {
        id:'audio',
        list:[
         { 
          id:'music', 
          list:[
           {
            icon:'fluent:previous-16-filled',
            color:'var(--disable-text)'
           },
           {
            icon:'fluent:play-16-filled',
            color:'rgba(255,255,255,0.85)'
           },
           {
            icon:'fluent:next-16-filled',
            color:'var(--disable-text)'
           },
          ]
         },
         { 
          id:'volume',
          icon:'fluent:speaker-2-16-regular',
         }
        ],
       },
       {
        id:'window-control',
        icon:'fluent:window-multiple-16-filled',
        name:'窗口控制',
       },
       {
        icon:'fluent:dark-theme-20-filled',id:'light-color-mode',
        name:'浅色模式',
       },
       {
        icon:'fluent:desktop-16-regular',id:'min-mode',
        name:'极简模式',
       },
       {
        icon:'fluent:battery-10-16-regular',id:'energy-save-mode',
        name:'节能模式',
       },
       {
        icon:'fluent:alert-off-16-regular',id:'mute-mode',
        name:'勿扰模式',
       },
       {
        icon:'fluent:accessibility-16-regular',id:'assist-mode',
        name:'辅助模式',
       },
       {
        icon:'fluent:cursor-click-20-regular',id:'shake',
        name:'摇一摇',
       },
       {
        icon:'fluent:games-16-regular',id:'game-mode',
        name:'游戏模式',
       }
    ],
   }
 }),

 actions: {

 },

 persist: {
  enabled: true,
  strategies: [
    {
      paths: ["control"],
      // storage: localStorage,
      storage: localStorage,
    },
  ],
},
})