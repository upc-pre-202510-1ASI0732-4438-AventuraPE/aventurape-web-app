export class Publication {
    constructor(
         id = 0,
         entrepreneurId = 0,
         nameActivity = '',
         description = '',
         timeDuration = '',
         image = '',
         cantPeople = '',
         cost = '',
         averageRating = ''
    ) {
        this.id = id;
        this.entrepreneurId = entrepreneurId;
        this.nameActivity = nameActivity;
        this.description = description;
        this.timeDuration = timeDuration;
        this.image = image;
        this.cantPeople = cantPeople;
        this.cost = cost;
        this.averageRating = averageRating;
    }
}
