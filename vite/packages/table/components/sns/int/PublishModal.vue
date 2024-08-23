<template>
  <xt-modal :full="true" v-model="visible" v-if="visible" title="" @close="handleOk">
    <template #header-center>
      <xt-option-select
        style="width: 110px;background-color: transparent !important;"
        :border="false"
        :list="publishList"
        v-model="select">
      </xt-option-select>
    </template>
    <div style="min-width: 450px;max-height: 700px;">
      <DynamicItem v-if="select === 'dynamic'"></DynamicItem>
      <PostItem v-if="select === 'post'"></PostItem>
      <ShowImage :defaultType="select"></ShowImage>
    </div>
    <template #footer>
      <div class="flex justify-between">
        <xt-option-select
          style="width: 150px;"
          :list="section"
          v-model="defaultSection">
        </xt-option-select>
        <div class="flex items-center ">
          <xt-button type="text" class=" xt-bg-2" :w="64" :h="40" style="border-radius:10px;"
                     @click="handleOk">取消
          </xt-button>
          <xt-button type="primary" class="ml-2" :w="64" :h="40"
                     style="border-radius:10px ; color:rgba(255,255,255,0.85) !important;background-color: var(--active-bg);"
                     @click="publishPost">发布
          </xt-button>
        </div>
      </div>
    </template>
  </xt-modal>
</template>

<script setup lang='ts'>
import {ref, reactive, computed, toRefs, watch} from 'vue'
import DynamicItem from '../../widgets/communityContent/Detail/DynamicItem.vue';
import PostItem from '../../widgets/communityContent/Detail/PostItem.vue';
import {publishList} from '../../widgets/communityContent/Detail/options'
import ShowImage from '../../widgets/communityContent/Detail/ShowImage.vue'
import {message} from 'ant-design-vue'
import {storeToRefs} from 'pinia';
import {useCommunityStore} from '../../../apps/chat/store/commun'
import {yuanCommunityStore} from '../../../store/yuanCommunity'

const useCommunStore = useCommunityStore()

const useYuanCommunityStore = yuanCommunityStore()
const {postContent, dynamicContent} = storeToRefs(useYuanCommunityStore)
const props = defineProps({
  section: {
    type: Array,
    default: () => []
  },
  defaultSection: {
    type: String,
    default: () => ''
  },
  visible: Boolean
})
const {section, defaultSection, visible} = toRefs(props)
const emit = defineEmits(['close', 'refresh', 'publishOk'])
const select = ref('dynamic')
const handleOk = () => {
  emit('close')
}
const publishOk = (data) => {
  console.log('网上传',data)
  emit('publishOk',data)
  emit('close')
}
const publishPost = async () => {
  let promise = new Promise((resolve, reject) => {
    try {
      if (dynamicContent.value.content || dynamicContent.value.imagesList.length > 0 && defaultType.value == 'dynamic') {
        let dynamic = dynamicContent.value
        setTimeout(async () => {
          let img=dynamic.imagesList
          if(typeof img!=='string'){
            img=JSON.stringify(img)
          }
          let rs = await useCommunStore.getCommunityPublishPost(defaultSection.value.value, img, dynamic.content)
          resolve(rs)
        });
      } else if (postContent.value.content || postContent.value.imagesList.length > 0 && defaultType.value == 'post') {
        let post = postContent.value
        const title = post.title.length > 5 ? post.title : post.content.slice(0, 5)
        setTimeout(async () => {
          // console.log(cascaderValue.value, post.imagesList, post.content, title, post.coverList, 'post-publish')
          let img=post.imagesList
          if(typeof img!=='string'){
            img=JSON.stringify(img)
          }
          let rs = await useCommunStore.getPublishPost(defaultSection.value.value, img, post.content, title, post.coverList)
          resolve(rs)
        });

      }
    } catch (error) {
      reject(error)
    }

  })
  promise.then(rs => {
    console.log(rs, '返回结果')
    message.success('发布成功')
    publishOk(rs.data)
    clearAllContent()
    refreshDefaultForum()
  }).catch(err => {
    console.log(err, '错误信息')
    message.error('发布失败')
  })

}

const clearAllContent = () => {
  if (select.value === 'dynamic') {
    dynamicContent.value = {
      content: '',
      imagesList: []
    }
  } else if (select.value === 'post') {
    postContent.value = {
      content: '',
      imagesList: [],
      title: '',
      coverList: []
    }
  }
}

const refreshDefaultForum = () => {
  emit('refresh', defaultSection.value)
}
</script>
<style lang='scss' scoped></style>
