import { cardStore } from "../../../store/card";
import { mapActions } from "pinia";

export default {
  data() {
    return {
      isActive: "",
    };
  },
  created() {},
  mounted() {

  },
  methods: {
    ...mapActions(cardStore, ["updateCustomData"]),
    __updateSize(e) {
      if (e == "card1") {
        this.isActive = "card1";
        this.options.className = "card";
        this.updateCustomData(
          this.customIndex,
          {
            cardSize: "card",
          },
          this.desk
        );
      } else {
        this.updateCustomData(
          this.customIndex,
          {
            cardSize: e,
          },
          this.desk
        );
        this.options.className = e;
        this.isActive = e;
      }
      this.reSizeInit && this.reSizeInit(e); // 更新窗口大小的回调函数
      this.updateSize && this.updateSize(e);
    },
  },
};
