import { Route, Routes } from 'react-router-dom';
import ChatPage from './pages/page';

export default function ChatModule() {
    return (
        <Routes>
            <Route index element={<ChatPage />} />
        </Routes>
    );
}
