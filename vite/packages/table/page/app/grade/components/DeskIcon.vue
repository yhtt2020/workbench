  <template>
<div class="pt-6 text-center font-16 xt-text">整理你的桌面图标</div>
    <div class="text-center font-16 xt-text-2" style="width:704px;margin:16px auto 0;">我们帮你整理了桌面图标，后续你也可以随时将需要快速访问的程序或文件拖放到工作台桌面和导航栏。</div>
    <div @click="test">1111111</div>
    <div class="flex flex-wrap mt-4 overflow-hidden overflow-y-auto xt-scrollbar" style="height: 420px;padding-left:19px;">
        <div v-for="(item, index) in appList" :key="index" class="span-list xt-bg-2 "
        :class="index>2?'mt-3':'',index%3!=0?'ml-3':''">
            <a-spin :spinning="loading">
            <!-- 标题 -->
            <div class="pt-2 h-8 px-3 leading-8 xt-text-2 font-14">{{ item.name }} ( {{ item.list?.length }} )
                <div class="flex items-center float-right">
                <Icon class="pointer" @click="item.type = 'rows'" v-if="item.type == 'columns'" icon="fluent:apps-list-detail-24-regular" width="20" height="20" />
                <Icon class="pointer" @click="item.type = 'columns'" v-else icon="fluent:grid-20-regular" width="20" height="20" />
                <div class="flex items-center justify-center w-8 h-8 ml-2 rounded-lg xt-bg">
                    <a-checkbox :disabled="!item.list.length" v-model:checked="item.isCheck"></a-checkbox>
                </div>
                </div>
            </div>
            <!-- 列展示 -->
            <div v-if="item.type == 'columns'" class="w-full px-1 mt-1 overflow-hidden overflow-y-auto xt-scrollbar" style="height:200px;">
                <div v-for="app in item.list" class="flex items-center px-2 list-rows xt-text" >
                <a-avatar shape="square" :size="32" :src="app.type=='img'?app.path:app.icon" class="flex-none"></a-avatar>
                <div class="ml-3 text-hidden font-12">{{ app.name }}</div>
                </div>
            </div>
            <!-- 行展示 -->
            <div v-else class="w-full flex flex-wrap px-2 mt-3 overflow-hidden overflow-y-auto xt-scrollbar justify-space" style="height:194px;">
                <div v-for="(app, key) in item.list" class="flex flex-col items-center text-center list-columns xt-text pt-1"
                :class="key%3!=0?'ml-1':'', key>2?'mt-1':''">
                <a-avatar shape="square" :size="40" :src="app.type=='img'?app.path:app.icon" class="flex-none "></a-avatar>
                <div style="width:60px;" class="mt-1 text-hidden font-12">{{ app.name }}</div>
                </div>
            </div>
            </a-spin>
        </div>
    </div>
  </template>
  
  <script> 
  import { Icon } from '@iconify/vue';
  
  export default {
    name: 'DeskIcon',
    props: ['appList', 'loading'],
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
    },
    methods: {
        test(){
            await tsbApi.system.getBrowserBookmark(
                ['edge','chrome'],
                (data)=>{
                    console.log('data11',data)
                }
            )
        },
      
    }
  }
  </script>
  
  <style scoped lang="scss">
    // 滚动条配置
    ::-webkit-scrollbar-thumb {
    background-color: #ccc;
    /* 滚动条颜色 */
    border-radius: 6px;
    /* 滚动条圆角 */
    }

    ::-webkit-scrollbar-thumb:hover {
    background-color: #999;
    /* 悬停时滚动条颜色 */
    }

    ::-webkit-scrollbar-track {
    border-radius: 6px;
    /* 轨道圆角 */
    }
    .span-list{
        width: 245px;
        height: 240px;
        border-radius: 10px;
    }

    .list-rows{
        height: 44px;
    }
    .list-rows:not(:nth-last-of-type()){
        margin-bottom: 4px;
    }

    .list-columns{
        height: 72px;
        width: 72px;
    }
    .list-rows:not(:nth-last-of-type()){
        margin-bottom: 2px;
    }

    .text-hidden{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  </style>
  