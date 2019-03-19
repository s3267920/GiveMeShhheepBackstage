<template>
  <footer>
    <a href="https://github.com/s3267920/GiveMeShhheep">
      <font-awesome-icon
        class="github_icon"
        :icon="['fab', 'github']"
        v-show="!iconContorl"
        @mouseenter="iconContorl=true"
      ></font-awesome-icon>
      <font-awesome-icon
        class="github_icon"
        :icon="['fab', 'github-alt']"
        v-show="iconContorl"
        @mouseleave="iconContorl=false"
      ></font-awesome-icon>
    </a>
  </footer>
</template>

<script>
export default {
  name: 'footers',
  data() {
    return {
      iconContorl: false
    }
  }
}
</script>
