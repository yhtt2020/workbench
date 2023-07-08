export default {
  watch: {
    _isRadius(newV) {
      this.$emit("update:isRadius", newV);
    },
    _radius(newV) {
      this.$emit("update:radius", newV);
    },
    _isTitle(newV) {
      this.$emit("update:isTitle", newV);
    },
    _titleValue(newV) {
      this.$emit("update:titleValue", newV);
    },
    _link(newV) {
      this.$emit("update:link", newV);
    },
    _linkValue(newV) {
      this.$emit("update:linkValue", newV);
    },
    _size(newV) {
      this.$emit("update:size", newV);
    },
    _open: {
      handler(newV) {
        this.$emit("update:open", { ...newV });
      },
      deep: true,
    },
    _src(newV) {
      this.$emit("update:src", newV);
    },
    _imgState(newV) {
      this.$emit("update:imgState", newV);
    },
    _isBackground(newV) {
      this.$emit("update:isBackground", newV);
    },
    _backgroundColor(newV) {
      this.$emit("update:backgroundColor", newV);
    },
    _backgroundIndex(newV) {
      this.$emit("update:backgroundIndex", newV);
    },
  },
};
