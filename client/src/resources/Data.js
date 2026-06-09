import Icons from "@/utils/Icons";



export const StudentItems = [
  {
    title: "Dashboard",
    url: "/student/dashboard",
    icon: Icons.Home ,
  },
    {
    title: "Browse Courses",
    url: "/student/courses",
    icon: Icons.BookOpen,
  },
  {
    title: "My Courses",
    url: "/student/my-courses",
    icon: Icons.BookOpen,
  },
  {
    title: "Profile",
    url: "/student/profile",
    icon: Icons.User,
  },
  {
    title: "Settings",
    url: "/student/settings",
    icon: Icons.Settings,
  },
];


export const AdminItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: Icons.Home ,
  },
  {
    title: "Courses",
    url: "/admin/courses",
    icon: Icons.BookOpen,
  },
  {
    title: "Profile",
    url: "/admin/profile",
    icon: Icons.User,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Icons.Settings,
  },
];

export const InstructorItems = [
  {
    title: "Dashboard",
    url: "/instructor/dashboard",
    icon: Icons.Home ,
  },
  {
    title: "My Courses",
    url: "/instructor/my-courses",
    icon: Icons.BookOpen,
  },
    {
    title: "New Course",
    url: "/instructor/new-course",
    icon: Icons.BookOpen,
  },
]

// data/chartData.js

export const studentAnalytics = {
  title: "Student Growth",

  categories: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
  ],

  series: [
    {
      name: "Students",
      data: [120, 220, 310, 450, 520, 680],
    },
  ],
};

export const revenueAnalytics = {
  title: "Revenue Analytics",

  categories: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
  ],

  series: [
    {
      name: "Revenue",
      data: [12000, 18000, 25000, 32000, 40000, 52000],
    },
  ],
};



// data/courseTableData.js

export const courses = [
  {
    id: 1,
    name: "MERN Stack Mastery",
    price: 4999,
    status: "Published",
    students: 120,
  },
  {
    id: 2,
    name: "Java DSA Bootcamp",
    price: 2999,
    status: "Draft",
    students: 80,
  },
  {
    id: 3,
    name: "React Advanced",
    price: 3999,
    status: "Published",
    students: 200,
  },
];


export const courseCategories = [
  {
    value: "web-development",
    label: "Web Development",
  },
  {
    value: "mobile-development",
    label: "Mobile Development",
  },
  {
    value: "programming",
    label: "Programming",
  },
  {
    value: "data-structures-algorithms",
    label: "Data Structures & Algorithms",
  },
  {
    value: "database",
    label: "Database",
  },
  {
    value: "devops",
    label: "DevOps",
  },
  {
    value: "cloud-computing",
    label: "Cloud Computing",
  },
  {
    value: "cyber-security",
    label: "Cyber Security",
  },
  {
    value: "artificial-intelligence",
    label: "Artificial Intelligence",
  },
  {
    value: "machine-learning",
    label: "Machine Learning",
  },
  {
    value: "data-science",
    label: "Data Science",
  },
  {
    value: "ui-ux-design",
    label: "UI/UX Design",
  },
  {
    value: "software-testing",
    label: "Software Testing",
  },
  {
    value: "computer-science",
    label: "Computer Science",
  },
  {
    value: "personality-development",
    label: "Personality Development",
  },
  {
    value: "communication-skills",
    label: "Communication Skills",
  },
  {
    value: "career-development",
    label: "Career Development",
  },
];