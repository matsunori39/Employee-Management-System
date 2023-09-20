USE employee;

CREATE TABLE basics (
  id INT AUTO_INCREMENT, name VARCHAR(255), department VARCHAR(255), PRIMARY KEY (id)
);

INSERT INTO basics (name, department)
  VALUES
    ('鈴木 聡志', '人事部'),
    ('中村 京子', '営業部'),
    ('小林 大輔', '経理部'),
    ('加藤 健吾', '人事部'),
    ('井上 次郎', 'システム部'),
    ('小鳥遊 みなみ', '営業部'),
    ('松本 さくら', '経理部'),
    ('高野 太郎', 'システム部'),
    ('佐藤 敏夫', '営業部'),
    ('田中 明子', '人事部');

CREATE TABLE users (
  id INT AUTO_INCREMENT, username VARCHAR(255),email VARCHAR(255), password VARCHAR(255), PRIMARY KEY (id)
);

INSERT INTO users (username, email, password)
  VALUES
    (
      'k.katou',
      'k.katou@its-y.co.jp',
      '$2b$10$jyrxG64ihWotFrkzBqr1.OJ1GoqAtPngbQRnPDnQECG9d/0DA2YEu'
    ),
    (
      's.suzuki',
      's.suzuki@its-y.co.jp',
      '$2b$10$bc7nU3DDbcNxaAxNP41bpetp4avs63RaCqi5o1gUPR/bu9Miuf12e'
    ),
    (
      'a.tanaka',
      'a.tanaka@its-y.co.jp',
      '$2b$10$xoyZEX6a8Sqa3Fdc3cs2qOdSKY2j1YYB1GK/A4Q6fhtrBz1u3yzUa'
    ),
    (
      'guest',
      'guest@example.com',
      '$2b$10$O3wQWEdhKHjuvK6XGZN0fO3u.uY2MXPeu.VvmFS5hUi4ZzgJxRLk.'
    );
