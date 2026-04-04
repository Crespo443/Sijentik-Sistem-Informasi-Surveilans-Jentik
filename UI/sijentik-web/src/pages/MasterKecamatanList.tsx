import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";
import { Button } from "../components/common/Button";
import { SearchBar } from "../components/common/SearchBar";
import api from "../lib/api";

export default function MasterKecamatanList() {
  const [districts, setDistricts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchDistricts = async () => {
      setLoading(true);
      try {
        const res = await api.get("/district");
        setDistricts(res.data);
      } catch (err) {
        console.error("Failed to fetch districts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDistricts();
  }, []);

  return (
    <div className="flex-1 overflow-hidden p-6 bg-background-light flex flex-col gap-4">
      <PageHeader
        title="Data Kecamatan"
        breadcrumbs={[{ label: "Data Master" }, { label: "Kecamatan" }]}
        actions={
          <>
            <Button variant="secondary" icon="help">
              Help Guide
            </Button>
          </>
        }
      />

      {user?.role === "ADMIN" && (
        <SearchBar
          placeholder="Cari ID, Kecamatan, Nama Camat ..."
          addLabel="Tambah Kecamatan"
          addHref="/master/kecamatan/add"
        />
      )}
      {user?.role !== "ADMIN" && (
        <SearchBar placeholder="Cari ID, Kecamatan, Nama Camat ..." />
      )}

      {/* Data Table Container */}
      <div className="bg-surface border border-border-subtle rounded shadow-card flex-1 flex flex-col overflow-hidden animate-fade-in">
        <div className="overflow-x-auto no-scrollbar flex-1 relative">
          <table className="min-w-full divide-y divide-border-subtle text-left">
            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle w-16 text-center">
                  No
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle w-32">
                  Kecamatan
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle">
                  Camat
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle">
                  No HP
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle text-right">
                  Jumlah Puskesmas
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle text-center">
                  Jumlah Kelurahan/Desa
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle text-right">
                  Luas Wilayah (km²)
                </th>
                {user?.role === "ADMIN" && (
                  <th className="px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border-subtle text-center w-20">
                    Aksi
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-border-subtle text-sm">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    Memuat data...
                  </td>
                </tr>
              ) : districts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4">
                    Belum ada data kecamatan.
                  </td>
                </tr>
              ) : (
                districts.map((d, index) => (
                  <TableRow
                    id={index + 1}
                    fullId={d.id}
                    kec={d.name}
                    camat={d.headName || "-"}
                    hp={d.phoneNumber || "-"}
                    pkm={d._count?.healthCenters || 0}
                    kel={d._count?.villages || 0}
                    luas={d.areaSize || 0}
                    role={user?.role}
                    bg={index % 2 === 1 ? "bg-slate-50/50" : ""}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TableRow({
  id,
  fullId,
  kec,
  camat,
  hp,
  pkm,
  kel,
  luas,
  role,
  bg = "",
}: any) {
  return (
    <tr className={`hover:bg-primary/5 transition-colors h-10 ${bg}`}>
      <td className="px-4 py-2 whitespace-nowrap text-center">
        <span className="text-xs text-text-muted font-medium">{id}</span>
      </td>
      <td className="px-4 py-2 whitespace-nowrap font-medium text-text-main">
        {kec}
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-text-muted">{camat}</td>
      <td className="px-4 py-2 whitespace-nowrap font-mono text-xs text-text-muted">
        {hp}
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-right text-text-muted font-mono text-xs">
        {pkm}
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-center text-text-muted font-mono text-xs">
        {kel}
      </td>
      <td className="px-4 py-2 whitespace-nowrap text-right text-text-muted font-mono text-xs">
        {luas}
      </td>
      {role === "ADMIN" && (
        <td className="px-4 py-2 whitespace-nowrap text-center">
          <Link
            to={`/master/kecamatan/edit/${fullId}`}
            className="inline-flex items-center justify-center w-8 h-8 rounded text-text-muted hover:text-primary hover:bg-primary/5 transition-colors"
            title="Edit"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </Link>
        </td>
      )}
    </tr>
  );
}
