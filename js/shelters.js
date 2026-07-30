/**
 * 대피소 데이터 (전국 주요 대피소)
 * 데이터 출처: 행정안전부 민방위 대피소 (공공데이터포털)
 * 실제 운영 시 API 연동으로 교체 가능
 *
 * 대피소 유형:
 *   - subway     지하철역
 *   - school     학교
 *   - parking    지하주차장
 *   - park       공원
 *   - public     공공건물
 *   - shelter    민방위대피소
 */

var SHELTERS = [
  // ===== 서울특별시 =====
  { name: "강남역 대피소", type: "subway", address: "서울특별시 강남구 강남대로 지하 396", lat: 37.4979, lng: 127.0276, capacity: 5000 },
  { name: "홍대입구역 대피소", type: "subway", address: "서울특별시 마포구 양화로 지하 160", lat: 37.5572, lng: 126.9245, capacity: 4000 },
  { name: "신촌역 대피소", type: "subway", address: "서울특별시 마포구 신촌로 지하 134", lat: 37.5597, lng: 126.9420, capacity: 3000 },
  { name: "서울역 대피소", type: "subway", address: "서울특별시 중구 통일로 지하 1", lat: 37.5547, lng: 126.9707, capacity: 6000 },
  { name: "종로3가역 대피소", type: "subway", address: "서울특별시 종로구 종로 지하 55", lat: 37.5700, lng: 126.9913, capacity: 3500 },
  { name: "왕십리역 대피소", type: "subway", address: "서울특별시 성동구 왕십리로 지하 387", lat: 37.5619, lng: 127.0382, capacity: 4000 },
  { name: "잠실역 대피소", type: "subway", address: "서울특별시 송파구 올림픽로 지하 265", lat: 37.5133, lng: 127.1000, capacity: 5000 },
  { name: "건대입구역 대피소", type: "subway", address: "서울특별시 광진구 능동로 지하 120", lat: 37.5405, lng: 127.0698, capacity: 3500 },
  { name: "노원역 대피소", type: "subway", address: "서울특별시 노원구 노해로 지하 437", lat: 37.6546, lng: 127.0602, capacity: 3000 },
  { name: "청량리역 대피소", type: "subway", address: "서울특별시 동대문구 왕산로 지하 214", lat: 37.5800, lng: 127.0469, capacity: 3500 },
  { name: "을지로3가역 대피소", type: "subway", address: "서울특별시 중구 을지로 지하 99", lat: 37.5663, lng: 126.9910, capacity: 3000 },
  { name: "고속터미널역 대피소", type: "subway", address: "서울특별시 서초구 신반포로 지하 188", lat: 37.5032, lng: 127.0043, capacity: 4000 },
  { name: "사당역 대피소", type: "subway", address: "서울특별시 동작구 사당로 지하 250", lat: 37.4765, lng: 126.9815, capacity: 2500 },
  { name: "노량진역 대피소", type: "subway", address: "서울특별시 동작구 노량진로 지하 145", lat: 37.5133, lng: 126.9420, capacity: 2000 },

  // 서울 학교
  { name: "서울대학교 대피소", type: "school", address: "서울특별시 관악구 관악로 1", lat: 37.4599, lng: 126.9513, capacity: 8000 },
  { name: "연세대학교 대피소", type: "school", address: "서울특별시 서대문구 연세로 50", lat: 37.5651, lng: 126.9389, capacity: 6000 },
  { name: "고려대학교 대피소", type: "school", address: "서울특별시 성북구 안암로 145", lat: 37.5863, lng: 127.0292, capacity: 6000 },
  { name: "한양대학교 대피소", type: "school", address: "서울특별시 성동구 왕십리로 222", lat: 37.5559, lng: 127.0395, capacity: 5000 },
  { name: "경희대학교 대피소", type: "school", address: "서울특별시 동대문구 경희대로 26", lat: 37.5962, lng: 127.0527, capacity: 5000 },

  // 서울 공원
  { name: "올림픽공원 대피소", type: "park", address: "서울특별시 송파구 올림픽로 424", lat: 37.5211, lng: 127.1238, capacity: 10000 },
  { name: "서울숲 대피소", type: "park", address: "서울특별시 성동구 뚝섬로 273", lat: 37.5444, lng: 127.0374, capacity: 5000 },
  { name: "여의도한강공원 대피소", type: "park", address: "서울특별시 영등포구 여의동로 330", lat: 37.5284, lng: 126.9336, capacity: 8000 },
  { name: "반포한강공원 대피소", type: "park", address: "서울특별시 서초구 신반포로 11", lat: 37.5096, lng: 126.9942, capacity: 6000 },
  { name: "뚝섬한강공원 대피소", type: "park", address: "서울특별시 광진구 자양로 139", lat: 37.5350, lng: 127.0670, capacity: 5000 },

  // 서울 공공건물/주차장
  { name: "서울월드컵경기장 대피소", type: "public", address: "서울특별시 마포구 성암로 515", lat: 37.5683, lng: 126.8972, capacity: 12000 },
  { name: "잠실종합운동장 대피소", type: "public", address: "서울특별시 송파구 올림픽로 25", lat: 37.5151, lng: 127.0732, capacity: 10000 },
  { name: "고척스카이돔 대피소", type: "public", address: "서울특별시 구로구 경인로 430", lat: 37.4982, lng: 126.8671, capacity: 8000 },
  { name: "서울시청 대피소", type: "public", address: "서울특별시 중구 세종대로 110", lat: 37.5663, lng: 126.9779, capacity: 3000 },

  // ===== 부산광역시 =====
  { name: "부산역 대피소", type: "subway", address: "부산광역시 동구 중앙대로 206", lat: 35.1144, lng: 129.0402, capacity: 4000 },
  { name: "서면역 대피소", type: "subway", address: "부산광역시 부산진구 부전로 21", lat: 35.1579, lng: 129.0583, capacity: 5000 },
  { name: "해운대해수욕장 대피소", type: "park", address: "부산광역시 해운대구 해운대해변로 264", lat: 35.1610, lng: 129.1600, capacity: 8000 },
  { name: "광안리해수욕장 대피소", type: "park", address: "부산광역시 수영구 광안해변로 219", lat: 35.1530, lng: 129.1185, capacity: 6000 },
  { name: "부산아시아드주경기장 대피소", type: "public", address: "부산광역시 연제구 월드컵대로 444", lat: 35.1984, lng: 129.0946, capacity: 10000 },
  { name: "동의대학교 대피소", type: "school", address: "부산광역시 부산진구 엄광로 176", lat: 35.1345, lng: 129.0643, capacity: 5000 },
  { name: "부산대학교 대피소", type: "school", address: "부산광역시 금정구 부산대학로63번길 2", lat: 35.2317, lng: 129.0822, capacity: 7000 },

  // ===== 대구광역시 =====
  { name: "동대구역 대피소", type: "subway", address: "대구광역시 동구 동대구역로 605", lat: 35.8775, lng: 128.6277, capacity: 4000 },
  { name: "반월당역 대피소", type: "subway", address: "대구광역시 중구 중앙대로 지하 129", lat: 35.8684, lng: 128.5945, capacity: 3000 },
  { name: "경북대학교 대피소", type: "school", address: "대구광역시 북구 대학로 80", lat: 35.8857, lng: 128.6111, capacity: 6000 },
  { name: "대구스타디움 대피소", type: "public", address: "대구광역시 수성구 대구스타디움로 50", lat: 35.8398, lng: 128.6850, capacity: 10000 },
  { name: "두류공원 대피소", type: "park", address: "대구광역시 달서구 두류공원로 178", lat: 35.8472, lng: 128.5397, capacity: 5000 },

  // ===== 인천광역시 =====
  { name: "인천역 대피소", type: "subway", address: "인천광역시 중구 참외전로 23", lat: 37.4755, lng: 126.6179, capacity: 2500 },
  { name: "부평역 대피소", type: "subway", address: "인천광역시 부평구 부평대로 18", lat: 37.4903, lng: 126.7059, capacity: 3000 },
  { name: "송도센트럴파크 대피소", type: "park", address: "인천광역시 연수구 송도국제대로 196", lat: 37.4002, lng: 126.6724, capacity: 8000 },
  { name: "인천아시아드주경기장 대피소", type: "public", address: "인천광역시 계양구 아시아드로 37", lat: 37.5683, lng: 126.7370, capacity: 10000 },
  { name: "인하대학교 대피소", type: "school", address: "인천광역시 미추홀구 인하로 100", lat: 37.4509, lng: 126.6548, capacity: 5000 },

  // ===== 광주광역시 =====
  { name: "광주송정역 대피소", type: "subway", address: "광주광역시 광산구 송정로 31", lat: 35.1392, lng: 126.7937, capacity: 2500 },
  { name: "광주역 대피소", type: "subway", address: "광주광역시 북구 오치로 12", lat: 35.1736, lng: 126.9116, capacity: 2000 },
  { name: "광주월드컵경기장 대피소", type: "public", address: "광주광역시 북구 월드컵길 200", lat: 35.1900, lng: 126.8760, capacity: 8000 },
  { name: "조선대학교 대피소", type: "school", address: "광주광역시 동구 필문대로 309", lat: 35.1394, lng: 126.9256, capacity: 5000 },
  { name: "충장로 대피소", type: "public", address: "광주광역시 동구 충장로 1가", lat: 35.1467, lng: 126.9222, capacity: 3000 },

  // ===== 대전광역시 =====
  { name: "대전역 대피소", type: "subway", address: "대전광역시 동구 중앙로 215", lat: 36.3325, lng: 127.4345, capacity: 3000 },
  { name: "대전시청 대피소", type: "public", address: "대전광역시 서구 둔산로 100", lat: 36.3504, lng: 127.3845, capacity: 4000 },
  { name: "한밭종합운동장 대피소", type: "public", address: "대전광역시 유성구 대덕대로 356", lat: 36.3630, lng: 127.3550, capacity: 8000 },
  { name: "KAIST 대피소", type: "school", address: "대전광역시 유성구 대학로 291", lat: 36.3719, lng: 127.3580, capacity: 5000 },
  { name: "충남대학교 대피소", type: "school", address: "대전광역시 유성구 대학로 99", lat: 36.3710, lng: 127.3460, capacity: 6000 },
  { name: "엑스포과학공원 대피소", type: "park", address: "대전광역시 유성구 엑스포로 313", lat: 36.3750, lng: 127.3780, capacity: 5000 },

  // ===== 울산광역시 =====
  { name: "울산역 대피소", type: "subway", address: "울산광역시 울주군 삼남읍 신복로 127", lat: 35.5500, lng: 129.1360, capacity: 2000 },
  { name: "울산종합운동장 대피소", type: "public", address: "울산광역시 남구 문수야구장로 18", lat: 35.5480, lng: 129.3220, capacity: 8000 },
  { name: "울산대학교 대피소", type: "school", address: "울산광역시 남구 대학로 93", lat: 35.5430, lng: 129.2560, capacity: 5000 },
  { name: "태화강국가정원 대피소", type: "park", address: "울산광역시 중구 북부순환도로 715", lat: 35.5700, lng: 129.3080, capacity: 6000 },

  // ===== 제주특별자치도 =====
  { name: "제주시청 대피소", type: "public", address: "제주특별자치도 제주시 중앙로 25", lat: 33.4996, lng: 126.5312, capacity: 3000 },
  { name: "서귀포시청 대피소", type: "public", address: "제주특별자치도 서귀포시 중앙로 233", lat: 33.2530, lng: 126.5601, capacity: 3000 },
  { name: "제주월드컵경기장 대피소", type: "public", address: "제주특별자치도 서귀포시 월드컵로 48", lat: 33.2810, lng: 126.8020, capacity: 6000 },
  { name: "제주대학교 대피소", type: "school", address: "제주특별자치도 제주시 제주대학로 102", lat: 33.4576, lng: 126.5617, capacity: 4000 },

  // ===== 경기도 =====
  { name: "수원시청 대피소", type: "public", address: "경기도 수원시 영통구 효원로 300", lat: 37.2636, lng: 127.0286, capacity: 3000 },
  { name: "성남시청 대피소", type: "public", address: "경기도 성남시 수정구 중원대로 99", lat: 37.4200, lng: 127.1260, capacity: 2500 },
  { name: "고양시청 대피소", type: "public", address: "경기도 고양시 일산동구 중앙로 1235", lat: 37.6584, lng: 126.8320, capacity: 2500 },
  { name: "용인시청 대피소", type: "public", address: "경기도 용인시 처인구 중부대로 1399", lat: 37.2410, lng: 127.1776, capacity: 2500 },
  { name: "부천시청 대피소", type: "public", address: "경기도 부천시 원미구 중앙로 166", lat: 37.5034, lng: 126.7660, capacity: 2000 },
  { name: "안산시청 대피소", type: "public", address: "경기도 안산시 단원구 중앙대로 511", lat: 37.3219, lng: 126.8309, capacity: 2000 },
  { name: "안양시청 대피소", type: "public", address: "경기도 안양시 만안구 시민대로 205", lat: 37.3943, lng: 126.9516, capacity: 2000 },
  { name: "남양주시청 대피소", type: "public", address: "경기도 남양주시 호평로 355", lat: 37.6362, lng: 127.2165, capacity: 2000 },
  { name: "화성시청 대피소", type: "public", address: "경기도 화성시 남양로 1111", lat: 37.1996, lng: 126.8315, capacity: 2500 },
  { name: "평택시청 대피소", type: "public", address: "경기도 평택시 경기대로 1101", lat: 36.9922, lng: 127.1123, capacity: 2000 },
  { name: "의정부시청 대피소", type: "public", address: "경기도 의정부시 시민로 51", lat: 37.7380, lng: 127.0339, capacity: 2000 },
  { name: "시흥시청 대피소", type: "public", address: "경기도 시흥시 시청로 20", lat: 37.3802, lng: 126.8030, capacity: 1500 },
  { name: "파주시청 대피소", type: "public", address: "경기도 파주시 시청로 35", lat: 37.7600, lng: 126.7799, capacity: 2000 },
  { name: "광명시청 대피소", type: "public", address: "경기도 광명시 시청로 20", lat: 37.4786, lng: 126.8640, capacity: 1500 },
  { name: "김포시청 대피소", type: "public", address: "경기도 김포시 시청로 56", lat: 37.6153, lng: 126.7155, capacity: 1500 },
  { name: "군포시청 대피소", type: "public", address: "경기도 군포시 시청로 130", lat: 37.3615, lng: 126.9363, capacity: 1500 },
  { name: "광주시청 대피소", type: "public", address: "경기도 광주시 경안로 45", lat: 37.4294, lng: 127.2551, capacity: 1500 },
  { name: "이천시청 대피소", type: "public", address: "경기도 이천시 중리암터길 55", lat: 37.2795, lng: 127.4347, capacity: 1500 },
  { name: "오산시청 대피소", type: "public", address: "경기도 오산시 시청로 1", lat: 37.1498, lng: 127.0776, capacity: 1200 },
  { name: "양주시청 대피소", type: "public", address: "경기도 양주시 시민로 1", lat: 37.7853, lng: 127.0458, capacity: 1500 },
  { name: "구리시청 대피소", type: "public", address: "경기도 구리시 시민로 101", lat: 37.5944, lng: 127.1297, capacity: 1200 },
  { name: "안성시청 대피소", type: "public", address: "경기도 안성시 시민대로 111", lat: 37.0080, lng: 127.2795, capacity: 1500 },
  { name: "포천시청 대피소", type: "public", address: "경기도 포천시 시청로 27", lat: 37.8949, lng: 127.2004, capacity: 1200 },
  { name: "의왕시청 대피소", type: "public", address: "경기도 의왕시 시청로 33", lat: 37.3444, lng: 126.9682, capacity: 1200 },
  { name: "하남시청 대피소", type: "public", address: "경기도 하남시 시청길 70", lat: 37.5393, lng: 127.2147, capacity: 1500 },
  { name: "여주시청 대피소", type: "public", address: "경기도 여주시 시청로 1", lat: 37.2984, lng: 127.6378, capacity: 1200 },
  { name: "양평군청 대피소", type: "public", address: "경기도 양평군 양평읍 군청길 16", lat: 37.4914, lng: 127.4874, capacity: 1200 },
  { name: "동두천시청 대피소", type: "public", address: "경기도 동두천시 시청로 49", lat: 37.9027, lng: 127.0606, capacity: 1200 },
  { name: "과천시청 대피소", type: "public", address: "경기도 과천시 관문로 139", lat: 37.4292, lng: 126.9990, capacity: 1500 },
  { name: "가평군청 대피소", type: "public", address: "경기도 가평군 가평읍 군청길 15", lat: 37.8315, lng: 127.5095, capacity: 1000 },
  { name: "연천군청 대피소", type: "public", address: "경기도 연천군 연천읍 군청로 45", lat: 38.0964, lng: 127.0754, capacity: 1000 },

  // ===== 강원도 =====
  { name: "춘천시청 대피소", type: "public", address: "강원도 춘천시 중앙로 1", lat: 37.8813, lng: 127.7295, capacity: 2000 },
  { name: "원주시청 대피소", type: "public", address: "강원도 원주시 중앙로 55", lat: 37.3422, lng: 127.9202, capacity: 2000 },
  { name: "강릉시청 대피소", type: "public", address: "강원도 강릉시 중앙로 120", lat: 37.7519, lng: 128.8761, capacity: 2000 },
  { name: "동해시청 대피소", type: "public", address: "강원도 동해시 중앙로 1", lat: 37.5245, lng: 129.1143, capacity: 1500 },
  { name: "태백시청 대피소", type: "public", address: "강원도 태백시 황지로 21", lat: 37.1613, lng: 128.9858, capacity: 1200 },
  { name: "속초시청 대피소", type: "public", address: "강원도 속초시 중앙로 101", lat: 38.2070, lng: 128.5910, capacity: 1500 },
  { name: "삼척시청 대피소", type: "public", address: "강원도 삼척시 중앙로 350", lat: 37.4497, lng: 129.1656, capacity: 1200 },
  { name: "홍천군청 대피소", type: "public", address: "강원도 홍천군 홍천읍 군청길 21", lat: 37.6972, lng: 127.8883, capacity: 1200 },
  { name: "횡성군청 대피소", type: "public", address: "강원도 횡성군 횡성읍 군청로 115", lat: 37.4915, lng: 127.9848, capacity: 1000 },
  { name: "영월군청 대피소", type: "public", address: "강원도 영월군 영월읍 하송로 210", lat: 37.1836, lng: 128.4613, capacity: 1200 },
  { name: "평창군청 대피소", type: "public", address: "강원도 평창군 평창읍 군청길 68", lat: 37.3704, lng: 128.3901, capacity: 1200 },
  { name: "정선군청 대피소", type: "public", address: "강원도 정선군 정선읍 군청길 37", lat: 37.3805, lng: 128.6614, capacity: 1000 },
  { name: "철원군청 대피소", type: "public", address: "강원도 철원군 갈말읍 군청로 161", lat: 38.1463, lng: 127.3135, capacity: 1000 },
  { name: "화천군청 대피소", type: "public", address: "강원도 화천군 화천읍 군청로 230", lat: 38.1061, lng: 127.7085, capacity: 1000 },
  { name: "양구군청 대피소", type: "public", address: "강원도 양구군 양구읍 군청길 33", lat: 38.1075, lng: 127.9901, capacity: 1000 },
  { name: "인제군청 대피소", type: "public", address: "강원도 인제군 인제읍 군청길 55", lat: 38.0697, lng: 128.1703, capacity: 1000 },
  { name: "고성군청 대피소", type: "public", address: "강원도 고성군 고성읍 군청로 39", lat: 38.3779, lng: 128.4708, capacity: 1000 },
  { name: "양양군청 대피소", type: "public", address: "강원도 양양군 양양읍 군청로 85", lat: 38.0754, lng: 128.6190, capacity: 1000 },

  // ===== 충청북도 =====
  { name: "청주시청 대피소", type: "public", address: "충청북도 청주시 상당구 상당로 82", lat: 36.6420, lng: 127.4890, capacity: 2500 },
  { name: "충주시청 대피소", type: "public", address: "충청북도 충주시 충원대로 1", lat: 36.9910, lng: 127.9260, capacity: 2000 },
  { name: "제천시청 대피소", type: "public", address: "충청북도 제천시 중앙로 62", lat: 37.1302, lng: 128.1910, capacity: 1500 },
  { name: "보은군청 대피소", type: "public", address: "충청북도 보은군 보은읍 군청로 15", lat: 36.4894, lng: 127.7334, capacity: 1000 },
  { name: "옥천군청 대피소", type: "public", address: "충청북도 옥천군 옥천읍 군청로 235", lat: 36.3064, lng: 127.5715, capacity: 1000 },
  { name: "영동군청 대피소", type: "public", address: "충청북도 영동군 영동읍 효령로 303", lat: 36.1750, lng: 127.7833, capacity: 1000 },
  { name: "증평군청 대피소", type: "public", address: "충청북도 증평군 증평읍 군청로 79", lat: 36.7859, lng: 127.5822, capacity: 800 },
  { name: "진천군청 대피소", type: "public", address: "충청북도 진천군 진천읍 중앙로 232", lat: 36.8552, lng: 127.4357, capacity: 1000 },
  { name: "괴산군청 대피소", type: "public", address: "충청북도 괴산군 괴산읍 군청로 105", lat: 36.8155, lng: 127.7866, capacity: 1000 },
  { name: "음성군청 대피소", type: "public", address: "충청북도 음성군 음성읍 중앙로 101", lat: 36.9403, lng: 127.6903, capacity: 1000 },
  { name: "단양군청 대피소", type: "public", address: "충청북도 단양군 단양읍 중앙로 37", lat: 36.9848, lng: 128.3654, capacity: 1000 },

  // ===== 충청남도 =====
  { name: "천안시청 대피소", type: "public", address: "충청남도 천안시 동남구 천안대로 403", lat: 36.8065, lng: 127.1522, capacity: 2500 },
  { name: "공주시청 대피소", type: "public", address: "충청남도 공주시 금학로 80", lat: 36.4456, lng: 127.1190, capacity: 1500 },
  { name: "보령시청 대피소", type: "public", address: "충청남도 보령시 남부로 525", lat: 36.3333, lng: 126.6122, capacity: 1500 },
  { name: "아산시청 대피소", type: "public", address: "충청남도 아산시 시민로 251", lat: 36.7894, lng: 127.0022, capacity: 2000 },
  { name: "서산시청 대피소", type: "public", address: "충청남도 서산시 중앙로 480", lat: 36.7845, lng: 126.4525, capacity: 1500 },
  { name: "논산시청 대피소", type: "public", address: "충청남도 논산시 시민로 210", lat: 36.1872, lng: 127.0988, capacity: 1500 },
  { name: "계룡시청 대피소", type: "public", address: "충청남도 계룡시 번영1로 17", lat: 36.2726, lng: 127.2488, capacity: 1000 },
  { name: "당진시청 대피소", type: "public", address: "충청남도 당진시 시청로 107", lat: 36.8932, lng: 126.6283, capacity: 1500 },
  { name: "금산군청 대피소", type: "public", address: "충청남도 금산군 금산읍 군청로 67", lat: 36.1084, lng: 127.4814, capacity: 1000 },
  { name: "부여군청 대피소", type: "public", address: "충청남도 부여군 부여읍 군청로 25", lat: 36.2756, lng: 126.9094, capacity: 1000 },
  { name: "서천군청 대피소", type: "public", address: "충청남도 서천군 서천읍 군청로 121", lat: 36.0796, lng: 126.6916, capacity: 1000 },
  { name: "청양군청 대피소", type: "public", address: "충청남도 청양군 청양읍 군청로 214", lat: 36.4598, lng: 126.8023, capacity: 800 },
  { name: "홍성군청 대피소", type: "public", address: "충청남도 홍성군 홍성읍 군청로 129", lat: 36.6017, lng: 126.6608, capacity: 1000 },
  { name: "예산군청 대피소", type: "public", address: "충청남도 예산군 예산읍 군청로 22", lat: 36.6808, lng: 126.8448, capacity: 1000 },
  { name: "태안군청 대피소", type: "public", address: "충청남도 태안군 태안읍 군청로 107", lat: 36.7450, lng: 126.2972, capacity: 1000 },

  // ===== 전라북도 =====
  { name: "전주시청 대피소", type: "public", address: "전라북도 전주시 완산구 효자로 225", lat: 35.8242, lng: 127.1480, capacity: 2500 },
  { name: "군산시청 대피소", type: "public", address: "전라북도 군산시 조촌로 100", lat: 35.9676, lng: 126.7368, capacity: 2000 },
  { name: "익산시청 대피소", type: "public", address: "전라북도 익산시 동서로 711", lat: 35.9488, lng: 126.9577, capacity: 2000 },
  { name: "정읍시청 대피소", type: "public", address: "전라북도 정읍시 수성1길 20", lat: 35.5698, lng: 126.8583, capacity: 1500 },
  { name: "남원시청 대피소", type: "public", address: "전라북도 남원시 시청로 66", lat: 35.4160, lng: 127.3903, capacity: 1500 },
  { name: "김제시청 대피소", type: "public", address: "전라북도 김제시 중앙로 27", lat: 35.8030, lng: 126.8808, capacity: 1500 },
  { name: "완주군청 대피소", type: "public", address: "전라북도 완주군 용진읍 군청로 25", lat: 35.9045, lng: 127.1622, capacity: 1000 },
  { name: "진안군청 대피소", type: "public", address: "전라북도 진안군 진안읍 군청로 80", lat: 35.7910, lng: 127.4247, capacity: 1000 },
  { name: "무주군청 대피소", type: "public", address: "전라북도 무주군 무주읍 한두봉길 57", lat: 36.0068, lng: 127.6604, capacity: 1000 },
  { name: "장수군청 대피소", type: "public", address: "전라북도 장수군 장수읍 장무로 1352", lat: 35.6482, lng: 127.5215, capacity: 800 },
  { name: "임실군청 대피소", type: "public", address: "전라북도 임실군 임실읍 치보로 38", lat: 35.6177, lng: 127.2885, capacity: 800 },
  { name: "순창군청 대피소", type: "public", address: "전라북도 순창군 순창읍 한들로 31", lat: 35.3744, lng: 127.1373, capacity: 800 },
  { name: "고창군청 대피소", type: "public", address: "전라북도 고창군 고창읍 군청로 25", lat: 35.4354, lng: 126.7018, capacity: 1000 },
  { name: "부안군청 대피소", type: "public", address: "전라북도 부안군 부안읍 군청로 63", lat: 35.7314, lng: 126.7330, capacity: 1000 },

  // ===== 전라남도 =====
  { name: "목포시청 대피소", type: "public", address: "전라남도 목포시 시청로 180", lat: 34.8118, lng: 126.3922, capacity: 2000 },
  { name: "여수시청 대피소", type: "public", address: "전라남도 여수시 시청로 1", lat: 34.7604, lng: 127.6622, capacity: 2000 },
  { name: "순천시청 대피소", type: "public", address: "전라남도 순천시 중앙로 1", lat: 34.9506, lng: 127.4875, capacity: 2000 },
  { name: "나주시청 대피소", type: "public", address: "전라남도 나주시 시청로 15", lat: 35.0158, lng: 126.7108, capacity: 1500 },
  { name: "광양시청 대피소", type: "public", address: "전라남도 광양시 시청로 50", lat: 34.9407, lng: 127.6959, capacity: 1500 },
  { name: "담양군청 대피소", type: "public", address: "전라남도 담양군 담양읍 중앙로 37", lat: 35.3210, lng: 126.9894, capacity: 1000 },
  { name: "곡성군청 대피소", type: "public", address: "전라남도 곡성군 곡성읍 군청로 18", lat: 35.2820, lng: 127.2894, capacity: 800 },
  { name: "구례군청 대피소", type: "public", address: "전라남도 구례군 구례읍 봉북로 103", lat: 35.2020, lng: 127.4626, capacity: 800 },
  { name: "고흥군청 대피소", type: "public", address: "전라남도 고흥군 고흥읍 군청로 26", lat: 34.6042, lng: 127.2753, capacity: 1000 },
  { name: "보성군청 대피소", type: "public", address: "전라남도 보성군 보성읍 군청길 25", lat: 34.7712, lng: 127.0794, capacity: 1000 },
  { name: "화순군청 대피소", type: "public", address: "전라남도 화순군 화순읍 군청로 27", lat: 35.0655, lng: 126.9866, capacity: 1000 },
  { name: "장흥군청 대피소", type: "public", address: "전라남도 장흥군 장흥읍 군청로 23", lat: 34.6815, lng: 126.9294, capacity: 800 },
  { name: "강진군청 대피소", type: "public", address: "전라남도 강진군 강진읍 군청로 31", lat: 34.6420, lng: 126.7673, capacity: 800 },
  { name: "해남군청 대피소", type: "public", address: "전라남도 해남군 해남읍 군청로 67", lat: 34.5738, lng: 126.5995, capacity: 1000 },
  { name: "영암군청 대피소", type: "public", address: "전라남도 영암군 영암읍 군청로 25", lat: 34.8000, lng: 126.7030, capacity: 1000 },
  { name: "무안군청 대피소", type: "public", address: "전라남도 무안군 무안읍 군청로 175", lat: 34.9907, lng: 126.4815, capacity: 1000 },
  { name: "함평군청 대피소", type: "public", address: "전라남도 함평군 함평읍 군청로 24", lat: 35.0655, lng: 126.5166, capacity: 800 },
  { name: "영광군청 대피소", type: "public", address: "전라남도 영광군 영광읍 군청로 160", lat: 35.2772, lng: 126.5117, capacity: 1000 },
  { name: "장성군청 대피소", type: "public", address: "전라남도 장성군 장성읍 군청로 330", lat: 35.3019, lng: 126.7851, capacity: 1000 },
  { name: "완도군청 대피소", type: "public", address: "전라남도 완도군 완도읍 군청로 62", lat: 34.3110, lng: 126.7546, capacity: 1000 },
  { name: "진도군청 대피소", type: "public", address: "전라남도 진도군 진도읍 군청로 275", lat: 34.4875, lng: 126.2635, capacity: 800 },
  { name: "신안군청 대피소", type: "public", address: "전라남도 신안군 압해읍 본내길 41", lat: 34.8334, lng: 126.3520, capacity: 800 },

  // ===== 경상북도 =====
  { name: "포항시청 대피소", type: "public", address: "경상북도 포항시 남구 시청로 1", lat: 36.0190, lng: 129.3435, capacity: 2500 },
  { name: "경주시청 대피소", type: "public", address: "경상북도 경주시 양남로 36", lat: 35.8562, lng: 129.2248, capacity: 2000 },
  { name: "김천시청 대피소", type: "public", address: "경상북도 김천시 시청로 301", lat: 36.1398, lng: 128.1136, capacity: 2000 },
  { name: "안동시청 대피소", type: "public", address: "경상북도 안동시 풍천면 도청대로 455", lat: 36.5685, lng: 128.7294, capacity: 2000 },
  { name: "구미시청 대피소", type: "public", address: "경상북도 구미시 선산로 1길 50", lat: 36.1195, lng: 128.3445, capacity: 2500 },
  { name: "영주시청 대피소", type: "public", address: "경상북도 영주시 시청로 55", lat: 36.8057, lng: 128.6247, capacity: 1500 },
  { name: "영천시청 대피소", type: "public", address: "경상북도 영천시 시청로 21", lat: 35.9733, lng: 128.9385, capacity: 1500 },
  { name: "상주시청 대피소", type: "public", address: "경상북도 상주시 중앙로 218", lat: 36.4108, lng: 128.1597, capacity: 1500 },
  { name: "문경시청 대피소", type: "public", address: "경상북도 문경시 시청로 1", lat: 36.5870, lng: 128.1867, capacity: 1500 },
  { name: "경산시청 대피소", type: "public", address: "경상북도 경산시 시청로 33", lat: 35.8251, lng: 128.7410, capacity: 2000 },
  { name: "군위군청 대피소", type: "public", address: "경상북도 군위군 군위읍 군청로 79", lat: 36.2394, lng: 128.5726, capacity: 800 },
  { name: "의성군청 대피소", type: "public", address: "경상북도 의성군 의성읍 군청로 55", lat: 36.3522, lng: 128.6988, capacity: 1000 },
  { name: "청송군청 대피소", type: "public", address: "경상북도 청송군 청송읍 군청로 201", lat: 36.4363, lng: 129.0576, capacity: 800 },
  { name: "영양군청 대피소", type: "public", address: "경상북도 영양군 영양읍 군청로 51", lat: 36.6663, lng: 129.1130, capacity: 800 },
  { name: "영덕군청 대피소", type: "public", address: "경상북도 영덕군 영덕읍 군청로 42", lat: 36.4150, lng: 129.3652, capacity: 800 },
  { name: "청도군청 대피소", type: "public", address: "경상북도 청도군 화양읍 다부로 247", lat: 35.6476, lng: 128.7365, capacity: 800 },
  { name: "고령군청 대피소", type: "public", address: "경상북도 고령군 대가야읍 군청로 30", lat: 35.7255, lng: 128.2620, capacity: 800 },
  { name: "성주군청 대피소", type: "public", address: "경상북도 성주군 성주읍 군청로 48", lat: 35.9193, lng: 128.2816, capacity: 800 },
  { name: "칠곡군청 대피소", type: "public", address: "경상북도 칠곡군 왜관읍 군청로 57", lat: 35.9955, lng: 128.4017, capacity: 1000 },
  { name: "예천군청 대피소", type: "public", address: "경상북도 예천군 예천읍 군청로 60", lat: 36.6553, lng: 128.4554, capacity: 800 },
  { name: "봉화군청 대피소", type: "public", address: "경상북도 봉화군 봉화읍 군청로 35", lat: 36.8932, lng: 128.7320, capacity: 800 },
  { name: "울진군청 대피소", type: "public", address: "경상북도 울진군 울진읍 군청로 44", lat: 36.9930, lng: 129.4003, capacity: 1000 },
  { name: "울릉군청 대피소", type: "public", address: "경상북도 울릉군 울릉읍 도동길 19", lat: 37.4810, lng: 130.9056, capacity: 500 },

  // ===== 경상남도 =====
  { name: "창원시청 대피소", type: "public", address: "경상남도 창원시 의창구 중앙대로 300", lat: 35.2280, lng: 128.6812, capacity: 3000 },
  { name: "진주시청 대피소", type: "public", address: "경상남도 진주시 동진로 312", lat: 35.1802, lng: 128.1076, capacity: 2500 },
  { name: "통영시청 대피소", type: "public", address: "경상남도 통영시 시청로 21", lat: 34.8544, lng: 128.4331, capacity: 1500 },
  { name: "사천시청 대피소", type: "public", address: "경상남도 사천시 사천읍 제2방파제길 17", lat: 35.0038, lng: 128.0646, capacity: 1500 },
  { name: "김해시청 대피소", type: "public", address: "경상남도 김해시 시청로 180", lat: 35.2287, lng: 128.8893, capacity: 2500 },
  { name: "밀양시청 대피소", type: "public", address: "경상남도 밀양시 시청로 1", lat: 35.5037, lng: 128.7462, capacity: 1500 },
  { name: "거제시청 대피소", type: "public", address: "경상남도 거제시 거제면 거제중앙로 1500", lat: 34.8804, lng: 128.6212, capacity: 1500 },
  { name: "양산시청 대피소", type: "public", address: "경상남도 양산시 중앙로 111", lat: 35.3350, lng: 129.0373, capacity: 2000 },
  { name: "의령군청 대피소", type: "public", address: "경상남도 의령군 의령읍 군청로 51", lat: 35.3225, lng: 128.2620, capacity: 800 },
  { name: "함안군청 대피소", type: "public", address: "경상남도 함안군 가야읍 군청로 32", lat: 35.2655, lng: 128.4064, capacity: 800 },
  { name: "창녕군청 대피소", type: "public", address: "경상남도 창녕군 창녕읍 군청로 80", lat: 35.5445, lng: 128.4928, capacity: 1000 },
  { name: "고성군청 대피소", type: "public", address: "경상남도 고성군 고성읍 군청로 55", lat: 34.9730, lng: 128.3226, capacity: 800 },
  { name: "남해군청 대피소", type: "public", address: "경상남도 남해군 남해읍 군청로 30", lat: 34.8375, lng: 127.8925, capacity: 800 },
  { name: "하동군청 대피소", type: "public", address: "경상남도 하동군 하동읍 군청로 45", lat: 35.0674, lng: 127.7515, capacity: 800 },
  { name: "산청군청 대피소", type: "public", address: "경상남도 산청군 산청읍 군청로 65", lat: 35.4160, lng: 127.8732, capacity: 800 },
  { name: "함양군청 대피소", type: "public", address: "경상남도 함양군 함양읍 군청로 70", lat: 35.5174, lng: 127.7254, capacity: 800 },
  { name: "거창군청 대피소", type: "public", address: "경상남도 거창군 거창읍 군청로 115", lat: 35.6870, lng: 127.9086, capacity: 1000 },
  { name: "합천군청 대피소", type: "public", address: "경상남도 합천군 합천읍 군청로 40", lat: 35.5665, lng: 128.1659, capacity: 800 }
];

