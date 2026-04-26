import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollRestorationManager from "./components/ScrollRestorationManager.tsx";
import AuthEventBridge from "./components/AuthEventBridge.tsx";
import PageLoader from "./components/common/PageLoader.tsx";

const AdminLayout = lazy(() => import("./layouts/AdminLayout.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const PetaRisiko = lazy(() => import("./pages/PetaRisiko.tsx"));
const DataSurveyList = lazy(() => import("./pages/DataSurveyList.tsx"));
const DataSurveyDetail = lazy(() => import("./pages/DataSurveyDetail.tsx"));
const DataSurveyEdit = lazy(() => import("./pages/DataSurveyEdit.tsx"));
const DataSurveyMap = lazy(() => import("./pages/DataSurveyMap.tsx"));
const MasterKecamatanList = lazy(
  () => import("./pages/MasterKecamatanList.tsx"),
);
const MasterKecamatanAdd = lazy(() => import("./pages/MasterKecamatanAdd.tsx"));
const MasterKecamatanEdit = lazy(
  () => import("./pages/MasterKecamatanEdit.tsx"),
);
const MasterPuskesmasList = lazy(
  () => import("./pages/MasterPuskesmasList.tsx"),
);
const MasterPuskesmasAdd = lazy(() => import("./pages/MasterPuskesmasAdd.tsx"));
const MasterPuskesmasDetail = lazy(
  () => import("./pages/MasterPuskesmasDetail.tsx"),
);
const MasterPuskesmasEdit = lazy(
  () => import("./pages/MasterPuskesmasEdit.tsx"),
);
const LaporanPeriodik = lazy(() => import("./pages/LaporanPeriodik.tsx"));
const LaporanPuskesmas = lazy(() => import("./pages/LaporanPuskesmas.tsx"));
const SurveyInput = lazy(() => import("./pages/SurveyInput.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));

function App() {
  return (
    <BrowserRouter>
      <ScrollRestorationManager />
      <AuthEventBridge />
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
