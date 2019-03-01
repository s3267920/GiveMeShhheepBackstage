<template>
  <ul class="pagination">
    <a href.prevent v-show="pageListLimit<startPage" @click="goPage('back')">
      <li class="go_back">
        <span></span>
      </li>
    </a>
    <a href.prevent v-for="i in actualPage" :key="i" @click.prevent="changePage(i)">
      <li
        v-text="i"
        :class="{currentPage:isCurrentPage===i,lastPage:i===totalPage,firstPage:i===startPage&&i<pageListLimit}"
      ></li>
    </a>
    <a href.prevent @click="goPage('ahead')" v-show="lastPage!==totalPage">
      <li class="go_ahead">
        <span></span>
      </li>
    </a>
  </ul>
</template>
<script>
export default {
  name: 'pagination',
  props: ['getData'],
  data() {
    return {
      limitNum: 5,
      isCurrentPage: 1,
      pageListLimit: 5,
      startPage: 1,
      lastPage: 5
    }
  },
  computed: {
    totalPage() {
      return Math.ceil(this.getData.length / this.limitNum)
    },
    actualPage() {
      let pageList = []
      this.totalPage > this.pageListLimit
        ? (this.lastPage = this.lastPage)
        : (this.lastPage = this.totalPage)
      for (let i = this.startPage; i <= this.lastPage; i++) {
        pageList.push(i)
      }
      return pageList
    }
  },
  methods: {
    changePage(page) {
      this.isCurrentPage = page
      this.$emit('changePage', page, this.limitNum)
    },
    goPage(val) {
      let total = this.totalPage,
        limit = this.pageListLimit
      if (val === 'ahead') {
        if (total % limit !== 0) {
          this.startPage + limit + (total % limit) >= total
            ? ((this.startPage = total - (total % limit) + 1),
              (this.lastPage = total))
            : ((this.startPage = this.startPage + limit),
              (this.lastPage = this.lastPage + limit))
        } else {
          this.startPage + limit === total + 1
            ? ((this.startPage = total - limit), (this.lastPage = total))
            : ((this.startPage = this.startPage + limit),
              (this.lastPage = this.lastPage + limit))
        }
      } else {
        if (total % limit !== 0) {
          this.lastPage - limit <= limit
            ? ((this.startPage = 1), (this.lastPage = limit))
            : this.lastPage === total
            ? ((this.startPage = this.startPage - limit),
              (this.lastPage = this.lastPage - (total % limit)))
            : ((this.startPage = this.startPage - limit),
              (this.lastPage = this.lastPage - limit))
        } else {
          this.lastPage - limit <= limit
            ? ((this.startPage = 1), (this.lastPage = limit))
            : ((this.startPage = this.startPage - limit),
              (this.lastPage = this.lastPage - limit))
        }
      }
    }
  }
}
</script>
