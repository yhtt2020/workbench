import TipsInfo from '../components/folder/TipsInfo.vue'
import { useToast } from 'vue-toastification'
const toast = useToast({
    maxToasts: 1,
})

export const ctrlTip = () => {
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
}