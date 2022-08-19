create table backup_space
(
  nanoid
    constraint space_pk
      primary key,
  name        string,
  data,
  count_task  INT,
  count_tab   INT,
  create_time INT,
  update_time INT,
  sync_time   INT,
  uid         INT,
  offlineUse  bool
);

create table config
(
  nanoid string
    constraint config_pk
      primary key,
  key    string,
  value  string,
  remark string
);

create unique index config_key_uindex
  on config (key);

create unique index config_nanoid_uindex
  on config (nanoid);

create table local_space
(
  nanoid
    constraint space_pk
      primary key,
  name        string,
  data,
  count_task  INT,
  count_tab   INT,
  create_time INT,
  update_time INT,
  sync_time   INT,
  uid         INT
);

create unique index space_nanoid_uindex
  on local_space (nanoid);

create table log
(
  nanoid      string,
  create_time INT,
  data        string,
  type        string,
  message     string
);

