<style lang="scss" src="@/scss/layout.scss"></style>
<style lang="scss" src="@/scss/product.scss"></style>

<template src="./product.html"></template>

<script>
import PreviewBox from './PreviewBox'
import Specification from './Specification'
import ProductTable from './ProductTable'
import LoadingPage from './LoadingPage'
import db from '@/firebaseInit.js'
export default {
  name: 'product',
  components: {
    PreviewBox,
    Specification,
    ProductTable,
    LoadingPage
  },
  data() {
    return {
      image: [],
      modalDisplay: false,
      trRowColorGreen: false,
      imgList: [],
      specificationCount: 0,
      productData: [],
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
      },
      isLoading: false
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
    },
    trColorGreen() {
      this.productData.forEach((el, index, arr) => {
        if (arr.indexOf(el) % 2 === 0) {
          return true
        } else {
          return false
        }
      })
    },
    dataStatus() {
      // if()
    }
  },
  methods: {
    openModal() {
      this.modalDisplay = true
    },
    closeModal() {
      this.modalDisplay = false
      this.resetForm()
    },
    addImg(e) {
      //參考https://runkids.github.io/vue/2017123101/
      let vm = this
      let files = e.target.files
      Array.prototype.forEach.call(files, this.readURL)
    },
    readURL(files) {
      let vm = this
      vm.image.push(files)
      if (!window.FileReader) {
        alert('您的設備不支援圖片預覽功能，如需此功能，請升級瀏覽器')
      } else {
        let reader = new FileReader()
        reader.onload = function(evt) {
          let img = new Image()
          let baseUrl = evt.target.result.replace(/\r\n|\n/g, '')
          img.src = baseUrl
          let name = files.name
          //壓縮圖片
          img.onload = function() {
            //參考資料https://www.cnblogs.com/moqiutao/p/8657926.html
            //https://www.zhangxinxu.com/wordpress/2017/07/html5-canvas-image-compress-upload/
            let canvas = document.createElement('canvas')
            let ctx = canvas.getContext('2d')
            let imgWidth = img.width
            let imgHeight = img.height
            let maxWidth = 1024,
              maxHeight = 1024
            let targetWidth = imgWidth,
              targetHeight = imgHeight
            if (imgWidth > maxWidth || imgHeight > maxHeight) {
              if (imgWidth / imgHeight > maxWidth / maxHeight) {
                targetWidth = maxWidth
                targetHeight = Math.round(maxWidth * (imgHeight / imgWidth))
              } else {
                targetHeight = maxHeight
                targetWidth = Math.round(maxHeight * (imgWidth / imgHeight))
              }
            }
            canvas.width = targetWidth
            canvas.height = targetHeight
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight)
            let newBaseUrl = canvas.toDataURL(files.type, 1.0)
            let src = newBaseUrl.replace(/\r\n|\n/g, '')
            let newImg = {
              src,
              name
            }
            vm.imgList.push(newImg)
          }
        }
        reader.readAsDataURL(files)
      }
    },
    removeImg(newIndex) {
      this.imgList.splice(newIndex, 1)
      this.image.splice(newIndex, 1)
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
        styleInfo: [
          {
            inventory: '',
            size: ''
          }
        ],
        hasConfirm: null,
        id: this.getNewId,
        index: this.getNewId
      })
    },
    submitData() {
      if (
        !this.formData.img.length &&
        this.formData.productName === '' &&
        this.formData.discription === '' &&
        this.formData.price.original === '' &&
        this.formData.price.discount === '' &&
        this.formData.specification[0].style === null &&
        this.formData.specification[0].styleInfo[0].inventory === '' &&
        this.formData.specification[0].styleInfo[0].size === ''
      ) {
        alert('請填寫完畢再送出！！！')
      } else {
        this.isLoading = true
        let newProduct = {
          productName: this.formData.productName,
          discription: this.formData.discription,
          price: {
            original: this.formData.price.original,
            discount: this.formData.price.discount
          },
          specification: this.formData.specification,
          status: this.formData.status
        }
        let id
        db.firestore()
          .collection('user')
          .doc('eeaiaWr8npPl02Xn9lQohYvfFgn2')
          .collection('product')
          .add(newProduct)
          .then(data => {
            id = data.id
            return id
          })
          .then(id => {
            let storage = db.storage()
            let userID = 'eeaiaWr8npPl02Xn9lQohYvfFgn2' + '/'
            this.image.forEach(img => {
              storage
                .ref('user/' + userID + 'product/' + id)
                .child(img.name)
                .put(img)
                .then(fileData => {
                  storage
                    .ref(fileData.metadata.fullPath)
                    .getDownloadURL()
                    .then(url => {
                      let newImgInfo = {
                        name: fileData.metadata.name,
                        src: url
                      }
                      if (fileData.state === 'success') {
                        this.formData.img.push(newImgInfo)
                      }
                      if (this.formData.img.length === this.image.length) {
                        db.firestore()
                          .collection('user')
                          .doc('eeaiaWr8npPl02Xn9lQohYvfFgn2')
                          .collection('product')
                          .doc(id)
                          .update({
                            id: id,
                            imgList: this.formData.img
                          })
                          .then(function() {
                            this.resetForm()
                            this.isLoading = false
                          })
                      }
                    })
                })
                .catch(function(error) {
                  console.error('Error adding document: ', error)
                })
            })
          })
          .catch(function(error) {
            console.error('Error adding document: ', error)
          })
        this.modalDisplay = false
      }
    },
    resetForm() {
      this.formData.productName = ''
      this.formData.discription = ''
      this.formData.price.original = ''
      this.formData.price.discount = ''
      this.formData.specification = []
      this.img = []
      this.image = []
      this.imgList = []
      this.addNewSpecification()
    },
    fileDragHandle(e) {
      e.stopPropagation()
      e.preventDefault()
      e.target.className = e.type == 'dragover' ? 'hover' : ''
    },
    fileSelectHandle() {},
    getProductData() {
      //在database裡面的user集合裡的id
      //id裡面的集合product
      db.firestore()
        .collection('user')
        .doc('eeaiaWr8npPl02Xn9lQohYvfFgn2')
        .collection('product')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            let data = {
              id: doc.id,
              imgList: doc.data().imgList,
              productName: doc.data().productName,
              discription: doc.data().discription,
              price: {
                original: doc.data().price.original,
                discount: doc.data().price.discount
              },
              specification: doc.data().specification,
              status: doc.data().status
            }
            this.productData.push(data)
          })
        })
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.addNewSpecification()
    })
  },
  updated() {
    this.$nextTick(function() {
      !this.productData.length
        ? (this.isLoading = true)
        : (this.isLoading = false)
    })
  },
  created() {
    this.$nextTick(function() {
      this.getProductData()
    })
  }
}
</script>
