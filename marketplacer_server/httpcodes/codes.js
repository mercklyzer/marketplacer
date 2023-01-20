const errorCodes = {
    100: {
        message: "Invalid username parameter."
    },
    101: {
        message: "Invalid shopping cart item id parameter."
    },
    200:{
        message: "Invalid product id."
    },
    201: {
        message: "Data field not found."
    },
    300:{
        message: "Product does not exist."
    },
    301: {
        message: "Item does not exist in your shopping cart."
    },
    400:{
        message: "Shopping cart item already exists in your shopping cart."
    },
    500: {
        message: "User has no authority to do this action."
    },
    1000: {
        message: "MySQL Error"
    }
}

module.exports = errorCodes;