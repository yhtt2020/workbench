<template>
  <div class="main" >
    <div class="title flex justify-start align-center">
      <span class="text-title" style="margin-left: 10px">缓存 ： xx 限制</span>
    </div>
    <div class="content-small flex flex-direction">
      <div class="flex justify-between" style="width: 80%;margin-left: 15px;margin-top: 5px">
        <span class="text-content-w">占用: xxGB</span>
        <span class="text-content-w">可用: xxGB</span>
      </div>
      <div style="width: 80%;margin-left: 15px">
        <a-progress strokeColor="#da1f1d" trailColor="#4d4d4d" :percent="30" :showInfo="false" />
      </div>
    </div>
  </div>
</template>

<script>

</script>

<style>

</style>
