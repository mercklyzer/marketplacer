/* Replace with your SQL commands */
DROP TABLE IF EXISTS `shoppingCartItems`;
CREATE TABLE `shoppingCartItems` (
    `shoppingCartItemId` VARCHAR(12) NOT NULL,
    `username` VARCHAR(16) NOT NULL,
    `productId` VARCHAR(12) NOT NULL,
    `productName` VARCHAR(64) NOT NULL,
    `productPrice` DECIMAL(16,2) NOT NULL,
    `createdAt` BIGINT(20) NOT NULL,

    PRIMARY KEY (`shoppingCartItemId`)
);

DROP PROCEDURE IF EXISTS `getShoppingCartByUsername`;
CREATE PROCEDURE `getShoppingCartByUsername` (
    IN `p_username` VARCHAR(16)
)
BEGIN
    SELECT 
        * 
    FROM 
        `mydb`.`shoppingCartItems`
    WHERE 
        `username` = `p_username`
    ORDER BY 
        `createdAt` DESC;
END;

DROP PROCEDURE IF EXISTS `getShoppingCartItemByShoppingCartItemId`;
CREATE PROCEDURE `getShoppingCartItemByShoppingCartItemId` (
    IN `p_shoppingCartItemId` VARCHAR(12)
)
BEGIN
    SELECT 
        * 
    FROM 
        `mydb`.`shoppingCartItems`
    WHERE 
        `shoppingCartItemId` = `p_shoppingCartItemId`;
END;

DROP PROCEDURE IF EXISTS `getShoppingCartItemByUsernameAndProductId`;
CREATE PROCEDURE `getShoppingCartItemByUsernameAndProductId` (
    IN `p_username` VARCHAR(16),
    IN `p_productId` VARCHAR(12)
)
BEGIN
    SELECT 
        * 
    FROM 
        `mydb`.`shoppingCartItems`
    WHERE 
        `username` = `p_username` AND `productId` = `p_productId`;
END;

DROP PROCEDURE IF EXISTS `addShoppingCartItem`;
CREATE PROCEDURE `addShoppingCartItem` (
    IN `p_shoppingCartItemId` VARCHAR(12),
    IN `p_username` VARCHAR(16),
    IN `p_productId` VARCHAR(12),
    IN `p_productName` VARCHAR(64),
    IN `p_productPrice` DECIMAL(16,2),
    IN `p_createdAt` BIGINT(20)
)
BEGIN
    INSERT INTO `mydb`.`shoppingCartItems`
        (`shoppingCartItemId`,`username`,`productId`,`productName`,`productPrice`,`createdAt`) 
    VALUES 
        (`p_shoppingCartItemId`,`p_username`,`p_productId`,`p_productName`,`p_productPrice`,`p_createdAt`);
END;

DROP PROCEDURE IF EXISTS `deleteShoppingCartItem`;
CREATE PROCEDURE `deleteShoppingCartItem` (
    IN `p_shoppingCartItemId` VARCHAR(12)
)
BEGIN
    DELETE FROM `mydb`.`shoppingCartItems` WHERE `shoppingCartItemId` = `p_shoppingCartItemId`;
END;