import { createApp } from "vue";
import VueDraggableResizable from 'vue-draggable-resizable'
import App from "./App.vue";

// STEP 1: Import the GoogleDriveApi file
import GoogleDriveApi from './GoogleDriveApi.js'; // <-- ADD THIS LINE

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// STEP 2: Add .mixin(GoogleDriveApi) to the chain
createApp(App)
    .mixin(GoogleDriveApi) // <-- ADD THIS LINE
    .component("vue-draggable-resizable", VueDraggableResizable)
    .use(VueSweetalert2)
    .mount('#app')