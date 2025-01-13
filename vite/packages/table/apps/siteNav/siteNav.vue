<template>
  <div class=" w-full flex flex-col">
    <div class="pt-4">
      <div class="w-full mb-2 flex">
        <div class="grow">
          <div class="item-content">
            <xt-input allow-clear icon="fluent:search-16-regular" class="rounded-full mb-3"
                      style="height: 42px;width:380px" placeholder="关键词、域名" v-model="words">
              <template #prefix>
                <xt-ify-icon
                  icon="fluent:search-16-filled"
                  size="20"
                  class="xt-text-2"
                />
              </template>
            </xt-input>
          </div>
        </div>
      </div>
    </div>
    <div class="flex pt-0 pl-4 pr-4 pb-2 w-full flex-1 h-0">
      <div style="width: 120px" class="mr-3  flex-col">
        <!-- 左侧顶层分类       -->
        <div class="h-[100px]">
          <xt-option-box>
            <xt-option-info title="个人收藏" isSwitch v-model:switch="isMy"/>
            <!--            <xt-option-bg-->
            <!--              v-model:mode="deskBg.mode"-->
            <!--              v-model:colorValue="deskBg.colorValue"-->
            <!--              v-model:imgValue="deskBg.imgValue"-->
            <!--            />-->
          </xt-option-box>
        </div>
        <div class="flex-1 h-0">
          <xt-button v-for="(item, index) in navTypes"
                     :w="110"
                     h="32"
                     radius="16"
                     class="p-1 mr-3 text-sm shaking-element mb-3 "
                     @click="setTopType(item)"
                     :style="{
                'background': currentTopTypeId === item.id ? 'var(--active-bg)' : 'transparent',
                'color': currentTopTypeId === item.id ? 'rgba(255, 255, 255, 0.85) !important' : 'var(--primary-text)' }"
                     :key="index" :icon="item.logo">
            {{ item.title }}
          </xt-button>
        </div>


      </div>
      <div class="flex-1 w-0 flex flex-col">
        <div class="flex mb-3 gap-1 w-full" style="flex-wrap: wrap">
          <!--  右侧二级导航        -->
          <xt-button @click="setSecondType(item)"
                     v-for="(item, index) in currentTopType.children"
                     :w="124"
                     h="32"
                     radius="16"
                     class="p-1 mr-3 text-sm shaking-element"

                     :style="{
                'background': currentSubType.id === item.id ? 'var(--active-bg)' : 'transparent',
                'color': currentSubType.id === item.id ? 'rgba(255, 255, 255, 0.85) !important' : 'var(--primary-text)' }"
                     :key="index" :icon="item.logo">
            {{ item.title }}
          </xt-button>
        </div>
        <!--     右侧三级导航   -->
        <div class="mb-4" v-if="currentSubType.children?.length>0">
          <xt-tab v-model="currentThirdTypeId" :list="convertSubTypes(currentSubType.children)"></xt-tab>
        </div>

        <div class="flex-1 h-0">
          <xt-scrollbar :y="true" class="w-full h-full">
            <IconList :list="list" @clickItem="openIcon"></IconList>
            <a-empty style="margin-top: 100px" description="暂无导航数据" v-if="list.length === 0"></a-empty>
          </xt-scrollbar>
        </div>
      </div>
    </div>

    <div class="p-4 pb-0 w-full  relative" style="z-index:1010;background:var(--secondary-bg);">
      <a-tooltip title="显示/隐藏操作面板" @click="showActionBar=!showActionBar">
        <div style="position: absolute;left:50%;margin-left: -19px;top:-19px;background:var(--secondary-bg)"
             class="p-2 rounded-full">

          <xt-new-icon
            :icon="showActionBar?'fluent:arrow-circle-down-16-regular':'fluent:arrow-circle-up-16-regular'">
          </xt-new-icon>

        </div>
      </a-tooltip>
      <div class="flex p-2 w-full" v-if="showActionBar">
        <!--          <xt-option-select style="width:122px"-->
        <!--                            v-model:select="openType"-->
        <!--                            :list="openTypeList"-->
        <!--          />-->
        <div class=" gap-2 w-1/2" v-if="currentIcon.name">
          <div>导航详情</div>
          <div class="p-2 flex gap-4">

            <a-image :preview="false" shape="square" style="width: 80px;height:80px;border-radius: 12px"
                     :src="currentIcon.icon"></a-image>
            <div>
              <div class="">
                {{ currentIcon.name }}
              </div>
              <div class="xt-text-2">
                {{ currentIcon.summary }}
              </div>
              <div >
                {{ currentIcon.url }}
              </div>
            </div>
          </div>
        </div>
        <div v-else class="w-1/2">
          <div>导航功能使用帮助</div>
          <div class="p-2 flex gap-4">

            <xt-new-icon icon="fluent:arrow-outline-down-left-24-regular" :size="80" shape="square"
                         style="width: 80px;height:80px;border-radius: 12px;transform: rotate(225deg)"></xt-new-icon>
            <div class="xt-text-2">
              <ul style="margin-left: 0;padding-left: 20px">
                <li>
                  您可以在右侧选择点击行为。默认为直接打开。
                </li>
                <li>打开、添加到桌面都可以选择具体的打开方式。</li>
                <li>包括系统默认浏览器、想天浏览器、内置浏览器和手机模式。</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="mr-6" style="border:1px solid var(--third-bg);height:130px;">

        </div>
        <div class=" gap-2 flex-1 w-0">
          <div>
            点击行为
          </div>
          <div class="flex gap-2 mt-2 mb-2">
            <a-tooltip :title="item.tip" v-for="item in openTypeList">
              <div @click="openType=item.value" class="flex gap-2 rounded-lg p-1 w-[80px] pointer"
                   :class="{'active':item.value===openType}">
                <xt-new-icon :icon="item.icon"></xt-new-icon>
                {{ item.name }}
              </div>

            </a-tooltip>
          </div>
          <div class="w-[400px] flex gap-2" v-if="['addToDesk','open'].includes(openType)">
            <div class="p-2">
              打开方式：
            </div>
            <div>
              <xt-option-select style="width:160px"
                                v-model:select="linkType"
                                :list="browserType"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


