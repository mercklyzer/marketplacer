const httpMocks = require('node-mocks-http');
const events = require('events');
const httpcodes = require('../../httpcodes/codes');
const shoppingCartController = require('../../controllers/shopping-cart.controller');
const DBServerError = require('../../httpcodes/DBServerError');
const Ok = require('../../httpcodes/Ok');


const MOCK_PRODUCTS = [
    {
        productId: "b6LHI5V5xloo",
        productName: "Chain Ring 146mm",
        productPrice: 65.95
    },
    {
        productId: "CT9sHDzyVgdZ",
        productName: "Jockey Wheels - Orange",
        productPrice: 15.39
    },
    {
        productId: "L9TY0Ae8sDrw",
        productName: "Front Derailleur - 34.9mm",
        productPrice: 31.22
    },
    {
        productId: "lSHbAvvCyEKd",
        productName: "Carbon Brake Pads",
        productPrice: 92.00
    },

];


const MOCK_PRODUCT_TO_BE_ADDED_TO_CART = {
    productId: "CT9sHDzyVgdZ",
    productName: "Jockey Wheels - Orange",
    productPrice: 15.39
};

const MOCK_USERNAME = 'lyzer';

const MOCK_SHOPPING_CART_ITEMS = [
    {
        shoppingCartItemId: "XUeduwYZB1ow",
        username: MOCK_USERNAME,
        productId: "b6LHI5V5xloo",
        productName: "Chain Ring 146mm",
        productPrice: 65.95,
        createdAt: 1674138804
    },
    {
        shoppingCartItemId: "XUeduwYZB1ow",
        username: MOCK_USERNAME,
        productId: "L9TY0Ae8sDrw",
        productName: "Front Derailleur - 34.9mm",
        productPrice: 31.22,
        createdAt: 1674138775
    }
];


