game = window.game || {};


game.configdata = new function(){
	var self = this;
	// 配置信息    只读属性
	self.CANVASID = 'CANVAS_ID';
	self.BGCOLOR ='#000000';
	self.FPS = 60;
	self.RESOURCE_BASEDIR = 'img';
	self.DOWNLOADLIST_PNGS = ['objects.png','boys.png','boy_run.png','bedroom_after.png','bedroom_before.png','largemap.png','uimap2.png','uimap.png','box.png','fashhero.png', 'girlhero.png', 'kanshou.png', 'monster01.png', 'monster02.png', 'monster03.png', 'monster04.png', 'monster05.png', 'monster06.png', 'monster07.png', 'monster08.png', 'monster09.png', 'monster10.png', 'monster11.png', 'monster12.png', 'monster13.png', 'monster14.png', 'monster15.png', 'monster16.png', 'monster17.png', 'monster18.png', 'monster19.png', 'monster20.png', 'monster21.png', 'monster22.png', 'monster23.png', 'monster24.png', 'monster25.png', 'monster26.png', 'monster27.png', 'monster28.png', 'monster29.png', 'monster30.png', 'monster31.png', 'monster32.png', 'monster33.png', 'monster34.png', 'monster35.png', 'monster36.png', 'monster37.png', 'monster38.png', 'monster39.png', 'monster40.png', 'monster41.png', 'monster42.png', 'monster43.png', 'pupetry.png', 'soliderhero.png'];
	self.IMAGEDATA_1 = {"image276":[0,0,480,320],"dooricon4":[1754,1028,32,32],"btn_icon_32":[1394,728,64,64],"prop_icon_087":[1630,1454,64,64],"small_icon023":[1554,1124,32,32],"rynumber2":[413,1516,9,7],"whitenum0":[529,1768,10,9],"prop_icon_007":[1474,1648,64,64],"small_icon075":[1720,1060,32,32],"btn_icon_30":[1416,794,64,64],"prop_icon_073":[1592,660,64,64],"lock01":[1674,190,56,60],"uihead02":[0,1780,320,12],"small_icon064":[1746,892,32,32],"exclamationicon":[1754,994,32,32],"prop_icon_001":[1432,1450,64,64],"image266_001":[1358,1923,64,64],"blackbordernum8.bmp":[656,1994,10,14],"small_icon065":[1746,724,32,32],"small_icon0head":[1748,1658,28,28],"uihead10":[644,1816,97,24],"small_icon034":[1680,1150,32,32],"monstername":[322,2010,256,36],"image166":[632,1950,184,42],"small_icon014":[1167,826,32,32],"magicicon":[660,1294,16,16],"small_icon099":[1732,100,32,32],"lock02":[1674,128,56,60],"rednum5":[818,1217,13,18],"small_icon073":[1720,992,32,32],"bgmap_05":[720,1032,240,106],"mapborder":[0,1804,320,240],"small_icon097":[1730,354,32,32],"small_icon052":[1696,1354,32,32],"prop_icon_064":[1608,66,64,64],"small_icon008":[1742,792,32,32],"small_icon091":[1730,1386,32,32],"bgmap_04":[720,924,240,106],"bitwhitenum7":[713,1994,9,14],"rynumber4":[512,1516,9,7],"small_icon050":[1696,1286,32,32],"prop_icon_071":[1608,528,64,64],"prop_icon_042":[1542,396,64,64],"small_icon006":[1748,1162,32,32],"rynumber6":[479,1516,9,7],"prop_icon_052":[1556,1846,64,64],"small_icon108":[1740,0,32,32],"small_icon058":[1708,418,32,32],"greenbtn01":[623,294,104,26],"headc":[1342,1807,58,42],"image351":[1046,0,240,230],"small_icon003":[1746,758,32,32],"dooricon2":[1776,792,32,32],"gate06":[1310,1375,120,120],"prop_icon_089":[1656,858,64,64],"bottomunlock01":[693,1679,60,18],"prop_icon_048":[1432,1384,64,64],"bluebtn01":[482,294,139,24],"small_icon001":[1742,388,32,32],"small_icon036":[1708,520,32,32],"backsurepanel":[729,264,72,46],"small_icon011":[1708,588,32,32],"btn_icon_11":[1356,1120,64,64],"image174":[391,1730,222,36],"blackbordernum4":[634,1510,10,14],"small_icon067":[1712,924,32,32],"bitwhitenum5":[680,1994,9,14],"image12230":[720,1140,135,31],"whitenum9":[445,1768,10,9],"small_icon086":[1724,690,32,32],"prop_icon_091":[1680,726,64,64],"mapborderbottomleft":[1548,792,54,52],"small_icon031":[1674,588,32,32],"small_icon061":[1748,1094,32,32],"whitenum3":[481,1768,10,9],"small_icon094":[1730,252,32,32],"bgmap_13":[804,540,240,106],"bottomline":[391,1708,227,20],"rednumsub":[391,1768,16,7],"btn_icon_14":[1424,1873,64,64],"small_icon092":[1730,1420,32,32],"mapbordertopleft":[1674,308,54,52],"gate04":[1204,826,120,120],"small_icon033":[1680,1116,32,32],"prop_icon_076":[1614,1124,64,64],"small_icon038":[1686,1012,32,32],"prop_icon_037":[1542,66,64,64],"prop_icon_079":[1620,1050,64,64],"bitwhitenum3":[724,1994,9,14],"small_icon071":[1714,1216,32,32],"borderleftstory":[1766,34,24,270],"prop_icon_028":[1498,1384,64,64],"prop_icon_049":[1476,462,64,64],"btn_icon_08":[1372,1619,64,64],"overback":[1002,1749,104,58],"blackbordernum6.bmp":[658,1510,10,14],"blackbordernum5.bmp":[632,1994,10,14],"prop_icon_003":[1438,1582,64,64],"small_icon018":[1424,2005,32,32],"rednum2":[678,1240,13,18],"coin_01":[660,1348,16,16],"blackbordernum1":[634,1726,8,14],"atack":[1476,660,32,32],"small_icon079":[1722,1822,32,32],"mainmenu":[1188,1236,160,137],"overright":[886,1749,114,54],"prop_icon_056":[1564,1292,64,64],"btn_icon_02":[1326,988,64,64],"small_icon016":[1438,1648,32,32],"blackbordernum7":[670,1510,10,14],"prop_icon_044":[1542,528,64,64],"prop_icon_013":[1476,330,64,64],"btn_icon_24":[1410,264,64,64],"small_icon029":[1674,520,32,32],"rynumbersub":[523,1516,7,7],"prop_icon_082":[1622,1912,64,64],"uihead11":[743,1816,78,24],"bgmap_07":[724,108,240,106],"small_icon005":[1742,422,32,32],"bgmap_50":[1046,610,240,106],"small_icon068":[1714,1114,32,32],"gate05":[1288,122,120,120],"small_icon080":[1722,1856,32,32],"btn_icon_23":[1410,330,64,64],"bottomunlock03":[755,1679,60,24],"prop_icon_101":[1432,1318,64,64],"overmap":[1116,1965,124,74],"small_icon089":[1730,1318,32,32],"dooricon3":[1756,1722,32,32],"gate03":[1288,606,120,120],"gate07":[1288,244,120,120],"coin_03":[660,1312,16,16],"prop_icon_026":[1490,1949,64,64],"small_icon090":[1730,1352,32,32],"rynumberadd":[468,1516,9,7],"prop_icon_017":[1476,594,64,64],"task":[644,1449,37,25],"small_icon083":[1722,1958,32,32],"image266_002":[1350,1236,64,64],"gate12":[1128,1626,120,120],"prop_icon_096":[1610,792,64,64],"rednum7":[678,1300,13,18],"prop_icon_093":[1672,1586,64,64],"small_icon007":[1742,490,32,32],"prop_icon_097":[1554,992,64,64],"image252":[391,1526,300,180],"small_icon098":[1732,66,32,32],"gate10":[1188,1497,120,120],"prop_icon_094":[1674,0,64,64],"prop_icon_080":[1622,1780,64,64],"prop_icon_035":[1540,1648,64,64],"bgmap_06":[724,0,240,106],"bitwhitenum1":[634,1758,5,14],"small_icon043":[1688,1822,32,32],"small_icon082":[1722,1924,32,32],"small_icon025":[1680,1218,32,32],"coin_05":[804,902,16,16],"btn_icon_29":[1408,1685,64,64],"small_icon074":[1720,1026,32,32],"whitenum7":[421,1768,10,9],"small_icon084":[1722,1992,32,32],"small_icon054":[1696,1422,32,32],"uihead07":[856,1203,68,30],"prop_icon_043":[1542,462,64,64],"whitenum5":[433,1768,10,9],"bitwhitenum4":[634,1742,7,14],"bitwhitenum9":[691,1994,9,14],"small_icon039":[1686,1046,32,32],"bottomback":[402,1478,218,36],"flag_004":[1405,1807,64,64],"saleman01":[482,0,240,160],"prop_icon_033":[1526,660,64,64],"bg022":[0,322,400,600],"small_icon106":[1738,1556,32,32],"pointgateback":[1078,1074,98,42],"okbtn":[724,216,72,46],"blackheart":[782,1217,16,16],"flag_002":[1392,988,64,64],"small_icon049":[1696,1252,32,32],"bgleft":[1782,1062,23,600],"prop_icon_066":[1608,198,64,64],"bgmap_20":[482,162,240,106],"prop_icon_081":[1622,1846,64,64],"prop_icon_022":[1488,1028,64,64],"whitenum4":[457,1768,10,9],"rynumber1":[402,1516,9,7],"small_icon051":[1696,1320,32,32],"btn_icon_21":[1410,462,64,64],"prop_icon_041":[1542,330,64,64],"prop_icon_083":[1622,1978,64,64],"prop_icon_045":[1542,594,64,64],"bgmap_26":[1116,1857,221,106],"bgmap_15":[804,756,240,106],"small_icon009":[1742,592,32,32],"prop_icon_075":[1658,660,64,64],"small_icon017":[1416,860,32,32],"prop_icon_047":[1416,1252,64,64],"rednum3":[678,1280,13,18],"prop_icon_031":[1504,1582,64,64],"btn_icon_10":[1350,1302,64,64],"btn_icon_16":[1410,594,64,64],"image271":[693,1641,164,36],"small_icon078":[1722,1788,32,32],"small_icon066":[1708,622,32,32],"prop_icon_019":[1482,786,64,64],"bgmap_08":[804,216,240,106],"sound_on":[1672,1652,36,34],"bgmap_25":[946,1356,240,106],"head_icon1":[1412,902,64,58],"rednum9":[822,902,13,18],"coin_07":[660,1240,16,16],"uihead03":[482,270,190,22],"prop_icon_078":[1620,984,64,64],"defend":[1756,826,32,32],"small_icon076":[1722,858,32,32],"small_icon041":[1688,1754,32,32],"uihead01":[0,1794,320,8],"prop_icon_054":[1556,1978,64,64],"blackbordernum9.bmp":[668,1994,10,14],"btn_icon_25":[1410,198,64,64],"uihead121":[856,1173,85,28],"coin_02":[660,1330,16,16],"btn_icon_27":[1410,66,64,64],"prop_icon_060":[1570,1556,64,64],"overleft":[962,1074,114,54],"btn_icon_04":[1342,1741,64,64],"small_icon103":[1735,1688,32,32],"rynumber5":[490,1516,9,7],"gate01":[1310,1497,120,120],"small_icon010":[1708,554,32,32],"prop_icon_099":[1548,1160,64,64],"rednumadd":[800,1217,16,16],"overatk":[1288,728,104,82],"lock03":[1674,66,56,60],"image339":[1326,812,88,88],"small_icon093":[1730,1454,32,32],"bg01q2":[402,322,400,600],"prop_icon_006":[1471,1751,64,64],"bgmap_53":[632,1842,240,106],"box211":[322,1964,308,44],"prop_icon_068":[1608,330,64,64],"small_icon028":[1674,486,32,32],"bgmap_51":[886,1641,240,106],"small_icon085":[1724,656,32,32],"bgmap_19":[874,1924,240,106],"small_icon045":[1688,1890,32,32],"head_icon2":[1410,660,64,58],"prop_icon_051":[1556,1780,64,64],"prop_icon_074":[1614,726,64,64],"prop_icon_039":[1542,198,64,64],"small_icon027":[1674,452,32,32],"nobtn":[1358,2005,64,38],"prop_icon_090":[1676,792,64,64],"bgmap_17":[874,1816,240,106],"bgmap_03":[402,1370,240,106],"prop_icon_011":[1476,198,64,64],"bitwhitenum8":[702,1994,9,14],"small_icon047":[1688,1958,32,32],"small_icon015":[1372,1685,32,32],"image308":[402,1240,256,128],"prop_icon_062":[1606,1622,64,64],"prop_icon_036":[1542,0,64,64],"hand_001":[1674,252,54,54],"small_icon037":[1708,486,32,32],"prop_icon_034":[1537,1714,64,64],"small_icon035":[1680,1184,32,32],"bitwhitenum6":[735,1994,9,14],"bgmap_12":[804,432,240,106],"prop_icon_004":[1458,962,64,64],"dooricon":[1756,1756,32,32],"uihead05":[1108,826,57,35],"prop_icon_055":[1603,1714,64,64],"sound_off":[1710,1652,36,34],"btn_icon_12":[1422,1120,64,64],"whitenum1":[505,1768,10,9],"bitwhitenum0":[682,1510,9,14],"rynumber3":[501,1516,9,7],"gate15":[1250,1619,120,120],"uihead09":[1326,902,84,84],"uihead04":[1356,1186,55,28],"borderrightstory":[1776,306,20,268],"small_icon081":[1722,1890,32,32],"prop_icon_088":[1636,1520,64,64],"prop_icon_030":[1498,1516,64,64],"small_icon020":[1474,1714,32,32],"small_icon101":[1732,168,32,32],"prop_icon_002":[1432,1516,64,64],"small_icon057":[1702,1524,32,32],"small_icon_whiteborder":[1742,524,32,32],"small_icon019":[1636,1586,32,32],"prop_icon_063":[1608,0,64,64],"purplegemstone":[620,1708,17,16],"small_icon072":[1720,958,32,32],"image343":[1046,232,240,160],"whitenum2":[493,1768,10,9],"bluegemstone":[615,1730,17,16],"small_icon087":[1730,1250,32,32],"gate11":[1288,0,120,120],"prop_icon_065":[1608,132,64,64],"prop_icon_061":[1590,918,64,64],"prop_icon_057":[1548,726,64,64],"rednum0":[678,1340,13,18],"prop_icon_024":[1490,1817,64,64],"prop_icon_015":[1416,1186,64,64],"small_icon095":[1730,286,32,32],"image2123":[966,114,64,40],"prop_icon_070":[1608,462,64,64],"small_icon107":[1738,1590,32,32],"small_icon030":[1674,554,32,32],"prop_icon_010":[1476,132,64,64],"small_icon032":[1674,622,32,32],"heart":[660,1276,16,16],"prop_icon_072":[1548,1226,64,64],"bg01ww":[0,924,400,600],"prop_icon_092":[1669,1688,64,64],"prop_icon_012":[1476,264,64,64],"small_icon088":[1730,1284,32,32],"image2833":[644,1402,45,45],"gate02":[1288,366,120,116],"small_icon062":[1754,926,32,32],"prop_icon_020":[1482,1186,64,64],"goldbox":[615,1766,14,12],"bgmap_02":[644,1708,240,106],"overinfo_002":[946,1464,240,160],"gate13":[1188,1375,120,120],"image240":[720,1173,134,42],"prop_icon_040":[1542,264,64,64],"bgmap_14":[804,648,240,106],"small_icon004":[1742,558,32,32],"gate09":[1310,1375,120,120],"small_icon055":[1696,1456,32,32],"bottomunlock02":[720,1217,60,18],"coin_06":[660,1258,16,16],"small_icon105":[1736,1522,32,32],"bordertopstory":[322,1780,320,60],"prop_icon_050":[1554,1058,64,64],"small_icon022":[1478,926,32,32],"whitenum6":[469,1768,10,9],"small_icon069":[1714,1148,32,32],"image348":[857,1140,58,30],"head_icon3":[966,156,64,58],"redgemstone":[1669,1754,17,16],"btn_icon_22":[1410,396,64,64],"btn_icon_03":[1339,1857,64,64],"prop_icon_084":[1630,1256,64,64],"bitwhitenum2":[746,1994,9,14],"zhanjiscore":[644,1370,45,30],"whitenumsub":[409,1768,10,9],"prop_icon_029":[1498,1450,64,64],"store01":[693,1240,251,399],"image147":[804,864,132,36],"prop_icon_069":[1608,396,64,64],"prop_icon_085":[1630,1322,64,64],"prop_icon_005":[1460,720,64,64],"small_icon040":[1686,1080,32,32],"prop_icon_008":[1476,0,64,64],"prop_icon_098":[1564,1358,64,64],"prop_icon_059":[1564,1490,64,64],"btn_icon_28":[1410,0,64,64],"prop_icon_027":[1498,1318,64,64],"rednum6":[678,1320,13,18],"box98":[1242,1965,114,68],"gate14":[1204,948,120,120],"bgmap_45":[1116,1749,224,106],"bluegemstone2":[615,1748,17,16],"uihead08":[622,1478,69,30],"btn_icon_01":[966,48,64,64],"prop_icon_016":[1476,528,64,64],"rynumber9":[457,1516,9,7],"rynumber7":[435,1516,9,7],"entergate":[402,924,316,314],"small_icon070":[1714,1182,32,32],"flag_003":[1356,1054,64,64],"bgmap_44":[962,972,240,100],"whitenumx":[517,1768,10,9],"small_icon053":[1696,1388,32,32],"uihead06":[1372,1719,18,20],"prop_icon_100":[1422,1054,64,64],"prop_icon_046":[1544,852,64,64],"small_icon048":[1688,1992,32,32],"rednum1":[833,1217,9,18],"prop_icon_102":[1410,528,64,64],"small_icon026":[1674,418,32,32],"rednum4":[823,1816,11,18],"prop_icon_014":[1476,396,64,64],"image255":[674,270,49,19],"bg03":[0,1526,389,252],"hand_002":[1674,362,54,54],"small_icon102":[1732,202,32,32],"gate08":[1288,484,120,120],"mapbordertopright":[1656,924,54,52],"rynumber8":[446,1516,9,7],"blackbordernum0.bmp":[644,1994,10,14],"blackbordernum3.bmp":[622,1510,10,14],"small_icon063":[1748,1624,32,32],"cancelbtn":[966,0,72,46],"prop_icon_067":[1608,264,64,64],"prop_icon_032":[1524,926,64,64],"bgmap_24":[946,1248,240,106],"small_icon100":[1732,134,32,32],"small_icon042":[1688,1788,32,32],"coin_04":[817,1679,16,16],"prop_icon_025":[1490,1883,64,64],"small_icon059":[1748,1128,32,32],"btnbgline":[766,1994,100,42],"rynumber0":[424,1516,9,7],"prop_icon_095":[1608,594,64,64],"small_icon096":[1730,320,32,32],"small_icon012":[1708,452,32,32],"bgmap_09":[804,324,240,106],"btn_icon_26":[1410,132,64,64],"whitenum8":[541,1768,10,9],"small_icon104":[1736,1488,32,32],"small_icon056":[1702,1490,32,32],"bgmap_49":[1046,502,240,106],"small_icon060":[1748,1196,32,32],"bgmap_52":[1046,718,240,106],"bgmap_46":[1046,394,240,106],"small_icon046":[1688,1924,32,32],"prop_icon_058":[1564,1424,64,64],"blackbordernum2.bmp":[646,1510,10,14],"bgmap_23":[946,1140,240,106],"small_icon044":[1688,1856,32,32],"prop_icon_086":[1630,1388,64,64],"small_icon013":[1686,978,32,32],"small_icon077":[1722,1754,32,32],"mapborderbottomright":[1408,1751,54,52],"bgmap_18":[874,1924,240,106],"btn_icon_15":[1424,1939,64,64],"prop_icon_023":[1488,1094,64,64],"box212":[322,1842,308,120],"image346":[1046,826,60,36],"image159":[580,2010,184,34],"prop_icon_077":[1614,1190,64,64],"prop_icon_053":[1556,1912,64,64],"prop_icon_021":[1482,1252,64,64],"image338":[818,1950,36,38],"small_icon002":[1742,456,32,32],"small_icon024":[1610,858,32,32],"image130":[1188,1074,166,160],"prop_icon_009":[1476,66,64,64],"prop_icon_018":[1478,860,64,64],"prop_icon_038":[1542,132,64,64],"rednum8":[678,1260,13,18],"small_icon021":[1754,960,32,32],"bgmap_31":[962,864,240,106]};
	self.IMAGEDATA_2 = {"a_fire07":[445,604,13,33],"effect_a1":[136,946,65,65],"magicman_002":[263,727,64,128],"shopnpc_002":[396,394,64,64],"effect_a4":[130,201,66,65],"effect_b3":[68,914,66,65],"shipnpc_004":[0,654,128,128],"a_effect3":[455,526,54,76],"a_effect2":[401,784,55,76],"effect_d4":[130,675,66,66],"d_effect4":[458,862,54,76],"magicman_003":[225,0,64,128],"b_effect1":[458,940,54,76],"c_effect3":[462,300,54,76],"a_fire04":[514,966,13,33],"effect_a3":[130,743,66,65],"purplebox2":[511,524,32,32],"purplebox3":[269,989,32,32],"attackman_004":[264,522,64,128],"effect_c3":[130,403,66,66],"minernpc_003":[198,529,64,64],"shipnpc_001":[0,524,128,128],"npcblowman_004":[197,810,64,64],"coin_03":[239,1006,16,16],"npcoldman_004":[357,0,64,64],"c_effect1":[462,222,54,76],"a_fire06":[518,104,13,33],"shopnpc_005":[396,196,64,64],"purplebox5":[514,828,32,32],"effect_c1":[130,810,65,66],"effect_c2":[130,335,66,66],"minernpc_005":[198,397,64,64],"brownbox4":[456,460,32,32],"a_fire10":[514,931,13,33],"effect_d1":[136,878,65,66],"npcoldman_002":[264,326,64,64],"nocd":[0,0,156,132],"minernpc_004":[264,260,64,64],"key4":[364,671,14,15],"npcoldman_005":[198,265,64,64],"key5":[357,100,14,15],"key6":[364,654,14,15],"a_fire08":[514,896,13,33],"effect_b2":[130,268,66,65],"coin_05":[105,981,16,16],"npcblowman_001":[198,463,64,64],"magicman_001":[264,130,64,128],"a_fire01":[517,662,13,33],"b_effect3":[462,378,54,76],"buybox_001":[330,522,64,64],"purplebox0":[490,490,32,32],"brownbox0":[71,981,32,32],"shopnpc_003":[396,328,64,64],"brownbox3":[489,0,32,32],"key2":[371,980,14,15],"effect_a2":[130,134,66,65],"shopnpc_001":[264,652,64,64],"bagnpc_001":[423,0,64,64],"d_effect2":[198,727,58,76],"purplebox4":[514,862,32,32],"shipnpc_007":[0,784,128,128],"npcblowman_003":[198,199,64,64],"graybox5":[511,558,32,32],"npcoldman_001":[158,67,64,64],"buybox_003":[335,848,64,64],"minernpc_002":[198,595,64,64],"a_effect1":[462,144,54,76],"graybox3":[514,760,32,32],"graybox2":[357,66,32,32],"coin_04":[203,1006,16,16],"brownbox2":[490,456,32,32],"b_effect4":[462,66,54,76],"gedang":[0,981,35,18],"magicman_004":[203,876,64,128],"b_effect2":[401,940,55,76],"attackman_003":[264,392,64,128],"attackman_002":[395,654,64,128],"purplebox1":[37,981,32,32],"bagnpc_002":[269,857,64,64],"shipnpc_002":[0,264,128,128],"graybox0":[330,654,32,32],"graybox4":[514,794,32,32],"a_fire11":[517,697,13,33],"a_fire12":[518,34,13,33],"effect_d3":[130,607,66,66],"npcoldman_003":[335,914,64,64],"attackman_001":[396,66,64,128],"npcblowman_002":[198,133,64,64],"bagnpc_003":[269,923,64,64],"shipnpc_005":[0,394,128,128],"effect_c4":[130,471,66,66],"d_effect1":[461,682,54,76],"effect_d2":[130,539,66,66],"key3":[371,997,14,15],"minernpc_006":[198,331,64,64],"a_fire05":[518,69,13,33],"c_effect2":[401,862,55,76],"hpman_002":[330,130,64,128],"tablenpc":[396,460,58,64],"effect_b1":[0,914,66,65],"bagnpc_005":[330,456,64,64],"bagnpc_004":[330,390,64,64],"coin_07":[105,999,16,16],"a_fire03":[517,592,13,33],"key1":[366,688,14,15],"hpman_001":[330,260,64,128],"hpman_004":[291,0,64,128],"shipnpc_003":[0,134,128,128],"graybox1":[337,980,32,32],"coin_01":[348,688,16,16],"a_fire02":[517,627,13,33],"hpman_003":[329,718,64,128],"buybox_002":[330,588,64,64],"baoji":[0,1001,35,18],"effect_b4":[158,0,65,65],"coin_06":[330,688,16,16],"coin_02":[221,1006,16,16],"c_effect4":[461,604,54,76],"minernpc_001":[198,661,64,64],"shopnpc_004":[396,262,64,64],"a_fire09":[430,604,13,33],"shipnpc_006":[0,524,128,128],"a_effect4":[458,784,54,76],"d_effect3":[396,526,57,76],"brownbox5":[396,604,32,32],"brownbox1":[303,989,32,32]};
	self.IMAGEDATA_3 = {"finger01": [0, 929, 125, 60], "finger02": [0, 869, 125, 60], "plug01": [203, 654, 203, 215], "plug02": [0, 654, 203, 215], "ceilinglamp01": [0, 374, 264, 147], "stone02": [125, 869, 90, 39], "ceilinglamp02": [0, 0, 325, 207], "ceilingfan02": [0, 521, 257, 133], "ceilingfan01": [0, 207, 264, 167]};
	self.MAXSIZE = {maxWidth:1202,maxHeight:686};
	self.GAME_COLORS = {
		btntxtclr:'#FED28B'
	};
	self.STORESIZE = 15;
	
	self.GAMETXTS ={
		playgame:'开 始 游 戏',
		options:'选 项 设 置',
		regame:'重 新 开 始',
		enterpass:'进 入 关 卡',
		itemdescription:'点击物品查看详情,进行操作',
		bagnote:'背包容量:5件   不可以堆叠',
		loaditem:'装备物品',
		throwitem:'丢弃物品',
		putstore:'放回仓库',
		putbag:'放入背包',
		bagIsnotenough:'背包已满',
		shopTitle:'购买装备',
		shopTxt:'金币购买',
		unlockTxt:'金币解锁技能?',
		lockReady:'解锁技能',
		lockIsReady:'技能可以解锁',
		lockOpen:'技能开启',
		lockClose:'技能锁定',
		lockSuccess:'解锁技能成功！',
		titletxt_flash:'提 示 信 息',
		titletxt_store:'仓库物品',
		notEnoughGold:'金币不足,请购买金币！',
		get:'得到:',
		touchme:'点击使者开始对话',
	};
	
	self.SCENE_NAMES ={
		load:'LOAD_SCENE_NAME',
		login:'LOGIN_SCENE_NAME',
		main:'MAIN_SCENE_NAME',
		over:'GAME_SCENE_NAME',
		shop:'SHOP_SCENE_NAME',
		attack: 'ATTACK_SCENE',
		story:'STORY_SCENE',
		map:'MAP_SCENE',
		stash:'STASH_SCENE',
		failure:'FAILURE_SCENE',
		win:'WIN_SCENE',
		unlock:'UNLOCK_SCENE',
		coach:'COACH_SCEN',
	};
	
	self.MSAGE_TYPE ={
		idle:'IDLE',
		attack:'ATTACK',
		shield:'SHIELD',
		behit:'BEHIT',
		dead:'DEAD',
		monsterdead:'MONSTERDEAD',
		herodead:'HERODEAD',
		shieldfinish:'SHIELDFINISH',
		herobehit:'HEROBEHIT',
		changeHerohp:'CHANGEHEROHP',
		winpoint:'WINPOINT',
		useItem:'USEITEM',
		monseterLostHp:'MONSTERLOSTHP',	
		herojump:'HEROJUMP',
		herosquat:'HEROSQUAT',
		herosquat2idle:'HEROSQUAT2IDLE',
	},
	
	self.EXPUPLV = [300,800,1500,3000];
	
	self.ACHIEVEMENTS = [
		{icon:'head_icon1',description:'游戏采用精密的像素动画风格'},
		{icon:'head_icon2',description:'游戏采用精密的像素动画风格'},
		{icon:'head_icon3',description:'游戏采用精密的像素动画风格'},
	];

	self.mainStageSize ={width:320,height:480};
	//最大携带药剂数量
	self.maxPotion = 5;
	
	//装备动画时间
	self.changItemTime = 500;
	
	self.getObjectSize = function(pngname){
		var rect = self.IMAGEDATA_3[pngname];
		if(rect == null){
			console.log('Error 1:-------------------------------- %s is not exist',pngname);
			return [0,0,0,0];
		}else{
			return rect;
		}
	}
	
	self.getPngSize = function(pngname){
		var rect = self.IMAGEDATA_1[pngname];
		if(rect == null){
			console.log('Error 1:-------------------------------- %s is not exist',pngname);
			return [0,0,0,0];
		}else{
			return rect;
		}
	}
	
	self.getPngSize2 = function(pngname){
		if(self.IMAGEDATA_2[pngname] == null){
			console.log('Error 2: -------------------------------- %s is not exist',pngname);
			return [0,0,0,0];
		}else{
			var initrect = self.IMAGEDATA_2[pngname];
			return _.map(initrect,function(item){return item;});
		}
	}
	
	self.getRectList = function(names){
		var list = _.map(names,function(item){
			return self.getPngSize();
		});
		return list;
	}
	
	self.getList = function(names){
		var list = [];
		for(var i=0;i<names.length;i++){
			rect = self.getPngSize2(names[i]);
			list.push(rect);
		}
	}
	
	self.getEffectFrames = function(name){
		var atlas = new Hilo.TextureAtlas({
		image: game.getImg('uimap2'),
		width: 1024,
		height: 1024,
		frames: [
[348,688,16,16],[221,1006,16,16],[239,1006,16,16],[203,1006,16,16],[105,981,16,16],[330,688,16,16],[105,999,16,16],//coin -6
[71,981,32,32],[303,989,32,32],[490,456,32,32],[489,0,32,32],[456,460,32,32],[396,604,32,32],//brownbox -12
[330,260,64,128],[330,130,64,128],[329,718,64,128],[291,0,64,128],//hpman 13-16
[264,130,64,128],[263,727,64,128],[225,0,64,128],[203,876,64,128],//magicman 17-20
[396,66,64,128],[395,654,64,128],[264,392,64,128],[264,522,64,128],//attackman 21-24
[198,463,64,64],[198,133,64,64],[198,199,64,64],[197,810,64,64],//npcblowman 25-28
[0,524,128,128],[0,264,128,128],[0,134,128,128],[0,654,128,128],[0,394,128,128],[0,524,128,128],[0,784,128,128],//shipnpc 29-35
[264,652,64,64],[396,394,64,64],[396,328,64,64],[396,262,64,64],[396,196,64,64],//shopnpc 36-40
[198,661,64,64],[198,595,64,64],[198,529,64,64],[264,260,64,64],[198,397,64,64],[198,331,64,64],//minernpc 41-46
		],
		sprites: {
			coin: [0, 1, 2, 3,4,5,6],
			boxclose:[7],
			boxopen:[8,9,10,11,12],
			hpman:{from:13,to:16},
		}
	});
	return atlas.getSprite(name);
	}
	
	
	self.getEffectFramesOne = function(name){
		var atlas = new Hilo.TextureAtlas({
		 image: game.getImg('uimap'),
		 width: 2048,
		 height: 2048,
		 frames: [
			[1674,252,54,54],[1674,362,54,54],
		 ],
		 sprites: {
			 hand: [0, 1],
		 }
	   });
	   return atlas.getSprite(name);
	}
};
//关卡数据
game.pointdata = new function(){
	var self = this;
	self.BG_IMG_NAMES =['bgmap_02','bgmap_03','bgmap_04','bgmap_05','bgmap_06','bgmap_07','bgmap_08','bgmap_09','bgmap_12','bgmap_13','bgmap_14','bgmap_15','bgmap_17','bgmap_18','bgmap_19','bgmap_20','bgmap_23','bgmap_24','bgmap_25','bgmap_26','bgmap_31','bgmap_44','bgmap_45','bgmap_46','bgmap_49','bgmap_50','bgmap_51','bgmap_52','bgmap_53'];

	self.indexToName = function(indexlist){
		return _.map(indexlist,function(index){
			return self.BG_IMG_NAMES[index];
		});
	};
	
	
	self.pointDatas = [
		{
			index:0,
			bgs:self.indexToName([0,1,0,2,3]),
			monsternames:['训练木偶','战羊','卡普图拉','蝙蝠','狂暴'],
			monsters:[4,1000,5,20,100],
			state:[0,0,0,0,0],
			box:[1,1,1,1,0],
			coin:[4,0,3,5,0]
		},
		{
			index:1,
			bgs:self.indexToName([7,11,20,12,13]),
			monsternames:['傀儡怪','战羊','卡普图拉','蝙蝠','狂暴'],
			monsters:[19,19,2,4,100],
			state:[0,0,0,0,0],
			box:[1,1,1,1,0],
			coin:[4,4,3,5,0]
		},
	];
	
	
	self.temptxt = "这是一款勇者的游戏，深入地牢，挑战凶险。随着地牢的层层深入，挑战越来越大。游戏采用精密的像素动画风格，玩家要面对各种怪物，升级技能并采取不同的策略击败敌人";
	
	
	self.getPointData = function(index){
		return self.pointDatas[index];
	};
	
	self.door_state2pic = ['dooricon','dooricon2','dooricon3','dooricon4'];
	self.doors = [
				  {name:'初 涉 险 境',x:260,y:300,pointDataIndex:1,doorIndex:0,icon:'gate01',
				  description:'进入地牢的外围，\n查看情况，清除看守',
				  storyimg:'img/saleman01.png',
				  storynote:'随着地牢的层层深入，挑战越来越大。游戏采用精密的像素动画风格，玩家要面对各种怪物，升级技能并采取不同的策略击败敌人。',
				  winnote:'随着地牢的层层深入，挑战越来越大。游戏采用精密的像素动画风格，玩家要面对各种怪物，升级技能并采取不同的策略击败敌人。',
				  },
				  {name:'卡 普 图 拉 之 战',x:520,y:470,pointDataIndex:1,doorIndex:1,icon:'gate02',
				  description:'卡普图拉的凶顽看守，\n消灭他们！',
				  storyimg:'img/story02.png',
				  storynote:'冒险游戏游戏集中于探索未知、解决谜题等情节化和探索性的互动，强调故事线索的发掘，主要考验玩家的观察力和分析能力。',
				  winnote:'随着地牢的层层深入，挑战越来越大。游戏采用精密的像素动画风格，玩家要面对各种怪物，升级技能并采取不同的策略击败敌人。',
				  },
				  {name:'陷 阱',x:330,y:400,pointDataIndex:1,doorIndex:2,icon:'gate03',
				  description:'进入地牢的外围，\n查看情况，清除看守',
				  storyimg:'img/saleman01.png',
				  winnote:'随着地牢的层层深入，挑战越来越大。游戏采用精密的像素动画风格，玩家要面对各种怪物，升级技能并采取不同的策略击败敌人。',
				  storynote:'随着地牢的层层深入，挑战越来越大。游戏采用精密的像素动画风格，玩家要面对各种怪物，升级技能并采取不同的策略击败敌人。',
				  },
				  {name:'半 兽 人',x:360,y:250,pointDataIndex:0,doorIndex:3,icon:'gate04',
				  description:'半兽人非常不好对付，\n凶悍的攻击，\n厚重的皮甲',
				  storyimg:'img/saleman01.png',
				  storynote:'随着地牢的层层深入，挑战越来越大。游戏采用精密的像素动画风格，玩家要面对各种怪物，升级技能并采取不同的策略击败敌人。',
				  winnote:'随着地牢的层层深入，挑战越来越大。游戏采用精密的像素动画风格，玩家要面对各种怪物，升级技能并采取不同的策略击败敌人。',
				  },
				  {name:'夺 取 宝 剑',x:210,y:500,pointDataIndex:0,doorIndex:4,icon:'gate05',
				  description:'进入地牢的外围，\n查看情况，清除看守',
				  storyimg:'img/saleman01.png',
				  storynote:'随着地牢的层层深入，挑战越来越大。游戏采用精密的像素动画风格，玩家要面对各种怪物，升级技能并采取不同的策略击败敌人。',
				  winnote:'随着地牢的层层深入，挑战越来越大。游戏采用精密的像素动画风格，玩家要面对各种怪物，升级技能并采取不同的策略击败敌人。',
				  },
				  {name:'新 的 伙 伴',x:330,y:460,pointDataIndex:0,doorIndex:5,icon:'gate06',
				  description:'进入地牢的外围，\n查看情况，清除看守',
				  storyimg:'img/saleman01.png',
				  storynote:'随着地牢的层层深入，挑战越来越大。游戏采用精密的像素动画风格，玩家要面对各种怪物，升级技能并采取不同的策略击败敌人。',
				  winnote:'随着地牢的层层深入，挑战越来越大。游戏采用精密的像素动画风格，玩家要面对各种怪物，升级技能并采取不同的策略击败敌人。',
				  },
				  {name:'蛮 荒 之 地',x:1000,y:40,pointDataIndex:0,doorIndex:6,icon:'gate07',
				  description:'进入地牢的外围，\n查看情况，清除看守',
				  storyimg:'img/saleman01.png',
				  storynote:'随着地牢的层层深入，挑战越来越大。游戏采用精密的像素动画风格，玩家要面对各种怪物，升级技能并采取不同的策略击败敌人。',
				  winnote:'随着地牢的层层深入，挑战越来越大。游戏采用精密的像素动画风格，玩家要面对各种怪物，升级技能并采取不同的策略击败敌人。',
				  },
				  {name:'最 终 巢 穴',x:750,y:150,pointDataIndex:0,doorIndex:7,icon:'gate08',
				  description:'进入地牢的外围，\n查看情况，清除看守',
				  storyimg:'img/saleman01.png',
				  storynote:'随着地牢的层层深入，挑战越来越大。游戏采用精密的像素动画风格，玩家要面对各种怪物，升级技能并采取不同的策略击败敌人。',
				  winnote:'随着地牢的层层深入，挑战越来越大。游戏采用精密的像素动画风格，玩家要面对各种怪物，升级技能并采取不同的策略击败敌人。',
				  },
	];
};

