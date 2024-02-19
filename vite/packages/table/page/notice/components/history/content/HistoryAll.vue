<template>
  <div class="flex flex-col flex-1 mt-5" style="height: calc(100% - 160px);">
    <template v-if="allList.length == 0">
      <div class="flex items-center h-full justify-center">
        <a-empty :image="simpleImage" :description="'暂无历史消息'" />
      </div>
    </template>
  
    <XtScrollbar  :y="true" style="height: 100%;width: 100%;" v-else>
      <div v-for="item in allList" class="xt-bg-2 pointer items-center mb-3 rounded-xl px-4 py-3">
        <xt-menu name="name" :menus="menus" @contextmenu="revID = item">
          <div class="flex justify-between pointer " @click="enterDetail(item)">
            <div class="flex items-center ">
              <span class="xt-font xt-text font-14 font-400 mr-3">
                ID:{{ item.content.id }}
              </span>
              <span class="xt-font xt-text font-14 font-400">
                {{ item.content.title }}
              </span>
            </div>
            <span class="xt-font xt-text-2 font-14 font-400">{{ getChangeTime(item) }}</span>
          </div>
        </xt-menu>
      </div>
    </XtScrollbar>
   </div>
</template>

<script>
import { mapActions,mapWritableState } from 'pinia';
import utils from '../../../libs/utils';
import { noticeStore } from '../../../store/noticeStore';

export default {
  name:'HistoryAll',

  data(){
    return{
      revID:'',
      menus:[
        {
          name: "删除消息",
          callBack:()=>{
            window.$ui.confirm('确定删除历史消息','',{
              type: "warning",
              ok:()=>{
                this.removePushMsg(this.revID);
              },
              noText: null,
            })
          },
          newIcon: "akar-icons:trash-can",
        }
      ],
      simpleImage:'/img/state/null.png',
    }
  },

  computed:{
    ...mapWritableState(noticeStore,['detailList','detailItem']),
    allList(){
      const filterList = this.detailList.filter((item)=>{ return item.type === 'push'  });
      const list = [];
      for(const item of filterList){
       const index = list.findIndex((itemIndex)=>{ return String(itemIndex.content.id) === String(item.content.id) });
       if(index === -1){ list.push(item) }
      }
      return list;
    },
  },

  methods:{
    ...mapActions(noticeStore,['removePushMsg']),
    enterDetail(value){
      this.detailItem = value;
      this.$emit('enter');
    },

    getChangeTime(item){
      return utils.changeTime(item.createTime);
    }
  }

};
</script>

<style lang="scss" scoped>
:deep(.ant-empty){
  margin: 0 !important;
  display: flex;
  align-items: center;
  justify-items: center;
  flex-direction: column;
  & .ant-empty-image{
    width: 64px !important;
    height: 64px !important;
  }

  & .ant-empty-description{
    margin: 0 !important;
  }
}
</style>
