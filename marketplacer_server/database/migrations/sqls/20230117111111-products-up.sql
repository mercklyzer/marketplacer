/* Replace with your SQL commands */
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
    `productId` VARCHAR(12) NOT NULL,
    `productName` VARCHAR(64) NOT NULL,
    `productPrice` DECIMAL(16,2) NOT NULL,

    PRIMARY KEY (`productId`)
);

DROP PROCEDURE IF EXISTS `getProducts`;
CREATE PROCEDURE `getProducts` ()
BEGIN
    SELECT * FROM `mydb`.`products`;
END;

DROP PROCEDURE IF EXISTS `getProductByProductId`;
CREATE PROCEDURE `getProductByProductId` (
    `p_productId` VARCHAR(12)
)
BEGIN
    SELECT * FROM `mydb`.`products` WHERE `productId` = `p_productId`;
END;

DROP PROCEDURE IF EXISTS `addProduct`;
CREATE PROCEDURE `addProduct` (
    IN `p_productId` VARCHAR(12),
    IN `p_productName` VARCHAR(64),
    IN `p_productPrice` DECIMAL(16,2)
)
BEGIN
    INSERT INTO `mydb`.`products` (`productId`,`productName`,`productPrice`) VALUES (`p_productId`,`p_productName`,`p_productPrice`);
END;