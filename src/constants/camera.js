export default {
    data: {
      "type": "FeatureCollection",
      "features": [
          {
              "type": "Feature",
              "properties": {},
              "geometry": {
                  "type": "Point",
                  "coordinates": [
                      null,
                      null
                  ]
              }
          }
      ]
    },
    compute(x,y) {
      this.data.features[0].geometry.coordinates[0] = x;
      this.data.features[0].geometry.coordinates[1] = y;
      return this.data;
    }    
}