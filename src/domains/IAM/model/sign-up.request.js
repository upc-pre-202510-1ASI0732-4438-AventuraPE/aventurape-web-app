export class SignUpRequest {
    constructor(username, password, roles, recaptchaToken = "", proofingEntrepreneure = null) {
        this.username = username;
        this.password = password;
        this.roles = roles;
        this.recaptchaToken = recaptchaToken;
        this.proofingEntrepreneure = proofingEntrepreneure;
    }
}