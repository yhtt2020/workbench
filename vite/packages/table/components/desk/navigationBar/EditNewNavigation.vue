<template>
    <!-- <div class="flex flex-col"> -->
    <!-- <div class="flex justify-between">
        <div id="left-drop" class="border-index " style=" width: 300px;height: 100vh;" @drop.prevent="drop"
            @dragover.prevent=""></div>
        <div class="flex flex-col justify-end">
            <div id="foot-drop" class="border-index " @drop.prevent="drop" style="width:calc(100vw - 600px);height: 300px;"
                @dragover.prevent=""></div>
        </div>
        <div id="right-drop" class="border-index" @drop.prevent="drop" style=" width: 300px;height:calc(100vh );"
            @dragover.prevent=""></div>


    </div> -->
    <NewModel class="bottom-edit" :modelValue="modelValue" :nav="true" :header="true" :footer="false" :esc="true"
        :boxClass="'pr-4 pt-4'" :back="false" @no="setQuick" title="" :mask="false" :index="100">
        <template #nav>
            <div class="relative p-3 -mt-4 xt-bg" style="border-radius: 12px 0px 0px 12px;width: 185px;"
                :style="{ height: `${navHeight}px` }">
                <div class=" flex w-full h-[48px] items-center" style="line-height: 48px;">
                    <xt-new-icon icon="fluent:grid-16-regular" size="20" class="ml-3 xt-text-2" />
                    <div class="ml-4 text-base xt-text">图标</div>
                </div>
                <div class="w-full h-[1px]  mt-3" style="background: var(--divider);"></div>
                <div v-for="(item, index) in navList" style="border-radius: 10px;" :style="{
                    'background': currentIndex === index ? 'var(--active-secondary-bg)' : 'transparent'
                }" @click="onSelect(index)"
                    class="flex flex-col justify-center mt-2 text-base xt-text hover-style w-[160px] h-[48px] pointer">
                    <div style="text-align: left !important;" class="ml-12 text-base xt-text"> {{ item.name }}</div>
                </div>
                <div v-if="!this.introduceVisible" class="absolute bottom-3 left-3">
                    <a-tooltip title="推荐">
                        <xt-button :w="40" :h="40" @click="backIntroduce"><xt-new-icon
                                icon="fluent:emoji-smile-slight-24-regular" size="20"></xt-new-icon></xt-button>
                    </a-tooltip>

                </div>
            </div>
        </template>
        <template #header-left>
            <!-- 输入框 -->
            <a-input v-if="currentTag !== 'recommendation' && currentTag !== 'custom'" placeholder="搜索"
                style="width: 244px;height: 32px;border-radius: 10px;margin-left: 12px;background: var(--main-bg);" v-model:value="inputValue"
                @keydown.enter="onSearch" class="">
                <template #suffix>
                    <xt-new-icon icon="fluent:search-16-regular" size="20" class="xt-text-2" />
                </template>
            </a-input>
            <div class="flex" v-if="currentTag == 'recommendation'">
                <div class="flex justify-center ml-3 mr-2"><xt-new-icon icon="fluent-emoji:rocket" size="25" /></div>
                <div class="xt-base xt-text">推荐</div>
            </div>
        </template>
        <template #header-right>
            <div class="ml-3 text-base xt-text-2">添加到：</div>
            <a-dropdown trigger="['click']">
                <template #overlay>
                    <a-menu class="rounded-xl xt-modal" style="border-radius: 12px !important;">
                        <a-menu-item @click="handleMenuClick(item)" key="index" v-for="(item, index) in addIconPosition"
                            class="flex items-center justify-center hover-style ">
                            <div class="flex items-center justify-center rounded-md xt-text">{{ item.title }}</div>
                        </a-menu-item>
                    </a-menu>
                </template>
                <xt-button :w="120" :h="32" class="">
                    <div class="flex justify-between">
                        <div class="text-base xt-text">{{ defaultTitle.title }}</div>
                        <xt-new-icon icon="fluent:chevron-left-16-regular" size="20"
                            class="-rotate-90 xt-text"></xt-new-icon>
                    </div>
                </xt-button>
            </a-dropdown>
        </template>
        <div class="ml-3 mainList" :style="{ height: `${contentHeight}px`, width: `${contentWidth}px` }"
            style="box-sizing: border-box;">
            <Introduce ref="introduce" :recommendation="currentNavBar" :selectList="this.otherList"
                :inputValue="inputValue" />
        </div>
    </NewModel>
    <teleport to="body" :disabled="false">
        <Msg :modelValue="modalVisible" :title="defaultTitle.title" :text='msgText' @no="this.modalVisible = false" @ok="onOk"></Msg>
    </teleport>


    <!-- </div> -->
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
import Msg from '../../../ui/new/msg/index.vue'
const { appModel } = window.$models
export default {
    name: 'EditNewNavigation',
    components: {
        NewModel,
        Introduce,
        Custom,
        Msg,
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
                    name: '桌面图标',
                    tag: 'tableApp',
                    active: 0
                },
                {
                    name: '系统功能',
                    tag: 'systemApp',
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

            ],
            suggestNavigationList: [

                {
                    type: 'systemApp',
                    icon: '/logo/community.svg',
                    name: '社群',
                    event: 'chat',
                    tab: 'community',
                    fn: () => {
                        vm.$router.push({ name: 'chat' })
                    },
                    tag: 'recommendation'
                },
                {
                    type: 'systemApp',
                    icon: '/logo/efficiency.svg',
                    name: '效率助手',
                    tab: 'work',
                    event: 'work',
                },
                {
                    type: 'systemApp',
                    icon: '/logo/home.svg',
                    name: '桌面主页',
                    event: 'home',
                },
                {
                    type: 'systemApp',
                    icon: '/logo/settings.svg',
                    name: '设置中心',
                    event: 'setting',
                    fn: () => { vm.$router.push({ name: 'setting' }) }
                },

                {
                    type: 'systemApp',
                    icon: '/logo/music.svg',
                    name: '网易云音乐',
                    event: 'music',
                    tag: 'recommendation'
                },

                {
                    type: 'systemApp',
                    icon: '/logo/todo.svg',
                    name: '待办',
                    event: 'todo',
                    fn: () => { vm.$router.push({ name: 'todo' }) }
                },
                {
                    "type": "systemApp",
                    "icon": "/logo/ai.svg",
                    "name": "AI助手",
                    "event": "ai"
                },
                {
                    type: 'systemApp',
                    icon: '/logo/app.svg',
                    name: '应用中心',
                    event: 'apps',
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
            dropList: [],
            windowHeight: 720,
            navHeight: 512,
            contentHeight: 420,
            contentWidth: 800,
            modalVisible: false,
            currentTitle: null
        }
    },
    methods: {
        ...mapActions(navStore, ['setFootNavigationList', 'sortFootNavigationList', 'removeFootNavigationList', 'setSideNavigationList', 'sortSideNavigationList', 'removeSideNavigationList', 'setRightNavigationList', 'sortRightNavigationList', 'removeRightNavigationList', 'setNavigationToggle']),
        onSelect(index) {
            this.currentIndex = index
            this.inputValue = ''
            this.currentTitle = null
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
        handleMenuClick(item) {
            this.defaultTitle = item
            this.selectNav = item.value
        },
        onOk() {
            if (this.selectNav === 'foot') {
                this.navigationToggle[2] = true
                this.modalVisible = false
            } else if (this.selectNav === 'left') {
                this.navigationToggle[0] = true
                this.modalVisible = false
            } else if (this.selectNav === 'right') {
                this.navigationToggle[1] = true
                this.modalVisible = false
            }
        },
        backIntroduce() {
            this.currentTitle = 'recommendation'
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
                    if (that.selectNav === 'left') {
                        that.draggingArea('left-bar', evt.oldIndex, that.sideNavigationList, that.setSideNavigationList, that.currentList)
                    } else if (that.selectNav === 'right') {
                        that.draggingArea('right-bar', evt.oldIndex, that.rightNavigationList, that.setRightNavigationList, that.currentList)
                    } else if (that.selectNav === 'foot') {
                        that.draggingArea('bottom-bar', evt.oldIndex, that.footNavigationList, that.setFootNavigationList, that.currentList)
                    }
                    // that.draggingArea('left-drop', evt.oldIndex, that.sideNavigationList, that.setSideNavigationList, that.currentList)

                    // that.draggingArea('right-drop', evt.oldIndex, that.rightNavigationList, that.setRightNavigationList, that.currentList)

                    // that.draggingArea('foot-drop', evt.oldIndex, that.footNavigationList, that.setFootNavigationList, that.currentList)


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
        // 拖拽桌面图标
        async drop(e) {
            // this.modelValue=false
            const width = window.innerWidth
            let files = e.dataTransfer.files
            if (e.x <= 300) {
                this.selectNav = 'left'
            } else if (e.x > 300 && e.x < width - 300) {
                this.selectNav = 'foot'
            } else if (e.x >= width - 300) {
                this.selectNav = 'right'
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
            this.dropList = []
            // this.modelValue=true
        },

        handleResize() {
            this.windowHeight = window.innerHeight
            if (this.windowHeight > 1000) {
                this.navHeight = 720
                this.contentHeight = 644
            } else if (this.windowHeight < 1000 && this.windowHeight > 800) {
                this.navHeight = 620
                this.contentHeight = 544
            } else {
                this.navHeight = 528
                this.contentHeight = 448
                this.contentWidth = 600
            }
        },
        // 区分推荐图标属于哪个分类
        updateIntroduce() {
            this.suggestNavigationList.forEach((item) => {
                const foundItem = this.ClassifyData.find((i) => i.name === item.name);
                if (foundItem) {
                    const found = this.sideBar.find((i) => i.tag === foundItem.type)
                    item.className = foundItem.summary || found.name;
                } else if (item.type) {
                    const found = this.sideBar.find((i) => i.tag === item.type)
                    item.className = found.name;
                }

            });
        }

    },
    computed: {
        ...mapWritableState(useNavigationStore, ['selectNav', 'currentList', 'introduceVisible']),
        ...mapWritableState(navStore, ['mainNavigationList', 'sideNavigationList', 'footNavigationList', 'rightNavigationList', 'navigationToggle']),
        filterList() {
            return this.ClassifyData.filter(i => {
                const sideBarTag = this.navList[this.currentIndex].tag
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
            const sideBarTag = this.navList[this.currentIndex].tag;
            // console.log('this.webList',this.webList)
            // console.log('this.filterList',this.filterList)
            if (sideBarTag === 'recommendation' || this.currentTitle === 'recommendation') {
                return this.suggestNavigationList;
            } else if (sideBarTag === 'webNavigation') {
                return this.webList
            } else {
                return this.filterList;
            }
        },
        currentTag() {
            if (this.currentTitle === 'recommendation') {
                return 'recommendation'
            }
            return this.navList[this.currentIndex].tag
        },
        currentNavBar() {
            if (this.currentTitle === 'recommendation') {
                return this.sideBar[0]
            } else {
                return this.navList[this.currentIndex]
            }
        },
        // 当前添加图标的导航栏
        currentNav() {
            return this.addIconPosition.find(i => i.value === this.selectNav)
        },
        navList() {
            if (this.introduceVisible === false) {
                return this.sideBar.filter(item => item.tag !== 'recommendation')
            } else {
                return this.sideBar
            }
        },
        msgText() {
            return `当前${this.defaultTitle.title}没有开启，是否选择开启导航栏`
        }

    },
    created() {
        this.loadDeskIconApps()
    },
    mounted() {
        if(this.currentNav){
           this.defaultTitle = this.currentNav
        }else{
            this.defaultTitle = {
                title: '底部导航栏',
                value: 'foot'
            }
            this.selectNav = 'foot'
        }
        this.targetDivName = this.$refs.introduce.$refs.targetDiv
        this.updateIntroduce()
        this.$nextTick(() => {
            this.mainDrop()
        })
        window.addEventListener("resize", this.handleResize)
        this.handleResize()
    },
    beforeUnmount() {
        window.removeEventListener("resize", this.handleResize)
    },
    watch: {
        selectNav() {
            this.defaultTitle = this.currentNav
            if (this.selectNav === 'foot' && !this.navigationToggle[2]) {
                this.modalVisible = true
            } else if (this.selectNav === 'left' && !this.navigationToggle[0]) {
                this.modalVisible = true
            } else if (this.selectNav === 'right' && !this.navigationToggle[1]) {
                this.modalVisible = true
            } else {
                this.modalVisible = false
            }
        },

    },
    unmounted() {
        if (this.introduceVisible) {
            this.introduceVisible = false
        }

    },
}
</script>
<style lang='scss' scoped>
.border-index {
    // border: 1px solid red;
    z-index: 200;
}

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
