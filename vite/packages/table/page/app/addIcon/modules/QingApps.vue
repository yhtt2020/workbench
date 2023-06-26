<template>
  <Icon :isSelect="true" @updateSelectApps="updateSelectApps" :data="appList"></Icon>
</template>

<script>
import { getQingApps } from "../api/api";
import syncSelected from "../hooks/syncSelected";

export default {
  mixins: [syncSelected],
  data: {
    appList: [],
  },
  async mounted() {
    let res = await getQingApps();
    let appList = [];
    res.forEach((item) => {
      console.log("item :>> ", item.type);
      appList.push({
        link: "fast",
        icon: item.logo,
        name: item.name,
        path: { package: item.package, type: "lightApp" },
      });
    });
    this.appList = appList;
    // this.
  },
};
</script>

<style lang="scss" scoped></style>
