<template>
  <!-- 确认框 -->

  <div class="fixed modal-float xt-modal rounded-lg px-4" style="">
    <div class="h-full w-full flex items-center justify-center">

      <xt-button type="theme" @click="startGuide" size="large"  class="">开始定制</xt-button>
    </div>


  </div>

</template>

<script> 
import { Icon } from '@iconify/vue';
import { mapWritableState } from 'pinia'
import {cardStore} from "../store/card";
import {nanoid} from "nanoid";
import { homeStore } from "../store/home";

export default {
  name: 'GuidePanel',
  data() {
    return {
      currentWidth: '-',
      currentHeight: '-',
      
    }
  },
  async mounted(){
    // this.newZoom = await tsbApi.window.getZoomFactor() * 100
    // this.oldZoom = this.newZoom
    // this.inputZoom = +(this.newZoom).toFixed(0)
    // this.getSize()
    // this.scaleInit = true
  },
  components: { 
    Icon,
  },
  // props: ['deskList'],
  computed:{
    ...mapWritableState(cardStore,['desks']),
    ...mapWritableState(homeStore, ["currentDeskId", "currentDeskIndex", 'currentInit']),
  },
  methods: {

    startGuide() {
      console.log('this',this);
      let desk = {
        name: '定制桌面',
        id: nanoid(4),
        icon: "desktop",
        cards: [],
        // cards: this.cleanMuuriData(deskTemplates[this.selectDesk.name]),
      };
      this.desks.unshift(desk);
      this.changeDesk(desk)
      this.close()

    },

    
    close(){
      this.visibleScale = false
      this.$emit('closeScale')
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
    width: 480px;
    height: 220px;
    // background:red;
    z-index: 1001;
    top: 560px;
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
</style>
