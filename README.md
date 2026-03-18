# workdog-archive-web

workdog-archive 프론트 React 전환용 웹앱입니다.

## 목적
- 기존 workdog API를 유지한 채 React 프론트로 단계 전환
- 현재 단계: **R2 (읽기 기능 이관)**

## 포함 기능 (R2)
- 폴더 목록 조회
- 선택 폴더 문서 목록 조회
- 필터: 제목/카테고리/형식/태그/중요문서
- 정렬: 중요/문서명/형식/카테고리/수정일 (3단 토글)
- 모바일 카드 뷰

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
