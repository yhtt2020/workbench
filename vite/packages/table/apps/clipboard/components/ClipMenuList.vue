<script lang="ts">
import {defineComponent} from 'vue'
import {message} from "ant-design-vue";
import browser from "../../../js/common/browser";
import {mapActions} from "pinia";
import {clipboardStore} from "../store";
import _ from 'lodash-es'
export default {
  name: "ClipMenuList",
  props: ['clipItem','hidePreview'],
  computed: {
    urls() {
      if (['image', 'video', 'audio'].includes(this.clipItem.type)) {
        return []
      } else {
        const str = this.clipItem.content
// 提取file协议和http协议的URL
        const regex = /((file|http|https):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/ig;
        return str.match(regex) || []
      }
    },
    menuList() {
      const defaultMenu = [
        {
          title: '复制', shortKeys: 'Ctrl + C', id: 'cc', fn: (item) => {

            switch (this.clipItem.type) {
              case 'text':
                this.setClipboard('text', item.content)
                break;
              case 'image':
                this.setClipboard('image', this.clipItem.path)
                break
              case 'video':
                this.setClipboard('video', this.clipItem.filepath)
                break;
              case 'audio':
                this.setClipboard('audio', this.clipItem.filepath)
                break;
              case 'file':
                this.setClipboard('file', this.clipItem.files)
                break;
            }
            //todo 不同类型的复制
            message.success('复制成功。')
          }
        },
        {
          title: '打开链接', shortKeys: 'Ctrl + O', id: 'co', fn: (item) => {
            if (this.urls.length === 0) {
              message.error('不存在链接')
            } else {
              browser.openInUserSelect(this.urls[0])
              message.success('打开链接成功。')
            }
          }
        },
        {
          title: '预览', shortKeys: 'Space', id: 's', fn: (item) => {
            this.previewItem(this.clipItem)
          }
        },
        {
          title: '添加到收藏', shortKeys: 'Ctrl + S', id: 'cs', fn: (item) => {
            this.addToCollection(item)
            message.success('添加收藏成功。')
          }
        },
        {
          title: '删除', shortKeys: 'Delete', id: 'd', fn: (item) => {
            this.remove(item)
            message.success("删除成功。")
          }
        }
      ]
      let menuList = [...defaultMenu]
      if (this.urls.length === 0) {
        menuList.splice(1, 1)
      }
      if (this.clipItem._id.includes('collection')) {
        _.remove(menuList, (item) => {
          return item.title === '添加到收藏'
        })
      }
      if(this.hidePreview){
        _.remove(menuList, (item) => {
          return item.title === '预览'
        })
      }
      if (['image', 'video', 'audio'].includes(this.clipItem.type)) {
        menuList.splice(2, 0, {
          title: '打开所在位置', shortKeys: 'Show', id: 's', fn: (item) => {
            require('electron').shell.showItemInFolder(this.clipItem.path || this.clipItem.filepath)
          }
        })
      }
      // if (['image','video','audio'].includes(this.clipItem.type)){
      //   menuList.splice(1,1)
      // }
      return [
        ...menuList
      ]
    },
  },
  mounted() {

  },
  methods: {
    ...mapActions(clipboardStore, ['remove', 'addToCollection', 'setClipboard']),
    previewItem(item) {
      this.$emit('previewItem', {item})
    },
    clickItem(){
      this.$emit('clickItem')
    }
  }
}
</script>

<template>
  <div class="menu-wrapper">
    <div  v-for="item in menuList" @click="this.clickItem();item.fn(clipItem)"
         class="flex pointer justify-between xt-bg-2 button-active xt-text  btn-list px-4 rounded-lg py-3 mb-2">
      <span>{{ item.title }}</span>
<!--      <span>{{ item.shortKeys }}</span>-->
    </div>
  </div>

</template>

<style scoped lang="scss">

</style>