describe('shopping-cart.controller.spec.js', () => {
    let mockProductsRepository;
    let mockShoppingCartRepository;
    let request;
    let response;
    let next;


    beforeEach(() => {
        response = httpMocks.createResponse({
            eventEmitter: events.EventEmitter
        });
        mockProductsRepository = jasmine.createSpyObj('mockProductsRepository', ['getProductByProductId']);
        mockShoppingCartRepository = jasmine.createSpyObj('mockShoppingCartRepository', [
            'getShoppingCartByUsername',
            'getShoppingCartItemByUsernameAndProductId',
            'getShoppingCartItemByShoppingCartItemId',
            'addShoppingCartItem',
            'deleteShoppingCartItem'
        ]);

        mockProductsRepository.getProductByProductId.and.returnValue(Promise.resolve(MOCK_PRODUCT_TO_BE_ADDED_TO_CART));
    });

    describe("Unhappy paths", () => {
        beforeEach(() => {
            next = (error) => {
                response.status(error.statusCode || 500).json({ error: { ...error, message: error.message } });
            }
        })

        describe("Get shopping cart by username", () => {
            it("Invalid username", (done) => {
                request = httpMocks.createRequest({
                    params: {
                        username: 'morethan16characters'
                    },
                })

                response.on('end', () => {
                    expect(422).toEqual(response.statusCode);
                    expect({
                        error: {
                            name: "InvalidParameterError",
                            code: 100,
                            statusCode: 422,
                            message: httpcodes[100].message
                        }
                    }).toEqual(JSON.parse(response._getData()));
                    done();
                })

                const controller = shoppingCartController(mockShoppingCartRepository, mockProductsRepository);
                controller.getShoppingCartByUsername(request, response, next);
            })

            it("Database Error", (done) => {
                mockShoppingCartRepository.getShoppingCartByUsername.and.returnValue(Promise.reject(new DBServerError(1000, '')));

                request = httpMocks.createRequest({
                    params: {
                        username: MOCK_USERNAME
                    }
                });
                response.on('end', () => {
                    expect(516).toEqual(response.statusCode);
                    expect({
                        error: {
                            name: "DBServerError",
                            code: 1000,
                            statusCode: 516,
                            message: httpcodes[1000].message
                        }
                    }).toEqual(JSON.parse(response._getData()));
                    done();
                })
                const controller = shoppingCartController(mockShoppingCartRepository);
                controller.getShoppingCartByUsername(request, response, next);
            })
        })

        describe("Add shopping cart item", () => {
            it("Invalid username", (done) => {
                request = httpMocks.createRequest({
                    params: {
                        username: 'morethan16characters'
                    },
                    body: {
                        data: {
                            productId: MOCK_PRODUCT_TO_BE_ADDED_TO_CART.productId
                        }
                    }
                })

                response.on('end', () => {
                    expect(422).toEqual(response.statusCode);
                    expect({
                        error: {
                            name: "InvalidParameterError",
                            code: 100,
                            statusCode: 422,
                            message: httpcodes[100].message
                        }
                    }).toEqual(JSON.parse(response._getData()));
                    done();
                })

                const controller = shoppingCartController(mockShoppingCartRepository);
                controller.addShoppingCartItem(request, response, next);
            })

            it("No product id payload", (done) => {
                request = httpMocks.createRequest({
                    params: {
                        username: MOCK_USERNAME
                    },
                    body: {
                        data: {}
                    }
                })

                response.on('end', () => {
                    expect(422).toEqual(response.statusCode);
                    expect({
                        error: {
                            name: "InvalidPayloadError",
                            code: 200,
                            statusCode: 422,
                            message: httpcodes[200].message
                        }
                    }).toEqual(JSON.parse(response._getData()));
                    done();
                })

                const controller = shoppingCartController(mockShoppingCartRepository);
                controller.addShoppingCartItem(request, response, next);
            })

            it("Data field in payload not found", (done) => {
                mockProductsRepository.getProductByProductId.and.returnValue(Promise.resolve(null));

                request = httpMocks.createRequest({
                    params: {
                        username: MOCK_USERNAME
                    },
                    body: {
                    }
                })

                response.on('end', () => {
                    expect(422).toEqual(response.statusCode);
                    expect({
                        error: {
                            name: "InvalidPayloadError",
                            code: 201,
                            statusCode: 422,
                            message: httpcodes[201].message
                        }
                    }).toEqual(JSON.parse(response._getData()));
                    done();
                })

                const controller = shoppingCartController(mockShoppingCartRepository, mockProductsRepository);
                controller.addShoppingCartItem(request, response, next);
            });

            it("Product to be added doesn't exist", (done) => {
                mockProductsRepository.getProductByProductId.and.returnValue(Promise.resolve(null));

                request = httpMocks.createRequest({
                    params: {
                        username: MOCK_USERNAME
                    },
                    body: {
                        data: {
                            productId: MOCK_PRODUCT_TO_BE_ADDED_TO_CART.productId
                        }
                    }
                })

                response.on('end', () => {
                    expect(404).toEqual(response.statusCode);
                    expect({
                        error: {
                            name: "DoesNotExistError",
                            code: 300,
                            statusCode: 404,
                            message: httpcodes[300].message
                        }
                    }).toEqual(JSON.parse(response._getData()));
                    done();
                })

                const controller = shoppingCartController(mockShoppingCartRepository, mockProductsRepository);
                controller.addShoppingCartItem(request, response, next);
            });

            it("Product to be added already exists in the shopping cart", (done) => {
                mockProductsRepository.getProductByProductId.and.returnValue(Promise.resolve(MOCK_PRODUCT_TO_BE_ADDED_TO_CART));
                mockShoppingCartRepository.getShoppingCartItemByUsernameAndProductId.and.returnValue(Promise.resolve(true))

                request = httpMocks.createRequest({
                    params: {
                        username: MOCK_USERNAME
                    },
                    body: {
                        data: {
                            productId: MOCK_PRODUCT_TO_BE_ADDED_TO_CART.productId
                        }
                    }
                })

                response.on('end', () => {
                    expect(409).toEqual(response.statusCode);
                    expect({
                        error: {
                            name: "AlreadyExistsError",
                            code: 400,
                            statusCode: 409,
                            message: httpcodes[400].message
                        }
                    }).toEqual(JSON.parse(response._getData()));
                    done();
                })

                const controller = shoppingCartController(mockShoppingCartRepository, mockProductsRepository);
                controller.addShoppingCartItem(request, response, next);
            })
        })

    })

    describe("Happy paths", () => {
        beforeEach(() => {
            next = (data) => {
                response.status(data.statusCode || 200).json({ data: data.body });
            }
        });

        it("Get shopping cart by username", (done) => {              
            mockShoppingCartRepository.getShoppingCartByUsername.and.returnValue(Promise.resolve(MOCK_SHOPPING_CART_ITEMS));

            request = httpMocks.createRequest({
                params: {
                    username: MOCK_USERNAME
                },
            })

            response.on('end', () => {
                expect(200).toEqual(response.statusCode);
                expect({
                    data: {
                        shoppingCart:{
                            shoppingCartItems: [...MOCK_SHOPPING_CART_ITEMS],
                            total: 82.59,
                            discount: 0.15
                        }
                    }
                }).toEqual(JSON.parse(response._getData()));
                done();
            })

            const controller = shoppingCartController(mockShoppingCartRepository, mockProductsRepository);
            controller.getShoppingCartByUsername(request, response, next);
        });

        it("Add shopping cart item", (done) => {
            mockProductsRepository.getProductByProductId.and.returnValue(Promise.resolve(MOCK_PRODUCT_TO_BE_ADDED_TO_CART));
            mockShoppingCartRepository.getShoppingCartItemByUsernameAndProductId.and.returnValue(Promise.resolve(false));
            mockShoppingCartRepository.addShoppingCartItem.and.returnValue(Promise.resolve(true));
            mockShoppingCartRepository.getShoppingCartByUsername.and.returnValue(Promise.resolve([
                {
                    shoppingCartItemId: "MockCartId12", 
                    username: MOCK_USERNAME,
                    ...MOCK_PRODUCT_TO_BE_ADDED_TO_CART,
                    createdAt: 1674138999
                },
                ...MOCK_SHOPPING_CART_ITEMS
            ]))

            request = httpMocks.createRequest({
                params: {
                    username: MOCK_USERNAME
                },
                body: {
                    data: {
                        productId: MOCK_PRODUCT_TO_BE_ADDED_TO_CART.productId
                    }
                }
            })

            response.on('end', () => {
                expect(200).toEqual(response.statusCode);
                expect({
                    data: {
                        shoppingCart:{
                            shoppingCartItems: [
                                {
                                    shoppingCartItemId: "MockCartId12", 
                                    username: MOCK_USERNAME,
                                    ...MOCK_PRODUCT_TO_BE_ADDED_TO_CART,
                                    createdAt: 1674138999
                                },
                                ...MOCK_SHOPPING_CART_ITEMS
                            ],
                            total: 90.05,
                            discount: 0.2
                        }
                    }
                }).toEqual(JSON.parse(response._getData()));
                done();
            })
            const controller = shoppingCartController(mockShoppingCartRepository, mockProductsRepository);
            controller.addShoppingCartItem(request, response, next);
        });
    })

});

