export default defineNuxtRouteMiddleware((to, from) => {
    const token = useCookie("token"); // Pobiera token z ciasteczek

    if (token.value && (to.path === "/login" || to.path === "/register")) {
        return navigateTo("/dashboard"); // Jeœli u¿ytkownik jest zalogowany, przekieruj go na dashboard
    }
});
