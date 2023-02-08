<template>
  <div class="category flex justify-between align-center">
    <div class="category-lf">
      <a-tag v-for="(tag, index) in tags"
             :key="index"
             :color="tag.checked ? 'blue' : ''"
             style="font-size: 15px; border-radius: 10px"
             @click="handleChange(tag, index)"
      >
        {{ tag.label }}
      </a-tag>
    </div>
    <div class="category-rg flex justify-around align-center">
      <smile-outlined/>
      <div
        class="flex align-center justify-center"
        style="padding-left: 5px"
      >
        按下Tab键切换类型
      </div>
    </div>
  </div>
  <div
    v-if="openFirst"
    class="recent-open flex flex-direction justify-between"
  >


  </div>
  <div v-else class="content flex justify-center list-hook">
    <div v-if="contentLoading" key="loading">
      <a-spin>
        <a-icon
          slot="indicator"
          spin
          style="font-size: 40px"
          type="loading"
        ></a-icon>
      </a-spin>
    </div>
    <ul v-else>

      <li v-for="(item, index) in compSearchResult"
          :key="index"
          :class="{'li-ready': itemReadyedIndex === index}"
          class="flex justify-start align-center"
          @click="click(item)"
      >
        <img
          :src="item.icon"
          onerror="this.src='../../icons/default.svg'"
          style="width: 30px; height: 30px"
        />
        <div
          class="flex flex-direction justify-around align-start"
          style="padding-left: 20px; height: 100%"
        >
          <div class="text-black-lg sg-omit-sm"
               v-html="item.title.replaceAll(searchWord,`<strong style='color:orangered'>${searchWord}</strong>`)"></div>
          <div class="text-grey-sm sg-omit-sm"
               v-html="item.attached.replaceAll(searchWord,`<strong style='color:orangered'>${searchWord}</strong>`)"></div>
        </div>
      </li>
      <div
        v-show="compSearchResult.length === 0 && !openFirst"
        class="text-grey flex justify-center align-center"
        style="width: 100%; height: 50px"
      >
        未找到任何结果
      </div>
    </ul>
  </div>
</template>

<script lang="ts">
import { appStore } from '../store'
import { mapWritableState } from 'pinia'
let {appModel, placesModel,statsh} = window.$models
export default {
  name: 'Results',
  methods: {
    executeApp(app) {
      ipc.send('executeApp', {app: JSON.parse(JSON.stringify(app))})

      //statsh 全局搜索打开的应用数量
      statsh.do({
        action: 'increase',
        key: 'globalSearchBaseOpenApp',
        value: 1
      })
      this.close()
    },
    /**
     * 关闭全局搜索窗
     */
    close() {
      ipc.send('closeGlobalSearch')
    },
    click(item) {
      if (item.tag === 'tab') {
        ipc.send('switchToTab', {
          taskId: item.taskId,
          tabId: item.tabId
        })

        //statsh 全局搜索打开的网页数量
        statsh.do({
          action: 'increase',
          key: 'globalSearchBaseOpenWeb',
          value: 1
        })
        this.close()
      } else if (item.tag === 'task') {
        ipc.send('switchToTask', {
          id: item.taskId,
        })

        //statsh 全局搜索打开的标签组数量
        statsh.do({
          action: 'increase',
          key: 'globalSearchBaseOpenTask',
          value: 1
        })
        this.close()
      } else if (item.tag === 'app') {
        this.executeApp(item.app)
        this.close()
      }
    },
    changeHeight(height: number) {
      ipc.send('changeBrowserWindowHeight', height)
    },
    calculateAreaHeight (res) {
      //计算搜索结果区域的高度，传给main变换窗体高度
      let num
      num = res.length
      if (num >= 6) {
        this.changeHeight(400)
      } else if (num === 5) {
        this.changeHeight(350)
      } else if (num === 4) {
        this.changeHeight(300)
      } else if (num === 3) {
        this.changeHeight(250)
      } else if (num === 2) {
        this.changeHeight(200)
      } else {
        this.changeHeight(150)
      }
    },
  },
  computed: {
    ...mapWritableState(appStore, ['tags', 'itemReadyedIndex', 'itemReadyedItem', 'searchResult']),
    compSearchResult () {
      let findResult = this.tags.find(v => v.checked === true)
      if (findResult.label === '全部') {
        this.itemReadyedIndex = 0
        this.itemReadyedItem = this.searchResult[0]
        this.calculateAreaHeight(this.searchResult)
        return this.searchResult
      } else if (findResult.label === '网页') {
        let filterRes = this.searchResult.filter(v => v.tag === 'tab')
        this.itemReadyedIndex = 0
        this.itemReadyedItem = filterRes[0]
        this.calculateAreaHeight(filterRes)
        return filterRes
      } else if (findResult.label === '标签组') {
        let filterRes = this.searchResult.filter(v => v.tag === 'task')
        this.itemReadyedIndex = 0
        this.itemReadyedItem = filterRes[0]
        this.calculateAreaHeight(filterRes)
        return filterRes
      } else if (findResult.label === '应用') {
        let filterRes = this.searchResult.filter(v => v.tag === 'app')
        this.itemReadyedIndex = 0
        this.itemReadyedItem = filterRes[0]
        this.calculateAreaHeight(filterRes)
        return filterRes
      } else if (findResult.label === '应用市场') {
        let filterRes = this.searchResult.filter(v => v.tag === 'appstore')
        this.itemReadyedIndex = 0
        this.itemReadyedItem = filterRes[0]
        this.calculateAreaHeight(filterRes)
        return filterRes
      }
    }
  }
}
</script>

<style scoped>

</style>
