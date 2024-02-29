  <template>
    <div style="width: 452px;height: 320px;" class="preview flex justify-center items-center" :style="{'background': bg}" >
        <div :style="{'transform': `scale(${scale})`}">
          <component
            :desk="currentDesk"
            :is="chooseIndex?.test"
            :customIndex="chooseIndex?.id"
            :customSize="customSize"
            :customData="customData"
            />
        </div>
    </div>
  </template>
  
  <script>
  import componentsMinis from "../../../../table/components/desk/components.ts";
  import { mapActions, mapWritableState } from 'pinia'
  import { cardStore } from '../../../store/card';
  import { useWidgetStore } from '../../../../table/components/card/store';
  import { appStore } from "../../../store"; 
  export default {
    props:['chooseIndex'],
    computed: {
      ...mapWritableState(cardStore, ['desks', 'currentDesk']),
      ...mapWritableState(appStore, ['backgroundImage']),
      bg(){
        let background = 'url('+ this.backgroundImage.path +')'
        return this.backgroundImage.path?background:"url('https://a.apps.vip/icons/defaultBackground.jpg')"
      },
      customData(){
        return this.chooseIndex.customData?this.chooseIndex.customData:this.desks[0].cards[0].customData
      },
      customSize(){
        let str = this.chooseIndex.customData.customSize.split(/x|\*/);
        let scaleW = (380 / ( 135 * str[0])).toFixed(4)
        let scaleH = (260 / ( 100 * str[1])).toFixed(4)
        this.scale = scaleW > scaleH?scaleH:scaleW
        this.scale = this.scale > 1?1:this.scale
        return str.join('x')
      }
    },
    data() {
      return {
        test: true,
        scale: 1,
      }
    },
    mixins: [componentsMinis],
    mounted() {
      
    },

    components: {
      // Desk,
      // component,
    },
    methods: {
    ...mapActions(cardStore, ['getCurrentDesk']),
    },
  };
  </script>
  
  <style lang="scss" scoped>
    .preview{
      border-radius: 10px;
      background: url('https://p.ananas.chaoxing.com/star3/origin/ca96f7dba8b0957fee9206f68e01f1f4.jpg') ; 
      background-size: cover !important;
      background-repeat: no-repeat !important;
      background-position: center !important;

    }
  </style>
  