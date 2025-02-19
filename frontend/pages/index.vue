<script setup>
    import { useCookie } from "#app";
    import { useRouter } from "vue-router";
    import { ref, watchEffect } from "vue";

    const token = useCookie("token");
    const router = useRouter();
    const isLoggedIn = ref(!!token.value);

    const handleLogout = () => {
        useCookie("token").value = null;
        isLoggedIn.value = false;
        router.push("/"); // ✅ Przekierowanie na stronę główną zamiast login
    };

    // Automatyczna aktualizacja, jeśli token się zmienia
    watchEffect(() => {
        isLoggedIn.value = !!token.value;
    });
</script>

<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 class="text-3xl font-bold">Habit Echo</h1>

        <template v-if="isLoggedIn">
            <p class="text-lg mt-2">Witaj, jesteś zalogowany!</p>
            <button @click="handleLogout" class="mt-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Wyloguj się
            </button>
        </template>

        <template v-else>
            <p class="text-lg mt-2">Zaloguj się lub zarejestruj, aby rozpocząć</p>
            <div class="mt-6 space-x-4">
                <NuxtLink to="/login">
                    <button class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Zaloguj się
                    </button>
                </NuxtLink>
                <NuxtLink to="/register">
                    <button class="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                        Zarejestruj się
                    </button>
                </NuxtLink>
            </div>
        </template>
    </div>
</template>
