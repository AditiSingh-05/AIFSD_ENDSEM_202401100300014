const Employee = require("../models/Employee");

const sampleEmployees = [
  {
    name: "Aman Verma",
    email: "aman.verma@example.com",
    department: "Development",
    skills: ["React", "Node.js", "MongoDB"],
    performanceScore: 85,
    experience: 3
  },
  {
    name: "Priya Singh",
    email: "priya.singh@example.com",
    department: "HR",
    skills: ["Recruitment", "Communication", "Onboarding"],
    performanceScore: 72,
    experience: 5
  },
  {
    name: "Rohit Sharma",
    email: "rohit.sharma@example.com",
    department: "Marketing",
    skills: ["SEO", "Content", "Analytics"],
    performanceScore: 68,
    experience: 4
  },
  {
    name: "Neha Gupta",
    email: "neha.gupta@example.com",
    department: "Development",
    skills: ["React", "TypeScript", "AWS"],
    performanceScore: 92,
    experience: 6
  },
  {
    name: "Vikram Patel",
    email: "vikram.patel@example.com",
    department: "Sales",
    skills: ["Salesforce", "Negotiation", "CRM"],
    performanceScore: 75,
    experience: 7
  },
  {
    name: "Sneha Iyer",
    email: "sneha.iyer@example.com",
    department: "Design",
    skills: ["Figma", "UI/UX", "Prototyping"],
    performanceScore: 81,
    experience: 4
  },
  {
    name: "Arjun Mehta",
    email: "arjun.mehta@example.com",
    department: "Development",
    skills: ["Node.js", "Express", "MongoDB"],
    performanceScore: 69,
    experience: 2
  },
  {
    name: "Pooja Nair",
    email: "pooja.nair@example.com",
    department: "HR",
    skills: ["HRIS", "Onboarding", "Policy"],
    performanceScore: 63,
    experience: 3
  }
];

async function seedEmployees() {
  const count = await Employee.countDocuments();
  if (count > 0) return;
  await Employee.insertMany(sampleEmployees);
  console.log("Sample employees seeded");
}

module.exports = { seedEmployees, sampleEmployees };
