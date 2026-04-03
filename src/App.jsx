import { Navigate, Route, Routes } from 'react-router-dom'
import PortalLayout from './components/layouts/PortalLayout'
import AppLayout from './components/layouts/AppLayout'
import PortalHomePage from './pages/PortalHomePage'
import HomePage from './pages/HomePage'
import FoldersPage from './pages/FoldersPage'
import FolderManagementPage from './pages/FolderManagementPage'
import StudentsDashboardPage from './pages/StudentsDashboardPage'
import ComingSoonPage from './pages/ComingSoonPage'
import './App.css'

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
          path="/archive/status"
          element={(
            <AppLayout appName="Workdog-Archive">
              <ComingSoonPage title="상태" />
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
