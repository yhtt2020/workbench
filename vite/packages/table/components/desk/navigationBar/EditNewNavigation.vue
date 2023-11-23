<template>
    <NewModel style="max-width: 1000px; height: 540px;" :modelValue="modelValue" :nav="true" :header="true" :footer="false"
        :esc="true" :back="false" @no="setQuick" title="" :mask="false" :mask-index="99" :index="1000">
        <template #nav>
            <div class="p-3 -mt-4 -mb-4 -ml-4 xt-bg" style="border-radius: 12px 0px 0px 12px;width: 185px;height: 636px;">
                <div class=" flex w-full h-[48px] items-center" style="line-height: 48px;">
                    <xt-new-icon icon="fluent:grid-16-regular" size="20" class="ml-3 xt-text-2" />
                    <div class="ml-4 text-base xt-text">图标</div>
                </div>
                <div class="w-full h-[1px]  mt-3" style="background: var(--divider);"></div>
                <xt-button v-for="(item, index) in sideBar" style="border-radius: 10px;" :w="160" :h="48" :style="{
                    'background': currentIndex === index ? 'var(--active-secondary-bg)' : 'transparent'
                }" @click="onSelect(index)"
                    class="flex flex-col items-center justify-center mt-2 text-base xt-text hover-style">
                    <div> {{ item.name }}</div>
                </xt-button>
            </div>

        </template>
        <template #header-left>
            <!-- windows应用 -->
            <div v-if="sideBar[currentIndex].tag === 'tableApp'"
                class="ml-3 xt-bg-2 h-[52px] rounded-xl flex items-center p-4 justify-between">
                <div class="text-sm xt-text-2">选择你的windows桌面图标，支持多选批量添加。</div>
                <div class="flex items-center ">
                    <div style="color:var(--active-bg)" class="mr-3 pointer">全选</div>
                    <xt-button w="107" h="32" radius="8" style="background: var(--active-bg);">
                        <div class="flex items-center justify-center xt-text ">批量添加(3)</div>
                    </xt-button>
                </div>

            </div>
            <!-- 输入框 -->
            <a-input
                v-if="sideBar[currentIndex].tag !== 'tableApp' && sideBar[currentIndex].tag !== 'recommendation' && sideBar[currentIndex].tag !== 'custom'"
                placeholder="搜索" style="width: 244px;height: 40px;border-radius: 10px;margin-left: 12px">
                <template #suffix>
                    <xt-new-icon icon="fluent:search-16-regular" size="20" class="xt-text-2" />
                </template>
            </a-input>
            <!-- 下拉选择 -->
            <a-dropdown v-if="sideBar[currentIndex].tag == 'webNavigation'">
                <template #overlay>
                    <a-menu @click="handleMenuClick">
                        <a-menu-item key="1">
                            综合排序
                        </a-menu-item>
                    </a-menu>
                </template>
                <xt-button :w="160" :h="40" class="ml-3">
                    <div class="flex justify-between">
                        <div>综合排序</div>
                        <xt-new-icon icon="fluent:chevron-left-16-regular" size="20"
                            class="-rotate-90 xt-text"></xt-new-icon>
                    </div>
                </xt-button>
            </a-dropdown>


        </template>
        <div class="w-[850px] ml-3 " style="height: 520px;">
            <Custom v-if="sideBar[currentIndex].tag === 'custom'" />
            <Introduce v-else :recommendation="sideBar[currentIndex]" :selectList="this.otherList" />
        </div>
    </NewModel>
