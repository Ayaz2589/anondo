"use client";

import { EventList } from "@/components/events/EventList";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function EventsPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">
              {t("events.myEvents")}
            </h1>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <EventList type="all" title={t("events.myEvents")} />
      </main>
    </div>
  );
}
