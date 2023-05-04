
CREATE TABLE version (
 id integer PRIMARY KEY AUTOINCREMENT,
 name text NOT NULL,
 code text NOT NULL,
 ucode text NOT NULL
);

INSERT INTO version VALUES('Almeida Atualizada (Portuguese)', 'aa', 'aa');
INSERT INTO version VALUES('American Standard Version', 'asv', 'asv');
INSERT INTO version VALUES('The Bible in Basic English', 'bbe', 'bbe');
INSERT INTO version VALUES('La Biblia de las Américas (Español)', 'bla', 'bla');
INSERT INTO version VALUES('Common English Bible', 'ceb', 'ceb');
INSERT INTO version VALUES('The Complete Jewish Bible', 'cjb', 'cjb');
INSERT INTO version VALUES('Holman Christian Standard Bible', 'csb', 'csb');
INSERT INTO version VALUES('Chinese Union Version - Traditional', 'cuv', 'cuv');
INSERT INTO version VALUES('Chinese Union Version - Pinyin', 'cuvp', 'cuvp');
INSERT INTO version VALUES('Chinese Union Version - Simplified', 'cuvs', 'cuvs');
INSERT INTO version VALUES('The Darby Translation', 'dby', 'dby');
INSERT INTO version VALUES('Elberfelder 1905 (German)', 'elb', 'elb');
INSERT INTO version VALUES('English Standard Version', 'esv', 'esv');
INSERT INTO version VALUES('Giovanni Diodati 1649 (Italian)', 'gdb', 'gdb');
INSERT INTO version VALUES('Good News Translation', 'gnt', 'gnt');
INSERT INTO version VALUES('GOD''S WORD Translation', 'gw', 'gw');
INSERT INTO version VALUES('Hebrew Names Version', 'hnv', 'hnv');
INSERT INTO version VALUES('La Biblia del Jubileo 2000', 'jbs', 'jbs');
INSERT INTO version VALUES('Jubilee Bible 2000', 'jub', 'jub');
INSERT INTO version VALUES('King James Version', 'kjv', 'kjv');
INSERT INTO version VALUES('Lexham English Bible', 'leb', 'leb');
INSERT INTO version VALUES('Louis Segond 1910 (French)', 'lsg', 'lsg');
INSERT INTO version VALUES('Luther Bible 1912 (German)', 'lut', 'lut');
INSERT INTO version VALUES('The Message Bible', 'msg', 'msg');
INSERT INTO version VALUES('New American Standard Bible', 'nasb', 'nas');
INSERT INTO version VALUES('New Century Version', 'ncv', 'ncv');
INSERT INTO version VALUES('New International Reader''s Version', 'nirv', 'nirv');
INSERT INTO version VALUES('New International Version', 'niv', 'niv');
INSERT INTO version VALUES('New King James Version', 'nkjv', 'nkjv');
INSERT INTO version VALUES('New Living Translation', 'nlt', 'nlt');
INSERT INTO version VALUES('Nueva Traducción Viviente', 'ntv', 'ntv');
INSERT INTO version VALUES('Nueva Versión Internacional', 'nvi', 'nvi');
INSERT INTO version VALUES('La Biblia del Jubileo 2000', 'nvi-pt', 'nvip');
INSERT INTO version VALUES('New Revised Standard', 'nrs', 'nrs');
INSERT INTO version VALUES('Orthodox Jewish Bible', 'ojb', 'ojb');
INSERT INTO version VALUES('Ostervald (French)', 'ost', 'ost');
INSERT INTO version VALUES('Douay-Rheims Catholic Bible', 'rhe', 'rhe');
INSERT INTO version VALUES('Riveduta 1927 (Italian)', 'riv', 'riv');
INSERT INTO version VALUES('Revised Standard Version', 'rsv', 'rsv');
INSERT INTO version VALUES('La Biblia Reina-Valera (Español)', 'rvr', 'rvr');
INSERT INTO version VALUES('SBL Greek New Testament', 'sblgnt', 'sbl');
INSERT INTO version VALUES('Sagradas Escrituras (1569) (Español)', 'sev', 'sev');
INSERT INTO version VALUES('Statenvertaling (Dutch)', 'svv', 'svv');
INSERT INTO version VALUES('Third Millennium Bible', 'tmb', 'tmb');
INSERT INTO version VALUES('Tyndale', 'tyn', 'tyn');
INSERT INTO version VALUES('The Latin Vulgate', 'vul', 'vul');
INSERT INTO version VALUES('The Webster Bible', 'wbt', 'wbt');
INSERT INTO version VALUES('World English Bible', 'web', 'web');
INSERT INTO version VALUES('Weymouth New Testament', 'wnt', 'wnt');
INSERT INTO version VALUES('Wycliffe', 'wyc', 'wyc');
INSERT INTO version VALUES('Young''s Literal Translation', 'ylt', 'ylt');

