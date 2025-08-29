"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { EventForm } from "@/components/events/EventForm";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { useTranslation } from "react-i18next";

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export default function EditEventPage({ params }: EditEventPageProps) {
  const { t } = useTranslation();
  const [eventId, setEventId] = useState<string>("");
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setEventId(resolvedParams.id);
      fetchEventData(resolvedParams.id);
    };
    getParams();
  }, [params]);

  const fetchEventData = async (id: string) => {
    try {
      const response = await fetch(`/api/events/${id}`);
      if (!response.ok) {
        throw new Error(t("messages.failedToFetchEvent"));
      }
      const data = await response.json();
      setEventData(data.event);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("messages.anErrorOccurred")
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {t("common.error")}: {error}
          </p>
          <Link
            href="/events"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {t("navigation.backToEvents")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                href={`/events/${eventId}`}
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                {t("navigation.backToEvent")}
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                {t("events.editEvent")}
              </h1>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {eventData && <EventForm eventId={eventId} initialData={eventData} />}
      </main>
    </div>
  );
}
