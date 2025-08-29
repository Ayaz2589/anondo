"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string | null;
    location: string | null;
    startDate: string;
    endDate: string | null;
    maxCapacity: number | null;
    isPublic: boolean;
    status: string;
    creator: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
    };
    participants: Array<{
      user: {
        id: string;
        name: string | null;
        image: string | null;
      };
    }>;
    categories: Array<{
      category: {
        id: string;
        name: string;
        color: string | null;
      };
    }>;
    _count: {
      participants: number;
    };
  };
  onJoin?: (eventId: string) => void;
  onLeave?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
  showActions?: boolean;
}

export function EventCard({
  event,
  onJoin,
  onLeave,
  onDelete,
  showActions = true,
}: EventCardProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const isCreator = session?.user?.id === event.creator.id;
  const isParticipant = event.participants.some(
    (p) => p.user.id === session?.user?.id
  );
  const isFull = event.maxCapacity
    ? event._count.participants >= event.maxCapacity
    : false;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleJoin = async () => {
    if (!onJoin) return;
    setIsLoading(true);
    await onJoin(event.id);
    setIsLoading(false);
  };

  const handleLeave = async () => {
    if (!onLeave) return;
    setIsLoading(true);
    await onLeave(event.id);
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    if (window.confirm("Are you sure you want to delete this event?")) {
      setIsLoading(true);
      await onDelete(event.id);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Link href={`/events/${event.id}`} className="hover:text-blue-600">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {event.title}
            </h3>
          </Link>

          {/* Categories */}
          {event.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {event.categories.map(({ category }) => (
                <span
                  key={category.id}
                  className="px-2 py-1 text-xs font-medium rounded-full text-white"
                  style={{ backgroundColor: category.color || "#6B7280" }}
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Status Badge */}
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            event.status === "ACTIVE"
              ? "bg-green-100 text-green-800"
              : event.status === "DRAFT"
              ? "bg-yellow-100 text-yellow-800"
              : event.status === "CANCELLED"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {event.status}
        </span>
      </div>

      {/* Description */}
      {event.description && (
        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
      )}

      {/* Event Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>{formatDate(event.startDate)}</span>
          {event.endDate && (
            <span className="ml-2">- {formatDate(event.endDate)}</span>
          )}
        </div>

        {event.location && (
          <div className="flex items-center text-sm text-gray-500">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{event.location}</span>
          </div>
        )}

        <div className="flex items-center text-sm text-gray-500">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
            />
          </svg>
          <span>
            {event._count.participants} participant
            {event._count.participants !== 1 ? "s" : ""}
            {event.maxCapacity && ` / ${event.maxCapacity}`}
          </span>
        </div>
      </div>

      {/* Creator Info */}
      <div className="flex items-center mb-4 pb-4 border-b border-gray-100">
        {event.creator.image ? (
          <Image
            src={event.creator.image}
            alt={event.creator.name || "Creator"}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full mr-3"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-300 mr-3 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600">
              {event.creator.name?.charAt(0) || event.creator.email.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-gray-900">
            {event.creator.name || event.creator.email}
          </p>
          <p className="text-xs text-gray-500">Event Creator</p>
        </div>
      </div>

      {/* Action Buttons */}
      {showActions && session && (
        <div className="flex gap-2">
          {isCreator ? (
            <>
              <Link
                href={`/events/${event.id}/edit`}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors text-center"
              >
                Edit Event
              </Link>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? "..." : "Delete"}
              </button>
            </>
          ) : (
            <>
              {isParticipant ? (
                <button
                  onClick={handleLeave}
                  disabled={isLoading}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Leaving..." : "Leave Event"}
                </button>
              ) : (
                <button
                  onClick={handleJoin}
                  disabled={isLoading || isFull}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isLoading
                    ? "Joining..."
                    : isFull
                    ? "Event Full"
                    : "Join Event"}
                </button>
              )}
              <Link
                href={`/events/${event.id}`}
                className="px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                View Details
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
