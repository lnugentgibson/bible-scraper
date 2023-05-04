
CREATE TABLE version_book (
 id serial PRIMARY KEY,
 name text,
 url text NOT NULL,
 book_index integer REFERENCES book,
 source_id integer REFERENCES source
);

CREATE TABLE version_chapter (
 id serial PRIMARY KEY,
 index integer NOT NULL,
 url text,
 book_id integer REFERENCES book,
 source_id integer REFERENCES source
);

CREATE TABLE version_verse (
 id serial PRIMARY KEY,
 index integer NOT NULL,
 url text,
 verse text NOT NULL,
 html text,
 chapter_id integer REFERENCES book,
 source_id integer REFERENCES source
);
