<template>
  <tr v-if="product" :class="{tealGray:trRowColor}">
    <td class="table_checkbox">
      <input type="checkbox" :class="{checked:hasCheck}">
      <label @click="hasCheck = !hasCheck"></label>
    </td>

    <td class="product">
      <img :src="srcHandle">
      <span>{{product.productName}}</span>
    </td>
    <td class="original">{{product.price.original}}</td>
    <td class="discount">{{product.price.discount}}</td>
    <td class="information">
      <ul>
        <li v-for="item in product.specification" :key="item.index">
          <div class="style">
            <p>{{item.style}}</p>
          </div>
          <div class="style_info">
            <div class="give_them_group" v-for="styles in item.styleInfo" :key="styles.size">
              <p class="size">{{styles.size}}</p>
              <p class="inventory">{{styles.inventory}}</p>
            </div>
          </div>
        </li>
      </ul>
    </td>
    <td class="status">
      <button
        @click="statusBtnDisplay = !statusBtnDisplay"
        @blur="statusBtnDisplay=false"
        class="status_Btn"
        value="UNPUBLISHED"
        :class="{published_status:statusValue==='PUBLISHED',unpublished_status:statusValue==='UNPUBLISHED'}"
      >
        {{statusValue}}
        <span class="triangle_bottom"></span>
        <ul class="status_option" v-show="statusBtnDisplay">
          <a href.prevent @click="changeBtnStatus('Published')">
            <li>Published</li>
          </a>
          <a href.prevent @click="changeBtnStatus('Unpublished')">
            <li>Unpublished</li>
          </a>
          <a href.prevent @click="editData" class="edit">
            <li>Edit</li>
          </a>
          <a href.prevent @click="deleteData" class="delete">
            <li>Delete</li>
          </a>
        </ul>
      </button>
    </td>
  </tr>
</template>
<script>
import db from '@/firebaseInit.js'

export default {
  name: 'productTable',
  props: ['getData', 'getFilterProduct', 'getHasSelectText', 'getUserId'],
  data() {
    return {
      hasCheck: false,
      trRowColor: false,
      statusBtnDisplay: false
    }
  },
  computed: {
    product() {
      return this.getData
    },
    allProduct() {
      return this.getFilterProduct
    },
    statusValue() {
      if (this.product.status) {
        return 'PUBLISHED'
      }
      return 'UNPUBLISHED'
    },
    hasCheckText() {
      return this.getHasSelectText
    },
    userID() {
      return this.getUserId
    },
    srcHandle() {
      if (!this.product.imgList.length) {
        return ''
      } else {
        return this.product.imgList[0].src
      }
    }
  },
  watch: {
    allProduct() {
      if ((this.allProduct.indexOf(this.product) + 1) % 2 === 0) {
        this.trRowColor = true
      }
    },
    hasCheckText(val) {
      switch (val) {
        case 'checked all':
          this.hasCheck = true
          break
        case 'not checked all':
          this.hasCheck = false
          break
        case 'select all':
          this.hasCheck = true
          break
        case 'unselect all':
          this.hasCheck = false
          break
        case 'published':
          this.product.status === true
            ? (this.hasCheck = true)
            : (this.hasCheck = false)
          break
        case 'unpublished':
          this.product.status === false
            ? (this.hasCheck = true)
            : (this.hasCheck = false)

          break
        default:
          break
      }
    },
    hasCheck() {
      this.$emit('getHasCheckedData', this.hasCheck, this.product)
    },
    'getData.imgList': {
      handler() {
        if (!this.getData.imgList.length) {
          return ''
        } else {
          return this.getData.imgList[0].src
        }
      }
    }
  },
  methods: {
    deleteData() {
      let confirmMsg = confirm(`確認刪除${this.product.productName}嗎？`)
      if (confirmMsg) {
        this.product.imgList.forEach(img => {
          db.storage()
            .ref(`user/${this.userID}/` + `product/${this.product.id}`)
            .child(img.name)
            .delete()
            .then(() => {
              console.log('Files successfully deleted!')
            })
            .catch(error => {})
        })
        db.firestore()
          .collection('user')
          .doc(this.userID)
          .collection('product')
          .doc(this.product.id)
          .delete()
          .then(() => {
            console.log('Document successfully deleted!')
          })
          .catch(error => {
            console.error('Error removing document: ', error)
          })
        this.$emit('deleteData', this.product)
      } else {
        return false
      }
    },
    editData() {
      this.$emit('editData', this.product)
    },
    changeBtnStatus(val) {
      const vm = this
      let newStatus = true
      val === 'Published' ? (newStatus = true) : (newStatus = false)
      db.firestore()
        .collection('user')
        .doc(this.userID)
        .collection('product')
        .doc(vm.product.id)
        .update({
          status: newStatus
        })
        .then(() => {
          vm.getData.status = newStatus
        })
        .catch(error => {
          console.error('Error updating document: ', error)
        })
    }
  },
  mounted() {
    this.$nextTick(function() {
      if ((this.allProduct.indexOf(this.product) + 1) % 2 === 0) {
        this.trRowColor = true
      }
    })
  }
}
</script>
