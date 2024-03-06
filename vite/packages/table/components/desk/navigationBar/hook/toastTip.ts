import TipsInfo from '../components/folder/TipsInfo.vue'
import { useToast } from 'vue-toastification'

const toast = useToast({
    maxToasts: 1,
})

let lastToastTime = 0;
const toastInterval = 5000; 

export const ctrlTip = () => {
    const currentTime = Date.now();
    if (currentTime - lastToastTime > toastInterval) {
        toast(
            {
                component:TipsInfo,
            },
            {
                position: "top-right",
                icon: false,
                closeOnClick: false,
                closeButton: false,
                pauseOnFocusLoss: true,
                pauseOnHover: true,
                timeout: 5000,
                toastClassName: "notice-toast",
                
            }
        )
        lastToastTime = currentTime;
    }
}