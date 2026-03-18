# workdog-archive-web

workdog-archive 프론트 React 전환용 웹앱(R1 셸)입니다.

## 목적
- 기존 workdog API를 유지한 채 React 프론트로 단계 전환
- R1 단계: 라우트/레이아웃/API 연결 검증

## 실행
```bash
npm install
npm run dev -- --host 0.0.0.0 --port 3002
```

## 환경변수
`.env` 또는 PM2 환경변수로 설정

- `VITE_API_BASE_URL` (기본값: `http://168.107.14.124:3030`)

예시:
```env
VITE_API_BASE_URL=http://168.107.14.124:3030
```

## 배포(현재)
```bash
npm run build
npm run preview -- --host 0.0.0.0 --port 3002
```
