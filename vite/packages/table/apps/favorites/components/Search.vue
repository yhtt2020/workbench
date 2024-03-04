<template>
    <div class="w-full">
        <div class="h-16 flex items-center justify-between px-4">
            <!-- 搜索 -->
            <a-input
            class="h-8 xt-mask xt-text"
            style="width:215px;;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 10px;"
            placeholder="搜索"
            :maxlength="10"
            allow-clear
            v-model:value="searchValue"
            @change="changeSearchValue">
                <xt-new-icon class="absolute" icon="fluent:search-20-filled" size="20" />
            </a-input>
            <!-- <div @click="test">测试</div> -->
            <div class="font-14 flex items-center">
                <div>打开方式：</div> 
                <!-- <xt-select
                v-model="test" h="32"
                style="width: 142px;height: 32px;"
                :list="linkType"
                @cb="updateAlign"/> -->

                <!-- <xt-select v-model="browserType" :zIndex="1200" style="width: 160px;" :h="32" :list="linkType" :bordered="false"></xt-select> -->
                <a-select
                    v-model:value="browserType"
                    class="rounded-lg xt-bg"
                    style="width: 142px;"
                    placeholder="Tags Mode"
                    :options="linkType"
                ></a-select>


                <div class="xt-bg-2 h-8 w-8 flex justify-center items-center rounded-lg ml-3 pointer" @click="isFavorites = false">
                    <xt-new-icon icon="fluent:dismiss-16-regular" size="16" />
                </div>
                
            </div>
        </div>

    </div>

</template>
  
  <script> 
  import { Icon } from '@iconify/vue';
  import { mapActions, mapState, mapWritableState } from 'pinia'
  import { favoStore } from '../store'
  
  export default {
    name: 'Search',
    data() {
      return {
        linkType:[  
            { label: '系统默认浏览器', value: 'system' },
            { label: '想天浏览器', value: 'thisky' },
            { label: '工作台内打开', value: 'work' },
        ],
        folderIndex: -2,

        
      }
    },
    async mounted(){

    },
    components: { 
      Icon,
    },
  
    computed:{
    ...mapWritableState(favoStore, ['isFavorites', 'searchValue', 'browserType']),
    },
    methods: {
        change(n){
            this.folderIndex = n
        },
        test(){
            this.$router.push("/wizard");
        }
      
    }
  }
  </script>
  
  <style scoped lang="scss">

    :deep(.ant-select-selector){
        border-radius: 8px !important;
    }
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
  