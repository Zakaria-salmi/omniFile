<script setup>
import HeaderApp from "./components/HeaderApp.vue";
import Description from "./components/Description.vue";
import FooterApp from "./components/FooterApp.vue";
import FilesContainer from "./components/FilesContainer.vue";
</script>

<template>
    <div class="flex flex-col h-full">
        <HeaderApp />
        <div class="flex-auto">
            <Description />
            <FilesContainer />
        </div>
        <FooterApp />
    </div>
</template>

<style scoped></style>