</template>
<script>
import { useNavigationStore } from './navigationStore'
import { navStore } from '../../../store/nav'
import { mapActions, mapWritableState } from 'pinia'
import NewModel from '../../../ui/new/modal/index.vue'
import Introduce from './components/Introduce.vue'
import { webMenus } from './index'
import navigationData from '../../../js/data/tableData'
import { getNavList } from '../../../page/app/addIcon/api/api'
import Custom from './components/Coutom.vue'
const { appModel } = window.$models
export default {
    name: 'EditNewNavigation',
    components: {
        NewModel,
        Introduce,
        Custom
    },
    data() {
        return {
            ClassifyData: [...navigationData.coolAppList, ...navigationData.systemAppList],
            modelValue: true,
            currentIndex: 0,
            sideBar: [
                {
                    name: '推荐',
                    tag: 'recommendation',
                    active: 0
                },
                {
                    name: '网址导航',
                    tag: 'webNavigation',
                    active: 0
                },
                {
                    name: '酷应用',
                    tag: 'coolApp',
                    active: 0
                },
                {
                    name: '轻应用',
                    tag: 'lightApp',
                    active: 0
                },
                {
                    name: '系统功能',
                    tag: 'systemApp',
                    active: 0
                },
                {
                    name: 'windows',
                    tag: 'tableApp',
                    active: 0
                },
                {
                    name: '自定义',
                    tag: 'custom',
                    active: 0
                },
            ],
            suggestNavigationList: [

                {
                    type: 'systemApp',
                    icon: 'fluent:chat-16-regular',
                    name: '社群(开发中)',
                    event: 'chat',
                    tab: 'community',
                    fn: () => {
                        vm.$router.push({ name: 'chat' })
                    },
                    tag: 'recommendation'
                },
                {
                    type: 'systemApp',
                    icon: 'fluent:document-bullet-list-multiple-24-regular',
                    name: '办公',
                    tab: 'work',
                    event: 'work',
                    tag: 'recommendation'
                },
                {
                    type: 'systemApp',
                    icon: 'fluent:games-16-regular',
                    name: '游戏',
                    tab: 'game',
                    event: 'gameIndex',
                    tag: 'recommendation'
                },

                {
                    type: 'systemApp',
                    icon: 'fluent:globe-16-regular',
                    name: '浏览器',
                    event: 'browser',
                    tag: 'recommendation'
                },

                {
                    type: 'systemApp',
                    icon: 'fluent:music-note-2-16-regular',
                    name: '音乐',
                    event: 'music',
                    tag: 'recommendation'
                },

                {
                    type: 'systemApp',
                    icon: 'fluent:image-multiple-16-regular',
                    name: '壁纸',
                    tab: 'paper',
                    event: 'my',
                    tag: 'recommendation'
                },

            ],
            nowClassify: 'systemApp',
            selectContent: '',
            webMenus,
            clickIndex: 0,
            webList: []
        }
    },
    methods: {
        onSelect(index) {
            this.currentIndex = index
        },
        setQuick() {
            this.$emit('setQuick')
        },
        async loadDeskIconApps() {
            const lightApps = await appModel.getAllApps()
            for (let i = 0; i < lightApps.length; i++) {
                lightApps[i].icon = lightApps[i].logo
                lightApps[i].type = 'lightApp'
            }
            const desktopApps = await ipc.sendSync('getDeskApps')
            for (let i = 0; i < desktopApps.length; i++) {
                desktopApps[i].type = 'tableApp'
            }
            const web = await getNavList()
            this.webList = [web]
            this.ClassifyData.push(...desktopApps, ...lightApps)
            // console.log(this.ClassifyData, 'this.ClassifyData')



        },
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
    },
    computed: {
        ...mapWritableState(useNavigationStore, ['selectNav','currentList']),
        ...mapWritableState(navStore, ['mainNavigationList', 'sideNavigationList', 'footNavigationList', 'rightNavigationList', 'navigationToggle']),
        filterList() {
            return this.ClassifyData.filter(i => {
                const sideBarTag = this.sideBar[this.currentIndex].tag
                // console.log(i)
                // 离线模式下隐藏 创意市场
                if (window.$isOffline) {
                    return i.type === sideBarTag && i.name.includes(this.selectContent) && i.name != '创意市场'
                } else {
                    return i.type === sideBarTag && i.name.includes(this.selectContent)

                }
            })
        },
        otherList() {
            const sideBarTag = this.sideBar[this.currentIndex].tag;
            if (sideBarTag === 'recommendation') {
                return this.suggestNavigationList;
            } else if (sideBarTag === 'webNavigation') {
                return this.webList
            } else {
                return this.filterList;
            }
        }

    },
    created() {
        this.loadDeskIconApps()
    },
}
</script>
<style lang='scss' scoped>
.hover-style {
    &:hover {
        background: var(--active-secondary-bg) !important;
    }
}

:deep(nav) {
    background-color: red !important;
}
</style>