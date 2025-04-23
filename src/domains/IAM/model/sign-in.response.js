export class SignInResponse {
    constructor(id, username, roles, token) {
        this.id = id;
        this.username = username;
        this.roles = roles;
        this.token = token;
    }
}