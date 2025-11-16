<template>
	<div v-if="isLoading" class="loading-overlay active">
		<div class="spinner"></div>
		<p>Cargando PDF...</p>
	</div>
</template>

<script setup>
// Props
defineProps({
	isLoading: {
		type: Boolean,
		default: false,
	},
});
</script>

<style scoped>
.loading-overlay {
	position: fixed;
	inset: 0;
	background: var(--frostedColor);
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	z-index: 2000;
	color: var(--barColor);
	font-size: 1.2rem;
	font-weight: bold;
	letter-spacing: 1px;
	/* We don't need opacity transitions anymore because v-if handles removal,
     but we'll keep the base styles. */
}

.loading-overlay.active {
	opacity: 1;
	pointer-events: auto;
}

.spinner {
	width: 50px;
	height: 50px;
	border: 5px solid var(--barColor);
	border-top: 5px solid var(--accentColor);
	border-radius: 50%;
	animation: spin 0.2s linear infinite;
	margin-bottom: 15px;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
</style>
