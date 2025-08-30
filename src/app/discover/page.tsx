"use client";

import { UserSearch } from "@/components/social/UserSearch";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import Link from "next/link";

export default function DiscoverPage() {
  const { t } = useTranslation();

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
                {t("follow.discoverUsers")}
              </h1>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <UserSearch />
      </main>
    </div>
  );
}
