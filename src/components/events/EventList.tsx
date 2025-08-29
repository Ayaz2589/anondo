"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { EventCard } from "./EventCard";

interface Event {
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
}

interface EventListProps {
  type?: "created" | "joined" | "all";
  title?: string;
}

export function EventList({ type = "all", title }: EventListProps) {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [joinedEvents, setJoinedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"created" | "joined">("created");

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserEvents();
    }
  }, [session?.user?.id, type]);

  const fetchUserEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      if (type === "all") {
        // Fetch both created and joined events
        const response = await fetch(`/api/users/${session?.user?.id}/events`);
        if (!response.ok) throw new Error("Failed to fetch events");

        const data = await response.json();
        setCreatedEvents(data.created || []);
        setJoinedEvents(data.joined || []);
      } else {
        // Fetch specific type
        const response = await fetch(
          `/api/users/${session?.user?.id}/events?type=${type}`
        );
        if (!response.ok) throw new Error("Failed to fetch events");

        const data = await response.json();
        setEvents(data.events || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
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
        throw new Error(data.error || "Failed to join event");
      }

      // Refresh events
      await fetchUserEvents();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to join event");
    }
  };

  const handleLeaveEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}/leave`, {
        method: "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to leave event");
      }

      // Refresh events
      await fetchUserEvents();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to leave event");
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete event");
      }

      // Refresh events
      await fetchUserEvents();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete event");
    }
  };

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please sign in to view your events.</p>
      </div>
    );
  }

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
        <p className="text-red-600 mb-4">Error: {error}</p>
        <button
          onClick={fetchUserEvents}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const renderEventGrid = (eventList: Event[]) => {
    if (eventList.length === 0) {
      return (
        <div className="text-center py-12">
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-600 mb-4">No events found</p>
          {type === "created" && (
            <a
              href="/events/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-block"
            >
              Create Your First Event
            </a>
          )}
        </div>
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
      <div className="space-y-6">
        {title && (
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <a
              href="/events/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Create Event
            </a>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("created")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "created"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Created Events ({createdEvents.length})
            </button>
            <button
              onClick={() => setActiveTab("joined")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "joined"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Joined Events ({joinedEvents.length})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "created"
            ? renderEventGrid(createdEvents)
            : renderEventGrid(joinedEvents)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {title && (
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {type === "created" && (
            <a
              href="/events/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Create Event
            </a>
          )}
        </div>
      )}

      {renderEventGrid(events)}
    </div>
  );
}
