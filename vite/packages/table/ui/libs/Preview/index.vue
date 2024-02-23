  <template>
    <!-- <teleport to='body' > -->
        <!-- v-model="renameFlag" -->
        <xt-modal v-model="test" index="99999999" :maskIndex="9999999" title="添加到分组"  boxClass="rounded-xl p-4" :mask="true" :header="true" :footer="true"  v-if="true" @ok="" >
          <div @click.stop="tt" class="xt-modal rounded-xl relative px-2" style="width: 466px; height: 380px;" >
            <xt-select v-model="chooseIndex" :zIndex="999999999" class="w-full h-10" :h="40" :list="showCard" :bordered="false"></xt-select>
            <xt-preDesk :chooseIndex="cardList[chooseIndex]" class="mt-4 overflow-hidden"></xt-preDesk>
          </div>
        </xt-modal>
    <!-- </teleport> -->
  </template>
  
  <script>
  import { mapActions, mapWritableState } from 'pinia'
  import { cardStore } from '../../../store/card';
  import { appStore } from "../../../store"; 
  import { useWidgetStore } from '../../../../table/components/card/store';

  export default {
    data() {
      return {
        test: true,
        chooseIndex: null,
        cardList: [],
      }
    },
    props: ['previewFlag'],
    computed: {
      ...mapWritableState(cardStore, ['desks', 'currentDesk']),
      ...mapWritableState(useWidgetStore, ['edit']),
      showCard(){
        let arr = []
        console.log('this.desks', this.desks)
        this.desks.forEach(item => {
          item.cards.forEach((card, index) => {
            if(card.name == 'folder') arr.push({
              ...card,
              // cardName: card.customData?.name,
              name: item.name + '-' + card.customData?.name,
              value: arr.length,
              test: 'folder'
            })
          })
        })
        if(arr.length) this.chooseIndex = 0
        this.cardList = arr
        console.log('arr', arr)
        return arr
      }
    },
    beforeUnmount(){
      this.edit = false
    },
    methods: {
    },
  };
  </script>
  
  <style lang="scss" scoped></style>
  