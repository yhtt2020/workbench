<template>
  <xt-modal full v-model="clockVisible" title="时钟设置">
    <div class="flex flex-col h-full mx-2" style="width: 500px">
      <div class="flex flex-col xt-bg-2 p-4 rounded-lg mb-4">
        <div class="flex flex-col">
          <div class="flex justify-between mb-2.5">
            <span class="xt-font xt-text font-16">秒针</span>
            <a-switch v-model:checked="customData.enableSecond"/>
          </div>
          <span class="xt-font xt-text-2 font-14">
            显示秒针可能会影响性能。
          </span>
        </div>
        
        <div class="my-4" >
          <div class="xt-bb mx-auto"></div>
        </div>

        <div class="flex flex-col">
         <div class="flex justify-between mb-2.5">
          <span class="xt-font xt-text font-16">背景框</span>
          <a-switch v-model:checked="customData.backgroundFrame"/>
         </div>
         <span class="xt-font xt-text-2 font-14">
          显示时钟组件的背景框。
         </span>
        </div>
      </div>

      <div class="flex flex-col xt-bg-2 p-4 rounded-lg mb-4 " >
        <div class="flex flex-col">
          <span class="xt-text mb-3 font-16">时钟样式</span> 
          <xt-option-tab  v-model="customData.currentStatus" :list="clockTabList" circle  style="height: 40px;" />
        </div>
        <div class="mt-1 mb-4" v-if="customData.currentStatus === 'font'">
          <div class="xt-bb mx-auto"></div>
        </div>
        
        <template v-if="customData.currentStatus === 'font'">
          <div class="flex flex-col">
            <span class="xt-text font-16 mb-3 ">字体</span>
            <xt-option-tab :list="clockSelectList" class="xt-bg-t-2" v-model="customData.font" circle  style="height: 40px;"/>
            <!-- <xt-select :list="clockSelectList" class="xt-bg-t-2" v-model="customData.font" :zIndex="1200" style="z-index: 150 !important;"></xt-select> -->
          </div>

          <div class="my-4" >
            <div class="xt-bb mx-auto"></div>
          </div>

          <div class="clock-box no-drag rounded-lg pointer xt-bg-t-2" @click="updateClock('clock4')">
            <clock4 :clockFont="customData.font"></clock4>
          </div>
        </template>

        <template v-else>
          <div class="grow" style="height: 400px;">
            <xt-scrollbar  :y="true" style="height: 100%;">
              <ClockStyle @updateClockStyle="updateClock"/>
            </xt-scrollbar>
          </div>
        </template>
      </div>
    </div>
  </xt-modal>
</template>

<script>
import { clockTabList,clockSelectList } from '../hooks/clockList';
import ClockStyle from '../clockState/ClockStyle.vue';
import mixin from "../hooks/clockMixin.js"

export default{
  mixins: [mixin],
  components:{
    ClockStyle,
  },
  props:{
    customData:{ type:Object,default:()=>{} },
    desk:{type:Object,default:()=>{}},
    customIndex:{ type:Number,default:()=>{} },
  },
  data(){
    return{
      clockTabList:clockTabList,
      clockSelectList:clockSelectList,
      clockVisible:false,
    }
  },

  methods:{
    openClockModal(){
      this.clockVisible = true;
    },
    updateClock(e){
     this.$emit('updateClockStyle',e)
    }
  }
}

</script>

<style lang="scss" scoped>

</style>