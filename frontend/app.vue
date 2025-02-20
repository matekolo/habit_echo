<script setup>
    import { onMounted } from "vue";
    import { useAuth } from "~/composables/useAuth";

    const { fetchUserProfile } = useAuth();

    onMounted(() => {
        fetchUserProfile();
    });
</script>

<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>
