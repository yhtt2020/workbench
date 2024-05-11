<template>
    <div>
        <div class="flex items-center justify-between pl-4 mb-4">
            <div class="flex items-center">
                <xt-ify-icon icon="fluent:settings-16-regular" class="mr-2" />
                设置
            </div>
            <Exit />
        </div>
        <xt-option-box>
            <xt-option-info 
                title="显示最近使用（开发中）"
                info="在应用开始菜单中显示最近使用数据。"
                :isSwitch="true"
                v-model:switch="recentUsed"
            />
        </xt-option-box>
        <xt-option-box>
            <xt-option-info 
                title="软件下载安装路径（开发中）"
                info="选择软件类型的应用下载安装的文件路径"
                icon="fluent:arrow-clockwise-16-regular"
                @onIconClick="() => {}"
            >
                <template #extra>
                    <div class="flex w-full gap-3">
                        <div @click="localAppClick()" class="w-full">
                            <xt-option-input
                              v-model:input="inputValue"
                              readonly
                            />
                        </div>
                        <xt-button 
                            @click="open()" 
                            icon="fluent:open-16-regular" 
                            :w="40" 
                            :h="40"
                            style="background-color: var(--primary-bg) ;"
                        />
                    </div>
                    <input style="display: none" ref="fileRef" type="file" webkitdirectory  multiple />
                </template>
            </xt-option-info>
        </xt-option-box>
    </div>
</template>

<script setup lang='ts'>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia';

import { useAppCenterStore } from '../../store';

import Exit from '../../component/exit.vue'

const { exec } = require('child_process');
const fs = require('fs');

// 打开本地应用
const openLocalAddress = (address) => {
  exec(`start "" "${address}"`, (error) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
  });
};

const appCenterStore = useAppCenterStore()
const { recentUsed } = storeToRefs(appCenterStore)

const inputValue = ref(require('path').join(window.globalArgs['user-data-dir'], 'download'))

const emits = defineEmits(["onLocalApp"]);
const fileRef = ref(null);
const localAppClick = () => {
  fileRef.value.click();
  fileRef.value.onchange = async function (files) {
    if (files.length === 0) {
      this.clear();
      return;
    }
    const file = this.files[0];
    console.log(this.files,'<<<<<<<<')
    inputValue.value = file.path
  };
};


const open = () => {
  console.log("123 :>> ", 123);
  openLocalAddress(inputValue.value);
};

// // 路径变化
// watch(
//   () => inputValue.value,
//   (newV, oldV) => {
//     if(checkIsFolder(newV)){
//       window.$ui.confirm('确认选择此文件夹吗？','会自动将原来文件夹的内容移动到新文件夹', async () => {
//         console.log('opdate')
//       })
//     } else {
//       inputValue.value = oldV
//     }
//     console.log(checkIsFolder(newV), "checkIsFolder(newV)");
//   }
// )

// // 判断是不是文件夹
// const checkIsFolder = (path) => {
//   return fs.lstatSync(path).isDirectory();
// };

</script>
<style lang='scss' scoped></style>