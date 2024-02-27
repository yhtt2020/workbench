<template>
    <div style="width: 240px;" class="xt-main-bg pt-3">
        <!-- <div class="px-3">
            <div class="h-12 flex justify-between pointer items-center font-16 px-3 rounded-lg" @click="change(-1)" :class="folderIndex==-1?'select':''">
                <div class="flex">
                    <xt-new-icon icon="fluent:star-16-regular" size="20" />
                    <div class="ml-4 xt-text">我的收藏</div>
                </div>
                <div class="xt-text-2">12</div>
            </div>
            <div class="divider"></div>
        </div> -->
        <!-- 列表 -->
        <div class="xt-scrollbar scroll-color font-16" style="height: 580px;">
            <div v-for="(item, index) in folder" >
                <div style="width: 215px;" class="ml-3 h-12 flex mb-2 items-center px-3 w-full justify-between pointer rounded-lg" @click="change(index)"  :class="index==folderIndex?'select':''" >
    
                    <div class="flex">
                        <xt-new-icon v-if="index==0" icon="fluent:star-16-regular" size="20" />
                        <div v-else class="relative w-6 h-6" >
                            <xt-new-icon class="absolute" icon="fluent-emoji:file-folder" size="20" />
                            <img v-if="item.browser == 'chrome'" src="/img/icon/chrome.png" class="absolute right-0 w-3 bottom-0" alt="">
                            <img v-else src="/img/icon/edge.png" class="absolute right-0 w-3 bottom-0" alt="">
                        </div>
                        <div class="ml-3">{{ item?.name }}</div>
                    </div>
                    <!-- <div class="xt-text-2">{{ item.num }}</div> -->
                    <div class="xt-text-2">{{ getNum(item) }}</div>
                </div>
                <div class="px-3" v-if="index==0">
                    <div class="divider"></div>
                </div>
            </div>
        </div>
        <!-- 底部 -->
        <div class="absolute bottom-3 flex justify-between px-3" style="width:240px">
            <div class="flex">
                <div class="flex justify-center items-center  w-8 h-8 pointer border-1" :class="browserList.chrome?'border-active':border-active" @click="browserList.chrome = !browserList.chrome">
                    <a-avatar :size="26" shape="square" src="/img/icon/chrome.png" />
                </div>
                <div class="flex justify-center items-center  w-8 h-8 pointer ml-3 border-1" :class="browserList.edge?'border-active':border-active" @click="browserList.edge = !browserList.edge">
                    <a-avatar :size="26" shape="square" src="/img/icon/edge.png" />
                </div>
            </div>
            <!-- 菜单 -->
            <a-tooltip>
                <template #title>{{ refreshTime }}</template>
                <xt-button @click="fresh" :radius="8" :w="32" :h="32">
                    <xt-new-icon icon="fluent:arrow-clockwise-16-regular" size="16" />
                </xt-button>
            </a-tooltip>
        </div>
    </div>

</template>
  
  <script> 
  import { Icon } from '@iconify/vue';
  import { mapActions, mapState, mapWritableState } from 'pinia'
  import { favoStore } from '../store'
  import { formatTime, formatTimestamp } from '../../../util'
  
  
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
        ...mapWritableState(favoStore, ['isFavorites', 'allList', 'folderList', 'folderIndex', 'browserList', 'updateTime']),
        folder(){
            // return this.folderList
            let arr = this.folderList.filter(item=>{
                return this.browserList[item.browser]
            })
            arr.unshift(this.folderList[0])
            return arr
        },
        refreshTime(){
            let time = formatTime(this.updateTime)
            if(time && this.updateTime){
                return '上次更新时间：' + time
            }else{
                return '暂无数据更新'
            }
        }
    },
    methods: {
        change(n){
            this.$emit('changeFolder', n)
        },
        fresh(){
            this.$emit('refresh')
        },
        getNum(i){
            if(i){
                let num = 0;
                if(i.type == 'folder'){
                    this.allList.forEach(item => {
                        if(item.parent == i.guid) num++
                    });
                }else if(i.type == 'favo'){
                    this.allList.forEach(item => {
                        if(item.favo) num++
                    });
                }else if(i.type == 'all'){
                    this.allList.forEach(item => {
                        if(item.browser == i.browser) num++ 
                    });
                }
                return num
            }else{
                return 0
            }
        },
      
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

    .border-1{
        border: 1px solid transparent;
        border-radius: 6px;
    }

    .border-active{
        border: 1px solid #508bfe;
    }
  </style>
  