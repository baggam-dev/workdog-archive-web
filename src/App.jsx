import { Navigate, Route, Routes } from 'react-router-dom'
import PortalLayout from './components/layouts/PortalLayout'
import AppLayout from './components/layouts/AppLayout'
import PortalHomePage from './pages/PortalHomePage'
import HomePage from './pages/HomePage'
import FoldersPage from './pages/FoldersPage'
import DocsPage from './pages/DocsPage'
import FolderManagementPage from './pages/FolderManagementPage'
import './App.css'

function PlaceholderPage({ title, desc }) {
  return (
    <section>
      <h1>{title}</h1>
      <p className="muted">{desc}</p>
    </section>
  )
}

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
              <DocsPage />
            </AppLayout>
          )}
        />

        <Route path="/students" element={<PlaceholderPage title="학생관리" desc="포탈 구조만 선반영된 준비중 화면입니다." />} />
        <Route path="/apps" element={<PlaceholderPage title="추후 앱" desc="여기에 신규 업무 앱이 순차적으로 추가됩니다." />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PortalLayout>
  )
}

export default App
