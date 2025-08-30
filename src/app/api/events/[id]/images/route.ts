import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma';

// GET /api/events/[id]/images - Get all images for an event
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id;

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, isPublic: true, creatorId: true }
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // For private events, check if user has access
    if (!event.isPublic) {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      // Check if user is creator or participant
      const hasAccess = event.creatorId === session.user.id || 
        await prisma.eventParticipant.findFirst({
          where: {
            eventId,
            userId: session.user.id,
            status: 'JOINED'
          }
        });

      if (!hasAccess) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        );
      }
    }

    // Get images ordered by their order field
    const images = await prisma.eventImage.findMany({
      where: { eventId },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        url: true,
        altText: true,
        caption: true,
        order: true,
        width: true,
        height: true,
        createdAt: true
      }
    });

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching event images:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/events/[id]/images - Add a new image to an event
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const eventId = params.id;
    const body = await request.json();
    const { url, altText, caption, width, height } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Check if user owns the event
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { creatorId: true }
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    if (event.creatorId !== session.user.id) {
      return NextResponse.json(
        { error: 'Only event creators can add images' },
        { status: 403 }
      );
    }

    // Get the next order number
    const lastImage = await prisma.eventImage.findFirst({
      where: { eventId },
      orderBy: { order: 'desc' },
      select: { order: true }
    });

    const nextOrder = (lastImage?.order ?? -1) + 1;

    // Create the image
    const image = await prisma.eventImage.create({
      data: {
        eventId,
        url,
        altText,
        caption,
        width,
        height,
        order: nextOrder
      },
      select: {
        id: true,
        url: true,
        altText: true,
        caption: true,
        order: true,
        width: true,
        height: true,
        createdAt: true
      }
    });

    return NextResponse.json({ image }, { status: 201 });
  } catch (error) {
    console.error('Error adding event image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
