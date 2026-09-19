import "./env.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { Payment } from "../models/payment.model.js";
import { Progress } from "../models/progress.model.js";
import { ReviewAndRating } from "../models/review&rating.model.js";
import { Certificate } from "../models/certification.model.js";
import { Notification } from "../models/notification.model.js";
import { Message } from "../models/message.model.js";
import { connDB } from "../db/index.js";

const sampleLectures = [
  {
    title: "01. Architecture Overview & System Design",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
    title: "02. Environment Setup & Project Boilerplate",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  {
    title: "03. Core Fundamentals & Hands-on Implementation",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
    title: "04. Advanced Patterns & Optimizations",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
  {
    title: "05. Real-World Deployment & Production Best Practices",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  },
];

async function seedDatabase() {
  try {
    console.log("🌱 Connecting to database...");
    await connDB();
    console.log("Connected to MongoDB successfully.");

    console.log("🧹 Cleaning existing test collections (preserving nothing for a clean state)...");
    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Lecture.deleteMany({}),
      Payment.deleteMany({}),
      Progress.deleteMany({}),
      ReviewAndRating.deleteMany({}),
      Certificate.deleteMany({}),
      Notification.deleteMany({}),
      Message.deleteMany({}),
    ]);
    console.log("Database cleared successfully.");

    // ─────────────────────────────────────────────────────────────
    // 1. Create Users
    // ─────────────────────────────────────────────────────────────
    console.log("👤 Creating Users (Admin, Instructors, Students)...");
    const hashedPassword = "password123";
    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 10);

    const adminUser = await User.create({
      name: process.env.ADMIN_NAME || "System Administrator",
      email: (process.env.ADMIN_EMAIL || "admin@lms.com").toLowerCase(),
      password: adminPassword,
      role: "admin",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    });

    const instructors = await User.create([
      {
        name: "Dr. Sarah Chen",
        email: "sarah.chen@instructor.com",
        password: hashedPassword,
        role: "instructor",
        photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      },
      {
        name: "Alex Rodriguez",
        email: "alex.rodriguez@instructor.com",
        password: hashedPassword,
        role: "instructor",
        photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
      },
      {
        name: "Emily Watson",
        email: "emily.watson@instructor.com",
        password: hashedPassword,
        role: "instructor",
        photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
      },
      {
        name: "Vikram Sharma",
        email: "vikram.sharma@instructor.com",
        password: hashedPassword,
        role: "instructor",
        photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
      },
    ]);

    const students = await User.create([
      {
        name: "John Doe",
        email: "john.doe@student.com",
        password: hashedPassword,
        role: "student",
        photoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      },
      {
        name: "Priya Patel",
        email: "priya.patel@student.com",
        password: hashedPassword,
        role: "student",
        photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      },
      {
        name: "Michael Brown",
        email: "michael.brown@student.com",
        password: hashedPassword,
        role: "student",
        photoUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      },
      {
        name: "Sophia Martinez",
        email: "sophia.martinez@student.com",
        password: hashedPassword,
        role: "student",
        photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
      },
      {
        name: "David Kim",
        email: "david.kim@student.com",
        password: hashedPassword,
        role: "student",
        photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      },
      {
        name: "Ananya Singh",
        email: "ananya.singh@student.com",
        password: hashedPassword,
        role: "student",
        photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      },
      {
        name: "Suspended Spammer",
        email: "blocked.user@student.com",
        password: hashedPassword,
        role: "student",
        isBlocked: true,
        blockReason: "Violation of community guidelines - spamming course discussions",
        blockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        blockedBy: adminUser._id,
      },
    ]);

    const [sarah, alex, emily, vikram] = instructors;
    const [john, priya, michael, sophia, david, ananya] = students;

    // ─────────────────────────────────────────────────────────────
    // 2. Create Courses & Lectures
    // ─────────────────────────────────────────────────────────────
    console.log("📚 Creating Courses and Lectures...");

    const courseConfigs = [
      {
        title: "Full-Stack MERN Architecture & Masterclass",
        subTitle: "Build scalable production-ready web apps with React 19, Node, Express & MongoDB",
        description: "Comprehensive end-to-end masterclass covering authentication, state management, REST APIs, WebSockets, payment gateways, and cloud deployment.",
        category: "web-development",
        price: 4999,
        level: "Advance",
        status: "approved",
        isPublished: true,
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80",
        instructor: sarah._id,
        enrolledStudents: [john._id, priya._id, david._id, michael._id],
        lectureCount: 5,
      },
      {
        title: "Mastering Data Structures & Algorithms with Java",
        subTitle: "Ace FAANG coding interviews with deep dive problem solving and optimization",
        description: "Master essential DSA patterns including Dynamic Programming, Graph Traversals, Trees, Heaps, and Bit Manipulation with 150+ solved challenges.",
        category: "data-structures-algorithms",
        price: 2999,
        level: "Moderate",
        status: "approved",
        isPublished: true,
        thumbnail: "https://images.unsplash.com/photo-1516116211227-bbc13c72b226?w=800&auto=format&fit=crop&q=80",
        instructor: vikram._id,
        enrolledStudents: [john._id, priya._id, sophia._id],
        lectureCount: 4,
      },
      {
        title: "Modern UI/UX Design Systems with Figma & Tailwind",
        subTitle: "From wireframes to production-ready scalable design tokens and components",
        description: "Learn user research, wireframing, interactive prototyping in Figma, and translating designs seamlessly into clean Tailwind CSS code.",
        category: "ui-ux-design",
        price: 1999,
        level: "Beginner",
        status: "approved",
        isPublished: true,
        thumbnail: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=80",
        instructor: emily._id,
        enrolledStudents: [michael._id, sophia._id, ananya._id],
        lectureCount: 4,
      },
      {
        title: "Cloud Native & Kubernetes Deployment on AWS",
        subTitle: "CI/CD pipelines, Docker containers, Helm charts, and AWS EKS orchestrations",
        description: "Master modern DevOps and Cloud architecture. Deploy highly available, secure, and auto-scaling microservices on Amazon Web Services.",
        category: "cloud-computing",
        price: 5499,
        level: "Advance",
        status: "approved",
        isPublished: true,
        thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
        instructor: alex._id,
        enrolledStudents: [michael._id, david._id],
        lectureCount: 4,
      },
      {
        title: "Applied Artificial Intelligence & Deep Learning",
        subTitle: "Build Neural Networks, Computer Vision, and LLM applications using PyTorch",
        description: "Deep dive into machine learning foundations, transformers, attention mechanisms, fine-tuning LLMs, and deploying AI models to production.",
        category: "artificial-intelligence",
        price: 6999,
        level: "Advance",
        status: "approved",
        isPublished: true,
        thumbnail: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80",
        instructor: sarah._id,
        enrolledStudents: [priya._id, sophia._id],
        lectureCount: 3,
      },
      {
        title: "Cross-Platform Mobile Apps with React Native & Expo",
        subTitle: "Build slick iOS and Android mobile apps from a single codebase",
        description: "Covers navigation, camera integrations, push notifications, offline storage, and publishing directly to App Store & Google Play Store.",
        category: "mobile-development",
        price: 3499,
        level: "Moderate",
        status: "pending",
        isPublished: false,
        thumbnail: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=800&auto=format&fit=crop&q=80",
        instructor: emily._id,
        enrolledStudents: [],
        lectureCount: 3,
      },
      {
        title: "Python for Automation, APIs & Web Scraping",
        subTitle: "Automate repetitive daily tasks, extract web data, and build FAST APIs",
        description: "Hands-on guide to BeautifulSoup, Selenium, Requests, Pandas, and building modern asynchronous APIs with FastAPI.",
        category: "programming",
        price: 1499,
        level: "Beginner",
        status: "draft",
        isPublished: false,
        thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=80",
        instructor: vikram._id,
        enrolledStudents: [],
        lectureCount: 2,
      },
      {
        title: "Legacy Monolith to Microservices Migration",
        subTitle: "Decomposing legacy architectures without downtime",
        description: "Strangler fig pattern, event-driven architectures, database per service, and distributed tracing.",
        category: "devops",
        price: 2499,
        level: "Advance",
        status: "rejected",
        rejectionReason: "Course syllabus is incomplete and audio quality in demo lectures does not meet requirements.",
        isPublished: false,
        thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
        instructor: alex._id,
        enrolledStudents: [],
        lectureCount: 2,
      },
    ];

    const createdCourses = [];

    for (const config of courseConfigs) {
      const { lectureCount, ...courseData } = config;
      const course = await Course.create(courseData);

      const lecturesToCreate = sampleLectures.slice(0, lectureCount).map((lec) => ({
        title: `${course.title.split(" ")[0]} - ${lec.title}`,
        videoUrl: lec.videoUrl,
        course: course._id,
      }));

      const createdLectures = await Lecture.insertMany(lecturesToCreate);
      course.lectures = createdLectures.map((l) => l._id);
      await course.save();

      createdCourses.push({
        course,
        lectures: createdLectures,
      });
    }

    const [cMern, cDsa, cUiUx, cCloud, cAi] = createdCourses;

    // ─────────────────────────────────────────────────────────────
    // 3. Update User enrolled courses
    // ─────────────────────────────────────────────────────────────
    console.log("📝 Updating student course enrollments...");
    await User.findByIdAndUpdate(john._id, {
      coursesEnrolledIn: [cMern.course._id, cDsa.course._id],
    });
    await User.findByIdAndUpdate(priya._id, {
      coursesEnrolledIn: [cMern.course._id, cDsa.course._id, cAi.course._id],
    });
    await User.findByIdAndUpdate(michael._id, {
      coursesEnrolledIn: [cMern.course._id, cUiUx.course._id, cCloud.course._id],
    });
    await User.findByIdAndUpdate(sophia._id, {
      coursesEnrolledIn: [cDsa.course._id, cUiUx.course._id, cAi.course._id],
    });
    await User.findByIdAndUpdate(david._id, {
      coursesEnrolledIn: [cMern.course._id, cCloud.course._id],
    });
    await User.findByIdAndUpdate(ananya._id, {
      coursesEnrolledIn: [cUiUx.course._id],
    });

    // ─────────────────────────────────────────────────────────────
    // 4. Create Student Progress
    // ─────────────────────────────────────────────────────────────
    console.log("📊 Creating Progress tracking records...");
    await Progress.insertMany([
      // John: 100% in MERN, 50% in DSA
      {
        userId: john._id,
        courseId: cMern.course._id,
        lecturesCompleted: cMern.lectures.map((l) => l._id),
      },
      {
        userId: john._id,
        courseId: cDsa.course._id,
        lecturesCompleted: [cDsa.lectures[0]._id, cDsa.lectures[1]._id],
      },
      // Priya: 60% in MERN, 25% in DSA, 0% in AI (not started)
      {
        userId: priya._id,
        courseId: cMern.course._id,
        lecturesCompleted: [cMern.lectures[0]._id, cMern.lectures[1]._id, cMern.lectures[2]._id],
      },
      {
        userId: priya._id,
        courseId: cDsa.course._id,
        lecturesCompleted: [cDsa.lectures[0]._id],
      },
      {
        userId: priya._id,
        courseId: cAi.course._id,
        lecturesCompleted: [],
      },
      // Michael: 100% in UI/UX, 50% in Cloud, 20% in MERN
      {
        userId: michael._id,
        courseId: cUiUx.course._id,
        lecturesCompleted: cUiUx.lectures.map((l) => l._id),
      },
      {
        userId: michael._id,
        courseId: cCloud.course._id,
        lecturesCompleted: [cCloud.lectures[0]._id, cCloud.lectures[1]._id],
      },
      {
        userId: michael._id,
        courseId: cMern.course._id,
        lecturesCompleted: [cMern.lectures[0]._id],
      },
      // Sophia: 100% in DSA, 50% in UI/UX, 33% in AI
      {
        userId: sophia._id,
        courseId: cDsa.course._id,
        lecturesCompleted: cDsa.lectures.map((l) => l._id),
      },
      {
        userId: sophia._id,
        courseId: cUiUx.course._id,
        lecturesCompleted: [cUiUx.lectures[0]._id, cUiUx.lectures[1]._id],
      },
      {
        userId: sophia._id,
        courseId: cAi.course._id,
        lecturesCompleted: [cAi.lectures[0]._id],
      },
      // David: 40% in MERN, 0% in Cloud
      {
        userId: david._id,
        courseId: cMern.course._id,
        lecturesCompleted: [cMern.lectures[0]._id, cMern.lectures[1]._id],
      },
      {
        userId: david._id,
        courseId: cCloud.course._id,
        lecturesCompleted: [],
      },
      // Ananya: 25% in UI/UX
      {
        userId: ananya._id,
        courseId: cUiUx.course._id,
        lecturesCompleted: [cUiUx.lectures[0]._id],
      },
    ]);

    // ─────────────────────────────────────────────────────────────
    // 5. Create Certificates
    // ─────────────────────────────────────────────────────────────
    console.log("🎓 Creating Certificates for completed courses...");
    await Certificate.insertMany([
      {
        certificateId: "CERT-MERN-89214",
        student: john._id,
        courseId: cMern.course._id,
        instructor: sarah._id,
        completionDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      },
      {
        certificateId: "CERT-UIUX-44120",
        student: michael._id,
        courseId: cUiUx.course._id,
        instructor: emily._id,
        completionDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      },
      {
        certificateId: "CERT-DSA-63109",
        student: sophia._id,
        courseId: cDsa.course._id,
        instructor: vikram._id,
        completionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    ]);

    // ─────────────────────────────────────────────────────────────
    // 6. Create Reviews & Ratings
    // ─────────────────────────────────────────────────────────────
    console.log("⭐ Creating Ratings & Reviews...");
    await ReviewAndRating.insertMany([
      {
        userId: john._id,
        courseId: cMern.course._id,
        rating: 5,
        review: "Exceptional MERN course! The real-world microservices, JWT auth, and WebSocket integration were total game changers.",
      },
      {
        userId: priya._id,
        courseId: cMern.course._id,
        rating: 5,
        review: "Super clean code structure and very clear explanation of backend patterns. Highly recommend to everyone!",
      },
      {
        userId: david._id,
        courseId: cMern.course._id,
        rating: 4,
        review: "Great real-world depth. The Redux Toolkit setup and component architecture were super helpful.",
      },
      {
        userId: john._id,
        courseId: cDsa.course._id,
        rating: 5,
        review: "The best DSA course in Java. Dynamic Programming and Graph algorithms finally clicked for me!",
      },
      {
        userId: sophia._id,
        courseId: cDsa.course._id,
        rating: 5,
        review: "Detailed dry runs and edge case handling. Helped me clear two technical interview rounds!",
      },
      {
        userId: michael._id,
        courseId: cUiUx.course._id,
        rating: 5,
        review: "Incredible UI/UX insights. The design system and Figma auto-layout modules alone are worth 10x the price.",
      },
      {
        userId: sophia._id,
        courseId: cUiUx.course._id,
        rating: 4,
        review: "Loved the hands-on design tokens and transition to React Tailwind code.",
      },
      {
        userId: michael._id,
        courseId: cCloud.course._id,
        rating: 5,
        review: "DevOps made straightforward with hands-on AWS EKS deployments and Helm charts.",
      },
      {
        userId: priya._id,
        courseId: cAi.course._id,
        rating: 5,
        review: "State of the art coverage of Deep Learning and Transformer models with PyTorch.",
      },
    ]);

    // ─────────────────────────────────────────────────────────────
    // 7. Create Payments (Spread across months for rich Analytics chart)
    // ─────────────────────────────────────────────────────────────
    console.log("💳 Creating Payment transactions (historical analytics data)...");

    const now = new Date();
    const monthsAgo = (m, days = 5) => {
      const d = new Date(now);
      d.setMonth(d.getMonth() - m);
      d.setDate(days);
      return d;
    };

    const paymentRecords = [
      // 5 months ago
      {
        userId: john._id,
        courseId: cMern.course._id,
        amount: 4999,
        currency: "INR",
        status: "paid",
        paymentMethod: "upi",
        receipt: "rcpt_mern_001",
        createdAt: monthsAgo(5, 10),
      },
      // 4 months ago
      {
        userId: priya._id,
        courseId: cMern.course._id,
        amount: 4999,
        currency: "INR",
        status: "paid",
        paymentMethod: "card",
        receipt: "rcpt_mern_002",
        createdAt: monthsAgo(4, 12),
      },
      {
        userId: john._id,
        courseId: cDsa.course._id,
        amount: 2999,
        currency: "INR",
        status: "paid",
        paymentMethod: "upi",
        receipt: "rcpt_dsa_001",
        createdAt: monthsAgo(4, 20),
      },
      // 3 months ago
      {
        userId: michael._id,
        courseId: cUiUx.course._id,
        amount: 1999,
        currency: "INR",
        status: "paid",
        paymentMethod: "card",
        receipt: "rcpt_uiux_001",
        createdAt: monthsAgo(3, 8),
      },
      {
        userId: sophia._id,
        courseId: cDsa.course._id,
        amount: 2999,
        currency: "INR",
        status: "paid",
        paymentMethod: "netbanking",
        receipt: "rcpt_dsa_002",
        createdAt: monthsAgo(3, 18),
      },
      {
        userId: priya._id,
        courseId: cDsa.course._id,
        amount: 2999,
        currency: "INR",
        status: "paid",
        paymentMethod: "upi",
        receipt: "rcpt_dsa_003",
        createdAt: monthsAgo(3, 25),
      },
      // 2 months ago
      {
        userId: michael._id,
        courseId: cCloud.course._id,
        amount: 5499,
        currency: "INR",
        status: "paid",
        paymentMethod: "card",
        receipt: "rcpt_cloud_001",
        createdAt: monthsAgo(2, 5),
      },
      {
        userId: sophia._id,
        courseId: cUiUx.course._id,
        amount: 1999,
        currency: "INR",
        status: "paid",
        paymentMethod: "upi",
        receipt: "rcpt_uiux_002",
        createdAt: monthsAgo(2, 14),
      },
      {
        userId: david._id,
        courseId: cMern.course._id,
        amount: 4999,
        currency: "INR",
        status: "paid",
        paymentMethod: "card",
        receipt: "rcpt_mern_003",
        createdAt: monthsAgo(2, 22),
      },
      // 1 month ago
      {
        userId: priya._id,
        courseId: cAi.course._id,
        amount: 6999,
        currency: "INR",
        status: "paid",
        paymentMethod: "upi",
        receipt: "rcpt_ai_001",
        createdAt: monthsAgo(1, 4),
      },
      {
        userId: michael._id,
        courseId: cMern.course._id,
        amount: 4999,
        currency: "INR",
        status: "paid",
        paymentMethod: "netbanking",
        receipt: "rcpt_mern_004",
        createdAt: monthsAgo(1, 15),
      },
      {
        userId: david._id,
        courseId: cCloud.course._id,
        amount: 5499,
        currency: "INR",
        status: "paid",
        paymentMethod: "upi",
        receipt: "rcpt_cloud_002",
        createdAt: monthsAgo(1, 27),
      },
      // Current month
      {
        userId: sophia._id,
        courseId: cAi.course._id,
        amount: 6999,
        currency: "INR",
        status: "paid",
        paymentMethod: "card",
        receipt: "rcpt_ai_002",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        userId: ananya._id,
        courseId: cUiUx.course._id,
        amount: 1999,
        currency: "INR",
        status: "paid",
        paymentMethod: "upi",
        receipt: "rcpt_uiux_003",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      // Failed payment record (for edge case testing)
      {
        userId: ananya._id,
        courseId: cMern.course._id,
        amount: 4999,
        currency: "INR",
        status: "failed",
        paymentMethod: "card",
        receipt: "rcpt_failed_001",
        failureReason: {
          code: "BAD_REQUEST_ERROR",
          description: "Transaction declined by issuing bank",
          reason: "insufficient_funds",
          paymentFailedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        },
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
    ];

    await Payment.insertMany(paymentRecords);

    // ─────────────────────────────────────────────────────────────
    // 8. Create Notifications
    // ─────────────────────────────────────────────────────────────
    console.log("🔔 Creating Notifications...");
    await Notification.insertMany([
      {
        recipient: sarah._id,
        type: "enrolledment_successful",
        title: "New Student Enrollment",
        message: "John Doe enrolled in your course Full-Stack MERN Architecture & Masterclass.",
        realtedCourse: cMern.course._id,
        isRead: true,
      },
      {
        recipient: sarah._id,
        type: "course_approved",
        title: "Course Approved",
        message: "Your course Applied Artificial Intelligence & Deep Learning has been approved by admin.",
        realtedCourse: cAi.course._id,
        isRead: false,
      },
      {
        recipient: emily._id,
        type: "course_submitted",
        title: "Course Under Review",
        message: "Your course Cross-Platform Mobile Apps with React Native is currently under admin review.",
        isRead: false,
      },
      {
        recipient: john._id,
        type: "course_completed",
        title: "Course Completed! 🎉",
        message: "Congratulations! You have completed Full-Stack MERN Architecture & Masterclass and your certificate is ready.",
        realtedCourse: cMern.course._id,
        isRead: false,
      },
      {
        recipient: adminUser._id,
        type: "course_submitted",
        title: "New Course Submission",
        message: "Emily Watson submitted a new course: Cross-Platform Mobile Apps with React Native & Expo.",
        isRead: false,
      },
    ]);

    // ─────────────────────────────────────────────────────────────
    // 9. Create Course Chat Messages
    // ─────────────────────────────────────────────────────────────
    console.log("💬 Creating Course Chat Messages...");
    await Message.insertMany([
      {
        course: cMern.course._id,
        sender: john._id,
        content: "Hello everyone! Excited to learn scalable MERN architecture here.",
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      },
      {
        course: cMern.course._id,
        sender: sarah._id,
        content: "Welcome John and everyone! Feel free to ask any architectural questions in this chat.",
        createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
      },
      {
        course: cMern.course._id,
        sender: priya._id,
        content: "Lecture 3 on WebSocket real-time rooms was brilliant Dr. Sarah! Thank you.",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        course: cMern.course._id,
        sender: sarah._id,
        content: "Glad you found it helpful Priya! Up next is production Redis caching.",
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
    ]);

    console.log("\n========================================================");
    console.log("✨ DATABASE SEEDING COMPLETED SUCCESSFULLY! ✨");
    console.log("========================================================");
    console.log("\n🔑 Demo Login Credentials (All passwords: 'password123' except Admin):");
    console.log("--------------------------------------------------------");
    console.log(`🛡️  ADMIN:`);
    console.log(`    Email:    ${adminUser.email}`);
    console.log(`    Password: ${process.env.ADMIN_PASSWORD || "admin123"}`);
    console.log(`\n👨‍🏫 INSTRUCTORS:`);
    console.log(`    1. Email: sarah.chen@instructor.com      | Password: password123`);
    console.log(`    2. Email: alex.rodriguez@instructor.com  | Password: password123`);
    console.log(`    3. Email: emily.watson@instructor.com    | Password: password123`);
    console.log(`    4. Email: vikram.sharma@instructor.com   | Password: password123`);
    console.log(`\n🎓 STUDENTS:`);
    console.log(`    1. Email: john.doe@student.com          | Password: password123 (Completed MERN + Certificate)`);
    console.log(`    2. Email: priya.patel@student.com       | Password: password123`);
    console.log(`    3. Email: michael.brown@student.com     | Password: password123 (Completed UI/UX + Certificate)`);
    console.log(`    4. Email: sophia.martinez@student.com   | Password: password123 (Completed DSA + Certificate)`);
    console.log(`    5. Email: david.kim@student.com         | Password: password123`);
    console.log(`    6. Email: ananya.singh@student.com      | Password: password123`);
    console.log(`    7. Email: blocked.user@student.com      | Password: password123 (Blocked Account test)`);
    console.log("========================================================\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error during database seeding:", error);
    process.exit(1);
  }
}

seedDatabase();
