<template>
	<div class="app-wrapper">
		<PdfTopbar
			:doc-name="docName"
			:upload-date="uploadDate"
			@toggle-sidebar="toggleSidebar"
			@toggle-theme="toggleTheme"
			@prev-page="prevPage"
			@next-page="nextPage"
			@upload="handleUpload"
		/>

		<PdfSidebar
			:is-open="isSidebarOpen"
			:thumbnails="pageThumbnails"
			:current-page="currentPage"
			:mode="mode"
			@go-to-page="goToPage"
		/>

		<PdfViewer
			:pdf-doc="pdfDoc"
			:current-page="currentPage"
			:mode="mode"
			:total-pages="totalPages"
		/>

		<LoadingOverlay :is-loading="isLoading" />
	</div>
</template>

<script setup>
//imports
import { ref, onMounted, computed, markRaw } from "vue";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";

import PdfTopbar from "./components/PdfTopbar.vue";
import PdfSidebar from "./components/PdfSidebar.vue";
import PdfViewer from "./components/PdfViewer.vue";
import LoadingOverlay from "./components/LoadingOverlay.vue";

// estados
const isLoading = ref(false);
const isSidebarOpen = ref(false);
const isDarkMode = ref(false);
const docName = ref("Document");
const uploadDate = ref("");
const currentPage = ref(1);
const totalPages = ref(0);
const mode = ref("dual");
const pdfDoc = ref(null);
const pageThumbnails = ref([]); // array de miniaturas

//computed
const numPagesToAdvance = computed(() => {
	return mode.value === "dual" ? 2 : 1;
});

//logica pdf.js
function formatDateTime(timestamp) {
	const date = new Date(timestamp);
	return date.toLocaleString([], {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	});
}

async function loadPdf(fileOrUrl) {
	isLoading.value = true;
	let loadingTask;

	if (typeof fileOrUrl === "string") {
		docName.value = fileOrUrl.split("/").pop().split(".")[0];
		loadingTask = pdfjsLib.getDocument(fileOrUrl);
	} else {
		docName.value = fileOrUrl.name.replace(".pdf", "");
		const reader = new FileReader();
		const typedArray = await new Promise((resolve, reject) => {
			reader.onload = () => resolve(new Uint8Array(reader.result));
			reader.onerror = reject;
			reader.readAsArrayBuffer(fileOrUrl);
		});
		loadingTask = pdfjsLib.getDocument(typedArray);
	}

	try {
		pdfDoc.value = markRaw(await loadingTask.promise);
		totalPages.value = pdfDoc.value.numPages;
		uploadDate.value = `Subido: ${formatDateTime(Date.now())}`;
		currentPage.value = 1;
		await renderThumbnails();
	} catch (error) {
		console.error("Error al cargar PDF:", error);
		alert("Error al cargar PDF.");
	} finally {
		isLoading.value = false;
	}
}

async function renderThumbnails() {
	const thumbs = [];
	const thumbScale = 0.25;

	for (let i = 1; i <= totalPages.value; i++) {
		const page = await pdfDoc.value.getPage(i);
		const viewport = page.getViewport({ scale: thumbScale });

		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		canvas.width = viewport.width;
		canvas.height = viewport.height;

		await page.render({ canvasContext: ctx, viewport }).promise;

		thumbs.push({
			page: i,
			imgUrl: canvas.toDataURL(),
		});
	}

	pageThumbnails.value = thumbs;
}

function checkMode() {
	if (window.innerHeight > window.innerWidth) {
		mode.value = "single";
	} else {
		mode.value = "dual";
	}

	if (mode.value === "dual" && currentPage.value % 2 === 0) {
		//cambio de pagina impar
		currentPage.value = Math.max(1, currentPage.value - 1);
	}
}

//eventos clasicos
function toggleSidebar() {
	isSidebarOpen.value = !isSidebarOpen.value;
}

function toggleTheme() {
	isDarkMode.value = !isDarkMode.value;
	document.body.classList.toggle("dark-mode", isDarkMode.value);
}

function prevPage() {
	const newPage = currentPage.value - numPagesToAdvance.value;
	if (newPage >= 1) {
		currentPage.value = newPage;
	}
}

function nextPage() {
	const newPage = currentPage.value + numPagesToAdvance.value;
	if (newPage <= totalPages.value) {
		currentPage.value = newPage;
	}
}

function goToPage(pageNumber) {
	if (mode.value === "dual" && pageNumber % 2 === 0) {
		currentPage.value = pageNumber - 1;
	} else {
		currentPage.value = pageNumber;
	}
	isSidebarOpen.value = false;
}

function handleUpload(file) {
	loadPdf(file);
}

//hooks de lifecycle
onMounted(() => {
	checkMode();
	loadPdf("/Libro Constitución CC.pdf");
	window.addEventListener("resize", checkMode);
	window.addEventListener("keydown", (e) => {
		switch (e.key) {
			case "ArrowLeft":
				prevPage();
				break;
			case "ArrowRight":
				nextPage();
				break;
		}
	});
});
</script>

<style scoped>
.app-wrapper {
	display: flex;
	flex-direction: column;
	height: 100vh;
	width: 100vw;
	overflow: hidden;
}
</style>
