export class SignUpRequest {
    constructor(username, password, roles,proofingEntrepreneure) {
        this.username = username;
        this.password = password;
        this.roles = roles;
        this.proofingEntrepreneure = proofingEntrepreneure;
    }
}