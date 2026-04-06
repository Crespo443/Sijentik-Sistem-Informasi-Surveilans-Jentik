import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { SurveyLocationSection } from "../components/data-survey-detail/SurveyLocationSection";
import { SurveyContainerSection } from "../components/data-survey-detail/SurveyContainerSection";
import { SurveyInterventionsSection } from "../components/data-survey-detail/SurveyInterventionsSection";
import { useSurveyDetailData } from "../hooks/useSurveyDetailData";

export default function DataSurveyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    survey,
    loading,
    totalInspected,
    totalPositive,
    statusColor,
    statusText,
  } = useSurveyDetailData({ id, navigate: (to: string) => navigate(to) });

  if (loading) return <div className="p-6">Memuat detail survei...</div>;
  if (!survey) return <div className="p-6">Survei tidak ditemukan.</div>;

  return (
    <div className="flex-1 overflow-auto p-6 bg-background-light flex flex-col gap-5">
      <PageHeader
        title="Detail Data Survey"
        breadcrumbs={[
          { label: "Surveilans", href: "/" },
          { label: "Data Survey", href: "/data-survey" },
          { label: "Detail Survey" },
        ]}
        actions={
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted bg-slate-100 px-2.5 py-1 rounded border border-slate-200 font-mono">
              ID: {survey.id.substring(0, 8).toUpperCase()}
            </span>
            <Badge variant={statusColor}>{statusText}</Badge>
            <Button
              variant="secondary"
              onClick={() => navigate("/data-survey")}
              icon="arrow_back"
            >
              Kembali
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate(`/data-survey/edit/${id}`)}
              icon="edit"
            >
              Edit
            </Button>
          </div>
        }
      />

      <div className="max-w-4xl mx-auto w-full animate-fade-in pb-8">
        <SurveyLocationSection
          survey={survey}
          onViewMap={() => navigate(`/data-survey/map/${id}`)}
        />

        <SurveyContainerSection
          survey={survey}
          totalInspected={totalInspected}
          totalPositive={totalPositive}
        />

        <SurveyInterventionsSection survey={survey} />

        <div className="flex justify-end gap-3 px-1">
          <Button
            variant="secondary"
            onClick={() => navigate("/data-survey")}
            icon="arrow_back"
          >
            Kembali ke Daftar
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate(`/data-survey/edit/${id}`)}
            icon="edit"
          >
            Edit Data
          </Button>
        </div>
      </div>
    </div>
  );
}
