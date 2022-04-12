CREATE TABLE `user` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL
);

CREATE INDEX name_index ON user(name);

INSERT INTO `user` (`id`, `name`, `password`) VALUES
(1, 'admin', '1234'),
(2, 'user', 'user'),
(3, 'marnix', '1234'),
(4, 'akif', 'a1111');

CREATE TABLE `skill`
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    tagline TEXT,
    category VARCHAR(255) NOT NULL,
    ownerId INT NOT NULL,
    locationOption VARCHAR(4) NOT NULL,
    travelFee FLOAT,
    CHECK (locationOption IN ('c', 'i', 'o', 'ci', 'co', 'io', 'cio')),
    CHECK ((locationOption IN ('c', 'ci', 'co', 'cio') AND travelFee IS NOT NULL) OR travelFee IS NULL),
    PRIMARY KEY (id),
    FOREIGN KEY (ownerId) REFERENCES user(id)
);

INSERT INTO `skill` (`id`, `tagline`, `category`, `ownerId`, `locationOption`, `travelFee`) VALUES
(1, 'I''ll teach you how to play the piano.', 'Piano', 1, 'cio', 3),
(2, 'I''ll teach you how to play the tennis.', 'Tennis', 1, 'ci', 4.5),
(3, 'I''ll teach you how to eat anything.', 'Eating', 1, 'i', NULL),
(4, 'I''ll teach you how to breathe oxygen.', 'Breathing', 1, 'c', 1);

