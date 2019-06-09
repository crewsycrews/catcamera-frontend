<template>
    <div id="mapid">
    </div>
</template>
 
<script>
import geojson from "../constants/geoJson";
import mainCanvas from "../constants/mainCanvas";
import cameraCanvas from "../constants/camera";
const LEAFLET_SCRIPT = 'https://unpkg.com/leaflet@1.5.1/dist/leaflet.js';
// const MAPBOX_TOKEN = 'sk.eyJ1IjoiY3Jld3MiLCJhIjoiY2p3bnMxZ3d6MTM5YzN6b2xqZ2xmMm4ycCJ9.3A6Le1fvMlS8TZx02tPK9w';
const LEAFLET_RETRY = 5;
export default {
    name: 'CatCamMap',
    data() {
        return {
            leaflet: {},
            leafletMap: {},
            leafletRetry: LEAFLET_RETRY
        }
    },
    // computed: {
    //     CatMap() {
    //         return this.constructLeafletMap();
    //     },
    // },
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
                this.leafletMap = this.leaflet.map('mapid').setView([47.2185, 38.9179], 16);
                this.leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                }).addTo(this.leafletMap);
                this.leaflet.geoJSON(geojson).addTo(this.leafletMap);
                var x = 38.91904592514038;
                var y = 47.219003372588666;
                this.placeCamera(x,y);
                // return this.leafletMap;
            } catch (e) {
                window.console.log(e);
            }
        },
        placeCamera(x,y) {
            var myStyle = {
                "color": '#000',
                "opacity": 0.65
            };
            this.leaflet.geoJSON(cameraCanvas.compute(x,y), {
                                        style: myStyle
                                    }).addTo(this.leafletMap);
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

