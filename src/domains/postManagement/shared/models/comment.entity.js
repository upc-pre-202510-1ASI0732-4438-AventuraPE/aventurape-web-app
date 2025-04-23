export class CommentEntity{
    constructor(id, publicationId, content, rating, adventureId) {
        this.id = id;
        //publication tiene que conectarse con el comentario
        this.publicationId = publicationId;
        this.content = content;
        this.rating = rating;
        this.adventureId = adventureId;
    }
}
