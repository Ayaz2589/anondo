"use client";

import { useState } from "react";
import { EventList } from "@/components/events/EventList";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { FeedToggle } from "@/components/social/FeedToggle";
import { useTranslation } from "react-i18next";
import Link from "next/link";

export default function EventsPage() {
  const { t } = useTranslation();
  const [currentFeed, setCurrentFeed] = useState<"all" | "following">("all");
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
        {/* Feed Controls */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <FeedToggle
            currentFeed={currentFeed}
            onFeedChange={setCurrentFeed}
            className="w-full sm:w-auto"
          />

          <div className="flex gap-3">
            <Link
              href="/discover"
              className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              {t("follow.discoverUsers")}
            </Link>
            <Link
              href="/events/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              {t("events.createEvent")}
            </Link>
          </div>
        </div>

        <EventList type="all" title={t("events.myEvents")} feed={currentFeed} />
      </main>
    </div>
  );
}
