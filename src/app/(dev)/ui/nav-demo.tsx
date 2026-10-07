"use client";

import { useState } from "react";
import { Tabs } from "@/client/components/ui/tabs";
import { SegmentedControl } from "@/client/components/ui/segmented-control";

export function NavDemo() {
  const [tab, setTab] = useState("timetable");
  const [status, setStatus] = useState("public");

  return (
    <div className="flex max-w-md flex-col gap-6">
      <Tabs
        data-testid="tabs-demo"
        value={tab}
        onChange={setTab}
        items={[
          { value: "timetable", label: "타임테이블" },
          { value: "places", label: "장소" },
        ]}
      />
      <SegmentedControl
        data-testid="segment-demo"
        value={status}
        onChange={setStatus}
        label="공개 상태"
        items={[
          { value: "draft", label: "임시저장" },
          { value: "public", label: "공개" },
          { value: "private", label: "비공개" },
        ]}
      />
    </div>
  );
}
