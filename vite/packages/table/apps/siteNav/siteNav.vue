<template>
  <div class="p-4 w-full flex flex-col">
    <div>
      <div class="w-full mb-2 flex">
        <div class="w-[200px]">
          <xt-option-select style="width:120px"
                            v-model:select="openType"
                            :list="openTypeList"
          />
        </div>
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
        <div class="w-[200px]">
          <xt-option-select style="width:160px"
                            v-model:select="linkType"
                            :list="browserType"
          />
        </div>
      </div>
    </div>
    <div class="flex w-full flex-1 h-0">

      <div style="width: 120px" class="mr-3">
        <!-- 左侧顶层分类       -->
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

  </div>


</template>

<script setup lang='ts'>
import {ref, onMounted, computed, watch} from 'vue'
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

const emit = defineEmits(['addIcon'])

const props = defineProps({
  value: String
})
const currentTopTypeId = ref(0)
const currentSubType = ref({})
const currentTopType = ref({})
const currentThirdType = ref({})
const currentThirdTypeId = ref('')
// 获取所有的图标
const navTypes = ref({})
const words = ref('')
// 索引
const clickIndex = ref(0)

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
  name: '打开', value: 'open'

}, {
  name: '添加到桌面', value: 'addToDesk'
}])
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
    list.value = convertNavToIcon(await navDb.searchNavByWords(value))
  } else {
    await getCurrentNavList()
  }
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
  if(currentThirdTypeId.value){
    return setThirdType(currentThirdTypeId.value)
  }
  if(currentSubType.value.id){
    return setSecondType(currentSubType.value)
  }
  if(currentTopType.value.id){
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
  const rs = await navDb.getNavsByTopId(currentTopType.value.id)
  console.log(rs, currentTopType.value.id)
  list.value = convertNavToIcon(rs)
}

const setSecondType = async (secondType) => {
  currentSubType.value = secondType;
  currentThirdType.value = {}
  currentThirdTypeId.value = ''
  const rs = await navDb.getNavsBySecondId(currentSubType.value.id)
  list.value = convertNavToIcon(rs)
}
const setThirdType = async (thirdTypeId) => {

  if(!thirdTypeId){
    const rs = await navDb.getNavsBySecondId(currentSubType.value.id)
    list.value = convertNavToIcon(rs)
    return
  }
  currentThirdType.value = currentSubType.value.children?.find((item) => {
    return item.id === thirdTypeId.value
  });
  const rs = await navDb.getNavsByThirdId(thirdTypeId)
  list.value = convertNavToIcon(rs)
}
onMounted(async () => {
  navTypes.value = await navDb.getNavTypesTree()
  currentTopTypeId.value = navTypes.value[0].id
  currentTopType.value = navTypes.value[0]
  setTopType(currentTopType.value)
})
const convertNavToIcon = (list) => {
  return list.map((item) => {
    return {
      "id": item.id,
      "name": item.title,
      "summary": item.summary || '网站',
      "icon": cdnUrl('/nav_icon/' + item.logo),
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
  return [{name:'全部',value:''},...types.map(type => {
    return {
      name: type.title,
      value: String(type.id)
    }
  })]
}

// 添加图标
const openIcon = (item) => {
  if (openType.value == 'open') {
    switch (linkType.value) {
      case 'default':
        browser.openInSystem(item.url)
        break
      case 'internal':
        browser.openInTable(item.url)

        break
      case 'thisky':
        browser.openInInner(item.url)
        break
      case 'mob':
        browser.openInMobMod(item.url)
    }
  } else {
    let icon = useFileConversionIcon(item)
    icon.open.mode = linkType.value
    useAddCard("myIcons", {
      iconList: [icon],
      newIcon: true,
    }, undefined)
    message.success('添加导航 ' + item.name + ' 成功')
  }


}

</script>
<style lang='scss' scoped></style>
