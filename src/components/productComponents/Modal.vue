<template>
  <div class="modal">
    <div class="modal_head">
      <h3 class="modal_title" v-text="modalTitle"></h3>
      <label for="close_reset" class="close_btn"></label>
    </div>
    <div class="modal_content">
      <LoadingPage style="position:absolute;left:0%;z-index:99" v-if="isLoading"></LoadingPage>
      <div class="progress_bar" v-if="isLoading" v-text="progress+' %'"></div>
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
              v-for="(items,index) in imgListHandle"
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
            rows="8"
            placeholder="Discription"
            v-model.trim="formData.discription"
          ></textarea>
          <div class="info_tag_and_series">
            <label for="product_tag">
              <span>Tag</span>
              <select type="text" id="product_tag" v-model="formData.tag">
                <option value disabled>請選擇</option>
                <option value="本日精選">本日精選</option>
                <option value="人氣推薦">人氣推薦</option>
                <option value="新品上市">新品上市</option>
                <option value="其他">其他</option>
              </select>
            </label>
            <label for="product_series">
              <span>Series</span>
              <input type="text" id="product_series" v-model.trim="formData.series">
            </label>
          </div>
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
import { Promise, reject, resolve, async } from 'q'
export default {
  name: 'modal',
  components: {
    Specification,
    LoadingPage,
    PreviewBox
  },
  props: ['getEditData', 'getAllData', 'title'],
  data() {
    return {
      isLoading: false,
      progress: 0,
      modalIsShow: false,
      isDragZone: false,
      imgList: [],
      specificationCount: 0,
      formData: {
        id: '',
        tag: '',
        series: '',
        img: [],
        productName: '',
        discription: '',
        price: {
          original: '',
          discount: ''
        },
        specification: [],
        status: true,
        productIndex: ''
      },
      editData: '',
      editImgList: [],
      originalSpecification: []
    }
  },
  computed: {
    getNewId() {
      return this.specificationCount
    },
    modalTitle() {
      return this.title
    },
    takeEditData() {
      if (!this.getEditData.productName.length) {
        return (this.editData = this.getEditData)
      } else {
        return (this.editData = this.getEditData)
      }
    },
    productData() {
      return this.getAllData
    },
    newProductIndex() {
      const vm = this
      if (!vm.productData.length) {
        return 0
      }
      return vm.productData[vm.productData.length - 1].productIndex + 1
    },
    userID() {
      return db.auth().currentUser.uid
    },
    imgListHandle() {
      if (this.title === 'EDIT PRODUCT') {
        return this.editImgList
      } else {
        return this.imgList
      }
    }
  },
  watch: {
    'formData.specification': {
      handler: function() {
        if (!this.formData.specification.length) {
          this.addNewSpecification()
        }
      }
    },
    takeEditData() {
      this.editDataHandle()
    }
  },
  methods: {
    editDataHandle() {
      try {
        if (this.title === 'EDIT PRODUCT') {
          let dataIndex = this.getEditDataIndex()
          this.formData = {
            id: this.editData.id,
            img: [],
            tag: this.editData.tag,
            series: this.editData.series,
            productName: this.editData.productName,
            discription: this.editData.discription,
            price: {
              original: this.editData.price.original,
              discount: this.editData.price.discount
            },
            specification: this.editData.specification,
            status: this.editData.status,
            productIndex: this.editData.productIndex
          }
          this.originalSpecification = this.editData.specification.slice(0)
          this.specificationCount = this.editData.specification.length
          if (!this.editImgList.length) {
            this.editData.img.forEach(data => {
              this.imgList.push(data)
              this.editImgList.push(data)
            })
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    getEditDataIndex() {
      let dataIndex
      this.productData.forEach((data, index, arr) => {
        if (data.id === this.editData.id) {
          dataIndex = arr.indexOf(data)
        }
      })
      return dataIndex
    },
    closeModal() {
      this.modalIsShow = false
      if (this.title === 'EDIT PRODUCT') {
        let dataIndex = this.getEditDataIndex()
        this.productData[dataIndex].imgList = this.imgList
        this.productData[dataIndex].specification = this.originalSpecification
        this.editImgList = []
        this.$emit('cancelEdit')
      }
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
            vm.title === 'EDIT PRODUCT'
              ? vm.editImgList.push(newImg)
              : vm.imgList.push(newImg)
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
      this.title === 'EDIT PRODUCT'
        ? this.editImgList.splice(newIndex, 1)
        : this.imgList.splice(newIndex, 1)
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
      this.formData = {
        id: '',
        img: [],
        tag: '',
        series: '',
        productName: '',
        discription: '',
        price: {
          original: '',
          discount: ''
        },
        specification: [],
        status: true,
        productIndex: ''
      }
      this.specificationCount = 0
      this.imgList = []
      this.addNewSpecification()
    },
    addNewProductHandle() {
      const vm = this
      let newProduct = {
        id: '',
        imgList: [],
        tag: vm.formData.tag,
        series: vm.formData.series,
        productName: vm.formData.productName,
        discription: vm.formData.discription,
        productIndex: vm.newProductIndex,
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
          vm.progress = 50
          const storage = db.storage()
          vm.imgList.forEach(img => {
            storage
              .ref(`user/${this.userID}/` + `product/${id}`)
              .child(img.name)
              .putString(img.src, 'data_url')
              .then(fileData => {
                vm.progress = 75
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
                          vm.progress = 100
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
    editProductHandle() {
      const vm = this
      let haseditedProduct = {
        id: vm.formData.id,
        imgList: [],
        tag: vm.formData.tag,
        series: vm.formData.series,
        productName: vm.formData.productName,
        discription: vm.formData.discription,
        productIndex: vm.formData.productIndex,
        price: {
          original: vm.formData.price.original,
          discount: vm.formData.price.discount
        },
        specification: vm.formData.specification,
        status: vm.formData.status
      }
      let dataIndex = this.getEditDataIndex()
      //retainImgList 還保留的檔案
      //deleteImgList 要刪除的檔案
      let retainImgList = [],
        deleteImgList = [],
        newImgList = []
      vm.editImgList.forEach(newImgData => {
        let originalImgList = vm.imgList.filter(oldImgData => {
          if (oldImgData === newImgData) retainImgList.push(oldImgData)
        })
      })
      if (retainImgList.length) {
        if (vm.imgList.length !== retainImgList.length) {
          retainImgList.forEach(img => {
            deleteImgList = vm.imgList.filter(deleteData => {
              return deleteData !== img
            })
            newImgList = vm.editImgList.filter(newImg => {
              return newImg !== img
            })
          })
        } else {
          newImgList = vm.editImgList.slice(retainImgList.length)
        }
      }
      //delete storage
      //如果imgList 跟 editImgList內的照片都不同的話就刪除imgList
      //如果部分一樣的話，先檢查imgList內是否有一樣的就略過，其他刪除
      //如果有一樣的話就直接略過delete到下一個步驟
      //deleteImgList 有值代表部分為原檔案 => 刪除部分
      //retainImgList 為空代表已無原檔案 => 刪除全部
      //deleteImgList 為空且retainImgList 有值代表沒更動 => 直接進入下一步
      return new Promise((resolve, reject) => {
        if (deleteImgList.length) {
          return new Promise((resolve, reject) => {
            deleteImgList.forEach(del => {
              db.storage()
                .ref(`user/${vm.userID}/` + `product/${vm.formData.id}`)
                .child(del.name)
                .delete()
                .then(() => {
                  resolve('finished deleted')
                })
                .catch(error => {
                  reject(error)
                  console.log(error)
                })
            })
          }).then(() => {
            retainImgList.forEach(img => {
              vm.formData.img.push(img)
            })
            resolve('some img have deleted')
          })
        } else if (!retainImgList.length) {
          return new Promise((resolve, reject) => {
            vm.imgList.forEach(del => {
              db.storage()
                .ref(`user/${vm.userID}/` + `product/${vm.formData.id}`)
                .child(del.name)
                .delete()
                .then(() => {
                  resolve('delete')
                })
                .catch(error => {
                  reject(error)
                  console.log(error)
                })
            })
          }).then(() => {
            resolve('delete all')
          })
        } else {
          retainImgList.forEach(img => {
            vm.formData.img.push(img)
          })
          resolve('ignore')
        }
      })
        .then(status => {
          vm.progress = 50
          const storage = db.storage()
          if (status === 'some img have deleted' || status === 'delete all') {
            return new Promise((resolve, reject) => {
              newImgList.forEach(img => {
                storage
                  .ref(`user/${vm.userID}/` + `product/${vm.formData.id}`)
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
                        if (vm.formData.img.length === vm.editImgList.length) {
                          resolve('update image')
                        }
                      })
                  })
                  .catch(error => {
                    console.error('Error adding document: ', error)
                  })
              })
            })
          } else if (status === 'ignore') {
            return new Promise((resolve, reject) => {
              if (newImgList.length) {
                newImgList.forEach(img => {
                  storage
                    .ref(`user/${vm.userID}/` + `product/${vm.formData.id}`)
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
                          if (
                            vm.formData.img.length === vm.editImgList.length
                          ) {
                            resolve('update new image')
                          }
                        })
                    })
                    .catch(error => {
                      console.error('Error adding document: ', error)
                      reject(error)
                    })
                })
              } else {
                vm.formData.img = vm.imgList
                resolve('no imgage updated')
              }
            })
          }
        })
        .then(success => {
          vm.progress = 75
          return new Promise((resolve, reject) => {
            db.firestore()
              .collection('user')
              .doc(vm.userID)
              .collection('product')
              .doc(vm.formData.id)
              .update({
                id: vm.formData.id,
                imgList: vm.formData.img,
                tag: vm.formData.tag,
                series: vm.formData.series,
                productName: vm.formData.productName,
                discription: vm.formData.discription,
                productIndex: vm.formData.productIndex,
                price: {
                  original: vm.formData.price.original,
                  discount: vm.formData.price.discount
                },
                specification: vm.formData.specification,
                status: vm.formData.status
              })
              .then(() => {
                haseditedProduct.imgList = vm.formData.img
                vm.productData.splice(dataIndex, 1, haseditedProduct)
                vm.isLoading = false
                vm.modalIsShow = false
                vm.editImgList = []
                vm.resetForm()
                vm.$emit('modalDisplayStatus', vm.modalIsShow)
                resolve('edit')
                vm.progress = 100
              })
              .catch(error => {
                console.log(error)
              })
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
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
        this.formData.tag === '' ||
        this.formData.specification[0].hasConfirm === null ||
        this.formData.specification[0].style === null
      ) {
        alert('請填寫完畢再送出！！！')
        return
      } else {
        if (this.title === 'ADD NEW PRODUCT') {
          this.isLoading = true
          this.addNewProductHandle()
        } else {
          this.isLoading = true
          this.editProductHandle()
        }
      }
    }
  },
  mounted() {
    this.addNewSpecification()
  }
}
</script>