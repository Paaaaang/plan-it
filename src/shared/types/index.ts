/**
 * @file 통합 타입 export
 * @description 모든 타입 정의를 한 곳에서 re-export하는 배럴 파일.
 *
 * @exports
 *  - src/shared/types/plan.ts          → Plan, PlanStatus, PlanType
 *  - src/shared/types/notice.ts        → Notice
 *  - src/shared/types/schedule.ts      → Day, ScheduleItem
 *  - src/shared/types/place.ts         → Place
 *  - src/shared/types/transport.ts     → TransportInfo
 *  - src/shared/types/user.ts          → Profile, UserRole
 *  - src/shared/types/analytics.ts     → AnalyticsEvent, EventType
 *  - src/shared/types/moderation.ts    → ModerationFlag, ModerationStatus
 *  - src/shared/types/announcement.ts  → Announcement, AnnouncementType, AnnouncementStatus
 *
 * @usage import { Plan, Notice, Day, ScheduleItem, Place } from '@/shared/types';
 */

export type {
  ViewerPlace,
  ViewerItem,
  ViewerDay,
  ViewerNotice,
  ViewerTransport,
  ViewerPlan,
  ViewerResult,
} from "./viewer";
