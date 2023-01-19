const isProductInShoppingCart = (shoppingCart, productId) => {
    const productIds = shoppingCart.shoppingCartItems.map(item => item.productId);
    return productIds.includes(productId);
}

module.exports = isProductInShoppingCart;