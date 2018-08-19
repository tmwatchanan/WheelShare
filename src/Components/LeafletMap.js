import React, { Component } from 'react'
import Leaflet from 'leaflet'
import "leaflet/dist/leaflet.css"
import './LeafletMap.css'

class LeafletMap extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mapData: {},
            pathGeoJSON: {},
            verticeGeoJSON: {},
            userPath: {
                start: {},
                end: {}
            }
        }
    }

    componentDidMount() {
        this.FetchAllFromAPI()
        // create map
        this.map = Leaflet.map('map', {
            fullscreenControl: true,
            center: [18.796426, 98.953400],
            zoom: 18,
            layers: [
                Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxNativeZoom: 18,
                    maxZoom: 20,
                    attribution: 'WheelShare'
                }),
            ]
        })
    }

    FetchAllFromAPI() {
        fetch('https://polar-scrubland-80686.herokuapp.com/api/all')
            .then(response => response.json())
            .then((responseJson) => {
                this.setState(
                    {
                        mapData: responseJson
                    }
                )
                this.convertPathsToGeoJSON()
                this.convertVerticesToGeoJSON()
                this.drawDataOnMap()
                console.log(this.state.mapData)
            })
            .catch(error => console.error(error))
    }

    convertPathsToGeoJSON() {
        let pathGeoJSON = {
            'type': 'FeatureCollection',
            'features': []
        }
        this.state.mapData.paths.forEach(path => {
            let pathFeature = {
                'type': 'Feature',
                'geometry': {
                    'type': 'LineString',
                    'coordinates': [[path.run[0].lng, path.run[0].lat], [path.run[1].lng, path.run[1].lat]]
                },
                'properties': {
                    'id': path.id,
                    'distance': path.distance,
                    'safety': path.safety
                }
            }
            pathGeoJSON.features.push(pathFeature)
        })
        this.setState(
            {
                pathGeoJSON: pathGeoJSON
            }
        )
    }

    convertVerticesToGeoJSON() {
        let verticeGeoJSON = {
            'type': 'FeatureCollection',
            'features': []
        }
        this.state.mapData.vertices.forEach(point => {
            let verticeFeature = {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [point.lng, point.lat]
                },
                'properties': {
                    'id': point.id
                }
            }
            verticeGeoJSON.features.push(verticeFeature)
        })
        this.setState(
            {
                verticeGeoJSON: verticeGeoJSON
            }
        )
    }

    drawDataOnMap() {
        this.drawPaths()
        this.drawCircles()
    }

    drawPaths() {
        let getPathColorFromSafety = function (safety) {
            switch (Math.round(safety)) {
                case 1:
                    return '#d94b38'//'red'
                case 2:
                    return '#d9a238'//'orange'
                case 3:
                    return '#309d27'//'#c8d938'//'green'
                default:
                    return 'black'
            }
        }
        let pathStyle = function (feature) {
            return {
                weight: 5,
                opacity: 1,
                color: getPathColorFromSafety(feature.properties.safety)
            }
        }
        var controlLayers = Leaflet.control.layers().addTo(this.map)
        let geoJSONLayer = Leaflet.geoJSON(this.state.pathGeoJSON, { style: pathStyle }).addTo(this.map)
        controlLayers.addOverlay(geoJSONLayer, "Wheelchair Paths")
        geoJSONLayer.addEventListener('click dblclick', function (e) {
            alert(e.layer.feature.properties.safety)
        })
    }

    drawCircles() {
        let markerOptions = {
            weight: 1,
            opacity: 1,
            radius: 5,
            color: 'black',
            fillColor: 'black',
            fillOpacity: 0.8
        }
        var geoJSONOptions = {
            pointToLayer: function (feature, latlng) {
                return Leaflet.circleMarker(latlng, markerOptions)
            },
            onEachFeature: function (feature, layer) {
                if (feature.properties) {
                    // layer.bindPopup(feature.properties.id)
                    layer.bindPopup(String(feature.properties.id))
                }
            }

        }
        var controlLayers = Leaflet.control.layers().addTo(this.map)
        let geoJSONLayer = Leaflet.geoJSON(this.state.verticeGeoJSON, geoJSONOptions).addTo(this.map)
        controlLayers.addOverlay(geoJSONLayer, "Wheelchair Vertices")
        // geoJSONLayer.addEventListener('click dblclick', function (e) {
        //     // alert(e.layer.feature.properties.safety)
        //     alert('Circle')
        // })


        // this.state.mapData.vertices.forEach(vertex => {
        //     let drawCircle = new Leaflet.Circle([vertex.lat, vertex.lng], {
        //         radius: 1.2,
        //         color: 'black'
        //     })
        //     drawCircle.addTo(this.map).on("click", (e) => {
        //         let clickedCircle = e.target
        //         clickedCircle.bindPopup("Hi").openPopup()
        //     })
        // })
    }

    render() {
        return <div id="map"></div>
    }
}

export default LeafletMap
