<template>
  <div class="w-full h-full">
    <div v-if="selectTag === 'recommendation'">
      <div class="flex items-center p-2 rounded-lg xt-bg-2 ">
        <div class=" xt-text">你可以直接拖拽Windows系统文件或应用快捷方式到导航栏；我们还为你推荐了以下应用图标供你添加选择。</div>
      </div>
    </div>
    <div class="flex " v-if="selectTag == 'webNavigation' || selectTag == 'tableApp'">
      <xt-button w="80" h="32" radius="16" class="p-1 mr-3 text-sm shaking-element" @click="onClick(index)"
        :style="{ 'background': clickIndex === index ? 'var(--active-bg)' : 'transparent', 'color': clickIndex === index ? 'rgba(255, 255, 255, 0.85) !important' : 'var(--primary-text)' }"
        v-for="(item, index) in filterMenus" :key="index">{{ item.name }}</xt-button>
    </div>
    <div class="flex flex-wrap mainList" ref="targetDiv" :class="{ 'mt-3': selectTag === 'webNavigation' || selectTag === 'tableApp' || selectTag === 'recommendation' }">
      <template v-if="this.filterList.length > 0">
        <selectIcon :filterList="filterList" :recommendation="recommendation" ref="selectIcon"
          @clickRightListItem="clickListItem" />
      </template>
      <div v-else class="flex flex-col items-center justify-center w-full h-full mt-10">
        <div>
          <img src="/img/test/load-ail.png" style="width: 100px;height: 100px">
        </div>
        <div class="mt-4 text-base xt-text">暂无数据</div>
      </div>
    </div>
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
  emits: ['clickListItem'],
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
    clickRightListItem(item, index,navigationList,setNavigationList) {
      this.activeRightItem = index
      //   this.editFlag = false
      // if (this.selectNav === 'foot') {
      if (item instanceof Array) {
        for (let i = 0; i < item.length; i++) {
          if (!navigationList.find(j => j.name === item[i].name)) {
            this.updateMainNav(item[i], 'add')
            item[i].addNav = true
            setNavigationList(item[i])
          } else {
            message.info('已添加', 1)
          }
        }
        this.dropList = []
      } else {
        for (let i = 0; i <navigationList.length; i++) {
          if (navigationList[i].name === item.name) return message.info('已添加', 1)
        }
        this.updateMainNav(item, 'add')
        item.addNav = true
        setNavigationList(item)
        // this.$nextTick(() => {
        //   let scrollElem = this.$refs.content
        //   scrollElem.scrollTo({ left: scrollElem.scrollWidth, behavior: 'smooth' })
        // })
      }
      // } 
    },
    // 添加图标函数
    clickListItem(item,index){
      switch (this.selectNav) {
        case 'foot':
          this.clickRightListItem(item,index,this.footNavigationList,this.setFootNavigationList)
          break;
        case 'left':
          this.clickRightListItem(item,index,this.sideNavigationList,this.setSideNavigationList)
          break;
        case 'right':
          this.clickRightListItem(item,index,this.rightNavigationList,this.setRightNavigationList)
          break;
      
          case 'desktop':
          this.$emit('clickListItem', item, index)
          break;
      }
      
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
            return this.filterIcon(this.selectList.filter((item) => item.value.endsWith('.exe')));
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
        let temp = [];

        return this.selectList.map((item) => {
          if (item.hasOwnProperty(clickTag)) {
            console.log(item[clickTag],'web');
            temp.push(...item[clickTag]);
            temp =temp.map((item)=>{
              return {
                ...item,
                // addNav:item.addNav,
                // name:item.name,
                // id:item.id,
                // icon:item.icon,
                value:item.url,
                mode:'link',
                type:'default',
                bg:'',
                isBg:false,
              }
            })
          }
          console.log(temp,'temp');
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
    },

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