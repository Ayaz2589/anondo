import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";

// Search users
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: "Search query must be at least 2 characters" },
        { status: 400 }
      );
    }

    // Search users by name or email
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            id: {
              not: session.user.id, // Exclude current user
            },
          },
          {
            OR: [
              {
                name: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            ],
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            createdEvents: true,
          },
        },
      },
      take: limit,
      skip: offset,
      orderBy: [
        {
          name: "asc",
        },
        {
          email: "asc",
        },
      ],
    });

    // Get follow status for each user
    const userIds = users.map((user) => user.id);
    const followStatuses = await prisma.follow.findMany({
      where: {
        followerId: session.user.id,
        followingId: {
          in: userIds,
        },
      },
      select: {
        followingId: true,
      },
    });

    const followingIds = new Set(
      followStatuses.map((follow) => follow.followingId)
    );

    const usersWithFollowStatus = users.map((user) => ({
      ...user,
      isFollowing: followingIds.has(user.id),
    }));

    return NextResponse.json({
      users: usersWithFollowStatus,
      hasMore: users.length === limit,
    });
  } catch (error) {
    console.error("Search users error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
