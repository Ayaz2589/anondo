"use client";

import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

export function UserProfile() {
  const { data: session, status } = useSession();
  const { t } = useTranslation();

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">{t("common.loading")}</span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">{t("auth.pleaseSignIn")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-4">
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt={session.user.name || "User"}
            width={64}
            height={64}
            className="w-16 h-16 rounded-full"
          />
        )}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {session.user?.name || "Anonymous User"}
          </h2>
          <p className="text-gray-600">{session.user?.email}</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <p className="mt-1 text-sm text-gray-900">
            {session.user?.name || "Not provided"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <p className="mt-1 text-sm text-gray-900">{session.user?.email}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Account Type
          </label>
          <p className="mt-1 text-sm text-gray-900">Google OAuth</p>
        </div>
      </div>
    </div>
  );
}
