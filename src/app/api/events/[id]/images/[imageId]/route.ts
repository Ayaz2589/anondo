import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma';

// DELETE /api/events/[id]/images/[imageId] - Delete an image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id: eventId, imageId } = await params;

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
        { error: 'Only event creators can delete images' },
        { status: 403 }
      );
    }

    // Check if image exists and belongs to this event
    const image = await prisma.eventImage.findFirst({
      where: {
        id: imageId,
        eventId
      }
    });

    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Delete the image
    await prisma.eventImage.delete({
      where: { id: imageId }
    });

    // Reorder remaining images to fill the gap
    await prisma.eventImage.updateMany({
      where: {
        eventId,
        order: { gt: image.order }
      },
      data: {
        order: { decrement: 1 }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/events/[id]/images/[imageId] - Update image details
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id: eventId, imageId } = await params;
    const body = await request.json();
    const { altText, caption, order } = body;

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
        { error: 'Only event creators can update images' },
        { status: 403 }
      );
    }

    // Check if image exists and belongs to this event
    const existingImage = await prisma.eventImage.findFirst({
      where: {
        id: imageId,
        eventId
      }
    });

    if (!existingImage) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Handle order change if provided
    if (order !== undefined && order !== existingImage.order) {
      // Get all images for this event
      const allImages = await prisma.eventImage.findMany({
        where: { eventId },
        orderBy: { order: 'asc' },
        select: { id: true, order: true }
      });

      // Reorder images
      const oldOrder = existingImage.order;
      const newOrder = Math.max(0, Math.min(order, allImages.length - 1));

      if (oldOrder !== newOrder) {
        if (oldOrder < newOrder) {
          // Moving down: shift images up
          await prisma.eventImage.updateMany({
            where: {
              eventId,
              order: { gt: oldOrder, lte: newOrder }
            },
            data: { order: { decrement: 1 } }
          });
        } else {
          // Moving up: shift images down
          await prisma.eventImage.updateMany({
            where: {
              eventId,
              order: { gte: newOrder, lt: oldOrder }
            },
            data: { order: { increment: 1 } }
          });
        }
      }
    }

    // Update the image
    const updatedImage = await prisma.eventImage.update({
      where: { id: imageId },
      data: {
        ...(altText !== undefined && { altText }),
        ...(caption !== undefined && { caption }),
        ...(order !== undefined && { order })
      },
      select: {
        id: true,
        url: true,
        altText: true,
        caption: true,
        order: true,
        width: true,
        height: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({ image: updatedImage });
  } catch (error) {
    console.error('Error updating event image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
