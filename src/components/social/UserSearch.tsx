"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FollowButton } from "./FollowButton";

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: string;
  isFollowing: boolean;
  _count: {
    followers: number;
    following: number;
    createdEvents: number;
  };
}

export function UserSearch() {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchUsers = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setUsers([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/users/search?q=${encodeURIComponent(searchQuery)}&limit=20`
      );

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setHasSearched(true);
      } else {
        console.error("Failed to search users");
        setUsers([]);
        setHasSearched(true);
      }
    } catch (error) {
      console.error("Error searching users:", error);
      setUsers([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, searchUsers]);

  const handleFollowChange = (userId: string, isFollowing: boolean) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, isFollowing } : user
      )
    );
  };

  if (!session) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">{t("auth.pleaseSignIn")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {t("follow.discoverUsers")}
        </h2>

        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder={t("follow.searchUsers")}
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* No Results */}
      {hasSearched && !loading && users.length === 0 && (
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p className="text-gray-600">{t("follow.noUsersFound")}</p>
        </div>
      )}

      {/* User Results */}
      {users.length > 0 && (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* User Avatar */}
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-lg font-medium text-gray-600">
                        {user.name?.charAt(0) || user.email.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* User Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {user.name || user.email}
                    </h3>
                    <p className="text-sm text-gray-600">{user.email}</p>

                    {/* User Stats */}
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>
                        {t("follow.followersCount", {
                          count: user._count.followers,
                        })}
                      </span>
                      <span>
                        {t("follow.followingCount", {
                          count: user._count.following,
                        })}
                      </span>
                      <span>
                        {t("follow.eventsCreated", {
                          count: user._count.createdEvents,
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Follow Button */}
                <FollowButton
                  userId={user.id}
                  userName={user.name || undefined}
                  onFollowChange={(isFollowing) =>
                    handleFollowChange(user.id, isFollowing)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
