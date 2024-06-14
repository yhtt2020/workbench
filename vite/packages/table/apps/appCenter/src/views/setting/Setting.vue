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
                title="显示最近使用"
                info="在应用开始菜单中显示最近使用数据。"
                :isSwitch="true"
                v-model:switch="recentUsed"
            />
        </xt-option-box>
        <xt-option-box v-if="!usePlat('web')">
            <xt-option-info 
                title="软件下载安装路径"
                info="选择软件类型的应用下载安装的文件路径"
                icon="fluent:arrow-clockwise-16-regular"
                @onIconClick="resetPath"
            >
                <template #extra>
                    <div class="flex w-full gap-3">
                        <div @click="localAppClick()" class="w-full">
                            <xt-option-input
                              v-model:input="installPath"
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
import { message } from 'ant-design-vue';

import { useAppCenterStore } from '../../store';

import Exit from '../../component/exit.vue'

import { usePlat } from '../../../../../ui/hooks/usePlat';


const appCenterStore = useAppCenterStore()
const { recentUsed, installPath, defaultPath } = storeToRefs(appCenterStore)

const emits = defineEmits(["onLocalApp"]);
const fileRef = ref(null);

const localAppClick = async() => {
  const plat = usePlat(['web'])
  if(plat){
    confirm(options.value)
    return
  }
  let path = await tsbApi.dialog.showOpenDialog({
    properties: ['openDirectory'],
    title: '选择文件夹',
    
  })
  console.log(path)
  if(path[0]) {
    installPath.value = path[0]
  }
};

// 打开指定文件夹
const open = () => {
  console.log("123 :>> ", 123);
  if(usePlat('web')){
    message.info('web端暂不支持此功能')
    return
  }
  require('electron').shell.openPath(installPath.value);
};

const options = ref({
  title:'web端暂不支持此功能',
  content:'请下载客户端体验完整功能',
  okText: '立即下载',
  noText: '稍后再说',
  ok: () => {
      window.open('https://www.apps.vip/download/');
  },
  no: () => {
    console.log('no')
  },
  okButtonWidth: '95',
  noButtonWidth: '95',
})

// web端弹窗提示
const confirm = (options) => {
  window.$ui.confirm(
    options.title || 'web端暂不支持此功能',
    options.content || '请下载客户端体验完整功能',
    {
      noText: options.noText || '稍后再说',
      okText: options.okText || '立即下载',
      ok: () => {
        options.ok && options.ok();
      },
      no: () => {
        options.no && options.no();
      },
      okButtonWidth: options.okButtonWidth || '95',
      noButtonWidth: options.noButtonWidth || '95',
    }
  )
}

// 重置路径
const resetPath = () => {
  installPath.value = defaultPath.value
}



</script>
<style lang='scss' scoped></style>