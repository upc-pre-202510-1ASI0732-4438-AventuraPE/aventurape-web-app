export class Entrepreneur {
    constructor(
        id = 0,
        userId = 0,
        name = '',
        city = '',
        country = '',
        number = '',
        postalCode = '',
        streetAddress = '',
        emailAddress = ''
    ) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.city = city;
        this.country = country;
        this.number = number;
        this.postalCode = postalCode;
        this.streetAddress = streetAddress;
        this.emailAddress = emailAddress;
    }
}