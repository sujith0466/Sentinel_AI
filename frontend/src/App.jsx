import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Copilot from './pages/Copilot';
import InvestigationRoom from './pages/InvestigationRoom';
import Briefs from './pages/Briefs';
import Cases from './pages/Cases';
import CaseDetails from './pages/CaseDetails';
import Criminals from './pages/Criminals';
import Victims from './pages/Victims';
import Network from './pages/Network';
import Risk from './pages/Risk';
import Hotspots from './pages/Hotspots';
import Forecast from './pages/Forecast';
import Sociology from './pages/Sociology';
import Governance from './pages/Governance';
import Alerts from './pages/Alerts';

import Settings from './pages/Settings';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="investigation" element={<InvestigationRoom />} />
          <Route path="briefs" element={<Briefs />} />
          <Route path="copilot" element={<Copilot />} />
          <Route path="cases" element={<Cases />} />
          <Route path="cases/:id" element={<CaseDetails />} />
          <Route path="criminals" element={<Criminals />} />
          <Route path="victims" element={<Victims />} />
          <Route path="network" element={<Network />} />
          <Route path="risk" element={<Risk />} />
          <Route path="hotspots" element={<Hotspots />} />
          <Route path="forecast" element={<Forecast />} />
          <Route path="sociology" element={<Sociology />} />
          <Route path="governance" element={<Governance />} />
          <Route path="alerts" element={<Alerts />} />

          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
