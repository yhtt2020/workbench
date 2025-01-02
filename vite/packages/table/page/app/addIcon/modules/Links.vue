<template>
  <div class="relative flex h-full">
    <div class="w-32">
      <div class="overflow-y-auto xt-container" :style="heightStyle">
        <div v-for="(item, index) in navTypes" @click="handleChange(index)"
          class="flex items-center justify-center h-12 mr-2 cursor-pointer rounded-xl"
          style="flex: 0 0 auto ;width: 120px;" :class="{
            'xt-bg-2': index === selectIndex,
          }">
          {{ item.title }}
        </div>
      </div>
    </div>
    <Icon ref="iconRef" @updateSelectApps="updateSelectApps" :isSelect="true" :name="selectName"
      style="height: calc(100% - 48px)" :data="appList[selectName]">
    </Icon>
  </div>
</template>

<script>
import { getNavList } from "../api/api";
import syncSelected from "../hooks/syncSelected";
import cache from "../../../../components/card/hooks/cache";
import { scrollable } from "../hooks/scrollable";
import navDb from '../../../../js/lib/navDb'
export default {
  inject: ["height"],
  mixins: [syncSelected],
  props: {
    type: {},
  },
  watch: {
    type: {
      handler(newV) {
        this.appList[this.selectName].forEach((item) => {
          item.open.type = this.type;
        });
      },
    },
  },
  data() {
    return {
      navTypes:[],
      appList: {},
      selectIndex: 0,
      selectName: "",
    };
  },
  directives: {
    scrollable,
  },
  async mounted() {
    this.navTypes=await navDb.getNavTypesTree()
    console.log('获取到的nav类型',this.navTypes)

    this.getData(this.selectIndex);
  },
  computed: {
    heightStyle() {
      return {
        height: this.height() + 60 + "px",
      };
    },
  },
  methods: {
    async getData(index) {
      index = this.webBtn[index].name;
      let appList = cache.get(`link-${index}`);

      if (!appList) {
        let res = await getNavList();
        console.log('查回的导航', res);
        if (res && res[index]) {
          appList = res[index];
          appList.forEach((item) => {
            item.open = {
              type: this.type,
              value: item.url
            };
          });
          cache.set(`link-${index}`, appList, 2 * 24 * 60 * 60 * 1000);
        } else {
          appList = [];
        }
      }

      this.appList[index] = appList;
      this.selectName = index;
    },
    handleChange(index) {
      this.selectIndex = index;
      this.getData(this.selectIndex);
    },
  },
};
</script>

<style lang="scss" scoped></style>
