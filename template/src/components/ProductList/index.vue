<template>
    <ul>
        <li
        v-for="product in products"
        :key="product.id">
        {{ product.title }} - {{ product.price }}
        <br>
        <button
            :disabled="!product.inventory"
            @click="addProductToCart(product)">
            Add to cart
        </button>
        </li>
    </ul>
</template>

<script>
export default {
    computed: Vuex.mapState({
        products: state => state.products.all
    }),
    methods: Vuex.mapActions('cart', [
        'addProductToCart'
    ]),
    created () {
        this.$store.dispatch('products/getAllProducts')
    }
}
</script>
