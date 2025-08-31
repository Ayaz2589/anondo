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
        name: 'জন দাস',
        image: 'https://placehold.co/100x100/10B981/FFFFFF?text=JD'
      }
    }),
    prisma.user.upsert({
      where: { email: 'jane.smith@example.com' },
      update: {},
      create: {
        email: 'jane.smith@example.com',
        name: 'জেনিফার শর্মা',
        image: 'https://placehold.co/100x100/F59E0B/FFFFFF?text=JS'
      }
    }),
    prisma.user.upsert({
      where: { email: 'mike.wilson@example.com' },
      update: {},
      create: {
        email: 'mike.wilson@example.com',
        name: 'মাইকেল ওয়াহিদ',
        image: 'https://placehold.co/100x100/EF4444/FFFFFF?text=MW'
      }
    }),
    prisma.user.upsert({
      where: { email: 'sarah.johnson@example.com' },
      update: {},
      create: {
        email: 'sarah.johnson@example.com',
        name: 'সারা জাহান',
        image: 'https://placehold.co/100x100/8B5CF6/FFFFFF?text=SJ'
      }
    }),
    prisma.user.upsert({
      where: { email: 'alex.brown@example.com' },
      update: {},
      create: {
        email: 'alex.brown@example.com',
        name: 'আলেক্স বিশ্বাস',
        image: 'https://placehold.co/100x100/EC4899/FFFFFF?text=AB'
      }
    }),
    prisma.user.upsert({
      where: { email: 'lisa.davis@example.com' },
      update: {},
      create: {
        email: 'lisa.davis@example.com',
        name: 'লিসা দত্ত',
        image: 'https://placehold.co/100x100/06B6D4/FFFFFF?text=LD'
      }
    })
  ]);

  console.log('✅ Created dummy users:', dummyUsers.map(u => u.name));

  // Create follow relationships - Main user follows more people
  const followRelationships = [
    // Others follow main user
    { followerId: dummyUsers[0].id, followingId: mainUser.id },
    { followerId: dummyUsers[1].id, followingId: mainUser.id },
    { followerId: dummyUsers[2].id, followingId: mainUser.id },
    { followerId: dummyUsers[3].id, followingId: mainUser.id },
    // Main user follows others (expanded)
    { followerId: mainUser.id, followingId: dummyUsers[0].id },
    { followerId: mainUser.id, followingId: dummyUsers[1].id },
    { followerId: mainUser.id, followingId: dummyUsers[2].id },
    { followerId: mainUser.id, followingId: dummyUsers[3].id },
    { followerId: mainUser.id, followingId: dummyUsers[4].id },
    { followerId: mainUser.id, followingId: dummyUsers[5].id },
    // Cross-follows between dummy users
    { followerId: dummyUsers[0].id, followingId: dummyUsers[1].id },
    { followerId: dummyUsers[1].id, followingId: dummyUsers[2].id },
    { followerId: dummyUsers[2].id, followingId: dummyUsers[3].id },
    { followerId: dummyUsers[3].id, followingId: dummyUsers[4].id },
    { followerId: dummyUsers[4].id, followingId: dummyUsers[5].id }
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
      title: 'রিয়েক্ট ও নেক্সট.জেএস ওয়ার্কশপ',
      description: 'নেক্সট.জেএস ১৫ দিয়ে আধুনিক রিয়েক্ট ডেভেলপমেন্ট শিখুন। আমরা সার্ভার কম্পোনেন্ট, অ্যাপ রাউটার এবং স্কেলেবল অ্যাপ্লিকেশন তৈরির সেরা পদ্ধতি নিয়ে আলোচনা করব।\n\nআপনি যা শিখবেন:\n- নেক্সট.জেএস অ্যাপ রাউটার\n- সার্ভার কম্পোনেন্ট বনাম ক্লায়েন্ট কম্পোনেন্ট\n- ডেটা ফেচিং প্যাটার্ন\n- ডিপ্লয়মেন্ট কৌশল\n\nআপনার ল্যাপটপ নিয়ে আসুন এবং কোডিংয়ের জন্য প্রস্তুত থাকুন!',
      location: 'টেক হাব, ঢাকা',
      locationName: 'টেক হাব',
      locationAddress: '32-43 47th st, Astoria NY 11103',
      locationLat: 40.7614,
      locationLng: -73.9176,
      locationPlaceId: 'ChIJExample1',
      startDate: new Date('2024-02-15T10:00:00Z'),
      endDate: new Date('2024-02-15T16:00:00Z'),
      maxCapacity: 30,
      isPublic: true,
      status: 'ACTIVE',
      categoryIds: [categories[0].id], // Technology
      tagIds: [tags[0].id, tags[1].id, tags[3].id] // networking, beginner-friendly, workshop
    },
    {
      title: 'কমিউনিটি ফুটবল ম্যাচ',
      description: 'স্থানীয় স্টেডিয়ামে বন্ধুত্বপূর্ণ ফুটবল ম্যাচে আমাদের সাথে যোগ দিন। সব দক্ষতার স্তরের খেলোয়াড়রা স্বাগতম!\n\nকী আনবেন:\n- খেলার জুতা\n- পানির বোতল\n- ইতিবাচক মনোভাব\n\nআমরা বল সরবরাহ করব এবং ঘটনাস্থলেই দল গঠন করব।',
      location: 'ধানমন্ডি স্টেডিয়াম, ঢাকা',
      locationName: 'ধানমন্ডি স্টেডিয়াম',
      locationAddress: '32-43 47th st, Astoria NY 11103',
      locationLat: 40.7614,
      locationLng: -73.9176,
      locationPlaceId: 'ChIJExample2',
      startDate: new Date('2024-02-20T16:00:00Z'),
      endDate: new Date('2024-02-20T18:00:00Z'),
      maxCapacity: 22,
      isPublic: true,
      status: 'ACTIVE',
      categoryIds: [categories[1].id], // Sports
      tagIds: [tags[2].id, tags[4].id] // free, outdoor
    },
    {
      title: 'স্টার্টআপ নেটওয়ার্কিং সন্ধ্যা',
      description: 'সহ উদ্যোক্তা, বিনিয়োগকারী এবং স্টার্টআপ উৎসাহীদের সাথে সংযোগ স্থাপন করুন। ধারণা ভাগাভাগি করুন, সহ-প্রতিষ্ঠাতা খুঁজুন এবং অর্থবহ সংযোগ তৈরি করুন।\n\nকর্মসূচি:\n- স্বাগত পানীয় (সন্ধ্যা ৬:০০-৬:৩০)\n- দ্রুত উপস্থাপনা (সন্ধ্যা ৬:৩০-৭:৩০)\n- নেটওয়ার্কিং সেশন (সন্ধ্যা ৭:৩০-৯:০০)\n- সমাপনী বক্তব্য\n\nপোশাক: ব্যবসায়িক নৈমিত্তিক',
      location: 'গুলশান বিজনেস ক্লাব',
      locationName: 'গুলশান বিজনেস ক্লাব',
      locationAddress: '32-43 47th st, Astoria NY 11103',
      locationLat: 40.7614,
      locationLng: -73.9176,
      locationPlaceId: 'ChIJExample3',
      startDate: new Date('2024-02-25T18:00:00Z'),
      endDate: new Date('2024-02-25T21:00:00Z'),
      maxCapacity: 50,
      isPublic: true,
      status: 'ACTIVE',
      categoryIds: [categories[2].id], // Social
      tagIds: [tags[0].id, tags[5].id] // networking, premium
    },
    {
      title: 'ফটোগ্রাফি মাস্টারক্লাস',
      description: 'পেশাদার ফটোগ্রাফার সারা আহমেদের সাথে ফটোগ্রাফির শিল্পে দক্ষতা অর্জন করুন। কম্পোজিশন, আলো এবং পোস্ট-প্রসেসিং কৌশল শিখুন।\n\nআলোচিত বিষয়:\n- ক্যামেরা সেটিংস এবং ম্যানুয়াল মোড\n- কম্পোজিশনের নিয়ম এবং সৃজনশীল কৌশল\n- প্রাকৃতিক আলো বনাম কৃত্রিম আলো\n- লাইটরুমে মৌলিক ছবি সম্পাদনা\n\nক্যামেরা প্রয়োজন (DSLR বা মিররলেস পছন্দনীয়)',
      location: 'ক্রিয়েটিভ আর্টস সেন্টার, উত্তরা',
      locationName: 'ক্রিয়েটিভ আর্টস সেন্টার',
      locationAddress: '32-43 47th st, Astoria NY 11103',
      locationLat: 40.7614,
      locationLng: -73.9176,
      locationPlaceId: 'ChIJExample4',
      startDate: new Date('2024-03-05T14:00:00Z'),
      endDate: new Date('2024-03-05T17:00:00Z'),
      maxCapacity: 15,
      isPublic: true,
      status: 'ACTIVE',
      categoryIds: [categories[5].id], // Arts & Culture
      tagIds: [tags[3].id, tags[1].id] // workshop, beginner-friendly
    },
    {
      title: 'বাঙালি রান্নার ক্লাস',
      description: 'শেফ রহমানের সাথে খাঁটি বাঙালি খাবার রান্না করতে শিখুন। আমরা একসাথে একটি সম্পূর্ণ ঐতিহ্যবাহী খাবার প্রস্তুত করব।\n\nমেনু:\n- ইলিশ মাছের ঝোল\n- ভাপা ভাত\n- আলু পোস্ত\n- মিষ্টি দই\n\nসব উপকরণ এবং সরঞ্জাম সরবরাহ করা হবে। রেসিপি কার্ড নিয়ে যান!',
      location: 'কুলিনারি ইনস্টিটিউট, ধানমন্ডি',
      locationName: 'কুলিনারি ইনস্টিটিউট',
      locationAddress: '32-43 47th st, Astoria NY 11103',
      locationLat: 40.7614,
      locationLng: -73.9176,
      locationPlaceId: 'ChIJExample5',
      startDate: new Date('2024-03-10T11:00:00Z'),
      endDate: new Date('2024-03-10T15:00:00Z'),
      maxCapacity: 12,
      isPublic: true,
      status: 'ACTIVE',
      categoryIds: [categories[4].id], // Food & Drink
      tagIds: [tags[3].id] // workshop
    },
    {
      title: 'কৃত্রিম বুদ্ধিমত্তা ও মেশিন লার্নিং সেমিনার',
      description: 'ইন্ডাস্ট্রি বিশেষজ্ঞদের সাথে AI এবং ML এর সর্বশেষ ট্রেন্ড অন্বেষণ করুন। ডেভেলপার, ডেটা সাইন্টিস্ট এবং প্রযুক্তি উৎসাহীদের জন্য উপযুক্ত।\n\nবক্তাগণ:\n- ড. রশিদ আহমেদ (AI গবেষক, বুয়েট)\n- ফাতিমা খান (ML ইঞ্জিনিয়ার, গুগল)\n- মাহমুদ হাসান (ডেটা সাইন্টিস্ট, পাঠাও)\n\nবিষয়সমূহ:\n- বাংলাদেশে AI এর বর্তমান অবস্থা\n- ML এ ক্যারিয়ারের সুযোগ\n- TensorFlow দিয়ে হ্যান্ডস-অন ডেমো\n- প্রশ্নোত্তর পর্ব',
      location: 'বুয়েট অডিটোরিয়াম',
      locationName: 'বুয়েট অডিটোরিয়াম',
      locationAddress: '32-43 47th st, Astoria NY 11103',
      locationLat: 40.7614,
      locationLng: -73.9176,
      locationPlaceId: 'ChIJExample6',
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
        locationName: data.locationName,
        locationAddress: data.locationAddress,
        locationLat: data.locationLat,
        locationLng: data.locationLng,
        locationPlaceId: data.locationPlaceId,
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

  console.log('✅ Created events for main user:', events.map(e => e.title));

  // Create events by other users
  const otherUserEvents = [];
  
  const otherEventData = [
    {
      title: 'সকালের যোগা সেশন',
      description: 'পার্কে শান্তিপূর্ণ যোগা অভ্যাসের মাধ্যমে আপনার দিন শুরু করুন। সব স্তরের অংশগ্রহণকারীরা স্বাগতম!\n\nআমরা যা করব:\n- মৃদু ওয়ার্ম-আপ স্ট্রেচ\n- মৌলিক যোগাসন\n- শ্বাসপ্রশ্বাসের অনুশীলন\n- ধ্যান\n\nআপনার নিজস্ব ম্যাট এবং পানির বোতল নিয়ে আসুন।',
      location: 'রমনা পার্ক, ঢাকা',
      locationName: 'রমনা পার্ক',
      locationAddress: '32-43 47th st, Astoria NY 11103',
      locationLat: 40.7614,
      locationLng: -73.9176,
      locationPlaceId: 'ChIJExample7',
      startDate: new Date('2024-02-18T06:30:00Z'),
      endDate: new Date('2024-02-18T07:30:00Z'),
      maxCapacity: 20,
      isPublic: true,
      status: 'ACTIVE',
      creatorId: dummyUsers[0].id, // John Doe
      categoryIds: [categories[1].id], // Sports
      tagIds: [tags[2].id, tags[4].id, tags[1].id] // free, outdoor, beginner-friendly
    },
    {
      title: 'ডিজিটাল মার্কেটিং ওয়ার্কশপ',
      description: 'ছোট ব্যবসা এবং স্টার্টআপের জন্য ডিজিটাল মার্কেটিংয়ের মৌলিক বিষয়গুলি শিখুন।\n\nআলোচিত বিষয়:\n- সোশ্যাল মিডিয়া মার্কেটিং\n- গুগল অ্যাডসের মৌলিক বিষয়\n- ইমেইল মার্কেটিং\n- অ্যানালিটিক্স এবং ট্র্যাকিং\n- কন্টেন্ট তৈরির টিপস\n\nউদ্যোক্তা এবং মার্কেটিং শুরুকারীদের জন্য উপযুক্ত।',
      location: 'বিজনেস হাব, গুলশান',
      locationName: 'বিজনেস হাব',
      locationAddress: '32-43 47th st, Astoria NY 11103',
      locationLat: 40.7614,
      locationLng: -73.9176,
      locationPlaceId: 'ChIJExample8',
      startDate: new Date('2024-02-22T14:00:00Z'),
      endDate: new Date('2024-02-22T17:00:00Z'),
      maxCapacity: 25,
      isPublic: true,
      status: 'ACTIVE',
      creatorId: dummyUsers[1].id, // Jane Smith
      categoryIds: [categories[0].id, categories[3].id], // Technology, Education
      tagIds: [tags[3].id, tags[0].id] // workshop, networking
    },
    {
      title: 'সাপ্তাহিক বই ক্লাব মিটিং',
      description: 'আমাদের মাসিক বই ক্লাব আলোচনায় যোগ দিন! এই মাসে আমরা পাউলো কোয়েলহোর "দ্য অ্যালকেমিস্ট" পড়ছি।\n\nকী আশা করতে পারেন:\n- বই নিয়ে দলগত আলোচনা\n- চরিত্র বিশ্লেষণ\n- থিম অন্বেষণ\n- পরবর্তী বই নির্বাচন\n- চা এবং নাস্তা সরবরাহ\n\nঅনুগ্রহ করে অংশগ্রহণের আগে বইটি পড়ে আসুন।',
      location: 'ক্যাফে লিটেরাটি, ধানমন্ডি',
      locationName: 'ক্যাফে লিটেরাটি',
      locationAddress: '32-43 47th st, Astoria NY 11103',
      locationLat: 40.7614,
      locationLng: -73.9176,
      locationPlaceId: 'ChIJExample9',
      startDate: new Date('2024-02-24T15:00:00Z'),
      endDate: new Date('2024-02-24T17:00:00Z'),
      maxCapacity: 15,
      isPublic: true,
      status: 'ACTIVE',
      creatorId: dummyUsers[2].id, // Mike Wilson
      categoryIds: [categories[5].id], // Arts & Culture
      tagIds: [tags[2].id] // free
    },
    {
      title: 'সুস্বাস্থ্যকর রান্নার ওয়ার্কশপ',
      description: 'আপনার ব্যস্ত জীবনযাত্রার সাথে মানানসই পুষ্টিকর এবং স্বাদিষ্ট খাবার প্রস্তুত করতে শিখুন।\n\nআজকের মেনু:\n- কিনোয়া বুদ্ধ বোউল\n- সবুজ স্মুদির বিভিন্ন রেসিপি\n- ওভারনাইট ওটস\n- সুস্বাস্থ্যকর স্ন্যাক্স অপশন\n\nসব উপকরণ সরবরাহ করা হবে। রেসিপি কার্ড এবং মিল প্রেপ টিপস নিয়ে যান!',
      location: 'কুকিং স্টুডিও, উত্তরা',
      locationName: 'কুকিং স্টুডিও',
      locationAddress: '32-43 47th st, Astoria NY 11103',
      locationLat: 40.7614,
      locationLng: -73.9176,
      locationPlaceId: 'ChIJExample10',
      startDate: new Date('2024-02-28T10:00:00Z'),
      endDate: new Date('2024-02-28T13:00:00Z'),
      maxCapacity: 12,
      isPublic: true,
      status: 'ACTIVE',
      creatorId: dummyUsers[3].id, // Sarah Johnson
      categoryIds: [categories[4].id], // Food & Drink
      tagIds: [tags[3].id, tags[1].id] // workshop, beginner-friendly
    },
    {
      title: 'ফ্রিল্যান্সার মিটআপ ও নেটওয়ার্কিং',
      description: 'সহ ফ্রিল্যান্সারদের সাথে সংযোগ স্থাপন করুন, অভিজ্ঞতা ভাগাভাগি করুন এবং আপনার পেশাদার নেটওয়ার্ক গড়ে তুলুন।\n\nকর্মসূচি:\n- স্বাগত ও পরিচয়\n- প্যানেল আলোচনা: "আপনার ফ্রিল্যান্স ব্যবসা বিস্তার"\n- নেটওয়ার্কিং সেশন\n- রিসোর্স ভাগাভাগি\n- অভিজ্ঞ ফ্রিল্যান্সারদের সাথে প্রশ্নোত্তর\n\nআপনার ব্যবসায়িক কার্ড নিয়ে আসুন!',
      location: 'কো-ওয়ার্কিং স্পেস, বনানী',
      locationName: 'কো-ওয়ার্কিং স্পেস',
      locationAddress: '32-43 47th st, Astoria NY 11103',
      locationLat: 40.7614,
      locationLng: -73.9176,
      locationPlaceId: 'ChIJExample11',
      startDate: new Date('2024-03-02T18:30:00Z'),
      endDate: new Date('2024-03-02T21:00:00Z'),
      maxCapacity: 40,
      isPublic: true,
      status: 'ACTIVE',
      creatorId: dummyUsers[4].id, // Alex Brown
      categoryIds: [categories[2].id], // Social
      tagIds: [tags[0].id, tags[2].id] // networking, free
    },
    {
      title: 'সাপ্তাহিক হাইকিং অ্যাডভেঞ্চার',
      description: 'হাইকিং উৎসাহীদের সাথে ঢাকার আশেপাশের সুন্দর ট্রেইলগুলি অন্বেষণ করুন!\n\nবিস্তারিত:\n- মধ্যম অসুবিধার স্তর\n- দৃশ্যমান দৃশ্যসহ ৫ কিমি ট্রেইল\n- পেশাদার গাইড অন্তর্ভুক্ত\n- নিরাপত্তা সরঞ্জাম সরবরাহ\n- দুপুরের খাবার এবং পানীয় অন্তর্ভুক্ত\n\nআরামদায়ক হাইকিং জুতা পরুন এবং একটি ব্যাকপ্যাক নিয়ে আসুন।',
      location: 'সাভার পাহাড়, ঢাকা',
      locationName: 'সাভার পাহাড়',
      locationAddress: '32-43 47th st, Astoria NY 11103',
      locationLat: 40.7614,
      locationLng: -73.9176,
      locationPlaceId: 'ChIJExample12',
      startDate: new Date('2024-03-09T07:00:00Z'),
      endDate: new Date('2024-03-09T15:00:00Z'),
      maxCapacity: 18,
      isPublic: true,
      status: 'ACTIVE',
      creatorId: dummyUsers[5].id, // Lisa Davis
      categoryIds: [categories[1].id], // Sports
      tagIds: [tags[4].id] // outdoor
    }
  ];

  for (let i = 0; i < otherEventData.length; i++) {
    const data = otherEventData[i];
    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        locationName: data.locationName,
        locationAddress: data.locationAddress,
        locationLat: data.locationLat,
        locationLng: data.locationLng,
        locationPlaceId: data.locationPlaceId,
        startDate: data.startDate,
        endDate: data.endDate,
        maxCapacity: data.maxCapacity,
        isPublic: data.isPublic,
        status: data.status,
        creatorId: data.creatorId,
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
    otherUserEvents.push(event);
  }

  console.log('✅ Created events by other users:', otherUserEvents.map(e => e.title));

  // Add event participants for main user's events
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

  // Add participants to other users' events (including main user joining some)
  const otherEventParticipants = [
    { eventIndex: 0, userIds: [mainUser.id, dummyUsers[1].id, dummyUsers[2].id, dummyUsers[3].id] }, // Yoga - Main user joins
    { eventIndex: 1, userIds: [mainUser.id, dummyUsers[0].id, dummyUsers[2].id, dummyUsers[4].id] }, // Marketing - Main user joins
    { eventIndex: 2, userIds: [dummyUsers[0].id, dummyUsers[3].id, dummyUsers[4].id] }, // Book Club - Main user doesn't join
    { eventIndex: 3, userIds: [mainUser.id, dummyUsers[1].id, dummyUsers[4].id, dummyUsers[5].id] }, // Cooking - Main user joins
    { eventIndex: 4, userIds: [dummyUsers[0].id, dummyUsers[1].id, dummyUsers[2].id, dummyUsers[3].id] }, // Freelancer - Main user doesn't join
    { eventIndex: 5, userIds: [mainUser.id, dummyUsers[0].id, dummyUsers[1].id, dummyUsers[3].id] } // Hiking - Main user joins
  ];

  for (const { eventIndex, userIds } of otherEventParticipants) {
    for (const userId of userIds) {
      await prisma.eventParticipant.create({
        data: {
          eventId: otherUserEvents[eventIndex].id,
          userId,
          status: 'JOINED',
          joinedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random time in last 7 days
        }
      });
    }
  }

  console.log('✅ Added event participants');

  // Add images to all events (main user's events and other users' events)
  const allEvents = [...events, ...otherUserEvents];
  for (let i = 0; i < allEvents.length; i++) {
    const event = allEvents[i];
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

  console.log('✅ Added event images to all events');

  // Add comments to events
  const commentTexts = [
    "এটা দেখতে অসাধারণ লাগছে! অংশগ্রহণের জন্য অপেক্ষায় রইলাম 🎉",
    "দুর্দান্ত উদ্যোগ! এটি আয়োজনের জন্য ধন্যবাদ।",
    "এই ইভেন্টের জন্য কোনো পূর্বশর্ত আছে কি?",
    "আমি গত বারের অনুষ্ঠানে গিয়েছিলাম এবং এটি চমৎকার ছিল!",
    "নিখুঁত সময়, আমি ঠিক এরকম কিছু খুঁজছিলাম।",
    "ভেন্যুতে পার্কিং সুবিধা আছে কি?",
    "বর্ণনাটি খুবই বিস্তৃত শোনাচ্ছে। ভালো পরিকল্পনা!",
    "আমাকে গণনা করুন! এটি ঠিক যা আমার প্রয়োজন ছিল।",
    "কোনো ফলো-আপ সেশন থাকবে কি?",
    "এটি নতুনদের জন্য উপযুক্ত করার জন্য ধন্যবাদ!",
    "ভেন্যুটি এই ধরনের ইভেন্টের জন্য নিখুঁত মনে হচ্ছে।",
    "আমি একজন বন্ধুকে সাথে নিয়ে আসছি। আশা করি সমস্যা নেই!",
    "এটি আমার প্রথমবার অংশগ্রহণ। কোনো টিপস আছে?",
    "কর্মসূচিটি সুসংগঠিত দেখাচ্ছে। ভালো কাজ!",
    "নেটওয়ার্কিং সুযোগের জন্য উন্মুখ হয়ে আছি!"
  ];

  // Add comments to all events (including main user commenting on others' events)
  const allUsers = [mainUser, ...dummyUsers];
  
  for (let i = 0; i < allEvents.length; i++) {
    const event = allEvents[i];
    const commentCount = Math.floor(Math.random() * 8) + 3; // 3-10 comments per event
    
    for (let j = 0; j < commentCount; j++) {
      const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
      const randomText = commentTexts[Math.floor(Math.random() * commentTexts.length)];
      
      const comment = await prisma.comment.create({
        data: {
          eventId: event.id,
          authorId: randomUser.id,
          content: randomText,
          createdAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000) // Random time in last 14 days
        }
      });

      // Add random likes to comments (including main user liking comments)
      const likeCount = Math.floor(Math.random() * 4); // 0-3 likes per comment
      const likers = allUsers.slice(0, likeCount);
      
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
- Events: ${allEvents.length} (${events.length} by main user + ${otherUserEvents.length} by others)
- Follow relationships: ${followRelationships.length}
- Images: ~${allEvents.length * 3} (2-5 per event)
- Comments: ~${allEvents.length * 6} (3-10 per event)
- Comment likes: Various per comment

🎯 Main user: ${mainUser.name} (${mainUser.email})
- Follows: ${followRelationships.filter(f => f.followerId === mainUser.id).length} users
- Followers: ${followRelationships.filter(f => f.followingId === mainUser.id).length} users
- Created events: ${events.length}
- Joined events: 4 (Yoga, Marketing, Cooking, Hiking)
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
