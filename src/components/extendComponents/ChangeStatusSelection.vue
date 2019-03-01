<template>
  <span v-if="hasChecked.length" id="check_option_icon" @click="toggleIsShow">
    <div :class="{tooltip_right:isShow,tooltip:!isShow}">Change Status</div>
    <transition name="fade" mode="in-out">
      <ul v-if="isShow" id="status_change" class="status_change">
        <li v-for="data in allSelectionOption" :key="data">
          <a
            href.prevent
            :class="{has_check:hasSelect === data}"
            @click="changeStatus(data)"
            v-text="data"
          ></a>
        </li>
      </ul>
    </transition>
  </span>
</template>
<script>
export default {
  name: 'changeStatusSelection',
  props: ['hasCheckedData', 'getAllSelectionOption'],
  data() {
    return {
      isShow: false,
      hasSelect: false
    }
  },
  computed: {
    hasChecked() {
      if (!this.hasCheckedData.length) {
        this.isShow = false
      }
      return this.hasCheckedData
    },
    allSelectionOption() {
      return this.getAllSelectionOption
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