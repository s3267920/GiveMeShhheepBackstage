<template>
  <span v-if="hasChecked.length" id="check_option_icon" @click="toggleIsShow">
    <div :class="{tooltip_right:isShow,tooltip:!isShow}">Change Status</div>
    <transition name="fade" mode="in-out">
      <ul v-if="isShow" id="status_change" class="status_change">
        <li>
          <a
            href="javascript:;"
            class="paid"
            :class="{has_check:hasSelect === 'Paid'}"
            @click="changeStatus('paid')"
          >Paid</a>
        </li>
        <li>
          <a
            href="javascript:;"
            class="unpaid"
            :class="{has_check:hasSelect === 'Unpaid'}"
            @click="changeStatus('unpaid')"
          >Unpaid</a>
        </li>
        <li>
          <a
            href="javascript:;"
            class="shipping"
            :class="{has_check:hasSelect === 'Shipping'}"
            @click="changeStatus('shipping')"
          >Shipping</a>
        </li>
        <li>
          <a
            href="javascript:;"
            class="done"
            :class="{has_check:hasSelect === 'Done'}"
            @click="changeStatus('done')"
          >Done</a>
        </li>
      </ul>
    </transition>
  </span>
</template>
<script>
export default {
  name: 'changeStatusSelection',
  props: ['hasCheckedData'],
  data() {
    return {
      isShow: false,
      hasSelect: false
    }
  },
  computed: {
    hasChecked() {
      return this.hasCheckedData
    }
  },
  methods: {
    toggleIsShow() {
      this.isShow = !this.isShow
    },
    changeStatus(val) {
      this.isShow = false
      this.$emit('changeHasCheckedDataStatus', val)
    }
  }
}
</script>