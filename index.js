// Transform data from JSON to GeoJSON based on standard properties
import transform from './transform' // Transform function
import superAgent from 'superagent' // Load data from the API
import config from './config' // Load data from the API

const http = require('http')
const port = process.env.PORT ? process.env.PORT : 3000

const requestHandler = (request, response) => {
  if(request.url === '/'){
    superAgent
      .get(config.baseUrl)
      .end(function(err, res) {
        if (err) {
          return response.end('' + err)
        }
        let geoJSON = transform.transformToGeoJSON(res.body.items)
        response.end(JSON.stringify(geoJSON))
      });
  } else {
    response.end('use /')
  }
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }
  console.log(`server is listening on ${port}`)
})
