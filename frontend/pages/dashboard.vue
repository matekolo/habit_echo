<script setup>
    import { ref, onMounted } from "vue";
    import { useAuth } from "~/composables/useAuth";

    const { user, fetchUserProfile, logout } = useAuth();
    const activeTab = ref("dashboard"); // ✅ Przechowuje aktywną zakładkę

    onMounted(async () => {
        await fetchUserProfile();
    });
</script>

<template>
    <div class="flex h-screen bg-gray-900 text-white">
        <!-- 🌟 SIDEBAR -->
        <div class="w-64 bg-gray-800 p-6">
            <div class="flex flex-col items-center">
                <div class="w-16 h-16 bg-gray-600 rounded-full"></div>
                <h2 class="text-lg font-semibold mt-2">{{ user?.name || "Użytkownik" }}</h2>
                <p class="text-sm text-gray-400">{{ user?.email }}</p>
                <button @click="logout" class="mt-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                    Wyloguj się
                </button>
            </div>
            <nav class="mt-6">
                <button @click="activeTab = 'dashboard'" class="block w-full text-left p-2 rounded hover:bg-gray-700">
                    🏠 Dashboard
                </button>
                <button @click="activeTab = 'habits'" class="block w-full text-left p-2 rounded hover:bg-gray-700">
                    📌 Nawyki
                </button>
                <button @click="activeTab = 'tasks'" class="block w-full text-left p-2 rounded hover:bg-gray-700">
                    ✅ Zadania
                </button>
                <button @click="activeTab = 'schedule'" class="block w-full text-left p-2 rounded hover:bg-gray-700">
                    📅 Harmonogram
                </button>
            </nav>
        </div>

        <!-- 🌟 GŁÓWNA SEKCJA -->
        <div class="flex-1 p-6 overflow-auto">
            <!-- 🔹 Nagłówek -->
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-3xl font-semibold">Dashboard</h1>
                <input type="text"
                       placeholder="🔍 Szukaj..."
                       class="px-4 py-2 bg-gray-800 rounded text-white w-64" />
            </div>

            <!-- 🔹 Dynamiczne Sekcje -->
            <div v-if="activeTab === 'dashboard'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="bg-gray-800 p-4 rounded shadow">
                    <h2 class="text-xl font-semibold">📌 Moje zadania</h2>
                    <ul class="mt-2 space-y-2">
                        <li class="p-2 bg-gray-700 rounded">🔹 Przykładowe zadanie 1</li>
                        <li class="p-2 bg-gray-700 rounded">🔹 Przykładowe zadanie 2</li>
                        <li class="p-2 bg-gray-700 rounded">🔹 Przykładowe zadanie 3</li>
                    </ul>
                </div>

                <div class="bg-gray-800 p-4 rounded shadow">
                    <h2 class="text-xl font-semibold">📅 Kalendarz</h2>
                    <p class="text-gray-400 mt-2">Funkcja w budowie...</p>
                </div>

                <div class="bg-gray-800 p-4 rounded shadow">
                    <h2 class="text-xl font-semibold">📊 Twój postęp</h2>
                    <p class="text-gray-400 mt-2">Zdobyłeś {{ user?.points || 0 }} punktów!</p>
                </div>
            </div>

            <!-- 🔹 Sekcja Nawyki -->
            <div v-if="activeTab === 'habits'" class="bg-gray-800 p-6 rounded shadow">
                <h2 class="text-2xl font-semibold">📌 Nawyki</h2>
                <HabitTracker fullPanel />
            </div>

            <!-- 🔹 Sekcja Zadania (Placeholder) -->
            <div v-if="activeTab === 'tasks'" class="bg-gray-800 p-6 rounded shadow">
                <h2 class="text-2xl font-semibold">✅ Zadania</h2>
                <p class="text-gray-400">Funkcja w budowie...</p>
            </div>

            <!-- 🔹 Sekcja Harmonogram -->
            <div v-if="activeTab === 'schedule'" class="bg-gray-800 p-6 rounded shadow">
                <h2 class="text-2xl font-semibold">📅 Harmonogram</h2>
                <ScheduleComponent />
            </div>
        </div>
    </div>
</template>

<script>
    import ScheduleComponent from "~/components/ScheduleComponent.vue";
    import HabitTracker from "~/components/HabitTracker.vue"; // ✅ Wczytujemy komponent harmonogramu

    export default {
        components: {
            ScheduleComponent,
            HabitTracker,
        },
    };
</script>