game.userData = new function(){
	var self = this;
	
	this.heroData = null;
	this.userInfo = null;
	this.coachData = null;
	
	this.saveHeroDataJsonSt = function(){
		var st = JSON.stringify(this.heroData);
		console.log(st);
		localStorage.heroData = st;
		var st2 = JSON.stringify(this.userInfo);
		console.log(st2);
		localStorage.userInfo = st2;
	};
	this.initData = function(){
		console.log('userData.init');
		this.coachData = new game.HeroData();
		if(localStorage.heroData){
			var st = localStorage.heroData;
			var obj = JSON.parse(st);
			console.log(obj);
			this.heroData = obj;
		}else{
			this.heroData =  new game.HeroData();
		}
		if(localStorage.userInfo){
			var st = localStorage.userInfo;
			var obj = JSON.parse(st);
			console.log(obj);
			this.userInfo = obj;
		}else{
			this.userInfo =  new game.UserInfo();
		}
		//this.saveHeroDataJsonSt();
	};
	this.clear = function(){
		localStorage.clear();
	};
	this.initData();
};

game.sounds = new function(){
	var self = this;
	this.sounds_url =[
	'bg91.mp3',   //0
	'levelup.mp3',   //1
	'winover.mp3',   //2
	'deadth.mp3',  //3
	'btn_ting.mp3', //4
	'CoinPickup.mp3', //5
	'player_hurt_male.mp3',//6
	];
	this.play = function(index,loop){
		if(loop == null)
			loop = false;
		audio = Hilo.WebSound.getAudio({
			src:'sound/'+this.sounds_url[index],
			loop:loop
		}).play();
	};
};

