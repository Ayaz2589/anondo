import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/config';
import { EventService } from '@/lib/services/event-service';

// GET /api/users/[id]/events - Get user's events (created and joined)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'created' or 'joined'

    // Users can only view their own events
    if (session.user.id !== resolvedParams.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    let events;
    if (type === 'created') {
      events = await EventService.getUserCreatedEvents(resolvedParams.id);
    } else if (type === 'joined') {
      events = await EventService.getUserJoinedEvents(resolvedParams.id);
    } else {
      // Return both created and joined events
      const [createdEvents, joinedEvents] = await Promise.all([
        EventService.getUserCreatedEvents(resolvedParams.id),
        EventService.getUserJoinedEvents(resolvedParams.id)
      ]);
      
      return NextResponse.json({
        created: createdEvents,
        joined: joinedEvents
      });
    }

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching user events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
