<template>
  <div class="h-full" style="border: 1px solid">
    <div class="flex relative">
      <div class="w-32">
        <div class="overflow-y-auto xt-container" style="height: 300px">
          <div
            v-for="(item, index) in webBtn"
            @click="handleChange(index)"
            class="w-120 h-12 justify-center items-center cursor-pointer flex rounded-xl mr-2"
            style="flex: 0 0 auto"
            :class="{
              'xt-bg-2': index === selectIndex,
            }"
          >
            {{ item.label }}
          </div>
        </div>
      </div>
      <Icon
        ref="iconRef"
        @updateSelectApps="updateSelectApps"
        :isSelect="true"
        :name="selectName"
        style="height: calc(100% - 48px)"
        :data="appList[selectName]"
      >
      </Icon>
    </div>
    <!-- <Radio
      :list="linkList"
      v-model:data="type"
      text="选择打开的浏览器方式"
    ></Radio>
    <div class="my-2 text-base mb-4">网址分类</div> -->
  </div>
</template>

<script>
import Radio from "../../../../components/card/hooks/Radio.vue";
import { getSelect } from "../api/api";
import syncSelected from "../hooks/syncSelected";
import cache from "../hooks/cache";
import { scrollable } from "../hooks/scrollable";

export default {
  mixins: [syncSelected],
  components: { Radio },
  watch: {
    type: {
      handler(newV) {
        let data = []; // 临时存放数据不做取名
        this.appList.forEach((item) => {
          data.push({
            ...item,
            open: {
              value: item.open.value,
              type: this.type,
            },
          });
        });
        this.appList = data;
        data = [];
        this.selectApps.forEach((item) => {
          data.push({
            ...item,
            open: {
              value: item.open.value,
              type: this.type,
            },
          });
        });
        this.selectApps = data;
      },
    },
  },
  data() {
    return {
      type: "internal",
      linkList: [
        {
          value: "internal",
          name: "工作台内打开",
        },
        {
          value: "thinksky",
          name: "想天浏览器",
        },
        {
          value: "default",
          name: "系统默认浏览器",
        },
      ],
      webBtn: [
        {
          label: "设计工具",
          name: "design",
          checked: true,
        },
        {
          label: "即时通讯",
          name: "message",
          checked: false,
        },
        {
          label: "文档表单",
          name: "docx",
          checked: false,
        },
        {
          label: "常用邮箱",
          name: "email",
          checked: false,
        },
        {
          label: "资讯门户",
          name: "information",
          checked: false,
        },
        {
          label: "效率工具",
          name: "effect",
          checked: false,
        },
        {
          label: "媒体运营",
          name: "media",
          checked: false,
        },
        {
          label: "SAAS服务",
          name: "saas",
          checked: false,
        },
        {
          label: "程序开发",
          name: "code",
          checked: false,
        },
        {
          label: "休闲娱乐",
          name: "game",
          checked: false,
        },
        {
          label: "学习成长",
          name: "learning",
          checked: false,
        },
        {
          label: "企业采购",
          name: "copurchase",
          checked: false,
        },
        {
          label: "企业信息",
          name: "coinfo",
          checked: false,
        },
      ],
      appList: {},
      selectIndex: 0,
      selectName: "",
    };
  },
  directives: {
    scrollable,
  },
  async mounted() {
    this.getData(this.selectIndex);
  },
  methods: {
    async getData(index) {
      index = this.webBtn[index].name;
      let appList = cache.get(`link-${index}`);
      if (!appList) {
        appList = [];
        let res = await getSelect({
          applicationType: index,
        });
        res.data[0].forEach((item) => {
          appList.push({
            link: "link",
            icon: item.app.version.logo256 || "",
            name: item.app.version.name || "",
            open: {
              value: item.app.version.url || "",
              type: this.type,
            },
          });
        });
        cache.set(`link-${index}`, appList, 2 * 24 * 60 * 60 * 1000);
      }
      this.appList[index] = appList;
      this.selectName = index;
    },
    handleChange(index) {
      let iconRef = this.$refs["iconRef"];
      // iconRef.cancelAll();
      this.selectIndex = index;
      this.getData(this.selectIndex);
    },
  },
};
</script>

<style lang="scss" scoped></style>
