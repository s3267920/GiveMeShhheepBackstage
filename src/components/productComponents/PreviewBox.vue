<template>
  <div class="preview_box" v-if="getImage">
    <img :src="getImage.src">
    <div class="image_delete">
      <font-awesome-icon
        class="delete_icon"
        :icon="['far', 'times-circle']"
        size="lg"
        @click="deleteImg()"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: 'previewBox',
  props: ['getImage'],
  data() {
    return {
      img: '',
      image: ''
    }
  },
  computed: {
    newImgList() {
      return (this.img = this.getImage)
    }
  }
}
</script>