<template>
  <div class="w-full h-full">
    <!-- windows应用 -->
    <!-- <div v-if="selectTag === 'tableApp'" class="mb-2  xt-bg-2 h-[54px] rounded-xl flex items-center p-2  justify-between">
      <div class="text-base xt-text-2">选择windows桌面图标，支持多选批量添加。</div>
      <div class="flex items-center ">
        <div style="color:var(--active-bg)" class="mr-3 pointer" @click="addAllIcon">全选</div>
        <xt-button w="107" h="32" radius="8" style="background: var(--active-bg);" @click="this.clickRightListItem(this.$refs.selectIcon.selectList)">
          <div class="flex items-center justify-center" style="color: rgba(255, 255, 255, 0.85) !important;">
            批量添加({{ this.$refs.selectIcon.selectList.length }})</div>
        </xt-button>
      </div>

    </div> -->
    <div v-if="selectTag === 'recommendation'">
      <div class="flex flex-col justify-between p-2 mt-5 rounded-lg xt-bg-2 ">
        <div class="mb-2 xt-text">你可以直接拖拽Windows系统文件或应用快捷方式到导航栏；我们还为你推荐了以下应用图标供你添加选择。</div>
        <!-- <div class="pointer" style="color:var(--active-bg)" @click="addAllIcon">全部添加</div> -->
      </div>
    </div>
    <!-- <div class="xt-text-2 w-[790px] h-[52px] xt-bg-2 rounded-xl flex items-center p-4" v-if="tagText">
      {{ tagText }}</div> -->
    <!-- {{ sideBar[currentIndex].tag == 'webNavigation' }} -->
    <div class="flex " v-if="selectTag == 'webNavigation' || selectTag == 'tableApp'">
      <xt-button w="80" h="32" radius="16" class="p-1 mr-3 text-sm shaking-element" @click="onClick(index)"
        :style="{ 'background': clickIndex === index ? 'var(--active-bg)' : 'transparent', 'color': clickIndex === index ? 'rgba(255, 255, 255, 0.85) !important' : 'var(--primary-text)' }"
        v-for="(item, index) in filterMenus" :key="index">{{ item.name }}</xt-button>
    </div>
    <!-- <div class="flex " > -->
    <div class="flex flex-wrap mt-3 mainList" ref="targetDiv">
      <!-- <div class="flex flex-wrap"> -->
      <template v-if="this.filterList.length > 0">
        <selectIcon :filterList="filterList" :recommendation="recommendation"  ref="selectIcon"/>
      </template>
      <div v-else class="flex flex-col items-center justify-center w-full h-full mt-10">
        <div>
          <img src="/img/test/load-ail.png" style="width: 100px;height: 100px">
        </div>
        <div class="mt-4 text-base xt-text">暂无数据</div>
      </div>
      <!-- </div> -->

    </div>
    <!-- </div> -->

  </div>
