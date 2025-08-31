import { Event, EventParticipant, EventStatus, ParticipantStatus } from '@prisma/client';
import { prisma } from '../prisma';

export interface CreateEventData {
  title: string;
  description?: string;
  location?: string;
  locationName?: string;
  locationAddress?: string;
  locationLat?: number;
  locationLng?: number;
  locationPlaceId?: string;
  startDate: Date;
  endDate?: Date;
  maxCapacity?: number;
  isPublic?: boolean;
  categoryIds?: string[];
  tagNames?: string[];
}

export interface UpdateEventData {
  title?: string;
  description?: string;
  location?: string;
  locationName?: string;
  locationAddress?: string;
  locationLat?: number;
  locationLng?: number;
  locationPlaceId?: string;
  startDate?: Date;
  endDate?: Date;
  maxCapacity?: number;
  isPublic?: boolean;
  status?: EventStatus;
}

export interface EventWithDetails extends Event {
  creator: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  participants: Array<{
    id: string;
    status: ParticipantStatus;
    joinedAt: Date;
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
}

export class EventService {
  // Create a new event
  static async createEvent(creatorId: string, data: CreateEventData): Promise<Event> {
    const { categoryIds, tagNames, ...eventData } = data;

    return await prisma.event.create({
      data: {
        ...eventData,
        creatorId,
        categories: categoryIds ? {
          create: categoryIds.map(categoryId => ({
            categoryId
          }))
        } : undefined,
        tags: tagNames ? {
          create: tagNames.map(tagName => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName }
              }
            }
          }))
        } : undefined,
      },
      include: {
        creator: true,
        participants: true,
        categories: { include: { category: true } },
        tags: { include: { tag: true } }
      }
    });
  }

  // Get event by ID with full details
  static async getEventById(eventId: string): Promise<EventWithDetails | null> {
    return await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        creator: {
          select: { id: true, name: true, email: true, image: true }
        },
        participants: {
          where: { status: ParticipantStatus.JOINED },
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true }
            }
          },
          orderBy: { joinedAt: 'asc' }
        },
        categories: {
          include: {
            category: {
              select: { id: true, name: true, color: true, icon: true }
            }
          }
        },
        tags: {
          include: {
            tag: {
              select: { id: true, name: true }
            }
          }
        },
        _count: {
          select: { participants: { where: { status: ParticipantStatus.JOINED } } }
        }
      }
    });
  }

  // Get all public events with pagination
  static async getPublicEvents(
    page: number = 1,
    limit: number = 10,
    filters?: {
      categoryId?: string;
      tagName?: string;
      search?: string;
      startDateFrom?: Date;
      startDateTo?: Date;
      creatorIds?: string[];
    }
  ): Promise<{ events: EventWithDetails[]; total: number }> {
    const skip = (page - 1) * limit;
    
    const where: any = {
      isPublic: true,
      status: EventStatus.ACTIVE,
    };

    if (filters?.categoryId) {
      where.categories = {
        some: { categoryId: filters.categoryId }
      };
    }

    if (filters?.tagName) {
      where.tags = {
        some: { tag: { name: filters.tagName } }
      };
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { location: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    if (filters?.startDateFrom || filters?.startDateTo) {
      where.startDate = {};
      if (filters.startDateFrom) where.startDate.gte = filters.startDateFrom;
      if (filters.startDateTo) where.startDate.lte = filters.startDateTo;
    }

    if (filters?.creatorIds && filters.creatorIds.length > 0) {
      where.creatorId = {
        in: filters.creatorIds
      };
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          creator: {
            select: { id: true, name: true, email: true, image: true }
          },
          participants: {
            where: { status: ParticipantStatus.JOINED },
            include: {
              user: {
                select: { id: true, name: true, email: true, image: true }
              }
            }
          },
          categories: {
            include: {
              category: {
                select: { id: true, name: true, color: true, icon: true }
              }
            }
          },
          tags: {
            include: {
              tag: {
                select: { id: true, name: true }
              }
            }
          },
          _count: {
            select: { participants: { where: { status: ParticipantStatus.JOINED } } }
          }
        },
        orderBy: { startDate: 'asc' },
        skip,
        take: limit
      }),
      prisma.event.count({ where })
    ]);

    return { events, total };
  }

  // Get user's created events
  static async getUserCreatedEvents(userId: string): Promise<EventWithDetails[]> {
    return await prisma.event.findMany({
      where: { creatorId: userId },
      include: {
        creator: {
          select: { id: true, name: true, email: true, image: true }
        },
        participants: {
          where: { status: ParticipantStatus.JOINED },
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true }
            }
          }
        },
        categories: {
          include: {
            category: {
              select: { id: true, name: true, color: true, icon: true }
            }
          }
        },
        tags: {
          include: {
            tag: {
              select: { id: true, name: true }
            }
          }
        },
        _count: {
          select: { participants: { where: { status: ParticipantStatus.JOINED } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Get user's joined events
  static async getUserJoinedEvents(userId: string): Promise<EventWithDetails[]> {
    const participations = await prisma.eventParticipant.findMany({
      where: {
        userId,
        status: ParticipantStatus.JOINED
      },
      include: {
        event: {
          include: {
            creator: {
              select: { id: true, name: true, email: true, image: true }
            },
            participants: {
              where: { status: ParticipantStatus.JOINED },
              include: {
                user: {
                  select: { id: true, name: true, email: true, image: true }
                }
              }
            },
            categories: {
              include: {
                category: {
                  select: { id: true, name: true, color: true, icon: true }
                }
              }
            },
            tags: {
              include: {
                tag: {
                  select: { id: true, name: true }
                }
              }
            },
            _count: {
              select: { participants: { where: { status: ParticipantStatus.JOINED } } }
            }
          }
        }
      },
      orderBy: { joinedAt: 'desc' }
    });

    return participations.map(p => p.event);
  }

  // Update event (only by creator)
  static async updateEvent(
    eventId: string,
    creatorId: string,
    data: UpdateEventData
  ): Promise<Event | null> {
    // Verify the user is the creator
    const event = await prisma.event.findFirst({
      where: { id: eventId, creatorId }
    });

    if (!event) return null;

    return await prisma.event.update({
      where: { id: eventId },
      data,
      include: {
        creator: true,
        participants: true,
        categories: { include: { category: true } },
        tags: { include: { tag: true } }
      }
    });
  }

  // Delete event (only by creator)
  static async deleteEvent(eventId: string, creatorId: string): Promise<boolean> {
    try {
      const deleted = await prisma.event.deleteMany({
        where: { id: eventId, creatorId }
      });
      return deleted.count > 0;
    } catch {
      return false;
    }
  }

  // Join event
  static async joinEvent(eventId: string, userId: string): Promise<{ success: boolean; message: string }> {
    // Check if event exists and is active
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { participants: { where: { status: ParticipantStatus.JOINED } } }
        }
      }
    });

    if (!event) {
      return { success: false, message: 'Event not found' };
    }

    if (event.status !== EventStatus.ACTIVE) {
      return { success: false, message: 'Event is not active' };
    }

    if (event.creatorId === userId) {
      return { success: false, message: 'Cannot join your own event' };
    }

    // Check capacity
    if (event.maxCapacity && event._count.participants >= event.maxCapacity) {
      return { success: false, message: 'Event is at full capacity' };
    }

    // Check if already participating
    const existingParticipation = await prisma.eventParticipant.findUnique({
      where: {
        eventId_userId: { eventId, userId }
      }
    });

    if (existingParticipation?.status === ParticipantStatus.JOINED) {
      return { success: false, message: 'Already joined this event' };
    }

    // Join or rejoin event
    await prisma.eventParticipant.upsert({
      where: {
        eventId_userId: { eventId, userId }
      },
      create: {
        eventId,
        userId,
        status: ParticipantStatus.JOINED
      },
      update: {
        status: ParticipantStatus.JOINED,
        joinedAt: new Date(),
        leftAt: null
      }
    });

    return { success: true, message: 'Successfully joined event' };
  }

  // Leave event
  static async leaveEvent(eventId: string, userId: string): Promise<{ success: boolean; message: string }> {
    const participation = await prisma.eventParticipant.findUnique({
      where: {
        eventId_userId: { eventId, userId }
      }
    });

    if (!participation || participation.status !== ParticipantStatus.JOINED) {
      return { success: false, message: 'Not currently joined to this event' };
    }

    await prisma.eventParticipant.update({
      where: {
        eventId_userId: { eventId, userId }
      },
      data: {
        status: ParticipantStatus.LEFT,
        leftAt: new Date()
      }
    });

    return { success: true, message: 'Successfully left event' };
  }

  // Get all categories
  static async getAllCategories() {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
  }

  // Create category
  static async createCategory(data: { name: string; description?: string; color?: string; icon?: string }) {
    return await prisma.category.create({ data });
  }
}
