const videoTpl = `
<div class="video-wrapper" style="display: flex;flex: 1;">
 <a-dropdown  :trigger="['contextmenu']" >

<video class="allow-drag" @mousedown.stop="" @contextmenu.stop=""   style="background: #000c17;border-radius: 4px;width: calc(100% - 20px);margin: auto;height: 100%;flex: 1;box-shadow: 0 0 10px #0000007a"   :src="source" :controls="controls">
<source  type="video/mp4">
</video>
<!--{{source}}-->
           <a-menu slot="overlay">
                      <a-menu-item @click="removeElement" key="remove">
                        移除组件
                      </a-menu-item>
<!--                      <a-menu-item @click="editElement(item)" key="edit">-->
<!--                        编辑组件-->
<!--                      </a-menu-item>-->
                    </a-menu>
                  </a-dropdown>
</div>
  `
Vue.component('eleVideo', {
  template: videoTpl,
  name: 'eleVideo',
  props: ['source','controls'],
  components: {},
  data () {
    return {
    }
  },
  computed: {},
  mounted () {
  },
  methods: {
    removeElement(){
      this.$emit('remove-element')
    },
    enterSubmit () {
    }
  }

  ,
  destroyed () {
  }
})
