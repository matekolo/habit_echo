import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export const useToast = () => {
    const showToast = (message, type = "info", duration = 120000) => {
        let bgColor;

        switch (type) {
            case "success":
                bgColor = "linear-gradient(to right, #00b09b, #96c93d)";
                break;
            case "error":
                bgColor = "linear-gradient(to right, #ff416c, #ff4b2b)";
                break;
            case "warning":
                bgColor = "linear-gradient(to right, #ff9d2f, #ff6126)";
                break;
            default:
                bgColor = "linear-gradient(to right, #232526, #414345)";
        }

        const toast = Toastify({
            text: message,
            duration: duration, // Domy�lnie 120 sekund
            close: true,
            gravity: "bottom", // Powiadomienie na dole ekranu
            position: "right", // Prawa strona
            backgroundColor: bgColor,
            stopOnFocus: true,
        });

        toast.showToast();

        // Opcjonalne: Automatyczne usuwanie powiadomienia po czasie
        setTimeout(() => {
            toast.hideToast(); // Niekt�re wersje Toastify nie maj� tej metody, mo�na j� zast�pi� np. ukryciem CSS
        }, duration);
    };

    return { showToast };
};
