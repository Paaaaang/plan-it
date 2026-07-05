// Planit — Planner UI kit (desktop web). Dashboard · Editor · Share manager.
const { Button, TextField, SearchField, Card, ListRow, Chip, Badge, Avatar, Switch, SegmentedControl, Toast, Icon } = window.PlanitDesignSystem_e6392f;

const SCHEDULES = [
  { id: "jeju", title: "제주 워크샵 2026", meta: "10.24–10.26 · 12명", views: 1280, status: "public", cover: "linear-gradient(150deg,var(--blue-600),var(--blue-400))" },
  { id: "mt", title: "가을 동아리 MT", meta: "11.08–11.09 · 24명", views: 412, status: "public", cover: "linear-gradient(150deg,#12B886,#3BC9A0)" },
  { id: "off", title: "사내 오프사이트", meta: "12.02–12.03 · 40명", views: 0, status: "private", cover: "linear-gradient(150deg,#45454F,#82828E)" },
  { id: "bday", title: "지현 생일 모임", meta: "10.30 · 8명", views: 96, status: "draft", cover: "linear-gradient(150deg,#F5A623,#FFCE73)" },
];
const STATUS = { public: { tone: "success", label: "공개중", dot: true }, private: { tone: "neutral", label: "비공개" }, draft: { tone: "warning", label: "임시저장" } };

