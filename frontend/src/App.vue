<script setup>
import HeaderApp from "./components/HeaderApp.vue";
import Description from "./components/Description.vue";
import FilesContainer from "./components/FilesContainer.vue";
</script>

<template>
    <div class="flex flex-col h-full items-center">
        <HeaderApp />
        <div class="flex flex-auto items-center flex-col w-[90%] lg:w-2/3">
            <Description />
            <FilesContainer />
        </div>
    </div>
</template>

<style scoped></style>
