"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { EventDetails } from "@/components/events/EventDetails";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { useTranslation } from "react-i18next";

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export default function EventPage({ params }: EventPageProps) {
  const { t } = useTranslation();
  const [eventId, setEventId] = useState<string>("");

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setEventId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                href="/events"
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                {t("navigation.backToEvents")}
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                {t("events.eventDetails")}
              </h1>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {eventId && <EventDetails eventId={eventId} />}
      </main>
    </div>
  );
}
