<template>
  <Widget :options="options" :customIndex="customIndex" :desk="desk">
    <template #left-title-icon>
        <div
          class="icon"
          style=" width: 38px;height: 24px; display: flex;justify-content: center;align-items: center;position: absolute;
            left: 2px; ">
          <newIcon icon="fluent:music-note-2-16-regular" style="font-size: 20px;" />
        </div>
      </template>
    <div
      @click="enterMusic"
      class="pointer"
      style="text-align: center; padding: 2em"
    >
      <a-avatar
        :size="100"
        :class="{ playing: status.music.playing }"
        style="border: 3px solid #999"
        :src="status.music.cover || 'https://a.apps.vip/icons/wyy.png'"
      ></a-avatar>
    </div>
    <a-row :gutter="10">
      <a-col :span="12"> </a-col>
      <a-col :span="12"> </a-col>
    </a-row>
  </Widget>
</template>
<script>
import { appStore } from "../../store";
import { mapWritableState } from "pinia";
import Widget from "../card/Widget.vue";
import { Icon as newIcon } from "@iconify/vue";
export default {
  name: "Music",
  props: {
    customIndex: {
      type: Number,
      default: 0,
    },
    customData: {
      type: Object,
      default: () => {},
    },
    desk:{
      type:Object
    }
  },
  data() {
    return {
      options: {
        className: "card small",
        title: "网易云",
        // icon: "customerservice",
        type: "music",
      },
    };
  },
  components: {
    Widget,
    newIcon
  },
  computed: {
    ...mapWritableState(appStore, ["status"]),
  },
  methods: {
    enterMusic() {
      this.$router.push("/music");
    },
  },
};
</script>

<style scoped></style>
