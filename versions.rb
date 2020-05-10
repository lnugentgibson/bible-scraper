aa = Version.create(code: 'aa', name: "Almeida Atualizada (Portuguese)")
biblestudytools = Domain.create(domain: "biblestudytools")
VersionSource.create(domain_id: biblestudytools.id, version_id: aa.id, url: "https://www.biblestudytools.com/aa/")

asv = Version.create(code: 'asv', name: "American Standard Version")
VersionSource.create(domain_id: biblestudytools.id, version_id: asv.id, url: "https://www.biblestudytools.com/asv/")

bbe = Version.create(code: 'bbe', name: "The Bible in Basic English")
VersionSource.create(domain_id: biblestudytools.id, version_id: bbe.id, url: "https://www.biblestudytools.com/bbe/")

bla = Version.create(code: 'bla', name: "La Biblia de las Américas (Español)")
VersionSource.create(domain_id: biblestudytools.id, version_id: bla.id, url: "https://www.biblestudytools.com/bla/")

ceb = Version.create(code: 'ceb', name: "Common English Bible")
VersionSource.create(domain_id: biblestudytools.id, version_id: ceb.id, url: "https://www.biblestudytools.com/ceb/")

cjb = Version.create(code: 'cjb', name: "The Complete Jewish Bible")
VersionSource.create(domain_id: biblestudytools.id, version_id: cjb.id, url: "https://www.biblestudytools.com/cjb/")

csb = Version.create(code: 'csb', name: "Holman Christian Standard Bible")
VersionSource.create(domain_id: biblestudytools.id, version_id: csb.id, url: "https://www.biblestudytools.com/csb/")

cuv = Version.create(code: 'cuv', name: "Chinese Union Version - Traditional")
VersionSource.create(domain_id: biblestudytools.id, version_id: cuv.id, url: "https://www.biblestudytools.com/cuv/")

cuvp = Version.create(code: 'cuvp', name: "Chinese Union Version - Pinyin")
VersionSource.create(domain_id: biblestudytools.id, version_id: cuvp.id, url: "https://www.biblestudytools.com/cuvp/")

cuvs = Version.create(code: 'cuvs', name: "Chinese Union Version - Simplified")
VersionSource.create(domain_id: biblestudytools.id, version_id: cuvs.id, url: "https://www.biblestudytools.com/cuvs/")

dby = Version.create(code: 'dby', name: "The Darby Translation")
VersionSource.create(domain_id: biblestudytools.id, version_id: dby.id, url: "https://www.biblestudytools.com/dby/")

elb = Version.create(code: 'elb', name: "Elberfelder 1905 (German)")
VersionSource.create(domain_id: biblestudytools.id, version_id: elb.id, url: "https://www.biblestudytools.com/elb/")

esv = Version.create(code: 'esv', name: "English Standard Version")
VersionSource.create(domain_id: biblestudytools.id, version_id: esv.id, url: "https://www.biblestudytools.com/esv/")

gdb = Version.create(code: 'gdb', name: "Giovanni Diodati 1649 (Italian)")
VersionSource.create(domain_id: biblestudytools.id, version_id: gdb.id, url: "https://www.biblestudytools.com/gdb/")

gnt = Version.create(code: 'gnt', name: "Good News Translation")
VersionSource.create(domain_id: biblestudytools.id, version_id: gnt.id, url: "https://www.biblestudytools.com/gnt/")

gw = Version.create(code: 'gw', name: "GOD'S WORD Translation")
VersionSource.create(domain_id: biblestudytools.id, version_id: gw.id, url: "https://www.biblestudytools.com/gw/")

hnv = Version.create(code: 'hnv', name: "Hebrew Names Version")
VersionSource.create(domain_id: biblestudytools.id, version_id: hnv.id, url: "https://www.biblestudytools.com/hnv/")

jbs = Version.create(code: 'jbs', name: "La Biblia del Jubileo 2000")
VersionSource.create(domain_id: biblestudytools.id, version_id: jbs.id, url: "https://www.biblestudytools.com/jbs/")

jub = Version.create(code: 'jub', name: "Jubilee Bible 2000")
VersionSource.create(domain_id: biblestudytools.id, version_id: jub.id, url: "https://www.biblestudytools.com/jub/")

kjv = Version.create(code: 'kjv', name: "King James Version")
kingjamesbibleonline = Domain.create(domain: "kingjamesbibleonline")
VersionSource.create(domain_id: kingjamesbibleonline.id, version_id: kjv.id, url: "https://www.kingjamesbibleonline.org")
VersionSource.create(domain_id: biblestudytools.id, version_id: kjv.id, url: "https://www.biblestudytools.com/kjv/")

leb = Version.create(code: 'leb', name: "Lexham English Bible")
VersionSource.create(domain_id: biblestudytools.id, version_id: leb.id, url: "https://www.biblestudytools.com/leb/")

lsg = Version.create(code: 'lsg', name: "Louis Segond 1910 (French)")
VersionSource.create(domain_id: biblestudytools.id, version_id: lsg.id, url: "https://www.biblestudytools.com/lsg/")

lut = Version.create(code: 'lut', name: "Luther Bible 1912 (German)")
VersionSource.create(domain_id: biblestudytools.id, version_id: lut.id, url: "https://www.biblestudytools.com/lut/")

msg = Version.create(code: 'msg', name: "The Message Bible")
VersionSource.create(domain_id: biblestudytools.id, version_id: msg.id, url: "https://www.biblestudytools.com/msg/")

nas = Version.create(code: 'nas', name: "New American Standard Bible")
VersionSource.create(domain_id: biblestudytools.id, version_id: nas.id, url: "https://www.biblestudytools.com/nas/")

