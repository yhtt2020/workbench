<template>
    <Widget :desk="desk" :sizeList="sizeList" :options="options" :customIndex="customIndex" :menuList="menuList"
        ref="cardSlot">
        <template #left-title>
            <div class="icon"
                style="width: 35px;height: 24px;display: flex; justify-content: center;align-items: center;position: absolute;left: 2px;">
                <newIcon icon="fluent:box-16-regular" class="" style="font-size: 20px;"></newIcon>
            </div>
            
        </template>

    </Widget>
</template>
<script>
import Widget from '../../card/Widget.vue';
import { Icon as newIcon } from '@iconify/vue'
export default {
    name: '我的快递',
    components: {
        Widget,
        newIcon
    },
    props: {
        customIndex: {
            type: Number,
            default: 0
        },
        customData: {
            type: Object,
            default: () => { }
        },
        desk: {
            type: Object
        }
    },
    data() {
        return {
            settingVisible: false,
            sizeList: [
                {
                    title: '2x2',
                    height: 1,
                    width: 1,
                    name: '2x2'
                },
                {
                    title: '4x4',
                    height: 2,
                    width: 2,
                    name: '4x4'
                },
                {
                    title: '4x6',
                    height: 3,
                    width: 2,
                    name: '4x6'
                },

            ],
            options: {
                className: 'card double',
                title: '我的快递',
                icon: '',
                type: 'Courier'
            },
            menuList: [
                {
                    icon: 'shezhi1',
                    title: '设置',
                    fn: () => { this.settingVisible = true; this.$refs.cardSlot.visible = false }
                },
            ],
        }
    }
}
</script>
<style lang="scss"></style>