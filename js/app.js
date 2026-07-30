/**
 * 대피모아 - 메인 애플리케이션 로직
 * ============================================
 *
 * MVP 핵심 기능:
 *   1. 실시간으로 가장 가까운 대피 장소 (Geolocation + Leaflet 지도)
 *   2. 실시간 현 상황 (재난/기상 특보)
 *   3. 실시간 뉴스 (Google News RSS)
 *
 * Should 기능:
 *   1. 재해 발생 시 대처 방법 가이드
 *   2. 긴급 연락처 버튼 + 현재 위치 공유
 */

(function () {
  "use strict";

  // ===== 전역 상태 =====
  var state = {
    userLat: null,
    userLng: null,
    userAddress: null,
    userRegion: null,
    locationKnown: false,
    currentTab: "disaster",
    currentSearch: "",
    situationExpanded: false,
    map: null,
    userMarker: null,
    shelterMarkers: [],
    nearestShelters: []
  };

  // ===== 유틸리티 함수 =====

  /**
   * Haversine 공식 — 두 좌표 간 거리(km) 계산
   */
  function haversine(lat1, lng1, lat2, lng2) {
    var R = 6371; // 지구 반경 (km)
    var dLat = toRad(lat2 - lat1);
    var dLng = toRad(lng2 - lng1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function toRad(deg) {
    return deg * (Math.PI / 180);
  }

  /**
   * 거리를 사용자 친화적으로 포맷
   */
  function formatDistance(km) {
    if (km < 1) {
      return Math.round(km * 1000) + " m";
    }
    return km.toFixed(2) + " km";
  }

  /**
   * 시간 포맷 (분 전 / 시간 전)
   */
  function timeAgo(dateStr) {
    var now = new Date();
    var date = new Date(dateStr);
    var diff = Math.floor((now - date) / 1000);
    if (diff < 60) return "방금 전";
    if (diff < 3600) return Math.floor(diff / 60) + "분 전";
    if (diff < 86400) return Math.floor(diff / 3600) + "시간 전";
    return Math.floor(diff / 86400) + "일 전";
  }

  // ===== Geolocation =====

  function initGeolocation() {
    if (!navigator.geolocation) {
      handleLocationError("이 브라우저에서는 위치 서비스를 지원하지 않습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      onLocationSuccess,
      onLocationError,
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }

  function onLocationSuccess(position) {
    state.userLat = position.coords.latitude;
    state.userLng = position.coords.longitude;
    state.locationKnown = true;

    // localStorage에 저장 (새로고침 시 복원용)
    localStorage.setItem("daepimoa_location", "true");
    localStorage.setItem("daepimoa_lat", state.userLat.toString());
    localStorage.setItem("daepimoa_lng", state.userLng.toString());

    // 위치 배너 업데이트
    document.getElementById("userCoords").textContent =
      "위도 " + state.userLat.toFixed(6) + " / 경도 " + state.userLng.toFixed(6);

    // 토글 버튼 업데이트
    updateToggleButton(true);

    // 역지오코딩 (도로명 주소)
    reverseGeocode(state.userLat, state.userLng);

    // 지도 이동
    updateMapLocation(state.userLat, state.userLng, true);

    // 가장 가까운 대피소 찾기
    findNearestShelters();
  }

  function onLocationError(error) {
    // 이미 저장된 위치가 있고, 권한 거부가 아닌 경우 이전 위치 유지
    if (state.locationKnown && error.code !== 1) {
      var btn = document.getElementById("locationToggleBtn");
      if (btn) btn.disabled = false;
      return;
    }

    var msg;
    switch (error.code) {
      case 1:
        msg = "위치 접근이 거부되었습니다. 설정에서 위치 접근을 허용해 주세요.";
        localStorage.setItem("daepimoa_location", "false");
        break;
      case 2:
        msg = "위치를 확인할 수 없습니다. 네트워크 연결을 확인해 주세요.";
        break;
      case 3:
        msg = "위치 확인 시간이 초과되었습니다. 다시 시도해 주세요.";
        break;
      default:
        msg = "위치를 확인하는 중 오류가 발생했습니다.";
    }
    handleLocationError(msg);
  }

  function handleLocationError(msg) {
    var banner = document.getElementById("locationBanner");
    banner.classList.remove("loading");
    document.getElementById("userAddress").textContent = "⚠️ " + msg;
    document.getElementById("userCoords").textContent = "위치 권한을 허용하면 가까운 대피소를 확인할 수 있습니다.";

    state.userRegion = "서울특별시";
    state.locationKnown = false;
    updateToggleButton(false);
    renderSituation();
  }

  // ===== 위치 공유 토글 =====

  function updateToggleButton(isSharing) {
    var btn = document.getElementById("locationToggleBtn");
    if (!btn) return;
    if (isSharing) {
      btn.textContent = "✕ 위치 사용 중지";
      btn.classList.add("sharing");
      btn.disabled = false;
    } else {
      btn.textContent = "📍 내 위치 찾기";
      btn.classList.remove("sharing");
      btn.disabled = false;
    }
  }

  function startLocationSharing() {
    var btn = document.getElementById("locationToggleBtn");
    if (btn) btn.disabled = true;

    var banner = document.getElementById("locationBanner");
    banner.classList.add("loading");
    document.getElementById("userAddress").textContent = "위치를 확인하는 중...";

    localStorage.setItem("daepimoa_location", "true");
    initGeolocation();
  }

  function stopLocationSharing() {
    var defaultLat = 37.5665;
    var defaultLng = 126.9780;

    state.userLat = defaultLat;
    state.userLng = defaultLng;
    state.userAddress = null;
    state.userRegion = "서울특별시";
    state.locationKnown = false;

    localStorage.setItem("daepimoa_location", "false");

    // 배너 업데이트
    var banner = document.getElementById("locationBanner");
    banner.classList.remove("loading");
    document.getElementById("userAddress").textContent = "내 위치를 찾으면 가까운 대피소와 현 상황을 확인할 수 있습니다.";
    document.getElementById("userCoords").textContent = "";

    updateToggleButton(false);

    // 지도를 서울로 이동
    updateMapLocation(defaultLat, defaultLng, false);

    // 대피소 재검색
    findNearestShelters();

    // 현 상황 재렌더링
    renderSituation();
  }

  function setupLocationToggle() {
    var btn = document.getElementById("locationToggleBtn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      if (state.locationKnown) {
        stopLocationSharing();
      } else {
        startLocationSharing();
      }
    });
  }

  function hideLoading() {
    var overlay = document.getElementById("loadingOverlay");
    overlay.classList.add("hidden");
    setTimeout(function () {
      overlay.style.display = "none";
    }, 500);
  }

  // ===== 역지오코딩 (Nominatim / OpenStreetMap) =====

  function detectRegion(address) {
    if (!address) return null;
    var regions = Object.keys(REGION_SITUATIONS);
    for (var i = 0; i < regions.length; i++) {
      if (address.indexOf(regions[i]) >= 0) return regions[i];
    }
    var shortKeys = Object.keys(REGION_SHORT_NAMES);
    for (var i = 0; i < shortKeys.length; i++) {
      if (address.indexOf(shortKeys[i]) >= 0) return REGION_SHORT_NAMES[shortKeys[i]];
    }
    return null;
  }

  function reverseGeocode(lat, lng) {
    var url =
      "https://nominatim.openstreetmap.org/reverse?format=json&lat=" +
      lat + "&lon=" + lng + "&accept-language=ko&zoom=18";

    fetch(url, { headers: { "Accept": "application/json" } })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data && data.display_name) {
          state.userAddress = data.display_name;
          document.getElementById("userAddress").textContent = data.display_name;

          // address 객체에서 지역 추출 시도, 실패 시 display_name에서 파싱
          var addrObj = data.address || {};
          var regionSrc = addrObj.state || addrObj.city || addrObj.county || data.display_name;
          state.userRegion = detectRegion(regionSrc) || detectRegion(data.display_name) || "서울특별시";
        } else {
          state.userAddress = "주소를 확인할 수 없습니다";
          document.getElementById("userAddress").textContent = state.userAddress;
          state.userRegion = "서울특별시";
        }
        renderSituation();
      })
      .catch(function () {
        state.userAddress = "주소를 확인할 수 없습니다";
        document.getElementById("userAddress").textContent = state.userAddress;
        state.userRegion = "서울특별시";
        renderSituation();
      });
  }

  // ===== 지도 초기화 (Leaflet + OpenStreetMap) =====

  function initMap(lat, lng) {
    state.map = L.map("map", {
      zoomControl: true,
      scrollWheelZoom: false
    }).setView([lat, lng], 14);

    // OpenStreetMap 타일
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(state.map);

    // 사용자 위치 마커 (주황색)
    var userIcon = L.divIcon({
      html: '<div style="width:20px;height:20px;background:#FF6B35;border:3px solid #FFF;border-radius:50%;box-shadow:0 0 10px rgba(255,107,53,0.6);"></div>',
      className: "user-marker",
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    state.userMarker = L.marker([lat, lng], { icon: userIcon })
      .addTo(state.map)
      .bindPopup("<b>📍 기본 위치 (서울)</b>");
  }

  function updateMapLocation(lat, lng, isMyLocation) {
    if (!state.map) return;
    state.map.setView([lat, lng], 14);
    if (state.userMarker) {
      state.userMarker.setLatLng([lat, lng]);
      var popupText = isMyLocation ? "<b>📍 내 현재 위치</b>" : "<b>📍 기본 위치 (서울)</b>";
      state.userMarker.setPopupContent(popupText);
    }
  }

  // ===== 가장 가까운 대피소 찾기 =====

  function findNearestShelters() {
    // 모든 대피소에 거리 계산
    var sheltersWithDist = SHELTERS.map(function (s) {
      return Object.assign({}, s, {
        distance: haversine(state.userLat, state.userLng, s.lat, s.lng)
      });
    });

    // 거리순 정렬
    sheltersWithDist.sort(function (a, b) {
      return a.distance - b.distance;
    });

    // 반경 5km 이내 대피소 (없으면 가장 가까운 5개)
    var nearby = sheltersWithDist.filter(function (s) { return s.distance <= 5; });
    state.nearestShelters = nearby.length > 0 ? nearby.slice(0, 10) : sheltersWithDist.slice(0, 5);

    // 가장 가까운 대피소 렌더링
    renderNearestShelter(state.nearestShelters[0]);

    // 주변 대피소 목록 렌더링
    renderShelterList(state.nearestShelters);

    // 지도에 대피소 마커 추가
    addShelterMarkers(state.nearestShelters);
  }

  function renderNearestShelter(shelter) {
    if (!shelter) return;

    var typeInfo = SHELTER_TYPES[shelter.type] || SHELTER_TYPES.shelter;

    document.getElementById("nsType").innerHTML = typeInfo.icon + " " + typeInfo.label;
    document.getElementById("nsName").textContent = shelter.name;
    document.getElementById("nsDistance").innerHTML =
      formatDistance(shelter.distance) + " <small>" + (shelter.distance < 1 ? "" : "km") + "</small>";

    document.getElementById("nsDetail").innerHTML =
      '<span>📍 ' + shelter.address + '</span>' +
      '<span>👥 수용인원 ' + shelter.capacity.toLocaleString() + '명</span>';

    // 길 찾기 버튼 (구글 지도)
    var dirUrl = "https://www.google.com/maps/dir/?api=1&origin=" +
      state.userLat + "," + state.userLng +
      "&destination=" + shelter.lat + "," + shelter.lng +
      "&travelmode=walking";
    document.getElementById("btnDirection").href = dirUrl;
  }

  function renderShelterList(shelters) {
    var list = document.getElementById("shelterList");
    list.innerHTML = shelters.map(function (s, idx) {
      var typeInfo = SHELTER_TYPES[s.type] || SHELTER_TYPES.shelter;
      return (
        '<div class="shelter-item" data-lat="' + s.lat + '" data-lng="' + s.lng + '" data-idx="' + idx + '">' +
          '<span class="si-icon">' + typeInfo.icon + '</span>' +
          '<div class="si-info">' +
            '<div class="si-name">' + s.name + '</div>' +
            '<div class="si-addr">' + s.address + '</div>' +
          '</div>' +
          '<span class="si-distance">' + formatDistance(s.distance) + '</span>' +
        '</div>'
      );
    }).join("");

    // 클릭 시 지도에서 해당 위치로 이동
    var items = list.querySelectorAll(".shelter-item");
    for (var i = 0; i < items.length; i++) {
      items[i].addEventListener("click", function () {
        var lat = parseFloat(this.getAttribute("data-lat"));
        var lng = parseFloat(this.getAttribute("data-lng"));
        state.map.setView([lat, lng], 17);
        // 마커 팝업 열기
        if (state.shelterMarkers[parseInt(this.getAttribute("data-idx"))]) {
          state.shelterMarkers[parseInt(this.getAttribute("data-idx"))].openPopup();
        }
        // 지도로 스크롤
        document.getElementById("map").scrollIntoView({ behavior: "smooth" });
      });
    }
  }

  function addShelterMarkers(shelters) {
    // 기존 마커 제거
    state.shelterMarkers.forEach(function (m) { state.map.removeLayer(m); });
    state.shelterMarkers = [];

    shelters.forEach(function (s) {
      var typeInfo = SHELTER_TYPES[s.type] || SHELTER_TYPES.shelter;

      var icon = L.divIcon({
        html: '<div style="font-size:24px;text-align:center;line-height:1;">' + typeInfo.icon + '</div>',
        className: "shelter-marker",
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      var marker = L.marker([s.lat, s.lng], { icon: icon })
        .addTo(state.map)
        .bindPopup(
          '<div style="min-width:160px;">' +
            '<div style="font-weight:800;font-size:14px;margin-bottom:4px;">' + typeInfo.icon + " " + s.name + '</div>' +
            '<div style="font-size:12px;color:#666;margin-bottom:4px;">' + s.address + '</div>' +
            '<div style="font-size:12px;margin-bottom:6px;">' +
              '수용인원: ' + s.capacity.toLocaleString() + '명<br>' +
              '거리: ' + formatDistance(s.distance) +
            '</div>' +
            '<a href="https://www.google.com/maps/dir/?api=1&origin=' + state.userLat + ',' + state.userLng +
              '&destination=' + s.lat + ',' + s.lng + '&travelmode=walking" target="_blank" rel="noopener" ' +
              'style="display:inline-block;padding:6px 12px;background:#FF6B35;color:#FFF;border-radius:6px;text-decoration:none;font-size:12px;font-weight:700;">🗺️ 길 찾기</a>' +
          '</div>'
        );

      state.shelterMarkers.push(marker);
    });
  }

  // ===== 실시간 현 상황 (현재 위치 우선 + 지역 검색) =====

  var iconMap = { normal: "✅", watch: "⚠️", danger: "🚨" };

  function getSituationData(region) {
    if (state.currentTab === "accident") {
      return REGION_ACCIDENTS[region] || { status: "안전", level: "normal", message: "현재 보고된 사고가 없습니다." };
    }
    return REGION_SITUATIONS[region] || { status: "안전", level: "normal", message: "현재 특별한 재난 상황이 없습니다." };
  }

  // ===== 실시간 뉴스 기반 재난/사고 데이터 로드 =====

  function detectRegionFromText(text) {
    if (!text) return null;
    var regions = Object.keys(REGION_SITUATIONS);
    for (var i = 0; i < regions.length; i++) {
      if (text.indexOf(regions[i]) >= 0) return regions[i];
    }
    var shortKeys = Object.keys(REGION_SHORT_NAMES);
    for (var i = 0; i < shortKeys.length; i++) {
      if (text.indexOf(shortKeys[i]) >= 0) return REGION_SHORT_NAMES[shortKeys[i]];
    }
    var allRegions = Object.keys(REGION_DISTRICTS);
    for (var i = 0; i < allRegions.length; i++) {
      var districts = REGION_DISTRICTS[allRegions[i]] || [];
      for (var j = 0; j < districts.length; j++) {
        if (districts[j].length >= 3 && text.indexOf(districts[j]) >= 0) return allRegions[i];
      }
    }
    return null;
  }

  function detectIncidentType(text, keywordList) {
    if (!text) return null;
    for (var i = 0; i < keywordList.length; i++) {
      var entry = keywordList[i];
      for (var j = 0; j < entry.keywords.length; j++) {
        if (text.indexOf(entry.keywords[j]) >= 0) {
          return { status: entry.status, level: entry.level };
        }
      }
    }
    return null;
  }

  function fetchGoogleNews(queryTerms, callback) {
    var rssUrl = "https://news.google.com/rss/search?q=" +
      encodeURIComponent(queryTerms) + "&hl=ko&gl=KR&ceid=KR:ko";
    var apiUrl = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(rssUrl);

    fetch(apiUrl)
      .then(function(res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function(data) {
        if (data.status === "ok" && data.items && data.items.length > 0) {
          callback(data.items);
        } else {
          callback(null);
        }
      })
      .catch(function(err) {
        console.warn("rss2json 로드 실패:", err);
        callback(null);
      });
  }

  function parseNewsRss(keywordList, callback) {
    // 검색어 축소 (URL 길이 제한으로 인한 500 에러 방지)
    var searchTerms = keywordList.slice(0, 6).map(function(k) { return k.keywords[0]; }).join(" OR ");

    fetchGoogleNews(searchTerms, function(items) {
        if (!items) { callback(null); return; }

        var results = {};
        var now = new Date();
        var isWeather = keywordList === WEATHER_KEYWORDS;
        var TIME_LIMIT = (isWeather ? 24 : 3) * 60 * 60 * 1000;

        for (var i = 0; i < items.length; i++) {
          var title = items[i].title || "";
          var pubDate = items[i].pubDate || "";
          var link = items[i].link || "";
          var source = items[i].author || "뉴스";
          var cleanTitle = title.replace(/ - [^-]+$/, "");

          var newsDate = new Date(pubDate);
          if (isNaN(newsDate.getTime()) || (now - newsDate) > TIME_LIMIT) continue;

          var region = detectRegionFromText(cleanTitle);
          var incident = detectIncidentType(cleanTitle, keywordList);

          if (region && incident) {
            if (!results[region] || newsDate > new Date(results[region].date)) {
              results[region] = {
                status: incident.status,
                level: incident.level,
                message: cleanTitle,
                source: source,
                date: pubDate,
                link: link
              };
            }
          }
        }
        callback(results);
      });
  }

  function loadRealAccidentData() {
    parseNewsRss(ACCIDENT_KEYWORDS, function(results) {
      if (!results) return;

      var allRegions = Object.keys(REGION_ACCIDENTS);
      for (var i = 0; i < allRegions.length; i++) {
        REGION_ACCIDENTS[allRegions[i]] = { status: "안전", level: "normal", message: "현재 보고된 사고가 없습니다." };
      }
      var realCount = 0;
      Object.keys(results).forEach(function(region) {
        REGION_ACCIDENTS[region] = results[region];
        realCount++;
      });

      console.log("사고특보 실데이터 로드 완료:", realCount, "개 지역");
      if (state.currentTab === "accident") {
        renderSituation(state.currentSearch);
      }
    });
  }

  function loadRealDisasterData() {
    parseNewsRss(WEATHER_KEYWORDS, function(results) {
      if (!results) return;

      var allRegions = Object.keys(REGION_SITUATIONS);
      for (var i = 0; i < allRegions.length; i++) {
        REGION_SITUATIONS[allRegions[i]] = { status: "안전", level: "normal", message: "현재 특별한 재난 상황이 없습니다." };
      }
      var realCount = 0;
      Object.keys(results).forEach(function(region) {
        REGION_SITUATIONS[region] = results[region];
        realCount++;
      });

      console.log("재난특보 실데이터 로드 완료:", realCount, "개 지역");
      if (state.currentTab === "disaster") {
        renderSituation(state.currentSearch);
      }
    });
  }

  function buildSituationCard(region, isMyLocation) {
    var info = getSituationData(region);
    var now = new Date();
    var prefix = isMyLocation ? "📍 " : "";
    var isRealtime = !!info.source;
    var updatedText = isRealtime
      ? "📰 " + info.source + " · " + timeAgo(info.date)
      : "업데이트: " + now.toLocaleTimeString("ko-KR");

    return (
      '<div class="situation-card ' + info.level + '">' +
        '<div class="sc-icon">' + (iconMap[info.level] || "ℹ️") + '</div>' +
        '<div class="sc-body">' +
          '<div class="sc-title">' +
            '<span class="sc-region">' + prefix + region + '</span>' +
            '<span class="sc-status ' + info.level + '">' + info.status + '</span>' +
            (isRealtime ? '<span class="sc-realtime">뉴스</span>' : '') +
          '</div>' +
          '<div class="sc-message">' + info.message + '</div>' +
          '<div class="sc-updated">' + updatedText + '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function renderSituation(query) {
    state.currentSearch = query || "";
    var list = document.getElementById("situationList");
    var allRegions = Object.keys(REGION_SITUATIONS);
    var html = "";
    var dividerLabel = state.currentTab === "accident" ? "전국 사고 현황" : "전국 재난 상황";

    if (query) {
      var q = query.trim().toLowerCase();

      // 시/도명 + 약어 매칭
      var matched = allRegions.filter(function (r) {
        return r.toLowerCase().indexOf(q) >= 0;
      });
      var shortKeys = Object.keys(REGION_SHORT_NAMES);
      for (var i = 0; i < shortKeys.length; i++) {
        if (shortKeys[i].toLowerCase().indexOf(q) >= 0 || q.indexOf(shortKeys[i].toLowerCase()) >= 0) {
          var full = REGION_SHORT_NAMES[shortKeys[i]];
          if (matched.indexOf(full) < 0) matched.push(full);
        }
      }

      // 시/군/구명 매칭 → 해당 시/도 검색
      var districtRegions = Object.keys(REGION_DISTRICTS);
      for (var i = 0; i < districtRegions.length; i++) {
        var dRegion = districtRegions[i];
        var districts = REGION_DISTRICTS[dRegion] || [];
        for (var j = 0; j < districts.length; j++) {
          var d = districts[j].toLowerCase();
          if (d.indexOf(q) >= 0 || q.indexOf(d) >= 0) {
            if (matched.indexOf(dRegion) < 0) matched.push(dRegion);
            break;
          }
        }
      }

      if (matched.length === 0) {
        list.innerHTML = '<div class="situation-empty">🔍 검색 결과가 없습니다.<br>예: 서울, 부산, 광주, 보성, 영월, 경기도</div>';
        return;
      }

      matched.sort(function (a, b) {
        if (a === "전국") return 1;
        if (b === "전국") return -1;
        return 0;
      });

      html += '<div class="situation-divider">검색 결과 (' + matched.length + ')</div>';
      for (var i = 0; i < matched.length; i++) {
        html += buildSituationCard(matched[i], matched[i] === state.userRegion);
      }
      list.innerHTML = html;
      return;
    }

    // 기본 모드 — 내 지역만 보여주고, 주변 지역은 접기/펼치기
    if (state.userRegion) {
      if (state.locationKnown) {
        html += '<div class="situation-my-location">📌 내 현재 위치: ' + state.userRegion + '</div>';
        html += buildSituationCard(state.userRegion, true);
      } else {
        html += '<div class="situation-my-location">📍 기본 위치: 서울특별시 (위치 권한 필요)</div>';
        html += buildSituationCard(state.userRegion, false);
      }

      // 주변 지역을 거리순으로 정렬
      var nearby = allRegions
        .filter(function (r) { return r !== state.userRegion && r !== "전국"; })
        .map(function (r) {
          var c = REGION_CENTERS[r] || { lat: 0, lng: 0 };
          return { region: r, distance: haversine(state.userLat, state.userLng, c.lat, c.lng) };
        })
        .sort(function (a, b) { return a.distance - b.distance; });

      var expanded = state.situationExpanded;
      html += '<div class="situation-collapse-header" id="nearbyToggle">';
      html += '<span>' + (expanded ? '▲' : '▼') + '</span>';
      html += '<span>주변 지역 (' + nearby.length + '개)</span>';
      html += '</div>';

      html += '<div class="situation-collapse-body' + (expanded ? ' expanded' : '') + '">';
      for (var i = 0; i < nearby.length; i++) {
        html += buildSituationCard(nearby[i].region, false);
      }
      if (allRegions.indexOf("전국") >= 0) {
        html += buildSituationCard("전국", false);
      }
      html += '</div>';
    }

    list.innerHTML = html;
  }

  function setupSituationTabs() {
    var tabs = document.querySelectorAll(".situation-tab");
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener("click", function () {
        var tab = this.getAttribute("data-tab");
        if (tab === state.currentTab) return;

        for (var j = 0; j < tabs.length; j++) {
          tabs[j].classList.remove("active");
        }
        this.classList.add("active");

        state.currentTab = tab;
        var input = document.getElementById("regionSearchInput");
        if (input) input.value = "";
        renderSituation();
      });
    }
  }

  function setupSituationSearch() {
    var input = document.getElementById("regionSearchInput");
    var list = document.getElementById("situationList");
    if (!input || !list) return;

    // 주변 지역 접기/펼치기 (이벤트 위임)
    list.addEventListener("click", function (e) {
      if (e.target.closest("#nearbyToggle")) {
        state.situationExpanded = !state.situationExpanded;
        renderSituation(state.currentSearch);
      }
    });

    // 검색 입력
    input.addEventListener("input", function () {
      var val = this.value.trim();
      if (val.length === 0) {
        renderSituation();
      } else {
        renderSituation(val);
      }
    });
  }

  // ===== 실시간 뉴스 (Google News RSS via rss2json) =====

  function loadNews() {
    fetchGoogleNews("재난 OR 재해 OR 대피 OR 지진 OR 태풍 OR 화재 OR 홍수 OR 폭우 OR 기상특보", function(items) {
        if (!items || items.length === 0) {
          renderNewsFallback();
          return;
        }

        var newsItems = items.slice(0, 12).map(function(item) {
          var title = item.title || "";
          return {
            title: title.replace(/ - [^-]+$/, ""),
            link: item.link || "",
            pubDate: item.pubDate || "",
            dateObj: item.pubDate ? new Date(item.pubDate) : new Date(0),
            source: item.author || "뉴스"
          };
        });

        newsItems.sort(function (a, b) {
          return b.dateObj - a.dateObj;
        });

        renderNews(newsItems);
      });
  }

  function renderNews(items) {
    var list = document.getElementById("newsList");

    list.innerHTML = items.map(function (n) {
      return (
        '<a class="news-item" href="' + n.link + '" target="_blank" rel="noopener">' +
          '<div class="ni-source">' + n.source + '</div>' +
          '<div class="ni-title">' + n.title + '</div>' +
          '<div class="ni-date">' + timeAgo(n.pubDate) + '</div>' +
        '</a>'
      );
    }).join("");
  }

  function renderNewsFallback() {
    var list = document.getElementById("newsList");
    var now = new Date();

    var sampleNews = [
      { title: "기상청, 전국 기상 특보 발령 현황 안내", source: "기상청", date: new Date(now - 3600000) },
      { title: "행정안전부, 재난 대비 안전 점검 실시", source: "행정안전부", date: new Date(now - 7200000) },
      { title: "소방청, 여름철 집중호우 대비 안전 수칙 당부", source: "소방청", date: new Date(now - 10800000) },
      { title: "전국 지자체, 비상 대비 태세 점검 착수", source: "연합뉴스", date: new Date(now - 14400000) },
      { title: "국민재난안전포털, 재난문자 발송 현황 안내", source: "국민재난안전포털", date: new Date(now - 18000000) },
      { title: "재난관리본부, 대피소 운영 준비 완료", source: "뉴스1", date: new Date(now - 21600000) }
    ];

    list.innerHTML =
      '<div class="news-error">' +
        '<div class="news-sample">' +
          sampleNews.map(function (n) {
            return (
              '<a class="news-item" href="https://www.safekorea.go.kr" target="_blank" rel="noopener">' +
                '<div class="ni-source">' + n.source + '</div>' +
                '<div class="ni-title">' + n.title + '</div>' +
                '<div class="ni-date">' + timeAgo(n.date) + '</div>' +
              '</a>'
            );
          }).join("") +
        '</div>' +
        '<button class="retry-btn" id="btnRetryNews">🔄 새로고침</button>' +
      '</div>';

    var retryBtn = document.getElementById("btnRetryNews");
    if (retryBtn) {
      retryBtn.addEventListener("click", function () {
        list.innerHTML = '<div class="news-loading">뉴스를 불러오는 중...</div>';
        loadNews();
      });
    }
  }

  // ===== 재해 대처 방법 가이드 =====

  function renderGuides() {
    var list = document.getElementById("guideList");

    list.innerHTML = DISASTER_GUIDES.map(function (g, idx) {
      return (
        '<div class="guide-item" data-idx="' + idx + '">' +
          '<div class="guide-header">' +
            '<span class="gh-icon">' + g.icon + '</span>' +
            '<span class="gh-title">' + g.type + ' 발생 시 대처법</span>' +
            '<span class="gh-arrow">▼</span>' +
          '</div>' +
          '<div class="guide-body">' +
            '<div class="guide-steps">' +
              g.steps.map(function (step) {
                return '<div class="guide-step">' + step + '</div>';
              }).join("") +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }).join("");

    // 아코디언 토글
    var items = list.querySelectorAll(".guide-item");
    for (var i = 0; i < items.length; i++) {
      items[i].querySelector(".guide-header").addEventListener("click", function () {
        var parent = this.parentElement;
        parent.classList.toggle("active");
      });
    }

    // 첫 번째 가이드 열어두기
    if (items.length > 0) {
      items[0].classList.add("active");
    }
  }

  // ===== 긴급 연락처 버튼 (토글 접기/펼치기) =====

  function renderEmergencyBar() {
    var content = document.getElementById("emergencyContent");

    content.innerHTML = EMERGENCY_CONTACTS.map(function (c, idx) {
      var cls = "call-" + c.name.replace(/[^0-9]/g, "");
      if (c.name === "행정안전부") cls = "call-mois";
      return (
        '<a class="emergency-btn ' + cls + '" data-phone="' + c.phone + '" data-idx="' + idx + '">' +
          '<span class="e-icon">' + c.icon + '</span>' +
          '<span>' + c.phone + " " + c.label + '</span>' +
        '</a>'
      );
    }).join("");

    // 클릭 이벤트 — 전화 연결 + 위치 공유 모달
    var buttons = content.querySelectorAll(".emergency-btn");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function (e) {
        e.preventDefault();
        var phone = this.getAttribute("data-phone");

        // 위치 공유 모달 표시
        showLocationModal(phone);

        // 전화 연결
        window.location.href = "tel:" + phone.replace(/-/g, "");
      });
    }
  }

  function setupEmergencyToggle() {
    var toggle = document.getElementById("emergencyToggle");
    var bar = document.getElementById("emergencyBar");

    toggle.addEventListener("click", function () {
      bar.classList.toggle("expanded");
    });
  }

  // ===== 위치 공유 모달 =====

  function showLocationModal(phone) {
    var modal = document.getElementById("locationModal");
    modal.classList.add("active");

    // 위도/경도 표시
    if (state.userLat && state.userLng) {
      document.getElementById("modalCoords").textContent =
        state.userLat.toFixed(6) + ", " + state.userLng.toFixed(6);
    } else {
      document.getElementById("modalCoords").textContent = "위치 확인 필요";
    }

    // 주소 표시
    document.getElementById("modalAddress").textContent =
      state.userAddress || "주소 확인 중...";

    // 모달의 위치 복사 버튼에 현재 전화번호 저장
    document.getElementById("btnCopyLocation").setAttribute("data-phone", phone);
  }

  function setupLocationModal() {
    var modal = document.getElementById("locationModal");

    // 닫기 버튼
    document.getElementById("btnCloseModal").addEventListener("click", function () {
      modal.classList.remove("active");
    });

    // 배경 클릭 시 닫기
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        modal.classList.remove("active");
      }
    });

    // 위치 복사 버튼
    document.getElementById("btnCopyLocation").addEventListener("click", function () {
      var text =
        "[대피모아 긴급 위치 공유]\n" +
        "현재 위치를 알려드립니다.\n\n" +
        "위도/경도: " + (state.userLat ? state.userLat.toFixed(6) + ", " + state.userLng.toFixed(6) : "확인 불가") + "\n" +
        "도로명 주소: " + (state.userAddress || "확인 불가") + "\n" +
        "구글 지도: https://www.google.com/maps?q=" + state.userLat + "," + state.userLng + "\n\n" +
        "구조가 필요합니다. 신속히 연락 부탁드립니다.";

      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function () {
          alert("📋 위치 정보가 클립보드에 복사되었습니다.\n구조대에 붙여넣기하여 전달하세요.");
        }).catch(function () {
          fallbackCopy(text);
        });
      } else {
        fallbackCopy(text);
      }
    });

    // 카카오톡 공유 (Web Share API 사용)
    document.getElementById("btnShareKakao").addEventListener("click", function () {
      var shareText =
        "[대피모아 긴급 위치 공유]\n" +
        "현재 위치를 알려드립니다.\n\n" +
        "위도/경도: " + (state.userLat ? state.userLat.toFixed(6) + ", " + state.userLng.toFixed(6) : "확인 불가") + "\n" +
        "도로명 주소: " + (state.userAddress || "확인 불가") + "\n" +
        "구글 지도: https://www.google.com/maps?q=" + state.userLat + "," + state.userLng;

      if (navigator.share) {
        navigator.share({
          title: "대피모아 긴급 위치 공유",
          text: shareText,
          url: "https://www.google.com/maps?q=" + state.userLat + "," + state.userLng
        }).catch(function () {});
      } else {
        // Web Share API 미지원 시 클립보드 복사
        if (navigator.clipboard) {
          navigator.clipboard.writeText(shareText).then(function () {
            alert("📋 위치 정보가 복사되었습니다. 메신저에 붙여넣기하여 공유하세요.");
          });
        }
      }
    });
  }

  function fallbackCopy(text) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      alert("📋 위치 정보가 클립보드에 복사되었습니다.");
    } catch (e) {
      alert("복사에 실패했습니다. 수동으로 위치를 복사해 주세요:\n" + text);
    }
    document.body.removeChild(textarea);
  }

  // ===== 대피소 목록 토글 =====

  function setupShelterListToggle() {
    var btn = document.getElementById("btnToggleList");
    var container = document.getElementById("shelterListContainer");

    btn.addEventListener("click", function () {
      if (container.style.display === "none") {
        container.style.display = "block";
        btn.textContent = "📋 목록 닫기";
      } else {
        container.style.display = "none";
        btn.textContent = "📋 목록 보기";
      }
    });
  }

  // ===== 지도 클릭 시 스크롤 줌 활성화 =====

  function setupMapInteraction() {
    var mapEl = document.getElementById("map");
    mapEl.addEventListener("click", function () {
      if (state.map) {
        state.map.scrollWheelZoom.enable();
      }
    });
    mapEl.addEventListener("mouseleave", function () {
      if (state.map) {
        state.map.scrollWheelZoom.disable();
      }
    });
  }

  // ===== 섹션 메뉴바 (클릭 스크롤 이동 + 활성 하이라이트) =====

  function setupSectionNav() {
    var links = document.querySelectorAll(".nav-link");

    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function (e) {
        e.preventDefault();
        var targetId = this.getAttribute("href").substring(1);
        var target = document.getElementById(targetId);
        if (!target) return;

        // sticky 요소(헤더 + 메뉴바 + 긴급바) 높이만큼 오프셋
        var header = document.querySelector("header");
        var nav = document.getElementById("sectionNav");
        var emergency = document.getElementById("emergencyBar");
        var offset = header.offsetHeight + nav.offsetHeight + emergency.offsetHeight;

        var top = target.getBoundingClientRect().top + window.pageYOffset - offset - 8;
        window.scrollTo({ top: top, behavior: "smooth" });
      });
    }
  }

  function setupScrollSpy() {
    var sections = document.querySelectorAll("main section[id]");
    var links = document.querySelectorAll(".nav-link");

    if (!("IntersectionObserver" in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          for (var i = 0; i < links.length; i++) {
            if (links[i].getAttribute("href") === "#" + id) {
              links[i].classList.add("active");
            } else {
              links[i].classList.remove("active");
            }
          }
        }
      });
    }, {
      rootMargin: "-160px 0px -55% 0px",
      threshold: 0
    });

    for (var i = 0; i < sections.length; i++) {
      observer.observe(sections[i]);
    }
  }

  // ===== 초기화 =====

  function init() {
    // 기본 위치 (서울) 설정
    state.userLat = 37.5665;
    state.userLng = 126.9780;
    state.userRegion = "서울특별시";
    state.locationKnown = false;

    renderEmergencyBar();
    setupEmergencyToggle();
    setupLocationModal();
    setupLocationToggle();
    setupSectionNav();
    setupScrollSpy();
    setupSituationTabs();
    setupSituationSearch();
    renderSituation();
    renderGuides();
    setupShelterListToggle();
    setupMapInteraction();
    loadNews();

    // 지도 및 대피소를 서울 기준으로 초기화
    initMap(state.userLat, state.userLng);
    findNearestShelters();

    // 로딩 화면 즉시 숨기기
    hideLoading();

    // 이전에 위치를 사용했다면 자동 복원
    if (localStorage.getItem("daepimoa_location") === "true") {
      var savedLat = parseFloat(localStorage.getItem("daepimoa_lat"));
      var savedLng = parseFloat(localStorage.getItem("daepimoa_lng"));

      if (!isNaN(savedLat) && !isNaN(savedLng)) {
        // 저장된 좌표로 즉시 표시
        state.userLat = savedLat;
        state.userLng = savedLng;
        state.locationKnown = true;
        document.getElementById("userCoords").textContent =
          "위도 " + savedLat.toFixed(6) + " / 경도 " + savedLng.toFixed(6);
        updateMapLocation(savedLat, savedLng, true);
        reverseGeocode(savedLat, savedLng);
        findNearestShelters();
        updateToggleButton(true);
        renderSituation();
      }

      // 새로운 위치로 업데이트
      initGeolocation();
    }

    // 실시간 뉴스 데이터 로드
    loadRealDisasterData();
    loadRealAccidentData();
  }

  // DOM 로드 완료 시 실행
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
