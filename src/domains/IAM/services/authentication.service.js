import http from "@/shared/services/http-common.js";

export class AuthenticationService {
    signIn(signInRequest) {
        return http.post(`/authentication/sign-in?recaptchaToken=${signInRequest.recaptchaToken || ''}`, {
            username: signInRequest.username,
            password: signInRequest.password,
        });
    }

    signUp(signUpRequest) {
        return http.post(`/authentication/sign-up?recaptchaToken=${signUpRequest.recaptchaToken || ''}`, {
            username: signUpRequest.username,
            password: signUpRequest.password,
            email: signUpRequest.email,
            roles: signUpRequest.roles
        });
    }

    signInAdmin(signInRequest) {
        return http.post(`/authentication/sign-in?recaptchaToken=${signInRequest.recaptchaToken || ''}`, {
            username: signInRequest.username,
            password: signInRequest.password,
        });
    }

    getUserRoles(userId) {
        return http.get(`/users/${userId}`);
    }
    getUserById(userId) {
        return http.get(`/users/${userId}`);
    }

}