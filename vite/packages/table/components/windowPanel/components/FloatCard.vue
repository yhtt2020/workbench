<template>
    <div 
        class="absolute"
        style="z-index:500" 
        :style="{ left: `${position.x}px`, top: `${position.y}px`}">
        <component
            :desk="cardData.desks"
            :is="currentComponent"
            :custom-index="cardData.customIndex"
            :custom-data="cardData.customData"
            :custom-size="cardData.customSize"
        />
    </div>
</template>

<script>
import componentsMinis from '../../../../table/components/desk/components';

export default {
    name: 'FloatCard',
    mixins: [componentsMinis],
    data() {
        return {
        }
    },
    props: {
        cardData: {
            type: Object,
            default: () => {}
        },
        currentComponent: {
            type: String,
            default: ''
        },
        position: {
            type:Object,
            default: () => {
                return {
                    x:100,
                    y:90
                }
            }
        }
    },

    methods: {

    },

    watch: {
    },
    computed: {
        zoom() {
            if (this.zoom) {
                return this.zoom;
            }
            let scale = 1;
            let str = this.cardData.customSize.split(/x|\*/);
            let scaleW = (380 / (135 * str[0])).toFixed(4);
            let scaleH = (260 / (100 * str[1])).toFixed(4);
            scale = scaleW > scaleH ? scaleH : scaleW;
            scale = scale > 1 ? 1 : scale;
            return scale;
        }
    },

}

</script>
<style lang='scss' scoped></style>