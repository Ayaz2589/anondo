import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/config';
import { prisma } from '@/lib/prisma';

// GET /api/events/[id]/comments - Get all comments for an event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    console.log('Fetching comments for event:', eventId);

    // Check if event exists and is accessible
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
      const hasAccess = event.creatorId === (session.user as any).id || 
        await prisma.eventParticipant.findFirst({
          where: {
            eventId,
            userId: (session.user as any).id,
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

    // Get current user for like status
    const session = await getServerSession(authOptions);
    const currentUserId = (session?.user as any)?.id;

    // Get comments with author info and like counts
    const comments = await prisma.comment.findMany({
      where: { eventId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        _count: {
          select: { likes: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get user's likes separately if user is logged in
    let userLikes: string[] = [];
    if (currentUserId) {
      const likes = await prisma.commentLike.findMany({
        where: {
          userId: currentUserId,
          commentId: { in: comments.map(c => c.id) }
        },
        select: { commentId: true }
      });
      userLikes = likes.map(like => like.commentId);
    }

    // Transform the data to include isLiked flag
    const transformedComments = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: comment.author,
      likesCount: comment._count.likes,
      isLiked: userLikes.includes(comment.id)
    }));

    return NextResponse.json({ comments: transformedComments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/events/[id]/comments - Add a new comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id: eventId } = await params;
    const body = await request.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }

    // Check if event exists and user has access
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
      const hasAccess = event.creatorId === (session.user as any).id || 
        await prisma.eventParticipant.findFirst({
          where: {
            eventId,
            userId: (session.user as any).id,
            status: 'JOINED'
          }
        });

      if (!hasAccess) {
        return NextResponse.json(
          { error: 'You can only comment on events you have access to' },
          { status: 403 }
        );
      }
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        eventId,
        authorId: (session.user as any).id,
        content: content.trim()
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        _count: {
          select: { likes: true }
        }
      }
    });

    // Transform the response
    const transformedComment = {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: comment.author,
      likesCount: comment._count.likes,
      isLiked: false
    };

    return NextResponse.json({ comment: transformedComment }, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