// ---- Shell -------------------------------------------------------
function Sidebar({ view, setView }) {
  const nav = [
    { k: "dash", label: "대시보드", icon: "layout-dashboard" },
    { k: "editor", label: "일정 편집", icon: "square-pen" },
    { k: "share", label: "공유 · 통계", icon: "share-2" },
  ];
  return (
    <aside style={{ width: 232, flex: "0 0 auto", borderRight: "1px solid var(--border-secondary)", background: "var(--surface-card)", display: "flex", flexDirection: "column", padding: "20px 14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "4px 8px 20px" }}>
        <img src="../../assets/logo-blue.png" style={{ width: 26, height: 26, objectFit: "contain" }} />
        <span style={{ font: "700 19px/1 var(--font-sans)", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>플랜잇</span>
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {nav.map((n) => {
          const on = view === n.k;
          return (
            <button key={n.k} onClick={() => setView(n.k)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "none", borderRadius: "var(--radius-m)", background: on ? "var(--fill-brand-weak)" : "transparent", color: on ? "var(--text-brand)" : "var(--text-secondary)", font: `${on ? 700 : 500} 14px/1 var(--font-sans)`, cursor: "pointer", textAlign: "left" }}>
              <Icon name={n.icon} size={19} /> {n.label}
            </button>
          );
        })}
      </nav>
      <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", borderTop: "1px solid var(--border-secondary)" }}>
        <Avatar name="김플랜" size={34} />
        <div style={{ minWidth: 0 }}>
          <div style={{ font: "600 13px/1.3 var(--font-sans)", color: "var(--text-primary)" }}>김플랜</div>
          <div style={{ font: "400 11px/1.3 var(--font-sans)", color: "var(--text-tertiary)", overflow: "hidden", textOverflow: "ellipsis" }}>총무 · 무료 플랜</div>
        </div>
      </div>
    </aside>
  );
}

// ---- Dashboard ---------------------------------------------------
function Dashboard({ onOpen, onNew }) {
  const [q, setQ] = React.useState("");
  const [filter, setFilter] = React.useState("전체");
  return (
    <div style={{ padding: "28px 32px", overflowY: "auto", flex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <h1 style={{ margin: 0, font: "700 26px/1.2 var(--font-sans)", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>내 일정</h1>
          <p style={{ margin: "6px 0 0", font: "400 14px/1.4 var(--font-sans)", color: "var(--text-tertiary)" }}>여행·행사·모임을 만들고 링크로 공유해요.</p>
        </div>
        <Button variant="primary" size="l" leadingIcon={<Icon name="plus" size={19} />} onClick={onNew}>새 일정 만들기</Button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ width: 280 }}><SearchField value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ("")} placeholder="일정 검색" /></div>
        <SegmentedControl options={["전체", "공개", "비공개", "임시저장"]} value={filter} onChange={setFilter} size="s" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(248px, 1fr))", gap: 16 }}>
        {SCHEDULES.map((s) => {
          const st = STATUS[s.status];
          return (
            <Card key={s.id} interactive padding={0} onClick={onOpen} style={{ overflow: "hidden" }}>
              <div style={{ height: 96, background: s.cover, position: "relative" }}>
                <span style={{ position: "absolute", top: 12, left: 12 }}><Badge tone={st.tone} dot={st.dot}>{st.label}</Badge></span>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ font: "700 16px/1.35 var(--font-sans)", letterSpacing: "-0.01em", color: "var(--text-primary)" }}>{s.title}</div>
                <div style={{ font: "400 13px/1.4 var(--font-sans)", color: "var(--text-tertiary)", marginTop: 4 }}>{s.meta}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 12, color: "var(--text-secondary)" }}>
                  <Icon name="eye" size={15} />
                  <span className="tnum" style={{ font: "600 13px/1 var(--font-sans)" }}>{s.views.toLocaleString()}</span>
                  <span style={{ font: "400 13px/1 var(--font-sans)", color: "var(--text-tertiary)" }}>회 조회</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ---- Editor ------------------------------------------------------
const BLOCKS = [
  { k: "basic", label: "기본 정보", icon: "info", desc: "제목 · 기간 · 설명 · 커버" },
  { k: "highlight", label: "하이라이트", icon: "sparkles", desc: "공지 · 준비물 · 회비" },
  { k: "timetable", label: "타임테이블", icon: "calendar-clock", desc: "3일 · 9개 항목" },
  { k: "place", label: "장소", icon: "map-pin", desc: "4곳 등록됨" },
];
function Editor({ onShare, onToast }) {
  const [sel, setSel] = React.useState("basic");
  const [title, setTitle] = React.useState("제주 워크샵 2026");
  const [drag, setDrag] = React.useState(null);
  const [blocks, setBlocks] = React.useState(BLOCKS);
  const reorder = (from, to) => { const b = [...blocks]; const [m] = b.splice(from, 1); b.splice(to, 0, m); setBlocks(b); };
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
      {/* editor top bar */}
      <div style={{ height: 60, flex: "0 0 auto", borderBottom: "1px solid var(--border-secondary)", background: "var(--surface-card)", display: "flex", alignItems: "center", gap: 12, padding: "0 24px" }}>
        <span style={{ font: "700 16px/1 var(--font-sans)", color: "var(--text-primary)" }}>일정 편집</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5, font: "500 12px/1 var(--font-sans)", color: "var(--text-success)" }}><Icon name="check" size={14} /> 자동 저장됨</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <Button variant="secondary" size="m" leadingIcon={<Icon name="eye" size={17} />} onClick={() => onToast("미리보기를 열었어요")}>미리보기</Button>
          <Button variant="primary" size="m" leadingIcon={<Icon name="link" size={17} />} onClick={onShare}>공유 링크 발행</Button>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* component palette / canvas */}
        <div style={{ flex: 1, minWidth: 0, padding: 24, overflowY: "auto" }}>
          <div style={{ font: "600 12px/1 var(--font-sans)", letterSpacing: "0.03em", textTransform: "uppercase", color: "var(--text-tertiary)", marginBottom: 12 }}>컴포넌트 · 드래그로 순서 변경</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {blocks.map((b, i) => {
              const on = sel === b.k;
              return (
                <div key={b.k} draggable onClick={() => setSel(b.k)}
                  onDragStart={() => setDrag(i)}
                  onDragOver={(e) => { e.preventDefault(); }}
                  onDrop={() => { if (drag !== null && drag !== i) reorder(drag, i); setDrag(null); }}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 14px", background: "var(--surface-card)", border: `1.5px solid ${on ? "var(--border-primary)" : "var(--border-secondary)"}`, borderRadius: "var(--radius-l)", cursor: "grab", opacity: drag === i ? 0.5 : 1 }}>
                  <span style={{ color: "var(--grey-400)", cursor: "grab" }}><Icon name="grip-vertical" size={18} /></span>
                  <span style={{ display: "grid", placeItems: "center", width: 30, height: 38, color: on ? "var(--text-brand)" : "var(--text-secondary)", flex: "0 0 auto" }}><Icon name={b.icon} size={20} /></span>
                  <div style={{ flex: 1 }}>
                    <div style={{ font: "600 15px/1.3 var(--font-sans)", color: "var(--text-primary)" }}>{b.label}</div>
                    <div style={{ font: "400 12px/1.3 var(--font-sans)", color: "var(--text-tertiary)" }}>{b.desc}</div>
                  </div>
                  <span style={{ color: "var(--grey-400)" }}><Icon name="chevron-right" size={18} /></span>
                </div>
              );
            })}
            <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px", border: "1.5px dashed var(--border-strong)", borderRadius: "var(--radius-l)", background: "transparent", color: "var(--text-secondary)", font: "600 14px/1 var(--font-sans)", cursor: "pointer" }}><Icon name="plus" size={17} /> 컴포넌트 추가</button>
          </div>
        </div>
        {/* inspector */}
        <div style={{ width: 320, flex: "0 0 auto", borderLeft: "1px solid var(--border-secondary)", background: "var(--surface-card)", padding: 24, overflowY: "auto" }}>
          {sel === "basic" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ font: "700 15px/1 var(--font-sans)", color: "var(--text-primary)" }}>기본 정보</div>
              <TextField label="제목" value={title} onChange={(e) => setTitle(e.target.value)} />
              <TextField label="기간" value="2026.10.24 – 10.26" onChange={() => {}} />
              <TextField label="설명" multiline rows={3} value="디자인팀 2박 3일 제주 워크샵이에요." onChange={() => {}} helper="참가자 뷰어 상단에 보여요." />
              <div>
                <div style={{ font: "600 13px/1 var(--font-sans)", color: "var(--text-secondary)", marginBottom: 8 }}>커버</div>
                <div style={{ height: 84, borderRadius: "var(--radius-l)", background: "linear-gradient(150deg,var(--blue-600),var(--blue-400))" }} />
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ font: "700 15px/1 var(--font-sans)", color: "var(--text-primary)" }}>{BLOCKS.find((b) => b.k === sel).label}</div>
              <div style={{ font: "400 13px/1.6 var(--font-sans)", color: "var(--text-tertiary)" }}>이 컴포넌트의 항목을 추가·수정하고 순서를 바꿀 수 있어요.</div>
              <div style={{ height: 1, background: "var(--border-secondary)" }} />
              {[1, 2, 3].map((n) => (
                <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--fill-secondary)", borderRadius: "var(--radius-m)" }}>
                  <Icon name="grip-vertical" size={16} color="var(--grey-400)" />
                  <span style={{ font: "500 13px/1 var(--font-sans)", color: "var(--text-primary)" }}>항목 {n}</span>
                </div>
              ))}
              <Button variant="secondary" size="m" leadingIcon={<Icon name="plus" size={16} />}>항목 추가</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---- Share manager -----------------------------------------------
