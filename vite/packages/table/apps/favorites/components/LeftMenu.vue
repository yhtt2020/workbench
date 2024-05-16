<template>
    <div style="width: 240px;" class="pt-3 xt-main-bg">
        <!-- <div class="px-3">
            <div class="flex items-center justify-between h-12 px-3 rounded-lg pointer font-16" @click="change(-1)" :class="folderIndex==-1?'select':''">
                <div class="flex">
                    <xt-new-icon icon="fluent:star-16-regular" size="20" />
                    <div class="ml-4 xt-text">我的收藏</div>
                </div>
                <div class="xt-text-2">12</div>
            </div>
            <div class="divider"></div>
        </div> -->
        <!-- 列表 -->
        <div class="xt-scrollbar scroll-color font-16" :style="{height:maxHeight}">
            <div v-for="(item, index) in folder" >
                <div style="width: 215px;" class="relative flex items-center justify-between w-full h-12 px-3 mb-2 ml-3 rounded-lg pointer" @click="change(index)"  :class="index==folderIndex?'select':''" >
    
                    <div class="flex">
                        <xt-new-icon v-if="index==0" icon="fluent:star-16-regular" size="20" />
                        <div v-else class="relative w-6 h-6" >
                            <xt-new-icon class="absolute" icon="fluent-emoji:file-folder" size="20" />
                            <img v-if="item.browser == 'chrome'" src="/img/icon/chrome.png" class="absolute bottom-0 right-0 w-3" alt="">
                            <img v-else src="/img/icon/edge.png" class="absolute bottom-0 right-0 w-3" alt="">
                        </div>
                        <div class="ml-3 text-overflow" style="max-width: 130px;">{{ item?.name }}</div>
                    </div>
                    <div class="xt-text-2">{{ getNum(item) }}</div>
                    <i v-if="item?.unRead" class="absolute w-3 h-3 rounded-full right-1 top-1" style="border: 2px solid var(--secondary-text);background: red;"></i>
                </div>
                <div class="px-3" v-if="index==0">
                    <div class="divider"></div>
                </div>
            </div>
        </div>
        <!-- 底部 -->
        <div class="absolute flex justify-between px-3 bottom-3" style="width:240px">
            <div class="flex">
                <div class="flex items-center justify-center w-8 h-8 pointer border-1" :class="browserList.chrome?'border-active':border-active" @click="browserList.chrome = !browserList.chrome">
                    <a-avatar :size="26" shape="square" src="/img/icon/chrome.png" />
                </div>
                <div class="flex items-center justify-center w-8 h-8 ml-3 pointer border-1" :class="browserList.edge?'border-active':border-active" @click="browserList.edge = !browserList.edge">
                    <a-avatar :size="26" shape="square" src="/img/icon/edge.png" />
                </div>
            </div>
            <!-- 菜单 -->
            <a-tooltip>
                <template #title>{{ refreshTime }}</template>
                <xt-button @click="fresh" :radius="8" :w="32" :h="32">
                    <xt-new-icon class="rotate-button" ref="rotate" icon="fluent:arrow-clockwise-16-regular" size="16"  />
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
    props: ['changeFolder','isNav'],
    data() {
      return {
        rotation: 0,
        folderTmp: [],
      }
    },
    async mounted(){

    },
    components: { 
      Icon,
    },
    watch:{
      
        folderIndex:{
        handler(newVal, oldVal) {
            // 清除未读消息的小红点
            // this.folderList[oldVal].unRead = false
            if(this.folderTmp[newVal]) this.folderTmp[newVal].unRead = false
            // if(this.folderList[oldVal]) this.folderTmp[oldVal].unRead = false
            // console.log('oldVal', oldVal, this.folderList[oldVal])
            // this.folderIndex[oldVal]
        },
        immediate:true
      },
    },
    computed:{
        ...mapWritableState(favoStore, ['isFavorites', 'allList', 'folderList', 'folderIndex', 'browserList', 'updateTime']),
        folder(){
            // return this.folderList
            let arr = this.folderList.filter(item=>{
                return this.browserList[item.browser]
            })
            arr.unshift(this.folderList[0])
            this.folderTmp = arr
            return arr
        },
        refreshTime(){
            let time = formatTime(this.updateTime)
            if(time && this.updateTime){
                return '上次更新时间：' + time
            }else{
                return '暂无数据更新'
            }
        },
        // 最大高度，兼容添加图标
        maxHeight(){
            if(this.isNav){
                return '585px'
            } 
            return '650px'
        }
    },
    methods: {
        change(n){
            this.$emit('changeFolder', n)
        },
        fresh(){
            this.rotation += 360;
            this.$emit('refresh')
            document.querySelector('.rotate-button').style.transform = `rotate(${this.rotation}deg)`
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
                }else if(i.type == 'recent'){
                    this.allList.forEach(item => {
                        if(item.browser == i.browser && item.recent) num++ 
                    });
                }
                return num
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

    .text-overflow{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .loading{
        transition: all 1s rotate infinite;
    }

    // @keyframes rotate {
    //     0% {
    //         transform: rotate(0deg);
    //     }
    //     100% {
    //         transform: rotate(360deg);
    //     }
    // }

    .rotate-button {
        color: white;
        font-size: 16px;
        text-align: center;
        line-height: 100px;
        cursor: pointer;
        transition: transform 0.5s;
    }
  </style>
  