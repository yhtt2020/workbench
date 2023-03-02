<template>
  <div class="line-title">
    网络资源
  </div>
 <div class="line">导入网络资源</div>
<div class="line">
  <a-input-group compact>


  <a-input style="width: calc(100% - 80px)" placeholder="资源地址：图片、视频">

  </a-input>
  <a-button type="primary">导入</a-button>
  </a-input-group>
</div>
  <a-divider></a-divider>
  <div class="line-title">本地资源</div>
  <div class="line" style="text-align: center">
      <a-button type="primary">选择文件导入</a-button>
  </div>
  <div  class="line" style="text-align: center;margin-bottom: 1em">或者</div>
  <div class="line">
    <div style="border-radius: 1em;background: #282828;border: 1px dashed #505050;text-align: center;padding: 2em">
      <a-row :gutter="20">
        <a-col>
          <Icon style="font-size: 3em" icon="line-dragdroptuofang"></Icon>
        </a-col>
        <a-col>
          将文件拖放到此处快速导入<br>
          支持图片、视频
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Import'
}
</script>

<style scoped>

</style>
