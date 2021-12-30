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
        'bulb','account-book', 'alert', 'api', 'appstore', 'audio', 'bank', 'bell', 'book', 'bug',  'calculator', 'build', 'calendar', 'camera', 'car',
        'carry-out','cloud','code','compass','contacts','container','control','credit-card','crown','customer-service','dashboard','database','dislike','environment',
        'experiment','eye-invisible','eye','file-add','file-excel','file-exclamation','file-image','file-markdown','file-pdf','file-ppt','file-text','file-unknown','file-image',
        'file-markdown','file-pdf','file-ppt','file-text','file-unknown','file-word','folder','folder-open','frown','funnel-plot','gift','hdd','heart','home','hourglass','idcard',
        'insurance','interaction','layout','like','lock','mail','medicine-box','meh','message','mobile','money-collect','pay-circle','notification','phone','picture','play-square',
        'printer','profile','pushpin','property-safety','read','reconciliation','red-envelope','rest','rocket','safety-certificate','save','schedule','security-scan','setting','shop',
        'shopping','skin','smile','sound','star','switcher','tablet','tag','tags','tool','thunderbolt','trophy','unlock','usb','video-camera','wallet','apartment','audit','barcode','bars','' +
        'block','border','branches','ci','cloud-download','cloud-server','cloud-sync','cloud-upload','cluster','coffee','copyright' ,'deployment-unit','desktop','disconnect','dollar',
        'download','ellipsis','euro','exception','export','file-done','file-jpg','file-protect','file-sync','file-search','fork','gateway','global'

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
