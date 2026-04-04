import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import PetaRisiko from "./pages/PetaRisiko";
import DataSurveyList from "./pages/DataSurveyList";
import DataSurveyDetail from "./pages/DataSurveyDetail";
import DataSurveyEdit from "./pages/DataSurveyEdit";
import DataSurveyMap from "./pages/DataSurveyMap";
import MasterKecamatanList from "./pages/MasterKecamatanList";
import MasterKecamatanAdd from "./pages/MasterKecamatanAdd";
import MasterKecamatanEdit from "./pages/MasterKecamatanEdit";
import MasterPuskesmasList from "./pages/MasterPuskesmasList";
import MasterPuskesmasAdd from "./pages/MasterPuskesmasAdd";
import MasterPuskesmasDetail from "./pages/MasterPuskesmasDetail";
import MasterPuskesmasEdit from "./pages/MasterPuskesmasEdit";
import LaporanPeriodik from "./pages/LaporanPeriodik";
import LaporanPuskesmas from "./pages/LaporanPuskesmas";
import SurveyInput from "./pages/SurveyInput";
import Login from "./pages/Login";
import ScrollRestorationManager from "./components/ScrollRestorationManager";
import AuthEventBridge from "./components/AuthEventBridge";

function App() {
  return (
    <BrowserRouter>
      <ScrollRestorationManager />
      <AuthEventBridge />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="peta-risiko" element={<PetaRisiko />} />

          <Route path="data-survey">
            <Route index element={<DataSurveyList />} />
            <Route path="detail/:id" element={<DataSurveyDetail />} />
            <Route path="edit/:id" element={<DataSurveyEdit />} />
            <Route path="map/:id" element={<DataSurveyMap />} />
          </Route>

          <Route path="master/kecamatan">
            <Route index element={<MasterKecamatanList />} />
            <Route path="add" element={<MasterKecamatanAdd />} />
            <Route path="edit/:id" element={<MasterKecamatanEdit />} />
          </Route>

          <Route path="master/puskesmas">
            <Route index element={<MasterPuskesmasList />} />
            <Route path="add" element={<MasterPuskesmasAdd />} />
            <Route path="detail/:id" element={<MasterPuskesmasDetail />} />
            <Route path="edit/:id" element={<MasterPuskesmasEdit />} />
          </Route>

          <Route path="laporan">
            <Route index element={<LaporanPeriodik />} />
            <Route path="puskesmas/:id" element={<LaporanPuskesmas />} />
          </Route>

          <Route path="survey" element={<SurveyInput />} />

          {/* Add more routes here progressively */}
          <Route
            path="*"
            element={<div className="p-6">404 - Halaman Belum Dimigrasi</div>}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
