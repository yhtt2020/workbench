<template>
    <div class="flex w-full h-full " style="overflow:hidden;" @wheel.stop>
        <LeftMenu @changeFolder="changeFolder" @refresh="refresh">
        </LeftMenu>
        <WebList class="w-full h-full" @refresh="refresh" @changeIcon="changeIcon" @countFavo="countFavo"
            @showRenameModal="showRenameModal" :checkFlag="isMultiple" :showList="showList" :menus="menus"
            :rightMenu="rightMenu">
        </WebList>
    </div>

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

const deskIcons = ref([])

const props = defineProps({
    value: String,
    menus: Array,
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
        ...menus.value
    ]
})

// 切换文件夹
const changeFolder = (index) => {
    console.log(index)
    folderIndex.value = index
}

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

const changeIcon = (item) => {
    if (item.length === 1) itemTmp.value = item[0]
    let newFolder = []
    let newIcon = []
    item.forEach(i => {
        newIcon.push({
            ...defaultDeskIcon.value,
            customData: {
                ...defaultDeskIcon.customData,
                iconList: [
                    {
                        open: {
                            type: 'default',
                            value: i.url,
                        },
                        src: i.icon,
                        titleValue: i.title,
                    }
                ]
            },
            id: nanoid(6),
        })
        newFolder.push({
            ...defaultFolderIcon,
            ...i
        })
    })
    folderIcons.value = newFolder
    multipleList.value.push(...newIcon)
    console.log(multipleList.value)
}
</script>

<style lang='scss' scoped></style>