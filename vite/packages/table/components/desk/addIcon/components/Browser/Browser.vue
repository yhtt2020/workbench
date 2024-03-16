<template>
    <div class="flex w-full h-full " style="overflow:hidden;" @wheel.stop>
        <!-- <LeftMenu @changeFolder="changeFolder" @refresh="refresh">
        </LeftMenu> -->
        <WebList 
            class="w-full h-full" 
            @refresh="refresh" 
            @changeIcon="changeIcon" 
            @countFavo="countFavo"
            @showRenameModal="showRenameModal" 
            :checkFlag="isMultiple" 
            :showList="showList" 
            :menus="menus"
            :rightMenu="rightMenu">
        </WebList>
    </div>
    <!-- 修改网址名称 -->
    <xt-modal 
        title="编辑名称" 
        :maskIndex="1001" 
        :index="1002" 
        boxClass="rounded-xl p-4" 
        :mask="true" 
        :header="true" 
        :footer="true" 
        v-model="renameFlag" 
        v-if="renameFlag" 
        @ok="changeName" >
      <div class="relative flex items-center xt-modal rounded-xl" style="width: 466px; height: 50px;" >
        <a-input
          class="w-full h-10 xt-mask xt-text"
          style="border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;"
          placeholder="请输入网站名称"
          allow-clear
          v-model:value="rename">
        </a-input>
        <xt-button @click="rename = tmpName" :radius="10" :w="40" :h="40" class="ml-3 xt-main-bg">
            <xt-new-icon icon="fluent:arrow-clockwise-16-regular" size="20" />
        </xt-button>
      </div>
    </xt-modal>

</template>

<script setup lang='ts'>
import { ref, computed, onMounted, toRefs } from 'vue'
import { nanoid } from 'nanoid'
import { message } from 'ant-design-vue'
import { storeToRefs } from 'pinia';

import { favoStore } from '../../../../../apps/favorites/store'
import { useIconStore } from '../../store'

import WebList from './WebList.vue';
import LeftMenu from '../../../../../apps/favorites/components/LeftMenu.vue';

const favo = favoStore()
const { isFavorites, allList, folderList, folderIndex, browserList, updateTime, folderIcons } = storeToRefs(favo)

const store = useIconStore()
const { isMultiple,multipleList } = storeToRefs(store)

const resTmp = ref([])
const itemTmp = ref({})
const defaultDeskIcon = ref({
    customData: {
        customSize: '1x1',
        groupTitle: '分组',
        iconList: [
            {
                open: {
                    type: 'default',
                    value: null,
                },
                src: null,
                titleValue: '',
            }
        ],
        size: {
            h: "204px",
            w: "280px"
        },
        zoom: {
            state: true,
            value: ""
        },
    },
    id: null,
    name: "myIcons"
})

const defaultFolderIcon = ref({
    attributeEdit: true,
    bg: '',
    iconShape: "square",
    iconState: "cover",
    iconType: "",
    isBg: false,
    isName: true,
    isRadius: false,
    lastUseTime: '',
    mode: "link",
    radius: 5,
    size: "1x1",
    summary: "",
    type: '',
    useCount: '',
    name: "",
    value: '',
    icon: null,
})
const renameFlag = ref(false)
const rename = ref('')
const tmpName = ref('')
const tmpGuid = ref('')

const deskIcons = ref([])

const props = defineProps({
    value: String,
    menus: Array,
    nav:Object,
})

const { value, menus } = toRefs(props)

const rightMenu = computed(() => {
    return [
        {
            label: '复制网址',
            newIcon: 'fluent:copy-20-regular',
            callBack: async () => {
                require('electron').clipboard.writeText(itemTmp.value.url)
                message.success('复制内容成功')
            }
        },
        {
            label:'添加到导航栏',
            newIcon:'fluent:star-20-regular', 
            children:[
            ]
        },
        ...menus.value
    ]
})

const rightMenus = computed(() => {
    return {
        
    }
})

