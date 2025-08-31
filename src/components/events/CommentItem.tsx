"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import Image from "next/image";

interface CommentAuthor {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: CommentAuthor;
  likesCount: number;
  isLiked: boolean;
}

interface CommentItemProps {
  comment: Comment;
  eventId: string;
  onLikeUpdate: (
    commentId: string,
    isLiked: boolean,
    likesCount: number
  ) => void;
}

export default function CommentItem({
  comment,
  eventId,
  onLikeUpdate,
}: CommentItemProps) {
  const { data: session } = useSession();
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (!session?.user?.id || isLiking) return;

    setIsLiking(true);
    try {
      const response = await fetch(
        `/api/events/${eventId}/comments/${comment.id}/like`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to toggle like");
      }

      const { isLiked, likesCount } = await response.json();
      onLikeUpdate(comment.id, isLiked, likesCount);
    } catch (error) {
      console.error("Error toggling like:", error);
      alert("Failed to update like. Please try again.");
    } finally {
      setIsLiking(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080)
      return `${Math.floor(diffInMinutes / 1440)}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="flex space-x-3 py-4">
      {/* Avatar */}
      <div className="flex-shrink-0">
        {comment.author.image ? (
          <Image
            src={comment.author.image}
            alt={comment.author.name || "User"}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-gray-600 font-medium text-sm">
              {(comment.author.name || comment.author.email)
                .charAt(0)
                .toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Comment Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <h4 className="text-sm font-medium text-gray-900">
            {comment.author.name || comment.author.email}
          </h4>
          <span className="text-xs text-gray-500">
            {formatDate(comment.createdAt)}
          </span>
        </div>

        <p className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
          {comment.content}
        </p>

        {/* Like Button */}
        <div className="mt-2 flex items-center space-x-2">
          <button
            onClick={handleLike}
            disabled={!session?.user?.id || isLiking}
            className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs transition-colors ${
              comment.isLiked
                ? "text-red-600 bg-red-50 hover:bg-red-100"
                : "text-gray-500 hover:text-red-600 hover:bg-gray-50"
            } ${
              !session?.user?.id
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer"
            }`}
          >
            <Heart
              className={`w-4 h-4 ${comment.isLiked ? "fill-current" : ""}`}
            />
            <span>{comment.likesCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
