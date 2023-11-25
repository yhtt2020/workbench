<template>
    <div id="left-drop" style="z-index: 99999; position: fixed; top: 0; left: 0;width: 300px;height: 100vh;border: 1px solid red;" @drop.prevent="drop"></div>
    <div id="foot-drop" @drop.prevent="drop"
        style="z-index: 999; position: fixed;bottom: 0;left: 300px;right: 300px;width:calc(100vw - 600px);height: 300px;border: 1px solid red;">
    </div>
    <div id="right-drop" @drop.prevent="drop"
        style="z-index: 999; position: fixed;bottom: 0px; right: 0;width: 300px;height:calc(100vh );border: 1px solid red;">
    </div>
    <NewModel class="bottom-edit" :modelValue="modelValue" :nav="true" :header="true" :footer="false" :esc="true"
        :back="false" @no="setQuick" title="" :mask="false" :maskIndex="99" :index="300">
        <template #nav>
            <div class="p-3 -mt-4 -mb-4 -ml-4 xt-bg" style="border-radius: 12px 0px 0px 12px;width: 185px;height: 516px;">
                <div class=" flex w-full h-[48px] items-center" style="line-height: 48px;">
                    <xt-new-icon icon="fluent:grid-16-regular" size="20" class="ml-3 xt-text-2" />
                    <div class="ml-4 text-base xt-text">图标</div>
                </div>
                <div class="w-full h-[1px]  mt-3" style="background: var(--divider);"></div>
                <xt-button v-for="(item, index) in sideBar" style="border-radius: 10px;" :w="160" :h="48" :style="{
                    'background': currentIndex === index ? 'var(--active-secondary-bg)' : 'transparent'
                }" @click="onSelect(index)" class="flex flex-col mt-2 text-base xt-text hover-style">
                    <div style="text-align: left !important;"> {{ item.name }}</div>
                </xt-button>
            </div>

        </template>
        <template #header-left>
            <!-- 输入框 -->
            <a-input v-if="currentTag !== 'recommendation' && currentTag !== 'custom'" placeholder="搜索"
                style="width: 244px;height: 40px;border-radius: 10px;margin-left: 12px" v-model:value="inputValue"
                @keydown.enter="onSearch">
                <template #suffix>
                    <xt-new-icon icon="fluent:search-16-regular" size="20" class="xt-text-2" />
                </template>
            </a-input>
            <!-- windows应用 -->
            <div v-if="currentTag === 'tableApp'"
                class="ml-2 xt-bg-2 h-[52px] rounded-xl flex items-center p-2  justify-between">
                <div class="text-sm xt-text-2">选择windows桌面图标,支持多选批量添加</div>
                <div class="flex items-center ">
                    <div style="color:var(--active-bg)" class="mr-3 pointer" @click="selectAll">全选</div>
                    <xt-button w="107" h="32" radius="8" style="background: var(--active-bg);">
                        <div class="flex items-center justify-center" style="color: rgba(255, 255, 255, 0.85) !important;">
                            批量添加(3)</div>
                    </xt-button>
                </div>

            </div>

            <!-- 下拉选择 -->
            <a-dropdown v-if="currentTag == 'webNavigation'">
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
        <template #header-right>
            <a-dropdown trigger="['click']">
                <template #overlay>
                    <a-menu class="rounded-xl xt-bg" style="border-radius: 12px !important;">
                        <a-menu-item @click="handleMenuClick(item)" key="index" v-for="(item, index) in addIconPosition"
                            class="flex items-center justify-center hover-style ">
                            <div class="flex items-center justify-center xt-text rounded-md">{{ item.title }}</div>
                        </a-menu-item>
                    </a-menu>
                </template>
                <xt-button :w="120" :h="40" class="ml-2">
                    <div class="flex justify-between">
                        <div class="xt-text text-base">{{ defaultTitle.title }}</div>
                        <xt-new-icon icon="fluent:chevron-left-16-regular" size="20"
                            class="-rotate-90 xt-text"></xt-new-icon>
                    </div>
                </xt-button>
            </a-dropdown>
        </template>
        <div class="w-[850px] ml-3 mainList" style="height: 400px;">
            <Custom v-if="currentTag === 'custom'" />
            <Introduce v-else ref="introduce" :recommendation="sideBar[currentIndex]" :selectList="this.otherList"
                :inputValue="inputValue" />
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
import { addIconPosition } from './index'
import Sortable from 'sortablejs'
import { message } from 'ant-design-vue'
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
                    tag: 'custom'
                }
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
            webList: [],
            inputValue: '',
            addIconPosition,
            defaultTitle: {},
            targetDivName: '',
            darggingCore: false,
            dropList:[]
        }
    },
    methods: {
        ...mapActions(navStore, ['setFootNavigationList', 'sortFootNavigationList', 'removeFootNavigationList', 'setSideNavigationList', 'sortSideNavigationList', 'removeSideNavigationList', 'setRightNavigationList', 'sortRightNavigationList', 'removeRightNavigationList', 'setNavigationToggle']),
        onSelect(index) {
            this.currentIndex = index
            this.inputValue = ''
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
        },
        onClick(index) {
            this.clickIndex = index

        },
        selectAll() {
            this.$refs.introduce.addAllIcon()
        },
        handleMenuClick(item) {
            this.defaultTitle = item
            this.selectNav = item.value
        },
        // 拖拽
        mainDrop() {
            let that = this
            const main = this.$refs.introduce.$el.querySelector('.mainList')
            // console.log(main,'className');
            // let main = document.querySelector('.mainList')
            Sortable.create(main, {
                sort: false,
                animation: 150,
                removeCloneOnHide: true,
                forceFallback: false,
                onStart(evt) {
                    that.darggingCore = true
                    that.draggingArea('left-drop', evt.oldIndex, that.sideNavigationList, that.setSideNavigationList, that.currentList)
                    that.draggingArea('right-drop', evt.oldIndex, that.rightNavigationList, that.setRightNavigationList, that.currentList)
                    that.draggingArea('foot-drop', evt.oldIndex, that.footNavigationList, that.setFootNavigationList, that.currentList)
                },
            })
        },
        draggingArea(id, oldIndex, NavigationList, setNavigationList, source, compare = true) {
            let that = this
            let slider = document.getElementById(id)
            slider.ondragover = function (ev) {
                ev.preventDefault()
            }
            slider.ondrop = () => {
                if (that.darggingCore || compare === false) {
                    if (!NavigationList.find(j => j.name === source[oldIndex].name)) {
                        // console.log(source[oldIndex]);
                        setNavigationList(source[oldIndex])
                        that.$refs.introduce.updateMainNav()
                    } else {
                        message.info('已添加', 1)
                    }
                }
            }
        },
        async drop(e) {
            let files = e.dataTransfer.files
            console.log(e.x)
            if(e.x<300){
                this.selectNav='left'
            }else if(e.x>300){
                this.selectNav='foot'
            }
            let filesArr = []
            if (files && files.length > 0) {
                for (let i = 0; i < files.length; i++) {
                    filesArr.push(files[i].path)
                }
            }
            this.dropList = await Promise.all(filesArr.map(async (item) => {
                const fileName = item.substring(item.lastIndexOf("\\") + 1);
                let dropFiles = await tsbApi.system.extractFileIcon(item)
                return { icon: `${dropFiles}`, name: `${fileName}`, path: item }
            }))
            this.$refs.introduce.clickRightListItem(this.dropList)
            // 添加完后清空
            this.dropList=[]
        },
    },
    computed: {
        ...mapWritableState(useNavigationStore, ['selectNav', 'currentList']),
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
        },
        currentTag() {
            return this.sideBar[this.currentIndex].tag
        },
        // 当前添加图标的导航栏
        currentNav() {
            return this.addIconPosition.find(i => i.value === this.selectNav)
        }

    },
    created() {
        this.loadDeskIconApps()
    },
    mounted() {
        this.defaultTitle = this.currentNav
        this.targetDivName = this.$refs.introduce.$refs.targetDiv

        this.$nextTick(() => {
            this.mainDrop()
            // const className = list.querySelector('.mainList')
            // console.log(className, list)
        })
    },
}
</script>
<style lang='scss' scoped>
.hover-style {
    &:hover {
        background: var(--active-secondary-bg) !important;
    }
}

:deep(.ant-input) {
    color: var(--secondary-text);

    &::placeholder {
        color: var(--secondary-text);
    }
}

:deep(.ant-dropdown-menu-item) {
    &:hover {
        background: var(--active-secondary-bg) !important;
    }
}
</style>