/**
 * 대피소 유형 정보 (이름, 아이콘, 색상)
 */
var SHELTER_TYPES = {
  subway:   { label: "지하철역",     icon: "🚇", color: "#1976D2" },
  school:   { label: "학교",         icon: "🏫", color: "#388E3C" },
  parking:  { label: "지하주차장",   icon: "🅿️", color: "#7B1FA2" },
  park:     { label: "공원",         icon: "🌳", color: "#2E7D32" },
  public:   { label: "공공건물",     icon: "🏢", color: "#E65100" },
  shelter:  { label: "민방위대피소", icon: "⛑️", color: "#D84315" }
};

/**
 * 재해별 대처 방법 가이드
 */
var DISASTER_GUIDES = [
  {
    type: "지진",
    icon: "🌐",
    steps: [
      "1. 떨어지는 물건으로부터 몸을 보호하세요 (탁자 아래로 들어가세요)",
      "2. 머리를 보호하고 몸을 낮추세요",
      "3. 흔들림이 멈출 때까지 그 자리를 유지하세요",
      "4. 유리창이나 무거운 가구에서 떨어져 있으세요",
      "5. 엘리베이터를 사용하지 마시고 계단을 이용하세요",
      "6. 흔들림이 멈추면 가까운 대피소로 이동하세요"
    ]
  },
  {
    type: "화재",
    icon: "🔥",
    steps: [
      "1. 119에 즉시 신고하세요",
      "2. 낮은 자세로 이동하세요 (연기는 위로 올라갑니다)",
      "3. 젖은 수건으로 코와 입을 막으세요",
      "4. 문을 열기 전에 문 표면의 온도를 확인하세요",
      "5. 엘리베이터를 절대 사용하지 마세요",
      "6. 비상구 방향을 확인하고 신속히 대피하세요"
    ]
  },
  {
    type: "태풍/홍수",
    icon: "🌀",
    steps: [
      "1. 외출을 삼가고 실내에 머무르세요",
      "2. 창문을 단단히 닫고 파손된 부분을 보수하세요",
      "3. 낮은 지역(지하공간, 하천변)에서 벗어나세요",
      "4. 물에 잠긴 도로는 절대 건너지 마세요",
      "5. 라디오나 앱으로 기상 상황을 확인하세요",
      "6. 침수 위험이 있으면 높은 곳이나 대피소로 이동하세요"
    ]
  },
  {
    type: "폭설",
    icon: "❄️",
    steps: [
      "1. 외출을 자제하고 실내에 머무르세요",
      "2. 따뜻하게 입고 체온을 유지하세요",
      "3. 지붕에 쌓인 눈은 안전하게 제거하세요",
      "4. 결빙 구간에서는 미끄러지지 않도록 주의하세요",
      "5. 차량 운행을 삼가고 대중교통을 이용하세요",
      "6. 노약자는 외출 시 반드시 보호자와 동행하세요"
    ]
  },
  {
    type: "폭염",
    icon: "☀️",
    steps: [
      "1. 야외 활동을 최소화하고 실내에 머무르세요",
      "2. 수시로 물을 마시세요 (갈증이 없어도)",
      "3. 햇빛을 피하고 그늘에서 휴식하세요",
      "4. 시원한 옷을 입고 모자/양산을 착용하세요",
      "5. 냉방기가 있는 장소(도서관, 쇼핑몰 등)를 이용하세요",
      "6. 어지러움이나 구토 증상이 있으면 즉시 119에 신고하세요"
    ]
  }
];

