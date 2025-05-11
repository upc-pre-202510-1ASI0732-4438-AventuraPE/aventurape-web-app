import { defineStore } from "pinia";
import { AuthenticationService } from "./authentication.service.js";
import Cookies from "js-cookie";

export const useAuthenticationStore = defineStore("authentication", {
    state: () => ({
        isSignedIn: !!Cookies.get("token"),
        username: Cookies.get("username") || "",
        roles: [],
        userId: null,
    }),

    actions: {
        async onSignUp() {
            this.submitted = true;
            this.errorMessage = "";

            if (!this.username || !this.password || !this.confirmPassword || !this.role) {
                this.errorMessage = "Todos los campos son obligatorios.";
                return;
            }

            if (!this.recaptchaVerified) {
                this.errorMessage = "Por favor, verifique que no es un robot.";
                this.$toast.add({
                    severity: "error",
                    summary: "Error",
                    detail: "Por favor, verifique que no es un robot",
                    life: 3000,
                });
                return;
            }

            if (this.passwordStrength < 60) {
                this.errorMessage = "La contraseña no cumple con los requisitos mínimos de seguridad.";
                return;
            }

            if (this.password !== this.confirmPassword) {
                this.errorMessage = "Las contraseñas no coinciden.";
                return;
            }

            const signUpRequest = new SignUpRequest(this.username, this.password, [this.role], this.recaptchaToken);
            const authenticationStore = useAuthenticationStore();

            try {
                await authenticationStore.signUp(signUpRequest, this.$router, this.$toast);
            } catch (error) {
                this.errorMessage = error.response?.data?.message || "Error al registrarse. Inténtalo de nuevo.";
            }
        },

        async signUp(signUpRequest, router, toast) {
            const authService = new AuthenticationService();

            const response = await authService.signUp(signUpRequest);

            toast.add({
                severity: "success",
                summary: "Éxito",
                detail: "Te has registrado correctamente. Por favor inicia sesión.",
                life: 3000,
            });

            router.push({ name: "sign-in" });
        },

        async signInAdmin(signInRequest, router, toast) {
            const authService = new AuthenticationService();

            const response = await authService.signInAdmin(signInRequest);

            if (!response.data || !response.data.token) {
                throw new Error("Invalid response from server");
            }

            const userId = response.data.id;
            this.storeUserData(response.data.token, userId, response.data.username);

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
        },

        async signIn(signInRequest, router, toast) {
            const authService = new AuthenticationService();

            const response = await authService.signIn(signInRequest);

            if (!response.data || !response.data.token) {
                throw new Error("Invalid response from server");
            }

            const userId = response.data.id;
            this.storeUserData(response.data.token, userId, response.data.username);

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
        },

        storeUserData(token, userId, username) {
            localStorage.setItem("token", token);
            localStorage.setItem("userId", userId);
            localStorage.setItem("username", username);

            Cookies.set("token", token, { path: "/" });
            Cookies.set("userId", userId, { path: "/" });
            Cookies.set("username", username, { path: "/" });
        },

        async fetchRoles(userId) {
            const authService = new AuthenticationService();

            const response = await authService.getUserRoles(userId);
            this.roles = response.data.roles || [];

            localStorage.setItem("roles", JSON.stringify(this.roles));
            Cookies.set("roles", JSON.stringify(this.roles), { path: "/" });
        },

        redirectBasedOnRole(router) {
            if (this.roles.includes("ROLE_ENTREPRENEUR")) {
                router.push({ name: "entrepreneur-home" });
            } else if (this.roles.includes("ROLE_ADVENTUROUS")) {
                router.push({ name: "adventurous-home" });
            } else if (this.roles.includes("ROLE_ADMIN")) {
                router.push({ name: "admin-home" });
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