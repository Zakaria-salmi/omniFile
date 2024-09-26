<template>
    <div
        class="w-full h-[400px] border-2 border-dashed border-slate-300 rounded-2xl flex justify-center items-center flex-col cursor-pointer mb-10 text-slate-200"
        @click="triggerFileInput"
        v-if="files.length === 0"
    >
        <i class="fa-solid fa-cloud-arrow-up text-6xl mb-4"></i>
        <p class="font-bold text-2xl">Drop Files Here !</p>
        <input
            type="file"
            ref="fileInput"
            class="hidden"
            multiple
            @change="handleFileUpload"
        />
    </div>

    <div class="w-full mb-10" v-if="files.length > 0">
        <div class="w-full mt-4 flex justify-start">
            <button
                class="bg-slate-300 text-[#14142b] py-2 px-4"
                @click="triggerFileInput"
            >
                Add a File
            </button>
        </div>
        <div class="w-full border-2 border-slate-300 p-4">
            <div class="space-y-4">
                <File
                    v-for="(file, index) in files"
                    :key="index"
                    :file="file"
                    @remove="removeFile(index)"
                />
            </div>
            <div class="flex justify-between items-center font-bold mt-4">
                <p class="ml-5">{{ files.length }} files</p>
                <button
                    class="bg-slate-300 h-full p-4 text-[#14142b] rounded-lg"
                >
                    Convert
                </button>
            </div>
            <input
                type="file"
                ref="fileInput"
                class="hidden"
                multiple
                @change="handleFileUpload"
            />
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import File from "./File.vue";

const files = ref([]);

const handleFileUpload = (event) => {
    const selectedFiles = event.target.files;
    files.value = [...files.value, ...selectedFiles];
};

const removeFile = (index) => {
    files.value.splice(index, 1); // Supprime le fichier du tableau
};

const triggerFileInput = () => {
    const fileInput = document.querySelector('input[type="file"]');
    fileInput.click();
};
</script>

<style></style>
