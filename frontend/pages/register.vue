<script setup>
    import { ref } from "vue";
    import { useAuth } from "~/composables/useAuth";

    const { login } = useAuth();
    const name = ref("");
    const email = ref("");
    const password = ref("");
    const errorMessage = ref("");

    const handleRegister = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name.value, email: email.value, password: password.value }),
                credentials: "include",
            });

            if (!res.ok) throw new Error("Rejestracja nie powiod³a siê");

            // Automatycznie logujemy u¿ytkownika po rejestracji
            await login(email.value, password.value);
        } catch (error) {
            console.error("B³¹d rejestracji:", error);
            errorMessage.value = "Rejestracja nie powiod³a siê";
        }
    };
</script>

<template>
    <div class="flex items-center justify-center h-screen bg-gray-900">
        <div class="bg-gray-800 p-8 rounded shadow-lg w-96">
            <h2 class="text-white text-2xl mb-4">Rejestracja</h2>
            <input v-model="name" type="text" placeholder="Imiê" class="w-full p-2 mb-4 rounded bg-gray-700 text-white" />
            <input v-model="email" type="email" placeholder="Email" class="w-full p-2 mb-4 rounded bg-gray-700 text-white" />
            <input v-model="password" type="password" placeholder="Has³o" class="w-full p-2 mb-4 rounded bg-gray-700 text-white" />
            <button @click="handleRegister" class="w-full bg-blue-500 text-white p-2 rounded">Zarejestruj siê</button>
            <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
            <p class="text-white mt-2">Masz ju¿ konto? <NuxtLink to="/login" class="text-blue-400">Zaloguj siê</NuxtLink></p>
        </div>
    </div>
</template>
