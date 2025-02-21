<script setup>
    import { ref, onMounted } from "vue";
    import { useAuth } from "~/composables/useAuth";

    const { user } = useAuth();
    const scheduleItems = ref([]);
    const newEventTitle = ref("");
    const newEventDescription = ref("");
    const newEventStartTime = ref("");
    const newEventEndTime = ref("");
    const newEventDay = ref("Monday");

    const fetchSchedule = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/schedule", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (!res.ok) throw new Error("Nie udało się pobrać harmonogramu");

            const data = await res.json();
            console.log("Odebrany harmonogram:", data); // Debugowanie

            scheduleItems.value = data.map(item => ({
                _id: item._id,
                title: item.title,
                description: item.description || "Brak opisu",
                dayOfWeek: item.dayOfWeek || "Nieznany dzień",
                startTime: item.startTime,
                endTime: item.endTime,
            }));

        } catch (error) {
            console.error(error);
            showToast("Błąd pobierania harmonogramu", "error");
        }
    };

    const addScheduleItem = async () => {
        try {
            if (!newEventTitle.value || !newEventStartTime.value || !newEventEndTime.value) {
                throw new Error("Wszystkie pola (Tytuł, godziny) są wymagane");
            }

            const res = await fetch("http://localhost:5000/api/schedule", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${useCookie("token").value}`,
                },
                body: JSON.stringify({
                    title: newEventTitle.value,
                    description: newEventDescription.value,
                    startTime: newEventStartTime.value,
                    endTime: newEventEndTime.value,
                    dayOfWeek: newEventDay.value,
                }),
                credentials: "include",
            });

            if (!res.ok) throw new Error("Nie udało się dodać wydarzenia");

            console.log("Wydarzenie dodane poprawnie!"); // 🔹 Debug

            // Reset formularza
            newEventTitle.value = "";
            newEventDescription.value = "";
            newEventStartTime.value = "";
            newEventEndTime.value = "";
            newEventDay.value = "Monday";

            await fetchSchedule(); // 🔹 Odśwież harmonogram
        } catch (error) {
            console.error(error);
        }
    };

    onMounted(fetchSchedule);
</script>

<template>
    <div class="bg-gray-800 p-6 rounded shadow">
        <h2 class="text-2xl font-semibold mb-4">📅 Harmonogram</h2>

        <!-- 🔹 Formularz dodawania wydarzenia -->
        <div class="mb-6">
            <input v-model="newEventTitle" type="text" placeholder="Tytuł" class="w-full p-2 mb-2 bg-gray-700 text-white rounded" />
            <input v-model="newEventDescription" type="text" placeholder="Opis (opcjonalnie)" class="w-full p-2 mb-2 bg-gray-700 text-white rounded" />

            <select v-model="newEventDay" class="w-full p-2 mb-2 bg-gray-700 text-white rounded">
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
                <option>Saturday</option>
                <option>Sunday</option>
            </select>

            <div class="flex space-x-4">
                <input v-model="newEventStartTime" type="time" class="w-1/2 p-2 bg-gray-700 text-white rounded" />
                <input v-model="newEventEndTime" type="time" class="w-1/2 p-2 bg-gray-700 text-white rounded" />
            </div>

            <button @click="addScheduleItem" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Dodaj
            </button>
        </div>

        <!-- 🔹 Lista wydarzeń -->
        <h3 class="text-xl font-semibold mb-2">📋 Lista wydarzeń:</h3>
        <ul v-if="scheduleItems && scheduleItems.length > 0">
            <li v-for="item in scheduleItems" :key="item._id" class="p-2 my-2 bg-gray-700 rounded">
                <strong>{{ item.title }}</strong> - {{ item.dayOfWeek }} | {{ item.startTime }} - {{ item.endTime }}
            </li>
        </ul>
        <p v-else class="text-gray-400">Brak wydarzeń w harmonogramie</p>
    </div>
</template>
