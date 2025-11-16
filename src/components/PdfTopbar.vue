<template>
	<header class="topbar">
		<div class="west">
			<button id="menuBtn" @click="$emit('toggle-sidebar')">☰</button>
			<img src="/logo.png" alt="Logo" id="logo" />

			<h2 id="docLabel">{{ docName }}</h2>
			<h4 id="pdfLabel">.pdf</h4>
			<span id="uploadDate" class="upload-date">{{ uploadDate }}</span>
		</div>

		<div class="east">
			<div class="controls">
				<button id="prevBtn" @click="$emit('prev-page')">⬅</button>
				<button id="nextBtn" @click="$emit('next-page')">➡</button>
				<button id="settingsBtn" @click="$emit('toggle-theme')">◐</button>
				<br />
				<hr />
				<br />
				<button id="uploadBtn" @click="triggerUploadClick">⬆</button>

				<input
					type="file"
					id="fileInput"
					accept="application/pdf"
					style="display: none"
					ref="fileInputRef"
					@change="handleFileChange"
				/>
			</div>
			<input type="text" placeholder="Buscar en el PDF..." />
		</div>
	</header>
</template>

<script setup>
import { ref } from "vue";

//props
defineProps({
	docName: {
		type: String,
		default: "Document",
	},
	uploadDate: {
		type: String,
		default: "",
	},
});

//emits
const emit = defineEmits([
	"toggle-sidebar",
	"prev-page",
	"next-page",
	"toggle-theme",
	"upload",
]);

//logica del upload
const fileInputRef = ref(null);

function triggerUploadClick() {
	fileInputRef.value.click();
}

function handleFileChange(event) {
	const file = event.target.files[0];
	if (!file) return;

	if (file.type !== "application/pdf") {
		alert("Please upload a valid PDF file.");
		return;
	}
	emit("upload", file);

	//reset input
	event.target.value = null;
}
</script>

<style scoped>
.topbar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: var(--barColor);
	padding: 0.5rem;
	height: 4rem;
	flex-shrink: 0;
}

.east {
	display: flex;
}

#docLabel {
	margin-left: 2rem;
}

#pdfLabel {
	font-weight: lighter;
}

.topbar button,
.topbar input {
	margin: 0 5px;
	border: none;
	border-radius: 5px;
	padding: 8px 10px;
	cursor: pointer;
	border: 1px solid var(--borderColor);
}

.topbar button {
	font-size: 20px;
	font-weight: bold;
	padding: 4px 10px 6px 10px;
	color: var(--accentColor);
	background-color: transparent;
	transition: all 0.2s ease;
	height: 2.5rem;
	width: 2.5rem;
}

.topbar button:hover {
	background: var(--hoverColor);
	border: none;
	font-size: 24px;
}

.topbar button:active {
	transform: scale(0.9);
	color: var(--accentColor);
	background-color: var(--activeColor);
}

#logo {
	width: 2.4rem;
	margin: auto 0;
	cursor: pointer;
}

.upload-date {
	margin-left: 10px;
	font-size: 0.9rem;
	color: var(--contrastColor);
	font-weight: normal;
	opacity: 0.8;
}

#uploadBtn {
	width: 2.5rem;
	text-decoration: underline;
}

.west {
	display: flex;
	align-items: center;
	gap: 10px;
}

.topbar input {
	outline: none;
	border-radius: 100px;
	width: 300px;
	font-size: 18px;
	transition: all 0.2s ease;
}

.topbar input:active {
	transform: scale(0.9);
}

.controls {
	display: flex;
	justify-content: center;
	margin: 10px;
}
</style>
