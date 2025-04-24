export class ActivityEntity {
    constructor(id, entrepreneurId, nameActivity, description, timeDuration, image, cantPeople, cost) {
        this.id = id;
        this.entrepreneurId = entrepreneurId;
        this.nameActivity = nameActivity;
        this.description = description;
        this.timeDuration = timeDuration;
        this.image = image;
        this.cantPeople = cantPeople;
        this.cost = cost;
    }
}