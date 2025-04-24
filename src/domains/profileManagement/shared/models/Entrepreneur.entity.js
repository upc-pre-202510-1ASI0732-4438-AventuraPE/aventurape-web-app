export class Entrepreneur {
    constructor(
        id = 0,
        userId = 0,
        nameEntrepreneurship = '',
        city = '',
        country = '',
        number = '',
        postalCode = '',
        street = '',
        streetAddress = '',
        emailAddress = ''
    ) {
        this.id = id;
        this.userId = userId;
        this.nameEntrepreneurship = nameEntrepreneurship;
        this.city = city;
        this.country = country;
        this.number = number;
        this.postalCode = postalCode;
        this.street = street;
        this.streetAddress = streetAddress || `${street} ${number}, ${city}, ${country}`.trim();
        this.emailAddress = emailAddress;
    }
}