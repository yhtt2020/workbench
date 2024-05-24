<template>
    <div class="flex flex-col w-full h-full">
        <Header 
            icon="fluent:desktop-16-regular"
            title="实用软件"
        >
        </Header>
        <xt-scrollbar class="flex-1 w-full overflow-hidden" :x="false" :y="true">
            <div class="flex flex-wrap gap-2 mt-4">
                <Item :item="item" v-for="item in state.appsList" @download="install"/>
            </div>
        </xt-scrollbar>
    </div>
    
    
</template>

<script setup lang='ts'>
import { ref, defineAsyncComponent, toRefs } from 'vue'
import { storeToRefs } from 'pinia';
import { message } from 'ant-design-vue';

import { useAppStateStore } from './store/index';
import { useAppCenterStore } from '../../store';

import { runExec } from '../../../../../js/common/exec';
import { usePlat } from '../../../../../ui/hooks/usePlat';

const state = useAppStateStore()
const store = useAppCenterStore()
const { myApps, installPath } = storeToRefs(store)

let fs
if (!usePlat('web') ) {
    fs= window.$models.fs
}

const Item = defineAsyncComponent(() => import('./components/Item.vue'))
const Header = defineAsyncComponent(() => import('../../component/Header.vue'))


// 打开本地应用
const executeLocalApp = (app) => {
    runExec('"' + app.installPath + '"')
}

// 安装函数
const install = (app) => {
    console.log('安装',app)
    if(app.downloading) return
    app.downloading = true
    let downloadDir = installPath.value
    fs.ensureDirSync(downloadDir)
    let basePath = require('path').join(downloadDir, require('path').basename(new URL(app.downloadUrl).pathname))
    if(fs.existsSync(basePath)){
        app.downloading = false
        setup(app, basePath)
        return 
    }
    let downloadPath = basePath + '.' + Date.now()
    console.log(downloadPath)
    tsbApi.download.start({
      url: app.downloadUrl,
      savePath: downloadPath,
      updated: (args) => {
        app.done = 1
        app.percent = (args.downloadInfo.receivedBytes / args.downloadInfo.totalBytes * 100).toFixed(1)
      },
      done: (args) => {
        fs.renameSync(downloadPath, downloadPath.substring(0, downloadPath.lastIndexOf('.')))
        app.downloading = false
        app.percent = 100
        app.done = 1
        app.setupPath = basePath
        setup(app, basePath)
      },
      willDownload: (args) => {
      }
    })
    
}

/**
 * 安装，区分静默与否
 * @param app
 * @param path
 */
 const setup = (app, path, silent = true) => {
  message.success({ content: '正在为您安装', key: 'install' })
  app.installing = true
  if (silent) {
    runExec('start /wait ' + path + ' /S', require('path').dirname(path)).then(rs => {
      message.success({ content: '安装成功，并为您运行此软件', key: 'install' })
      executeLocalApp(app)
      app.installed = true
    }, (rs) => {
      message.error({ content: '安装失败', key: 'install' })
    }).catch((err) => {
      message.error({ content: '安装错误', key: 'install' })
    }).finally(() => {
      app.installing = false
    })
  } else {
    runExec('start /wait ' + path, require('path').dirname(path)).then(rs => {
      message.success({ content: '安装成功，并为您运行此软件', key: 'install' })
      executeLocalApp(app)
      app.installed = true
    }, (rs) => {
      message.error({ content: '安装失败', key: 'install' })
    }).catch((err) => {
      message.error({ content: '安装错误', key: 'install' })
    }).finally(() => {
      app.installing = false
      myApps.value.unshift(app)
    })
  }
}

</script>
<style lang='scss' scoped></style>