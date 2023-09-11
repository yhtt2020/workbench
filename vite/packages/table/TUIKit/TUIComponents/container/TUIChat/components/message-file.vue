<template>
  <div class="message-file">
    <div v-if="is3dFile(data.name) && !data.progress">
      <div v-if="judgeSize(data.size)" class="model-preview">
      <model-file :data="data"></model-file>
      </div>
      <div class="" v-else>

        <xt-button @click="showModel=true" type="theme"  style="width: 200px" :h="200">点击预览</xt-button>
        <div class="text-center" style="opacity: 0.5;">模型超过10MB，请点击预览</div>
      </div>
    </div>

    <div class="box" @click="download" :title="$t('TUIChat.单击下载')">
      <CodepenOutlined class="model-icon" v-if="is3dFile(data.name)"/>
      <i v-else class="icon icon-files"></i>
      <div class="message-file-content">
        <label>{{ data.name }}</label>
        <span>{{ data.size }}</span>
      </div>
    </div>

    <progress v-if="data.progress" :value="data.progress" max="1"></progress>
  </div>
</template>

<script lang="ts">
import { defineComponent, watchEffect, reactive, toRefs } from 'vue';
import _3dFile from "./model-file.vue";
import ModelFile from "./model-file.vue";
import {CodepenOutlined} from '@ant-design/icons-vue'
export default defineComponent({
  components: {ModelFile, _3dFile,CodepenOutlined},
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props: any, ctx: any) {
    const data = reactive({
      data: {

      },
      showModel:false,//强制显示模型
    });

    watchEffect(() => {
      data.data = props.data;
    });

    const download = () => {
      const file: any = data.data;
      const option: any = {
        mode: 'cors',
        headers: new Headers({
          'Content-Type': 'application/x-www-form-urlencoded',
        }),
      };
      // 浏览器支持fetch则用blob下载，避免浏览器点击a标签，跳转到新页面预览的行为
      // If the browser supports fetch, use blob to download, so as to avoid the browser clicking the a tag and jumping to the preview of the new page
      if ((window as any).fetch) {
        fetch(file.url, option)
          .then((res) => res.blob())
          .then((blob) => {
            const a = document.createElement('a');
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = file.name;
            a.click();
          });
      } else {
        const a = document.createElement('a');
        a.href = file.url;
        a.target = '_blank';
        a.download = file.name;
        a.click();
      }
    };

    const is3dFile=(filename)=>{
      const ext=require('path').extname(filename)
      if(['.stl','.obj','.3ds','.ply','.gltf','.off','.3dm','.fbx','.dae','.wrl','.3mf','.amf','.ifc',
      '.brep','.step','.iges','.fcstd','.bim'].includes(ext)){
        return true
      }
    }
    const judgeSize=(size)=>{
      if(data.showModel){
        return true
      }
      if(size.includes('Mb')){
        if(Number(size.replace('Mb',''))>10){
          return false
        }
      }else{
        return true
      }
    }
    return {
      ...toRefs(data),
      download,
      is3dFile,
      judgeSize,
    };
  },
});
</script>
<style lang="scss" scoped>
@import url('../../../styles/common.scss');
@import url('../../../styles/icon.scss');
.message-file {
  display: flex;
  flex-direction: column;
  .box {
    flex: 1;
    display: flex;
    cursor: pointer;
    .message-file-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
  progress {
    width: 100%;
    color: #006eff;
    appearance: none;
    border-radius: 0.25rem;
    background: rgba(#ffffff, 1);
    width: 100%;
    height: 0.5rem;
    &::-webkit-progress-value {
      background-color: #006eff;
      border-radius: 0.25rem;
    }
    &::-webkit-progress-bar {
      border-radius: 0.25rem;
      background: rgba(#ffffff, 1);
    }
    &::-moz-progress-bar {
      color: #006eff;
      background: #006eff;
      border-radius: 0.25rem;
    }
  }
}
.model-icon{
  color:#666;
  margin-right: 5px;
  vertical-align: text-top

}
</style>
