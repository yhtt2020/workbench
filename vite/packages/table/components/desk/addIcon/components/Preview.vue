<template>
    <xt-modal v-model="test" index="99999999" :maskIndex="9999999" title="添加到分组" boxClass="rounded-xl p-4" :mask="true"
        :header="true" :footer="true" v-if="test" @ok="change">
        <div  class="relative px-2 xt-modal rounded-xl" style="width: 466px; height: 380px;">
            <div>
                <div class="flex">
                    <xt-select v-model="defaultDesk" :list="deskList" :zIndex="1250" class="w-1/3"></xt-select>
                    <xt-select v-model="defaultFolder" :list="showCard" :zIndex="1250" class="w-1/3"></xt-select>
                </div>
                <xt-preDesk :chooseIndex="card" class="mt-4 overflow-hidden"></xt-preDesk>
            </div>
        </div>
    </xt-modal>
</template>

<script>
import { mapActions, mapWritableState } from 'pinia'
import { cardStore } from '../../../../store/card';
import { appStore } from "../../../../store";
import { homeStore } from '../../../../store/home';
import { useWidgetStore } from '../../../card/store';
import { favoStore } from '../../../../apps/favorites/store';
import { registerFolder } from "../../../../apps/folder/src/hooks/register";
import { nanoid } from 'nanoid';


export default {
    data() {
        return {
            test: true,
            defaultDesk: null,
            defaultFolder: null,
            chooseIndex: 1,
            cardList: [],
            deskFlag: false,
            deskIndex: 0,
        }
    },
    props: ['previewFlag'],
    computed: {
        ...mapWritableState(homeStore,['currentDeskId']),
        ...mapWritableState(cardStore, ['desks']),
        ...mapWritableState(useWidgetStore, ['edit']),
        ...mapWritableState(favoStore, ['folderIcons']),
        showCard() {
            let arr = []
            arr = this.cardList.filter(item => {
                return item.deskId == this.deskList[this.deskIndex].id
            })
            arr.unshift({ name: '新建文件夹', value: -1 })
            this.chooseIndex = 0
            return arr
        },
        card() {
            if (this.chooseIndex >= 0) {
                return this.defaultFolder
            } else {
                return {
                    name: '文件夹',
                    id: nanoid(6),
                    cardName: 'folder',
                    customData: {
                        customSize: '2x2',
                        list: [],
                    }
                }
            }
        },
        deskList(){
            return this.desks.map((item,index) => {
                return {
                    name: item.name,
                    value: item.id
                }
            })
        }
    },
    beforeUnmount() {
        this.edit = false
    },
    mounted() {
        // let arr = []
        // this.deskList = []
        // this.desks.forEach((item, i) => {
        //     item.cards.forEach((card, index) => {
        //         if (card.name == 'folder') arr.push({
        //             ...card,
        //             name: card.customData?.name,
        //             value: arr.length,
        //             cardName: 'folder',
        //             index: index,
        //             deskId: item.id
        //         })
        //     })
        //     this.deskList.push({
        //         name: item.name,
        //         value: i,
        //         id: item.id
        //     })
        // })
        // if (arr.length) this.chooseIndex = 0
        // this.cardList = arr

        
        this.changeDesk()
        this.defaultDesk = this.desks.find(item => item.id == this.currentDeskId)
        this.defaultFolder = this.defaultDesk.cards.find(item => item.name == 'folder')
        console.log(this.defaultDesk,this.defaultFolder);
    },
    methods: {
        registerFolder,
        // addFolder() {
        //     this.registerFolder(this.desks[this.deskIndex])
        // },
        // change() {
        //     this.desks.forEach(item => {
        //         if (item.id == this.cardList[this.chooseIndex].deskId) {
        //             item.cards.forEach(card => {
        //                 if (card.id == this.cardList[this.chooseIndex].id) card.customData.list.push(...this.folderIcons)
        //             })
        //         }
        //     })
        // },
        changeDesk() {
            console.log('deskIndex', this.deskIndex)
            console.log('cardList', this.cardList)
            console.log('deskList', this.deskList)
        },
    },
};
</script>

<style lang="scss" scoped></style>