</template>
<script>
import { navStore } from '../../../../store/nav'
import { useNavigationStore } from '../navigationStore'
import { mapActions, mapWritableState } from 'pinia'
import selectIcon from './selectIcon.vue'
import { webMenus, localFiles, doc } from '../index'
import { message } from 'ant-design-vue'
import DataStatu from "../../../widgets/DataStatu.vue";
export default {
  name: 'Introduce',
  components: {
    selectIcon,
    DataStatu
  },
  data() {
    return {
      webMenus,
      currentIndex: 0,
      clickIndex: 0,
      localFiles,
      doc
    }
  },
  props: {
    recommendation: String,
    selectList: Array,
    inputValue: String
  },
  methods: {
    // ...mapActions(useNavigationStore, ['updateCurrentList']),
    ...mapActions(navStore, ['setFootNavigationList', 'sortFootNavigationList', 'removeFootNavigationList', 'setSideNavigationList', 'sortSideNavigationList', 'removeSideNavigationList', 'setRightNavigationList', 'sortRightNavigationList', 'removeRightNavigationList', 'setNavigationToggle']),
    onClick(index) {
      this.clickIndex = index
    },
    updateMainNav(addItem, type) {
      this.mainNavList = this.currentList
      let sumNavList = this.sideNavigationList.concat(this.footNavigationList, this.rightNavigationList)
      if (type) {
        this.mainNavList.forEach(item => {
          if (item.name === addItem.name) {
            if (type === 'add') {
              item.addNav = true
            } else if (type === 'del') {
              item.addNav = false
            }
          }
        })
      } else {
        for (const i in this.mainNavList) {
          let stateNav = sumNavList.some(item => item.name === this.mainNavList[i].name)
          this.mainNavList[i].addNav = stateNav
        }
      }
    },
    // 添加图标的主要函数
    clickRightListItem(item, index) {
      this.activeRightItem = index
      //   this.editFlag = false
      if (this.selectNav === 'foot') {
        if (item instanceof Array) {
          for (let i = 0; i < item.length; i++) {
            if (!this.footNavigationList.find(j => j.name === item[i].name)) {
              this.updateMainNav(item[i], 'add')
              item[i].addNav = true
              this.setFootNavigationList(item[i])
            } else {
              message.info('已添加', 1)
            }
          }
          this.dropList = []
        } else {
          for (let i = 0; i < this.footNavigationList.length; i++) {
            if (this.footNavigationList[i].name === item.name) return message.info('已添加', 1)
          }
          this.updateMainNav(item, 'add')
          item.addNav = true
          this.setFootNavigationList(item)
          this.$nextTick(() => {
            let scrollElem = this.$refs.content
            scrollElem.scrollTo({ left: scrollElem.scrollWidth, behavior: 'smooth' })
          })
        }
      } else if (this.selectNav === 'left') {
        if (item instanceof Array) {
          for (let i = 0; i < item.length; i++) {
            if (!this.sideNavigationList.find(j => j.name === item[i].name)) {
              this.updateMainNav(item[i], 'add')
              item[i].addNav = true
              this.setSideNavigationList(item[i])
            } else {
              message.info('已添加', 1)
            }
          }
          this.dropList = []
        } else {
          for (let i = 0; i < this.sideNavigationList.length; i++) {
            if (this.sideNavigationList[i].name === item.name) return message.info('已添加', 1)
          }
          this.updateMainNav(item, 'add')
          item.addNav = true
          this.setSideNavigationList(item)
          this.$nextTick(() => {
            let scrollElem = this.$refs.sideContent
            scrollElem.scrollTo({ top: scrollElem.scrollHeigth, behavior: 'smooth' })
          })
        }
      } else if (this.selectNav === 'right') {
        if (item instanceof Array) {
          for (let i = 0; i < item.length; i++) {
            if (!this.rightNavigationList.find(j => j.name === item[i].name)) {
              this.updateMainNav(item[i], 'add')
              item[i].addNav = true
              this.setRightNavigationList(item[i])
            } else {
              message.info('已添加', 1)
            }
          }
          this.dropList = []
        } else {
          for (let i = 0; i < this.rightNavigationList.length; i++) {
            if (this.rightNavigationList[i].name === item.name) return message.info('已添加', 1)
          }
          this.updateMainNav(item, 'add')
          item.addNav = true
          this.setRightNavigationList(item)
        }
      }
    },
    // 批量添加
    addIcon(item, index) {
      // console.log(item,index,'item,index-->>>')
      this.clickRightListItem(item, index)
    },
    // 全部添加
    addAllIcon() {
      this.clickRightListItem(this.filterList)
    },
    // 搜索目标图标
    filterIcon(list) {
      const inputValueLowerCase = this.inputValue.toLowerCase();
      return list.filter(i => i.name.toLowerCase().includes(inputValueLowerCase));
    }

  },
  computed: {
    ...mapWritableState(useNavigationStore, ['selectNav', 'currentList']),
    ...mapWritableState(navStore, ['mainNavigationList', 'sideNavigationList', 'footNavigationList', 'rightNavigationList', 'navigationToggle']),
    filterList() {
      if (this.selectTag === 'webNavigation') {
        return this.filterIcon(this.webList[0])
      } else if (this.selectTag === 'tableApp') {
        const current = this.filterMenus[this.clickIndex].tag;
        switch (current) {
          case 'all':
            return this.filterIcon(this.selectList);
            break;
          case 'software':
            return this.filterIcon(this.selectList.filter((item) => item.path.endsWith('.exe')));
            break;
          case 'docx':
            return this.filterIcon(this.selectList.filter((item) => doc.includes(item.ext)));
            break;
          case "other":
            return this.filterIcon(this.selectList.filter((item) => !doc.includes(item.ext) && item.ext !== '.exe'))
            break;
          default:
            return [];
            break;
        }
      }
      else {
        return this.filterIcon(this.selectList)
      }
    },
    selectTag() {
      return this.recommendation.tag
    },
    webList() {
      if (this.selectTag === 'webNavigation') {
        const clickTag = this.webMenus[this.clickIndex].tag;
        const temp = [];

        return this.selectList.map((item) => {
          if (item.hasOwnProperty(clickTag)) {
            temp.push(...item[clickTag]);
          }
          return temp;
        });
      } else {
        // 如果 selectTag.value 不等于 'webNavigation'，返回一个默认值（这里返回一个空数组）
        return [];
      }
    },
    filterMenus() {
      if (this.selectTag === 'webNavigation') {
        return this.webMenus
      } else {
        return this.localFiles
      }
    }

  },
  watch: {
    filterList() {
      this.currentList = this.filterList
      this.updateMainNav()
    },
  },
  mounted() {
    this.currentList = this.filterList
    this.updateMainNav()
  },

}
</script>
<style lang='scss' scoped></style>