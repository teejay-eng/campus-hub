"use client";

import { useCallback, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import { inputClass } from "@/components/admin/FormField";

export default function StudentMaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [q, setQ] = useState("");
  const [course, setCourse] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (course) params.set("course", course);
    if (category) params.set("category", category);
    const res = await fetch(`/api/student/materials?${params}`);
    setMaterials(await res.json());
    setLoading(false);
  }, [q, course, category]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Reading Materials</h1>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <input className={inputClass} placeholder="Search title or course" value={q} onChange={(e) => setQ(e.target.value)} />
        <input className={inputClass} placeholder="Course filter" value={course} onChange={(e) => setCourse(e.target.value)} />
        <input className={inputClass} placeholder="Category filter" value={category} onChange={(e) => setCategory(e.target.value)} />
      </div>
      {loading ? (
        <Loading />
      ) : materials.length === 0 ? (
        <p className="mt-8 text-slate-500">No materials found.</p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {materials.map((m) => (
            <article key={m.id} className="rounded-xl border bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-slate-900">{m.title}</h3>
              <p className="mt-1 text-xs text-blue-600">
                {m.course} · {m.category}
              </p>
              <p className="mt-2 text-sm text-slate-600">{m.description}</p>
              <div className="mt-4 flex gap-2">
                <a href={m.fileUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="secondary">
                    View
                  </Button>
                </a>
                <a href={m.fileUrl} download>
                  <Button size="sm">Download</Button>
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
