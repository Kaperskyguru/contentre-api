
INSERT INTO "App" ("name","description","website","icon","help","createdAt", "updatedAt") VALUES (
    'Devto',
    'We are a place where coders share, stay up-to-date and grow their careers.',
    'https://dev.to',
    'https://thepracticaldev.s3.amazonaws.com/i/78hs31fax49uwy6kbxyw.png',
    'https://dev.to/settings/extensions',
    NOW(),
    NOW()
);


UPDATE "App" SET "help"='https://medium.com/me/settings', "icon" = 'https://ucbd382d867eda2285bc3724c2e9.previews.dropboxusercontent.com/p/thumb/ABrZNeLCrkOP-QXk3DCi33wKe3j6TXs-31ypjmCw5EstoQ47nPLwm6Wo3PX4RxaOmF3KAEryg21nihBnlogWGCtYazZyTYsRb2_lTngfflydAYMhEvV61aTjvKvUcX_Cwz-mO5sJBdbsUQ_QNLEy6QEOdJjN6MrIL0GwJUZcj-HiF3vtuM0980A5MncCv3nUfzjviQJ_EonbpN9RWRJcHuEr4eJHxLoWv2g6UwXpYC3dirzVTYZ8yujI2I0rAK1EnVPSiMZOLAz8ACoCcvERdHlK6QEOx0jdLb4eov4xEMSujHuyIjYFlkAtjHIajJwSUv9q-RlfUKLAHhEDTIAd27u363kkXqZ_zhTVGS70HJDVO2M22I45TBNnsVnSvNrFErce68zffeMZtyKJspsnpJXoigbiqP1QaSwi5UNOaMNVf5k7O_1VNOpF-wMDDuglQHvQBnnk4d-zBCVkCxhM5HWOrByPjw1j5UqIWfpsVExId5Mr5aHbIDVtDaFcvOe6oP4z8-shocLIGQLes3b_qbiIIETri2q-LlpNKhE_PXO-p2UhIgNbZKjGrnm9Mmlkj7FO9eixTvVMEoUba-AdZ0zBy6Vww8rkQQOb1vnvrzCPAV0Aqb-S1bl0NJ1tL18uFosi4AmHC0q2wxC0UBuc6PILea2IBlAYySnGEORDzB4AKuBL9k9ElLA9TcsHxk5Rv39Jl7Rcr4iAQxqT2JRTXU5LpFPP8NkFGn_DKRT-xLXg_ktQQTfqZvxtExHjS3adrV6yRU8ip5ofp-TJD0XymHcZFzkyEnP7-iVNNShO_V1SjUvCEEXgNabNEqcWTeIvsM51AxDknW0UcmiAf7Goakr5pKkb3megViAdYqeb30ScuzXShHOhYy3R-TK3By35unCeCC1Dpk0__3ZoQm3Eym-M_QNqqOQop6sRPVDflztGejMR6wIC5FStoQG2YNv-On5XKyTgRb9XVTD0l8W5LiG7T1iCTTZ4PyRGtMyG2zlxtzEUM6FkW3YKwQsCOJQ15k3D4diIFEhdCcyhmdQb0vU_LHRmWGrnmCrDq0khrij683l0dglEA0i8q67LZWoKyJUMOvh5cQk9ah8SeRaGGnffmYcCsV4xEBbBvySZAYjxbemL4hV72hwPqiWZr4QT9YJokl2Oq9WYNcHugmPWidYVq8X5BZEsg2uFk8gjY_8UcEz05c5TcgXlfNXbtqSnPkxV-O5mjnxf11BNYYJbiWGOCHV5TXjNv2bnZ7Oub6zNZiffVw4O7swL5y2fwTjuqFE/p.jpeg' WHERE name  = 'Medium';
UPDATE "App" SET "help"='https://hashnode.com/settings/developer', "icon" = 'https://cdn.hashnode.com/res/hashnode/image/upload/v1611902473383/CDyAuTy75.png?auto=compress' WHERE name  = 'Hashnode';