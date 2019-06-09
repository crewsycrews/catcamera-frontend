<template>
  <div class="hello">

    <img src="../assets/camera.png" width="100%" alt="CatCam" class="camera">
    
    <article class="article">
        <p>Город/Квартал</p>
        
        <div class="main__form">
            <div class="map__form">
                <CatCamMap />
            </div>
        </div>
    </article>
  </div>
</template>

<script>
import CatCamMap from './CatCamMap';

export default {
  name: 'Main',
  props: {
    msg: String
  },
  components: {
    CatCamMap
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>
