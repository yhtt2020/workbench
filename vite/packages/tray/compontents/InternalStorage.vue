<template>
  <div class="main" >
    <div class="title flex justify-start align-center">
      <span class="text-title" style="margin-left: 10px">内存 ： xx</span>
    </div>
    <div class="content-small flex flex-direction">
      <div class="flex justify-between" style="width: 80%;margin-left: 15px;margin-top: 5px">
        <span class="text-content-w">占用: xxGB</span>
        <span class="text-content-w">剩余: xxGB</span>
      </div>
      <div style="width: 80%;margin-left: 15px">
        <a-progress strokeColor="#f59923" trailColor="#4d4d4d" :percent="30" :showInfo="false" />
      </div>
      <span class="text-content-b" style="margin-left: 15px">共打开：xx 网页 xx 应用</span>
      <span style="font-size: 14px;margin-left: 140px;color: #d9d9d9">释放</span>
    </div>
  </div>
</template>

<script>

</script>

<style>

</style>
