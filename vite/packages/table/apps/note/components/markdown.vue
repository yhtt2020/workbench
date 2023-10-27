 <template>    
 <div class="h-full w-full" style="">
    <div id="vditor" class="h-full" style="border-radius:10px;" ></div>
 </div>

 </template>
 
 <script>
 import Vditor from 'vditor'
 import 'vditor/dist/index.css'
//  import 

 export default {
   components: {
    // Vditor
   },
   computed: {

    },
    data() {
        return {
            contentEditor: '',
        };
    },
    mounted(){
        this.contentEditor = new Vditor('vditor', {
            height: '100%',
            // width:500,
            toolbarConfig: {
                pin: true,
            },
            cache: {
                enable: false,
            }, 
            after: () => {
                this.contentEditor.setValue('hello, Vditor + Vue!')
            },
            // toolbar:['emoji','br']
        })
    },
   methods:{
     

 
   }
 };
 </script>
 <style lang="scss" scoped>
 </style>
 