/**
 * 전국 지역별 재난 상황 데이터 (초기값은 전부 안전)
 * 실시간 뉴스에서 자동 업데이트됨
 */
var REGION_SITUATIONS = {
  "서울특별시":     { status: "안전", level: "normal", message: "현재 특별한 재난 상황이 없습니다." },
  "부산광역시":     { status: "안전", level: "normal", message: "현재 특별한 재난 상황이 없습니다." },
  "대구광역시":     { status: "안전", level: "normal", message: "현재 특별한 재난 상황이 없습니다." },
  "인천광역시":     { status: "안전", level: "normal", message: "현재 특별한 재난 상황이 없습니다." },
  "대전광역시":     { status: "안전", level: "normal", message: "현재 특별한 재난 상황이 없습니다." },
  "울산광역시":     { status: "안전", level: "normal", message: "현재 특별한 재난 상황이 없습니다." },
  "세종특별자치시": { status: "안전", level: "normal", message: "현재 특별한 재난 상황이 없습니다." },
  "경기도":         { status: "안전", level: "normal", message: "현재 특별한 재난 상황이 없습니다." },
  "강원도":         { status: "안전", level: "normal", message: "현재 특별한 재난 상황이 없습니다." },
  "충청북도":       { status: "안전", level: "normal", message: "현재 특별한 재난 상황이 없습니다." },
  "충청남도":       { status: "안전", level: "normal", message: "현재 특별한 재난 상황이 없습니다." },
  "전라북도":       { status: "안전", level: "normal", message: "현재 특별한 재난 상황이 없습니다." },
  "전남광주통합특별시": { status: "안전", level: "normal", message: "현재 특별한 재난 상황이 없습니다." },
  "경상북도":       { status: "안전", level: "normal", message: "현재 특별한 재난 상황이 없습니다." },
  "경상남도":       { status: "안전", level: "normal", message: "현재 특별한 재난 상황이 없습니다." },
  "제주특별자치도": { status: "안전", level: "normal", message: "현재 특별한 재난 상황이 없습니다." },
  "전국":           { status: "안전", level: "normal", message: "현재 전국적으로 특별한 재난 상황이 없습니다." }
};

