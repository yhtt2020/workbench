<template>
    <div class="w-full pl-4 xt-scrollbar scroll-color" style="height: 640px;">
        <div class="h-14 mb-1 flex items-center p-4 pointer rounded-lg font-16 xt-text list-hover justify-between" style="width: 728px;" @click="change(index, item)" v-for="(item,index) in showList" :class="urlIndex == index?'xt-bg-2':'',item.check?'xt-bg-2':''" >
          <WebItem :item="item" :checkFlag="checkFlag"></WebItem>
          
          <div v-if="item.favo" class="xt-main-bg flex items-center justify-center h-8 w-8 rounded-lg ml-2 hover-right-2">
            <xt-new-icon icon="fluent:star-16-filled" color="#faad14" size="16" />
          </div>
          <div class="flex hover-right">
            <!-- 修改 -->
            <div @click="showRenameModal(item)" class="xt-main-bg flex items-center justify-center h-8 w-8 rounded-lg">
              <xt-new-icon icon="fluent:compose-16-regular" size="16" />
            </div>
            <!-- 添加 -->
            <xt-menu :menus="menus" model="click" @mounted="changeMenu(item, index)">
              <div class="xt-main-bg flex items-center justify-center h-8 w-8 rounded-lg ml-2">
                <xt-new-icon icon="fluent:add-16-regular" size="16" />
              </div>
            </xt-menu>
            <!-- 收藏 -->
            <div class="xt-main-bg flex items-center justify-center h-8 w-8 rounded-lg ml-2" @click="changeFavo(item)">
              <xt-new-icon v-if="item.favo" icon="fluent:star-16-filled" color="#faad14" size="16" />
              <xt-new-icon v-else icon="fluent:star-16-regular" size="16" />
            </div>
          </div>
        </div>

    </div>

</template>
  
  <script> 
  import { Icon } from '@iconify/vue';
  import { mapActions, mapState, mapWritableState } from 'pinia'
  import { favoStore } from '../store'
  import WebItem from './WebItem.vue'
  import { message } from 'ant-design-vue';
  import browser from '../../../js/common/browser'
  
  
  export default {
    name: 'WebList',
    props: ['showList', 'checkFlag', 'menus'],
    data() {
      return {
        
      }
    },
    async mounted(){

    },
    components: { 
      Icon,
      WebItem,
    },
  
    computed:{
      ...mapWritableState(favoStore, ['isFavorites', 'urlIndex', 'allList', 'browserType']),
      
    },
    methods: {
      // 添加到桌面
      changeMenu(item, index){
        this.urlIndex = index
        this.$emit('changeIcon', [item])
      },
      change(n, item){
        if(this.checkFlag){
          item.check = !item.check
        }else{
          this.urlIndex = n
          if(this.browserType == 'system'){
            browser.openInUserSelect(item.url)
          }else if(this.browserType == 'thisky'){
            browser.openInInner(item.url)
          }else if(this.browserType == 'work'){
            browser.openInTable(item.url)
          }
        }
      },
      showRenameModal(item){
        this.$emit('showRenameModal', item)
      },
      changeFavo(item){
        this.allList.forEach((i, index)=>{
          if(i.guid == item.guid){
            if (i.favo) {
              message.success('取消收藏')
            }else{
              message.success('收藏成功')
            }
            i.favo = !this.allList[index].favo
            this.$emit('countFavo')
          }
        })
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

    .hover-right{
      display: none;
    }

    .list-hover:hover{
      opacity: 0.8;
    }
    .list-hover:hover .hover-right{
      display: flex;
    }
    .list-hover:hover .hover-right-2{
      display: none;
    }
  </style>
  