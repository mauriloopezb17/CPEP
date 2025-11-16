<template>
	<main class="viewer" :data-mode="mode" ref="viewerEl">
		<PdfPage
			v-if="pdfDoc"
			:pdf-doc="pdfDoc"
			:page-num="currentPage"
			:container-width="containerWidth"
			:container-height="containerHeight"
		/>

		<PdfPage
			v-if="pdfDoc && mode === 'dual' && currentPage + 1 <= totalPages"
			:pdf-doc="pdfDoc"
			:page-num="currentPage + 1"
			:container-width="containerWidth"
			:container-height="containerHeight"
		/>
	</main>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import PdfPage from "./PdfPage.vue";

//props
const props = defineProps({
	pdfDoc: { type: Object, default: null },
	currentPage: { type: Number, default: 1 },
	mode: { type: String, default: "dual" },
	totalPages: { type: Number, default: 0 }, // <-- NEW PROP
});

//estados
const viewerEl = ref(null);
//dinmensiones calculadas
const containerHeight = ref(0);
const containerWidth = ref(0);

//logica para resize
let resizeTimer;

function updateDimensions() {
	if (!viewerEl.value) return;

	//altura del container
	containerHeight.value = viewerEl.value.getBoundingClientRect().height - 20;

	//ancho del container (para una pagina)
	let width = viewerEl.value.getBoundingClientRect().width;
	if (props.mode === "dual") {
		width = width / 2;
	}
	containerWidth.value = width - 10;
}

function handleResize() {
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(updateDimensions, 100);
}

//hooks de lifecycle
onMounted(() => {
	updateDimensions(); //dimensiones iniciales
	window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
	window.removeEventListener("resize", handleResize);
	clearTimeout(resizeTimer);
});
</script>

<style scoped>
.viewer {
	display: flex;
	justify-content: center;
	align-items: flex-start;
	padding: 10px;
	flex-grow: 1;
	overflow-y: auto;
	min-height: 0;
}

.viewer[data-mode="dual"] > :deep(.pageContainer:first-of-type) {
	justify-content: flex-end;
}

.viewer[data-mode="dual"] > :deep(.pageContainer:nth-of-type(2)) {
	justify-content: flex-start;
}

/* solucion al bug de la ultima pagina? */

.viewer[data-mode="dual"] > :deep(.pageContainer) {
	width: 50%;
}

.viewer[data-s-mode="dual"] > :deep(.pageContainer:only-child) {
	width: 50%;
	justify-content: center;
}
</style>
