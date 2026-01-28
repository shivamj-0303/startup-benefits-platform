// Note: all these are generated with the help of AI.


import { connectDB } from "../db/connect";
import { User } from "../models/user";
import { Deal } from "../models/deal";
import { Claim } from "../models/claim";
import bcrypt from "bcrypt";

async function safeDrop(model: any) {
  try {
    await model.collection.drop();
  } catch (err: any) {
    if (err && err.message && err.message.includes("ns not found")) return;
  }
}

async function run() {

  await connectDB();

  await safeDrop(User);
  await safeDrop(Deal);
  await safeDrop(Claim);

  console.log("Seeding: creating users and deals...");

  const plainPassword = "hashme";
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  const unverifiedUser = await User.create({
    email: "test@example.com",
    passwordHash,
    name: "Test User (Unverified)",
    isVerified: false,
  });
  console.log("✅ Created unverified user:", unverifiedUser.email);

  const verifiedUser = await User.create({
    email: "verified@example.com",
    passwordHash,
    name: "Verified User",
    isVerified: true,
  });
  console.log("✅ Created verified user:", verifiedUser.email, "- isVerified:", verifiedUser.isVerified);

  const dealsData = [
    {
      title: "AWS Cloud Credits - $5,000",
      slug: "aws-cloud-credits",
      description: "Get $5,000 in AWS cloud credits for your startup. Perfect for hosting, compute, storage, and scaling your infrastructure. Includes EC2, S3, RDS, and more.",
      partnerName: "Amazon Web Services",
      partnerUrl: "https://aws.amazon.com",
      category: "cloud",
      accessLevel: "public" as const,
      eligibility: "Startups less than 2 years old with less than $1M in funding",
      ctaText: "Claim Credits",
      ctaUrl: "https://aws.amazon.com/activate",
    },
    {
      title: "Google Cloud Platform - $10,000 Credits",
      slug: "gcp-credits",
      description: "Comprehensive Google Cloud credits for compute, storage, AI/ML services, and BigQuery. Accelerate your development with enterprise-grade infrastructure.",
      partnerName: "Google Cloud",
      partnerUrl: "https://cloud.google.com",
      category: "cloud",
      accessLevel: "locked" as const,
      eligibility: "Venture-backed startups or accelerator participants",
      ctaText: "Apply Now",
    },
    {
      title: "MongoDB Atlas Credits - $500",
      slug: "mongodb-atlas",
      description: "Cloud database credits for MongoDB Atlas. Scale your database effortlessly with automated backups, monitoring, and global clusters.",
      partnerName: "MongoDB",
      partnerUrl: "https://mongodb.com",
      category: "cloud",
      accessLevel: "public" as const,
      eligibility: "All startups",
      ctaText: "Claim Credits",
    },
    {
      title: "Microsoft Azure - $25,000 Credits",
      slug: "azure-startup-credits",
      description: "Enterprise-grade cloud computing with Azure credits. Includes AI services, DevOps tools, and global infrastructure.",
      partnerName: "Microsoft Azure",
      partnerUrl: "https://azure.microsoft.com",
      category: "cloud",
      accessLevel: "locked" as const,
      eligibility: "Series A+ startups or Microsoft partner network members",
      ctaText: "Apply for Credits",
    },
    {
      title: "DigitalOcean Startup Credits - $1,000",
      slug: "digitalocean-credits",
      description: "Simple cloud hosting with droplets, managed databases, and Kubernetes. Perfect for developer-focused startups.",
      partnerName: "DigitalOcean",
      partnerUrl: "https://digitalocean.com",
      category: "cloud",
      accessLevel: "public" as const,
      eligibility: "All startups",
      ctaText: "Get Started",
    },

    {
      title: "GitHub Enterprise - Free for 1 Year",
      slug: "github-enterprise",
      description: "Advanced collaboration, security scanning, and compliance features for your development team. Includes advanced security, insights, and enterprise support.",
      partnerName: "GitHub",
      partnerUrl: "https://github.com",
      category: "development",
      accessLevel: "locked" as const,
      eligibility: "Teams of 5+ developers",
      ctaText: "Apply Now",
    },
    {
      title: "Vercel Pro - 12 Months Free",
      slug: "vercel-pro-startup",
      description: "Deploy your Next.js, React, or Vue apps with zero configuration. Includes serverless functions, analytics, and custom domains.",
      partnerName: "Vercel",
      partnerUrl: "https://vercel.com",
      category: "development",
      accessLevel: "public" as const,
      eligibility: "All startups building web applications",
      ctaText: "Claim Pro Plan",
    },
    {
      title: "JetBrains All Products Pack - Free",
      slug: "jetbrains-startup",
      description: "Access to all JetBrains IDEs including IntelliJ IDEA, PyCharm, WebStorm, and more for your entire team.",
      partnerName: "JetBrains",
      partnerUrl: "https://jetbrains.com",
      category: "development",
      accessLevel: "public" as const,
      eligibility: "Startups less than 5 years old, less than $5M funding",
      ctaText: "Apply for License",
    },
    {
      title: "Postman Enterprise - 6 Months Free",
      slug: "postman-enterprise",
      description: "API development platform with collaboration tools, automated testing, and documentation. Enterprise features included.",
      partnerName: "Postman",
      partnerUrl: "https://postman.com",
      category: "development",
      accessLevel: "locked" as const,
      eligibility: "Engineering teams of 10+ members",
      ctaText: "Get Enterprise",
    },
    {
      title: "GitLab Ultimate - 12 Months Free",
      slug: "gitlab-ultimate",
      description: "Complete DevOps platform with CI/CD, security scanning, and project management. Self-hosted or cloud options.",
      partnerName: "GitLab",
      partnerUrl: "https://gitlab.com",
      category: "development",
      accessLevel: "public" as const,
      eligibility: "Development teams",
      ctaText: "Claim Ultimate",
    },

    {
      title: "Figma Professional - 50% Off",
      slug: "figma-pro-discount",
      description: "Collaborative design tool with unlimited files, advanced prototyping, and design systems. Perfect for remote teams.",
      partnerName: "Figma",
      partnerUrl: "https://figma.com",
      category: "design",
      accessLevel: "public" as const,
      eligibility: "Design teams at startups",
      ctaText: "Get Deal",
    },
    {
      title: "Adobe Creative Cloud - 60% Off",
      slug: "adobe-creative-cloud",
      description: "Full access to Photoshop, Illustrator, XD, Premiere Pro, and entire Adobe suite at massive startup discount.",
      partnerName: "Adobe",
      partnerUrl: "https://adobe.com",
      category: "design",
      accessLevel: "locked" as const,
      eligibility: "Funded startups with design teams",
      ctaText: "Apply for Discount",
    },
    {
      title: "Canva Pro - Free for 1 Year",
      slug: "canva-pro-startup",
      description: "Easy-to-use design platform for social media, presentations, and marketing materials. Brand kit included.",
      partnerName: "Canva",
      partnerUrl: "https://canva.com",
      category: "design",
      accessLevel: "public" as const,
      eligibility: "All startups",
      ctaText: "Get Canva Pro",
    },

    {
      title: "Notion Pro - Free for 1 Year",
      slug: "notion-pro",
      description: "All-in-one workspace for notes, docs, wikis, and project management. Unlimited blocks and file uploads for your entire team.",
      partnerName: "Notion",
      partnerUrl: "https://notion.so",
      category: "productivity",
      accessLevel: "public" as const,
      eligibility: "Early-stage startups",
      ctaText: "Get Started",
    },
    {
      title: "Slack Business+ - 50% Off",
      slug: "slack-business",
      description: "Team communication platform with advanced security, compliance exports, and 24/7 support for growing teams.",
      partnerName: "Slack",
      partnerUrl: "https://slack.com",
      category: "productivity",
      accessLevel: "locked" as const,
      eligibility: "Teams of 25+ members",
      ctaText: "Apply Now",
    },
    {
      title: "Airtable Pro - 6 Months Free",
      slug: "airtable-pro",
      description: "Flexible database and spreadsheet hybrid for project management, CRM, and workflow automation.",
      partnerName: "Airtable",
      partnerUrl: "https://airtable.com",
      category: "productivity",
      accessLevel: "public" as const,
      eligibility: "All startups",
      ctaText: "Claim Pro Plan",
    },

    {
      title: "HubSpot for Startups - 90% Off",
      slug: "hubspot-startups",
      description: "Complete CRM, marketing automation, sales tools, and customer service platform. Includes email marketing, landing pages, and analytics.",
      partnerName: "HubSpot",
      partnerUrl: "https://hubspot.com",
      category: "marketing",
      accessLevel: "locked" as const,
      eligibility: "Funded startups (Seed+) associated with partner networks",
      ctaText: "Apply",
    },
    {
      title: "Mailchimp - 50% Off Annual Plan",
      slug: "mailchimp-discount",
      description: "Email marketing platform with automation, audience segmentation, and analytics. Build professional campaigns in minutes.",
      partnerName: "Mailchimp",
      partnerUrl: "https://mailchimp.com",
      category: "marketing",
      accessLevel: "public" as const,
      eligibility: "All startups",
      ctaText: "Claim Discount",
    },

    {
      title: "Intercom Startup Program - 95% Off",
      slug: "intercom-startup",
      description: "Customer messaging platform with live chat, bots, and product tours. Engage users at every stage of their journey.",
      partnerName: "Intercom",
      partnerUrl: "https://intercom.com",
      category: "support",
      accessLevel: "locked" as const,
      eligibility: "Early-stage startups (less than 2 years old)",
      ctaText: "Apply",
    },
    {
      title: "Zendesk Startup Program - $10,000 Credits",
      slug: "zendesk-startup",
      description: "Customer support ticketing system with help desk, knowledge base, and analytics tools.",
      partnerName: "Zendesk",
      partnerUrl: "https://zendesk.com",
      category: "support",
      accessLevel: "public" as const,
      eligibility: "Startups under 5 years old",
      ctaText: "Get Credits",
    },

    {
      title: "Stripe Atlas - $100 Off",
      slug: "stripe-atlas-discount",
      description: "Launch your US business entity with Stripe Atlas. Includes Delaware C-corp formation, IRS tax ID, bank account, and legal templates.",
      partnerName: "Stripe",
      partnerUrl: "https://stripe.com/atlas",
      category: "legal",
      accessLevel: "public" as const,
      eligibility: "First-time founders anywhere in the world",
      ctaText: "Learn More",
    },
    {
      title: "Clerky Standard Package - 50% Off",
      slug: "clerky-startup-discount",
      description: "Startup legal documents and incorporation services. Safe, simple, and affordable legal paperwork for founders.",
      partnerName: "Clerky",
      partnerUrl: "https://clerky.com",
      category: "legal",
      accessLevel: "public" as const,
      eligibility: "US-based startups",
      ctaText: "Get Discount",
    },
  ];

  const deals = await Deal.insertMany(dealsData);
  console.log(` Created ${deals.length} deals`);
  console.log("   Categories:", [...new Set(deals.map(d => d.category))].join(", "));
  console.log("   Access levels:", deals.filter(d => d.accessLevel === "public").length, "public,", deals.filter(d => d.accessLevel === "locked").length, "locked");

  try {
    await User.create({
      email: "test@example.com",
      passwordHash: "hashme2",
      name: "Duplicate User",
    });
    console.error("Error: duplicate email insertion did NOT fail as expected");
  } catch (err: any) {
    console.log("Duplicate email test: failed as expected ->", err.message.split("\n")[0]);
  }

  const claim = await Claim.create({ userId: unverifiedUser._id, dealId: deals[0]._id });
  console.log("Created claim id:", claim.id, "status:", claim.status);

  try {
    await Claim.create({ userId: unverifiedUser._id, dealId: deals[0]._id });
    console.error("Error: duplicate claim insertion did NOT fail as expected");
  } catch (err: any) {
    console.log("Duplicate claim test: failed as expected ->", err.message.split("\n")[0]);
  }

  console.log("\n🎉 Demo seeding completed successfully!");
  console.log("\nTest users created:");
  console.log("  - test@example.com (unverified, password: hashme)");
  console.log("  - verified@example.com (verified, password: hashme)");
  process.exit(0);
}

run().catch((err) => {
  console.error("Seed script failed:", err);
  process.exit(1);
});
