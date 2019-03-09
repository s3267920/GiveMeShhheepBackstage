<template>
  <span v-if="hasChecked.length" id="check_option_icon" @click="isShow = !isShow">
    <div :class="tooltipStyle">Change Status</div>
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
    tooltipStyle() {
      if (this.isShow) {
        return 'tooltip_right'
      }
      return 'tooltip'
    },
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
    changeStatus(val) {
      this.isShow = false
      this.$emit('changeHasCheckedDataStatus', val)
    }
  }
}
</script>