</template>

<script setup lang='ts'>
import {ref, onMounted, computed, watch} from 'vue'
import {storeToRefs} from 'pinia'
import {getNavList} from '../../page/app/addIcon/api/api'
import {navTypes} from '../../components/desk/addIcon/hook/defaultData'
import {useReplace} from '.../../components/desk/addIcon/hook/useReplace';
import IconList from '../../components/desk/addIcon/components/IconList.vue';
import {useFilterList} from '../../components/desk/addIcon/hook/useFilterList';
import navDb from '../../js/lib/navDb'
import {cdnUrl} from '../../consts'
import {openWithList} from "../../components/widgets/aggregatedSearch/config/data";
import {useAddCard} from "../../ui/hooks/useAddCard";
import {ttappConversionIcon} from "../appCenter/src/views/developer/hooks/add";
import {homeStore} from '../../store/home'
import {useFileConversionIcon, useLinkConversionNav} from "../folder/src/hooks/useDataConversion";
import {message} from 'ant-design-vue'
import {siteNavStore} from './siteNavStore'

const emit = defineEmits(['addIcon'])

const props = defineProps({
  value: String
})
const currentTopTypeId = ref(0)
const currentSubType = ref({})
const currentTopType = ref({})
const currentThirdType = ref({})
const currentThirdTypeId = ref('')


const {isMy, showActionBar} = storeToRefs(siteNavStore())
// 获取所有的图标
const navTypes = ref({})
const words = ref('')
// 索引
const clickIndex = ref(0)
const currentIcon = ref({})
// 当前图标的类型
const tag = computed(() => {
  return navTypes[clickIndex.value].tag
})
const browserType = ref([
  // 设置中打开方式类型
  {name: "工作台内打开", value: "internal"},
  {name: "想天浏览器", value: "thinksky"},
  {name: "系统默认浏览器", value: "default"},
  {name: "手机模式", value: "mob"}]
)
const openType = ref('open')
const openTypeList = ref([{
  name: '查看', value: 'select', tip: '仅选择', icon: 'fluent:cursor-16-regular'

}, {
  name: '打开', value: 'open', tip: '直接打开', icon: 'fluent:open-16-regular'

}, {
  name: '添加', value: 'addToDesk', tip: '添加图标到当前桌面', icon: 'fluent:desktop-checkmark-16-regular'
}, {
  name: '收藏', value: 'addToMy', tip: '添加到个人收藏', icon: 'fluent:checkmark-starburst-16-regular'
},])
const linkType = ref('default')
// 当前图标的列表
const list = ref([])

// 筛选列表
// const filterList = computed(() => {
//   let arr = list.value
//   if (!arr) {
//     arr = []
//   }
//   return list.value.filter(item =>{
//     return item?.name.toLowerCase().includes(props.value.toLowerCase())
//   })
// })

