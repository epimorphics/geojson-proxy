import _ from 'lodash'

export default {
  /*
  * Convert objects returned from the API in to pure GeoJSON objects ready to be consumed by the map service.
  */
  transformToGeoJSON: function (data) {
    let featureCollectionTemplate = `{
      "type": "FeatureCollection",
      "features": []
    }`
    let featureTemplate = `{
      "type": "Feature",
      "properties": {},
      "geometry": {}
    }`
    let pointTemplate = `{
      "type": "Point",
      "coordinates": []
    }`

    // Iterate over the array, converting to a new object type
    let results = _.compact(data.map(element => {
      // If it has geometry let that take precedence
      let newEl = JSON.parse(featureTemplate)
      if (element.hasGeometry) {
        newEl.geometry = JSON.parse(element.hasGeometry.asJSON._value)
        newEl.properties = element // Copy the raw object on to properties
        return newEl
      // Else use latitude and longitude
    } else if (element.lat && element.long) {
        newEl.geometry = JSON.parse(pointTemplate)
        newEl.geometry.coordinates = [element.long, element.lat]
        newEl.properties = element // Copy the raw object on to properties
        return newEl
      }
    }))

    // Wrap the whole object up in GeoJSON wrapper object
    let result = JSON.parse(featureCollectionTemplate)
    result.features = results
    return result
  }
}
