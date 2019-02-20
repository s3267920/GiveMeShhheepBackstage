<template>
  <tr v-if="product" :class="{tealGray:trRowColor}">
    <td class="table_checkbox">
      <input type="checkbox">
      <label></label>
    </td>

    <td class="product">
      <img :src="product.imgList[0].src">
      <span>{{product.productName}}</span>
    </td>
    <td class="original">{{product.price.original}}</td>
    <td class="discount">{{product.price.discount}}</td>
    <td class="information">
      <ul>
        <li v-for="item in product.specification" :key="item.id">
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
      <button class="status_Btn" value="UNPUBLISHED">
        UNPUBLISHED
        <span class="triangle_bottom"></span>
        <ul class="status_option">
          <a href="javascript:;" class="Published">
            <li>Published</li>
          </a>
          <a href="javascript:;" class="Unpublished">
            <li>Unpublished</li>
          </a>
          <a href="javascript:;" class="delete">
            <li>Delete</li>
          </a>
        </ul>
      </button>
    </td>
  </tr>
</template>
<script>
export default {
  name: 'productTable',
  props: ['getData', 'getAllProduct'],
  data() {
    return {
      product: this.getData,
      allProduct: this.getAllProduct,
      trRowColor: false
    }
  },
  computed: {},
  mounted() {
    this.$nextTick(function() {
      if ((this.allProduct.indexOf(this.product) + 1) % 2 === 0) {
        this.trRowColor = true
      }
    })
  }
}
</script>