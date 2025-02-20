<script setup>
    import { ref, onMounted } from "vue";
    import { useAuth } from "~/composables/useAuth";
    import { useRouter } from "vue-router";

    const { user, fetchUserProfile, logout } = useAuth();
    const router = useRouter();

    // ✅ Pobierz dane użytkownika po załadowaniu strony
    onMounted(async () => {
        await fetchUserProfile();
    });

    // ✅ Obsługa wylogowania
    const handleLogout = async () => {
        await logout();  // Wywołanie funkcji wylogowania
        router.push("/"); // Przekierowanie na stronę główną
    };
</script>

<template>
    <div class="flex h-screen bg-gray-900 text-white">
        <!-- 🌟 SIDEBAR -->
        <div class="w-64 bg-gray-800 p-6">
            <div class="flex flex-col items-center">
                <div class="w-16 h-16 bg-gray-600 rounded-full"></div>
                <h2 class="text-lg font-semibold mt-2">{{ user?.name || "Użytkownik" }}</h2>
                <p class="text-sm text-gray-400">{{ user?.email }}</p>
                <button @click="handleLogout" class="mt-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                    Wyloguj się
                </button>
            </div>
            <nav class="mt-6">
                <NuxtLink to="/dashboard" class="block p-2 rounded hover:bg-gray-700">🏠 Dashboard</NuxtLink>
                <NuxtLink to="/habits" class="block p-2 rounded hover:bg-gray-700">📌 Nawyki</NuxtLink>
                <NuxtLink to="/tasks" class="block p-2 rounded hover:bg-gray-700">✅ Zadania</NuxtLink>
                <NuxtLink to="/schedule" class="block p-2 rounded hover:bg-gray-700">📅 Harmonogram</NuxtLink>
            </nav>
        </div>

        <!-- 🌟 GŁÓWNA SEKCJA -->
        <div class="flex-1 p-6">
            <!-- 🔹 Nagłówek -->
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-3xl font-semibold">Dashboard</h1>
                <input type="text"
                       placeholder="🔍 Szukaj..."
                       class="px-4 py-2 bg-gray-800 rounded text-white w-64" />
            </div>

            <!-- 🔹 Główna zawartość -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- ✅ Sekcja "Moje zadania" -->
                <div class="bg-gray-800 p-4 rounded shadow">
                    <h2 class="text-xl font-semibold">📌 Moje zadania</h2>
                    <ul class="mt-2 space-y-2">
                        <li class="p-2 bg-gray-700 rounded">🔹 Przykładowe zadanie 1</li>
                        <li class="p-2 bg-gray-700 rounded">🔹 Przykładowe zadanie 2</li>
                        <li class="p-2 bg-gray-700 rounded">🔹 Przykładowe zadanie 3</li>
                    </ul>
                </div>

                <!-- 📅 Sekcja "Kalendarz" -->
                <div class="bg-gray-800 p-4 rounded shadow">
                    <h2 class="text-xl font-semibold">📅 Kalendarz</h2>
                    <p class="text-gray-400 mt-2">Funkcja w budowie...</p>
                </div>

                <!-- 📊 Sekcja "Postęp" -->
                <div class="bg-gray-800 p-4 rounded shadow">
                    <h2 class="text-xl font-semibold">📊 Twój postęp</h2>
                    <p class="text-gray-400 mt-2">Zdobyłeś {{ user?.points || 0 }} punktów!</p>
                </div>
            </div>
        </div>
    </div>
</template>
