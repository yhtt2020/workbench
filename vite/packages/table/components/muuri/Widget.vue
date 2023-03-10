<template>
  <div
    class="vue-muuri-item item"
    :class="getClass"
    :id="this.uniqueKey"
  >
    <div v-show="editing" class="vue-muuri-header">
      <span class="text-more">{{ title }}{{ uniqueKey }}</span>
      <span
        v-if="showDelete != null ? showDelete : this.$parent.showDelete"
        class="vue-muuri-options"
        @click.stop="handleDelete"
      > <Icon icon="guanbi1"></Icon></span>
      <!--      <span-->
      <!--        v-if="-->
      <!--          showFullscreen != null ? showFullscreen : this.$parent.showFullscreen-->
      <!--        "-->
      <!--        class="vue-muuri-options"-->
      <!--        @click="showModal = true"-->
      <!--        >-->
      <!--        <Icon icon="quanping_huaban"></Icon>-->
      <!--      </span>-->
    </div>
    <div class="vue-muuri-item-content">
      <slot></slot>
    </div>
    <ResizeObserver v-show="editing" @notify="handleResize"></ResizeObserver>
  </div>
  <!--  <Modal v-if="showModal" :title="this.title" @close="showModal = false">-->
  <!--    <slot></slot>-->
  <!--  </Modal>-->
</template>

<script>
import { ResizeObserver } from 'vue3-resize'
import 'vue3-resize/dist/vue3-resize.css'
import { deckStore } from '../../store/deck'
import { mapState } from 'pinia'

export default {
  name: 'Widget',
  components: {
    // Modal: Modal,
    ResizeObserver: ResizeObserver,
  },
  props: {
    title: String,
    uniqueKey: String,
    showDelete: {
      type: Boolean,
      default: null,
    },
    showFullscreen: {
      type: Boolean,
      default: null,
    },
    height: Number,
    width: Number,
    resizable: {
      type: Boolean,
      default: null,
    },
  },
  computed: {
    ...mapState(deckStore, ['editing', 'settings']),
    getClass () {
      let classList = {
        muuriResizable: this.resizable != null ? this.resizable : this.$parent.resizable,

      }
      classList[this.settings.iconSize] = true
      return classList
    },

  },
  data () {
    return {
      showModal: false,
    }
  },
  methods: {
    handleDelete () {
      console.log('删除')
      //this.$parent.handleDelete(this.uniqueKey);
    },
    handleResize () {
      // this.$parent.handleResize();
    },
  },
}
</script>

<style scoped lang="scss">
.vue-muuri-header {
  background-color: #2d2d2d;
  color: #ffffff;
  cursor: move;
  padding: 2%;
}





.muuriResizable {
  overflow: hidden;
  resize: both;
}

.vue-muuri-item.muuri-item-dragging {
  z-index: 3;
}

.vue-muuri-item.muuri-item-releasing {
  z-index: 2;
}

.vue-muuri-item.muuri-item-hidden {
  z-index: 0;
}

.vue-muuri-item-content {
  text-align: center;
}


</style>
