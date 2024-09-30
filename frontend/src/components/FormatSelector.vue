<template>
    <div class="flex items-center lg:relative" ref="modalContainer">
        <button
            class="font-semibold p-2 border border-slate-200 rounded-lg flex items-center transition hover:scale-105"
            @click="toggleModal"
        >
            <span>{{ selectedFormat || "Select Format" }}</span>
            <i
                class="fa-solid fa-angle-down ml-6 transition-transform duration-300"
                :class="{ 'rotate-180': activeModal }"
            ></i>
        </button>

        <div
            class="fixed block top-2/4 right-2/4 translate-center w-[90%] lg:w-auto lg:!transform-none lg:right-0 lg:absolute lg:top-full z-20"
            v-if="activeModal"
            ref="modal"
        >
            <div class="h-auto p-5 bg-slate-200 rounded-lg">
                <div class="text-black w-full text-end mb-5 lg:hidden">
                    <i
                        @click="closeModal"
                        class="fa-solid fa-times text-2xl cursor-pointer"
                    ></i>
                </div>
                <div
                    class="flex mb-5 rounded-lg px-4 py-5 items-center bg-gray-300 border text-gray-500"
                >
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input
                        class="w-full h-full bg-gray-300 outline-none ml-2"
                        type="text"
                        placeholder="Search a format"
                        v-model="searchQuery"
                    />
                </div>

                <div class="flex">
                    <ul class="text-gray-500 font-semibold p-0 mr-8 text-sm">
                        <li
                            v-if="imageFormats.includes(selectedFormat)"
                            class="cursor-pointer w-[95px] max-w-[95px] border-b-2 mb-4"
                            :class="
                                activeTab === 'images'
                                    ? 'border-gray-700 text-gray-700 font-bold'
                                    : 'border-gray-300'
                            "
                            @click="switchTab('images')"
                        >
                            Image
                        </li>
                        <!-- <li
                            v-if="documentFormats.includes(selectedFormat)"
                            class="cursor-pointer w-[95px] max-w-[95px] border-b-2"
                            :class="
                                activeTab === 'documents'
                                    ? 'border-gray-700 text-gray-700 font-bold'
                                    : 'border-gray-300'
                            "
                            @click="switchTab('documents')"
                        >
                            Document
                        </li> -->
                    </ul>
                    <div
                        class="grow p-0 max-h-[220px] h-[220px] overflow-auto lg:min-w-[195px] lg:w-[195px] text-gray-500 font-semibold"
                    >
                        <div class="w-full m-0 flex flex-wrap">
                            <div
                                v-for="format in activeTab === 'images'
                                    ? filteredImageFormats
                                    : filteredDocumentFormats"
                                :key="format"
                                class="p-1 cursor-pointer w-2/4 lg:w-1/3"
                                @click="selectFormat(format)"
                            >
                                <div
                                    :class="[
                                        'p-2 text-center font-medium text-sm rounded-lg w-full flex justify-center transition ease-in-out duration-200',
                                        selectedFormat === format
                                            ? 'bg-slate-700 text-white'
                                            : 'bg-gray-300 hover:bg-slate-700 hover:text-white',
                                    ]"
                                >
                                    {{ format }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div
            v-if="activeModal"
            class="lg:hidden h-screen w-screen bg-black top-0 left-0 fixed opacity-55 z-10"
        ></div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
    format: String,
});

const searchQuery = ref("");
const activeModal = ref(false);
const activeTab = ref("images");
const selectedFormat = ref(props.format.toUpperCase());

const imageFormats = [
    "GIF",
    "AVIF",
    "JPEG",
    "JPG",
    "TILE",
    "PNG",
    "RAW",
    "TIFF",
    "WebP",
];

const documentFormats = ["PDF", "DOCX", "XLSX", "ODT", "TXT"];

const emit = defineEmits(["updateFormat"]);

const toggleModal = () => {
    activeModal.value = !activeModal.value;
};

const closeModal = () => {
    activeModal.value = false;
};

const switchTab = (tab) => {
    activeTab.value = tab;
};

const detectTab = () => {
    if (imageFormats.includes(selectedFormat.value)) {
        activeTab.value = "images";
    } else if (documentFormats.includes(selectedFormat.value)) {
        activeTab.value = "documents";
    } else {
        activeTab.value = "";
    }
};

const filteredImageFormats = computed(() => {
    return imageFormats.filter((format) =>
        format.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const filteredDocumentFormats = computed(() => {
    return documentFormats.filter((format) =>
        format.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const selectFormat = (format) => {
    selectedFormat.value = format;
    closeModal();
    emit("updateFormat", selectedFormat.value.toLowerCase());
};

detectTab();
</script>

<style scoped>
.translate-center {
    transform: translate(50%, -50%);
}
</style>
