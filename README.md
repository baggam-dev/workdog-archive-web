# workdog-archive-web

workdog-archive의 React 프론트엔드입니다.
기존 API(3030)를 그대로 사용하면서 UI/UX를 React 구조로 전환한 운영 버전입니다.

## 현재 상태
- 단계: **R3 완료 (읽기 + 쓰기 기능 이관)**
- 운영 URL: `http://168.107.14.124:3000`
- API URL: `http://168.107.14.124:3030`

## 주요 기능
- 폴더
  - 목록 조회
  - 생성 / 수정 / 삭제
- 문서
  - 목록 조회
  - 업로드 (`hwp`, `pdf`, `xlsx`, `xls`, `txt`)
  - 단건 삭제 / 선택 일괄 삭제
  - 중요표시 토글
  - 상세 보기 + 메모 저장
- 검색/정렬
  - 필터: 문서명, 카테고리, 형식, 태그, 중요문서
  - 정렬: 중요/문서명/형식/카테고리/수정일 (3단 토글)
- 반응형 UI
  - 데스크톱: 관리자형 테이블
  - 모바일: 카드형 문서 목록
- 운영 안정화
  - API 네트워크/5xx 오류 1회 자동 재시도
  - 로딩 스피너 / 에러 토스트 알림

## 개발 실행
```bash
npm install
npm run dev -- --host 0.0.0.0 --port 3000
```

## 환경변수
`.env` 또는 PM2 환경변수로 설정

- `VITE_API_BASE_URL` (기본값: `http://168.107.14.124:3030`)

예시:
```env
VITE_API_BASE_URL=http://168.107.14.124:3030
```

## 운영 배포 (PM2)
```bash
npm run build
pm2 start npm --name workdog-archive-web-3000 -- run preview -- --host 0.0.0.0 --port 3000
pm2 save
```

## 릴리즈 체크
- 상세 스모크 테스트는 `docs/release-checklist.md` 참고
