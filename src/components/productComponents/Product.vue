<style lang="scss" src="@/scss/layout.scss"></style>
<style lang="scss" src="@/scss/product.scss"></style>

<template src="./product.html"></template>

<script>
import PreviewBox from './PreviewBox'
export default {
  name: 'product',
  components: {
    PreviewBox
  },
  data() {
    return {
      modalDisplay: false,
      modalStatus: '',
      imgList: [],
      formData: [
        {
          img: [],
          title: '',
          discriiption: '',
          price: {
            origin: '',
            discount: ''
          },
          specification: {},
          status: ''
        }
      ]
    }
  },
  computed: {
    imgName() {
      let list = []
      this.imgList.forEach(el => {
        list.push(el.name)
      })
      return list
    }
  },
  methods: {
    openModal() {
      this.modalDisplay = true
    },
    closeModal() {
      this.modalDisplay = false
    },
    addImg(e) {
      //參考https://runkids.github.io/vue/2017123101/
      let vm = this
      let fileList = []
      let files = e.target.files
      Array.prototype.forEach.call(files, this.readURL)
    },
    readURL(files) {
      // console.log(files)
      let vm = this
      if (!window.FileReader) {
        alert('您的設備不支援圖片預覽功能，如需此功能，請升級瀏覽器')
      } else {
        let reader = new FileReader()
        reader.onload = function(evt) {
          console.log(evt.target)
          let src = evt.target.result.replace(/\r\n|\n/g, '')
          let name = files.name
          let newImg = {
            src,
            name
          }
          console.log(newImg)
          vm.imgList.push(newImg)
        }
        reader.readAsDataURL(files)
      }
    },
    deleteImg() {},
    fileDragHandle(e) {
      e.stopPropagation()
      e.preventDefault()
      e.target.className = e.type == 'dragover' ? 'hover' : ''
    },
    fileSelectHandle() {}
  },
  mounted() {}
}
</script>
