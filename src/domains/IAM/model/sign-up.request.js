export class SignUpRequest {
    constructor(username, password, email, roles, recaptchaToken = "", proofingEntrepreneure = null) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.roles = roles;
        this.recaptchaToken = recaptchaToken;
        this.proofingEntrepreneure = proofingEntrepreneure;
    }
}