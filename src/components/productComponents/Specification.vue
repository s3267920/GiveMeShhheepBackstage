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
        class="style"
      >
    </label>
    <span class="specification_icon">
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
      <font-awesome-icon
        class="specification_delete"
        :icon="['fas','plus-circle']"
        size="lg"
        v-if="!specificationInfo.styleInfo.length"
        @click="addNewIcon"
        fixed-width
      ></font-awesome-icon>
    </span>
    <div class="style_Info" v-for="(item , index) in specificationInfo.styleInfo" :key="item.style">
      <label :for="`size${newIndex}`">
        <span>Size</span>
        <input
          :class="{has_determine:specificationInfo.hasConfirm}"
          :disabled="specificationInfo.hasConfirm"
          v-model.trim="item.size"
          :key="`size${newIndex}`"
          type="text"
          required="required"
          name="size"
          :id="`size${newIndex}`"
          class="size"
        >
      </label>
      <label :for="`inventory${newIndex}`">
        <span>Inventory</span>
        <input
          :key="`inventory${newIndex}`"
          :class="{has_determine:specificationInfo.hasConfirm}"
          :disabled="specificationInfo.hasConfirm"
          v-model.trim="item.inventory"
          type="number"
          min="0"
          required="required"
          name="inventory"
          :id="`inventory${newIndex}`"
          class="inventory"
        >
      </label>
      <font-awesome-icon
        class="specification_delete"
        :icon="['fas','plus-circle']"
        size="lg"
        @click="addNewIcon"
        fixed-width
      ></font-awesome-icon>
      <font-awesome-icon
        class="specification_delete"
        :icon="['fas','minus-circle']"
        size="lg"
        @click="removeIcon(index)"
        fixed-width
      ></font-awesome-icon>
    </div>
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
        styleInfo: [
          {
            inventory: '',
            size: '',
          },
        ],
        hasConfirm: false,
      },
    };
  },
  computed: {
    newIndex() {
      return this.getIndex;
    },
    getId() {
      return this.getNewId;
    },
  },
  methods: {
    deleteSpecificationIcon() {
      const data = this.specificationInfo;
      this.$emit('delete', data);
    },
    editSpecificationIcon() {
      this.specificationInfo.hasConfirm = false;
    },
    determineSpecificationIcon() {
      this.$emit('confirm', this.specificationInfo);
      if (this.specificationInfo.style.length) this.specificationInfo.hasConfirm = true;
    },
    addNewIcon() {
      if (this.specificationInfo.hasConfirm === true) {
        return;
      }
      this.specificationInfo.styleInfo.push({ inventory: '', size: '' });
    },
    removeIcon(index) {
      this.specificationInfo.styleInfo.splice(index, 1);
    },
  },
  mounted() {
    this.$set(this.specificationInfo, 'id', this.getId);
    this.$set(this.specificationInfo, 'index', this.newIndex);
  },
};
</script>
