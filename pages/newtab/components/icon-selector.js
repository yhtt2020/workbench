const iconSelectorTpl = `
<div>
 <ul class="icons-list">
      <li :class="{'active':isSelectedIcon(icon)}" @click="selectIcon(icon)" @mousedown.stop="" v-for="icon in icons">
      <a-icon :type="icon"></a-icon>
</li>
</ul>
</div>
  `
const iconSelector=Vue.component('icon-selector', {
  template: iconSelectorTpl,
  name: 'icon-selector',
  model: {
    prop: ['value'],
    event: 'change'
  },
  props: [],
  components: {},
  data () {
    return {
      value: 'bulb',
      icons: [
        'bulb', 'alert', 'api', 'appstore', 'audio', 'bank', 'bell',
        'bug',   'calendar', 'camera', 'car',
        'carry-out','cloud','code','compass','control',
        'crown','customer-service','dashboard','eye',
        'folder','gift','heart','home',
        'like','mail','message','mobile','notification','picture','play-square'
        ,'profile','pushpin','read','rocket','schedule','shop',
        'shopping','skin','smile','star','tablet','tag','tool','thunderbolt','trophy'
        ,'video-camera','wallet','apartment','audit','bars','coffee' ,'desktop','dollar',
       'global'

      ]
    }
  },
  computed: {

  },
  mounted () {

  },
  methods: {

    selectIcon(icon){
      this.value=icon
      this.change()
    },
    isSelectedIcon(icon){
      return icon===this.value
    },
    change () {
      this.$emit('change', this.value)
    },
  }
  ,
  destroyed () {
  }
})

module.exports=iconSelector
