<template>
  <li>
    <label :for="`style${newIndex}`">
      <span>Style</span>
      <input
        :class="{has_determine:specificationInfo.hasConfirm}"
        :disabled="specificationInfo.hasConfirm"
        v-model.trim="specificationInfo.style"
        :key="`style${newIndex}`"
        type="text"
        required="required"
        name="style"
        :id="`style${newIndex}`"
      >
    </label>
    <label :for="`inventory${newIndex}`">
      <span>Inventory</span>
      <input
        :key="`inventory${newIndex}`"
        :class="{has_determine:specificationInfo.hasConfirm}"
        :disabled="specificationInfo.hasConfirm"
        v-model.trim="specificationInfo.inventory"
        type="number"
        min="0"
        required="required"
        name="inventory"
        :id="`inventory${newIndex}`"
        class="inventory"
      >
    </label>
    <span>
      <font-awesome-icon
        class="specification_check"
        :icon="['fas','check']"
        size="lg"
        @click="determineSpecificationIcon"
        fixed-width
      ></font-awesome-icon>
      <font-awesome-icon
        class="specification_edit"
        :icon="['far','edit']"
        size="lg"
        fixed-width
        @click="editSpecificationIcon"
      ></font-awesome-icon>
      <font-awesome-icon
        class="specification_delete"
        :icon="['far','times-circle']"
        size="lg"
        @click="deleteSpecificationIcon"
        fixed-width
      ></font-awesome-icon>
    </span>
  </li>
</template>

<script>
export default {
  name: 'specifition',
  props: ['getIndex', 'getNewId'],
  data() {
    return {
      specificationInfo: {
        style: '',
        inventory: '',
        hasConfirm: false
      }
    }
  },
  computed: {
    newIndex() {
      return this.getIndex
    },
    getId() {
      return this.getNewId
    }
  },
  methods: {
    deleteSpecificationIcon() {
      let data = this.specificationInfo
      this.$emit('delete', data)
    },
    editSpecificationIcon() {
      this.specificationInfo.hasConfirm = false
    },
    determineSpecificationIcon() {
      this.$emit('confirm', this.specificationInfo)
      if (
        this.specificationInfo.style.length &&
        this.specificationInfo.inventory.length
      )
        this.specificationInfo.hasConfirm = true
    }
  },
  mounted() {
    this.$set(this.specificationInfo, 'id', this.getId)
    this.$set(this.specificationInfo, 'index', this.newIndex)
  }
}
</script>