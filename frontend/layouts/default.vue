<script setup>
    import { useRouter } from "vue-router";
    import { onMounted } from "vue";

    const router = useRouter();

    onMounted(async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login"); // Przekierowanie na stronê logowania
        }
    });
</script>

<template>
    <div>
        <slot />
    </div>
</template>
