import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/config';
import { EventService, CreateEventData } from '@/lib/services/event-service';
import { prisma } from '@/lib/prisma';

// GET /api/events - Get all public events with optional filters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const categoryId = searchParams.get('categoryId') || undefined;
    const tagName = searchParams.get('tagName') || undefined;
    const search = searchParams.get('search') || undefined;
    const feed = searchParams.get('feed'); // "following" to get only followed users' events
    
    const startDateFrom = searchParams.get('startDateFrom') 
      ? new Date(searchParams.get('startDateFrom')!) 
      : undefined;
    const startDateTo = searchParams.get('startDateTo') 
      ? new Date(searchParams.get('startDateTo')!) 
      : undefined;

    let result;

    // If requesting feed from followed users and user is authenticated
    if (feed === 'following' && session?.user?.id) {
      // Get list of users the current user follows
      const following = await prisma.follow.findMany({
        where: {
          followerId: session.user.id,
        },
        select: {
          followingId: true,
        },
      });

      const followingIds = following.map((f) => f.followingId);
      // Include current user's events too
      followingIds.push(session.user.id);

      // Get events from followed users
      result = await EventService.getPublicEvents(page, limit, {
        categoryId,
        tagName,
        search,
        startDateFrom,
        startDateTo,
        creatorIds: followingIds, // Filter by followed users
      });
    } else {
      // Get all public events
      result = await EventService.getPublicEvents(page, limit, {
        categoryId,
        tagName,
        search,
        startDateFrom,
        startDateTo
      });
    }

    return NextResponse.json({
      ...result,
      feed: feed || 'all',
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/events - Create a new event
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Basic validation
    if (!body.title || !body.startDate) {
      return NextResponse.json(
        { error: 'Title and start date are required' },
        { status: 400 }
      );
    }

    const eventData: CreateEventData = {
      title: body.title,
      description: body.description,
      location: body.location,
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      maxCapacity: body.maxCapacity,
      isPublic: body.isPublic ?? true,
      categoryIds: body.categoryIds,
      tagNames: body.tagNames
    };

    const event = await EventService.createEvent(session.user.id, eventData);

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
