<template>
    <div ref="textRef" style="margin-top: 8px; " :style="{ width: w, height: h }">
        <slot :row="1123"></slot>
        <div ref="dragRef" class="drag-boxs">
            图标
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            w: "100%",
            h: "360px",
        }
    },
    props: {
        className: {
            type: String,
            default: "1",
        },
    },
    mounted() {
        this.drag()
        this.callBack()
    },
    methods: {
        callBack() {
            if (this.className == "card double") {
                this.w = `${542}px`
                this.h = `${360}px`
            }
            else if (this.className == "card") {
                this.w = `${250}px`
                this.h = `${360}px`
            }
            else if (this.className == "card small") {
                this.w = `${250}px`
                this.h = `${140}px`
            }
        },
        drag() {
            let that = this
            let a = this.$refs.textRef
            let dragRef = this.$refs.dragRef
            dragRef.addEventListener("mousedown", (el) => {
                let oldX = el.clientX
                let oldY = el.clientY
                let h = a.clientHeight
                let w = a.clientWidth
                let width, height
                document.onmousemove = function (e) {
                    let x = e.clientX;
                    let y = e.clientY;
                    width = x - oldX + w
                    height = h - oldY + y
                    if (width > 250 && width < 542) {
                        that.w = `${width}px`
                        if (height > 140 && height < 360) that.h = `${height}px`
                        that.$emit("__updateClassName", "card double")
                        console.log('盒子宽度在2x2范围内 :>> ');
                    }
                    else if (width < 250 && height > 140) {
                        if (height > 140 && height < 360) that.h = `${height}px`
                        that.$emit("__updateClassName", "card")
                        console.log('盒子宽度在1x2范围内 :>> ');
                    }
                    else if (width < 250 && height < 140) {
                        that.$emit("__updateClassName", "card small")
                        console.log('盒子宽度在1x1范围内 :>> ');
                    }
                }
                document.onmouseup = function () {
                    document.onmousemove = null;
                    document.onmouseup = null;
                    that.callBack()
                    that.$emit("__updateDragSize", that.className)

                };
            }, { capture: true })
        },
    }
}
</script>

<style lang="scss" scoped>
.drag-boxs {
    display: flex;
    margin-top: -24px;
    width: 100%;
    height: 20px;
    justify-content: end;
}
</style>