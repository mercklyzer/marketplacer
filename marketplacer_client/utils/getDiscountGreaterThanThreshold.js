const getDiscountGreaterThanThreshold = (discount) => {
    let greaterThanThreshold = 0;
    if (discount === 0.2) {
        greaterThanThreshold = 100;
    }
    else if (discount === 0.15) {
        greaterThanThreshold = 50;
    }
    else if (discount === 0.1) {
        greaterThanThreshold = 20;
    }
    return greaterThanThreshold;
}

module.exports = getDiscountGreaterThanThreshold;