/**
 * 지역 약어 → 정식 명칭 매핑 (검색 및 주소 파싱용)
 */
var REGION_SHORT_NAMES = {
  "서울": "서울특별시", "부산": "부산광역시", "대구": "대구광역시",
  "인천": "인천광역시", "대전": "대전광역시",
  "울산": "울산광역시", "세종": "세종특별자치시", "경기": "경기도",
  "강원": "강원도", "충북": "충청북도", "충남": "충청남도",
  "전북": "전라북도",
  "전남광주": "전남광주통합특별시", "전남": "전남광주통합특별시",
  "광주": "전남광주통합특별시", "광주광역시": "전남광주통합특별시",
  "전라남도": "전남광주통합특별시",
  "경북": "경상북도", "경남": "경상남도", "제주": "제주특별자치도"
};

/**
 * 전국 지역별 사고 특보 데이터 (초기값은 전부 안전)
 * 실시간 뉴스에서 자동 업데이트됨
 */
var REGION_ACCIDENTS = {
  "서울특별시":     { status: "안전", level: "normal", message: "현재 보고된 사고가 없습니다." },
  "부산광역시":     { status: "안전", level: "normal", message: "현재 보고된 사고가 없습니다." },
  "대구광역시":     { status: "안전", level: "normal", message: "현재 보고된 사고가 없습니다." },
  "인천광역시":     { status: "안전", level: "normal", message: "현재 보고된 사고가 없습니다." },
  "대전광역시":     { status: "안전", level: "normal", message: "현재 보고된 사고가 없습니다." },
  "울산광역시":     { status: "안전", level: "normal", message: "현재 보고된 사고가 없습니다." },
  "세종특별자치시": { status: "안전", level: "normal", message: "현재 보고된 사고가 없습니다." },
  "경기도":         { status: "안전", level: "normal", message: "현재 보고된 사고가 없습니다." },
  "강원도":         { status: "안전", level: "normal", message: "현재 보고된 사고가 없습니다." },
  "충청북도":       { status: "안전", level: "normal", message: "현재 보고된 사고가 없습니다." },
  "충청남도":       { status: "안전", level: "normal", message: "현재 보고된 사고가 없습니다." },
  "전라북도":       { status: "안전", level: "normal", message: "현재 보고된 사고가 없습니다." },
  "전남광주통합특별시": { status: "안전", level: "normal", message: "현재 보고된 사고가 없습니다." },
  "경상북도":       { status: "안전", level: "normal", message: "현재 보고된 사고가 없습니다." },
  "경상남도":       { status: "안전", level: "normal", message: "현재 보고된 사고가 없습니다." },
  "제주특별자치도": { status: "안전", level: "normal", message: "현재 보고된 사고가 없습니다." },
  "전국":           { status: "안전", level: "normal", message: "현재 전국적으로 보고된 사고가 없습니다." }
};

