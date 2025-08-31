import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma';

// POST /api/events/[id]/comments/[commentId]/like - Toggle like on a comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id: eventId, commentId } = await params;
    const userId = (session.user as any).id;

    // Check if comment exists and belongs to this event
    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
        eventId
      },
      include: {
        event: {
          select: { isPublic: true, creatorId: true }
        }
      }
    });

    if (!comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // For private events, check if user has access
    if (!comment.event.isPublic) {
      const hasAccess = comment.event.creatorId === userId || 
        await prisma.eventParticipant.findFirst({
          where: {
            eventId,
            userId,
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

    // Check if user already liked this comment
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId
        }
      }
    });

    let isLiked: boolean;
    let likesCount: number;

    if (existingLike) {
      // Unlike: Remove the like
      await prisma.commentLike.delete({
        where: { id: existingLike.id }
      });
      isLiked = false;
    } else {
      // Like: Add the like
      await prisma.commentLike.create({
        data: {
          commentId,
          userId
        }
      });
      isLiked = true;
    }

    // Get updated likes count
    const updatedComment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        _count: {
          select: { likes: true }
        }
      }
    });

    likesCount = updatedComment?._count.likes || 0;

    return NextResponse.json({
      isLiked,
      likesCount
    });
  } catch (error) {
    console.error('Error toggling comment like:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
