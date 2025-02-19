<script setup>
    import { ref } from "vue";
    import { useRouter } from "vue-router";
    import { useCookie } from "#app";

    const router = useRouter();
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

            if (!res.ok) {
                throw new Error("B³¹d rejestracji");
            }

            const data = await res.json();
            useCookie("token").value = data.token;

            router.push("/");
        } catch (error) {
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
        </div>
    </div>
</template>
