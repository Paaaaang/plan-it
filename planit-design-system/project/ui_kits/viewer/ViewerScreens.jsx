// Planit — Viewer UI kit (mobile-first, login-free). Screens export to window.
// Uses design-system primitives from window.PlanitDesignSystem_e6392f.
const { TopBar, BottomCTA, Button, Chip, Badge, Card, SegmentedControl, Toast, BottomSheet, ListRow, Avatar, Icon } = window.PlanitDesignSystem_e6392f;

const PLACES = {
  p1: { name: "제주국제공항", addr: "제주특별자치도 제주시 공항로 2", tag: "집결", transit: "공항버스 600번 · 셔틀 대기" },
  p2: { name: "성산일출봉", addr: "제주특별자치도 서귀포시 성산읍 성산리 1", tag: "관광", transit: "성산일출봉 정류장 도보 5분" },
  p3: { name: "위미 게스트하우스", addr: "제주특별자치도 서귀포시 남원읍 위미리 123", tag: "숙소", transit: "체크인 15:00 · 주차 가능" },
  p4: { name: "흑돼지 명가", addr: "제주특별자치도 서귀포시 중앙로 45", tag: "식사", transit: "도보 8분 · 예약 완료" },
};

const DAYS = [
  { key: "day1", label: "1일차", date: "10.24 목", items: [
    { time: "10:30", title: "제주공항 집결", place: "p1", now: true },
    { time: "12:00", title: "점심 · 흑돼지", place: "p4" },
    { time: "14:30", title: "성산일출봉 트레킹", place: "p2" },
    { time: "18:00", title: "게스트하우스 체크인", place: "p3" },
  ]},
  { key: "day2", label: "2일차", date: "10.25 금", items: [
    { time: "09:00", title: "조식 & 자유시간", place: "p3" },
    { time: "11:00", title: "해안 드라이브", place: "p2" },
    { time: "13:00", title: "점심 · 자율", place: "p4" },
  ]},
  { key: "day3", label: "3일차", date: "10.26 토", items: [
    { time: "10:00", title: "체크아웃 & 기념품", place: "p3" },
    { time: "13:30", title: "공항 이동 · 해산", place: "p1" },
  ]},
];

const HIGHLIGHTS = [
  { icon: "backpack", title: "준비물", body: "편한 신발, 얇은 패딩(밤 쌀쌀해요), 상비약, 보조배터리" },
  { icon: "circle-alert", title: "공지", body: "집결 시간 10:30 꼭 지켜주세요. 늦으면 셔틀이 먼저 출발해요." },
  { icon: "wallet", title: "회비", body: "1인 12만원 · 도착 후 총무에게 현장 정산해요." },
];

// ---- Cover -------------------------------------------------------
function Cover() {
  return (
    <div style={{ position: "relative", padding: "24px 24px 22px", background: "linear-gradient(155deg, var(--blue-600), var(--blue-500) 55%, var(--blue-400))", color: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, opacity: .9, marginBottom: 14 }}>
        <img src="../../assets/logo-white.png" style={{ width: 20, height: 20, objectFit: "contain" }} />
        <span style={{ font: "700 13px/1 var(--font-sans)" }}>플랜잇으로 공유된 일정</span>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        <Badge tone="brand" style={{ background: "rgba(255,255,255,.22)", color: "#fff" }}>여행</Badge>
        <Badge tone="brand" style={{ background: "rgba(255,255,255,.22)", color: "#fff" }}>2박 3일</Badge>
      </div>
      <div style={{ font: "700 27px/1.3 var(--font-sans)", letterSpacing: "-0.02em" }}>제주 워크샵 2026</div>
      <div style={{ font: "500 14px/1.5 var(--font-sans)", opacity: .92, marginTop: 6 }}>10.24 목 – 10.26 토 · 디자인팀 12명</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 16, font: "500 12px/1 var(--font-sans)", opacity: .9 }}>
        <span style={{ display: "inline-flex" }}><Icon name="eye" size={15} color="#fff" /></span>
        <span className="tnum">조회 1,280</span>
        <span style={{ opacity: .6 }}>·</span>
        <span>총무 김플랜</span>
      </div>
    </div>
  );
}