// 加载数据
const refresh = async () => {
    let arrTmp = Object.keys(browserList.value)
    updateTime.value = new Date().getTime()
    folderList.value = []
    let res = []
    try {
        for (const browser of arrTmp) {
            const data = await tsbApi.system.getBrowserBookmark(browser)
            if (data.result) {
                for (const bookmark of Object.values(data.result)) {
                    resTmp.value = []
                    res.push(...flattenChildrenArray(bookmark, browser, 0))
                    folderList.value.unshift({
                        name: '最近添加',
                        type: 'recent',
                        browser: browser,
                        rename: null,
                        time: new Date().getTime()
                    })
                    folderList.value.unshift({
                        name: '全部',
                        type: 'all',
                        browser: browser,
                        rename: null,
                    })
                }
                folderList.value.unshift({
                    name: '我的收藏',
                    type: 'favo',
                    rename: null,
                    unRead: false,
                })
                allList.value = mergeArraysByGuid(allList.value, res)
            } else {
                throw new Error('浏览器收藏夹读取失败！')
            }
        }
    } catch (error) {
        message.error(error.message);
    }
}

// 分解数据，将数据展开
const flattenChildrenArray = (obj, browser, level, parent) => {
    let num = 0
    const time = new Date().getTime()
    obj.children?.forEach((item) => {
        if (item.type != 'folder') {
            resTmp.value.push({
                ...item,
                browser,
                parent,
                icon: null,
                rename: null,
                favo: false,
                check: false,
                time: time,
            })
            num++
        }
        if (item.children) {
            flattenChildrenArray(
                item,
                browser,
                level + 1,
                level === 0 ? item.guid : parent)
        }
    })
    if (level == 1) {
        folderList.value.push({
            ...obj,
            browser,
            num,
            rename: null,
            time: time,
            type: 'folder',
            unRead: false,
        })
    }
    return resTmp.value
}

// 展示数据
const showList = computed(() => {
    const folder = folderList.value[folderIndex.value]
    if (folder.type === 'all') {
        let nn = []
        nn = allList.value.reduce((acc, item) => {
            if (item.browser === folder.browser && (value.value.indexOf(value.value) > -1 || item.url.indexOf(value.value) > -1)) {
                acc.push(item)
            }
            return acc
        }, [])
        return nn
    } else if (folder?.type == 'folder') {
        return allList.value.reduce((acc, item) => {
            if (item.parent == folder.guid && (value.value.indexOf(value.value) > -1 || item.url.indexOf(value.value) > -1)) {
                acc.push(item)
            }
            return acc
        }, [])
    } else if (folder?.type == 'favo') {
        return allList.value.reduce((acc, item) => {
            if (item.favo && (value.value.indexOf(value.value) > -1 || item.url.indexOf(value.value) > -1)) {
                acc.push(item)
            }
            return sortByFavoTime(acc)
        }, [])
    } else if (folder?.type == 'recent') {
        return allList.value.reduce((acc, item) => {
            if (item.browser === folder.browser && item.recent && (value.value.indexOf(value.value) > -1 || item.url.indexOf(value.value) > -1)) {
                acc.push(item)
            }
            return acc
        }, [])
    }
})

// 根据收藏时间进行排序
const sortByFavoTime = (arr) => {
    return arr.sort((a, b) => {
        return b.favoTime - a.favoTime
    })
}

// 修改格式，添加图标到桌面和文件夹
const changeIcon = (item) => {
    if (item.length === 1) itemTmp.value = item[0]
    let newFolder = []
    let newIcon = []
    item.forEach(i => {
        // 新增为桌面图标
        i.value = i.url
        i.type = 'default'
        newIcon.push(i)

        newFolder.push({
            ...defaultFolderIcon,
            ...i
        })
    })
    folderIcons.value = newFolder
    multipleList.value.push(...newIcon)
    // console.log(multipleList.value)
}

// 重命名
const showRenameModal = (item) => {
    renameFlag.value = true
    tmpName.value = item.name
    tmpGuid.value = item.guid
}

// 重命名
const changeName = () => {
    if(rename.value === '') {
        message.error('名字不能为空')
    }else{
        allList.value.forEach((i) => {
            if(i.guid === tmpGuid.value){
                i.rename = rename.value
                message.success('名字修改成功')
            }
        })
    }
}
</script>

<style lang='scss' scoped></style>