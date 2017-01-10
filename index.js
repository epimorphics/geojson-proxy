// Transform data from JSON to GeoJSON based on standard properties
import transform from './transform' // Transform function
import superAgent from 'superagent' // Load data from the API
var express = require('express')

const port = process.env.PORT ? process.env.PORT : 3000
var app = express()

app.get('/api/', function (req, res) {
  console.log(req.query)
  superAgent
    .get(req.query.endpoint)
    .end(function(err, apiRes) {
      if (err) {
        res.status(500)
        return res.end('' + err)
      }
      try {
        let geoJSON = transform.transformToGeoJSON(apiRes.body.items)
        res.end(JSON.stringify(geoJSON))
      } catch (e) {
        res.status(500)
        return res.end(`Please ensure you're connecting to a JSON API and that it returns objects with 'lat' and 'long' properties`)
      }
    });
})

app.get('/', function (req, res) {
  res.sendFile('index.html' , { root : __dirname})
})

app.listen(port, function () {
  console.log(`API proxy listening on port ${port}`)
})
