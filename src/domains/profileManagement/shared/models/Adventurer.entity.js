export class Adventurer {
    constructor(
        id = 0,
        userId = 0,
        firstName = '',
        lastName = '',
        gender = '',
        email = '',
        street = '',
        number = '',
        city = '',
        postalCode = '',
        country = '',
        fullName = '',
        streetAddress = ''
    ) {
        this.id = id;
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.fullName = fullName || `${firstName} ${lastName}`.trim();
        this.gender = gender;
        this.email = email;
        this.street = street;
        this.number = number;
        this.city = city;
        this.postalCode = postalCode;
        this.country = country;
        this.streetAddress = streetAddress || street;
    }
}