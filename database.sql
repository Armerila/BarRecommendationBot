CREATE TABLE bars (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL
);

CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    displayname TEXT
);

CREATE TABLE ratings (
    id INTEGER PRIMARY KEY,
    rating INTEGER NOT NULL,
    bar INTEGER NOT NULL,
    user INTEGER NOT NULL,
    FOREIGN KEY (bar)
        REFERENCES bars (id),
    FOREIGN KEY (user)
        REFERENCES users (id)
);