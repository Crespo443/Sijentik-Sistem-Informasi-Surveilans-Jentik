import { useEffect, useState } from "react";
import type { QueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import {
  CONTAINER_TYPES,
  INTERVENTION_TYPES,
} from "../lib/surveyFormConstants";

type UseSurveyEditFormArgs = {
  id?: string;
  navigate: (to: string) => void;
  queryClient: QueryClient;
};

export const useSurveyEditForm = ({
  id,
  navigate,
  queryClient,
}: UseSurveyEditFormArgs) => {
  const [villages, setVillages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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
    puskesmas: "",
    petugas: "",
    surveyDate: "",
  });

  const [containerData, setContainerData] = useState(
    CONTAINER_TYPES.map((c) => ({
      ...c,
      inspectedCount: 0 as number | "",
      positiveCount: 0 as number | "",
    })),
  );

  const [interventionData, setInterventionData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [villagesRes, surveyRes] = await Promise.all([
          api.get("/village/my-pkm"),
          api.get(`/survey/${id}`),
        ]);

        setVillages(villagesRes.data);
        const s = surveyRes.data;

        setFormData({
          villageId: s.villageId || "",
          rtrw: s.rtRw || "",
          alamat: s.address || "",
          nama_kk: s.houseOwner || "",
          jumlah_penghuni: s.occupantCount ? s.occupantCount.toString() : "",
          catatan: s.notes || "",
          lat: s.latitude ? s.latitude.toString() : "",
          lng: s.longitude ? s.longitude.toString() : "",
          puskesmas: s.accessCode?.healthCenter?.name || "-",
          petugas: s.surveyorName || "-",
          surveyDate: s.surveyDate || "",
        });

        const mergedContainers = CONTAINER_TYPES.map((ct) => {
          const existing = (s.containers || []).find(
            (c: any) =>
              c.containerName === ct.name && c.category === ct.category,
          );
          return {
            ...ct,
            inspectedCount: existing ? existing.inspectedCount : 0,
            positiveCount: existing ? existing.positiveCount : 0,
          };
        });
        setContainerData(mergedContainers);

        const loadedInterventions = INTERVENTION_TYPES.map((name) => {
          const found = s.interventions?.find(
            (i: any) => i.activityName === name,
          );
          return {
            activityName: name,
            isDone: found ? found.isDone : false,
          };
        });
        setInterventionData(loadedInterventions);
      } catch (err) {
        console.error("Failed to load survey data", err);
        setError("Gagal memuat data survei.");
      } finally {
        setFetching(false);
      }
    };
    if (id) loadData();
  }, [id]);

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
        surveyDate: formData.surveyDate
          ? new Date(formData.surveyDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
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

      await api.put(`/survey/${id}`, payload);
      queryClient.invalidateQueries({ queryKey: ["surveys"] });
      alert("Survei berhasil diperbarui!");
      navigate("/data-survey");
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal memperbarui survei.");
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};
