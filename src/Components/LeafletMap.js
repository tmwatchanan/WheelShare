import React, { Component } from 'react';
import Leaflet from 'leaflet'
import './LeafletMap.css'

class LeafletMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        // create map
        this.map = Leaflet.map('map', {
            fullscreenControl: true,
            center: [18.796426, 98.953400],
            zoom: 18,
            layers: [
                Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxNativeZoom: 18,
                    maxZoom: 20
                }),
            ]
        });
    }

    render() {
        return <div id="map"></div>
    }
}

export default LeafletMap
