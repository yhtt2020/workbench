  <template>
    <div style="width: 452px;height: 320px;" class="preview flex justify-center items-center" :style="{'background': bg}" >
        <div :style="{'transform': `scale(${scale})`}">
          <component
            :desk="desks[0]"
            :is="cardName"
            :customIndex="customIndex"
            :customSize="customSize"
            :customData="customData"
          />
        </div>
    </div>
  </template>

  <script>
  import previewMinis from "../../../../table/components/desk/preview.ts";
  import { mapActions, mapWritableState } from 'pinia'
  import { cardStore } from '../../../store/card';
  import { appStore } from "../../../store";
  import {DEFAULT} from '../../../js/const/default'
  export default {
    props:['chooseIndex'],
    mixins: [previewMinis],
    computed: {
      ...mapWritableState(cardStore, ['desks', 'currentDesk']),
      ...mapWritableState(appStore, ['backgroundImage']),
      bg(){
        let background = 'url('+ this.backgroundImage.path +')'
        return this.backgroundImage.path?background:`url('${DEFAULT.WALLPAPER}')`
      },
      customData(){
        if(this.chooseIndex){
          return this.chooseIndex.customData
        }
        return {
          customSize: '2x2',
          list: [],
          icon: "https://a.apps.vip/icons/iconSelect/icon/folder.svg?color=#ffffff",
          model: "custom",
          name: '文件夹',
        }
      },
      cardName(){
        if(this.chooseIndex){
          return this.chooseIndex?this.chooseIndex.cardName:''
        }
        return 'folder'
      },
      customSize(){
        if(this.chooseIndex){
          return this.chooseIndex.customData.customSize
        }
        return '2x2'
      },
      customIndex(){
        return this.chooseIndex?this.chooseIndex.id:new Date().getTime()
      },
      scale(){
        if(this.chooseIndex){
          let scale = 1;
          let str = this.chooseIndex.customData.customSize.split(/x|\*/);
          let scaleW = (380 / ( 135 * str[0])).toFixed(4)
          let scaleH = (260 / ( 100 * str[1])).toFixed(4)
          scale = scaleW > scaleH?scaleH:scaleW
          scale = scale > 1?1:scale
          return scale
        }
        return 1
      }
    },
    data() {
      return {
      }
    },
    mounted() {

    },

    components: {
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
