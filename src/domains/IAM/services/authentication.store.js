import { defineStore } from "pinia";
import { AuthenticationService } from "./authentication.service.js";
import Cookies from "js-cookie";

export const useAuthenticationStore = defineStore("authentication", {
    state: () => ({
        isSignedIn: !!Cookies.get("token"),
        username: Cookies.get("username") || "",
        roles: [], // Se vacía inicialmente, los roles se obtendrán dinámicamente
        userId: null, // Almacena el userId
    }),

    actions: {
        async signUp(signUpRequest, router, toast) {
            const authService = new AuthenticationService();

            try {
                const response = await authService.signUp(signUpRequest);

                toast.add({
                    severity: "success",
                    summary: "Éxito",
                    detail: "Te has registrado correctamente. Ahora puedes iniciar sesión.",
                    life: 3000,
                });

                router.push({ name: "sign-in" });
            } catch (error) {
                console.error("Error en el registro:", error);
                throw error;
            }
        },

        async signIn(signInRequest, router, toast) {
            const authService = new AuthenticationService();

            try {
                const response = await authService.signIn(signInRequest);

                if (!response.data || !response.data.token) {
                    throw new Error("Invalid response from server");
                }

                const userId = response.data.id;
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("userId", userId);
                localStorage.setItem("username", response.data.username);

                Cookies.set("token", response.data.token, { path: "/" });
                Cookies.set("userId", userId, { path: "/" });
                Cookies.set("username", response.data.username, { path: "/" });

                this.isSignedIn = true;
                this.username = response.data.username;
                this.userId = userId;

                await this.fetchRoles(userId);

                toast.add({
                    severity: "success",
                    summary: "Éxito",
                    detail: "Has iniciado sesión correctamente",
                    life: 3000,
                });

                this.redirectBasedOnRole(router);
            } catch (error) {
                console.error("Sign in error", error);
                toast.add({
                    severity: "error",
                    summary: "Error",
                    detail: error.response?.data?.message || "Error al iniciar sesión",
                    life: 3000,
                });
            }
        },

        async fetchRoles(userId) {
            const authService = new AuthenticationService();
            try {
                const response = await authService.getUserRoles(userId);
                this.roles = response.data.roles || [];

                localStorage.setItem("roles", JSON.stringify(this.roles));
                Cookies.set("roles", JSON.stringify(this.roles), { path: "/" });
            } catch (error) {
                console.error("Error fetching roles:", error);
                this.roles = [];
            }
        },

        redirectBasedOnRole(router) {
            if (this.roles.includes("ROLE_ENTREPRENEUR")) {
                router.push({ name: "entrepreneur-home" });
            } else if (this.roles.includes("ROLE_ADVENTUROUS")) {
                router.push({ name: "adventurous-home" });
            } else {
                router.push({ name: "sign-in" });
            }
        },

        signOut(router) {
            localStorage.clear();
            Cookies.remove("token", { path: "/" });
            Cookies.remove("userId", { path: "/" });
            Cookies.remove("username", { path: "/" });
            Cookies.remove("roles", { path: "/" });

            this.isSignedIn = false;
            this.username = "";
            this.roles = [];
            this.userId = null;

            router.push({ name: "sign-in" });
        },
    },
});