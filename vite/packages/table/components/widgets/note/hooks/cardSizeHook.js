import { cardStore } from "../../../../store/card";
import { mapActions } from "pinia";
export default {
    data() {
        return {
            isActive: ""
        }
    },
    created() {
        if (!this.customData.cardSize) {
            this.increaseCustomComponents(this.customIndex, {
                cardSize: this.options.className,
            });
        }
    },
    mounted() {
        this.options.className = this.customData.cardSize
        this.isActive = this.customData.cardSize
    },
    methods: {
        ...mapActions(cardStore, ["increaseCustomComponents"]),
        __updateSize(e) {

            // this.callBack && this.callBack(e)
            if (e == "card1") {
                this.isActive = "card1"
                this.options.className = "card"
                this.increaseCustomComponents(this.customIndex, {
                    cardSize: "card"
                });
            } else {
                this.increaseCustomComponents(this.customIndex, {
                    cardSize: e
                });
                this.options.className = e
                this.isActive = e
            }
            this.reSizeInit && this.reSizeInit(e) // 更新窗口大小的回调函数
            this.updateSize && this.updateSize(e)
        }
    }
}