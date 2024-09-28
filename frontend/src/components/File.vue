<template>
    <transition name="fade">
        <div
            class="w-full flex justify-between items-center p-4 bg-slate-700 rounded-lg shadow-lg text-slate-200"
        >
            <div class="flex items-center justify-between w-full">
                <div>
                    <p class="font-semibold text-lg">{{ file[0].name }}</p>
                    <span class="text-slate-400">
                        {{ (file[0].size / 1024).toFixed(2) }} KB
                    </span>
                </div>
                <div class="flex items-center">
                    <FormatSelector @updateFormat="updateFormat" />

                    <transition name="fade-scale">
                        <span
                            v-if="!converting && file.downloadUrl"
                            class="bg-green-600 text-white text-xs font-medium px-4 py-2 rounded-full ml-5 flex items-center"
                        >
                            Done <i class="fa-solid fa-check ml-1"></i>
                        </span>
                    </transition>

                    <a
                        v-if="file.downloadUrl && !converting"
                        :href="file.downloadUrl"
                        :download="file.newFileName"
                        class="text-slate-200 ml-5 border-slate-200 border p-2 font-semibold rounded-lg transition-all duration-300 hover:bg-slate-200 hover:text-black hover:scale-105"
                    >
                        Download
                    </a>

                    <button
                        class="text-slate-200 ml-10 transition-all transform hover:scale-110 hover:text-red-400"
                        @click="$emit('remove', file.id)"
                    >
                        <i class="fa-solid fa-times text-2xl"></i>
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { computed, ref } from "vue";
import FormatSelector from "./FormatSelector.vue";

const props = defineProps({
    file: Object,
    converting: Boolean,
});

const emit = defineEmits(["remove", "formatedFile"]);

const updateFormat = (format) => {
    const updatedFile = { ...props.file, format };
    emit("formatedFile", updatedFile);
};
</script>

<style></style>
