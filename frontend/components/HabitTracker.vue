<script setup>
    import { ref, onMounted, onUnmounted, defineProps } from "vue";
    import { useToast } from "~/composables/useToast";

    const props = defineProps({ fullPanel: Boolean });

    const { showToast } = useToast();
    const habits = ref([]);
    const newHabit = ref("");
    const interval = ref(null);

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

    // 📌 Pobieranie nawyków i natychmiastowe obliczenie czasu
    const fetchHabits = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/habits", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (!res.ok) throw new Error("Nie udało się pobrać nawyków");

            const data = await res.json();

            // Natychmiastowe przeliczenie czasu dla każdego nawyku
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

    // 📌 Dodawanie nowego nawyku
    const addHabit = async () => {
        try {
            if (!newHabit.value) return;

            const res = await fetch("http://localhost:5000/api/habits", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newHabit.value }),
                credentials: "include",
            });

            if (!res.ok) throw new Error("Nie udało się dodać nawyku");
            newHabit.value = "";
            await fetchHabits();
        } catch (error) {
            console.error(error);
        }
    };

    // 📌 Resetowanie nawyku
    const resetHabit = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/habits/${id}/reset`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            showToast("Nawyk zresetowany!", "warning");
            await fetchHabits();
        } catch (error) {
            console.error(error);
        }
    };

    // 📌 Usuwanie nawyku
    const deleteHabit = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/habits/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            showToast("Nawyk usunięty!", "error");
            await fetchHabits();
        } catch (error) {
            console.error(error);
        }
    };

    // 📌 Montowanie komponentu
    onMounted(() => {
        fetchHabits(); // Natychmiastowe pobranie nawyków
        interval.value = setInterval(updateTime, 1000); // Odświeżanie co sekundę
    });

    // 📌 Usuwanie timera po opuszczeniu widoku
    onUnmounted(() => {
        clearInterval(interval.value);
    });
</script>

<template>
    <div class="bg-gray-800 p-6 rounded shadow">
        <h2 class="text-2xl font-semibold mb-4">📌 Nawyki</h2>

        <!-- Formularz dodawania nawyku tylko w pełnym panelu -->
        <div v-if="props.fullPanel" class="mb-4 flex">
            <input v-model="newHabit" type="text" placeholder="Dodaj nowy nawyk..." class="p-2 bg-gray-700 text-white rounded w-full" />
            <button @click="addHabit" class="ml-2 px-4 py-2 bg-green-500 text-white rounded">Dodaj</button>
        </div>

        <ul>
            <li v-for="habit in habits" :key="habit._id" class="p-2 my-2 bg-gray-700 rounded flex justify-between items-center">
                <span>⏳ {{ habit.name }} - {{ habit.timeElapsed }}</span>
                <div>
                    <button @click="resetHabit(habit._id)" class="px-3 py-1 bg-yellow-500 text-white rounded">Zresetuj</button>
                    <button @click="deleteHabit(habit._id)" class="ml-2 px-3 py-1 bg-red-500 text-white rounded">Usuń</button>
                </div>
            </li>
        </ul>
    </div>
</template>
