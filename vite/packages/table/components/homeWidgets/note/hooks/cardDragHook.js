import { cardStore } from "../../../../store/card";
import { mapActions } from "pinia";
export default {
    created() {
        if (!this.customData.dragCardSize) {
            this.increaseCustomComponents(this.customIndex, {
                dragCardSize: this.options.className,
                cardSize: this.options.className
            });
        }
    },
    mounted() {
        this.options.className = this.customData.dragCardSize
        this.callBack(this.options.className)
    },
    methods: {
        ...mapActions(cardStore, ["increaseCustomComponents"]),
        __updateClassName(e) {
            this.options.className = e
        },
        __updateDragSize(e) {
            this.increaseCustomComponents(this.customIndex, {
                dragCardSize: e,
                cardSize: e
            });
            this.options.className = e
            this.isActive = e
        },
        callBack(e) {
            this.$refs.drag.dragCallBack(e)
            this.__updateDragSize(e)
        },
    },

}