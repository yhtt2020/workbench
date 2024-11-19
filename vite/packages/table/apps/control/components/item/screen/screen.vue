<template>
  <div class="flex items-center w-full h-full">
    <div class="tab-list">
      
      <div class="tab select" :style="{marginLeft: index>0?'8px':0}" v-for="(item, index) in screenList"
      :key="index">
        <xt-mix-menu :menus="menuList" @mounted="currentIndex = index">
          <div class="flex items-center h-full" @click="setScreen(item)" style="flex-direction: column;">
            <MyIcon icon="fluent:desktop-16-regular" width="24" height="24" color="rgba(255,255,255,0.85)" style="margin-top: 22px" />
            <span>{{ item.title }}</span>
          </div>
        </xt-mix-menu>
      </div>
      <div class="tab add"  v-if="screenList.length<3" :style="{marginLeft: screenList.length !== 0?'8px':0}" @click="add">
        <MyIcon icon="fluent:add-20-filled" width="24" height="24" color="rgba(255,255,255,0.85)" />
      </div>
    </div>

  </div>
</template>

<script>
import { screenStore } from "../../../../../store/screen";
import { mapWritableState, mapActions } from 'pinia';
import { Icon as MyIcon } from '@iconify/vue';

export default {
  components: {
    MyIcon,
  },
  data() {
    return {
      currentIndex: 0,
    }
  },
  props: {
  },
  computed: {
    ...mapWritableState(screenStore, ["screenTip", 'screenList', 'addScreen', 'renameScreen', 'renameIndex']),
    menuList(){
      return [
        {
          name: "重命名",
          newIcon: "fluent:open-16-regular",
          fn: () => {
            this.renameScreen = true
            this.renameIndex = this.currentIndex
          },
        },
        {
          name: "删除",
          newIcon: "fluent:delete-16-regular",
          fn: () => {
            window.$ui.confirm(`确定删除 ${this.screenList[this.currentIndex]?.title} 吗？`, "", {
              type: "warning",
              ok: ()=>{
                this.screenList.splice(this.currentIndex, 1)
              },
            });
          },
        },
      ]
    }
  },
  mounted() {
  },

  watch: {
  },
  methods: {
    add(){
      this.addScreen = true
    },
    close(){
      this.screenTip = false
    },
    setScreen(item){
      console.log('item', item)
      tsbApi.window.setBounds({
        x: item.position[0],
        y: item.position[1],
        width: item.width,
        height: item.height
      })

      setTimeout(()=>{
        this.screenTip = false
      },500)
    }

  },
}

</script>

<style lang="scss" scoped>
.gray{
  filter: grayscale(100%);
}
.tab-list{
    padding: 12px;
    display: flex;
    height: 100%;
    width: 100%;
    .tab{
      height: 100%;
      border-radius: 12px;
      display: flex;
      align-items: center;
      flex-direction: column;
      cursor: pointer;
      font-size: 14px;
      background: rgba(0,0,0,0.30);
      font-weight: 400;
      height: 100%;
      span{
        margin-top: 8px;
      }

    }
    .select{
      color: rgba(255,255,255,0.85);
      // width: 92px;
      flex: 1 1 0;
    }
    .add{
      color: rgba(255,255,255,0.65);
      height: 100%;
      width: 40px;
      display: flex;
      justify-content: center;
    }
  }
</style>
