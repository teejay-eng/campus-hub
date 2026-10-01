"use client";

import { useEffect, useState } from "react";
import HostelCard from "@/components/HostelCard";
import Loading from "@/components/ui/Loading";
import Modal from "@/components/ui/Modal";
import Alert from "@/components/ui/Alert";

export default function StudentAccommodationPage() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestHostel, setRequestHostel] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch("/api/student/hostels")
      .then((r) => r.json())
      .then(setHostels)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Accommodation</h1>
      <p className="mt-1 text-slate-600">Browse available hostels and submit a request.</p>
      {loading ? (
        <Loading label="Loading hostels..." />
      ) : hostels.length === 0 ? (
        <p className="mt-8 text-slate-500">No hostels available.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {hostels.map((h) => (
            <HostelCard
              key={h.id}
              hostel={h}
              showRequest
              onRequest={(hostel) => {
                setSubmitted(false);
                setRequestHostel(hostel);
              }}
            />
          ))}
        </div>
      )}

      <Modal open={!!requestHostel} onClose={() => setRequestHostel(null)} title="Accommodation Request">
        {submitted ? (
          <Alert type="success">
            Your request for {requestHostel?.name} has been recorded. The housing office will contact
            you via email.
          </Alert>
        ) : (
          <>
            <p className="text-sm text-slate-600">
              Submit a request for <strong>{requestHostel?.name}</strong>? An administrator will
              review your application.
            </p>
            <button
              type="button"
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
              onClick={() => setSubmitted(true)}
            >
              Submit Request
            </button>
          </>
        )}
      </Modal>
    </div>
  );
}
