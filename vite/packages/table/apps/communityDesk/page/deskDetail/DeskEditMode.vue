<!-- 开启成员桌面编辑模式 -->
<template>
  <DeskEditModal
    v-if="editVisible"
    v-model:zoom="globalSettings.cardZoom"
    v-model:aloneZoom="settings.cardZoom"
    :alone="settings.enableZoom"
    @exit="editVisible = false"
    @scrollbarRedirect="scrollbarRedirect"
  />
</template>

<script>
import DeskEditModal from "./DeskEditModal.vue";

export default {
  components: {
    DeskEditModal,
  },

  props: {
    settings: {
      type: Object,
      default: () => {},
    },

    globalSettings: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      editVisible: false,
    };
  },

  methods: {
    toggleEditing() {
      this.editVisible = true;
    },
    scrollbarRedirect(){
      this.$bus.emit('redirect');
    }
  },

  mounted(){
   this.$bus.on('openMemberEdit',()=>{
    this.editVisible = true;
   })
  }
};
</script>

<style lang="scss" scoped>
</style>