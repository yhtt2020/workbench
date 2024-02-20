<template>
    <div style="width: 240px;" class="xt-main-bg pt-3">
        <div class="px-3">
            <div class="h-12 flex justify-between pointer items-center font-16 px-3 rounded-lg" @click="change(-1)" :class="folderIndex==-1?'select':''">
                <div class="flex">
                    <xt-new-icon icon="fluent:star-16-regular" size="20" />
                    <div class="ml-4 xt-text">我的收藏</div>
                </div>
                <div class="xt-text-2">12</div>
            </div>
            <div class="divider"></div>
        </div>
        <!-- 列表 -->
        <div class="xt-scrollbar scroll-color font-16" style="height: 580px;">
            <div style="width: 215px;" class="ml-3 h-12 flex mb-2 items-center px-3 w-full justify-between pointer rounded-lg" @click="change(index)"  v-for="(item, index) in folderList" :class="index==folderIndex?'select':''" > 
                <div class="flex">
                    <div class="relative w-6 h-6" >
                        <xt-new-icon class="absolute" icon="fluent-emoji:file-folder" size="20" />
                        <img v-if="item.browser == 'chrome'" src="/img/icon/chrome.png" class="absolute right-0 w-3 bottom-0" alt="">
                        <img v-else src="/img/icon/edge.png" class="absolute right-0 w-3 bottom-0" alt="">
                    </div>
                    <div class="ml-3">{{ item.name }}</div>
                </div>
                <div class="xt-text-2">{{ item.num }}</div>
            </div>
        </div>
        <!-- 底部 -->
        <div class="absolute bottom-3">
            <a-avatar :size="28" shape="square" src="/img/icon/chrome.png" />
            <a-avatar :size="28" shape="square" src="/img/icon/edge.png" />
        </div>
    </div>

</template>
  
  <script> 
  import { Icon } from '@iconify/vue';
  import { mapActions, mapState, mapWritableState } from 'pinia'
  import { favoStore } from '../store'
  
  
  export default {
    name: 'LeftMenu',
    props: ['changeFolder'],
    data() {
      return {
        
      }
    },
    async mounted(){

    },
    components: { 
      Icon,
    },
  
    computed:{
        ...mapWritableState(favoStore, ['isFavorites', 'allList', 'folderList', 'folderIndex']),
    },
    methods: {
        change(n){
            this.$emit('changeFolder', n)
        }
      
    }
  }
  </script>
  
  <style scoped lang="scss">
    .divider{
        width: 100%;
        height: 1px;
        background-color: var(--divider);
        margin-top: 8px;
        margin-bottom: 8px;
    }
    .scroll-color::-webkit-scrollbar-thumb {
        background-color: #ccc; /* 滚动条颜色 */
        border-radius: 6px; /* 滚动条圆角 */
    }

    .scroll-color::-webkit-scrollbar-thumb:hover {
        background-color: #999; /* 悬停时滚动条颜色 */
    }

    .scroll-color::-webkit-scrollbar-track {
        border-radius: 6px; /* 轨道圆角 */
    }

    .select{
        background: rgba(80,139,254,0.20);
    }
  </style>
  