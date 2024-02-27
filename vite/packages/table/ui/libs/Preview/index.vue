  <template>
    <!-- <teleport to='body' > -->
        <!-- v-model="renameFlag" -->
        <xt-modal v-model="test" index="99999999" :maskIndex="9999999" title="添加到分组"  boxClass="rounded-xl p-4" :mask="true" :header="true" :footer="true"  v-if="test" @ok="change" >
          <div @click.stop="tt" class="xt-modal rounded-xl relative px-2" style="width: 466px; height: 380px;" >
            <div  v-if="showCard">
              <xt-select v-model="chooseIndex" :zIndex="999999999" class="w-full h-10" :h="40" :list="showCard" :bordered="false"></xt-select>
              <xt-preDesk :chooseIndex="cardList[chooseIndex]" class="mt-4 overflow-hidden"></xt-preDesk>
            </div>
            <div v-else class="flex justify-center items-center h-full">
              暂无文件夹数据
            </div>
          </div>
        </xt-modal>
    <!-- </teleport> -->
  </template>
  
  <script>
  import { mapActions, mapWritableState } from 'pinia'
  import { cardStore } from '../../../store/card';
  import { appStore } from "../../../store"; 
  import { useWidgetStore } from '../../../../table/components/card/store';
  import { favoStore } from '../../../apps/favorites/store';

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
      ...mapWritableState(favoStore, ['folderIcons']),
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
              test: 'folder',
              index: index,
              deskId: item.id
            })
          })
        })
        if(arr.length) this.chooseIndex = 0
        this.cardList = arr
        console.log('arr12132356', arr)
        return arr
      }
    },
    beforeUnmount(){
      this.edit = false
    },
    methods: {
      change(){
        let index = 0
        // console.log('index', index, this.desks, this.desks[index], this.cardList)
        this.desks.forEach(item=>{
          if(item.id == this.cardList[this.chooseIndex].deskId){
            console.log(1321315,item);
            item.cards.forEach(card=>{
              if(card.id == this.cardList[this.chooseIndex].id){
                console.log('1456s456fa456', card)
                card.customData.list.push(...this.folderIcons)
              }
            })
          }
        })
        // this.desks[index].cards.forEach(item=>{
        //   if(item.id == this.cardList[this.chooseIndex].id){
        //     console.log('1456s456fa456', item)
        //   }
        // })
      }
    },
  };
  </script>
  
  <style lang="scss" scoped></style>
  