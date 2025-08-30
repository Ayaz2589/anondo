"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";

interface FollowButtonProps {
  userId: string;
  userName?: string;
  className?: string;
  onFollowChange?: (isFollowing: boolean) => void;
}

export function FollowButton({
  userId,
  userName,
  className = "",
  onFollowChange,
}: FollowButtonProps) {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id && userId !== session.user.id) {
      checkFollowStatus();
    } else {
      setInitialLoading(false);
    }
  }, [session?.user?.id, userId]);

  const checkFollowStatus = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/follow`);
      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.isFollowing);
      }
    } catch (error) {
      console.error("Error checking follow status:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!session?.user?.id || loading) return;

    setLoading(true);
    try {
      const method = isFollowing ? "DELETE" : "POST";
      const response = await fetch(`/api/users/${userId}/follow`, {
        method,
      });

      if (response.ok) {
        const newFollowingState = !isFollowing;
        setIsFollowing(newFollowingState);
        onFollowChange?.(newFollowingState);
      } else {
        const data = await response.json();
        alert(data.error || "Failed to update follow status");
      }
    } catch (error) {
      console.error("Error updating follow status:", error);
      alert("Failed to update follow status");
    } finally {
      setLoading(false);
    }
  };

  // Don't show button for current user or when not authenticated
  if (!session?.user?.id || userId === session.user.id || initialLoading) {
    return null;
  }

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 ${
        isFollowing
          ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
          : "bg-blue-600 text-white hover:bg-blue-700"
      } ${className}`}
      title={
        isFollowing
          ? t("follow.unfollowUser", { name: userName || "user" })
          : t("follow.followUser", { name: userName || "user" })
      }
    >
      {loading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
          {t("common.loading")}
        </div>
      ) : isFollowing ? (
        t("follow.following")
      ) : (
        t("follow.follow")
      )}
    </button>
  );
}
