<script lang="ts">
import {defineComponent} from 'vue'
import {mapWritableState} from "pinia";
import {deviceStore} from '../deviceStore'
import pathLib from "path";

export default defineComponent({
  name: "FileTransfer",
  data() {
    return {
      dropFiles: [],
      currentItem: {}
    }
  },
  computed: {
    ...mapWritableState(deviceStore, ['files'])
  },
  methods: {
    dragOver() {

    },
    async drop(e) {
      let files = e.dataTransfer.files

      let filesArr = []
      const pathLib = require('path')
      console.log(files)
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          let path = files[i].path
          let ext = pathLib.extname(path)
          let icon = ['.png', '.jpg', '.jpeg'].includes(ext) ? path : await tsbApi.system.extractFileIcon(files[i].path)
          filesArr.push({
            icon: icon,
            name: require('path').basename(files[i].path),
            path: path
          })
          console.log('path:', files[i])
        }
      }
      this.dropFiles = filesArr
      this.files.push(...filesArr)
    },
    remove(index) {
      this.files.splice(index, 1)
    },
    clear() {
      this.files = []
    },
    preview(item) {
      this.currentItem = item
    }
  }
})
</script>

<template>
  <div class="flex h-full flex-col w-full p-2">
    <div class="">文件中转站</div>
    <div class="flex-1 h-0 w-full">
      <div @dragover.prevent="dragOver" @drop.prevent="drop" class="droppable h-full w-full">
        <div class="s-bg h-full" style="min-width: 120px;min-height: 80px;text-align: center;line-height: 80px"
             v-if="files.length===0">
          往这里拖放文件
        </div>
        <div class="h-full w-full flex"   v-else>
          <xt-scrollbar class="h-full " style="width: 400px" :x="false" :y="true">
            <div class="item" @click="preview(file)" v-for="(file,index) in files">
              <a-row>
                <a-col :span="3">
                  <a-avatar shape="square" :src="file.icon"></a-avatar>
                </a-col>
                <a-col :span="12">
                  <div  class="item-title">{{ file.name }}</div>
                  <div >

                  </div>
                </a-col>
                <a-col :span="6">
                  <xt-button size="mini" @click="remove(index)" :w="60" :h="30">删除</xt-button>
                </a-col>
              </a-row>
            </div>
          </xt-scrollbar>
          <div class="flex-1 w-0 h-full">
            <div v-if="!currentItem.path">
              点击预览文件
            </div>
            <template v-else>
              <div class="w-full h-full" v-if="currentItem.path?.endsWith('.png')">
                <a-image :width="300" class="w-full h-full" :src="currentItem.path"></a-image>
              </div>
              <div v-else>
                <div style="width: 200px;text-align: center">
                  <a-avatar shape="square" :size="200" :src="currentItem.icon"></a-avatar>
                  无法预览文件
                </div>
              </div>
            </template>

          </div>
        </div>


      </div>
    </div>
    <div>
      <xt-button @click="clear">清空</xt-button>
    </div>
  </div>

</template>

<style scoped lang="scss">
.droppable {
  &:hover {

  }
}
.item{
  &:hover{
    background: var(--secondary-bg);
    border-radius: 6px;
    opacity: 0.8;
  }
  padding: 5px;
}
.item-title{
  font-size: 14px;
}
</style>
