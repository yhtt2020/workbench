<template>
  <div>
    <a-select class="w-full" :bordered="false" v-model:value="search">
      <a-select-option v-for="item in searchOptions" :value="item.value">
        {{ item.name }}
      </a-select-option>
    </a-select>
    <xt-title>严谨与想象（Temperature）</xt-title>
    <div class="flex">
      <a-slider
        class="flex-1"
        v-model:value="temperature"
        :min="0"
        :max="2"
        :step="0.1"
        tooltipPlacement="left"
        :tooltipOpen="true"
      />
      <a-input-number
        v-model:value="temperature"
        :min="0"
        :max="2"
      ></a-input-number>
    </div>
    <xt-title>上下文的条数</xt-title>
    <div class="flex">
      <a-slider v-model:value="count" :min="1" :max="20" class="flex-1" />
      <a-input-number v-model:value="count" :min="1" :max="20"></a-input-number>
    </div>
  </div>
</template>

<script>
import { aiStore } from "../../../store/ai";
import { mapWritableState } from "pinia";

export default {
  computed: {
    ...mapWritableState(aiStore, ["temperature", "count"]),
  },
  data() {
    return {
      search: "default",
      searchOptions: [
        { value: "default", name: "默认排序" },
        { value: "count", name: "销量/下载量" },
        { value: "support", name: "点赞数" },
        { value: "updateTime", name: "更新时间" },
        { value: "createTime", name: "发布时间" },
      ],
    };
  },
};
</script>

<style lang="scss" scoped></style>
