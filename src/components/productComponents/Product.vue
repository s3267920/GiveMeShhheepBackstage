<style lang="scss" src="@/scss/layout.scss"></style>
<style lang="scss" src="@/scss/product.scss"></style>

<template src="./product.html"></template>

<script>
import PreviewBox from './PreviewBox'
import Specification from './Specification'
import ProductTable from './ProductTable'
import LoadingPage from '../extendComponents/LoadingPage'
import ChangeStatusSelection from '../extendComponents/ChangeStatusSelection'
import Pagination from '../extendComponents/Pagination'
import db from '@/firebaseInit.js'
export default {
  name: 'product',
  components: {
    PreviewBox,
    Specification,
    ChangeStatusSelection,
    ProductTable,
    LoadingPage,
    Pagination
  },
  data() {
    return {
      modalDisplay: false,
      isCheckedAll: false,
      isDragZone: false,
      allSelectionOption: ['published', 'unpublished'],
      hasSelectText: '',
      hasCheckedDataArray: [],
      imgList: [],
      specificationCount: 0,
      filterData: [],
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
      isLoading: false,
      selectionOptionDisplay: false,
      page: null,
      limitNum: null
    }
  },
  computed: {
    getNewId() {
      return this.specificationCount
    },
    productTableData() {
      if (!this.filterData.length) {
        return this.filterDataHandle(1, 5)
      } else {
        this.hasCheckedData = []
        this.hasSelectText = ''
        this.selectionOptionDisplay = false
        this.isCheckedAll = false
        return this.filterData
      }
    },
    userID() {
      return db.auth().currentUser.uid
    },
    productIndex() {
      let vm = this
      if (!vm.productData.length) {
        return 0
      } else {
        return vm.productData[vm.productData.length - 1].productIndex + 1
      }
    }
  },
  watch: {
    productData: {
      handler() {
        this.isLoading = true
        this.$nextTick(function() {
          this.getProductData()
          this.filterDataHandle(this.page, this.limitNum)
        })
      },
      deep: true
    },
    isCheckedAll: function() {
      this.checkedSelectionOptionHandle(this.hasSelectText)
    }
  },
  methods: {
    getProductData() {
      let newData = []
      //在database裡面的user集合裡的id
      //id裡面的集合product
      db.firestore()
        .collection('user')
        .doc(this.userID)
        .collection('product')
        .orderBy('productIndex', 'asc')
        .get()
        .then(querySnapshot => {
          if (querySnapshot.docs.length === 0) {
            this.isLoading = false
          } else {
            querySnapshot.forEach(doc => {
              let data = {
                id: doc.id,
                productIndex: doc.data().productIndex,
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
              newData.push(data)
              if (this.productData.length < querySnapshot.docs.length) {
                if (!this.productData.length) {
                  this.productData = newData
                } else {
                  this.productData.forEach(el => {
                    if (el === data) {
                      return
                    } else {
                      this.productData = newData
                    }
                  })
                }
              }
              this.isLoading = false
            })
          }
        })
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
            let maxWidth = 800,
              maxHeight = 800,
              targetWidth = imgWidth,
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
    dragImgHandle(e) {
      this.isDragZone = false
      var files = e.dataTransfer.files
      Array.prototype.forEach.call(files, this.readURL)
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
    resetForm() {
      this.formData.productName = ''
      this.formData.discription = ''
      this.formData.price.original = ''
      this.formData.price.discount = ''
      this.formData.specification = []
      this.formData.img = []
      this.imgList = []
      this.addNewSpecification()
    },
    submitData(isPublished) {
      let vm = this
      isPublished === 'published'
        ? (vm.formData.status = true)
        : (vm.formData.status = false)
      if (
        !vm.formData.img.length &&
        vm.formData.productName === '' &&
        vm.formData.discription === '' &&
        vm.formData.price.original === '' &&
        vm.formData.price.discount === '' &&
        vm.formData.specification[0].hasConfirm === null &&
        vm.formData.specification[0].style === null
      ) {
        alert('請填寫完畢再送出！！！')
      } else {
        let newProduct = {
          id: '',
          imgList: [],
          productName: vm.formData.productName,
          discription: vm.formData.discription,
          productIndex: vm.productIndex,
          price: {
            original: vm.formData.price.original,
            discount: vm.formData.price.discount
          },
          specification: vm.formData.specification,
          status: vm.formData.status
        }
        let id
        db.firestore()
          .collection('user')
          .doc(this.userID)
          .collection('product')
          .add(newProduct)
          .then(data => {
            vm.isLoading = true
            id = data.id
            return id
          })
          .then(id => {
            let storage = db.storage()
            vm.imgList.forEach(img => {
              storage
                .ref('user/' + this.userID + '/' + 'product/' + id)
                .child(img.name)
                .putString(img.src, 'data_url')
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
                        vm.formData.img.push(newImgInfo)
                      }
                      if (vm.formData.img.length === vm.imgList.length) {
                        db.firestore()
                          .collection('user')
                          .doc(this.userID)
                          .collection('product')
                          .doc(id)
                          .update({
                            id: id,
                            imgList: vm.formData.img
                          })
                          .then(() => {
                            newProduct.id = id
                            newProduct.imgList = vm.formData.img
                            this.productData.push(newProduct)
                            vm.isLoading = false
                            vm.modalDisplay = false
                            vm.resetForm()
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
      }
    },
    deleteProduct(data) {
      console.log(data.id)
      let dataIndex = this.productData.indexOf(data)
      this.productData.splice(dataIndex, 1)
    },

    getHasCheckedData(status, data) {
      let arrIndex = this.hasCheckedDataArray.indexOf(data)
      status
        ? this.hasCheckedDataArray.push(data)
        : this.hasCheckedDataArray.splice(arrIndex, 1)
    },
    checkedSelectionOptionHandle(val) {
      switch (val) {
        case 'all':
          this.isCheckedAll === true
            ? (this.hasSelectText = 'not checked all')
            : (this.hasSelectText = 'checked all')
          break
        case 'select all':
          this.isCheckedAll = true
          this.hasSelectText = 'select all'
          break
        case 'unselect all':
          this.isCheckedAll = false
          this.hasSelectText = 'unselect all'
          break
        case 'published':
          this.isCheckedAll = false
          this.hasSelectText = 'published'
          break
        case 'unpublished':
          this.isCheckedAll = false
          this.hasSelectText = 'unpublished'
          break
        default:
          break
      }
    },
    changeHasCheckedDataStatus(val) {
      let vm = this
      vm.isLoading = true
      let reset = () => {
        vm.hasSelectText = ''
        vm.hasCheckedDataArray = []
        vm.isCheckedAll = false
      }
      this.hasCheckedDataArray.forEach(data => {
        if (val === 'published') {
          let index = vm.productData.indexOf(data)
          db.firestore()
            .collection('user')
            .doc(this.userID)
            .collection('product')
            .doc(data.id)
            .update({
              status: true
            })
            .then(() => {
              vm.productData[index].status = true
              vm.isLoading = false
              reset()
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          let index = vm.productData.indexOf(data)
          db.firestore()
            .collection('user')
            .doc(this.userID)
            .collection('product')
            .doc(data.id)
            .update({
              status: false
            })
            .then(() => {
              vm.productData[index].status = false
              vm.isLoading = false
              reset()
            })
            .catch(error => {
              console.log(error)
            })
        }
      })
    },
    filterDataHandle(page, limitNum) {
      this.page = page
      this.limitNum = limitNum
      let newData = [],
        totalData = 5
      page * limitNum > this.productData.length
        ? (totalData = this.productData.length)
        : (totalData = page * limitNum)
      for (let i = (page - 1) * limitNum; i < totalData; i++) {
        newData.push(this.productData[i])
      }
      this.filterData = newData
      return newData
    }
  },
  mounted() {
    this.isLoading = true
    this.getProductData()
    this.addNewSpecification()
  }
}
</script>
