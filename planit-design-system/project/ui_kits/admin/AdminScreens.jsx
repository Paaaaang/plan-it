// Planit — Admin console UI kit (desktop web). Operations KPI dashboard.
const { Button, SearchField, Card, Badge, Avatar, Chip, Icon } = window.PlanitDesignSystem_e6392f;

const KPIS = [
  { k: "주간 신규 생성", v: "342", d: "+12%", up: true, i: "calendar-plus" },
  { k: "공유 전환율", v: "64%", d: "+3%p", up: true, i: "share-2" },
  { k: "일정당 평균 조회", v: "7.8", d: "+0.6", up: true, i: "eye" },
  { k: "실용 액션 클릭률", v: "31%", d: "-1%p", up: false, i: "mouse-pointer-click" },
];
const BARS = [42, 55, 48, 63, 71, 58, 82, 76, 91, 68, 88, 95];
const ROWS = [
  { t: "제주 워크샵 2026", u: "김플랜", v: 1280, s: "정상" },
  { t: "가을 동아리 MT", u: "이여행", v: 412, s: "정상" },
  { t: "★★ 초특가 여행 상품 ★★", u: "unknown_39", v: 21, s: "신고" },
  { t: "사내 오프사이트", u: "박총무", v: 0, s: "비공개" },
  { t: "부산 미식 투어", u: "정푸드", v: 638, s: "정상" },
];
const SBADGE = { 정상: { tone: "success", dot: true }, 신고: { tone: "danger", dot: true }, 비공개: { tone: "neutral" } };

function Sidebar() {
  const nav = [
    { label: "운영 지표", icon: "bar-chart-3", on: true },
    { label: "일정 관리", icon: "calendar" },
    { label: "사용자 관리", icon: "users" },
    { label: "신고 · 검토", icon: "flag" },
    { label: "공지 템플릿", icon: "megaphone" },
  ];
  return (
    <aside style={{ width: 220, flex: "0 0 auto", borderRight: "1px solid var(--border-secondary)", background: "var(--surface-card)", padding: "20px 14px", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "4px 8px 8px" }}>
        <img src="../../assets/logo-blue.png" style={{ width: 24, height: 24, objectFit: "contain" }} />
        <span style={{ font: "700 17px/1 var(--font-sans)", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>플랜잇</span>
        <Badge tone="brand">운영</Badge>
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 12 }}>
        {nav.map((n) => (
          <div key={n.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: "var(--radius-m)", background: n.on ? "var(--fill-brand-weak)" : "transparent", color: n.on ? "var(--text-brand)" : "var(--text-secondary)", font: `${n.on ? 700 : 500} 14px/1 var(--font-sans)`, cursor: "pointer" }}>
            <Icon name={n.icon} size={18} /> {n.label}
          </div>
        ))}
      </nav>
    </aside>
  );
}

function Dashboard() {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "26px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <h1 style={{ margin: 0, font: "700 24px/1.2 var(--font-sans)", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>운영 지표</h1>
          <p style={{ margin: "6px 0 0", font: "400 13px/1.4 var(--font-sans)", color: "var(--text-tertiary)" }}>최근 12주 · 2026.07.05 기준</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ width: 220 }}><SearchField placeholder="일정 · 사용자 검색" /></div>
          <Button variant="secondary" size="l" leadingIcon={<Icon name="download" size={17} />}>내보내기</Button>
        </div>
      </div>

      {/* KPI widgets */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 16 }}>
        {KPIS.map((m) => (
          <Card key={m.k} padding={18}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={{ display: "grid", placeItems: "center", width: 28, height: 28, color: "var(--text-brand)" }}><Icon name={m.i} size={20} /></span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 2, font: "600 12px/1 var(--font-sans)", color: m.up ? "var(--text-success)" : "var(--text-danger)" }}>
                <Icon name={m.up ? "trending-up" : "trending-down"} size={13} />{m.d}
              </span>
            </div>
            <div className="tnum" style={{ font: "700 30px/1.1 var(--font-sans)", letterSpacing: "-0.02em", color: "var(--text-primary)", marginTop: 14 }}>{m.v}</div>
            <div style={{ font: "400 13px/1 var(--font-sans)", color: "var(--text-tertiary)", marginTop: 5 }}>{m.k}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16 }}>
        {/* bar chart — no axis lines, single accent bar */}
        <Card padding={20}>
          <div style={{ font: "700 15px/1 var(--font-sans)", color: "var(--text-primary)", marginBottom: 4 }}>주간 신규 생성 일정</div>
          <div style={{ font: "400 12px/1 var(--font-sans)", color: "var(--text-tertiary)", marginBottom: 20 }}>최근 12주</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 150 }}>
            {BARS.map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: "6px 6px 0 0", background: i === BARS.length - 1 ? "var(--fill-brand)" : "var(--grey-200)" }} />
            ))}
          </div>
        </Card>
        {/* recent schedules */}
        <Card padding={0} style={{ overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px 12px" }}>
            <span style={{ font: "700 15px/1 var(--font-sans)", color: "var(--text-primary)" }}>최근 일정</span>
            <span style={{ font: "500 12px/1 var(--font-sans)", color: "var(--text-brand)", cursor: "pointer" }}>전체보기</span>
          </div>
          {ROWS.map((r, i) => {
            const b = SBADGE[r.s];
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", borderTop: "1px solid var(--border-secondary)" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ font: "600 13px/1.3 var(--font-sans)", color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.t}</div>
                  <div style={{ font: "400 11px/1.3 var(--font-sans)", color: "var(--text-tertiary)" }}>{r.u} · <span className="tnum">{r.v.toLocaleString()}</span> 조회</div>
                </div>
                <Badge tone={b.tone} dot={b.dot}>{r.s}</Badge>
                {r.s === "신고" && <Button variant="danger" size="s">블라인드</Button>}
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { PlanitAdmin: { Sidebar, Dashboard } });
