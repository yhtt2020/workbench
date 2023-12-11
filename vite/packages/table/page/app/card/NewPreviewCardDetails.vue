<template>
    <teleport to="body">
        <div class='popContainer'></div>
        <div class="boxs card">
            <div class="main">
                <div class="card-box" v-for="(item, index) in cardDetails.option">
                    <img v-if="item.img" class="mb-6"  :src="item.img" alt="" :style="setImg(item.img)"/>
                    <div v-else class="img"> <img  ref="imgRef" :src="getImg(item.imgName)" alt=""
                            :style="[{ zoom: item.zoom * 1.8 + '%' }]">
                    </div>
                    <div class="size xt-active-bg-2 xt-text-2">{{ item.size }}</div>
                    <div class="add-btn no-drag xt-active-btn" @click="addCard(item, index)">
                        <div class="icons">
                            <Icon icon="tianjia2" style="color: #000;font-size: 12px;"></Icon>
                        </div>立即添加
                    </div>
                </div>
            </div>
            <div class="btn no-drag xt-bg xt-text" @click="onBack">
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
            return 'https://a.apps.vip/cards/' + url + '.png'
        },
        addCard(item, index) {
            console.log('执行......排查-3',this.cardDetails,index);
            this.onBack()
            this.$emit("addCardAchieve", this.cardDetails, index)
        },
        onBack() {
            this.$emit("closeCardDetails", false)
        },
        setImg(src){
            var img = new Image();
            img.src = src
            let size = {
                width: img.width,
                height: img.height
            }
            if(size.width > size.height){
                return {width: '360px'}
            }else{
                return {height: '320px'}
            }
        }

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
    // background: rgba(0,0,0,0);
    backdrop-filter: blur(40px);
    // -webkit-backdrop-filter: blur(50px);
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
            // background: rgba(0, 0, 0, 0.30);
            background: var(--primary-bg);
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
                padding: 4px 10px;
                border-radius: 4px;
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

