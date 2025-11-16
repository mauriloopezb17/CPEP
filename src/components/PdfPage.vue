<template>
	<section class="pageContainer">
		<canvas ref="canvasEl"></canvas>
		<div ref="textLayerEl" class="textLayer"></div>
	</section>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";

//props
const props = defineProps({
	pdfDoc: { type: Object, required: true },
	pageNum: { type: Number, required: true },
	containerWidth: { type: Number, required: true },
	containerHeight: { type: Number, required: true },
});

const canvasEl = ref(null);
const textLayerEl = ref(null);

//renderizar
async function renderPage() {
	//esperar datos
	if (
		!props.pdfDoc ||
		!props.pageNum ||
		!canvasEl.value ||
		!textLayerEl.value ||
		props.containerWidth === 0
	) {
		return;
	}

	const page = await props.pdfDoc.getPage(props.pageNum);

	//escalar
	const viewportScale1 = page.getViewport({ scale: 1 });

	//usar dimensiones del contenedor
	const scaleWidth = props.containerWidth / viewportScale1.width;
	const scaleHeight = props.containerHeight / viewportScale1.height;
	const scale = Math.min(scaleWidth, scaleHeight);

	const viewport = page.getViewport({ scale: scale });

	//limpiar contenido
	textLayerEl.value.innerHTML = "";
	const ctx = canvasEl.value.getContext("2d");
	ctx.clearRect(0, 0, canvasEl.value.width, canvasEl.value.height);

	//tamaño del canvas
	canvasEl.value.height = viewport.height;
	canvasEl.value.width = viewport.width;

	//renderizar pagina
	await page.render({
		canvasContext: ctx,
		viewport: viewport,
	}).promise;

	//renderizar texto para seleccionar
	const textContent = await page.getTextContent();
	pdfjsLib.renderTextLayer({
		textContent,
		container: textLayerEl.value,
		viewport,
		textDivs: [],
	});
}

//reactividad (tamaño o pagina)
watchEffect(renderPage);
</script>

<style scoped>
.pageContainer {
	position: relative;
	width: 100%;
	margin: 0;
	display: flex;
	justify-content: center;
}

canvas {
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	border-radius: 5px;
	max-width: 100%;
	height: auto;
	display: block;
}

.textLayer {
	position: absolute;
	inset: 0;
	user-select: text;
	pointer-events: auto;
	color: transparent;
	white-space: pre;
}

body.dark-mode canvas {
	filter: invert(0.9) hue-rotate(180deg) contrast(0.95);
}
</style>
