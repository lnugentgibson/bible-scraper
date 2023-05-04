/**
 * The spelling of a word
 */
CREATE TABLE multigraph (
  index integer PRIMARY KEY CHECK (index > 0),
  name  text    NOT NULL
);

/**
 * The meaning of a word
 */
CREATE TABLE morpheme (
  index integer PRIMARY KEY CHECK (index > 0),
  name  text    NOT NULL
);

CREATE TABLE morpheme_spelling (
  morpheme_index   integer NOT NULL CHECK (index > 0),
  multigraph_index integer NOT NULL CHECK (index > 0)
);

CREATE TABLE morpheme_meaning (
  morpheme_index integer NOT NULL CHECK (index > 0),
  meaning        text    NOT NULL
);

/**
 * The meaning of a word group
 */
CREATE TABLE lexeme (
  index integer PRIMARY KEY CHECK (index > 0),
  name text NOT NULL
);

CREATE TABLE form (
  index integer PRIMARY KEY CHECK (index > 0),
  name text NOT NULL
);

CREATE TABLE morpheme_form (
  morpheme_index integer NOT NULL CHECK (index > 0),
  lexeme_index   integer NOT NULL CHECK (index > 0),
  form_index     integer NOT NULL CHECK (index > 0)
);

CREATE TABLE lexeme_meaning (
  lexeme_index integer NOT NULL CHECK (index > 0),
  meaning      text    NOT NULL
);