import { useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "../components/common/PageHeader";
import { Button } from "../components/common/Button";
import { useNavigate, useParams } from "react-router-dom";
import { SurveyEditLocationSection } from "../components/data-survey-edit/SurveyEditLocationSection";
import { SurveyContainerSection } from "../components/data-survey-edit/SurveyContainerSection";
import { SurveyInterventionsSection } from "../components/data-survey-edit/SurveyInterventionsSection";
import { useSurveyEditForm } from "../hooks/useSurveyEditForm";

export default function DataSurveyEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    villages,
    loading,
    fetching,
    error,
    formData,
    setFormData,
    containerData,
    interventionData,
    handleInputChange,
    handleContainerChange,
    handleInterventionChange,
    handleGetLocation,
    handleSubmit,
  } = useSurveyEditForm({
    id,
    navigate: (to: string) => navigate(to),
    queryClient,
  });

  if (fetching) return <div className="p-6">Memuat form edit...</div>;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      <PageHeader
        title="Edit Survei Jentik"
        breadcrumbs={[
          { label: "Data Survey", href: "/data-survey" },
          { label: "Edit" },
        ]}
      />

      <div className="flex-1 overflow-y-auto p-6 bg-background-light custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded border border-red-200">
              {error}
            </div>
          )}
          <form className="animate-fade-in" onSubmit={handleSubmit}>
            <SurveyEditLocationSection
              villages={villages}
              formData={formData}
              setFormData={setFormData}
              handleInputChange={handleInputChange}
              handleGetLocation={handleGetLocation}
            />

            <SurveyContainerSection
              title="2. Kontainer Sehari-hari"
              icon="water_drop"
              category="DAILY"
              containerData={containerData}
              handleContainerChange={handleContainerChange}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
              <SurveyContainerSection
                title="3. Non Sehari-hari"
                icon="inventory_2"
                category="NON_DAILY"
                containerData={containerData}
                handleContainerChange={handleContainerChange}
                compact
              />
              <SurveyContainerSection
                title="4. Kontainer Alam"
                icon="nature"
                category="NATURAL"
                containerData={containerData}
                handleContainerChange={handleContainerChange}
                compact
              />
            </div>

            <SurveyInterventionsSection
              interventionData={interventionData}
              formData={formData}
              handleInterventionChange={handleInterventionChange}
              handleInputChange={handleInputChange}
            />

            <div className="flex justify-end gap-3 mb-10">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(-1)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="primary"
                icon="save"
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
