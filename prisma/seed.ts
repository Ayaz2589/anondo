import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to generate random placehold.co images
function generateRandomImage() {
  const widths = [800, 900, 1000, 1200];
  const heights = [400, 500, 600, 700];
  const colors = ['FF6B6B', '4ECDC4', '45B7D1', 'FFA07A', '98D8C8', 'F7DC6F', 'BB8FCE', '85C1E9'];
  const texts = [
    'Event+Photo',
    'Beautiful+Moment',
    'Great+Times',
    'Memories',
    'Fun+Event',
    'Amazing+Day',
    'Special+Moment',
    'Good+Vibes'
  ];

  const width = widths[Math.floor(Math.random() * widths.length)];
  const height = heights[Math.floor(Math.random() * heights.length)];
  const bgColor = colors[Math.floor(Math.random() * colors.length)];
  const textColor = 'FFFFFF';
  const text = texts[Math.floor(Math.random() * texts.length)];

  return {
    url: `https://placehold.co/${width}x${height}/${bgColor}/${textColor}?text=${text}`,
    width,
    height
  };
}

async function main() {
  console.log('🌱 Starting seed...');

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Technology' },
      update: {},
      create: {
        name: 'Technology',
        description: 'Tech meetups, conferences, and workshops',
        color: '#3B82F6',
        icon: 'laptop'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Sports' },
      update: {},
      create: {
        name: 'Sports',
        description: 'Sports events and activities',
        color: '#10B981',
        icon: 'sports'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Social' },
      update: {},
      create: {
        name: 'Social',
        description: 'Social gatherings and networking',
        color: '#F59E0B',
        icon: 'users'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Education' },
      update: {},
      create: {
        name: 'Education',
        description: 'Learning and educational events',
        color: '#8B5CF6',
        icon: 'book'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Food & Drink' },
      update: {},
      create: {
        name: 'Food & Drink',
        description: 'Culinary experiences and tastings',
        color: '#EF4444',
        icon: 'utensils'
      }
    }),
    prisma.category.upsert({
      where: { name: 'Arts & Culture' },
      update: {},
      create: {
        name: 'Arts & Culture',
        description: 'Art exhibitions, cultural events',
        color: '#EC4899',
        icon: 'palette'
      }
    })
  ]);

  console.log('✅ Created categories:', categories.map(c => c.name));

  // Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: 'networking' },
      update: {},
      create: { name: 'networking' }
    }),
    prisma.tag.upsert({
      where: { name: 'beginner-friendly' },
      update: {},
      create: { name: 'beginner-friendly' }
    }),
    prisma.tag.upsert({
      where: { name: 'free' },
      update: {},
      create: { name: 'free' }
    }),
    prisma.tag.upsert({
      where: { name: 'workshop' },
      update: {},
      create: { name: 'workshop' }
    }),
    prisma.tag.upsert({
      where: { name: 'outdoor' },
      update: {},
      create: { name: 'outdoor' }
    }),
    prisma.tag.upsert({
      where: { name: 'premium' },
      update: {},
      create: { name: 'premium' }
    })
  ]);

  console.log('✅ Created tags:', tags.map(t => t.name));

  // Ensure the main user exists
  const mainUser = await prisma.user.upsert({
    where: { id: 'cmexdecb10000c9xb76gmgm9b' },
    update: {},
    create: {
      id: 'cmexdecb10000c9xb76gmgm9b',
      email: 'ayaz2589@gmail.com',
      name: 'Ayaz Uddin',
      image: 'https://placehold.co/100x100/4F46E5/FFFFFF?text=AU'
    }
  });

  // Create dummy users
  const dummyUsers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'john.doe@example.com' },
      update: {},
      create: {
        email: 'john.doe@example.com',
        name: 'John Doe',
        image: 'https://placehold.co/100x100/10B981/FFFFFF?text=JD'
      }
    }),
    prisma.user.upsert({
      where: { email: 'jane.smith@example.com' },
      update: {},
      create: {
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        image: 'https://placehold.co/100x100/F59E0B/FFFFFF?text=JS'
      }
    }),
    prisma.user.upsert({
      where: { email: 'mike.wilson@example.com' },
      update: {},
      create: {
        email: 'mike.wilson@example.com',
        name: 'Mike Wilson',
        image: 'https://placehold.co/100x100/EF4444/FFFFFF?text=MW'
      }
    }),
    prisma.user.upsert({
      where: { email: 'sarah.johnson@example.com' },
      update: {},
      create: {
        email: 'sarah.johnson@example.com',
        name: 'Sarah Johnson',
        image: 'https://placehold.co/100x100/8B5CF6/FFFFFF?text=SJ'
      }
    }),
    prisma.user.upsert({
      where: { email: 'alex.brown@example.com' },
      update: {},
      create: {
        email: 'alex.brown@example.com',
        name: 'Alex Brown',
        image: 'https://placehold.co/100x100/EC4899/FFFFFF?text=AB'
      }
    }),
    prisma.user.upsert({
      where: { email: 'lisa.davis@example.com' },
      update: {},
      create: {
        email: 'lisa.davis@example.com',
        name: 'Lisa Davis',
        image: 'https://placehold.co/100x100/06B6D4/FFFFFF?text=LD'
      }
    })
  ]);

  console.log('✅ Created dummy users:', dummyUsers.map(u => u.name));

  // Create follow relationships
  const followRelationships = [
    { followerId: dummyUsers[0].id, followingId: mainUser.id },
    { followerId: dummyUsers[1].id, followingId: mainUser.id },
    { followerId: dummyUsers[2].id, followingId: mainUser.id },
    { followerId: mainUser.id, followingId: dummyUsers[0].id },
    { followerId: mainUser.id, followingId: dummyUsers[3].id },
    { followerId: mainUser.id, followingId: dummyUsers[4].id },
    // Cross-follows between dummy users
    { followerId: dummyUsers[0].id, followingId: dummyUsers[1].id },
    { followerId: dummyUsers[1].id, followingId: dummyUsers[2].id },
    { followerId: dummyUsers[2].id, followingId: dummyUsers[3].id }
  ];

  for (const follow of followRelationships) {
    await prisma.follow.upsert({
      where: {
        followerId_followingId: {
          followerId: follow.followerId,
          followingId: follow.followingId
        }
      },
      update: {},
      create: follow
    });
  }

  console.log('✅ Created follow relationships');

  // Create comprehensive events for the main user
  const events = [];
  
  const eventData = [
    {
      title: 'React & Next.js Workshop',
      description: 'Learn modern React development with Next.js 15. We\'ll cover server components, app router, and best practices for building scalable applications.\n\nWhat you\'ll learn:\n- Next.js App Router\n- Server Components vs Client Components\n- Data fetching patterns\n- Deployment strategies\n\nBring your laptop and be ready to code!',
      location: 'Tech Hub, Dhaka',
      startDate: new Date('2024-02-15T10:00:00Z'),
      endDate: new Date('2024-02-15T16:00:00Z'),
      maxCapacity: 30,
      isPublic: true,
      status: 'ACTIVE',
      categoryIds: [categories[0].id], // Technology
      tagIds: [tags[0].id, tags[1].id, tags[3].id] // networking, beginner-friendly, workshop
    },
    {
      title: 'Community Football Match',
      description: 'Join us for a friendly football match at the local stadium. All skill levels welcome!\n\nWhat to bring:\n- Sports shoes\n- Water bottle\n- Positive attitude\n\nWe\'ll provide the ball and organize teams on the spot.',
      location: 'Dhanmondi Stadium, Dhaka',
      startDate: new Date('2024-02-20T16:00:00Z'),
      endDate: new Date('2024-02-20T18:00:00Z'),
      maxCapacity: 22,
      isPublic: true,
      status: 'ACTIVE',
      categoryIds: [categories[1].id], // Sports
      tagIds: [tags[2].id, tags[4].id] // free, outdoor
    },
    {
      title: 'Startup Networking Evening',
      description: 'Connect with fellow entrepreneurs, investors, and startup enthusiasts. Share ideas, find co-founders, and build meaningful connections.\n\nAgenda:\n- Welcome drinks (6:00-6:30 PM)\n- Lightning pitches (6:30-7:30 PM)\n- Networking session (7:30-9:00 PM)\n- Closing remarks\n\nDress code: Business casual',
      location: 'Gulshan Business Club',
      startDate: new Date('2024-02-25T18:00:00Z'),
      endDate: new Date('2024-02-25T21:00:00Z'),
      maxCapacity: 50,
      isPublic: true,
      status: 'ACTIVE',
      categoryIds: [categories[2].id], // Social
      tagIds: [tags[0].id, tags[5].id] // networking, premium
    },
    {
      title: 'Photography Masterclass',
      description: 'Master the art of photography with professional photographer Sarah Ahmed. Learn composition, lighting, and post-processing techniques.\n\nTopics covered:\n- Camera settings and manual mode\n- Composition rules and creative techniques\n- Natural lighting vs artificial lighting\n- Basic photo editing in Lightroom\n\nCamera required (DSLR or mirrorless preferred)',
      location: 'Creative Arts Center, Uttara',
      startDate: new Date('2024-03-05T14:00:00Z'),
      endDate: new Date('2024-03-05T17:00:00Z'),
      maxCapacity: 15,
      isPublic: true,
      status: 'ACTIVE',
      categoryIds: [categories[5].id], // Arts & Culture
      tagIds: [tags[3].id, tags[1].id] // workshop, beginner-friendly
    },
    {
      title: 'Bengali Cuisine Cooking Class',
      description: 'Learn to cook authentic Bengali dishes with Chef Rahman. We\'ll prepare a full traditional meal together.\n\nMenu:\n- Hilsa fish curry\n- Bhapa rice\n- Aloo posto\n- Mishti doi\n\nAll ingredients and equipment provided. Take home recipe cards!',
      location: 'Culinary Institute, Dhanmondi',
      startDate: new Date('2024-03-10T11:00:00Z'),
      endDate: new Date('2024-03-10T15:00:00Z'),
      maxCapacity: 12,
      isPublic: true,
      status: 'ACTIVE',
      categoryIds: [categories[4].id], // Food & Drink
      tagIds: [tags[3].id] // workshop
    },
    {
      title: 'AI & Machine Learning Seminar',
      description: 'Explore the latest trends in AI and ML with industry experts. Perfect for developers, data scientists, and tech enthusiasts.\n\nSpeakers:\n- Dr. Rashid Ahmed (AI Researcher, BUET)\n- Fatima Khan (ML Engineer, Google)\n- Mahmud Hassan (Data Scientist, Pathao)\n\nTopics:\n- Current state of AI in Bangladesh\n- Career opportunities in ML\n- Hands-on demo with TensorFlow\n- Q&A session',
      location: 'BUET Auditorium',
      startDate: new Date('2024-03-15T09:00:00Z'),
      endDate: new Date('2024-03-15T13:00:00Z'),
      maxCapacity: 100,
      isPublic: true,
      status: 'ACTIVE',
      categoryIds: [categories[0].id, categories[3].id], // Technology, Education
      tagIds: [tags[2].id, tags[0].id] // free, networking
    }
  ];

  for (let i = 0; i < eventData.length; i++) {
    const data = eventData[i];
    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        startDate: data.startDate,
        endDate: data.endDate,
        maxCapacity: data.maxCapacity,
        isPublic: data.isPublic,
        status: data.status,
        creatorId: mainUser.id,
        categories: {
          create: data.categoryIds.map(categoryId => ({
            categoryId
          }))
        },
        tags: {
          create: data.tagIds.map(tagId => ({
            tagId
          }))
        }
      }
    });
    events.push(event);
  }

  console.log('✅ Created events:', events.map(e => e.title));

  // Add event participants
  const participantData = [
    { eventIndex: 0, userIds: [dummyUsers[0].id, dummyUsers[1].id, dummyUsers[2].id, dummyUsers[3].id] },
    { eventIndex: 1, userIds: [dummyUsers[1].id, dummyUsers[2].id, dummyUsers[4].id] },
    { eventIndex: 2, userIds: [dummyUsers[0].id, dummyUsers[3].id, dummyUsers[4].id, dummyUsers[5].id] },
    { eventIndex: 3, userIds: [dummyUsers[1].id, dummyUsers[5].id] },
    { eventIndex: 4, userIds: [dummyUsers[0].id, dummyUsers[2].id, dummyUsers[4].id] },
    { eventIndex: 5, userIds: [dummyUsers[0].id, dummyUsers[1].id, dummyUsers[2].id, dummyUsers[3].id, dummyUsers[4].id] }
  ];

  for (const { eventIndex, userIds } of participantData) {
    for (const userId of userIds) {
      await prisma.eventParticipant.create({
        data: {
          eventId: events[eventIndex].id,
          userId,
          status: 'JOINED',
          joinedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random time in last 7 days
        }
      });
    }
  }

  console.log('✅ Added event participants');

  // Add images to events
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const imageCount = Math.floor(Math.random() * 4) + 2; // 2-5 images per event
    
    for (let j = 0; j < imageCount; j++) {
      const imageData = generateRandomImage();
      await prisma.eventImage.create({
        data: {
          eventId: event.id,
          url: imageData.url,
          width: imageData.width,
          height: imageData.height,
          altText: `${event.title} - Image ${j + 1}`,
          caption: j === 0 ? 'Main event photo' : `Event moment ${j + 1}`,
          order: j
        }
      });
    }
  }

  console.log('✅ Added event images');

  // Add comments to events
  const commentTexts = [
    "This looks amazing! Can't wait to attend 🎉",
    "Great initiative! Thanks for organizing this.",
    "Will there be any prerequisites for this event?",
    "I attended the last one and it was fantastic!",
    "Perfect timing, I was looking for something like this.",
    "Is there parking available at the venue?",
    "The description sounds very comprehensive. Well planned!",
    "Count me in! This is exactly what I needed.",
    "Will there be any follow-up sessions?",
    "Thanks for making this beginner-friendly!",
    "The venue looks perfect for this type of event.",
    "I'm bringing a friend along. Hope that's okay!",
    "This will be my first time attending. Any tips?",
    "The agenda looks well structured. Good job!",
    "Looking forward to the networking opportunities!"
  ];

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const commentCount = Math.floor(Math.random() * 8) + 3; // 3-10 comments per event
    
    for (let j = 0; j < commentCount; j++) {
      const randomUser = dummyUsers[Math.floor(Math.random() * dummyUsers.length)];
      const randomText = commentTexts[Math.floor(Math.random() * commentTexts.length)];
      
      const comment = await prisma.comment.create({
        data: {
          eventId: event.id,
          authorId: randomUser.id,
          content: randomText,
          createdAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000) // Random time in last 14 days
        }
      });

      // Add random likes to comments
      const likeCount = Math.floor(Math.random() * 4); // 0-3 likes per comment
      const likers = dummyUsers.slice(0, likeCount);
      
      for (const liker of likers) {
        if (liker.id !== randomUser.id) { // Don't let users like their own comments
          await prisma.commentLike.create({
            data: {
              commentId: comment.id,
              userId: liker.id,
              createdAt: new Date(comment.createdAt.getTime() + Math.random() * 24 * 60 * 60 * 1000) // Like after comment
            }
          });
        }
      }
    }
  }

  console.log('✅ Added comments and likes');

  console.log('🎉 Seed completed successfully!');
  console.log(`
📊 Summary:
- Categories: ${categories.length}
- Tags: ${tags.length}
- Users: ${dummyUsers.length + 1} (including main user)
- Events: ${events.length}
- Follow relationships: ${followRelationships.length}
- Images: ~${events.length * 3} (2-5 per event)
- Comments: ~${events.length * 6} (3-10 per event)
- Comment likes: Various per comment

🎯 Main user: ${mainUser.name} (${mainUser.email})
  `);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
