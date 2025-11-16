import "./style.css";

import { createApp } from "vue";
import App from "./App.vue";
import "./style.css"; // Or './assets/main.css'

//PDF.js
//libreria
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";
//css
import "pdfjs-dist/legacy/web/pdf_viewer.css";
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js`;

createApp(App).mount("#app");