game.clock = new function(){
	var self = this;
	self.fpstick = 0;
	self.lasttime = 0;
	self.systemtime = 0;
	self.framecount = 0;
	
	self.tick = function(){
		var now =+ new Date;
		self.fpstick = now - self.lasttime;
		self.framecount++;
		self.systemtime += self.fpstick;
		self.lasttime = now;
	};
	self.getSystemtime = function(){
		return self.systemtime;
	};
	self.getFrame = function(){
		return self.framecount;
	};
}

function layoutImgs(arrayList,img,parent){
	var re = [];
	for(var i=0;i<arrayList.length;i++){
		var item = arrayList[i];
		var bmp = new Hilo.Bitmap({
			image:img,
			rect:game.configdata.getPngSize(item.rect),
			x:item.x,
			y:item.y,
		}).addTo(parent);
		re.push(bmp);
	}
	return re;
}

function createImg(name,position,parentWidth,parentHeight){
	var rect = game.configdata.getPngSize(name);
	var bmp = new Hilo.Bitmap({
		image:img,
		rect:rect,
	});
	if(position == 'center'){
		bmp.x = parentWidth/2 - rect[2]/2,
		bmp.y = parentHeight/2 - rect[3]/2;
	}
	return bmp;
}

function setCenter(viewojb){
	var parent = viewojb.parent;
	viewojb.x = parent.width/2 - viewojb.width/2;
	viewojb.y = parent.height/2 - viewojb.height/2;
}

function addDecorativeSide(img,center) {
	var left = new Hilo.Bitmap({
		image: img,
		rect: game.configdata.getPngSize('bgleft'),
	}).addTo(center);
	var right = new Hilo.Bitmap({
		image: img,
		rect: game.configdata.getPngSize('bgleft'),
	}).addTo(center);
	left.width = right.width = game.configdata.sidewidth;
	left.x =  -game.configdata.sidewidth;
	right.x = center.width;
	left.y = right.y = 0;
	right.height = left.height = center.height;
}

function addfps(x,y,parent){
	var fps = new game.FpsPanel({x:x,y:y});
	parent.addChild(fps);
}

function setLeft(viewojb){
	var parent = viewojb.parent;
	viewojb.x = parent.width/2 - viewojb.width/2;
	viewojb.y = parent.height/2 - viewojb.height/2;
}


