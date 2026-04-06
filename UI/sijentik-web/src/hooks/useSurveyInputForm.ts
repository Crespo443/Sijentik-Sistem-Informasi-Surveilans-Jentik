import { useEffect, useState } from "react";
import type { QueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import {
  CONTAINER_TYPES,
  INTERVENTION_TYPES,
} from "../lib/surveyFormConstants";

type UseSurveyInputFormArgs = {
  navigate: (to: string) => void;
  queryClient: QueryClient;
};

export const useSurveyInputForm = ({
  navigate,
  queryClient,
}: UseSurveyInputFormArgs) => {
  const [villages, setVillages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    villageId: "",
    rtrw: "",
    alamat: "",
    nama_kk: "",
    jumlah_penghuni: "",
    catatan: "",
    lat: "",
    lng: "",
  });

  const [containerData, setContainerData] = useState(
    CONTAINER_TYPES.map((c) => ({
      ...c,
      inspectedCount: 0 as number | "",
      positiveCount: 0 as number | "",
    })),
  );

  const [interventionData, setInterventionData] = useState(
    INTERVENTION_TYPES.map((name) => ({
      activityName: name,
      isDone: false,
    })),
  );

  useEffect(() => {
    const fetchVillages = async () => {
      try {
        const res = await api.get("/village/my-pkm");
        setVillages(res.data);
      } catch (err) {
        console.error("Failed to fetch villages", err);
      }
    };
    fetchVillages();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContainerChange = (
    index: number,
    field: "inspectedCount" | "positiveCount",
    value: string,
  ) => {
    const newData = [...containerData];
    if (value === "") {
      newData[index][field] = "" as any;
    } else {
      const numValue = parseInt(value);
      if (!isNaN(numValue)) {
        newData[index][field] = numValue;
      }
    }
    setContainerData(newData);
  };

  const handleInterventionChange = (index: number, checked: boolean) => {
    const newData = [...interventionData];
    newData[index].isDone = checked;
    setInterventionData(newData);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            lat: position.coords.latitude.toString(),
            lng: position.coords.longitude.toString(),
          });
          alert("Lokasi berhasil didapatkan!");
        },
        () => {
          alert("Gagal mendapatkan lokasi. Pastikan GPS aktif.");
        },
      );
    } else {
      alert("Geolocation tidak didukung di browser ini.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        houseOwner: formData.nama_kk,
        villageId: formData.villageId,
        surveyDate: new Date().toISOString().split("T")[0],
        rtRw: formData.rtrw,
        address: formData.alamat,
        occupantCount: formData.jumlah_penghuni
          ? parseInt(formData.jumlah_penghuni)
          : null,
        latitude: formData.lat ? parseFloat(formData.lat) : null,
        longitude: formData.lng ? parseFloat(formData.lng) : null,
        notes: formData.catatan,
        containers: containerData
          .filter((c) => (Number(c.inspectedCount) || 0) > 0)
          .map((c) => ({
            ...c,
            containerName: c.name,
            inspectedCount: Number(c.inspectedCount) || 0,
            positiveCount: Number(c.positiveCount) || 0,
          })),
        interventions: interventionData,
      };

      await api.post("/survey/submit", payload);
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
      alert("Survei berhasil disimpan!");
      navigate("/data-survey");
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menyimpan survei.");
    } finally {
      setLoading(false);
    }
  };

  return {
    villages,
    loading,
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
  };
};
