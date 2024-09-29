<template>
    <div
        class="w-full h-[400px] border-2 border-dashed border-slate-300 rounded-2xl flex justify-center items-center flex-col cursor-pointer mb-10 text-slate-200"
        @click="triggerFileInput"
        v-if="files.length === 0"
    >
        <i class="fa-solid fa-cloud-arrow-up text-6xl mb-4"></i>
        <p class="font-bold text-2xl text-center sm:text-lg">
            Drop Files Here!
        </p>
        <input
            type="file"
            ref="fileInput"
            class="hidden"
            :accept="acceptedFormats"
            multiple
            @change="handleFileUpload"
        />
    </div>

    <div class="w-full mb-10" v-if="files.length > 0">
        <div class="w-full mt-4 flex flex-wrap justify-start space-x-4">
            <button
                class="bg-slate-300 text-[#14142b] py-2 px-4 font-bold mb-4 sm:py-1 sm:px-3 rounded"
                @click="triggerFileInput"
            >
                Add a File
            </button>
        </div>
        <div class="w-full border-2 border-slate-300 p-4 rounded-lg">
            <div class="space-y-4">
                <File
                    v-for="(file, index) in files"
                    :key="index"
                    :file="file"
                    :converting="converting"
                    @formatedFile="formatedFile"
                    @remove="removeFile(index)"
                />
            </div>
            <div
                class="flex flex-wrap justify-between items-center font-bold mt-4 text-sm"
            >
                <p class="ml-4">{{ files.length }} files</p>
                <button
                    class="border-2 border-slate-300 text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:bg-slate-200 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed sm:px-3 sm:py-1"
                    @click="convertFiles"
                    :disabled="converting"
                >
                    <span v-if="converting" class="flex items-center">
                        <svg
                            class="animate-spin h-5 w-5 mr-2 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <circle
                                class="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                stroke-width="4"
                            ></circle>
                            <path
                                class="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8z"
                            ></path>
                        </svg>
                        Converting...
                    </span>
                    <span v-else>Convert</span>
                </button>
            </div>
            <input
                type="file"
                ref="fileInput"
                class="hidden"
                multiple
                :accept="acceptedFormats"
                @change="handleFileUpload"
            />
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import File from "./File.vue";

const files = ref([]);
const converting = ref(false);

const imageFormats = [
    "gif",
    "avif",
    "jpeg",
    "jpg",
    "tile",
    "png",
    "raw",
    "tiff",
    "webp",
];

const acceptedFormats = imageFormats.map((format) => `.${format}`).join(",");

const handleFileUpload = (event) => {
    console.log(event.target.files);
    const selectedFile = event.target.files;

    const fileExtension = selectedFile[0].name.split(".").pop().toLowerCase();

    if (imageFormats.includes(fileExtension)) {
        const fileWithId = {
            ...selectedFile,
            id: crypto.randomUUID(),
            format: fileExtension,
        };

        files.value = [...files.value, fileWithId];
    } else {
        throw new Error(`Allowed Files: ${acceptedFormats}`);
    }
};

const removeFile = (index) => {
    files.value.splice(index, 1);
};

const triggerFileInput = () => {
    const fileInput = document.querySelector('input[type="file"]');
    fileInput.click();
};

const formatedFile = (file) => {
    const index = files.value.findIndex((f) => f.id === file.id);
    if (index !== -1) {
        files.value[index] = file;
    } else {
        files.value = [...files.value, file];
    }
};

const convertFiles = async () => {
    converting.value = true;

    try {
        const promises = files.value.map(async (file) => {
            const formData = new FormData();

            const fileObj = file[0];
            const originalName = fileObj.name;
            const newExtension = file.format;
            const newFileName = originalName.replace(
                /\.[^/.]+$/,
                `.${newExtension}`
            );

            formData.append("file", fileObj);
            formData.append("format", file.format);

            const response = await fetch("http://localhost:3000/api/convert", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(
                    `Error converting file ${fileObj.name}: ${response.statusText}`
                );
            }

            const blob = await response.blob();
            const downloadUrl = URL.createObjectURL(blob);

            file.downloadUrl = downloadUrl;
            file.newFileName = newFileName;
        });

        await Promise.all(promises);
    } catch (error) {
        console.error("An error occurred: ", error);
    } finally {
        converting.value = false;
    }
};
</script>

<style></style>
