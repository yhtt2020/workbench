<template>
  <BottomEdit :menuList="menuList"></BottomEdit>
</template>

<script>
import BottomEdit from "../components/bottomEdit.vue";
export default {
  components: {
    BottomEdit,
  },
  props: {
    data: {},
  },
  data() {
    return {
      iconsSetVisible: this.data,
      menuList: [
        {
          icon: "shezhi1",
          title: "设置",
          fn: () => {
            this.$emit("editIcons");
            this.$emit("update:data", false);
          },
        },
        {
          icon: "guanbi2",
          title: "删除",
          fn: () => {
            this.$emit("deleteIcons");
            this.$emit("update:data", false);
          },
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