CREATE TABLE domain (
 id integer PRIMARY KEY AUTOINCREMENT,
 name text NOT NULL,
 url text NOT NULL
);
INSERT INTO domain VALUES('biblestudytools', 'https://www.biblestudytools.com');
INSERT INTO domain VALUES('kingjamesbibleonline', 'https://www.kingjamesbibleonline.com');

CREATE TABLE source (
 id integer PRIMARY KEY AUTOINCREMENT,
 name text UNIQUE NOT NULL,
 url text NOT NULL,
 version_id integer REFERENCES version,
 domain_id integer REFERENCES domain
);

INSERT INTO source (name, url, version_id, domain_id) SELECT 'aa.biblestudytools.com', 'https://www.biblestudytools.com/aa', V.id, D.id FROM version V, domain D WHERE V.ucode = 'aa' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'asv.biblestudytools.com', 'https://www.biblestudytools.com/asv', V.id, D.id FROM version V, domain D WHERE V.ucode = 'asv' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'bbe.biblestudytools.com', 'https://www.biblestudytools.com/bbe', V.id, D.id FROM version V, domain D WHERE V.ucode = 'bbe' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'bla.biblestudytools.com', 'https://www.biblestudytools.com/bla', V.id, D.id FROM version V, domain D WHERE V.ucode = 'bla' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'ceb.biblestudytools.com', 'https://www.biblestudytools.com/ceb', V.id, D.id FROM version V, domain D WHERE V.ucode = 'ceb' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'cjb.biblestudytools.com', 'https://www.biblestudytools.com/cjb', V.id, D.id FROM version V, domain D WHERE V.ucode = 'cjb' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'csb.biblestudytools.com', 'https://www.biblestudytools.com/csb', V.id, D.id FROM version V, domain D WHERE V.ucode = 'csb' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'cuv.biblestudytools.com', 'https://www.biblestudytools.com/cuv', V.id, D.id FROM version V, domain D WHERE V.ucode = 'cuv' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'cuvp.biblestudytools.com', 'https://www.biblestudytools.com/cuvp', V.id, D.id FROM version V, domain D WHERE V.ucode = 'cuvp' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'cuvs.biblestudytools.com', 'https://www.biblestudytools.com/cuvs', V.id, D.id FROM version V, domain D WHERE V.ucode = 'cuvs' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'dby.biblestudytools.com', 'https://www.biblestudytools.com/dby', V.id, D.id FROM version V, domain D WHERE V.ucode = 'dby' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'elb.biblestudytools.com', 'https://www.biblestudytools.com/elb', V.id, D.id FROM version V, domain D WHERE V.ucode = 'elb' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'esv.biblestudytools.com', 'https://www.biblestudytools.com/esv', V.id, D.id FROM version V, domain D WHERE V.ucode = 'esv' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'gdb.biblestudytools.com', 'https://www.biblestudytools.com/gdb', V.id, D.id FROM version V, domain D WHERE V.ucode = 'gdb' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'gnt.biblestudytools.com', 'https://www.biblestudytools.com/gnt', V.id, D.id FROM version V, domain D WHERE V.ucode = 'gnt' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'gw.biblestudytools.com', 'https://www.biblestudytools.com/gw', V.id, D.id FROM version V, domain D WHERE V.ucode = 'gw' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'hnv.biblestudytools.com', 'https://www.biblestudytools.com/hnv', V.id, D.id FROM version V, domain D WHERE V.ucode = 'hnv' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'jbs.biblestudytools.com', 'https://www.biblestudytools.com/jbs', V.id, D.id FROM version V, domain D WHERE V.ucode = 'jbs' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'jub.biblestudytools.com', 'https://www.biblestudytools.com/jub', V.id, D.id FROM version V, domain D WHERE V.ucode = 'jub' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'kingjamesbibleonline.org', 'https://www.kingjamesbibleonline.org', V.id, D.id FROM version V, domain D WHERE V.ucode = 'kjv' AND D.name = 'kingjamesbibleonline');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'kjv.biblestudytools.com', 'https://www.biblestudytools.com/kjv', V.id, D.id FROM version V, domain D WHERE V.ucode = 'kjv' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'leb.biblestudytools.com', 'https://www.biblestudytools.com/leb', V.id, D.id FROM version V, domain D WHERE V.ucode = 'leb' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'lsg.biblestudytools.com', 'https://www.biblestudytools.com/lsg', V.id, D.id FROM version V, domain D WHERE V.ucode = 'lsg' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'lut.biblestudytools.com', 'https://www.biblestudytools.com/lut', V.id, D.id FROM version V, domain D WHERE V.ucode = 'lut' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'msg.biblestudytools.com', 'https://www.biblestudytools.com/msg', V.id, D.id FROM version V, domain D WHERE V.ucode = 'msg' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'nas.biblestudytools.com', 'https://www.biblestudytools.com/nas', V.id, D.id FROM version V, domain D WHERE V.ucode = 'nas' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'ncv.biblestudytools.com', 'https://www.biblestudytools.com/ncv', V.id, D.id FROM version V, domain D WHERE V.ucode = 'ncv' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'nirv.biblestudytools.com', 'https://www.biblestudytools.com/nirv', V.id, D.id FROM version V, domain D WHERE V.ucode = 'nirv' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'niv.biblestudytools.com', 'https://www.biblestudytools.com/niv', V.id, D.id FROM version V, domain D WHERE V.ucode = 'niv' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'nkjv.biblestudytools.com', 'https://www.biblestudytools.com/nkjv', V.id, D.id FROM version V, domain D WHERE V.ucode = 'nkjv' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'nlt.biblestudytools.com', 'https://www.biblestudytools.com/nlt', V.id, D.id FROM version V, domain D WHERE V.ucode = 'nlt' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'ntv.biblestudytools.com', 'https://www.biblestudytools.com/ntv', V.id, D.id FROM version V, domain D WHERE V.ucode = 'ntv' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'nvi.biblestudytools.com', 'https://www.biblestudytools.com/nvi', V.id, D.id FROM version V, domain D WHERE V.ucode = 'nvi' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'nvip.biblestudytools.com', 'https://www.biblestudytools.com/nvip', V.id, D.id FROM version V, domain D WHERE V.ucode = 'nvip' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'nrs.biblestudytools.com', 'https://www.biblestudytools.com/nrs', V.id, D.id FROM version V, domain D WHERE V.ucode = 'nrs' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'ojb.biblestudytools.com', 'https://www.biblestudytools.com/ojb', V.id, D.id FROM version V, domain D WHERE V.ucode = 'ojb' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'ost.biblestudytools.com', 'https://www.biblestudytools.com/ost', V.id, D.id FROM version V, domain D WHERE V.ucode = 'ost' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'rhe.biblestudytools.com', 'https://www.biblestudytools.com/rhe', V.id, D.id FROM version V, domain D WHERE V.ucode = 'rhe' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'riv.biblestudytools.com', 'https://www.biblestudytools.com/riv', V.id, D.id FROM version V, domain D WHERE V.ucode = 'riv' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'rsv.biblestudytools.com', 'https://www.biblestudytools.com/rsv', V.id, D.id FROM version V, domain D WHERE V.ucode = 'rsv' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'rvr.biblestudytools.com', 'https://www.biblestudytools.com/rvr', V.id, D.id FROM version V, domain D WHERE V.ucode = 'rvr' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'sbl.biblestudytools.com', 'https://www.biblestudytools.com/sbl', V.id, D.id FROM version V, domain D WHERE V.ucode = 'sbl' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'sev.biblestudytools.com', 'https://www.biblestudytools.com/sev', V.id, D.id FROM version V, domain D WHERE V.ucode = 'sev' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'svv.biblestudytools.com', 'https://www.biblestudytools.com/svv', V.id, D.id FROM version V, domain D WHERE V.ucode = 'svv' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'tmb.biblestudytools.com', 'https://www.biblestudytools.com/tmb', V.id, D.id FROM version V, domain D WHERE V.ucode = 'tmb' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'tyn.biblestudytools.com', 'https://www.biblestudytools.com/tyn', V.id, D.id FROM version V, domain D WHERE V.ucode = 'tyn' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'vul.biblestudytools.com', 'https://www.biblestudytools.com/vul', V.id, D.id FROM version V, domain D WHERE V.ucode = 'vul' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'wbt.biblestudytools.com', 'https://www.biblestudytools.com/wbt', V.id, D.id FROM version V, domain D WHERE V.ucode = 'wbt' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'web.biblestudytools.com', 'https://www.biblestudytools.com/web', V.id, D.id FROM version V, domain D WHERE V.ucode = 'web' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'wnt.biblestudytools.com', 'https://www.biblestudytools.com/wnt', V.id, D.id FROM version V, domain D WHERE V.ucode = 'wnt' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'wyc.biblestudytools.com', 'https://www.biblestudytools.com/wyc', V.id, D.id FROM version V, domain D WHERE V.ucode = 'wyc' AND D.name = 'biblestudytools');
INSERT INTO source (name, url, version_id, domain_id) SELECT 'ylt.biblestudytools.com', 'https://www.biblestudytools.com/ylt', V.id, D.id FROM version V, domain D WHERE V.ucode = 'ylt' AND D.name = 'biblestudytools');
