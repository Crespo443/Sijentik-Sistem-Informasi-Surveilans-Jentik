export type AnyObject = Record<string, any>;

export const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export const calculateDensityFigure = (hi: number) => {
  if (hi === 0) return 0;
  if (hi < 4) return 1;
  if (hi < 8) return 2;
  if (hi < 18) return 3;
  if (hi < 29) return 4;
  if (hi < 38) return 5;
  if (hi < 50) return 6;
  if (hi < 60) return 7;
  if (hi < 77) return 8;
  return 9;
};

export const calculateMayaIndex = (densityFigure: number) => {
  if (densityFigure < 3) return "Low";
  if (densityFigure < 6) return "Medium";
  return "High";
};

export const formatDate = (value?: string | Date | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : dateFormatter.format(date);
};

export const isUuid = (value?: string) =>
  !!value &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

export const getSurveyStats = (survey: AnyObject) => {
  const containers = Array.isArray(survey.containers) ? survey.containers : [];
  const inspected = containers.reduce(
    (sum: number, container: AnyObject) =>
      sum + (Number(container.inspectedCount) || 0),
    0,
  );
  const positive = containers.reduce(
    (sum: number, container: AnyObject) =>
      sum + (Number(container.positiveCount) || 0),
    0,
  );
  const hasPositive = containers.some(
    (container: AnyObject) => Number(container.positiveCount) > 0,
  );
  const houseIndex = hasPositive ? 100 : 0;
  const containerIndex = inspected > 0 ? (positive / inspected) * 100 : 0;
  const breteauIndex = positive;

  return {
    inspected,
    positive,
    hasPositive,
    houseIndex,
    containerIndex,
    breteauIndex,
  };
};
