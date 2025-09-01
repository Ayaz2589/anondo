"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ImageCarousel from "./ImageCarousel";
import CommentSection from "./CommentSection";
import ClickableAddress from "./ClickableAddress";
import GoogleMapPreview from "./GoogleMapPreview";
import { Avatar } from "../ui";

interface EventDetailsProps {
  eventId: string;
}

interface EventImage {
  id: string;
  url: string;
  altText?: string;
  caption?: string;
  order: number;
  width?: number;
  height?: number;
  createdAt: string;
}

interface EventWithDetails {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  locationName: string | null;
  locationAddress: string | null;
  locationLat: number | null;
  locationLng: number | null;
  locationPlaceId: string | null;
  startDate: string;
  endDate: string | null;
  maxCapacity: number | null;
  isPublic: boolean;
  status: string;
  createdAt: string;
  creator: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  participants: Array<{
    id: string;
    status: string;
    joinedAt: string;
    user: {
      id: string;
      name: string | null;
      email: string;
      image: string | null;
    };
  }>;
  categories: Array<{
    category: {
      id: string;
      name: string;
      color: string | null;
      icon: string | null;
    };
  }>;
  tags: Array<{
    tag: {
      id: string;
      name: string;
    };
  }>;
  _count: {
    participants: number;
  };
  images: EventImage[];
}

export function EventDetails({ eventId }: EventDetailsProps) {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const router = useRouter();
  const [event, setEvent] = useState<EventWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch event details
      const eventResponse = await fetch(`/api/events/${eventId}`);
      if (!eventResponse.ok) {
        if (eventResponse.status === 404) {
          throw new Error(t("events.eventNotFound"));
        }
        throw new Error(t("messages.failedToFetchEvent"));
      }

      const eventData = await eventResponse.json();

      // Fetch event images
      const imagesResponse = await fetch(`/api/events/${eventId}/images`);
      let images: EventImage[] = [];
      if (imagesResponse.ok) {
        const imagesData = await imagesResponse.json();
        images = imagesData.images || [];
      }

      // Combine event data with images
      setEvent({ ...eventData.event, images });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async () => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/events/${eventId}/join`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to join event");
      }

      await fetchEvent(); // Refresh event data
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to join event");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveEvent = async () => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/events/${eventId}/leave`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to leave event");
      }

      await fetchEvent(); // Refresh event data
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to leave event");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!window.confirm(t("messages.confirmDeletePermanent"))) {
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete event");
      }

      router.push("/events");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete event");
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">
          {t("common.error")}: {error}
        </p>
        <button
          onClick={fetchEvent}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {t("common.tryAgain")}
        </button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">{t("events.eventNotFound")}</p>
      </div>
    );
  }

  const isCreator = (session?.user as any)?.id === event.creator.id;
  const isParticipant = event.participants.some(
    (p) => p.user.id === (session?.user as any)?.id
  );
  const isFull = event.maxCapacity
    ? event._count.participants >= event.maxCapacity
    : false;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {event.title}
            </h1>

            {/* Categories and Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {event.categories.map(({ category }) => (
                <span
                  key={category.id}
                  className="px-3 py-1 text-sm font-medium rounded-full text-white"
                  style={{ backgroundColor: category.color || "#6B7280" }}
                >
                  {category.name}
                </span>
              ))}
              {event.tags.map(({ tag }) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-700"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>

          {/* Status Badge */}
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${
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
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t("events.description")}
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {event.description}
            </p>
          </div>
        )}

        {/* Images */}
        {event.images && event.images.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t("events.images")}
            </h3>
            <ImageCarousel images={event.images} />
          </div>
        )}

        {/* Event Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {t("events.dateTime")}
              </h4>
              <div className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2"
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
                <div>
                  <p>{formatDate(event.startDate)}</p>
                  {event.endDate && (
                    <p className="text-sm text-gray-500">
                      {t("events.ends")}: {formatDate(event.endDate)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {(event.locationAddress || event.location) && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {t("events.location")}
                </h4>

                {/* Clickable Address */}
                <div className="mb-3">
                  <ClickableAddress
                    address={event.locationAddress || event.location || ""}
                    locationName={event.locationName || undefined}
                    lat={event.locationLat || undefined}
                    lng={event.locationLng || undefined}
                  />
                </div>

                {/* Map Preview */}
                {event.locationLat && event.locationLng && (
                  <div className="mt-3">
                    <GoogleMapPreview
                      lat={event.locationLat}
                      lng={event.locationLng}
                      address={event.locationAddress || event.location || ""}
                      locationName={event.locationName || undefined}
                      height="200px"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {t("events.capacity")}
              </h4>
              <div className="flex items-center text-gray-600">
                <svg
                  className="w-5 h-5 mr-2"
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
                <p>
                  {event._count.participants} {t("events.participant")}
                  {event._count.participants !== 1 ? "s" : ""}
                  {event.maxCapacity && ` / ${event.maxCapacity} max`}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {t("events.visibility")}
              </h4>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  event.isPublic
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {event.isPublic ? t("common.public") : t("common.private")}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {session && (
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            {isCreator ? (
              <>
                <Link
                  href={`/events/${event.id}/edit`}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {t("events.editEvent")}
                </Link>
                <button
                  onClick={handleDeleteEvent}
                  disabled={actionLoading}
                  className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? "Deleting..." : "Delete Event"}
                </button>
              </>
            ) : (
              <>
                {isParticipant ? (
                  <button
                    onClick={handleLeaveEvent}
                    disabled={actionLoading}
                    className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? "Leaving..." : "Leave Event"}
                  </button>
                ) : (
                  <button
                    onClick={handleJoinEvent}
                    disabled={actionLoading || isFull}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {actionLoading
                      ? "Joining..."
                      : isFull
                      ? "Event Full"
                      : "Join Event"}
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Creator Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t("events.eventCreator")}
        </h3>
        <div className="flex items-center">
          {event.creator.image ? (
            <Image
              src={event.creator.image}
              alt={event.creator.name || "Creator"}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full mr-4"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-300 mr-4 flex items-center justify-center">
              <span className="text-lg font-medium text-gray-600">
                {event.creator.name?.charAt(0) || event.creator.email.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900">
              {event.creator.name || event.creator.email}
            </p>
            <p className="text-sm text-gray-500">
              {t("events.createdOn")}{" "}
              {new Date(event.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Participants */}
      {event.participants.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t("events.participants")} ({event.participants.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {event.participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center p-3 bg-gray-50 rounded-lg"
              >
                <Avatar
                  src={participant.user.image}
                  name={participant.user.name}
                  email={participant.user.email || ""}
                  size="md"
                  className="mr-3"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {participant.user.name || participant.user.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t("events.joinedOn")}{" "}
                    {new Date(participant.joinedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <CommentSection eventId={eventId} />
      </div>
    </div>
  );
}
