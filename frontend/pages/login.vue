<script setup>
    import { ref } from "vue";
    import { useRouter } from "vue-router";
    import { useCookie } from "#app";

    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const errorMessage = ref("");

    const handleLogin = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.value, password: password.value }),
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error("Nieprawid³owe dane logowania");
            }

            const data = await res.json();
            useCookie("token").value = data.token; // Zapisz token w ciasteczkach

            router.push("/"); // Zamiast /dashboard przenosimy u¿ytkownika na stronê g³ówn¹
        } catch (error) {
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
        </div>
    </div>
</template>
