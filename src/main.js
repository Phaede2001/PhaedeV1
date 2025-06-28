import { createApp } from "vue";
import VueDraggableResizable from 'vue-draggable-resizable'
import App from "./App.vue";

// This is the corrected line, pointing to the 'mixins' folder
import GoogleDriveApi from './mixins/GoogleDriveApi.js'; 

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

createApp(App)
    .mixin(GoogleDriveApi) 
    .component("vue-draggable-resizable", VueDraggableResizable)
    .use(VueSweetalert2)
    .mount('#app')