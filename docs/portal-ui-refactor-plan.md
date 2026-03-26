# Workdog Portal UI Refactor Plan (Archive-first)

## 목적
- 단기: Workdog-Archive를 세련된 관리자형 UI로 안정화
- 장기: Workdog 포탈 하위 다중 앱 구조를 위한 공통 UI 프레임 확보

## 원칙
- 기능 추가보다 UI 구조 리팩토링 우선
- 기존 기능 무손상(회귀 금지)
- 단계별 검증(build/smoke/deploy/commit)

## IA (정보구조)
- `/` 포탈 홈(앱 런처 3x3)
- `/archive/*` Workdog-Archive
- `/students/*` 학생관리(예정)
- `/apps/*` 추후 앱

## 공통 레이아웃
- `PortalLayout`: 포탈 전용 프레임
- `AppLayout`: 좌측 네비 + 상단 헤더 + 본문

## 공통 컴포넌트 우선순위
1. PageHeader
2. FilterBar
3. DataTable
4. EmptyState
5. Toast / InlineState
6. AppCard / SummaryStat / ActionMenu

## 2주 실행 계획

### Week 1
- Day 1: IA/라우팅/PortalLayout/AppLayout
- Day 2: PageHeader 공통화
- Day 3: FilterBar 공통화
- Day 4: DataTable 1차 공통화
- Day 5: Toast/InlineState 표준화

### Week 2
- Day 6: 포탈 홈 3x3 AppCardGrid 뼈대
- Day 7: AppCard 상태/설명/진입 규격화
- Day 8: SummaryStat/EmptyState/ActionMenu
- Day 9: 반응형 + 디자인 토큰 정리
- Day 10: Portal-Ready v0 스모크 및 릴리즈 태그

## 지금 반영
- 공통 레이아웃/컴포넌트 뼈대
- Archive 화면 구조 이관
- 포탈 홈 골격 + Archive 연결

## 차후 반영
- 권한/역할 기반 노출
- 전역 검색/알림/최근활동
- 학생관리 앱 기능
- RAG/문서생성 파이프라인 UX
