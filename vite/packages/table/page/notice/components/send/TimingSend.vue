<template>
 <xt-modal v-model="timeVisible" title="选择发布时间" :boxClass="'px-6 py-4'">
  <div class="flex flex-col" style="width: 500px;">
   <span class="mb-6">发送时间</span>
   <a-date-picker :show-time="{ format: 'HH:mm' }" v-model:value="currentTime" :format="dateFormat" class="xt-bg-2" style="border-radius: 8px;"/>

   <span class="my-6">消息有效期至</span>
   <a-date-picker :show-time="{ format: 'HH:mm' }" v-model:value="cutOffDate" :format="dateFormat" class="xt-bg-2" style="border-radius: 8px;"/>
   
   <div class="flex justify-end items-center mt-6">
    <xt-button w="64" h="40"  class="mr-3" @click="timeVisible = false">取消</xt-button>
    <xt-button w="64" h="40" type="theme" @click="saveTime">确定</xt-button>
   </div>
  </div>
 </xt-modal>
</template>

<script setup>
import dayjs, { Dayjs } from 'dayjs';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { noticeStore } from '../../store/noticeStore';

const notice = noticeStore()
const { msgSetting } = storeToRefs(notice);

const timeVisible = ref(false);
const dateFormat = ref('YYYY-MM-DD HH:mm');
const currentTime = ref(dayjs(`${new Date().toLocaleDateString()} ${new Date().toTimeString()}`,dateFormat))

// 截止日期
const cutOffDate = ref(dayjs(`${new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()} ${new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toTimeString()}`),dateFormat)

const openTimeModal = () =>{
  timeVisible.value  = true
}

// 发布时间保存
const saveTime = () =>{
  // 当前发布时间
  const currentTimeValue = new Date(currentTime.value.$d);
  // const changeCurrentTime = new Date(currentTimeValue.getTime() - (currentTimeValue.getTimezoneOffset() * 60000));
  
  // 发布后截止时间
  const postReleaseTime = new Date(cutOffDate.value.$d);
  // const changePostReleaseTime = new Date(postReleaseTime.getTime() - (postReleaseTime.getTimezoneOffset() * 60000))
  
  const time = {
    startTime:currentTimeValue.getTime(),
    endTime:postReleaseTime.getTime()
  }

  // const time = {
  //   startTime:changeCurrentTime.toISOString().slice(0, 19).replace("T", " "),
  //   endTime:changePostReleaseTime.toISOString().slice(0, 19).replace("T", " ")
  // }
  msgSetting.value.sendTime = time.startTime;
  timeVisible.value = false;
}

defineExpose({
 openTimeModal
})

</script>

<style lang="scss" scoped>

</style>