const getDiscountAndDiscountedTotal = (total) => {
    let discountedTotal = total;
    let discount = 0;

    if (total > 100) {
        discount = 0.2;
    }
    else if (total > 50) {
        discount = 0.15;
    }
    else if (total > 20) {
        discount = 0.1;
    }
    discountedTotal = total * (1 - discount);
    discountedTotal = discountedTotal.toFixed(2);

    return [discount, discountedTotal];
}

module.exports = getDiscountAndDiscountedTotal;