<template>
    <div class="w-full pl-4 xt-scrollbar scroll-color" style="height: 640px;">
        <div class="h-14 mb-1 flex items-center p-4 pointer rounded-lg font-16 xt-text list-hover justify-between" style="width: 728px;" @click="change(index, item.url)" v-for="(item,index) in showList" :class="urlIndex == index?'xt-bg-2':''" >
          <!-- <a-avatar :size="24" shape="square" :src="getIcon(item.url)" />
          <div class="ml-4">{{ item.name }}</div> -->
          <WebItem :item="item"></WebItem>
          <div class="flex hover-right">
            <div class="xt-main-bg flex items-center justify-center h-8 w-8 rounded-lg">
              <xt-new-icon icon="fluent:compose-16-regular" size="16" />
            </div>
            <div class="xt-main-bg flex items-center justify-center h-8 w-8 rounded-lg ml-2">
              <xt-new-icon icon="fluent:add-16-regular" size="16" />
            </div>
            <div class="xt-main-bg flex items-center justify-center h-8 w-8 rounded-lg ml-2">
              <xt-new-icon icon="fluent:star-16-regular" size="16" />
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
  
  
  export default {
    name: 'WebList',
    props: ['showList'],
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
      ...mapWritableState(favoStore, ['isFavorites', 'urlIndex']),
      
    },
    methods: {
        change(n, url){
          // browser.openInUserSelect(url)
          this.urlIndex = n
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
  </style>
  