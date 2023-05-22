import { cardStore } from "../../../../store/card";
import { mapActions } from "pinia";
export default {
    created() {
        if (!this.customData.cardSize) {
            this.increaseCustomComponents(this.customIndex, {
                cardSize: "card",
            });
        }
        this.options.className = this.customData.cardSize
    },
    methods: {
        ...mapActions(cardStore, ["increaseCustomComponents"]),
        __updateClassName(e) {
            this.options.className = e
        },
        __updateDragSize(e) {
            this.increaseCustomComponents(this.customIndex, {
                cardSize: e,
            });
            this.options.className = e
            this.isActive = e
        },
    }
}