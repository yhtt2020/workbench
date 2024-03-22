  <template>
    <!-- <teleport to='body' > -->
        <!-- v-model="renameFlag" -->
        <xt-modal v-model="test" index="99999999" :maskIndex="9999999" title="添加到分组"  boxClass="rounded-xl p-4" :mask="true" :header="true" :footer="true"  v-if="test" @ok="change" >
          <div class="relative px-2 xt-modal rounded-xl" style="width: 466px; height: 380px;" >
            <div >
              <div class="flex">
                <xt-select v-model="deskIndex" @change="changeDesk" :zIndex="999999999" class="w-1/3" :h="40" :list="deskList" :bordered="false"></xt-select>
                <xt-select v-model="chooseIndex" :zIndex="999999999" class="w-1/3" :h="40" :list="showCard" :bordered="false"></xt-select>
              </div>
              <xt-preDesk :chooseIndex="card" class="mt-4 overflow-hidden"></xt-preDesk>
            </div>
          </div>
        </xt-modal>
        <!-- 添加到桌面 -->
        <!-- <xt-modal title="添加到桌面" :maskIndex="99999999" :index="999999999" boxClass="rounded-xl p-4" :mask="true" :header="true" :footer="true" v-model="deskFlag" v-if="deskFlag" @ok="addFolder" >
          <div class="relative flex xt-modal rounded-xl" style="width: 466px; height: 50px;" >
            <xt-select v-model="deskIndex" :zIndex="9999999999" style="width: 100%;" :list="deskList" :bordered="false"></xt-select>
          </div>
        </xt-modal> -->

    <!-- </teleport> -->
    <!-- 《<keep> -->
      <!-- components -->
      <!-- minix -->
    <!-- </keep>s -->
  </template>
  
  <script>
  import { mapActions, mapWritableState } from 'pinia'
  import { cardStore } from '../../../store/card';
  import { appStore } from "../../../store"; 
  import { useWidgetStore } from '../../../../table/components/card/store';
  import { favoStore } from '../../../apps/favorites/store';
  import { registerFolder } from "../../../apps/folder/src/hooks/register";
import { nanoid } from 'nanoid';


  export default {
    data() {
      return {
        test: true,
        chooseIndex: null,
        cardList: [],
        deskList: [],
        deskFlag: false,
        deskIndex: 0,
      }
    },
    props: ['previewFlag'],
    computed: {
      ...mapWritableState(cardStore, ['desks', 'currentDesk']),
      ...mapWritableState(useWidgetStore, ['edit']),
      ...mapWritableState(favoStore, ['folderIcons']),
      showCard(){
        let arr = []
        arr = this.cardList.filter(item=>{
          return item.deskId == this.deskList[this.deskIndex].id
        })
        arr.unshift({name: '新建文件夹', value: -1})
        this.chooseIndex = 0
        return arr
      },
      card(){
        if(this.chooseIndex >= 0){
          return this.cardList[this.chooseIndex]
        }else{
          return {
            name: '文件夹', 
            id: nanoid(6), 
            cardName: 'folder', 
            customData:{
              customSize: '2x2',
              list: [],
            }
          }
        }
      }
    },
    beforeUnmount(){
      this.edit = false
    },
    mounted() {
      let arr = []
      this.deskList = []
      this.desks.forEach((item, i) => {
        item.cards.forEach((card, index) => {
          if(card.name == 'folder') arr.push({
            ...card,
            name: card.customData?.name,
            value: arr.length,
            cardName: 'folder',
            index: index,
            deskId: item.id
          })
        })
        this.deskList.push({
          name: item.name,
          value: i,
          id: item.id
        })
      })
      if(arr.length) this.chooseIndex = 0
      this.cardList = arr
    },
    methods: {
      addFolder(){
        registerFolder(this.desks[this.deskIndex])
      },
      change(){
        this.desks.forEach(item=>{
          if(item.id == this.cardList[this.chooseIndex].deskId){
            item.cards.forEach(card=>{
              if(card.id == this.cardList[this.chooseIndex].id) card.customData.list.push(...this.folderIcons)
            })
          }
        })
      },
      changeDesk(){
        console.log('deskIndex', this.deskIndex)
        console.log('cardList', this.cardList)
        console.log('deskList', this.deskList)
      },
    },
  };
  </script>
  
  <style lang="scss" scoped></style>
  