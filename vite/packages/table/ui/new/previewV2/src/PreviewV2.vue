<template>
  <xt-modal
    v-if="visible"
    v-model="visible"
    :title="title"
    :footer="true"
    @no="close"
    @close="close"
    @ok="add"
    index="99999999"
  >
    <div class="mb-4">
      <xt-option-select
        v-model="currentDesk"
        :zIndex="999999999"
        :list="desksList"
      />
    </div>
    <div
      class="flex justify-center items-center preview"
      style="width: 452px; height: 320px"
      :style="{ background: bg }"
    >
      <component
        :style="{ zoom: zoom }"
        :desk="desks[0]"
        :is="customComponent"
        :custom-index="customIndex"
        :custom-data="customData"
        :custom-size="customSize"
      />
    </div>
  </xt-modal>
</template>

<script>
import { mapWritableState } from "pinia";
import { cardStore } from "../../../../store/card";
import { appStore } from "../../../../store";
import componentsMinis from "../../../../../table/components/desk/components";
import { homeStore } from "../../../../store/home";
import { message } from "ant-design-vue";

export default {
  mixins: [componentsMinis],
  data() {
    return {
      visible: this.modelValue,
      currentDesk: "",
      desksList: "",
    };
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
    id: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "2x2",
    },
    zoom: {
      type: Number,
    },
    title: {
      type: String,
      default: "",
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapWritableState(cardStore, ["desks"]),
    ...mapWritableState(homeStore, ["currentDeskId"]),
    ...mapWritableState(appStore, ["backgroundImage"]),
    customComponent() {
      return this.name || null;
    },
    customIndex() {
      return this.id || Date.now();
    },
    customData() {
      return this.data || {};
    },
    customSize() {
      return this.size || "2x2";
    },
    bg() {
      let background = "url(" + this.backgroundImage.path + ")";
      return this.backgroundImage.path
        ? background
        : "url('https://a.apps.vip/icons/defaultBackground.jpg')";
    },
    zoom() {
      if (this.zoom) {
        return this.zoom;
      }
      let scale = 1;
      let str = this.size.split(/x|\*/);
      let scaleW = (380 / (135 * str[0])).toFixed(4);
      let scaleH = (260 / (100 * str[1])).toFixed(4);
      scale = scaleW > scaleH ? scaleH : scaleW;
      scale = scale > 1 ? 1 : scale;
      return scale;
    },
  },
  watch: {
    modelValue(val) {
      this.visible = val;
    },
  },
  methods: {
    close() {
      this.$emit("update:modelValue", false);
    },
    resetDesk() {
      const list = this.desks.map((item) => {
        return {
          value: item.id,
          name: item.name,
        };
      });
      return list;
    },
    add() {
      let res = this.desks.find((item) => {
        if (item.id == this.currentDesk) return item;
      });
      console.log("res :>> ", res);
      res.cards.push({
        id: Date.now(),
        name: this.name,
        customData: this.data,
      });
      message.success("添加成功");
      this.close();
    },
  },
  mounted() {
    this.desksList = this.resetDesk();
    this.desksList.find((item) => {
      if (item.value == this.currentDeskId) {
        this.currentDesk = item.value;
        return item.value;
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.preview {
  border-radius: 10px;
  background-size: cover !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
}
</style>
