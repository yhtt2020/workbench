<template>
  <div class="flex flex-col flex-1 h-4/5 mt-5">
    <XtScrollbar  :y="true" style="height: 100%;width: 100%;"> 
      <template v-if="draftBox.length  === 0">
        <div class="flex items-center h-full justify-center">
          <a-empty :image="simpleImage" :description="'暂无草稿消息'" />
        </div>
      </template>
      <template v-else>
        <div v-for="(item,index) in draftBox" class="xt-bg-2 flex justify-between items-center mb-3 rounded-xl px-4 py-3">
          <div class="xt-font xt-text font-14 font-400">{{ item.title }}</div>
          <div class="flex">
            <xt-button style="width: auto !important;" h="0" class="mr-4" @click="editDraftBox(item)">
              <div class="flex items-center justify-center xt-theme-text">编辑</div>
            </xt-button>
            <xt-button style="width: auto !important;" h="0" @click="deleteDraftBox(index)">
              <div class="flex items-center justify-center xt-theme-text">删除</div>
            </xt-button>
          </div>
        </div>
      </template>
    </XtScrollbar>
  </div>
</template>

<script>
import { mapWritableState } from 'pinia';
import { noticeStore } from '../../../store/noticeStore';
export default {
  name:'DraftBoxDetail',

  data(){
    return{
      simpleImage:'/img/state/null.png',
    }
  },

  computed:{
    ...mapWritableState(noticeStore,['draftBox']),
  },

  methods:{
    // 编辑草稿箱
    editDraftBox(item){
      this.$emit('edit',item);
    },

    // 删除草稿箱
    deleteDraftBox(item){
      window.$ui.confirm('确定删除吗？','',{
       type: "warning",
       ok:()=>{
        this.draftBox.splice(item,1)
       },
       noText: null,
      })
    },
  },
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


<!--

<script setup>
const notice = noticeStore();
const { draftBox } = storeToRefs(notice);

const simpleImage = ref()

const { proxy } = getCurrentInstance();

const emit = defineEmits(['edit'])

// 删除草稿箱
const deleteDraftBox = (item) =>{
  
}


 -->