<template>
  <HomeComponentSlot :customData="customData" :customIndex="customIndex" :options="options">
    <HorizontalPanel :navList="audioTitle" v-model:selectType="audioType"  class="mt-4"></HorizontalPanel>
    <div v-if="audioType.name === 'output'" class="mt-4 flex flex-col">
      <div class="flex flex-col">
         <div class="flex justify-between">
            <span style="color: rgba(255, 255, 255, 0.6); font-size: 14px;font-weight: 400;">音量</span>
            <span style="color: rgba(255, 255, 255, 0.6); font-size: 14px;font-weight: 400;">{{ audioValue  }}%</span>
         </div>
         <a-slider v-model:value="audioValue" :tooltip-visible="false" />
      </div>
      <span class="mt-2" style="color: rgba(255, 255, 255, 0.6);font-size: 14px;font-weight: 400;">默认输出</span>
      <vue-custom-scrollbar :settings="settingsScroller" style="height:200px;" class="mt-3 mr-3">
        <div v-for="item in outputList" style="padding: 8px 10px 6px 10px;color: rgba(255, 255, 255, 0.85);font-size: 16px;">
          {{ item.name }}
        </div>
      </vue-custom-scrollbar>
     
    </div>
    <div v-else class="mt-4">

      <!-- <a-progress :percent="50" :showInfo="false"/> -->
    </div>
  </HomeComponentSlot>
</template>
<script>
import HomeComponentSlot from '../HomeComponentSlot.vue'
import HorizontalPanel from '../../HorizontalPanel.vue';
export default {
  name:'Audio',
  components:{
    HomeComponentSlot,
    HorizontalPanel
  },
  props:{
    customIndex: {
      type: Number,
      default: 0
    },
    customData: {
      type: Object,
      default: () => {}
    },
    confirmCCData: {
      type: Function,
      default: () => {}
    }
  },
  data(){
    return{
      options: {
        className: 'card',
        title: '音频',
        icon: 'sound',
        type: 'games',
      },
      audioTitle:[{title:'输出',name:'output'},{title:'输入',name:'input'}],
      audioType:{title:'输出',name:'output'},
      audioValue:50,
      settingsScroller: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
      outputList:[
        {
          name:'扬声器1（High Definition Audio Device）'
        },
        {
          name:'扬声器2（High Definition Audio Device）'
        },
        {
          name:'扬声器3（High Definition Audio Device）'
        },
        {
          name:'扬声器4（High Definition Audio Device）'
        },
        {
          name:'扬声器5（High Definition Audio Device）'
        },
        {
          name:'扬声器6（High Definition Audio Device）'
        }
      ],
      inputList:[]
    }
  },
  methods:{
    
  }
}
</script>

<style lang="scss" scoped>

/**

*/
.nav-list-container{
  box-shadow: none !important;
}

.nav-list-container ::v-deep .s-item{
  border-radius: 6px !important;
}
::v-deep .ant-slider-track{
  background: linear-gradient(90deg, rgba(98, 193, 255, 1) 0%, rgba(51, 141, 255, 1) 100%) !important;
}
</style>