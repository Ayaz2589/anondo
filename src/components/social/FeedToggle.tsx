"use client";

import { useTranslation } from "react-i18next";

interface FeedToggleProps {
  currentFeed: "all" | "following";
  onFeedChange: (feed: "all" | "following") => void;
  className?: string;
}

export function FeedToggle({
  currentFeed,
  onFeedChange,
  className = "",
}: FeedToggleProps) {
  const { t } = useTranslation();

  return (
    <div className={`flex bg-gray-100 rounded-lg p-1 ${className}`}>
      <button
        onClick={() => onFeedChange("all")}
        className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          currentFeed === "all"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        {t("follow.allEvents")}
      </button>
      <button
        onClick={() => onFeedChange("following")}
        className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          currentFeed === "following"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        {t("follow.followingFeed")}
      </button>
    </div>
  );
}
