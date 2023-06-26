<script lang="ts">
import {mapActions, mapWritableState} from "pinia";
import {browserStore} from "../../../store/browser";
import BackBtn from "../../../components/comp/BackBtn.vue";
import Template from "../../../../user/pages/Template.vue";
import {nanoid} from "nanoid";

export default {
  components: {Template, BackBtn},
  computed: {
    ...mapWritableState(browserStore, ['runningTabs','currentTab'])
  },
  methods: {
    ...mapActions(browserStore, ['updateAllCapture']),
    switchToTab(tab){
      this.currentTab=tab
      this.$router.push({
        name:'browser',
        params:{
          id:tab.id
        }
      })
    },
    closeTab(id){
      ipc.send('closeTableTab',{tab:{id}})
      let index=this.runningTabs.findIndex(tab=>{
        return tab.id===id
      })
      this.runningTabs.splice(index,1)
      if(this.runningTabs.length===0){
        this.currentTab={}
      }else{
        if(index-1>0){
          this.currentTab=this.runningTabs[index-1]
        }else{
          this.currentTab=this.runningTabs[index]
        }
      }
    },
    closeAllTab(){
      this.runningTabs.forEach((tab)=>{
        ipc.send('closeTableTab',{tab:{id:tab.id}})
      })

      this.runningTabs=[]
      this.currentTab= {}

    }
  },
  mounted() {
    //更新全部的截图
    this.updateAllCapture()
  }
}
</script>

<template>
  <back-btn></back-btn>
  <div style="position: relative;clear: both">
      <div style="display: inline-block;position: relative;float: right">
        <div @click.stop="closeAllTab()" class="close-btn big">
        <icon icon="guanbi1"></icon>
      </div>
      </div>

  </div>
  <div class="ml-20 mt-2">
    <template v-for="tab in runningTabs">

      <div @click="switchToTab(tab)" v-if="tab.url" class="s-bg p-2 rounded-md m-1 pointer" style="display: inline-block;vertical-align: top;width: 220px;">
        <div >
          <a-image  @click.stop class="mb-1 rounded-md" :width="200" :height="140" style="width: 200px;height:140px;object-fit: cover"
                   :src="'file://'+tab.capture">
          </a-image>
          <div @click.stop="closeTab(tab.id)" class="close-btn">
            <icon icon="guanbi1"></icon>
          </div>

        </div>

        <a-tooltip :title=" tab.url.toLowerCase() ">
          <div class="mt-2 ml-1 truncate">
            <a-avatar shape="square" style="vertical-align: text-top" :size="18" :src="tab.favicons[0]" v-if="tab.favicons">
            </a-avatar>
            {{ tab.title ||'新标签页'}}
          </div>
        </a-tooltip>
      </div>

    </template>
  </div>
</template>

<style scoped lang="scss">
.close-btn{
  position: absolute;
  right: 0;
  top: 0;
  padding:5px;
  border-radius: 4px;
  width: 40px;
  height: 40px;
  text-align: center;
  margin: 3px;
  font-size: 19px;
  cursor: pointer;
  &:hover{
    opacity: 0.8;
  }
}
.big{
  position:relative;
  background: rgba(234, 72, 72, 0.8);
  color: white;
}
</style>
