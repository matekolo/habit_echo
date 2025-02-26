﻿
<script setup>
    import { ref, onMounted, onUnmounted, defineProps } from "vue";
    import { useToast } from "~/composables/useToast";

    const props = defineProps({ fullPanel: Boolean });

    const { showToast } = useToast();
    const habits = ref([]);
    const newHabit = ref("");
    const interval = ref(null);
    const showResetPopup = ref(false);
    const showDeletePopup = ref(false);
    const habitToReset = ref(null);
    const habitToDelete = ref(null);

    // 📌 Dynamiczne obliczanie czasu
    const calculateElapsedTime = (startDate) => {
        const now = new Date();
        const diff = now - new Date(startDate);

        const seconds = Math.floor((diff / 1000) % 60);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const hours = Math.floor((diff / (1000 * 3600)) % 24);
        const days = Math.floor((diff / (1000 * 3600 * 24)) % 30);
        const months = Math.floor((diff / (1000 * 3600 * 24 * 30)) % 12);
        const years = Math.floor(diff / (1000 * 3600 * 24 * 365));

        let timeArray = [];

        if (years > 0) timeArray.push(`${years} lat`);
        if (months > 0 || years > 0) timeArray.push(`${months} mies.`);
        if (days > 0 || months > 0) timeArray.push(`${days} dni`);
        if (hours > 0 || days > 0) timeArray.push(`${hours} godz.`);
        if (minutes > 0 || hours > 0) timeArray.push(`${minutes} min`);
        timeArray.push(`${seconds} sek`);

        return timeArray.join(" ");
    };

    // 📌 Pobieranie nawyków
    const fetchHabits = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/habits", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (!res.ok) throw new Error("Nie udało się pobrać nawyków");

            const data = await res.json();
            habits.value = data.map(habit => ({
                ...habit,
                timeElapsed: calculateElapsedTime(habit.startDate),
            }));
        } catch (error) {
            console.error(error);
        }
    };

    // 📌 Aktualizacja licznika co sekundę
    const updateTime = () => {
        habits.value.forEach(habit => {
            habit.timeElapsed = calculateElapsedTime(habit.startDate);
        });
    };

    const addHabit = async () => {
        if (!newHabit.value) return;

        try {
            const res = await fetch("http://localhost:5000/api/habits", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newHabit.value }),
                credentials: "include",
            });

            if (!res.ok) throw new Error("Nie udało się dodać nawyku");

            showToast("Nawyk dodany!", "success");
            newHabit.value = "";
            fetchHabits();
        } catch (error) {
            console.error(error);
        }
    };

    // 📌 Otwieranie popupu resetowania
    const confirmResetHabit = (habit) => {
        habitToReset.value = habit;
        showResetPopup.value = true;
    };

    // 📌 Resetowanie nawyku
    const resetHabit = async () => {
        if (!habitToReset.value) return;
        try {
            await fetch(`http://localhost:5000/api/habits/${habitToReset.value._id}/reset`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            showToast("Nawyk zresetowany!", "warning");
            showResetPopup.value = false;
            habitToReset.value = null;
            await fetchHabits();
        } catch (error) {
            console.error(error);
        }
    };

    // 📌 Otwieranie popupu usuwania
    const confirmDeleteHabit = (habit) => {
        habitToDelete.value = habit;
        showDeletePopup.value = true;
    };

    // 📌 Usuwanie nawyku
    const deleteHabit = async () => {
        if (!habitToDelete.value) return;
        try {
            await fetch(`http://localhost:5000/api/habits/${habitToDelete.value._id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            showToast("Nawyk usunięty!", "error");
            showDeletePopup.value = false;
            habitToDelete.value = null;
            await fetchHabits();
        } catch (error) {
            console.error(error);
        }
    };

    // 📌 Montowanie komponentu
    onMounted(() => {
        fetchHabits();
        interval.value = setInterval(updateTime, 1000);
    });

    // 📌 Usuwanie timera po opuszczeniu widoku
    onUnmounted(() => {
        clearInterval(interval.value);
    });
</script>

<template>
    <div class="bg-gray-800 p-6 rounded shadow">
        <h2 class="text-2xl font-semibold mb-4">📌 Nawyki</h2>

        <!-- Formularz dodawania nawyku -->
        <div v-if="props.fullPanel" class="mb-4 flex">
            <input v-model="newHabit" type="text" placeholder="Dodaj nowy nawyk..." class="p-2 bg-gray-700 text-white rounded w-full" />
            <button @click="addHabit" class="ml-2 px-4 py-2 bg-green-500 text-white rounded">Dodaj</button>
        </div>

        <ul>
            <li v-for="habit in habits" :key="habit._id" class="p-2 my-2 bg-gray-700 rounded flex justify-between items-center">
                <span>⏳ {{ habit.name }} - {{ habit.timeElapsed }}</span>
                <div>
                    <button @click="confirmResetHabit(habit)" class="px-3 py-1 bg-yellow-500 text-white rounded">Zresetuj</button>
                    <button @click="confirmDeleteHabit(habit)" class="ml-2 px-3 py-1 bg-red-500 text-white rounded">Usuń</button>
                </div>
            </li>
        </ul>

        <!-- 🌟 Popup resetowania -->
        <div v-if="showResetPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-gray-900 p-6 rounded-lg shadow-lg text-center">
                <h3 class="text-xl font-bold text-yellow-400">Za chwilę rozpoczniesz od początku.</h3>
                <p class="text-gray-300 mt-2">
                    Miałeś chwilę słabości? Nie przejmuj się! Każdy upadek to szansa na lepszy powrót. Ważne, że się nie poddajesz!
                </p>
                <div class="mt-4 flex justify-center space-x-4">
                    <button @click="resetHabit" class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">Zaczynam od nowa</button>
                    <button @click="showResetPopup = false" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Pomyłka!</button>
                </div>
            </div>
        </div>

        <!-- 🗑️ Popup usuwania -->
        <div v-if="showDeletePopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-gray-900 p-6 rounded-lg shadow-lg text-center">
                <h3 class="text-xl font-bold text-red-400">Za chwilę usuniesz śledzenie nawyku.</h3>
                <p class="text-gray-300 mt-2">
                    Jesteś pewien? A może po prostu już się tym nie martwisz? Jeśli ci nie poszło, zawsze możesz zrestartować zegar.
                </p>
                <div class="mt-4 flex justify-center space-x-4">
                    <button @click="deleteHabit" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Usuwam</button>
                    <button @click="showDeletePopup = false" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Pomyłka!</button>
                </div>
            </div>
        </div>
    </div>
</template>