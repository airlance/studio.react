import { Route, Routes, Navigate } from 'react-router-dom';
import WorkspaceInvitePage from './pages/invite/page';

export default function WorkspaceRoutes() {
  return (
    <Routes>
      <Route path="/invites/:token" element={<WorkspaceInvitePage />} />
      <Route index element={<Navigate to="/" replace />} />
    </Routes>
  );
}
