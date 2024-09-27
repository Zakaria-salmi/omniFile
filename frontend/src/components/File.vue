<template>
    <div
        class="w-full flex justify-between items-center p-4 bg-slate-700 rounded-lg shadow-md text-slate-200"
    >
        <div class="flex items-center justify-between w-full">
            <div>
                <p>
                    {{ file[0].name }}
                </p>
                <span class="text-slate-400"
                    >{{ (file[0].size / 1024).toFixed(2) }} KB</span
                >
            </div>
            <div class="flex items-center">
                <FormatSelector @updateFormat="updateFormat" />
                <button
                    class="text-slate-200 ml-12"
                    @click="$emit('remove', file.id)"
                >
                    <i class="fa-solid fa-times text-2xl"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from "vue";
import FormatSelector from "./FormatSelector.vue";

const props = defineProps({
    file: Object,
});

const emit = defineEmits(["remove", "formatedFile"]);

const updateFormat = (format) => {
    const updatedFile = { ...props.file, format };
    emit("formatedFile", updatedFile);
};
</script>

<style></style>
