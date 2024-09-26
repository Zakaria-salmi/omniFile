<template>
    <div
        class="w-full flex justify-between items-center p-4 bg-slate-700 rounded-lg shadow-md text-slate-200"
    >
        <div class="flex items-center justify-between w-full">
            <div>
                <p class="font-bold">
                    {{ file.name }}
                </p>
                <span>{{ (file.size / 1024).toFixed(2) }} KB</span>
            </div>
            <div class="flex items-center">
                <span class="font-bold mr-3">To :</span>
                <select class="bg-slate-600 text-white p-2 rounded">
                    <option disabled selected>Type</option>
                    <option value="image">Image Conversion</option>
                    <option value="audio">Audio Conversion</option>
                    <option value="video">Video Conversion</option>
                </select>
                <button class="text-slate-200 ml-4" @click="$emit('remove')">
                    <i class="fa-solid fa-times text-2xl"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    file: Object,
});
</script>

<style></style>
