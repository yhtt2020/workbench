<template>
  <template v-if="detailShow === false">
    <div class="w-full h-full mt-3">
      <template v-if="thisList?.length === 0">
        <div class="flex items-center h-full justify-center flex-col">
          <xt-ify-icon
            icon="fluent-emoji:face-with-head-bandage"
            size="64"
            class="mb-3"
          />
          <span class="xt-text xt-font xt-14">加载失败</span>
        </div>
      </template>

      <template v-else>
        <xt-scrollbar
          class="flex-1 w-full overflow-hidden"
          :x="false"
          :y="true"
          style="height: 300px"
        >
          <template v-for="item in thisList">
            <div
              class="relative rounded-lg cursor-pointer week-image mb-4"
              @click.stop="enterWeek(item)"
            >
              <!-- 背景图 -->
              <img
                class="rounded-lg"
                :src="getSpecifiedImage(item)"
                alt=""
                style="width: 100%; height: 100%; object-fit: cover"
              />

              <!-- 剩余天数 -->
              <span
                class="remainder-day xt-num-font-600"
                style="color: var(--active-text); min-width: 100px"
              >
                剩余 {{ getRemainingDays(item) }} 天
              </span>

              <!--立省多少 -->
              <span
                class="stablish-province xt-num-font-600"
                style="min-width: 100px"
              >
                立省 {{ item?.price?.totalPrice?.fmtPrice?.originalPrice }}
              </span>
            </div>
          </template>
        </xt-scrollbar>
      </template>
    </div>
  </template>

  <template v-else>
    <EpicDetail :detailOptions="detailItem" @update:backShow="detailBack" />
    <!--  
        :detailType="'now'" -->
  </template>
</template>

<script>
import EpicDetail from "../EpicDetail.vue";

export default {
  name: "TheWeekEpicDetail",

  components: {
    EpicDetail,
  },

  props: {
    thisList: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      // 切换详情
      detailShow: false,
      detailItem: {},
    };
  },

  methods: {
    // 获取指定图片
    getSpecifiedImage(item) {
      const foundImg = item?.keyImages?.find((img) => {
        return img?.type === "OfferImageWide";
      });
      return foundImg?.url;
    },

    // 计算剩余多少天
    getRemainingDays(item) {
      const { promotionalOffers } = item?.promotions;
      const promotion = promotionalOffers[0]?.promotionalOffers[0];
      // 当前时间
      const current = new Date();
      // 截止时间
      const end = new Date(promotion?.endDate);
      // 剩余天数计算差
      const diffTime = end.getTime() - current.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    },

    // 进入epic详情
    enterWeek(item) {
      const data = {
        ...item,
        image: this.getSpecifiedImage(item),
        price: item.price.totalPrice.fmtPrice.originalPrice,
        summary: item?.description,
        days: this.getRemainingDays(item),
      };
      this.detailShow = true;
      this.detailItem = data;
    },

    // 返回上一个
    detailBack() {
      this.detailShow = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.week {
  &-image {
    width: 252px;
    height: 144px;
  }
}

.remainder-day {
  position: absolute;
  right: 0;
  top: 0;
  background: rgba(255, 77, 79, 1);
  padding: 3px 10px 2px 8px;
  border-top-right-radius: 6px;
  font-size: 13px;
  font-weight: 400;
  text-align: center;
}

.stablish-province {
  position: absolute;
  top: 1.9em;
  right: 0;
  padding: 3px 6px 2px 6px;
  text-align: center;
  background: var(--secondary-bg);
  border-bottom-left-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--primary-text);
}
</style>