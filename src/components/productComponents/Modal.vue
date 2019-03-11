<template>
  <div class="modal">
    <div class="modal_head">
      <h3 class="modal_title" v-text="modalTitle"></h3>
      <label for="close_reset" class="close_btn"></label>
    </div>
    <div class="modal_content">
      <LoadingPage style="position:absolute;left:0%;z-index:99" v-if="isLoading"></LoadingPage>
      <form
        v-on:submit.stop.prevent
        action="javascript:;"
        enctype="multipart/form-data"
        id="form"
        method="post"
      >
        <div class="add_image">
          <input
            @change.stop="addImg"
            type="file"
            name="src[]"
            id="addImage"
            accept="image/*"
            multiple
          >
          <label
            for="addImage"
            @dragover.prevent.stop="isDragZone = true"
            @drop.prevent.stop="dragImgHandle"
            :class="{dragZone:isDragZone}"
            @dragleave.prevent.stop="isDragZone=false"
          >
            <font-awesome-icon class="upload_icon" :icon="['fas', 'cloud-upload-alt']"/>Drag an image or click here to upload…
          </label>
          <div class="image_previews">
            <PreviewBox
              :get-image="items"
              :get-index="index"
              v-for="(items,index) in imgList"
              :key="items.name+index"
              v-on:remove="removeImg"
            ></PreviewBox>
          </div>
        </div>
        <div class="add_information">
          <label for="product_name">Product Discription</label>
          <input
            type="text"
            name="productName"
            id="product_name"
            placeholder="Product Name"
            required="required"
            v-model.trim="formData.productName"
          >
          <textarea
            name
            id
            cols="30"
            rows="10"
            placeholder="Discription"
            v-model.trim="formData.discription"
          ></textarea>
          <label for>Price</label>
          <div class="info_price">
            <label for="original">
              <span>Original</span>
              <input
                type="number"
                min="0"
                name="original"
                v-model.trim="formData.price.original"
                required="required"
              >
            </label>
            <label for="discount">
              <span>Discount</span>
              <input
                type="number"
                name="discount"
                v-model.trim="formData.price.discount"
                min="0"
                required="required"
              >
            </label>
          </div>
          <label for>Specification</label>
          <ul class="specification_info" v-if="formData.specification">
            <Specification
              v-for="(items,index) in formData.specification"
              @delete="removeSpecification"
              @confirm="determineSpecification"
              :get-index="index"
              :get-new-id="getNewId"
              :key="items.id +index"
              :getEditData="items"
            ></Specification>
          </ul>
          <button type="button" class="add_new_btn" @click="addNewSpecification">
            ADD
            NEW SPECIFICATION
            <img src="@/assets/img/ic_add.svg">
          </button>
          <input type="reset" id="close_reset" value @click="closeModal">
          <div class="submit_btn">
            <a
              href="javascript:;"
              @click.stop="submitData('unpublished')"
              id="save_draft"
            >UNPUBLISHED</a>
            <button type="button" @click.stop="submitData('published')">PUBLISH</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import db from '../../firebaseInit.js'
