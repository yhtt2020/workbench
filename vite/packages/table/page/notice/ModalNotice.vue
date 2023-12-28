<script lang="ts">
import {defineComponent} from 'vue'
import NoticeBody from "./part/NoticeBody.vue";
import UrlButtons from "./part/UrlButtons.vue";

export default defineComponent({
  name: "ModalNotice",
  components: {UrlButtons, NoticeBody},
  props: {
  },
  computed: {
    urls() {
      return this.parseField(this.message.urls, [])
    },
    covers() {
      return this.parseField(this.message.covers, [])
    }
  },
  methods: {
    parseField(field, defaultValue) {
      if (field) {
        return JSON.parse(field)
      } else {
        return defaultValue
      }
    },
    showModal(message) {
      console.log('消息到达弹窗',message)
      this.message=message
      this.visible=true
      this.$emit('update:message', message)

    },
    close(){
      this.message={}
      this.visible=false
    }
  },
  data() {
    return {
      message: {
      },
      visible: false
    }
  },
  watch: {
  }
})
</script>

<template>
  dwadwdwadwa {{visible}}
  <xt-modal v-if="message?.id" v-model="visible" :footer="0" :title="message.title" boxClass="p-4 " :mask="1">
  <div  style="max-width:600px" >
    <div class="mt-2 mb-10">
      <NoticeBody :content="message"></NoticeBody>
    </div>
    <div class="flex justify-center w-full gap-2  ">
      <div class="flex justify-end gap-4">
        <UrlButtons @close="close" :urls="urls"></UrlButtons>
      </div>
    </div>

  </div>

  </xt-modal>
</template>

<style scoped lang="scss">

</style>
