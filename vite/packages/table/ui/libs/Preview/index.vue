  <template>
    <!-- <teleport to='body' > -->
        <!-- v-model="renameFlag" -->
        <xt-modal v-model="test" index="99999999" :maskIndex="9999999" title="添加到分组"  boxClass="rounded-xl p-4" :mask="true" :header="true" :footer="true"  v-if="test" @ok="change" >
          <div @click.stop="tt" class="relative px-2 xt-modal rounded-xl" style="width: 466px; height: 380px;" >
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
        chooseIndex: {name: '新建文件夹', value: 0,},
        deskList: [],
        deskIndex: 0,
        // 处理完的数据 
        cardTmp: {},
      }
    },
    props: ['previewFlag'],
    computed: {
      ...mapWritableState(cardStore, ['desks', 'currentDesk']),
      ...mapWritableState(useWidgetStore, ['edit']),
      ...mapWritableState(favoStore, ['folderIcons']),
      showCard(){
        return this.deskList[this.deskIndex]?.folder
      },
      card(){
        if(this.deskList){
          this.cardTmp = this.deskList[this.deskIndex]?.folder[this.chooseIndex]
          return this.cardTmp
        }
        return
      }
    },
    beforeUnmount(){
      this.edit = false
    },
    mounted() {
      this.deskList = []
      this.desks.forEach((item, i) => {
        this.deskList.push({
          name: item.name,
          value: i,
          id: item.id,
          // 预览数据
          folder: [
            {
              name: '新建文件夹', 
              value: 0,
              id: '170000000', 
              cardName: 'folder', 
              customData:{
                customSize: '2x2',
                list: [],
                icon: "https://a.apps.vip/icons/iconSelect/icon/folder.svg?color=#ffffff",
                model: "custom",
                name: '文件夹',
              },
              deskId:nanoid(6)
            }
          ],
        })
        // 取出全部文件夹
        item.cards.forEach((card, index) => {
          if(card.name == 'folder') this.deskList[i].folder.push({
            ...card,
            name: card.customData?.name,
            value: this.deskList[i].folder.length,
            cardName: 'folder',
            index: index,
            deskId: item.id
          })
        })
      })
    },
    methods: {
      // 切换桌面列表
      changeDesk(){
        this.chooseIndex = {name: '新建文件夹', value: 0,}
      },
    },
  };
  </script>
  
  <style lang="scss" scoped></style>
  