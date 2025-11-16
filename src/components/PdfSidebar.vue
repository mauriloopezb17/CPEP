<template>
	<aside id="sidebar" class="sidebar" :class="{ open: isOpen }">
		<div id="pageList" class="page-list">
			<div
				v-for="thumb in thumbnails"
				:key="thumb.page"
				class="thumb-wrapper"
				@click="$emit('goToPage', thumb.page)"
			>
				<img
					:src="thumb.imgUrl"
					class="page-thumb"
					:class="{ selected: isSelected(thumb.page) }"
					alt="Page thumbnail"
				/>
				<div class="page-label">{{ thumb.page }}</div>
			</div>
		</div>
	</aside>
</template>

<script setup>
//props
const props = defineProps({
	isOpen: {
		type: Boolean,
		default: false,
	},
	thumbnails: {
		type: Array,
		default: () => [],
	},
	currentPage: {
		type: Number,
		default: 1,
	},
	mode: {
		type: String,
		default: "dual",
	},
});

//emits
defineEmits(["goToPage"]);

//logica
function isSelected(pageNumber) {
	if (props.mode === "single") {
		return pageNumber === props.currentPage;
	}

	//en modo dual, resaltar la pagina actual y la siguiente
	return (
		pageNumber === props.currentPage || pageNumber === props.currentPage + 1
	);
}
</script>

<style scoped>
.sidebar {
	position: fixed;
	top: 7rem;
	left: 50px;
	width: 250px;
	bottom: 2rem;
	border-radius: 12px;
	padding-left: 10px;
	background: var(--frostedColor);
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	color: var(--barColor);
	transform: translateX(-150%);
	transition: transform 0.3s ease;
	border: 1px solid var(--frostedBorderColor);
	z-index: 999;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.sidebar.open {
	transform: translateX(0);
}

.sidebar a {
	color: var(--barColor);
	text-decoration: none;
	display: block;
	margin: 10px 0;
}

.sidebar a:hover {
	color: var(--barColor);
}

.page-list {
	flex: 1;
	overflow-y: auto;
	overflow-x: hidden;
	padding-right: 6px;
	scrollbar-width: thin;
	scrollbar-color: var(--accentColor) var(--frostedColor);
}

/* Chrome, Edge, Opera */
.page-list::-webkit-scrollbar {
	width: 8px;
}

.page-list::-webkit-scrollbar-track {
	background: var(--frostedColor);
	border-radius: 10px;
}

.page-list::-webkit-scrollbar-thumb {
	background: var(--accentColor);
	border-radius: 10px;
	border: none;
}

.page-list::-webkit-scrollbar-thumb:hover {
	background: var(--accentColor);
}

.thumb-wrapper {
	text-align: center;
	padding: 8px;
	border-radius: 10px;
	transition: background 0.2s ease;
	cursor: pointer;
}

.thumb-wrapper:hover {
	background: var(--accentColor);
}

.page-thumb {
	display: block;
	margin: 0 auto;
	border-radius: 6px;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
	transition: transform 0.2s ease, box-shadow 0.2s ease;
	width: 100%;
	height: auto;
	max-width: 180px;
	margin: 0 auto;
}

.page-thumb:hover {
	transform: scale(1.05);
	box-shadow: 0 3px 8px rgba(0, 0, 0, 0.5);
}

.page-thumb.selected {
	outline: 3px solid var(--highlightColor);
}

.page-label {
	margin-top: 4px;
	font-size: 14px;
	color: var(--barColor);
	font-weight: bold;
	letter-spacing: 0.5px;
	transition: color 0.2s ease;
}

body.dark-mode .page-thumb {
	filter: invert(0.9) hue-rotate(180deg) contrast(0.95);
}
</style>
