<template>
    <div class="main-box ">
        <div class="box" v-for="(item, index) in   navLists  " :key="item.name" style="color: var(--font-color);background-color: var(--no-active-background-color);">
            <div class="add no-drag" @click="addCard(item)" v-if="item.option.length <= 1">
                <div class="icons">
                    <Icon icon="tianjia2" style="color: #000;"></Icon>
                </div>
            </div>
            <div class="add no-drag" @click="addCard(item)" v-else>
                <div class="text" style="color: #fff;">
                    · · ·
                </div>
            </div>
            <div class="left no-drag" @click="fullScreen(item)" style="background: var(--no-active-font-color);">
                <template v-if="item.option.length > 1">
                    <div class="top">
                        <img ref="imgRef" :class="{ 'zoom': item.option[0].name == 'middleWallpaper' }" class="img"
                            :src="getImg(item.option[0].name )" alt="">
                    </div>
                    <div class="bottom">
                        <img ref="imgRef" :class="{ 'zoom': i.name == 'middleWallpaper' }" v-for="i in item.option"
                            :src="getImg(i.name )" alt="" class="img">
                    </div>
                </template>
                <img v-else ref="imgRef" :src="getImg(item.option[0].name )" alt=""
                    :style="[{ zoom: item.option[0].zoom? item.option[0].zoom : '11%' }]">
            </div>
            <div class="right">
                <div class="title" style="color: var(--font-color);">{{ item.cname }}</div>
                <div class="text" style="color: var(--no-active-font-color);">{{ item.detail }}</div>
                <div class="icon" >
                    <div class="icon-box" v-for="i in item.sizes" :key="i" style="color:var(--no-active-font-color);background-color: var(--active-background-color);">{{ i }}</div>
                </div>
                <div class="data">
                    <Icon icon="xiazai" class="icons" style=" color: #508BFE; margin: 0; width: 20px;"></Icon>
                    <div class="data-box">
                        {{ item.download }}
                    </div>
                    <Icon icon="shijian" class="icons" style=" color: #52C41A; margin: 0; width: 20px;"></Icon>
                    <div class="data-box">{{ formatTimestamp(item.time) }}
                    </div>
                </div>
            </div>
        </div>
        <div class="box" style="  opacity: 0;height: 1px;"></div>
    </div>
    <NewPreviewCardDetails v-if="isCardDetails" @addCardAchieve="addCardAchieve" @closeCardDetails="closeCardDetails"
        :cardDetails="cardDetails">
    </NewPreviewCardDetails>
</template>

