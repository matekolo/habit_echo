﻿
<script setup>
    import { ref, onMounted } from "vue";
    import { useAuth } from "~/composables/useAuth";
    import { useToast } from "~/composables/useToast";

    const { showToast } = useToast();
    const notifiedEvents = new Set();
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

    const checkUpcomingEvents = () => {
        const now = new Date();
        const today = now.toISOString().split("T")[0];

        scheduleItems.value.forEach(event => {
            const startTime = new Date(`${today}T${event.startTime}:00`);
            const endTime = new Date(`${today}T${event.endTime}:00`);

            const timeDiffStart = Math.floor((startTime - now) / 60000);
            const timeDiffEnd = Math.floor((endTime - now) / 60000);

            console.log(`[DEBUG] Sprawdzam wydarzenie: ${event.title}`);
            console.log(`[DEBUG] Minuty do startu: ${timeDiffStart}, Minuty do końca: ${timeDiffEnd}`);

            if (timeDiffStart === 30 && !notifiedEvents.has(`start-30-${event._id}`)) {
                showToast(`Za 30 minut: ${event.title}`, "info");
                notifiedEvents.add(`start-30-${event._id}`);
            }

            if (timeDiffStart === 0 && !notifiedEvents.has(`start-${event._id}`)) {
                showToast(`Już czas na: ${event.title}`, "info");
                notifiedEvents.add(`start-${event._id}`);
            }

            if (timeDiffEnd === 0 && !notifiedEvents.has(`end-${event._id}`)) {
                showToast(`Pora zakończyć: ${event.title}`, "warning");
                notifiedEvents.add(`end-${event._id}`);

                // 🟢 Po zakończeniu wydarzenia automatycznie je usuwamy
                deleteScheduleItem(event._id);
            }
        });
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

            showToast("Dodano nowe wydarzenie!", "success");

            // Reset formularza
            newEventTitle.value = "";
            newEventDescription.value = "";
            newEventStartTime.value = "";
            newEventEndTime.value = "";
            newEventDay.value = "Monday";

            await fetchSchedule(); // 🔹 Odśwież harmonogram
        } catch (error) {
            showToast(error.message, "error");
        }
    };


    const deleteScheduleItem = async (eventId) => {
        console.log("[DEBUG] Automatyczne usuwanie wydarzenia:", eventId); // Sprawdzamy, czy ID jest poprawne

        try {
            const res = await fetch(`http://localhost:5000/api/schedule/${eventId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (!res.ok) throw new Error("Nie udało się usunąć wydarzenia");

            showToast("Wydarzenie usunięte!", "error");

            // 🔄 Aktualizujemy listę wydarzeń w UI
            await fetchSchedule();
        } catch (error) {
            showToast(error.message, "error");
        }
    };


    setInterval(() => {
        notifiedEvents.clear();
    }, 60 * 60 * 1000);

    onMounted(() => {
        fetchSchedule();
        setInterval(checkUpcomingEvents, 60000); // Sprawdzaj co minutę
    });

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
            <li v-for="item in scheduleItems" :key="item._id" class="p-2 my-2 bg-gray-700 rounded flex justify-between">
                <div>
                    <strong>{{ item.title }}</strong> - {{ item.dayOfWeek }} | {{ item.startTime }} - {{ item.endTime }}
                </div>
                <button @click="deleteScheduleItem(item._id)" class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                    Usuń
                </button>
            </li>
        </ul>
        <p v-else class="text-gray-400">Brak wydarzeń w harmonogramie</p>
    </div>
</template>