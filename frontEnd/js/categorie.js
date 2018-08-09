class Categorie {
    constructor(venueId, id, name, pluralName, shortName, prefix, suffix, primary){

        this.venueId = venueId;
        this.categorieId = id;
        this.name = name;
        this.pluralName = pluralName;
        this.shortName = shortName;
        this.icon = {
            "prefix" : prefix,
            "suffix" : suffix
        };
        this.primary = primary;

    }
}