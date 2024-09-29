<template>
    <div class="flex items-center relative" ref="modalContainer">
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
            class="absolute block right-0 top-full z-20"
            v-if="activeModal"
            ref="modal"
        >
            <div class="h-auto p-5 bg-slate-200 rounded-lg">
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
                    </ul>

                    <div
                        class="grow p-0 max-h-[220px] h-[220px] overflow-auto min-w-[195px] w-[195px] text-gray-500 font-semibold"
                    >
                        <div class="w-full m-0 flex flex-wrap">
                            <div
                                v-for="format in filteredImageFormats"
                                :key="format"
                                class="p-1 cursor-pointer w-1/3"
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

const emit = defineEmits(["updateFormat"]);

// Toggle modal visibility
const toggleModal = () => {
    activeModal.value = !activeModal.value;
};

// Close modal function
const closeModal = () => {
    activeModal.value = false;
};

// Close modal when clicking outside
const handleClickOutside = (event) => {
    const modal = document.querySelector(".absolute.block.right-0.top-full");
    const modalContainer = document.querySelector('[ref="modalContainer"]');

    if (
        modal &&
        !modal.contains(event.target) &&
        !modalContainer.contains(event.target)
    ) {
        closeModal();
    }
};

// Switch tab
const switchTab = (tab) => {
    activeTab.value = tab;
};

// Filter formats
const filteredImageFormats = computed(() => {
    return imageFormats.filter((format) =>
        format.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

// Select format
const selectFormat = (format) => {
    selectedFormat.value = format;
    closeModal();
    emit("updateFormat", selectedFormat.value.toLowerCase());
};

// Add event listener for click outside
onMounted(() => {
    document.addEventListener("click", handleClickOutside);
});

// Remove event listener when component is unmounted
onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped></style>
