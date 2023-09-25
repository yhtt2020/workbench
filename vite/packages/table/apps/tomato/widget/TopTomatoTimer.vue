<template>
    <div class="tomato-timer no-drag" @click="onClick">
        <Icon icon="sousuo"></Icon>
        番茄时间
        <div class="tomato-float">
            <TomatoTimer />
        </div>
    </div>
</template>
  
  <script>

  
  import { tomatoStore } from '../store'
  import {mapActions, mapState} from "pinia";
  import TomatoTimer from '../page/Clock.vue'

    export default {
      name: 'Promotion',
      components: { 
        TomatoTimer
      },
      computed: {
        ...mapState(tomatoStore, ['getTomatoTimer']),
      },
      data(){
        return {
            tomatoTimer1:{
                timer1:"23"
            }


        }
      },
      mounted(){
        this.getTomatoTimer()
      },
      watch:{

      },
      methods:{
        ...mapActions(tomatoStore, ['getTomatoTimer']),
        onClick(){
            console.log("this",this);
            console.log("this.tomatoTimer1.timer1",this.tomatoTimer1.timer1)
            console.log("tomatoTimer1.timer1",tomatoTimer1.timer1);
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
  