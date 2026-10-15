const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const slugify = require("slugify");
require("dotenv").config({ path: __dirname + "/../.env" });

const User = require("../models/User");
const Category = require("../models/Category");
const City = require("../models/City");
const Venue = require("../models/Venue");
const Event = require("../models/Event");
const Registration = require("../models/Registration");

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eventoria";
    console.log("Connecting to Database:", mongoUri);
    await mongoose.connect(mongoUri);

    console.log("Clearing existing collections...");
    await User.deleteMany({});
    await Category.deleteMany({});
    await City.deleteMany({});
    await Venue.deleteMany({});
    await Event.deleteMany({});
    await Registration.deleteMany({});

    console.log("Creating Users...");
    const adminPassword = await bcrypt.hash("admin123", 10);
    const organizerPassword = await bcrypt.hash("organizer123", 10);
    const userPassword = await bcrypt.hash("user123", 10);

    const admin = await User.create({
      name: "System Administrator",
      email: "admin@eventoria.dz",
      password: adminPassword,
      role: "admin",
      phone: "+213 555 12 34 56"
    });

    const organizerTech = await User.create({
      name: "TechDZ Events",
      email: "organizer@eventoria.dz",
      password: organizerPassword,
      role: "organizer",
      phone: "+213 661 98 76 54",
      profileImage: "https://api.dicebear.com/7.x/initials/svg?seed=TDZ"
    });

    const organizerAgro = await User.create({
      name: "Agro Network Algeria",
      email: "agro@eventoria.dz",
      password: organizerPassword,
      role: "organizer",
      phone: "+213 658 22 11 00",
      profileImage: "https://api.dicebear.com/7.x/initials/svg?seed=ANA"
    });

    const userKader = await User.create({
      name: "Kader DZ",
      email: "user@eventoria.dz",
      password: userPassword,
      role: "user",
      phone: "+213 770 11 22 33"
    });

    const userSarah = await User.create({
      name: "Sarah Ben",
      email: "visitor@eventoria.dz",
      password: userPassword,
      role: "user",
      phone: "+213 791 44 55 66"
    });

    console.log("Creating Categories...");
    const catTech = await Category.create({ name: "Technology", slug: "technology", icon: "laptop", description: "Conferences, summits and meetups related to IT, Dev, Cyber and AI." });
    const catAgri = await Category.create({ name: "Agriculture", slug: "agriculture", icon: "wheat", description: "Agritech exhibitions and trade fairs showcasing local produce and tools." });
    const catStart = await Category.create({ name: "Startups", slug: "startups", icon: "rocket", description: "Incubator hackathons, networking events, pitch challenges, and funding." });
    const catEnergy = await Category.create({ name: "Energy & Renewables", slug: "energy-renewables", icon: "zap", description: "Solar power, green energy summits, petroleum and natural gas trade shows." });
    const catIndustry = await Category.create({ name: "Industry & Logistics", slug: "industry-logistics", icon: "factory", description: "Manufacturing, logistics, supply-chain and heavy industry fairs." });
    const catEdu = await Category.create({ name: "Education", slug: "education", icon: "graduation-cap", description: "University open days, training workshops, study abroad fairs." });
    const catCareers = await Category.create({ name: "Careers", slug: "careers", icon: "briefcase", description: "Job recruitment fairs, interview workshops, resume reviews." });
    const catConst = await Category.create({ name: "Construction & Real Estate", slug: "construction-realestate", icon: "hard-hat", description: "Building equipment expositions and housing investment shows." });

    console.log("Creating Cities...");
    const cityAlgiers = await City.create({
      name: "Algiers",
      slug: "algiers",
      description: "The capital city, hosting international events and national centers.",
      image: "https://images.unsplash.com/photo-1596120497556-9ef0f1712a0d?w=800&q=80"
    });
    const cityOran = await City.create({
      name: "Oran",
      slug: "oran",
      description: "Algeria's major commercial and coastal center.",
      image: "https://images.unsplash.com/photo-1540553016722-983e48a2cd10?w=800&q=80"
    });
    const cityConstantine = await City.create({
      name: "Constantine",
      slug: "constantine",
      description: "The City of Bridges, cultural and educational landmark.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
    });
    const cityAnnaba = await City.create({
      name: "Annaba",
      slug: "annaba",
      description: "Eastern industrial powerhouse and tourist harbor.",
      image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80"
    });
    const citySetif = await City.create({
      name: "Sétif",
      slug: "setif",
      description: "High plains economic center and manufacturing hub.",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"
    });

    console.log("Creating Venues...");
    const venueCIC = await Venue.create({
      name: "CIC - Centre International de Conférences",
      city: cityAlgiers._id,
      address: "Club des Pins, Algiers",
      description: "State-of-the-art conference complex of international scale.",
      capacity: 6000
    });
    const venueCCO = await Venue.create({
      name: "Centre des Conventions d'Oran (CCO)",
      city: cityOran._id,
      address: "Route de l'Aéroport, Oran",
      description: "Leading multi-purpose exhibition hall in West Algeria.",
      capacity: 5000
    });
    const venuePalais = await Venue.create({
      name: "Palais de la Culture Malek Haddad",
      city: cityConstantine._id,
      address: "Centre Ville, Constantine",
      description: "Historic cultural venue optimized for seminars and assemblies.",
      capacity: 1200
    });
    const venueSafex = await Venue.create({
      name: "SAFEX Exhibition Center",
      city: cityAlgiers._id,
      address: "Pins Maritimes, El Mohammadia, Algiers",
      description: "The largest national fairgrounds hosting major trade shows.",
      capacity: 20000
    });
    const venueSetifHotel = await Venue.create({
      name: "Park Mall Conference Center",
      city: citySetif._id,
      address: "Downtown Sétif",
      description: "Business hub suitable for professional training programs.",
      capacity: 800
    });

    console.log("Creating Events...");
    const eventsData = [
      {
        title: "Algeria Tech Summit 2026",
        shortDescription: "The biggest annual gathers of technology professionals and AI experts in Algiers.",
        description: "Join industry leaders, innovators, and software engineers at the premier tech conference in North Africa. We discuss artificial intelligence, cybersecurity, software architecture, cloud platforms, and local startup growth. Includes hands-on workshops and panels.",
        category: catTech._id,
        city: cityAlgiers._id,
        venue: venueCIC._id,
        organizer: organizerTech._id,
        startDate: new Date("2026-10-15T09:00:00Z"),
        endDate: new Date("2026-10-17T18:00:00Z"),
        startTime: "09:00",
        endTime: "18:00",
        eventType: "physical",
        coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
        registrationType: "internal",
        capacity: 1500,
        registrationDeadline: new Date("2026-10-10"),
        status: "published",
        isFeatured: true,
        views: 2450
      },
      {
        title: "AgriExpo Oran 2026",
        shortDescription: "International trade fair for agriculture technologies, crops and irrigation.",
        description: "AgriExpo Oran brings together local farmers, food processing firms, and international agricultural hardware suppliers. Discover eco-friendly crop methods, smart water irrigation pumps, and networking forums tailored to local food security goals.",
        category: catAgri._id,
        city: cityOran._id,
        venue: venueCCO._id,
        organizer: organizerAgro._id,
        startDate: new Date("2026-11-05T10:00:00Z"),
        endDate: new Date("2026-11-08T17:00:00Z"),
        startTime: "09:00",
        endTime: "17:00",
        eventType: "physical",
        coverImage: "https://images.unsplash.com/photo-1592982537447-6f2a6a0d2cbf?w=800&q=80",
        registrationType: "external",
        externalRegistrationLink: "https://agrialgeria.dz/register",
        capacity: 3000,
        registrationDeadline: new Date("2026-11-01"),
        status: "published",
        isFeatured: true,
        views: 1200
      },
      {
        title: "Constantine Startup Day",
        shortDescription: "Pitch competitions, panel talks, and funding meetups for young founders.",
        description: "Constantine Startup Day is a platform designed to accelerate local startup growth. Young university graduates pitch projects to local venture capitalists and angel investors, with panels led by successful Algerian startup founders.",
        category: catStart._id,
        city: cityConstantine._id,
        venue: venuePalais._id,
        organizer: organizerTech._id,
        startDate: new Date("2026-09-20T08:30:00Z"),
        endDate: new Date("2026-09-21T18:00:00Z"),
        startTime: "08:30",
        endTime: "18:00",
        eventType: "physical",
        coverImage: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80",
        registrationType: "internal",
        capacity: 400,
        registrationDeadline: new Date("2026-09-18"),
        status: "published",
        isFeatured: false,
        views: 890
      },
      {
        title: "Algeria Energy & Renewables Expo",
        shortDescription: "Leading solar energy, green tech and natural gas trade show at SAFEX.",
        description: "This premier energy event focuses on Algeria's transition towards solar energy power grids. Keynote speakers from national solar labs, Sonatrach engineers, and foreign investors present new equipment and strategies.",
        category: catEnergy._id,
        city: cityAlgiers._id,
        venue: venueSafex._id,
        organizer: organizerAgro._id,
        startDate: new Date("2026-12-10T09:00:00Z"),
        endDate: new Date("2026-12-12T18:00:00Z"),
        startTime: "09:00",
        endTime: "18:00",
        eventType: "hybrid",
        coverImage: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&q=80",
        registrationType: "none",
        capacity: 5000,
        status: "published",
        isFeatured: true,
        views: 1850
      },
      {
        title: "Algeria Build & Construction Fair",
        shortDescription: "A national gathering for architectural design, machinery, and urban planning.",
        description: "Connecting structural engineers, building materials manufacturers, and architectural designers. Features large pavilions showing modern cement tools, precast housing technology, and smart building sensors.",
        category: catConst._id,
        city: cityAlgiers._id,
        venue: venueSafex._id,
        organizer: organizerAgro._id,
        startDate: new Date("2026-09-28T09:00:00Z"),
        endDate: new Date("2026-10-02T18:00:00Z"),
        startTime: "09:00",
        endTime: "18:00",
        eventType: "physical",
        coverImage: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
        registrationType: "internal",
        capacity: 2000,
        status: "published",
        isFeatured: false,
        views: 650
      },
      {
        title: "Sétif Career Hack & Job Fair",
        shortDescription: "Explore careers in IT, logistics, and production sectors.",
        description: "A fast-paced networking environment bridging local trade schools, university seniors, and manufacturing businesses. Includes a CV review clinic, mock interviews, and live hiring sessions.",
        category: catCareers._id,
        city: citySetif._id,
        venue: venueSetifHotel._id,
        organizer: organizerTech._id,
        startDate: new Date("2026-11-20T09:00:00Z"),
        endDate: new Date("2026-11-21T16:00:00Z"),
        startTime: "09:00",
        endTime: "16:00",
        eventType: "physical",
        coverImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80",
        registrationType: "internal",
        capacity: 350,
        status: "published",
        isFeatured: false,
        views: 450
      },
      {
        title: "National AI Bootcamp for Students",
        shortDescription: "Intensive training on neural networks and local data resources.",
        description: "A hands-on workshop led by senior computer science professors. Learn TensorFlow basics, data pre-processing, and fine-tuning models. Perfect for university students starting their master projects.",
        category: catEdu._id,
        city: cityAlgiers._id,
        venue: venueCIC._id,
        organizer: organizerTech._id,
        startDate: new Date("2026-09-10T09:00:00Z"),
        endDate: new Date("2026-09-12T17:00:00Z"),
        startTime: "09:00",
        endTime: "17:00",
        eventType: "physical",
        coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
        registrationType: "internal",
        capacity: 200,
        status: "pending",
        isFeatured: false,
        views: 120
      },
      {
        title: "Industrial Manufacturing & Automation Forum",
        shortDescription: "Showcasing robotic lines, supply chains, and mechanical tooling.",
        description: "Bringing heavy manufacturing specialists together to discuss machine tools, automation, plc systems, and lean assembly lines. Essential for professionals aiming to digitize production floors.",
        category: catIndustry._id,
        city: cityOran._id,
        venue: venueCCO._id,
        organizer: organizerAgro._id,
        startDate: new Date("2026-12-15T09:00:00Z"),
        endDate: new Date("2026-12-17T17:00:00Z"),
        startTime: "09:00",
        endTime: "17:00",
        eventType: "physical",
        coverImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
        registrationType: "internal",
        capacity: 600,
        status: "draft",
        isFeatured: false,
        views: 0
      },
      {
        title: "Cybersecurity Defense Summit Algeria",
        shortDescription: "Protecting state networks, banking systems, and retail databases.",
        description: "Focusing on local cybersecurity policies, firewall implementations, intrusion detection systems, and response tactics against digital network espionage.",
        category: catTech._id,
        city: cityAlgiers._id,
        venue: venueCIC._id,
        organizer: organizerTech._id,
        startDate: new Date("2026-10-25T09:00:00Z"),
        endDate: new Date("2026-10-26T17:00:00Z"),
        startTime: "09:00",
        endTime: "17:00",
        eventType: "physical",
        coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
        registrationType: "internal",
        capacity: 500,
        status: "rejected",
        rejectionReason: "The descriptions and title do not comply with the venue safety limits during the scheduled dates.",
        isFeatured: false,
        views: 10
      },
      {
        title: "National Agritech Research Days",
        shortDescription: "Focusing on sustainable grain growing and dry soil cultivation solutions.",
        description: "Agronomists and researchers from national institutions discuss methods to improve grain yields in arid southern wilayas. Topics include soil chemistry and drone crop scouting.",
        category: catAgri._id,
        city: citySetif._id,
        venue: venueSetifHotel._id,
        organizer: organizerAgro._id,
        startDate: new Date("2026-11-12T09:00:00Z"),
        endDate: new Date("2026-11-13T17:00:00Z"),
        startTime: "09:00",
        endTime: "17:00",
        eventType: "physical",
        coverImage: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&q=80",
        registrationType: "internal",
        capacity: 150,
        status: "published",
        isFeatured: false,
        views: 310
      },
      {
        title: "Algeria Digital Job Fair 2026",
        shortDescription: "Virtual hiring event connecting remote tech companies and local developers.",
        description: "Skip the commute. Submit your applications, meet recruiters in secure online rooms, and participate in technical screening tests. Open to developers, UI/UX designers, and network engineers.",
        category: catCareers._id,
        city: cityAlgiers._id,
        venue: venueCIC._id,
        organizer: organizerTech._id,
        startDate: new Date("2026-09-05T09:00:00Z"),
        endDate: new Date("2026-09-06T18:00:00Z"),
        startTime: "09:00",
        endTime: "18:00",
        eventType: "online",
        coverImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80",
        registrationType: "internal",
        capacity: 1000,
        status: "published",
        isFeatured: false,
        views: 640
      },
      {
        title: "CleanTech Forum Algeria",
        shortDescription: "Discussing waste recycling, municipal water filtration, and solar designs.",
        description: "An annual meet-up for green startups and municipal environment officers to examine clean-tech solutions appropriate for Algerian urban centers.",
        category: catEnergy._id,
        city: cityConstantine._id,
        venue: venuePalais._id,
        organizer: organizerAgro._id,
        startDate: new Date("2026-10-08T09:00:00Z"),
        endDate: new Date("2026-10-09T17:00:00Z"),
        startTime: "09:00",
        endTime: "17:00",
        eventType: "physical",
        coverImage: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80",
        registrationType: "internal",
        capacity: 300,
        status: "published",
        isFeatured: false,
        views: 290
      }
    ];

    for (const eventData of eventsData) {
      await Event.create(eventData);
    }

    console.log("Seeding mock Registrations...");
    const techSummit = await Event.findOne({ title: "Algeria Tech Summit 2026" });
    const constantineStart = await Event.findOne({ title: "Constantine Startup Day" });

    await Registration.create({
      event: techSummit._id,
      user: userKader._id,
      ticketCode: "TKT-TECH-10928",
      status: "confirmed",
      registrationDate: new Date("2026-08-10")
    });

    await Registration.create({
      event: constantineStart._id,
      user: userKader._id,
      ticketCode: "TKT-START-49204",
      status: "confirmed",
      registrationDate: new Date("2026-08-12")
    });

    await Registration.create({
      event: techSummit._id,
      user: userSarah._id,
      ticketCode: "TKT-TECH-88291",
      status: "confirmed",
      registrationDate: new Date("2026-08-15")
    });

    console.log("Database Seeded Successfully!");
    return { success: true };
  } catch (err) {
    console.error("Seeder encountered error:", err);
    throw err;
  }
};

if (require.main === module) {
  seedDatabase().then(() => {
    mongoose.connection.close();
    process.exit(0);
  }).catch(() => {
    process.exit(1);
  });
}

module.exports = seedDatabase;
