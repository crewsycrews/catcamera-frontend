<template>
    <div>
        <div class="input__form">
            <input class="input__text" type="text" v-model.number="count" placeholder="Введите количество камер">
            <a class="button__" v-on:click="fetchAndPlaceCameras(count)">
                <strong>Расположить</strong>
            </a>
        </div>
        <div id="mapid">
        </div>
    </div>
    
</template>
 
<script>
import geojson from "../constants/geoJson";
import cameraCanvas from "../constants/camera";
import axios from 'axios';
import { Promise } from 'q';
const LEAFLET_SCRIPT = 'https://unpkg.com/leaflet@1.5.1/dist/leaflet.js';
const LEAFLET_RETRY = 5;
const VIEW_COORDINATE_X = 47.2185;
const VIEW_COORDINATE_Y = 38.9179;
const VIEW_COORDINATE_Z = 16;

export default {
    name: 'CatCamMap',
    data() {
        return {
            leaflet: {},
            leafletMap: {},
            leafletRetry: LEAFLET_RETRY,
            cameras: [],
            count: null,
            assetLayerGroup: {}
        }
    },
    methods: {
        setLeafLet() {
            try {
                if (window.L) {
                    this.leaflet = window.L;
                }
            } catch (err) {
                // Retry on any leaflet error
                if (this.leafletRetry > 0) {
                    this.leafletRetry -= 1;
                    setTimeout(this.setLeafLet, 1000);
                }
            }
            this.constructLeafletMap();
        },
        
        constructLeafletMap() {
            try {
                // window.console.log(this.leaflet);
                this.leafletMap = this.leaflet.map('mapid').setView([VIEW_COORDINATE_X, VIEW_COORDINATE_Y], VIEW_COORDINATE_Z);
                this.leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                }).addTo(this.leafletMap);
                this.leaflet.geoJSON(geojson).addTo(this.leafletMap);
                this.assetLayerGroup = new this.leaflet.LayerGroup().addTo(this.leafletMap);
                // var x = 38.91904592514038;
                // var y = 47.219003372588666;
                
            } catch (e) {
                window.console.log(e);
            }
        },
        placeCamera(x,y) {
            var myStyle = {
                "color": '#000',
                "opacity": 0.65
            };
            var layer = this.leaflet.geoJSON(cameraCanvas.compute(x,y), { style: myStyle });
            this.assetLayerGroup.addLayer(layer);
        },
        placeCameras(camerasCoords) {
            this.assetLayerGroup.clearLayers();
            camerasCoords.forEach(element => {
                this.placeCamera(element[0],element[1]);
            });
        },
        fetchCameras(count=0) {
            return new Promise((res)=>{
                var url = '';
                if (count == 0) {
                    url = 'http://localhost:3000/best';
                } else {
                    url = 'http://localhost:3000/best?count='+count;
                }
                axios.get(url)
                .then((response) => {
                    this.cameras = response.data;
                    res(this.cameras);
                }).catch((error) => window.console.log(error));
            })
        },
        fetchAndPlaceCameras(count) {
            try {
                this.fetchCameras(count).then((res)=>{
                        this.placeCameras(res);
                    });
            } catch(e) {
                window.console.log(e);
            }
        },
    },
    mounted() {        
        if (!window.L) {
            const leafLetScript = document.createElement('script');
            leafLetScript.setAttribute('src', LEAFLET_SCRIPT);
            leafLetScript.onload = () => {
                this.setLeafLet();
            };
            document.head.appendChild(leafLetScript);
        } else {
            // Create Stripe object right away
            this.setLeafLet();
        }
        
    }
}
</script>
<style lang="less" scoped>
@import "../assets/map.less";
@import url('https://unpkg.com/leaflet@1.5.1/dist/leaflet.css');
</style>

