import { Navigate, Route, Routes } from 'react-router-dom'
import PortalLayout from './components/layouts/PortalLayout'
import AppLayout from './components/layouts/AppLayout'
import PortalHomePage from './pages/PortalHomePage'
import HomePage from './pages/HomePage'
import FoldersPage from './pages/FoldersPage'
import FolderManagementPage from './pages/FolderManagementPage'
import StudentsDashboardPage from './pages/StudentsDashboardPage'
import ComingSoonPage from './pages/ComingSoonPage'
import TaskdogMockPage from './pages/TaskdogMockPage'
import GeneratePage from './pages/GeneratePage'
import GeneratedDocumentPage from './pages/GeneratedDocumentPage'
import './App.css'

const taskdogNavItems = [
  { to: '/taskdog', label: '대시보드', icon: 'home', end: true },
  { to: '/taskdog/tasks', label: '태스크 센터', icon: 'docs' },
  { to: '/taskdog/runs', label: '실행 이력', icon: 'status' },
  { disabled: true, label: '알림 설정 (준비중)', icon: 'bolt' },
]

function App() {
  return (
    <PortalLayout>
      <Routes>
        <Route path="/" element={<PortalHomePage />} />

        <Route
          path="/archive"
          element={(
            <AppLayout appName="Workdog-Archive">
              <HomePage />
            </AppLayout>
          )}
        />
        <Route
          path="/archive/documents"
          element={(
            <AppLayout appName="Workdog-Archive">
              <FoldersPage />
            </AppLayout>
          )}
        />
        <Route
          path="/archive/folders"
          element={(
            <AppLayout appName="Workdog-Archive">
              <FolderManagementPage />
            </AppLayout>
          )}
        />
        <Route
          path="/archive/generate"
          element={(
            <AppLayout appName="Workdog-Archive">
              <GeneratePage />
            </AppLayout>
          )}
        />
        <Route
          path="/archive/generated/:id"
          element={(
            <AppLayout appName="Workdog-Archive">
              <GeneratedDocumentPage />
            </AppLayout>
          )}
        />
        <Route
          path="/archive/status"
          element={(
            <AppLayout appName="Workdog-Archive">
              <ComingSoonPage title="상태" />
            </AppLayout>
          )}
        />

        <Route
          path="/taskdog"
          element={(
            <AppLayout appName="Taskdog" navItems={taskdogNavItems}>
              <TaskdogMockPage />
            </AppLayout>
          )}
        />
        <Route
          path="/taskdog/tasks"
          element={(
            <AppLayout appName="Taskdog" navItems={taskdogNavItems}>
              <TaskdogMockPage />
            </AppLayout>
          )}
        />
        <Route
          path="/taskdog/runs"
          element={(
            <AppLayout appName="Taskdog" navItems={taskdogNavItems}>
              <TaskdogMockPage />
            </AppLayout>
          )}
        />

        <Route path="/students" element={<StudentsDashboardPage />} />
        <Route path="/apps" element={<ComingSoonPage title="추후 추가 앱" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PortalLayout>
  )
}

export default App
