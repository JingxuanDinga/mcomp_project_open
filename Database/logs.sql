CREATE TABLE IF NOT EXISTS logs.traces (
  t_id       int     not null,
  name     text    not null,
  description  text,
  primary key(t_id));

CREATE TABLE IF NOT EXISTS logs.procs (
  n_id   bigint    not null,
  pid    int     not null,
  exe    text    not null,
  ppid     int     not null,
  args   text,
  t_id   int     not null,
  PRIMARY KEY(n_id, t_id));

CREATE TABLE IF NOT EXISTS logs.files (
  n_id   bigint    not null,
  name   text    not null,
  version  text,
  t_id   int     not null,
  PRIMARY KEY(n_id, t_id));

CREATE TABLE IF NOT EXISTS logs.sockets (
  n_id   bigint    not null,
  name   text    not null,
  t_id   int     not null,
  PRIMARY KEY(n_id, t_id));

CREATE TABLE IF NOT EXISTS logs.nodes (
  n_id   bigint    not null,
  n_type   int     not null,
  t_id   int     not null,
  PRIMARY KEY(n_id, t_id));

CREATE TABLE IF NOT EXISTS logs.edges (
  e_id     bigint    not null,
  n1_hash  bigint    not null,
  n2_hash  bigint    not null,
  relation int     not null,
  sequence bigint    not null,
  session  int     not null,
  timestamp  text,
  t_id   int   not null,
  primary key(e_id, t_id));

CREATE TABLE IF NOT EXISTS logs.behaviors (
  e_id     bigint    not null,
  b_id     bigint    not null,
  t_id     bigint    not null,
  primary key(e_id, t_id));