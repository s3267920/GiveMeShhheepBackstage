<style lang="scss" src="@/scss/layout.scss"></style>
<style lang="scss" src="@/scss/product.scss"></style>

<template src="./product.html"></template>

<script>
import ProductTable from './ProductTable'
import LoadingPage from '../extendComponents/LoadingPage'
import ChangeStatusSelection from '../extendComponents/ChangeStatusSelection'
import Pagination from '../extendComponents/Pagination'
import Modal from './Modal'
import Footers from '../extendComponents/Footers'
import db from '@/firebaseInit.js'

export default {
  name: 'product',
  components: {
    ChangeStatusSelection,
    ProductTable,
    LoadingPage,
    Pagination,
    Modal,
    Footers
  },
  data() {
    return {
      modalDisplay: false,
      modalTitleText: 'ADD NEW PRODUCT',
      isCheckedAll: false,
      allSelectionOption: ['published', 'unpublished'],
      hasSelectText: '',
      hasCheckedDataArray: [],
      imgList: [],
      filterData: [],
      productData: [],
      formData: {
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
      },
      editData: {
        id: '',
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
      isLoading: false,
      selectionOptionDisplay: false,
      page: null,
      limitNum: null
    }
  },
  computed: {
    productTableData() {
      if (!this.filterData.length) {
        return this.filterDataHandle(1, 5)
      }
      this.hasCheckedData = []
      this.hasSelectText = ''
      this.selectionOptionDisplay = false
      this.isCheckedAll = false
      return this.filterData
    },
    userID() {
      return db.auth().currentUser.uid
    },
    productIndex() {
      const vm = this
      if (!vm.productData.length) {
        return 0
      }
      return vm.productData[vm.productData.length - 1].productIndex + 1
    }
  },
  watch: {
    productData: {
      handler() {
        if (!this.productData.length) {
          this.isLoading = true
        }
        // this.isLoading = true
        this.getProductData()
        this.filterDataHandle(this.page, this.limitNum)
      },
      deep: true,
      immediate: true
    },
    isCheckedAll() {
      this.checkedSelectionOptionHandle(this.hasSelectText)
    }
  },
  methods: {
    getProductData() {
      const newData = []
      // 在database裡面的user集合裡的id
      // id裡面的集合product
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
              const data = {
                id: doc.id,
                productIndex: doc.data().productIndex,
                imgList: doc.data().imgList,
                series: doc.data().series,
                productName: doc.data().productName,
                discription: doc.data().discription,
                tag: doc.data().tag,
                price: {
                  original: doc.data().price.original,
                  discount: doc.data().price.discount
                },
                specification: doc.data().specification,
                status: doc.data().status,
                productIndex: doc.data().productIndex
              }
              newData.push(data)
              if (this.productData.length < querySnapshot.docs.length) {
                if (!this.productData.length) {
                  this.productData = newData
                } else {
                  this.productData.forEach(el => {
                    if (el === data) {
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
    modalDisplayStatusHandle(status) {
      return (this.modalDisplay = status)
    },
    deleteProduct(data) {
      let dataIndex = this.productData.indexOf(data)
      this.productData.splice(dataIndex, 1)
    },
    cancelEditProduct() {
      this.editData = {
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
    },
    editProduct(data) {
      this.editData = {
        id: data.id,
        img: data.imgList,
        tag: data.tag,
        series: data.series,
        productName: data.productName,
        discription: data.discription,
        price: {
          original: data.price.original,
          discount: data.price.discount
        },
        specification: data.specification,
        status: data.status,
        productIndex: data.productIndex
      }
      this.modalTitleText = 'EDIT PRODUCT'
      this.modalDisplay = true
    },
    getHasCheckedData(status, data) {
      const arrIndex = this.hasCheckedDataArray.indexOf(data)
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
      const vm = this
      vm.isLoading = true
      const reset = () => {
        vm.hasSelectText = ''
        vm.hasCheckedDataArray = []
        vm.isCheckedAll = false
      }
      this.hasCheckedDataArray.forEach(data => {
        if (val === 'published') {
          const index = vm.productData.indexOf(data)
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
          const index = vm.productData.indexOf(data)
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
      const newData = []

      let totalData = 5
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
    this.$nextTick(() => {
      const vm = this
      document.addEventListener('click', e => {
        if (e.target && e.target.id !== 'check_more_option') {
          vm.selectionOptionDisplay = false
        }
      })
    })
  }
}
</script>
