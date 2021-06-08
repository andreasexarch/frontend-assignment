<template>
    <div>
        Hello mr pop up
        <!-- <custom-data-presentation v-if="weatherData" :weatherData="weatherData"></custom-data-presentation> -->
    </div>
</template>

<script>
// import customDataPresentation from './customDataPresentation.vue'
export default {
  name: 'customPopUp',
  props: ['weatherData'],
  components: {
    // customDataPresentation
  },
  data: () => ({

  }),
  created(){

  },
  mounted(){
  }
};
</script>
