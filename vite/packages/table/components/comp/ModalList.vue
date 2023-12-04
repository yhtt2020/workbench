<template>
    <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg modal-list px-6 py-4 xt-modal "  >
      <div class="flex flex-row items-center xt-text ">
        <div class="ml-auto text-lg pl-12 ">{{title}}</div>
        <div @click="closeModal" class="pointer ml-auto h-12 w-12 rounded-lg flex " style="">
          <Icon icon="guanbi" class="no-drag m-auto" style="width:18px;height:18px;color: rgba(255, 255, 255, 0.85);" ></Icon>
        </div>
      </div>
      <vue-custom-scrollbar id="containerWrapper" :settings="ScrollbarSettings" class="mt-4 "
                            style="flex-shrink: 1;flex-grow: 1;height: calc(100% - 80px);">
          <a-row :gutter="[20,20]" id="bingImages">
            <a-col class="image-wrapper" v-for="img in imgList" :span="6" style="">
              <img   :data-source="img.path" :alt="img.resolution"
                   class="image-item pointer" :src="fileImageExtension(img) === true ? img.path : img.src"
                   @click="addImg(img)"
                   style="position: relative">
            </a-col>
          </a-row>
      </vue-custom-scrollbar>
    </div>
</template>

<script>
export default {
  name: "ModalList",
  props:['visible','title','imgList'],
  data(){
    return {
      ScrollbarSettings: {
        useBothWheelAxes: true,
        swipeEasing: true,
        suppressScrollY: false,
        suppressScrollX: true,
        wheelPropagation: true
      },
    }
  },
  methods:{
    closeModal(){
        this.$emit('update:visible',false)
    },
    fileImageExtension (filePath) {
      const fileExtensions = filePath.src.split('.').pop()
      const extensions = ['mp4', 'mpeg', 'avi', 'rmvb']
      if (extensions.indexOf(fileExtensions) !== -1) {
        return true
      } else {
        return false
      }
    },
    addImg(img){
      this.$emit('sendImg',img)
      this.$emit('update:visible',false)
    },
  }
}
</script>

<style scoped>
.modal-list{
  width: calc(100vw - 20%);
  height: calc(100vh - 10%);
  border-radius: 16px;
  max-width: 800px;
  max-height: 600px;
}
</style>
