<template>
  <xt-container 
    @titleHover="enterMusic"
    v-model:customSize="customData.customSize"
    :customData = "customData"
    :header="header"
    :options="options" 
    :envLimit="['guest', 'offline']"
    :customIndex="customIndex" 
    :desk="desk"
    @delete="deleteCard">
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
  </xt-container>
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
    },
    openWay: {
      type: String,
      default: "desk",
    }
  },
  emit:['delete'],
  data() {
    return {
      header:{
        title:'网易云',
        ifyIcon:'fluent:music-note-2-16-regular',
        titleHover:true,
        titleHoverName:'打开应用',
      }
    };
  },
  components: {
    Widget,
    newIcon
  },
  computed: {
    ...mapWritableState(appStore, ["status"]),
    options() {
      return {
        customDel: this.openWay === "nav" ? true : false,
      }
    }
  },
  methods: {
    enterMusic() {
      this.$router.push("/music");
    },
    deleteCard() {
      this.$emit("delete");
    }
  },
  mounted() {
    this.customData.customSize = '2x2'
  }
};
</script>

<style scoped></style>