// ---- Timetable ---------------------------------------------------
function Timetable({ onPlace }) {
  const [day, setDay] = React.useState("day1");
  const d = DAYS.find((x) => x.key === day);
  return (
    <div style={{ padding: "18px 0 8px" }}>
      <div style={{ padding: "0 24px 14px" }}>
        <SegmentedControl options={DAYS.map((x) => ({ value: x.key, label: x.label }))} value={day} onChange={setDay} />
      </div>
      <div style={{ padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={{ font: "700 15px/1 var(--font-sans)", color: "var(--text-primary)" }}>{d.date}</span>
          <span style={{ font: "500 13px/1 var(--font-sans)", color: "var(--text-tertiary)" }}>· {d.items.length}개 일정</span>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 47, top: 8, bottom: 8, width: 2, background: "var(--grey-200)" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {d.items.map((it, i) => {
              const pl = PLACES[it.place];
              return (
                <div key={i} onClick={() => onPlace(it.place)} style={{ position: "relative", display: "flex", gap: 14, padding: "10px 12px", borderRadius: "var(--radius-l)", cursor: "pointer", background: it.now ? "var(--now-fill)" : "transparent" }}>
                  <div style={{ width: 42, textAlign: "right", flex: "0 0 auto" }}>
                    <div className="tnum" style={{ font: `${it.now ? 700 : 600} 14px/1.3 var(--font-sans)`, color: it.now ? "var(--text-brand)" : "var(--text-primary)" }}>{it.time}</div>
                  </div>
                  <div style={{ position: "relative", flex: "0 0 auto", zIndex: 1, marginTop: 3 }}>
                    <span style={{ display: "block", width: 12, height: 12, borderRadius: "50%", background: it.now ? "var(--blue-500)" : "#fff", border: `2px solid ${it.now ? "var(--blue-500)" : "var(--grey-300)"}`, boxShadow: it.now ? "0 0 0 4px var(--blue-100)" : "none" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ font: "600 15px/1.3 var(--font-sans)", color: "var(--text-primary)" }}>{it.title}</span>
                      {it.now && <Badge tone="brand">지금</Badge>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4, color: "var(--text-tertiary)" }}>
                      <Icon name="map-pin" size={13} />
                      <span style={{ font: "500 13px/1.3 var(--font-sans)" }}>{pl.name}</span>
                    </div>
                  </div>
                  <span style={{ alignSelf: "center", color: "var(--grey-400)" }}><Icon name="chevron-right" size={18} /></span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Highlights --------------------------------------------------
function Highlights() {
  return (
    <div style={{ padding: "18px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
      {HIGHLIGHTS.map((h, i) => (
        <Card key={i} padding={16}>
          <div style={{ display: "flex", gap: 12 }}>
            <span style={{ display: "grid", placeItems: "center", width: 28, color: "var(--text-brand)", flex: "0 0 auto", marginTop: 1 }}><Icon name={h.icon} size={22} /></span>
            <div>
              <div style={{ font: "700 15px/1.3 var(--font-sans)", color: "var(--text-primary)", marginBottom: 4 }}>{h.title}</div>
              <div style={{ font: "400 14px/1.55 var(--font-sans)", color: "var(--text-secondary)" }}>{h.body}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ---- Places ------------------------------------------------------
function Places({ onPlace }) {
  return (
    <div style={{ padding: "8px 0" }}>
      {Object.entries(PLACES).map(([k, p], i) => (
        <div key={k}>
          {i > 0 && <div style={{ height: 1, background: "var(--border-secondary)", marginLeft: 24 }} />}
          <ListRow
            left={<span style={{ display: "grid", placeItems: "center", width: 32, height: 44, color: "var(--text-tertiary)" }}><Icon name="map-pin" size={22} /></span>}
            title={p.name} subtitle={p.addr}
            right={<Badge tone="neutral">{p.tag}</Badge>} chevron onClick={() => onPlace(k)} />
        </div>
      ))}
    </div>
  );
}

// ---- Place detail sheet (map actions) ----------------------------
function PlaceSheet({ placeKey, onClose, onToast }) {
  const p = PLACES[placeKey];
  if (!p) return null;
  return (
    <BottomSheet open={!!placeKey} onClose={onClose}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <Badge tone="brand">{p.tag}</Badge>
          </div>
          <div style={{ font: "700 20px/1.3 var(--font-sans)", letterSpacing: "-0.015em", color: "var(--text-primary)" }}>{p.name}</div>
          <div style={{ font: "400 14px/1.5 var(--font-sans)", color: "var(--text-secondary)", marginTop: 4 }}>{p.addr}</div>
        </div>
      </div>
      {/* static map */}
      <div style={{ height: 128, borderRadius: "var(--radius-l)", overflow: "hidden", position: "relative", background: "repeating-linear-gradient(45deg, var(--grey-100), var(--grey-100) 12px, var(--grey-150) 12px, var(--grey-150) 24px)", border: "1px solid var(--border-secondary)", marginBottom: 14 }}>
        <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-100%)", color: "var(--blue-500)" }}><Icon name="map-pin" size={34} strokeWidth={2.2} /></span>
        <span style={{ position: "absolute", bottom: 8, right: 10, font: "500 10px/1 var(--font-sans)", color: "var(--text-tertiary)" }}>지도 임베드</span>
      </div>
      {/* transit */}
      <div style={{ display: "flex", gap: 8, padding: "10px 12px", background: "var(--fill-secondary)", borderRadius: "var(--radius-m)", marginBottom: 16 }}>
        <span style={{ color: "var(--text-secondary)" }}><Icon name="bus" size={18} /></span>
        <span style={{ font: "400 13px/1.5 var(--font-sans)", color: "var(--text-secondary)" }}>{p.transit}</span>
      </div>
      {/* actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
        <Button variant="secondary" size="l" leadingIcon={<Icon name="copy" size={18} />} onClick={() => { onToast("주소를 복사했어요"); }}>주소 복사</Button>
        <Button variant="secondary" size="l" leadingIcon={<Icon name="navigation" size={18} />} onClick={() => onToast("네이버 지도를 열었어요")}>네이버 지도</Button>
      </div>
      <Button variant="primary" size="l" block leadingIcon={<Icon name="map" size={18} />} onClick={() => onToast("카카오맵을 열었어요")}>카카오맵으로 길찾기</Button>
    </BottomSheet>
  );
}

// ---- Status / error screen ---------------------------------------
function StatusScreen({ onBack }) {
  return (
    <div style={{ minHeight: 560, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 32, gap: 16 }}>
      <span style={{ display: "grid", placeItems: "center", width: 72, height: 72, borderRadius: "var(--radius-3xl)", background: "var(--fill-secondary)", color: "var(--grey-400)" }}><Icon name="link-2-off" size={34} /></span>
      <div>
        <div style={{ font: "700 20px/1.3 var(--font-sans)", color: "var(--text-primary)", marginBottom: 8 }}>일정을 찾을 수 없어요</div>
        <div style={{ font: "400 15px/1.55 var(--font-sans)", color: "var(--text-secondary)", maxWidth: 260 }}>링크가 만료됐거나 비공개로 바뀐 것 같아요. 공유해준 분에게 새 링크를 받아보세요.</div>
      </div>
      <Button variant="secondary" size="l" onClick={onBack}>홈으로</Button>
    </div>
  );
}

Object.assign(window, { PlanitViewer: { Cover, Timetable, Highlights, Places, PlaceSheet, StatusScreen, DAYS, PLACES } });
