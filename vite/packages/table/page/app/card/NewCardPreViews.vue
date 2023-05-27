<template>
    <div class="main-box ">
        <div class="box" v-for="(item, index) in   navLists  " :key="item.name">
            <div class="add no-drag" @click="addCard(item)">
                <div class="icons">
                    <Icon icon="tianjia2" style="color: #000;"></Icon>
                </div>
            </div>
            <div class="left">
                <img ref="imgRef" :src="'/public/img/addCard/' + item.option[0].name + '.png'" alt="">
            </div>
            <div class="right">
                <div class="title">{{ item.cname }}</div>
                <div class="text">{{ item.detail }}</div>
                <div class="icon">
                    <div class="icon-box" v-for="  i   in   item.sizes  " :key="i">{{ i }}</div>
                </div>
                <div class="data">
                    <Icon icon="xiazai" class="icons" style=" color: #508BFE; margin: 0; width: 20px;"></Icon>
                    <div class="data-box">
                        999
                    </div>
                    <Icon icon="shijian" class="icons" style=" color: #52C41A; margin: 0; width: 20px;"></Icon>

                    <div class="data-box">5月24日</div>
                </div>
            </div>
        </div>
        <div class="box" style="  opacity: 0;"></div>
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
    mounted() {
    },
    watch: {
        navList: {
            immediate: true,
            handler() {
                this.navLists = JSON.parse(JSON.stringify(this.navList))
            }
        }
    },
    methods: {
        ...mapActions(cardStore, ["addCustomComponents"]),
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

            setTimeout(() => {
                let img = this.$refs.imgRef
                let width = img[index].naturalWidth
                let height = img[index].naturalHeight

                console.log('width :>> ', width, 'height :>> ', height);
                if (width > height) img[index].setAttribute("class", "img-w");
                else img[index].setAttribute("class", "img-h");
            }, 0)
        },
        addCard(item) {

            if (item.option[1] != undefined) {
                this.cardDetails = item
                this.isCardDetails = true
            } else {
                this.addCardAchieve(item)
            }
        },
        addCardAchieve(item, i) {
            let index = i ?? this.carouselIndex
            this.addCustomComponents({ name: item.option[index].name, id: Date.now(), data: {} });
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
    margin-bottom: 30px;
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
    }

    .left {
        margin: 0;
        height: 184px;
        background: rgba(0, 0, 0, 0.30);
        border-radius: 12px 0px 0px 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 180px;

        img {
            zoom: 10%;
        }

        // .img-h {
        //     height: 120px;
        //     width: 80px;
        // }

        // .img-w {
        //     width: 120px;
        //     height: 88px;
        // }
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
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: rgba(255, 255, 255, 0.60);
            font-weight: 400;
            margin: 2px 0;
            width: 78%;
        }

        .icon {
            margin-bottom: 10px;
            display: flex;
            width: 100%;
            height: 24px;
            margin-top: 10px;

            .icon-box {
                background: rgba(255, 255, 255, 0.40);
                border-radius: 4px;
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color: rgba(255, 255, 255, 0.50);
                font-weight: 500;
                padding: 0 10px 0 10px;
                margin-right: 10px;
                display: flex;
                justify-content: center;
                align-items: center;
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
                margin-right: 12px;
            }
        }
    }
}
</style>