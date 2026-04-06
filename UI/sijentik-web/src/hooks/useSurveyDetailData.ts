import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";

type UseSurveyDetailDataArgs = {
  id?: string;
  navigate: (to: string) => void;
};

export const useSurveyDetailData = ({
  id,
  navigate,
}: UseSurveyDetailDataArgs) => {
  const [survey, setSurvey] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await api.get(`/survey/${id}`);
        setSurvey(res.data);
      } catch (err) {
        console.error("Failed to fetch survey details", err);
        alert("Gagal memuat detail survei");
        navigate("/data-survey");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSurvey();
  }, [id, navigate]);

  const totalInspected = useMemo(
    () =>
      survey?.containers?.reduce(
        (acc: number, c: any) => acc + c.inspectedCount,
        0,
      ) || 0,
    [survey],
  );

  const totalPositive = useMemo(
    () =>
      survey?.containers?.reduce(
        (acc: number, c: any) => acc + c.positiveCount,
        0,
      ) || 0,
    [survey],
  );

  const isPositive = totalPositive > 0;
  const statusColor: "danger" | "success" = isPositive ? "danger" : "success";
  const statusText = isPositive ? "Positif" : "Negatif";

  return {
    survey,
    loading,
    totalInspected,
    totalPositive,
    statusColor,
    statusText,
  };
};
