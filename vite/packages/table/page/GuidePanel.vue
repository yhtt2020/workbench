<template>
  <!-- 确认框 -->
  <div class="fixed modal-float xt-modal rounded-lg" style="">
    <div class="h-full w-full flex flex-col">
      <div class="w-full flex items-center" style="height:56px;">
        <Icon class="ml-5" icon="fluent-emoji:glowing-star" width="24" height="24" />
        <div class="font-16 xt-text ml-4">定制你的专属桌面</div>
      </div>
      <div style="margin-left: 60px;" class="pr-6 font-16 xt-text-2">简单几步，轻松整理你的桌面，为你添加合适的组件和图标。</div>
      <div class="text-center font-16 xt-text-2 mt-3 mb-2">完成奖励</div>
      <ShowReward id="Z0201" />
      <div class="flex justify-end mt-4 mb-1">
        <xt-button   class="button-bottom mr-3" @click="close"   size="large" >稍后再说</xt-button>
        <xt-button   class="button-bottom mr-4" @click="startGuide"   size="large" type="theme">开始定制</xt-button>
      </div>
    </div>
  </div>
</template>

<script> 
import { Icon } from '@iconify/vue';
import { mapWritableState } from 'pinia'
import {cardStore} from "../store/card";
import {nanoid} from "nanoid";
import { homeStore } from "../store/home";
import ShowReward from '../apps/task/components/ShowReward.vue'
export default {
  name: 'GuidePanel',
  data() {
    return {
      currentWidth: '-',
      currentHeight: '-',
      
    }
  },
  async mounted(){
  },
  components: { 
    Icon,ShowReward
  },

  computed:{
    ...mapWritableState(cardStore,['desks']),
    ...mapWritableState(homeStore, ["currentDeskId", "currentDeskIndex", 'currentInit']),
  },
  methods: {
    startGuide() {
      const deskId = nanoid(4)
      let desk = {
        name: '定制桌面',
        id: deskId,
        icon: "desktop",
        cards: [],
      };
      this.desks.unshift(desk);
      this.changeDesk(desk)
      this.close()
      this.$emit('addGuide', deskId)

    },

    
    close(){
      this.$emit('closeGuide')
    },

    
    changeDesk(p) {
      this.currentDeskId = p.id;
      let found = this.desks.find((desk) => {
        return desk.id === p.id;
      });
      if (found) {
        this.currentDeskIndex = {
          id: found.id,
          title: found.name,
        };
      }
    },
    
  }
}
</script>

<style scoped lang="scss">
  .modal-float{
    width: 400px;
    height: 294px;
    // background:red;
    z-index: 1001;
    top: 59px;
    right: 12px;
    border: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0px 0px 3px 0px rgba(0,0,0,0.03);
    box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.1);
    box-shadow: 0px 0px 40px 0px rgba(0,0,0,0.2);
  }

  .icon-dismiss{
    height: 21px;
    width: 21px;
    border-radius: 50%;
    background-color: var(--secondary-text);
  }

  .icon-show{
    background: #508BFE;
    box-shadow: -2px 2px 5px 0px rgba(0,0,0,0.23);
    border-radius: 0px 10px 0px 10px;
    position: absolute;
    right: 0;
    top: 0;
    font-size: 12px;
    color: rgba(255,255,255,0.85);
    font-weight: 500;
    width: 32px;
    height: 20px;
    text-align: center;
  }

  .num-bottom{
    position: absolute;
    font-size: 12px;
    color: rgba(255,255,255,0.85);
    text-align: right;
    font-weight: 500;
    right: 6px;
    bottom: 2px;
  }

  .button-bottom{
    width:95px !important;
    height: 40px !important;
  }
</style>