function ShareManager({ onToast }) {
  const [active, setActive] = React.useState(true);
  return (
    <div style={{ padding: "28px 32px", overflowY: "auto", flex: 1, maxWidth: 760 }}>
      <h1 style={{ margin: 0, font: "700 26px/1.2 var(--font-sans)", letterSpacing: "-0.02em", color: "var(--text-primary)" }}>공유 · 통계</h1>
      <p style={{ margin: "6px 0 24px", font: "400 14px/1.4 var(--font-sans)", color: "var(--text-tertiary)" }}>제주 워크샵 2026</p>

      <Card padding={20} style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: active ? "var(--text-brand)" : "var(--text-tertiary)" }}><Icon name="link" size={20} /></span>
            <span style={{ font: "700 15px/1 var(--font-sans)", color: "var(--text-primary)" }}>공유 링크</span>
            <Badge tone={active ? "success" : "neutral"} dot={active}>{active ? "활성화" : "비활성화"}</Badge>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ font: "500 13px/1 var(--font-sans)", color: "var(--text-secondary)" }}>링크 활성화</span>
            <Switch checked={active} onChange={setActive} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 14px", height: 48, background: "var(--fill-secondary)", border: "1px solid var(--border-secondary)", borderRadius: "var(--radius-m)", font: "500 14px/1 var(--font-mono,monospace)", color: active ? "var(--text-primary)" : "var(--text-placeholder)", overflow: "hidden" }}>planit.app/s/{active ? "j3k9x2" : "———"}</div>
          <Button variant="secondary" size="l" leadingIcon={<Icon name="copy" size={18} />} disabled={!active} onClick={() => onToast("링크를 복사했어요")}>복사</Button>
          <Button variant="primary" size="l" disabled={!active} onClick={() => onToast("공유 시트를 열었어요")}>공유</Button>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border-secondary)" }}>
          <div style={{ font: "400 13px/1.5 var(--font-sans)", color: "var(--text-tertiary)", maxWidth: 380 }}>새 링크를 발급하면 기존 링크는 무효화돼요. 이미 공유한 참가자는 열 수 없게 돼요.</div>
          <Button variant="ghost" size="m" onClick={() => onToast("새 링크를 발급했어요")}>새 링크 발급</Button>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {[{ n: "1,280", l: "총 조회수", i: "eye" }, { n: "384", l: "주소 복사", i: "copy" }, { n: "512", l: "지도 열기", i: "map" }].map((m) => (
          <Card key={m.l} padding={18}>
            <span style={{ color: "var(--text-tertiary)" }}><Icon name={m.i} size={18} /></span>
            <div className="tnum" style={{ font: "700 28px/1.1 var(--font-sans)", letterSpacing: "-0.02em", color: "var(--text-primary)", marginTop: 10 }}>{m.n}</div>
            <div style={{ font: "400 13px/1 var(--font-sans)", color: "var(--text-tertiary)", marginTop: 4 }}>{m.l}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { PlanitPlanner: { Sidebar, Dashboard, Editor, ShareManager } });
