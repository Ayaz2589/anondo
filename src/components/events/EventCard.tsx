"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { Calendar, MapPin, Users, Edit, Trash2 } from "lucide-react";
import ClickableAddress from "./ClickableAddress";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  Badge,
  Avatar,
} from "../ui";

interface EventCardProps {
  event: {
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
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const isCreator = (session?.user as any)?.id === event.creator.id;
  const isParticipant = event.participants.some(
    (p) => p.user.id === (session?.user as any)?.id
  );
  const isFull = event.maxCapacity
    ? event._count.participants >= event.maxCapacity
    : false;

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCardClick = () => {
    window.location.href = `/events/${event.id}`;
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `/events/${event.id}/edit`;
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onDelete) return;
    if (window.confirm(t("messages.confirmDelete"))) {
      setIsLoading(true);
      await onDelete(event.id);
      setIsLoading(false);
    }
  };

  const handleJoin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onJoin) return;
    setIsLoading(true);
    await onJoin(event.id);
    setIsLoading(false);
  };

  const handleLeave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onLeave) return;
    setIsLoading(true);
    await onLeave(event.id);
    setIsLoading(false);
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200 relative"
      onClick={handleCardClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle>{event.title}</CardTitle>
            <div className="flex flex-wrap gap-1 mt-2">
              {event.categories.map(({ category }) => (
                <Badge key={category.id} variant="secondary">
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>
          {isCreator && (
            <div className="flex gap-2 ml-2">
              <Edit
                className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                onClick={(e) => handleEdit(e)}
              />
              <Trash2
                className="h-5 w-5 text-muted-foreground hover:text-destructive cursor-pointer transition-colors"
                onClick={(e) => handleDelete(e)}
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4 line-clamp-2">
          {event.description}
        </CardDescription>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
              {formatDateTime(event.startDate)}
              {event.endDate && ` - ${formatDateTime(event.endDate)}`}
            </span>
          </div>

          {(event.locationAddress || event.location) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="truncate">
                {event.locationAddress || event.location}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>
                {event._count.participants} {t("events.participant")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Avatar
                src={event.creator.image}
                name={event.creator.name}
                email={event.creator.email}
                size="sm"
              />
              <span>By {event.creator.name || event.creator.email}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && session && !isCreator && (
          <div className="flex gap-2 mt-6 pt-4 border-t">
            {isParticipant ? (
              <Button
                onClick={() => handleLeave({} as React.MouseEvent)}
                disabled={isLoading}
                variant="destructive"
                className="flex-1"
              >
                {isLoading ? t("events.leaving") : t("events.leaveEvent")}
              </Button>
            ) : (
              <Button
                onClick={() => handleJoin({} as React.MouseEvent)}
                disabled={isLoading || isFull}
                variant="default"
                className="flex-1"
              >
                {isLoading
                  ? t("events.joining")
                  : isFull
                  ? t("events.eventFull")
                  : t("events.joinEvent")}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
