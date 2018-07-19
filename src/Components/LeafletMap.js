import React, { Component } from 'react';
import Leaflet from 'leaflet'
// import './LeafletMap.css'

class LeafletMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    updateDimensions() {
        const height = window.innerHeight
        this.setState({ height: height })
    }

    componentWillMount() {
        this.updateDimensions()
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateDimensions.bind(this))
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

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this))
    }

    render() {
        return <div id="map" style={{ height: this.state.height }}></div>
    }
}

export default LeafletMap
