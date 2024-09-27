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
                class="bg-slate-300 text-[#14142b] py-2 px-4 font-bold"
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
                    @formatedFile="formatedFile"
                    @remove="removeFile(index)"
                />
            </div>
            <div class="flex justify-between items-center font-bold mt-4">
                <p class="ml-4">{{ files.length }} files</p>
                <button
                    class="bg-slate-300 h-full p-4 text-[#14142b] rounded-lg"
                    @click="convertFiles"
                    :disabled="converting"
                >
                    {{ converting ? "Converting..." : "Convert" }}
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
const converting = ref(false);

const handleFileUpload = (event) => {
    const selectedFile = event.target.files;

    const fileExtension = selectedFile[0].name.split(".").pop().toLowerCase();

    const fileWithId = {
        ...selectedFile,
        id: crypto.randomUUID(),
        format: fileExtension,
    };

    files.value = [...files.value, fileWithId];
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
            formData.append("file", fileObj);
            formData.append("format", file.format);

            const response = await fetch("http://localhost:3000/api/convert", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(
                    `Erreur lors de la conversion du fichier ${fileObj.name}: ${response.statusText}`
                );
            }

            const blob = await response.blob();
            const downloadUrl = URL.createObjectURL(blob);

            // Ajoute l'URL de téléchargement au fichier
            file.downloadUrl = downloadUrl;

            console.log(file);
        });

        await Promise.all(promises);
        console.log("Tous les fichiers ont été convertis avec succès !");
    } catch (error) {
        console.error("Une erreur s'est produite : ", error);
    } finally {
        converting.value = false;
    }
};
</script>

<style></style>
