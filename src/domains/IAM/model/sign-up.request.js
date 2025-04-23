export class SignUpRequest {
    constructor(username, password, roles) {
        this.username = username;
        this.password = password;
        this.roles = roles;
    }
}