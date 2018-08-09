class Venue {
    constructor(id, name, address, lat, lng){
        
        this.id = id;
        this.name = name;
        this.location = {
            "address" : address,
            "lat" : lat,
            "lng" : lng
        };
      

    }
}