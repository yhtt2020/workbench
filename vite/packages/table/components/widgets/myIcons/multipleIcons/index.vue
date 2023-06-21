<template>
    <IconsFullScreen @updateGroupTitle="updateGroupTitle" :groupTitle="groupTitle" v-if="isIconsFullScreen"
        @closeFullScreen="closeFullScreen" :iconLists="iconList" @disbandGroup="disbandGroup" @deleteIcons="deleteIcons"
        @editIcons="editIcons" @dragAddIcon="dragAddIcon">
    </IconsFullScreen>
    <div class="item-list  xt-hover no-drag" @click="fuullScreenClick($event)">
        <div class="item">
            <template v-for="(i) in 4">
                <img v-if="iconList[i - 1]" class="img" :src="iconList[i - 1].src" style="object-fit: cover;">
                <div v-else class="img"></div>
            </template>
        </div>
        <div class="title">{{ groupTitle }}</div>
    </div>
</template>

<script>
import IconsFullScreen from './fullScreen.vue';
import { mapWritableState } from 'pinia'
import { myIcons } from '../../../../store/myIcons.ts'
export default {
    props: {
        iconList: {
            type: Object,
            default: () => { },
        },
        groupTitle: {
            type: String
        }
    },
    components: {
        IconsFullScreen,
    },
    data() {
        return {
            isIconsFullScreen: false // 全屏开关
        }
    },
    computed: {
        ...mapWritableState(myIcons, [
            "isHover",
        ]),
    },
    methods: {
        fuullScreenClick(event) {
            if (event.ctrlKey && event.button === 0) {
                this.$emit('custom-event');
                return
            }
            console.log('this. :>> ', this.isHover);
            
            if (this.isHover) {
                this.isHover = false
                return
            }
            this.isIconsFullScreen = true
        },
        dragAddIcon(icon) {
            this.$emit('dragAddIcon', icon)
        },
        // 多图标全屏模式关闭
        closeFullScreen() {
            this.isIconsFullScreen = false
        },
        // 解除多图标分组
        disbandGroup() {
            this.$emit("disbandGroup")
        },
        // 更新多图标组件标题
        updateGroupTitle(title) {
            this.$emit("updateGroupTitle", title)
        },
        // 删除多图标组件中的单个图标
        deleteIcons(index) {
            this.$emit('deleteIcons', index)
        },
        // 编辑多图标组件中的单个图标
        editIcons(index) {
            this.$emit('editIcons', index)
        },
    },
}
</script>

<style lang="scss" scoped>
.xt-hover {
    border-radius: 10px;
}

.item-list {
    width: 134px;
    height: 96px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    flex-direction: column;
    font-size: 14px;
    cursor: pointer;


    .item {
        margin-top: 8px;
        width: 56px;
        height: 56px;
        background: var(--primary-bg);
        border-radius: 12px;
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        justify-content: center;
        align-content: center;


        .img {
            width: 22px;
            height: 22px;
            margin: 2px;
            border-radius: 6px;
        }

    }


    .title {
        padding: 0 5px;
        width: 80%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: center;
        height: 18px;
        line-height: 18px;
    }
}


.popContainer {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99999;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    // 背景的模糊大小通过下面的属性值大小来调制
    background: var(--main-mask-bg);
    background: rgba(2, 2, 11, 0.1) !important;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(5px);
    transform: scale(1.2);
}
</style>