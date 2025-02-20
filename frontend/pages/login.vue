<script setup>
    import { ref } from "vue";
    import { useAuth } from "~/composables/useAuth";

    const { login } = useAuth();
    const email = ref("");
    const password = ref("");
    const errorMessage = ref("");

    const handleLogin = async () => {
        try {
            await login(email.value, password.value);
        } catch (error) {
            console.error("B³¹d logowania:", error);
            errorMessage.value = "Nieprawid³owe dane logowania";
        }
    };
</script>

<template>
    <div class="flex items-center justify-center h-screen bg-gray-900">
        <div class="bg-gray-800 p-8 rounded shadow-lg w-96">
            <h2 class="text-white text-2xl mb-4">Logowanie</h2>
            <input v-model="email" type="email" placeholder="Email" class="w-full p-2 mb-4 rounded bg-gray-700 text-white" />
            <input v-model="password" type="password" placeholder="Has³o" class="w-full p-2 mb-4 rounded bg-gray-700 text-white" />
            <button @click="handleLogin" class="w-full bg-blue-500 text-white p-2 rounded">Zaloguj siê</button>
            <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
            <p class="text-white mt-2">Nie masz jeszcze konta? <NuxtLink to="/register" class="text-blue-400">Zarejestruj siê</NuxtLink></p>
        </div>
    </div>
</template>
