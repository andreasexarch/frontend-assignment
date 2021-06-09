<template>
    <v-container>
        <span class="font-weight-medium">Something went wrong</span>
        <br>
        <span class="font-italic">{{ errorMsg }}</span>
    </v-container>
</template>

<script>
export default {
  name: 'errorComponent',
  props: ['errorMsg'],
  components: {
  },
  data: () => ({

  })
}
</script>