import Specification from './Specification'
import PreviewBox from './PreviewBox'
import LoadingPage from '../extendComponents/LoadingPage'
export default {
  name: 'modal',
  components: {
    Specification,
    LoadingPage,
    PreviewBox
  },
  props: ['getEditData', 'getAllData', 'title', 'getEditDataId'],
  data() {
    return {
      isLoading: false,
      modalIsShow: false,
      isDragZone: false,
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
      },
      editData: ''
    }
  },
  computed: {
    getNewId() {
      return this.specificationCount
    },
    modalTitle() {
      return this.title
    },
    newData() {
      if (!this.getEditData.productName.length) {
        return (this.editData = this.getEditData)
      } else {
        return (this.editData = this.getEditData)
      }
    },
    productData() {
      return this.getAllData
    },
    productIndex() {
      const vm = this
      if (!vm.productData.length) {
        return 0
      }
      return vm.productData[vm.productData.length - 1].productIndex + 1
    },
    userID() {
      return db.auth().currentUser.uid
    },
    editDataId() {
      return this.getEditDataId
    }
  },
  watch: {
    newData: {
      handler() {
        if (this.title === 'EDIT PRODUCT') {
          this.imgList = this.editData.img
          this.formData.productName = this.editData.productName
          this.formData.discription = this.editData.discription
          this.formData.price.original = this.editData.price.original
          this.formData.price.discount = this.editData.price.discount
          this.formData.specification = this.editData.specification
          this.formData.status = this.editData.status
          this.specificationCount = this.editData.specification.length
        }
      },
      deep: true
    },
    formData: {
      handler: function() {
        if (!this.formData.specification.length) {
          this.addNewSpecification()
        }
      },
      deep: true
    }
  },
  methods: {
    closeModal() {
      this.modalIsShow = false
      this.$emit('cancelEdit')
      this.resetForm()
      this.$emit('modalDisplayStatus', this.modalIsShow)
    },
    addImg(e) {
      // 參考https://runkids.github.io/vue/2017123101/
      const vm = this
      const files = e.target.files
      Array.prototype.forEach.call(files, this.readURL)
    },
    readURL(files) {
      const vm = this
      if (!window.FileReader) {
        alert('您的設備不支援圖片預覽功能，如需此功能，請升級瀏覽器')
      } else {
        const reader = new FileReader()
        reader.onload = function(evt) {
          const img = new Image()
          const baseUrl = evt.target.result.replace(/\r\n|\n/g, '')
          img.src = baseUrl
          const name = files.name
          // 壓縮圖片
          img.onload = function() {
            // 參考資料https://www.cnblogs.com/moqiutao/p/8657926.html
            // https://www.zhangxinxu.com/wordpress/2017/07/html5-canvas-image-compress-upload/
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const imgWidth = img.width
            const imgHeight = img.height
            const maxWidth = 800

            const maxHeight = 800

            let targetWidth = imgWidth

            let targetHeight = imgHeight
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
            const newBaseUrl = canvas.toDataURL(files.type, 1.0)
            const src = newBaseUrl.replace(/\r\n|\n/g, '')
            const newImg = {
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
      const files = e.dataTransfer.files
      Array.prototype.forEach.call(files, this.readURL)
    },
    removeImg(newIndex) {
      this.imgList.splice(newIndex, 1)
    },
    removeSpecification(data) {
      const index = this.formData.specification.indexOf(data)
      this.formData.specification.splice(index, 1)
      this.$forceUpdate()
    },
    determineSpecification(data) {
      const newIndex = data.index
      const arr = this.formData.specification
      if (!data.style.length && !data.inventory.length) {
        alert('請輸入樣式跟庫存')
      } else if (this.formData.specification.length <= 1) {
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
    },
    addNewSpecification() {
      if (this.formData.specification.length > 0) {
        this.specificationCount++
      } else {
        this.specificationCount = 0
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
      this.specificationCount = 0
      this.imgList = []
      this.addNewSpecification()
    },
    addNewProductHandle() {
      const vm = this
      const newProduct = {
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
          const storage = db.storage()
          vm.imgList.forEach(img => {
            storage
              .ref(`user/${this.userID}/` + `product/${id}`)
              .child(img.name)
              .putString(img.src, 'data_url')
              .then(fileData => {
                storage
                  .ref(fileData.metadata.fullPath)
                  .getDownloadURL()
                  .then(url => {
                    const newImgInfo = {
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
                          id,
                          imgList: vm.formData.img
                        })
                        .then(() => {
                          newProduct.id = id
                          newProduct.imgList = vm.formData.img
                          vm.productData.push(newProduct)
                          vm.isLoading = false
                          vm.modalIsShow = false
                          vm.resetForm()
                          vm.$emit('modalDisplayStatus', this.modalIsShow)
                        })
                    }
                  })
              })
              .catch(error => {
                console.error('Error adding document: ', error)
              })
          })
        })
        .catch(error => {
          console.error('Error adding document: ', error)
        })
    },
    editProductHandle() {},
    submitData(isPublished) {
      const vm = this
      isPublished === 'published'
        ? (vm.formData.status = true)
        : (vm.formData.status = false)
      if (
        !this.imgList.length ||
        this.formData.productName === '' ||
        !this.formData.discription.length ||
        this.formData.price.original === '' ||
        this.formData.price.discount === '' ||
        this.formData.specification[0].hasConfirm === null ||
        this.formData.specification[0].style === null
      ) {
        alert('請填寫完畢再送出！！！')
      } else {
        if (this.title === 'ADD NEW PRODUCT') this.addNewProductHandle()
      }
    }
  },
  mounted() {
    this.addNewSpecification()
  }
}
</script>