  <template>
    <div v-if="this.isState&&this.running" class="tomato-timer pointer no-drag ml-1" :style="{'background' : this.isColor}">
      <div style="display: flex;justify-content: space-evenly;
        align-items: center;" @click="onChangeFull">
        <Icon icon="fluent-emoji:tomato" style="font-size: 20px;"/>
          {{ displayNum(minutes) }}:{{ displayNum(seconds) }}
      </div>
        <div v-show="isFullState">
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
        ...mapWritableState(tomatoStore, ['hours','minutes','seconds','isColor','isState','running','isFullState']),
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
        ...mapActions(tomatoStore,['onChangeFull']),
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
         margin-right: 10px;
    }


  </style>
