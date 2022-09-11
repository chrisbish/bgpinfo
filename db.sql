CREATE TABLE IF NOT EXISTS `peer` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `asn` varchar(10) DEFAULT NULL,
  `asName` varchar(100) DEFAULT NULL,
  `country` varchar(60) DEFAULT NULL,
  `countryCode` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`idx`)
) ENGINE=InnoDB AUTO_INCREMENT=484 DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `prefix` (
  `idx` int(11) NOT NULL AUTO_INCREMENT,
  `prefix` varchar(100) NOT NULL,
  `country` varchar(60) NOT NULL,
  `countryCode` varchar(5) NOT NULL,
  `description` varchar(100) NOT NULL,
  PRIMARY KEY (`idx`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4;