<script>
import { mapActions } from "pinia";
import { cardStore } from "../../../store/card";
import { message } from "ant-design-vue";
import NewPreviewCardDetails from "./NewPreviewCardDetails.vue"
export default {
    props: {
        navList: {
            type: Object,
            default: true,
        },
        search: {
            type: String
        },
        desk: {
            type: Object,
            required: true,
            default: () => { }
        }
    },

    data() {
        return {
            navLists: [],
            carouselIndex: 0,
            isCardDetails: false,
            cardDetails: {}
        }
    },
    components: {
        NewPreviewCardDetails
    },
    watch: {
        navList: {
            immediate: true,
            handler() {
                this.navLists = JSON.parse(JSON.stringify(this.navList))
            }
        },
        search: {
            immediate: true,
            handler(newV, oldV) {
                if (newV == "下载次数") this.navLists = this.mySort(this.navLists, "download")
                else if (newV == "更新时间") this.navLists = this.mySort(this.navLists, "time")
                else this.navLists = this.navList
            }
        },
    },
    methods: {
        ...mapActions(cardStore, ["addCustomComponents"]),
      getImg(url){
          return '/img/addCard/' + url + '.png'
      },
        mySort(data, property, asc) {
            let datas = [...data]
            return datas.sort(function (a, b) {
                a = a[property]
                b = b[property]
                if (asc) return a - b
                else return b - a
            })
        },
        formatTimestamp(timestamp) {
            const date = new Date(timestamp);
            const year = date.getFullYear().toString();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        closeCardDetails() {
            this.isCardDetails = false
        },
        addImgClass(index) {
            this.$nextTick(() => {
                let img = this.$refs.imgRef
                let width = img[index].naturalWidth
                let height = img[index].naturalHeight
                if (width > height) img[index].setAttribute("class", "img-w");
                else img[index].setAttribute("class", "img-h");
            })
        },
        addCard(item) {
            if (item.option[1] != undefined) {
                this.fullScreen(item)
            } else {
                this.addCardAchieve(item)
            }
        },
        fullScreen(item) {
            this.cardDetails = item
            this.isCardDetails = true
        },
        addCardAchieve(item, i) {
            let index = i ?? this.carouselIndex
            this.addCustomComponents({ name: item.option[index].name, id: Date.now(), data: {} }, this.desk);
            this.$emit("addSuccess")
            this.$router.push({
                name: "home",
                params: {
                    name: item.option[index].name,
                    cname: item.cname,
                },
            });
            message.info("添加成功！");
        }
    },
}
</script>

<style lang="scss" scoped>
.main-box {
    display: flex;
    flex-wrap: wrap;
    margin: 0 auto;
    width: 100%;
    align-content: flex-start;
    justify-content: center;
}

.box {
    width: 542px;
    height: 184px;
    display: flex;
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.30);
    position: relative;
    margin: 18px;
    margin-left: 0;
    margin-top: 0;


    .add {
        position: absolute;
        right: 22px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.30);
        border-radius: 12px;
        width: 48px;
        height: 48px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        .icons {
            background: #fff;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            font-size: 12px !important;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .text {
            font-size: 20px !important;
            display: flex;
            align-items: center;
        }
    }

    .left {
        margin: 0;
        height: 184px;
        background: rgba(0, 0, 0, 0.30);
        border-radius: 12px 0px 0px 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 180px;
        cursor: pointer;

        img {
            zoom: 11%;
            // height: 55%;
        }

        .top {
            width: 100%;
            height: 120px;
            display: flex;
            justify-content: center;
            align-items: center;

            .img {
                zoom: 0.07 !important;
              object-fit: contain;
            }

            .zoom {
                zoom: 0.05 !important;
            }
        }

        .bottom {
            width: 100%;
            height: 60px;
            background: rgba(0, 0, 0, 0.30);
            border-radius: 0px 0px 0px 12px;
            display: flex;
            justify-content: space-around;
            padding: 10px;

            .zoom {
                zoom: 0.02 !important;
            }

            .img {
                zoom: 0.04;
                border-radius: 5px;
               object-fit: contain;
            }
        }

    }

    .right {
        box-sizing: border-box;
        padding: 10px;
        width: 358px;

        .title {
            font-family: PingFangSC-Medium;
            font-size: 18px;
            color: rgba(255, 255, 255, 0.85);
            font-weight: 500;
            height: 35px;
            line-height: 35px;
        }

        .text {
            display: flex;
            align-items: center;
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: rgba(255, 255, 255, 0.60);
            font-weight: 400;
            margin: 2px 0;
            width: 78%;
            height: 55px;


        }

        .icon {
            margin-bottom: 10px;
            display: flex;
            width: 100%;
            height: 24px;
            margin-top: 10px;

            .icon-box {
                padding: 0 10px 0 10px;
                margin-right: 10px;
                display: flex;
                justify-content: center;
                align-items: center;
                opacity: 0.4;
                padding: 4px 10px;
                border-radius: 4px;
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color: rgba(255, 255, 255, 0.9);
                font-weight: 500;
                background: rgba(255, 255, 255, 0.2);
            }
        }

        .data {
            display: flex;
            flex-wrap: wrap;
            align-items: center;

            .icons {
                color: #508BFE 100%;
                height: 16px;
            }

            .data-box {
                margin: 0 4px;
            }
        }
    }
}
</style>
