<script setup>
    import { useAuth } from "~/composables/useAuth";

    const { isAuthenticated } = useAuth();
</script>

<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 class="text-3xl font-bold">Habit Echo</h1>

        <template v-if="isAuthenticated">
            <NuxtLink to="/dashboard">
                <button class="mt-6 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Przejdź do Dashboardu
                </button>
            </NuxtLink>
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
