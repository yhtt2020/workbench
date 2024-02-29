  <template>
    <!-- <teleport to='body' > -->
        <!-- v-model="renameFlag" -->
        <xt-modal v-model="test" index="99999999" :maskIndex="9999999" title="添加到分组"  boxClass="rounded-xl p-4" :mask="true" :header="true" :footer="true"  v-if="test" @ok="change" >
          <div @click.stop="tt" class="xt-modal rounded-xl relative px-2" style="width: 466px; height: 380px;" >
            <div  v-if="showCard">
              <div class="flex">
                <xt-button @click="deskFlag = true" :radius="10" :w="140" :h="40" class="xt-main-bg mr-2">新建文件夹</xt-button>
                <xt-select v-model="chooseIndex" :zIndex="999999999" class="w-full h-10" :h="40" :list="showCard" :bordered="false"></xt-select>
              </div>
              <xt-preDesk :chooseIndex="cardList[chooseIndex]" class="mt-4 overflow-hidden"></xt-preDesk>
            </div>
            <div v-else class="flex justify-center items-center h-full">
              暂无文件夹数据
            </div>
          </div>
        </xt-modal>
        <!-- 添加到桌面 -->
        <xt-modal title="添加到桌面" :maskIndex="99999999" :index="999999999" boxClass="rounded-xl p-4" :mask="true" :header="true" :footer="true" v-model="deskFlag" v-if="deskFlag" @ok="addFolder" >
          <div class="xt-modal flex rounded-xl relative" style="width: 466px; height: 50px;" >
            <xt-select v-model="deskIndex" :zIndex="9999999999" style="width: 100%;" :list="deskList" :bordered="false"></xt-select>
          </div>
        </xt-modal>

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

  export default {
    data() {
      return {
        test: true,
        chooseIndex: null,
        cardList: [],
        deskFlag: false,
        deskIndex: 0,
        deskList: [],
      }
    },
    props: ['previewFlag'],
    computed: {
      ...mapWritableState(cardStore, ['desks', 'currentDesk']),
      ...mapWritableState(useWidgetStore, ['edit']),
      ...mapWritableState(favoStore, ['folderIcons']),
      showCard(){
        let arr = []
        this.deskList = []
        this.desks.forEach((item, i) => {
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
          this.deskList.push({
            name: item.name,
            value: i,
          })
        })
        if(arr.length) this.chooseIndex = 0
        this.cardList = arr
        return arr
      },
    },
    beforeUnmount(){
      this.edit = false
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
      }
    },
  };
  </script>
  
  <style lang="scss" scoped></style>
  