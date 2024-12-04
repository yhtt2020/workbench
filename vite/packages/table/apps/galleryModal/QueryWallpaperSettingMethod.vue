<script lang="ts">
import {defineComponent} from 'vue'
import {message} from "ant-design-vue";
import {appStore} from "../../store";

export default defineComponent({
  name: "QueryWallpaperSettingMethod",
  data(){
    return {
      url:'',
      open:false,
    }
  },
  methods:{
    show(url){
      this.open=true
      this.url=url
    },
    onConfirmClick(type="common"){
      if (type === "common") {
        this.updateCommonBg(this.url);
      } else if (type === "independent") {
        // updateIndependentBg(currentImg.value);
        this.$bus.emit("setIndependentBg", this.url);
      }
      this.open=false
    },
     updateCommonBg(url){
      if (url) {
        message.info("正在为您设置背景");
      }
      // proxy.$bus.emit("setIndependentBg",false);
      if (url.startsWith('http:') || url.startsWith('https:')) {
        appStore().setBackgroundImage({
          path:url
        });
      } else {
        appStore().setBackgroundImage({ path: "", runpath: `file://${url}` });
      }
    }
  }
})
</script>

<template>
  <xt-confirm
    @close="open = false"
    v-if="open"
    :maskIndex="999999"
    :mask="true"
    ref="confirm"
    title="选择当前壁纸所需要设置的桌面"
  >
    <template #footer>
      <xt-button :w="120" h="40" @click="onConfirmClick">
        <span class="xt-text-2">取消</span>
      </xt-button>
      <xt-button
        :w="120"
        h="40"
        class="ml-3"
        type="theme"
        @click="onConfirmClick('common')"
      >通用桌面
      </xt-button>
      <xt-button
        :w="120"
        h="40"
        class="ml-3"
        type="theme"
        @click="onConfirmClick('independent')"
      >当前桌面
      </xt-button>
    </template>
  </xt-confirm>
</template>

<style scoped lang="scss">

</style>
