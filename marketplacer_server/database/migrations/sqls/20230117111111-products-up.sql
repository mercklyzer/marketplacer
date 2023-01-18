/* Replace with your SQL commands */
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
    `productId` VARCHAR(12) NOT NULL,
    `name` VARCHAR(64) NOT NULL,
    `price` DECIMAL(16,2) NOT NULL,

    PRIMARY KEY (`productId`)
);

DROP PROCEDURE IF EXISTS `getProducts`;
CREATE PROCEDURE `getProducts` ()
BEGIN
    SELECT * FROM `mydb`.`products`;
END;

DROP PROCEDURE IF EXISTS `addProduct`;
CREATE PROCEDURE `addProduct` (
    IN `p_productId` VARCHAR(12),
    IN `p_name` VARCHAR(64),
    IN `p_price` DECIMAL(16,2)
)
BEGIN
    INSERT INTO `mydb`.`products` (`productId`,`name`,`price`) VALUES (`p_productId`,`p_name`,`p_price`);
END;