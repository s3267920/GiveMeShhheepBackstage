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
      img: '',
      image: '',
      index: ''
    }
  },
  computed: {
    newImgList() {
      return (this.img = this.getImage)
    },
    newIndex() {
      return (this.index = this.getIndex)
    }
  },
  methods: {
    deleteImg() {
      this.$emit('remove', this.newIndex)
    }
  }
}
</script>