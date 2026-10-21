/**
 * @file 랜딩 배경 영상 주소 — 이 파일 한 곳에만 둔다
 * @description ⚠️ Orbis(Higgsfield) 프롬프트에 딸린 남의 영상을 사용자 결정(2026-10-21)으로 당분간 그대로 쓴다.
 *              출시 전 자체 영상으로 바꿔야 한다(라이선스). 바꿀 땐 이 파일만 고친다.
 *              영상이 안 떠도(차단·삭제·느린 망) 페이지는 바탕·그늘·오로라 빛만으로 읽힌다(landing-video.tsx).
 */

const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P";

export const LANDING_VIDEOS = {
  hero: `${CDN}/hf_20260331_045634_e1c98c76-1265-4f5c-882a-4276f2080894.mp4`,
  try: `${CDN}/hf_20260331_151551_992053d1-3d3e-4b8c-abac-45f22158f411.mp4`,
  final: `${CDN}/hf_20260331_055729_72d66327-b59e-4ae9-bb70-de6ccb5ecdb0.mp4`,
  jeju: `${CDN}/hf_20260331_053923_22c0a6a5-313c-474c-85ff-3b50d25e944a.mp4`,
  mt: `${CDN}/hf_20260331_054411_511c1b7a-fb2f-42ef-bf6c-32c0b1a06e79.mp4`,
  ws: `${CDN}/hf_20260331_055427_ac7035b5-9f3b-4289-86fc-941b2432317d.mp4`,
} as const;
