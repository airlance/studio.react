import { Navigate, Route, Routes } from 'react-router-dom';
import { DefaultLayout } from '@/layout';
import CalendarPage from './pages/calendar/page';

export default function EventsModule() {
    return (
        <Routes>
            <Route element={<DefaultLayout />}>
                <Route index element={<Navigate to="calendar" replace />} />
                <Route path="calendar" element={<CalendarPage />} />
            </Route>
        </Routes>
    );
}