/**
 * 시/도별 중심 좌표 (거리 계산용)
 */
var REGION_CENTERS = {
  "서울특별시":     { lat: 37.5665, lng: 126.9780 },
  "부산광역시":     { lat: 35.1796, lng: 129.0756 },
  "대구광역시":     { lat: 35.8714, lng: 128.6014 },
  "인천광역시":     { lat: 37.4563, lng: 126.7052 },
  "대전광역시":     { lat: 36.3504, lng: 127.3845 },
  "울산광역시":     { lat: 35.5384, lng: 129.3114 },
  "세종특별자치시": { lat: 36.4800, lng: 127.2890 },
  "경기도":         { lat: 37.2636, lng: 127.0286 },
  "강원도":         { lat: 37.8228, lng: 128.1555 },
  "충청북도":       { lat: 36.6370, lng: 127.4890 },
  "충청남도":       { lat: 36.5570, lng: 126.7790 },
  "전라북도":       { lat: 35.7175, lng: 127.1530 },
  "전남광주통합특별시": { lat: 34.9883, lng: 126.6588 },
  "경상북도":       { lat: 36.2486, lng: 128.6640 },
  "경상남도":       { lat: 35.2380, lng: 128.6920 },
  "제주특별자치도": { lat: 33.3617, lng: 126.5330 }
};

