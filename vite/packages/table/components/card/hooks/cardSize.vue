<template>
    <div class="text-base" style="margin: 12px 0">小组件尺寸</div>
    <div class="box">
        <div class="item no-drag" :class="{ active: isActive == 'card small' }" @click="updateSize('card small')"> 1 x 1
        </div>
        <div class="item no-drag" :class="{ active: isActive == 'card' }" @click="updateSize('card')"> 1 x 2</div>
        <div class="item no-drag" :class="{ active: isActive == 'card1' }" @click="updateSize('card1')"> 2 x 1</div>
        <div class="item no-drag" :class="{ active: isActive == 'card double' }" @click="updateSize('card double')"> 2 x 2
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        updateSize(e) {
            this.$emit("__updateSize", e)
        }
    },
    props: {
        isActive: {
            type: String,
            default: "",
        },
    },
}
</script>

<style lang="scss" scoped>
.box {
    width: 100%;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding: 2px;
    position: relative;

    .item {
        flex: 1;
        text-align: center;
        color: var(--primary-text) !important;
        line-height: 42px;
        padding: 0 2px;
        cursor: pointer;
    }
}

.active {
    background: #212121;
    border-radius: 10px;
}
</style>