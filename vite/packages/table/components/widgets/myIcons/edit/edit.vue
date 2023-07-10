<template>
  <Header v-model:data="selectTab"></Header>
  <template v-if="selectTab == 'config'">
    <Size></Size>
    <Name></Name>
    <Open></Open>
    <ImgUpload></ImgUpload>
  </template>
  <template v-else>
    <ImgRadius></ImgRadius>
    <ImgShape></ImgShape>
    <ImgState></ImgState>
    <BgColor></BgColor>
  </template>
</template>

<script>
import Header from "../edit/modules/Header.vue";
import Size from "../edit/modules/Size.vue";
import Open from "../edit/modules/Open.vue";
import Name from "../edit/modules/Name.vue";
import ImgUpload from "../edit/modules/ImgUpload.vue";
import ImgState from "../edit/modules/ImgState.vue";
import ImgRadius from "../edit/modules/ImgRadius.vue";
import BgColor from "../edit/modules/BgColor.vue";
import ImgShape from "../edit/modules/ImgShape.vue";

export default {
  components: {
    Header,
    Size,
    Open,
    Name,
    ImgUpload,
    ImgState,
    ImgRadius,
    BgColor,
    ImgShape,
  },
  data() {
    return {
      selectTab: "config",
    };
  },
};
</script>

<style lang="scss" scoped></style>
