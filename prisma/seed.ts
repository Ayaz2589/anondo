import { PrismaClient, EventStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Standard image for all events
const STANDARD_IMAGE = {
  url: 'https://placehold.co/600x400?text=Hello+World',
  width: 600,
  height: 400
};

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.commentLike.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.eventImage.deleteMany();
  await prisma.eventParticipant.deleteMany();
  await prisma.eventTag.deleteMany();
  await prisma.eventCategory.deleteMany();
  await prisma.event.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️ Cleared existing data');

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Technology',
        description: 'Tech meetups, conferences, and workshops',
        color: '#3B82F6',
        icon: 'laptop'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Social',
        description: 'Social gatherings and networking',
        color: '#F59E0B',
        icon: 'users'
      }
    }),
    prisma.category.create({
      data: {
        name: 'Education',
        description: 'Learning and educational events',
        color: '#8B5CF6',
        icon: 'book'
      }
    })
  ]);

  console.log('✅ Created categories:', categories.map(c => c.name));

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'networking' } }),
    prisma.tag.create({ data: { name: 'workshop' } }),
    prisma.tag.create({ data: { name: 'free' } })
  ]);

  console.log('✅ Created tags:', tags.map(t => t.name));

  // Create 4 users (main user + 3 others)
  const mainUser = await prisma.user.create({
    data: {
      id: 'cmexdecb10000c9xb76gmgm9b',
      email: 'ayaz2589@gmail.com',
      name: 'Ayaz Uddin',
      image: null
    }
  });

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john.doe@example.com',
        name: 'জন দাস',
        image: null
      }
    }),
    prisma.user.create({
      data: {
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        image: null
      }
    }),
    prisma.user.create({
      data: {
        email: 'mike.wilson@example.com',
        name: 'মাইকেল ওয়াহিদ',
        image: null
      }
    })
  ]);

  const allUsers = [mainUser, ...users];
  console.log('✅ Created users:', allUsers.map(u => u.name));

  // Create events - Main user has multiple events (past and upcoming)
  const now = new Date();
  const events = [];
  
  // Main user events (multiple events with mix of past and upcoming)
  const mainUserEvents = [
    {
      title: 'React & Next.js Workshop',
      description: 'Learn modern React development with Next.js 15. We will cover server components, app router, and best practices for building scalable applications.',
      startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago (past)
      endDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
      status: EventStatus.COMPLETED,
      creatorId: mainUser.id
    },
    {
      title: 'রিয়েক্ট ও নেক্সট.জেএস ওয়ার্কশপ',
      description: 'নেক্সট.জেএস ১৫ দিয়ে আধুনিক রিয়েক্ট ডেভেলপমেন্ট শিখুন। আমরা সার্ভার কম্পোনেন্ট, অ্যাপ রাউটার এবং স্কেলেবল অ্যাপ্লিকেশন তৈরির সেরা পদ্ধতি নিয়ে আলোচনা করব।',
      startDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now (upcoming)
      endDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
      status: EventStatus.ACTIVE,
      creatorId: mainUser.id
    },
    {
      title: 'Community Football Match',
      description: 'Join us for a friendly football match at the local stadium. Players of all skill levels are welcome!',
      startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      status: EventStatus.ACTIVE,
      creatorId: mainUser.id
    },
    {
      title: 'স্টার্টআপ নেটওয়ার্কিং সন্ধ্যা',
      description: 'সহ উদ্যোক্তা, বিনিয়োগকারী এবং স্টার্টআপ উৎসাহীদের সাথে সংযোগ স্থাপন করুন। ধারণা ভাগাভাগি করুন, সহ-প্রতিষ্ঠাতা খুঁজুন এবং অর্থবহ সংযোগ তৈরি করুন।',
      startDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      endDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
      status: EventStatus.ACTIVE,
      creatorId: mainUser.id
    }
  ];

  // Other users events (each user creates at least one event)
  const otherUserEvents = [
    {
      title: 'Morning Yoga Session',
      description: 'Start your day with peaceful yoga practice in the park. All levels welcome!',
      startDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000),
      status: EventStatus.ACTIVE,
      creatorId: users[0].id
    },
    {
      title: 'Digital Marketing Workshop',
      description: 'Learn the fundamentals of digital marketing for small businesses and startups.',
      startDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
      status: EventStatus.ACTIVE,
      creatorId: users[1].id
    },
    {
      title: 'সাপ্তাহিক বই ক্লাব মিটিং',
      description: 'আমাদের মাসিক বই ক্লাব আলোচনায় যোগ দিন! এই মাসে আমরা পাউলো কোয়েলহোর "দ্য অ্যালকেমিস্ট" পড়ছি।',
      startDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      status: EventStatus.ACTIVE,
      creatorId: users[2].id
    }
  ];

  // Create all events
  const allEventData = [...mainUserEvents, ...otherUserEvents];
  
  for (const eventData of allEventData) {
    const event = await prisma.event.create({
      data: {
        title: eventData.title,
        description: eventData.description,
        location: 'Astoria, NY',
        locationName: 'Community Center',
        locationAddress: '32-43 47th st, Astoria NY 11103',
        locationLat: 40.7614,
        locationLng: -73.9176,
        locationPlaceId: 'ChIJExample',
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        maxCapacity: 25,
        isPublic: true,
        status: eventData.status,
        creatorId: eventData.creatorId,
        categories: {
          create: [{
            categoryId: categories[Math.floor(Math.random() * categories.length)].id
          }]
        },
        tags: {
          create: [{
            tagId: tags[Math.floor(Math.random() * tags.length)].id
          }]
        }
      }
    });
    events.push(event);
  }

  console.log('✅ Created events:', events.map(e => e.title));

  // Create event participants - each user participates in at least 2 events
  const participantData = [
    // Main user joins other users' events
    { eventId: events[4].id, userId: mainUser.id }, // Yoga
    { eventId: events[5].id, userId: mainUser.id }, // Marketing
    
    // User 1 joins events
    { eventId: events[1].id, userId: users[0].id }, // Main user's event
    { eventId: events[6].id, userId: users[0].id }, // Book club
    
    // User 2 joins events  
    { eventId: events[0].id, userId: users[1].id }, // Main user's past event
    { eventId: events[2].id, userId: users[1].id }, // Football
    
    // User 3 joins events
    { eventId: events[1].id, userId: users[2].id }, // Main user's upcoming event
    { eventId: events[4].id, userId: users[2].id }, // Yoga
  ];

  for (const participant of participantData) {
      await prisma.eventParticipant.create({
        data: {
        eventId: participant.eventId,
        userId: participant.userId,
          status: 'JOINED',
        joinedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        }
      });
  }

  console.log('✅ Added event participants');

  // Add images to all events using the standard image
  for (const event of events) {
    // Add 3-5 images per event
    const imageCount = Math.floor(Math.random() * 3) + 3;
    
    for (let i = 0; i < imageCount; i++) {
      await prisma.eventImage.create({
        data: {
          eventId: event.id,
          url: STANDARD_IMAGE.url,
          width: STANDARD_IMAGE.width,
          height: STANDARD_IMAGE.height,
          altText: `${event.title} - Image ${i + 1}`,
          caption: i === 0 ? 'Main event photo' : `Event moment ${i + 1}`,
          order: i
        }
      });
    }
  }

  console.log('✅ Added event images');

  // Add comments with mix of English and Bengali
  const englishComments = [
    "This looks amazing! Can't wait to participate 🎉",
    "Great initiative! Thanks for organizing this.",
    "Are there any prerequisites for this event?",
    "I went to the last event and it was fantastic!",
    "Perfect timing, I was looking for something like this.",
    "Is there parking available at the venue?",
    "The description sounds very comprehensive. Good planning!",
    "Count me in! This is exactly what I needed.",
    "Will there be any follow-up sessions?",
    "Thanks for making this beginner-friendly!"
  ];

  const bengaliComments = [
    "এটা দেখতে অসাধারণ লাগছে! অংশগ্রহণের জন্য অপেক্ষায় রইলাম 🎉",
    "দুর্দান্ত উদ্যোগ! এটি আয়োজনের জন্য ধন্যবাদ।",
    "এই ইভেন্টের জন্য কোনো পূর্বশর্ত আছে কি?",
    "আমি গত বারের অনুষ্ঠানে গিয়েছিলাম এবং এটি চমৎকার ছিল!",
    "নিখুঁত সময়, আমি ঠিক এরকম কিছু খুঁজছিলাম।",
    "ভেন্যুতে পার্কিং সুবিধা আছে কি?",
    "বর্ণনাটি খুবই বিস্তৃত শোনাচ্ছে। ভালো পরিকল্পনা!",
    "আমাকে গণনা করুন! এটি ঠিক যা আমার প্রয়োজন ছিল।",
    "কোনো ফলো-আপ সেশন থাকবে কি?",
    "এটি নতুনদের জন্য উপযুক্ত করার জন্য ধন্যবাদ!"
  ];

  const allComments = [...englishComments, ...bengaliComments];

  // Add comments to all events
  for (const event of events) {
    const commentCount = Math.floor(Math.random() * 6) + 4; // 4-9 comments per event
    
    for (let i = 0; i < commentCount; i++) {
      const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
      const randomComment = allComments[Math.floor(Math.random() * allComments.length)];
      
      const comment = await prisma.comment.create({
        data: {
          eventId: event.id,
          authorId: randomUser.id,
          content: randomComment,
          createdAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000)
        }
      });

      // Add random likes to comments
      const likeCount = Math.floor(Math.random() * 3); // 0-2 likes per comment
      const likers = allUsers.slice(0, likeCount);
      
      for (const liker of likers) {
        if (liker.id !== randomUser.id) { // Don't let users like their own comments
          await prisma.commentLike.create({
            data: {
              commentId: comment.id,
              userId: liker.id,
              createdAt: new Date(comment.createdAt.getTime() + Math.random() * 24 * 60 * 60 * 1000)
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
- Users: ${allUsers.length}
- Events: ${events.length} (${mainUserEvents.length} by main user + ${otherUserEvents.length} by others)
- Images: ~${events.length * 4} (3-5 per event)
- Comments: ~${events.length * 6} (4-9 per event with likes)

🎯 Main user: ${mainUser.name} (${mainUser.email})
- Created events: ${mainUserEvents.length}
- Joined events: 2
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