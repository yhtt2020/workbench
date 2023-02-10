<template>
  <a-row  class="top-panel drag" type="flex" :gutter="10">
    <a-col :span="8" class="no-drag">
      <Icon icon="#icon-xiaoxi"></Icon>
      李想：来一下我办公室。 6分钟前
    </a-col>
    <a-col class="no-drag" :span="8" style="text-align: center">
      <div class="input-box">
        <Icon icon="#icon-sousuo"></Icon> 搜索 网页内容、标签
        <span style="float:right;padding-right: 10px">
          <span style="margin-right: 3px" class="key-button">Alt</span><span  class="key-button">F</span>
        </span>
      </div>
    </a-col>
    <a-col class="no-drag" :span="8" style="text-align: right">
      2023/2/10 12:56 周四 晴 9℃
    </a-col>
  </a-row>
</template>

<script>
export default {
  name: 'TopPanel'
}
</script>

<style scoped>
.top-panel{
  padding:.8em;

}
.input-box{
  height: 2em;
  border-radius: 100px;
  border: 1px solid #c4c4c4;
}
</style>
