<template>
    <div class="w-full pl-4 xt-scrollbar scroll-color " style="height: 640px;">
        <div v-if="show?.length" >
          <xt-menu 
            :menus="rightMenu" 
            @mounted="changeMenu(item, index)" 
            class="flex items-center justify-between h-16 p-4 mb-1 rounded-lg pointer font-16 xt-text list-hover tran" 
            @mouseover="read(item)" 
            style="width: 100%;" 
            @click="change(index, item)" 
            v-for="(item,index) in show" 
            :class="item.check?'xt-bg-2':''" >
            <div class='flex items-center h-full'>
              <WebItem class="" :item="item" :checkFlag="checkFlag"></WebItem>
              <!-- style="width: 530px;" -->
              <div class="flex flex-col ml-3 font-16 xt-text" style="max-width: 444px;">
                <div class="text-overflow">{{ item.rename?item.rename:item.name }}</div>
                <div class="xt-text-2 url-hover font-14 text-overflow">{{ item.url }}</div>
              </div>
            </div>
            <div v-if="item.favo" class="flex items-center justify-center w-8 h-8 ml-2 rounded-lg xt-main-bg hover-right-2">
              <xt-new-icon icon="fluent:star-16-filled" color="#faad14" size="16" />
            </div>
            <div class="flex hover-right">
              <!-- 修改 -->
              <div @click.stop="showRenameModal(item)" class="flex items-center justify-center w-8 h-8 rounded-lg xt-main-bg">
                <xt-new-icon icon="fluent:compose-16-regular" size="16" />
              </div>
              <!-- 添加 -->
              <xt-menu :menus="menus" model="click" @mounted="changeMenu(item, index)">
                <div class="flex items-center justify-center w-8 h-8 ml-2 rounded-lg xt-main-bg">
                  <xt-new-icon icon="fluent:add-16-regular" size="16" />
                </div>
              </xt-menu>
              <!-- 收藏 -->
              <div class="flex items-center justify-center w-8 h-8 ml-2 rounded-lg xt-main-bg" @click.stop="changeFavo(item)">
                <xt-new-icon v-if="item.favo" icon="fluent:star-16-filled" color="#faad14" size="16" />
                <xt-new-icon v-else icon="fluent:star-16-regular" size="16" />
              </div>
            </div>
          </xt-menu>
        </div>
        <div v-else class="flex items-center justify-center h-full">
          <div style="width: 452px;height: 200px;" class="flex flex-col items-center">
            <xt-new-icon icon="fluent-emoji-flat:globe-with-meridians" color="#faad14" size="56" />
            <div class="p-3 px-4 mt-4 xt-text font-14 xt-mask rounded-xl">暂无数据，请在你使用的浏览器中管理收藏夹，工作台会同步读取收藏夹数据。</div>
            <xt-button @click="refresh" type="theme" :radius="8" :w="72" :h="32" class="mt-4" icon="fluent:arrow-clockwise-16-regular">
                <div class="ml-2 xt-text font-14">刷新</div>
            </xt-button>
          </div>
        </div>
    </div>

</template>
  
  <script> 
  import { Icon } from '@iconify/vue';
  import { mapActions, mapState, mapWritableState } from 'pinia'
  import { favoStore } from '../../../../../apps/favorites/store'
  import WebItem from '../../../../../apps/favorites/components/WebItem.vue'
  import { message } from 'ant-design-vue';
  import browser from '../../../../../js/common/browser'
  
  
  export default {
    name: 'WebList',
    props: ['showList', 'checkFlag', 'menus', 'rightMenu'],
    data() {
      return {
        show: [],
        timer: null,
        tIndex: 0,
        n: 0,
      }
    },
    mounted(){

      
    },
    components: { 
      Icon,
      WebItem,
    },
  
    computed:{
      ...mapWritableState(favoStore, ['isFavorites', 'allList', 'browserType']),
      
    },
    watch:{
      // 优化列表加载速度
      showList:{
        handler(newVal, oldVal) {
          this.clear()
          this.show = newVal?.slice(0, 10)
          this.nIndex = 0;
          this.n = Math.ceil(newVal?.length / 10)
          this.timer = setInterval(() => {
            this.show = newVal?.slice(0, 10 * this.n)
            if(this.nIndex <= this.n){
              this.nIndex++
            }else{
              this.clear()
            }
          }, 1)
        },
        immediate:true
      },
    },
    methods: {
      // 清楚定时器
      clear(){
        clearInterval(this.timer)
        this.timer = null
      },
      // 添加到桌面
      changeMenu(item, index){
        this.$emit('changeIcon', [item])
      },
      // 改变打开网页方式
      change(n, item){
        if(this.checkFlag){
          item.check = !item.check
        }else{
          if(this.browserType == 'system'){
            browser.openInUserSelect(item.url)
          }else if(this.browserType == 'thisky'){
            browser.openInInner(item.url)
          }else if(this.browserType == 'work'){
            browser.openInTable(item.url)
          }
        }
      },
      // 修改名称
      showRenameModal(item){
        this.$emit('showRenameModal', item)
      },
      // 收藏
      changeFavo(item){
        const now = new Date().getTime()
        this.allList.forEach((i, index)=>{
          if(i.guid == item.guid){
            if (i.favo) {
              message.success('取消收藏')
            }else{
              message.success('收藏成功')
            }
            i.favo = !this.allList[index].favo
            i.favoTime = now
            this.$emit('countFavo')
          }
        })
      },
      // 刷新
      refresh(){
        this.$emit('refresh')
      },
      // 已读网址
      read(item){
        item.unRead = false
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

    .hover-right{
      display: none;
    }

    .list-hover:hover{
      // opacity: 0.8;
      // height: 80px;
      background: var(--secondary-bg);
    }

    // .url-hover{
    //   display: none;
    // }
    // .list-hover:hover .url-hover{
    //   display: block;
    // }
    .list-hover:hover .hover-right{
      display: flex;
    }
    .list-hover:hover .hover-right-2{
      display: none;
    }

    .tran{
      transition: all 0.1s;
    }

    .text-overflow{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
  </style>
  