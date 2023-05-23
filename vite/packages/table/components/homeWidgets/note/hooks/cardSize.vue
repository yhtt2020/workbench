<template>
    <div class="text-base" style="margin: 12px 0">小组件尺寸</div>
    <div class="box">
        <div class="bg"></div>
        <div class="item" :class="{ active: isActive == 'card small' }" @click="updateSize('card small')"> 1 x 1 </div>
        <div class="item" :class="{ active: isActive == 'card' }" @click="updateSize('card')"> 1 x 2</div>
        <div class="item" :class="{ active: isActive == 'card1' }" @click="updateSize('card1')"> 2 x 1</div>
        <div class="item" :class="{ active: isActive == 'card double' }" @click="updateSize('card double')"> 2 x 2
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

    .bg {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 48px;
        z-index: -1;
        opacity: 0.3;
        background: rgba(255, 255, 255, 0.40);
        border-radius: 12px;
    }

    .item {
        flex: 1;
        text-align: center;
        color: #fff !important;
        line-height: 42px;
        padding: 0 2px;

    }
}

.active {
    background: #212121;
    border-radius: 10px;
}
</style>