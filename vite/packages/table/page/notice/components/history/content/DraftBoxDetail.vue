<template>
 <div class="flex flex-col flex-1 h-4/5 mt-5">
  <XtScrollbar  :y="true" style="height: 100%;width: 100%;"> 
    <template v-if="draftBox.length  === 0">
      <div class="flex items-center h-full justify-center">
        暂无消息草稿
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

<script setup>
import { ref,getCurrentInstance } from 'vue';
import { storeToRefs } from 'pinia';
import { noticeStore } from '../../../store/noticeStore';


const notice = noticeStore();
const { draftBox } = storeToRefs(notice);

const { proxy } = getCurrentInstance();

const emit = defineEmits(['updateTab'])

// 删除草稿箱
const deleteDraftBox = (item) =>{
  proxy.$xtConfirm('确定删除吗？','',{
    type: "warning",
    ok:()=>{
      draftBox.value.splice(item,1)
    },
  })
}

// 编辑草稿箱
const editDraftBox = (item) =>{
 emit('')
}



</script>

<style lang="scss" scoped>

</style>