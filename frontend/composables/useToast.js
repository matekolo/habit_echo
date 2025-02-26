import Toastify from 'toastify-js'
import 'toastify-js/src/toastify.css'

export const useToast = () => {
    return {
        showToast: (message, type = 'success') => {
            let backgroundColor = 'linear-gradient(to right, #00b09b, #96c93d)' // Zielony dla sukcesu

            if (type === 'error') {
                backgroundColor = 'linear-gradient(to right, #ff5f6d, #ffc371)' // Czerwony dla błędu
            } else if (type === 'info') {
                backgroundColor = 'linear-gradient(to right, #2193b0, #6dd5ed)' // Niebieski dla info
            }

            Toastify({
                text: message,
                duration: 3000,
                close: true,
                gravity: 'bottom', // ⬇️ Powiadomienia na dole
                position: 'right', // ▶️ Po prawej
                backgroundColor,
            }).showToast()
        }
    }
}
