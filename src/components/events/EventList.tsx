"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { EventCard } from "./EventCard";
import { CalendarDays } from "lucide-react";
import { Button, Card } from "../ui";

interface Event {
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
}

interface EventListProps {
  type?: "created" | "joined" | "all";
  title?: string;
  feed?: "all" | "following";
}

export function EventList({
  type = "all",
  title,
  feed = "all",
}: EventListProps) {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const [events, setEvents] = useState<Event[]>([]);
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"created" | "joined">("created");

  useEffect(() => {
    if ((session?.user as any)?.id) {
      fetchUserEvents();
    }
  }, [(session?.user as any)?.id, type, feed]);

  const fetchUserEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      if (type === "all") {
        if (feed === "following") {
          // Fetch events from followed users
          const response = await fetch(`/api/events?feed=following&limit=20`);
          if (!response.ok) throw new Error(t("messages.failedToFetch"));

          const data = await response.json();
          setEvents(data.events || []);
        } else {
          // Fetch both created and joined events
          const response = await fetch(
            `/api/users/${(session?.user as any)?.id}/events`
          );
          if (!response.ok) throw new Error(t("messages.failedToFetch"));

          const data = await response.json();
          setCreatedEvents(data.created || []);
          setJoinedEvents(data.joined || []);
        }
      } else {
        // Fetch specific type
        const response = await fetch(
          `/api/users/${(session?.user as any)?.id}/events?type=${type}`
        );
        if (!response.ok) throw new Error(t("messages.failedToFetch"));

        const data = await response.json();
        setEvents(data.events || []);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("messages.anErrorOccurred")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}/join`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t("messages.failedToJoin"));
      }

      // Refresh events
      await fetchUserEvents();
    } catch (err) {
      alert(err instanceof Error ? err.message : t("messages.failedToJoin"));
    }
  };

  const handleLeaveEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}/leave`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t("messages.failedToLeave"));
      }

      // Refresh events
      await fetchUserEvents();
    } catch (err) {
      alert(err instanceof Error ? err.message : t("messages.failedToLeave"));
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t("messages.failedToDelete"));
      }

      // Refresh events
      await fetchUserEvents();
    } catch (err) {
      alert(err instanceof Error ? err.message : t("messages.failedToDelete"));
    }
  };

  if (!session) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <div className="rounded-full bg-muted p-4 w-fit mx-auto mb-4">
            <CalendarDays className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2">Sign in required</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {t("auth.signInRequired")}
          </p>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mb-4"></div>
        <p className="text-muted-foreground">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <div className="rounded-full bg-destructive/10 p-4 w-fit mx-auto mb-4">
            <CalendarDays className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="mb-2">Something went wrong</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Error: {error}
          </p>
          <Button onClick={fetchUserEvents} variant="outline">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  const renderEventGrid = (eventList: Event[]) => {
    if (eventList.length === 0) {
      return (
        <Card className="p-8">
          <div className="text-center">
            <div className="rounded-full bg-muted p-4 w-fit mx-auto mb-4">
              <CalendarDays className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2">No events found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              No events match your criteria
            </p>
            {type === "created" && (
              <Button asChild>
                <a href="/events/create">Create Your First Event</a>
              </Button>
            )}
          </div>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventList.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onJoin={handleJoinEvent}
            onLeave={handleLeaveEvent}
            onDelete={handleDeleteEvent}
          />
        ))}
      </div>
    );
  };

  if (type === "all") {
    return (
      <div className="space-y-8">
        {title && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2>{title}</h2>
              <p className="text-muted-foreground">
                Manage your created and joined events
              </p>
            </div>
            <Button asChild>
              <a href="/events/create">Create Event</a>
            </Button>
          </div>
        )}

        {/* Enhanced Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-2" aria-label="Event tabs">
            <Button
              onClick={() => setActiveTab("created")}
              variant={activeTab === "created" ? "default" : "ghost"}
            >
              Created Events ({createdEvents.length})
            </Button>
            <Button
              onClick={() => setActiveTab("joined")}
              variant={activeTab === "joined" ? "default" : "ghost"}
            >
              Joined Events ({joinedEvents.length})
            </Button>
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "created"
            ? renderEventGrid(createdEvents)
            : renderEventGrid(joinedEvents)}
        </div>
      </div>
    );
  }

  // For following feed, show as a simple list
  if (feed === "following") {
    return (
      <div className="space-y-8">
        {title && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2>{title}</h2>
              <p className="text-muted-foreground">
                Events from people you follow
              </p>
            </div>
          </div>
        )}

        {renderEventGrid(events)}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {title && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2>{title}</h2>
            <p className="text-muted-foreground">
              {type === "created"
                ? "Events you've created"
                : "Events you've joined"}
            </p>
          </div>
          {type === "created" && (
            <Button asChild>
              <a href="/events/create">Create Event</a>
            </Button>
          )}
        </div>
      )}

      {renderEventGrid(events)}
    </div>
  );
}
