  <template>
    <div v-if="this.isState" class="tomato-timer pointer no-drag ml-1" :style="{'background' : this.isColor}">
      <div style="display: flex;justify-content: space-evenly;
        align-items: center;">
        <Icon icon="fluent-emoji:tomato" style="font-size: 20px;"/>
          {{ displayNum(minutes) }}:{{ displayNum(seconds) }}
      </div>
        <div class="tomato-float">
            <TomatoTimer  />
        </div>
    </div>
  </template>
  <script>
  import { tomatoStore } from '../store'
  import {mapActions, mapState,mapWritableState} from "pinia";
  import TomatoTimer from '../page/Clock.vue'
  import { Icon } from '@iconify/vue';
    export default {
      name: 'Promotion',
      components: { 
        TomatoTimer,
        Icon,
      },
      computed: {
        ...mapWritableState(tomatoStore, ['hours','minutes','seconds','isColor','isState']),
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
        width: 70px;
        height: 32px;
        background: #E7763E;
        border-radius: 6px;
        line-height: 32px;
        font-size: 14px;
        color: rgba(255,255,255,0.85);
        z-index: 100;
        font-weight: 500;
    }
    .tomato-timer .tomato-float{
        display: none;
    }
    .tomato-timer:hover .tomato-float{
        display: block;
    }


  </style>
  