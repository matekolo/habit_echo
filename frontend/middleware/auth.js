export default defineNuxtRouteMiddleware((to, from) => {
    const token = useCookie("token"); // Pobiera token z ciasteczek

    if (token.value && (to.path === "/login" || to.path === "/register")) {
        return navigateTo("/dashboard"); // Je�li u�ytkownik jest zalogowany, przekieruj go na dashboard
    }
});
