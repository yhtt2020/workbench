<template>
    <teleport to="body">
        <div class='popContainer'></div>
        <div class="boxs card">
            <div class="main">
                <div class="card-box" v-for="(item, index) in cardDetails.option">
                    <div class="img"> <img  ref="imgRef" :src="getImg(item.name)" alt=""
                            :style="[{ zoom: item.zoom * 1.8 + '%' }]">
                    </div>
                    <div class="size">{{ item.size }}</div>
                    <div class="add-btn no-drag" @click="addCard(item, index)">
                        <div class="icons">
                            <Icon icon="tianjia2" style="color: #000;font-size: 12px;"></Icon>
                        </div>立即添加
                    </div>
                </div>
            </div>
            <div class="btn no-drag" @click="onBack">
                <Icon icon="xiangzuo" style="height: 24px; width: 24px"></Icon>
            </div>


        </div>
    </teleport>
</template>

<script>
export default {
    props: {
        cardDetails: {
            type: Object
        },
    },
    methods: {
        getImg(url) {
            return '/img/addCard/' + url + '.png'
        },
        addCard(item, index) {
            this.onBack()
            this.$emit("addCardAchieve", this.cardDetails, index)
        },
        onBack() {
            this.$emit("closeCardDetails", false)
        },

    }
}
</script>

<style lang="scss" scoped>
.popContainer {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99999;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    // 背景的模糊大小通过下面的属性值大小来调制
    background-color: rgba(19, 19, 19, 0.65);
    backdrop-filter: blur(50px);
    -webkit-backdrop-filter: blur(50px);
}

.boxs {
    width: 100%;
    height: 100%;
    overflow: auto;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99911199;


    .btn {
        position: absolute;
        z-index: 99919199;
        cursor: pointer;
        top: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.30);
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 112px;
        height: 48px;
        margin-right: 20px;
    }

    .main::-webkit-scrollbar {
        display: none;
    }

    .main {
        height: 100%;
        width: 70%;
        margin: 20px auto 0;
        overflow: auto;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;

        .card-box {
            width: 400px;
            height: 496px;
            background: rgba(0, 0, 0, 0.30);
            border-radius: 12px;
            margin: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;

            .img {
                img {
                    zoom: 25%;
                }

                margin-bottom: 25px;

            }

            .size {
                opacity: 0.6;
                padding: 4px 10px;
                background: rgba(255, 255, 255, 0.40);
                border-radius: 4px;
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color: rgba(255, 255, 255, 1);
                font-weight: 500;
                margin-bottom: 25px;
            }

            .add-btn {
                display: flex;
                justify-content: center;
                cursor: pointer;

                align-items: center;
                background: rgba(0, 0, 0, 0.30);
                border-radius: 12px;
                width: 142px;
                height: 48px;

                .icons {
                    margin-right: 10px;
                    border-radius: 50%;
                    background-color: #fff;
                    width: 16px;
                    height: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
        }
    }
}
.box {
    z-index: 99911199;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>

