@AGENTS.md

# 작업 지침

0. 작업이 종료되면 요약하지 않고, 다음 절차를 따른다.
1. 매 작업 종료 후에는 `/Users/ipang/dev/plan-it/docs/update`폴더 내에 파일(오늘 날짜)을 만든다.
   - 만약 파일이 존재한다면 2번으로 넘어간다.
2. 파일 안에는 작업이 완료 시간 + 작업 내용 요약을 작성한다.
   - 작업 내용 요약은 맨 하단에 누적하여 작성한다.

---

# AI 코드 보안 지침

## 1. 민감 정보 보호

- API 키, 토큰, 비밀번호 등은 소스코드에 하드코딩하지 않는다. 반드시 `process.env`로 참조한다.
- `.env*` 파일이 `.gitignore`에 포함되어 있는지 확인한다. `.env.example`에는 더미 값만 기록한다.
- `console.log`, 에러 메시지, 커밋 메시지에 민감 정보를 포함하지 않는다.

## 2. 코드 생성 보안

- **입력값 검증**: 사용자 입력은 서버 측에서 타입·길이·형식을 검증한다.
- **인젝션 방지**: SQL은 Parameterized Query, HTML은 `dangerouslySetInnerHTML` 지양(불가피 시 DOMPurify 사용), 쉘 명령에 사용자 입력 직접 전달 금지.
- **인증 토큰**: JWT 등은 `httpOnly` + `secure` 쿠키에 저장한다. `localStorage` 사용 금지.
- **Server/Client 분리**: API 키, DB 접근 등 민감 로직은 Server Component 또는 Server Action에서만 처리한다. `'use client'` 파일에 노출하지 않는다.

## 3. API 보안

- `Access-Control-Allow-Origin: *` 사용 금지. 허용 도메인을 명시한다.
- API 라우트(`app/api/`)에는 인증 미들웨어를 적용한다.
- 프로덕션 에러 응답에 스택 트레이스나 내부 구현 정보를 노출하지 않는다.

## 4. 의존성 관리

- 새 패키지 설치 후 `npm audit`으로 취약점을 확인한다.
- `package-lock.json`을 커밋하여 버전을 고정한다.

## 5. 데이터 삭제

- 데이터 삭제 로직은 물리 삭제보다 논리 삭제(soft delete)를 우선 적용한다.
