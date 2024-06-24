<template>
  <div
    class="flex flex-col min-width detail-bg ml-4 rounded-lg px-4 py-4"
    style="height: 425px"
  >
    <xt-scrollbar
      class="flex-1 w-full overflow-hidden"
      :x="false"
      :y="true"
      style="height: 420px"
    >
      <div class="flex flex-col">
        <span class="font-16 xt-text"> {{ detailData?.content }}</span>

        <div class="flex justify-between items-center mt-4">
          <span class="font-16 xt-text-2">发行日期</span>
          <span class="font-16 xt-text">{{ detailData?.IssueDate }}</span>
        </div>

        <div class="flex justify-between items-center mt-4">
          <span class="font-16 xt-text-2">发行商</span>
          <span class="font-16 xt-text">{{ detailData?.publisher }}</span>
        </div>

        <div class="flex justify-between items-center mt-4">
          <span class="font-16 xt-text-2">开发商</span>
          <span class="font-16 xt-text">{{ detailData?.developers }}</span>
        </div>

        <span class="w-1/3 mt-1 font-16 xt-text-2"> 标签 </span>
        <div class="flex items-center mt-1">
          <template v-for="(item, index) in detailData?.genres" :key="index">
            <span
              class="rounded-lg mr-1"
              style="
                background: rgba(255, 255, 255, 0.4);
                padding: 2px 6px 1px 6px;
              "
            >
              {{ item?.description }}
            </span>
          </template>
        </div>

        <span class="mt-4 mb-3 font-16 xt-text-2"> 语言 </span>
        <span class="xt-text-2 font-16 mb-3">
          {{ detailData?.language }}
        </span>

        <div class="detail-bg flex rounded-lg items-center justify-between">
          <div class="flex flex-col mt-1">
            <span class="mb-3 font-16 xt-text-2"> 价格 </span>
            <span class="font-14 xt-text-2" style="max-width: 120px">
              特价促销！{{ acquisitionDate(detailTime) }}截止
            </span>
          </div>

          <div class="flex flex-col">
            <span
              class="line-through mr-2 font-14"
              style="text-align: right; color: rgba(255, 255, 255, 0.4)"
            >
              {{ detailData?.oldPrice }}
            </span>

            <div class="flex flex-col">
              <span
                class="mr-2 mb-4 rounded-lg oswald-font xt-active-text text-center"
                style="
                  background: rgba(255, 77, 79, 1);
                  padding: 2px 4px 5px 4px;
                "
              >
                -{{ detailData?.percent }}%
              </span>
              <span class="oswald-font font-18 " style=" color: rgba(255, 77, 79, 1);">
               {{ detailData?.newPrice }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </xt-scrollbar>
  </div>
</template>

<script>
export default {
  name: "DetailRightText",

  props: {
    detailData: {
      type: Object,
      default: () => {},
    },
    // 截止时间
    detailTime: {
      type: String,
    },
  },

  methods: {
    // 解析时间
    acquisitionDate(val) {
      const expireDate = new Date(parseInt(val) * 1000);
      let m = expireDate.getMonth() + 1; // 月
      let d = expireDate.getDate(); // 日
      return m + "月" + d + "日";
    },
  },
};
</script>

<style lang="scss" scoped>
</style>