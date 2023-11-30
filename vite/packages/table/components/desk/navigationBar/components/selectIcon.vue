<template>
    <div class="flex flex-wrap" v-for="(item, index) in filterList">
        <div @click="clickRightListItem(item, index)" @contextmenu="addIcon(item, index)"
            class="w-[188px] h-[188px] xt-bg-2 rounded-xl flex justify-center items-center flex-col relative mr-3 mb-3 pointer">
            <div class="w-[64px] h-[64px] rounded-xl xt-bg flex items-center justify-center">
                <div style="width: 32px; height: 32px;border-radius: 8px;" v-if="item.type === 'systemApp'"
                    class="flex items-center justify-center rounded-lg ">
                    <navIcon :icon="item.icon" class="test" style="width:28px;height:28px;fill:var(--primary-text);">
                    </navIcon>
                </div>
                <div v-else style="width: 45px; height: 45px" class="flex items-center justify-center">
                    <a-avatar :size="32" shape="square" :src="renderIcon(item.icon)"></a-avatar>

                </div>
            </div>
            <div class="pl-3 pr-3 mt-3 mb-2 text-base xt-text omit-1">{{ item.name }}</div>
            <div class="pl-3 pr-3 xt-text-2 omit" style="font-size: 14px;text-align: center;">{{ item.summary ||
                recommendation.name }}</div>
            <div class="absolute top-3 right-3">
                <xt-button :w="24" :h="24" :style="{ background: item.addNav ? '#52C41A' : 'var(--active-bg)' }"
                    @click="clickRightListItem(item, index)">
                    <div class="flex items-center justify-center" v-if="item.addNav">
                        <xt-new-icon icon="fluent:checkmark-16-regular" size="20"
                            style="padding:2px;color: rgba(255, 255, 255, 0.85) !important;"></xt-new-icon>
                    </div>
                    <div v-else class="flex items-center justify-center"><xt-new-icon icon="fluent:add-16-regular"
                            class="xt-text" size="20"
                            style="padding:2px;margin-left:2px;margin-top:1px;color: rgba(255, 255, 255, 0.85) !important;"></xt-new-icon>
                    </div>
                </xt-button>
            </div>

        </div>
    </div>
</template>

<script >
import { navStore } from '../../../../store/nav'
import { useNavigationStore } from '../navigationStore'
import { mapActions, mapWritableState } from 'pinia'
import { Icon as navIcon } from '@iconify/vue'
import { renderIcon } from '../../../../js/common/common'
import { message } from 'ant-design-vue'
// const props = defineProps({
//     recommendation: {
//         type: String
//     },
//     filterList:Array
// })
// const emit = defineEmits(['addIcon'])
// const addIcon = (item,index) => {
//     emit('addIcon', item, index)
// }
export default {
    components: {
        navIcon
    },
    data() {
        return {
            // 批量添加
            selectList: []
        }
    },
    props: {
        filterList: Array,
        recommendation: String
    },
    methods: {
        ...mapActions(navStore, ['setFootNavigationList', 'sortFootNavigationList', 'removeFootNavigationList', 'setSideNavigationList', 'sortSideNavigationList', 'removeSideNavigationList', 'setRightNavigationList', 'sortRightNavigationList', 'removeRightNavigationList', 'setNavigationToggle']),
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
        renderIcon(icon) {
            return renderIcon(icon);
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
        addIcon(item, index) {
            const exists = this.selectList.some(selectItem => selectItem.name === item.name);

            // 如果不存在，则将其添加到 selectList
            if (!exists) {
                this.selectList.push(item);
                this.updateMainNav(item, 'add')
            } else {
                this.updateMainNav(item, 'del')
                this.selectList = this.selectList.filter(selectItem => selectItem.name !== item.name);
                console.log('Item already exists in selectList:', item);
            }
        }
    },
    computed: {
        ...mapWritableState(useNavigationStore, ['selectNav', 'currentList']),
        ...mapWritableState(navStore, ['mainNavigationList', 'sideNavigationList', 'footNavigationList', 'rightNavigationList', 'navigationToggle']),
    }
}
</script>
<style lang='scss' scoped>
.omit-1 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;
    display: block;
    /* 使用块级元素 */
    max-width: 150px;
    /* 设置适当的最大宽度 */
    white-space: nowrap;
}
</style>