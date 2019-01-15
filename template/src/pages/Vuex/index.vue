<template>
    <div class="padding">
        <h1>Shopping Cart Example</h1>
        <hr>
        <h2>Products</h2>
        <ProductList/>
        <hr>
        <ShoppingCart/>
    </div>
</template>

<script>
import ProductList from 'components/ProductList'
import ShoppingCart from 'components/ShoppingCart'

export default {
    components: { ProductList, ShoppingCart }
}
</script>

<style lang="less" scoped>
    @import './index'
</style>