/**
 * 사고 키워드 (뉴스 헤드라인에서 사고 유형 추출)
 */
var ACCIDENT_KEYWORDS = [
  { keywords: ["화재", "불이", "발화", "연기"], status: "화재발생", level: "danger" },
  { keywords: ["교통사고", "충돌", "전복", "추락사고"], status: "교통사고", level: "watch" },
  { keywords: ["가스폭발", "폭발"], status: "가스폭발", level: "danger" },
  { keywords: ["붕괴", "무너"], status: "건물붕괴", level: "danger" },
  { keywords: ["가스누출", "누출"], status: "가스누출", level: "watch" },
  { keywords: ["정전", "단전"], status: "정전", level: "watch" },
  { keywords: ["침수"], status: "침수", level: "danger" },
  { keywords: ["산사태"], status: "산사태", level: "danger" }
];

/**
 * 재난(기상) 키워드 (뉴스 헤드라인에서 재난 유형 추출)
 */
var WEATHER_KEYWORDS = [
  { keywords: ["호우", "폭우", "홍수"], status: "호우주의보", level: "watch" },
  { keywords: ["폭염경보"], status: "폭염경보", level: "danger" },
  { keywords: ["폭염", "폭서", "무더위"], status: "폭염주의보", level: "watch" },
  { keywords: ["태풍"], status: "태풍주의보", level: "watch" },
  { keywords: ["대설", "폭설"], status: "대설주의보", level: "watch" },
  { keywords: ["미세먼지"], status: "미세먼지주의보", level: "watch" },
  { keywords: ["한파", "강추위"], status: "한파주의보", level: "watch" },
  { keywords: ["건조"], status: "건조주의보", level: "watch" },
  { keywords: ["강풍", "풍량"], status: "강풍주의보", level: "watch" },
  { keywords: ["지진"], status: "지진발생", level: "danger" },
  { keywords: ["낙뢰", "번개"], status: "낙뢰주의보", level: "watch" }
];

