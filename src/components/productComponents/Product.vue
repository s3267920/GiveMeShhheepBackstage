<style lang="scss" src="@/scss/layout.scss"></style>
<style lang="scss" src="@/scss/product.scss"></style>

<template src="./product.html"></template>

<script>
import PreviewBox from './PreviewBox'
import Specification from './Specification'
export default {
  name: 'product',
  components: {
    PreviewBox,
    Specification
  },
  data() {
    return {
      modalDisplay: false,
      modalStatus: '',
      imgList: [],
      specificationCount: 0,
      formData: {
        img: [],
        productName: '',
        discription: '',
        price: {
          original: '',
          discount: ''
        },
        specification: [],
        status: true
      }
    }
  },
  computed: {
    imgName() {
      let list = []
      this.imgList.forEach(el => {
        list.push(el.name)
      })
      return list
    },
    getNewId() {
      return this.specificationCount
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
          vm.imgList.push(newImg)
          vm.formData.img = vm.imgList
        }
        reader.readAsDataURL(files)
      }
    },
    removeImg(newIndex) {
      this.imgList.splice(newIndex, 1)
    },
    removeSpecification(data) {
      let index = this.formData.specification.indexOf(data)
      this.formData.specification.splice(index, 1)
      this.$forceUpdate()
    },
    determineSpecification(data) {
      let newIndex = data.index
      let arr = this.formData.specification
      if (!data.style.length && !data.inventory.length) {
        alert('請輸入樣式跟庫存')
        return
      } else {
        if (this.formData.specification.length <= 1) {
          this.formData.specification.splice(newIndex, 1, data)
        } else {
          try {
            arr.forEach(el => {
              if (arr.indexOf(el) !== newIndex) {
                this.formData.specification.splice(newIndex, 1, data)
              } else {
                this.$set(
                  this.formData.specification,
                  this.formData.specification.findIndex(
                    newData => newData.style === data.style
                  ),
                  data
                )
              }
            })
          } catch (error) {
            console.log(error)
          }
        }
      }
    },
    addNewSpecification() {
      if (this.formData.specification.length > 0) {
        this.specificationCount++
      }
      this.formData.specification.push({
        style: null,
        inventory: null,
        hasConfirm: null,
        id: this.getNewId,
        index: this.getNewId
      })
    },
    submitData() {},
    fileDragHandle(e) {
      e.stopPropagation()
      e.preventDefault()
      e.target.className = e.type == 'dragover' ? 'hover' : ''
    },
    fileSelectHandle() {}
  },
  mounted() {
    this.$nextTick(function() {
      this.addNewSpecification()
    })
  }
}
</script>