ncv = Version.create(code: 'ncv', name: "New Century Version")
VersionSource.create(domain_id: biblestudytools.id, version_id: ncv.id, url: "https://www.biblestudytools.com/ncv/")

nirv = Version.create(code: 'nirv', name: "New International Reader's Version")
VersionSource.create(domain_id: biblestudytools.id, version_id: nirv.id, url: "https://www.biblestudytools.com/nirv/")

niv = Version.create(code: 'niv', name: "New International Version")
VersionSource.create(domain_id: biblestudytools.id, version_id: niv.id, url: "https://www.biblestudytools.com/niv/")

nkjv = Version.create(code: 'nkjv', name: "New King James Version")
VersionSource.create(domain_id: biblestudytools.id, version_id: nkjv.id, url: "https://www.biblestudytools.com/nkjv/")

nlt = Version.create(code: 'nlt', name: "New Living Translation")
VersionSource.create(domain_id: biblestudytools.id, version_id: nlt.id, url: "https://www.biblestudytools.com/nlt/")

ntv = Version.create(code: 'ntv', name: "Nueva Traducción Viviente")
VersionSource.create(domain_id: biblestudytools.id, version_id: ntv.id, url: "https://www.biblestudytools.com/ntv/")

nvi = Version.create(code: 'nvi', name: "Nueva Versión Internacional")
VersionSource.create(domain_id: biblestudytools.id, version_id: nvi.id, url: "https://www.biblestudytools.com/nvi/")

nvip = Version.create(code: 'nvip', name: "La Biblia del Jubileo 2000")
VersionSource.create(domain_id: biblestudytools.id, version_id: nvip.id, url: "https://www.biblestudytools.com/nvip/")

nrs = Version.create(code: 'nrs', name: "New Revised Standard")
VersionSource.create(domain_id: biblestudytools.id, version_id: nrs.id, url: "https://www.biblestudytools.com/nrs/")

ojb = Version.create(code: 'ojb', name: "Orthodox Jewish Bible")
VersionSource.create(domain_id: biblestudytools.id, version_id: ojb.id, url: "https://www.biblestudytools.com/ojb/")

ost = Version.create(code: 'ost', name: "Ostervald (French)")
VersionSource.create(domain_id: biblestudytools.id, version_id: ost.id, url: "https://www.biblestudytools.com/ost/")

rhe = Version.create(code: 'rhe', name: "Douay-Rheims Catholic Bible")
VersionSource.create(domain_id: biblestudytools.id, version_id: rhe.id, url: "https://www.biblestudytools.com/rhe/")

riv = Version.create(code: 'riv', name: "Riveduta 1927 (Italian)")
VersionSource.create(domain_id: biblestudytools.id, version_id: riv.id, url: "https://www.biblestudytools.com/riv/")

rsv = Version.create(code: 'rsv', name: "Revised Standard Version")
VersionSource.create(domain_id: biblestudytools.id, version_id: rsv.id, url: "https://www.biblestudytools.com/rsv/")

rvr = Version.create(code: 'rvr', name: "La Biblia Reina-Valera (Español)")
VersionSource.create(domain_id: biblestudytools.id, version_id: rvr.id, url: "https://www.biblestudytools.com/rvr/")

sbl = Version.create(code: 'sbl', name: "SBL Greek New Testament")
VersionSource.create(domain_id: biblestudytools.id, version_id: sbl.id, url: "https://www.biblestudytools.com/sbl/")

sev = Version.create(code: 'sev', name: "Sagradas Escrituras (1569) (Español)")
VersionSource.create(domain_id: biblestudytools.id, version_id: sev.id, url: "https://www.biblestudytools.com/sev/")

svv = Version.create(code: 'svv', name: "Statenvertaling (Dutch)")
VersionSource.create(domain_id: biblestudytools.id, version_id: svv.id, url: "https://www.biblestudytools.com/svv/")

tmb = Version.create(code: 'tmb', name: "Third Millennium Bible")
VersionSource.create(domain_id: biblestudytools.id, version_id: tmb.id, url: "https://www.biblestudytools.com/tmb/")

tyn = Version.create(code: 'tyn', name: "Tyndale")
VersionSource.create(domain_id: biblestudytools.id, version_id: tyn.id, url: "https://www.biblestudytools.com/tyn/")

vul = Version.create(code: 'vul', name: "The Latin Vulgate")
VersionSource.create(domain_id: biblestudytools.id, version_id: vul.id, url: "https://www.biblestudytools.com/vul/")

wbt = Version.create(code: 'wbt', name: "The Webster Bible")
VersionSource.create(domain_id: biblestudytools.id, version_id: wbt.id, url: "https://www.biblestudytools.com/wbt/")

web = Version.create(code: 'web', name: "World English Bible")
VersionSource.create(domain_id: biblestudytools.id, version_id: web.id, url: "https://www.biblestudytools.com/web/")

wnt = Version.create(code: 'wnt', name: "Weymouth New Testament")
VersionSource.create(domain_id: biblestudytools.id, version_id: wnt.id, url: "https://www.biblestudytools.com/wnt/")

wyc = Version.create(code: 'wyc', name: "Wycliffe")
VersionSource.create(domain_id: biblestudytools.id, version_id: wyc.id, url: "https://www.biblestudytools.com/wyc/")

ylt = Version.create(code: 'ylt', name: "Young's Literal Translation")
VersionSource.create(domain_id: biblestudytools.id, version_id: ylt.id, url: "https://www.biblestudytools.com/ylt/")