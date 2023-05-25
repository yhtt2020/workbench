import { cardStore } from "../../../../store/card";
import { mapActions } from "pinia";
export default {
    data() {
        return {
            dragCardSize: "",
            width: 0,
            height: 0,
            WIDTH: 280,
            HEIGHT: 205
        }
    },
    created() {
        // 初始化类名
        if (!this.customData.dragCardSize) {
            this.increaseCustomComponents(this.customIndex, {
                dragCardSize: this.options.className,
            });
        }
        // 初始化卡片宽高
        if (!this.customData.width && !this.customData.height) {
            this.reSizeInit(this.options.className)
        }
    },
    mounted() {
        // 使用卡片类名
        this.dragCardSize = this.customData.dragCardSize
        // 使用卡片宽高
        this.width = this.customData.width
        this.height = this.customData.height
        this.reSizeInit(this.dragCardSize)
        this.updateSize(this.dragCardSize)
    },
    computed: {
        // 动态计算卡片大小
        reSize() {
            return {
                width: (this.customData.width || 1) * this.WIDTH + (this.customData.width - 1) * 10 + 'px',
                height: (this.customData.height || 2) * this.HEIGHT + (this.customData.height - 1) * 10 + 'px'
            }
        }
    },
    methods: {
        ...mapActions(cardStore, ["increaseCustomComponents"]),
        // 初始化宽高
        reSizeInit(e) {
            this.increaseCustomComponents(this.customIndex, {
                dragCardSize: e,
            });
            this.dragCardSize = e
            if (e == "card double") {
                this.width = 2
                this.height = 2
            } else if (e == "card") {
                this.width = 1
                this.height = 2
            } else if (e == "card small") {
                this.width = 1
                this.height = 1
            } else if (e == "card1") {
                this.width = 2
                this.height = 1
            } else if (e) {
                let str = e.split(",")
                let a = str[0] / 280
                this.width = Math.round(str[0] / 280)
                this.height = Math.round(str[1] / 205)
            }
            this.increaseCustomComponents(this.customIndex, {
                width: this.width,
                height: this.height
            });
            this.customData.width = this.width
            this.customData.height = this.height

            this.isActive = e
            this.onReSize && this.onReSize(e, {
                width: this.width,
                height: this.height,
            })
        },
        updateSize(e) {
            this.$refs.drag.dragCallBack(e)
        }
    },

}