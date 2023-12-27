<script lang="ts">
import {defineComponent} from 'vue'
import Button from "../../../ui/libs/Button/index.vue";
import {formatTime} from "../../../util";
import Browser from "../../../js/common/browser";
export default defineComponent({
  name: "UrlButtons",
  components: {Button},
  emits:['close','viewNow'],
  props:['urls'],
  methods:{
    formatTime,
    viewNow(){
      this.$emit('viewNow')
    },
    goUrl(url){
      switch (url.type){
        case 'link':
          Browser.openInUserSelect(url.href)
          break
        case 'route':
          window.$app.$router.push(url.route)
          break
      }
      if(url.close){
        this.$emit('close')
      }

    }
  }
})
</script>

<template>

  <template v-if="!urls.length>0">
    <Button w="auto" type="theme" class="button"   @click="viewNow">立即查看
    </Button>

  </template>
  <template v-else>

    <Button w="auto" class="button"   :h="40" v-for="url in urls"  :type="url.buttonType||'default'"  @click="goUrl(url)">{{url.title}}
    </Button>

  </template>
</template>

<style scoped lang="scss">
  .button{
    min-width: 80px;padding-left: 15px;padding-right: 15px
  }
</style>
