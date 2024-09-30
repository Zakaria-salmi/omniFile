<template>
    <transition name="fade">
        <div
            class="w-full flex items-center p-4 bg-slate-700 rounded-lg shadow-lg text-slate-200"
        >
            <div
                class="flex items-start lg:items-center w-full flex-col lg:flex-row lg:justify-end"
            >
                <div class="mb-4 lg:mb-0 w-full">
                    <div class="flex justify-between w-full items-start">
                        <p
                            class="font-semibold text-lg break-words w-4/5 lg:break-normal lg:w-full"
                        >
                            {{ file[0].name }}
                        </p>
                        <button
                            class="text-slate-200 ml-5 sm:ml-16 transition-all transform hover:scale-110 hover:text-red-400 lg:hidden"
                            @click="$emit('remove', file.id)"
                        >
                            <i class="fa-solid fa-times text-2xl"></i>
                        </button>
                    </div>
                    <span class="text-slate-400">
                        {{ (file[0].size / 1024).toFixed(2) }} KB
                    </span>
                </div>
                <div
                    class="flex items-center justify-center w-full mb-4 lg:ml-10 lg:mb-0 lg:w-auto"
                >
                    <FormatSelector
                        @updateFormat="updateFormat"
                        :format="file.format"
                    />
                    <transition name="fade-scale">
                        <span
                            v-if="!converting && file.downloadUrl"
                            class="bg-green-600 text-white text-xs font-medium px-4 py-2 rounded-full ml-5 flex items-center"
                        >
                            Done <i class="fa-solid fa-check ml-1"></i>
                        </span>
                    </transition>
                </div>
                <div
                    class="flex items-center lg:ml-3 justify-center w-full lg:justify-end lg:w-auto"
                >
                    <a
                        v-if="file.downloadUrl && !converting"
                        :href="file.downloadUrl"
                        :download="file.newFileName"
                        class="text-slate-200 border-slate-200 border p-2 font-semibold rounded-lg transition-all duration-300 hover:bg-slate-200 hover:text-black lg:hover:scale-105 w-full lg:w-auto text-center"
                    >
                        Download
                    </a>
                    <button
                        class="text-slate-200 ml-10 transition-all transform hover:scale-110 hover:text-red-400 hidden lg:block"
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
