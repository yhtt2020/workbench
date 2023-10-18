<template>
  <div
    class="vue-muuri-item item pointer"
    :class="getClass"
    :id="this.uniqueKey"

  >
<!--    <div v-show="editing" class="vue-muuri-header">-->
<!--&lt;!&ndash;      <span class="text-more">{{ title }}</span>&ndash;&gt;-->
<!--&lt;!&ndash;      <span&ndash;&gt;-->
<!--&lt;!&ndash;        v-if="showDelete != null ? showDelete : this.$parent.showDelete"&ndash;&gt;-->
<!--&lt;!&ndash;        class="vue-muuri-options"&ndash;&gt;-->
<!--&lt;!&ndash;        @click.stop="handleDelete"&ndash;&gt;-->
<!--&lt;!&ndash;      > <Icon icon="guanbi1"></Icon></span>&ndash;&gt;-->
<!--      &lt;!&ndash;      <span&ndash;&gt;-->
<!--      &lt;!&ndash;        v-if="&ndash;&gt;-->
<!--      &lt;!&ndash;          showFullscreen != null ? showFullscreen : this.$parent.showFullscreen&ndash;&gt;-->
<!--      &lt;!&ndash;        "&ndash;&gt;-->
<!--      &lt;!&ndash;        class="vue-muuri-options"&ndash;&gt;-->
<!--      &lt;!&ndash;        @click="showModal = true"&ndash;&gt;-->
<!--      &lt;!&ndash;        >&ndash;&gt;-->
<!--      &lt;!&ndash;        <Icon icon="quanping_huaban"></Icon>&ndash;&gt;-->
<!--      &lt;!&ndash;      </span>&ndash;&gt;-->
<!--    </div>-->
    <div class="vue-muuri-item-content" >
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
import { deckStore } from '../../apps/deck/store'
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
        //muuriResizable: this.resizable != null ? this.resizable : this.$parent.resizable,

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
  &:hover,&.active{
    opacity: 0.8;
  }
}


</style>
