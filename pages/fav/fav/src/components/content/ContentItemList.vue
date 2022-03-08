<template>
  <div class="hello">
    <h3 style="margin-bottom:10px;margin-top: 20px">内容（{{ contents.length }}）</h3>
    <div style="min-height:150px">
        <a-dropdown :trigger="['contextmenu']" v-for="content in contentsOrderByCreateTime">
          <div class="sub-folder-wrapper" :class="{'selected':selectedKey===content}" @click="selectedKey=content"
               :style="{width:itemSize+'px',height:itemSize+50+'px'}"
               v-bind:key="content">

            <TypePwd v-if="content.type==='pwd'" v-bind:content="content"/>
            <TypePic v-if="content.type==='pic'" v-bind:content="content"/>


          </div>
          <template #overlay>
            <a-menu>
              <a-menu-item key="openPath" @click="open(content.baseInfo.path+content.baseInfo.filename)" >打开</a-menu-item>
              <a-menu-item key="find" @click="showItemInFolder(content.baseInfo.path+content.baseInfo.filename)">查看所在位置</a-menu-item>
              <a-menu-item v-if="content.type==='pic'" key="edit" @click="editPicture(content.baseInfo.path+content.baseInfo.filename)">编辑图片</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
    </div>

  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import TypePwd from '@/components/content/type/TypePwd'
import TypePic from '@/components/content/type/TypePic'
import ipc from '@/utils/ipc'
export default {
  name: 'ContentItemList',
  components: { TypePwd, TypePic },
  props: {
    msg: String
  },
  data () {
    return {
      selectedKey: null,

    }
  },
  methods:{
    open:ipc.openExternal,
    showItemInFolder:ipc.showItemInFolder,
    editPicture(src){
      ipc.handleFileAssign('image',{filePath:'file://'+src})
    }
  },
  computed: {
    ...mapState(
      {
        subFolders: state => state.subFolder.subFolders,
        itemSize: state => state.ui.itemSize,
        contents: state => state.content.contents
      }
    ),
    ...mapGetters('content',
      ['contentsOrderByCreateTime']
    )
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
