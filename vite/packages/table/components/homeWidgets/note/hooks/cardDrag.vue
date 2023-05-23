<template>
    <div class="boxs" ref="textRef" style="margin-top: 8px; " :style="{ width: w, height: h }">
        <slot :row="1123"></slot>
        <svg t="1684744355055" ref="dragRef" class="icon drag-boxs" viewBox="0 0 1024 1024" version="1.1"
            xmlns="http://www.w3.org/2000/svg" p-id="10063">
            <path
                d="M469.333333 256a85.333333 85.333333 0 1 1-85.333333-85.333333 85.333333 85.333333 0 0 1 85.333333 85.333333z m-85.333333 170.666667a85.333333 85.333333 0 1 0 85.333333 85.333333 85.333333 85.333333 0 0 0-85.333333-85.333333z m0 256a85.333333 85.333333 0 1 0 85.333333 85.333333 85.333333 85.333333 0 0 0-85.333333-85.333333z m256-341.333334a85.333333 85.333333 0 1 0-85.333333-85.333333 85.333333 85.333333 0 0 0 85.333333 85.333333z m0 85.333334a85.333333 85.333333 0 1 0 85.333333 85.333333 85.333333 85.333333 0 0 0-85.333333-85.333333z m0 256a85.333333 85.333333 0 1 0 85.333333 85.333333 85.333333 85.333333 0 0 0-85.333333-85.333333z"
                p-id="10064"></path>
        </svg>
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
        this.dragCallBack()
    },
    methods: {
        dragCallBack(e) {
            let className = e ?? this.className
            this.$emit("__updateDragSize", className)
            if (className == "card double") {
                this.w = `${542}px`
                this.h = `${360}px`
            }
            else if (className == "card") {
                this.w = `${250}px`
                this.h = `${360}px`
            }
            else if (className == "card small") {
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
                    that.dragCallBack()
                };
            }, { capture: true })
        },
    }
}
</script>

<style lang="scss" scoped>
.drag-boxs {
    width: 20px;
    height: 20px;
    z-index: 99999999999999;
    position: absolute;
    bottom: 0;
    right: 0;
    border: 1px solid;
}

.boxs {
    position: relative;
    border: 1px solid red;
}
</style>