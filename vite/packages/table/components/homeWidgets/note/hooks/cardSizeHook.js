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
            this.increaseCustomComponents(this.customIndex, {
                cardSize: e
            });
            this.options.className = e
            this.isActive = e
            this.callBack && this.callBack(e)
        }
    }
}