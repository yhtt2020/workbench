<template>
    <teleport to="body">
        <div class='popContainer'></div>
        <div class="box">
            <div class="btn" @click="onBack">
                <Icon icon="xiangzuo" style="height: 24px; width: 24px"></Icon>
            </div>
            <div class="card">
                {{ CardDetails }}
            </div>
        </div>
    </teleport>
</template>

<script>
export default {
    created() {
        console.log('this. :>> ', this.CardDetails);
    },
    props: {
        CardDetails: {
            type: Object
        }
    },
    methods: {
        onBack() {
            this.$emit("closeCardDetails", false)
        }
    }
}
</script>

<style lang="scss" scoped>
.popContainer {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99999;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    // 背景的模糊大小通过下面的属性值大小来调制
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(5px);
    transform: scale(1.2);
    opacity: 1.9;

}

.box {
    z-index: 99911199;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;

    .btn {
        position: absolute;
        z-index: 99919199;

        top: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.30);
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 112px;
        height: 48px;
        margin-right: 20px;
    }

    .card {
        // font-size: 800px;
        border: 1px solid;
        text-align: center;
    }
}
</style>