watch(() => {
  return words.value
}, async (value) => {
  if (value !== '') {
    //resetType()
    list.value = convertNavToIcon(await navDb.searchNavByWords(value, isMy.value))
  } else {
    await getCurrentNavList()
  }
})
watch(() => {
    return isMy.value
  },
  async (value) => {
    await getCurrentNavList()
  })
watch(() => {
    return currentThirdTypeId.value
  },
  async (value) => {
    setThirdType(value)
  },
  {
    deep: true
  }
)


const getCurrentNavList = async () => {
  if (currentThirdTypeId.value) {
    return setThirdType(currentThirdTypeId.value)
  }
  if (currentSubType.value.id) {
    return setSecondType(currentSubType.value)
  }
  if (currentTopType.value.id) {
    return setTopType(currentTopType.value)
  }
  // const id = currentThirdType.value.id || currentSubType.value.id || 0
  // console.log(id, 'idd===')
  // const rs = await navDb.getNavsByType(Number(id) || 0, currentTopType.value.id || 0, currentSubType.value.id || 0)
  // list.value = convertNavToIcon(rs)
}

// 切换
const setTopType = async (type: object) => {
  currentTopTypeId.value = type.id
  currentTopType.value = type
  currentSubType.value = {}
  currentThirdType.value = {}
  currentThirdTypeId.value = ''
  const rs = await navDb.getNavsByTopId(currentTopType.value.id, isMy.value)
  console.log(rs, currentTopType.value.id)
  list.value = convertNavToIcon(rs)
}

const setSecondType = async (secondType) => {
  currentSubType.value = secondType;
  currentThirdType.value = {}
  currentThirdTypeId.value = ''
  const rs = await navDb.getNavsBySecondId(currentSubType.value.id, isMy.value)
  list.value = convertNavToIcon(rs)
}
const setThirdType = async (thirdTypeId) => {

  if (!thirdTypeId) {
    const rs = await navDb.getNavsBySecondId(currentSubType.value.id, isMy.value)
    list.value = convertNavToIcon(rs)
    return
  }
  currentThirdType.value = currentSubType.value.children?.find((item) => {
    return item.id === thirdTypeId.value
  });
  const rs = await navDb.getNavsByThirdId(thirdTypeId, isMy.value)
  list.value = convertNavToIcon(rs)
}
onMounted(async () => {
  navTypes.value = await navDb.getNavTypesTree()
  currentTopTypeId.value = navTypes.value[0].id
  currentTopType.value = navTypes.value[0]
  getCurrentNavList()
})
const convertNavToIcon = (list) => {
  return list.map((item) => {
    return {
      active: item.active,
      "id": item.id,
      "name": item.title,
      "summary": item.summary || '网站',
      "icon":item.logo? cdnUrl('/nav_icon/' + item.logo):'/logo/browser.svg',
      "url": item.url,
      info: item.summary || '',
      value: item.url,
      type: 'link',
      open: {
        mode: 'default',
        value: item.url
      }
    }
  })
}

const convertSubTypes = (types) => {
  return [{name: '全部', value: ''}, ...types.map(type => {
    return {
      name: type.title,
      value: String(type.id)
    }
  })]
}

// 添加图标
const openIcon = (item) => {
  currentIcon.value = item
  if (openType.value == 'open') {
    switch (linkType.value) {
      case 'default':
        browser.openInSystem(item.url)
        break
      case 'internal':
        browser.openInTable(item.url)
        break
      case 'thinksky':
        browser.openInInner(item.url)
        break
      case 'mob':
        browser.openInMobMod(item.url)
    }
  } else if (openType.value === 'addToDesk') {
    let icon = useFileConversionIcon(item)
    icon.open.mode = linkType.value
    useAddCard("myIcons", {
      iconList: [icon],
      newIcon: true,
    }, undefined)
    message.success('添加导航 ' + item.name + ' 成功')
  } else if (openType.value === 'addToMy') {
    //todo
    if (
      siteNavStore().toggleMySite(item)
    ) {
      item.active = true
      message.success({content: '已经添加 ' + item.name + ' 到个人收藏', key: 'tip'})
    } else {
      {
        item.active = false
        message.error({content: '已经从个人收藏移除 ' + item.name + ' ', key: 'tip'})
      }
    }

    // getCurrentNavList()
  }
}

</script>
<style lang='scss' scoped>
.active {
  background: var(--active-bg);
}
</style>
