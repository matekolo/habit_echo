import { ref, computed } from "vue";
import { useCookie } from "#app";
import { useRouter } from "vue-router";

export const useAuth = () => {
    const user = ref(null);
    const router = useRouter();
    const token = useCookie("token"); // Ciasteczko z tokenem

    // 🔹 Pobieranie profilu użytkownika
    const fetchUserProfile = async () => {
        if (!token.value) return;
        try {
            const res = await fetch("http://localhost:5000/api/users/profile", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (!res.ok) throw new Error("Nie udało się pobrać profilu");

            user.value = await res.json();
        } catch (error) {
            console.error("Błąd pobierania profilu:", error);
            logout();
        }
    };

    // 🔹 Logowanie użytkownika
    const login = async (email, password) => {
        try {
            const res = await fetch("http://localhost:5000/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });

            if (!res.ok) throw new Error("Nieprawidłowe dane logowania");

            const data = await res.json();
            token.value = data.token; // Ustawienie tokena
            user.value = data;

            router.push("/dashboard"); // Przekierowanie do dashboardu
        } catch (error) {
            console.error("Błąd logowania:", error);
            throw error;
        }
    };

    // 🔹 Wylogowanie użytkownika
    const logout = async () => {
        try {
            await fetch("http://localhost:5000/api/users/logout", {
                method: "POST",
                credentials: "include",
            });

            token.value = null; // Usunięcie tokena z ciasteczek
            user.value = null;

            router.push("/"); // Przekierowanie do strony głównej
        } catch (error) {
            console.error("Błąd podczas wylogowywania:", error);
        }
    };

    // 🔹 Sprawdzanie czy użytkownik jest zalogowany
    const isAuthenticated = computed(() => !!token.value);

    return { user, fetchUserProfile, login, logout, isAuthenticated };
};
