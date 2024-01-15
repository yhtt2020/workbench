    <template>
        <div style="width: 800px;height: 587px;z-index: 9999999;" class="fixed xt-modal top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg" >
            <div class="flex items-center justify-center w-full h-16 font-16 xt-text">选择菜单模式</div>
            <div class="w-full flex px-6 justify-between" style="height: 451px;">
                <div v-for="(item, index) in menuList" class="span-list xt-bg-2 text-center pointer" 
                @click="rightModel = item.value" :class="rightModel == item.value?'active':''">
                    <div class="font-18 xt-text" style="font-weight: 600;margin-top: 28px;">{{ item.title }}</div>
                    <div class="font-16 xt-text-2 mt-2 mb-6">{{ item.content }}</div>
                    <a-avatar style="border-radius: 10px;" shape="square" :src="item.img" :size="320"></a-avatar>
                </div> 
            </div>
            <div class="mt-4 pr-4 flex justify-end">
                <xt-button style="width: 64px;height:40px;" class="xt-active-btn" @click="close">确定</xt-button>
            </div>
        </div>
        <!-- 全屏遮罩层 -->
        <!-- <div
        v-show="true"
        class="h-full w-full fixed top-0 left-0 ring-0 bottom-0"
        style="z-index:9999998;"
        ></div> -->
            
    </template>
    
  <script> 
  import { Icon } from '@iconify/vue';
  import { mapWritableState } from 'pinia'
  import { useWidgetStore } from '../../../components/card/store'
  
  export default {
    name: 'chooseModal',
    data() {
      return {
        menuList: [
            {
                title: '右键下拉式菜单',
                content: '使用传统的鼠标右键菜单。',
                img: '/img/flow.png',
                value: 'follow',
            },
            {
                title: '长按触控式菜单',
                content: '更适合触控的大图标菜单。',
                img: '/img/drawer.png',
                value: 'default',
            },
        ]
        
      }
    },
    async mounted(){
    },
    components: { 
      Icon,
    },
    computed:{
        ...mapWritableState(useWidgetStore, ['rightModel']),
    },
    methods: {
        close(){
            this.$emit("closeChoose");
        }
    }
  }
  </script>
  
  <style scoped lang="scss">
    .span-list{
        width: 368px;
        height: 451px;
        border-radius: 10px;
        border: 1px solid transparent;
    }

    .active{
        background: rgba(80,139,254,0.20);
        border: 1px solid rgba(80,139,254,1);
        border-radius: 10px;
    }
  </style>
  