/**
 * 시/도별 하위 시/군/구 목록
 */
var REGION_DISTRICTS = {
  "서울특별시": ["강남구","강동구","강북구","강서구","관악구","광진구","구로구","금천구","노원구","도봉구","동대문구","동작구","마포구","서대문구","서초구","성동구","성북구","송파구","양천구","영등포구","용산구","은평구","종로구","중구","중랑구"],
  "부산광역시": ["강서구","금정구","남구","동구","동래구","부산진구","북구","사상구","사하구","서구","수영구","연제구","영도구","중구","해운대구","기장군"],
  "대구광역시": ["남구","달서구","달성군","동구","북구","서구","수성구","중구"],
  "인천광역시": ["계양구","남동구","동구","미추홀구","부평구","서구","연수구","중구","강화군","옹진군"],
  "대전광역시": ["대덕구","동구","서구","유성구","중구"],
  "울산광역시": ["남구","동구","북구","중구","울주군"],
  "세종특별자치시": ["조치원익","연동면","부강면","금남면","장군면","연서면","전의면","전동면","소정면","한솔동","새롬동","나성동","다정동","도담동","어진동","해밀동","아름동","종촌동","고운동","보람동","대평동","반곡동"],
  "경기도": ["수원시","성남시","고양시","용인시","부천시","안산시","안양시","남양주시","화성시","평택시","의정부시","시흥시","파주시","광명시","김포시","군포시","광주시","이천시","오산시","양주시","구리시","안성시","포천시","의왕시","하남시","여주시","양평군","동두천시","과천시","가평군","연천군"],
  "강원도": ["춘천시","원주시","강릉시","동해시","태백시","속초시","삼척시","홍천군","횡성군","영월군","평창군","정선군","철원군","화천군","양구군","인제군","고성군","양양군"],
  "충청북도": ["청주시","충주시","제천시","보은군","옥천군","영동군","증평군","진천군","괴산군","음성군","단양군"],
  "충청남도": ["천안시","공주시","보령시","아산시","서산시","논산시","계룡시","당진시","금산군","부여군","서천군","청양군","홍성군","예산군","태안군"],
  "전라북도": ["전주시","군산시","익산시","정읍시","남원시","김제시","완주군","진안군","무주군","장수군","임실군","순창군","고창군","부안군"],
  "전남광주통합특별시": ["광산구","남구","동구","북구","서구","목포시","여수시","순천시","나주시","광양시","담양군","곡성군","구례군","고흥군","보성군","화순군","장흥군","강진군","해남군","영암군","무안군","함평군","영광군","장성군","완도군","진도군","신안군"],
  "경상북도": ["포항시","경주시","김천시","안동시","구미시","영주시","영천시","상주시","문경시","경산시","군위군","의성군","청송군","영양군","영덕군","청도군","고령군","성주군","칠곡군","예천군","봉화군","울진군","울릉군"],
  "경상남도": ["창원시","진주시","통영시","사천시","김해시","밀양시","거제시","양산시","의령군","함안군","창녕군","고성군","남해군","하동군","산청군","함양군","거창군","합천군"],
  "제주특별자치도": ["제주시","서귀포시"]
};

/**
 * 긴급 연락처
 */
var EMERGENCY_CONTACTS = [
  { name: "119", label: "구급·구조", phone: "119", icon: "🚑" },
  { name: "112", label: "경찰", phone: "112", icon: "🚓" },
  { name: "110", label: "정부민원안내", phone: "110", icon: "🏛️" },
  { name: "행정안전부", label: "재난문자", phone: "02-2100-3399", icon: "📞" }
];
