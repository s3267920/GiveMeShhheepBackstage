<template>
  <div class="preview_box" v-if="getImage">
    <img :src="getImage.src">
    <div class="image_delete">
      <font-awesome-icon class="delete_icon" :icon="['far', 'times-circle']" @click="deleteImg()"/>
    </div>
  </div>
</template>
<script>
export default {
  name: 'previewBox',
  props: ['getImage', 'getIndex'],
  data() {
    return {
      image: ''
    }
  },
  computed: {
    newImgList() {
      return this.getImage
    },
    newIndex() {
      return this.getIndex
    }
  },
  methods: {
    deleteImg() {
      this.$emit('remove', this.newIndex)
    }
  }
}
</script>
