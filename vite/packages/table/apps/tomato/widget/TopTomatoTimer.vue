<template>
    <div class="tomato-timer no-drag">
        <Icon icon="sousuo"></Icon>
        番茄时间{{ displayNum(minutes) }}:{{ displayNum(seconds) }}
        <div class="tomato-float">
            <TomatoTimer />
        </div>
    </div>
</template>
  
  <script>

  
  import { tomatoStore } from '../store'
  import {mapActions, mapState,mapWritableState} from "pinia";
  import TomatoTimer from '../page/Clock.vue'

    export default {
      name: 'Promotion',
      components: { 
        TomatoTimer
      },
      computed: {
        ...mapWritableState(tomatoStore, ['hours','minutes','seconds']),
      },
      data(){
        return {


        }
      },
      mounted(){

      },
      watch:{

      },
      methods:{
        // 时间格式
        displayNum (num) {
          if (num < 10) {
            return '0' + num
          } else {
            return num
          }
        },
      },
    }
  </script>
  
  <style scoped>

    .tomato-timer{
        position: relative;
        top: 2px;
        left: -5px;
        width: 143px;
        height: 32px;
        background: #E7763E;
        border-radius: 6px;
        text-align: center;
        line-height: 32px;
        font-size: 14px;
        color: rgba(255,255,255,0.85);
        cursor: pointer;
        z-index: 100;
    }
    .tomato-timer .tomato-float{
        display: none;
    }
    .tomato-timer:hover .tomato-float{
        display: block;
    }


  </style>
  