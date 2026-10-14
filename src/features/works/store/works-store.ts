import type Work from "../models/work";
import type { WorkCard } from "../models/work";

export const workCards: WorkCard[] = [
  {
    slug: "northeast-auto-creations",
    title: "Northeast Auto Creations",
    description:
      "Built to accommodate a business that had outgrown the boundaries of a conventional workshop website, bringing services, products, vehicle listings, and bookings together under one brand.",
    image: {
      slug: "northeast-auto-creations-card",
      url: "/works/northeast-auto-creations/image-1.png",
      alt: "Northeast Auto Creations website preview",
      caption: "Northeast Auto Creations brand preview",
      title: "Northeast Auto Creations",
      description:
        "A custom automotive shop website designed to highlight its services, portfolio, and expertise in vehicle customization.",
      width: 512,
      height: 384,
    },
  },
  {
    slug: "iron-core",
    title: "IronCore Fitness",
    description:
      "IronCore's website was built the same way they build strength: one deliberate choice at a time, with nothing left to chance.",
    image: {
      slug: "iron-core-card",
      url: "/works/iron-core/image-1.png",
      alt: "IronCore Fitness hero preview",
      caption: "IronCore Fitness brand preview",
      title: "IronCore Fitness",
      description:
        "A gym brand experience built around clarity, confidence, and disciplined transformation.",
      width: 512,
      height: 384,
    },
  },
];

export const works: Work[] = [
  {
    slug: "travel-mitra",
    metadata: {
      title: "Travel Mitra Operation Management System | Abhisek",
      description:
        "Explore a custom web application built for Travel Mitra to manage vehicles, drivers, bookings, duty slips, expenses, payments, and operational reports.",
    },
    title: "Travel Mitra",
    description:
      "A Custom Web Application built for the internal operations of a travel agency that owns no vehicles. The system brings a scattered network of owners, drivers and bookings into one place where the work can actually be managed.",
    sectors: [
      "Travel & Tourism",
      "Travel Agency Operations",
      "Fleet Management",
      "Business Operations Management",
    ],
    contents: [
      "Travel Mitra sits between independent owners, drivers, and the people who book trips. That arrangement keeps the business flexible, but it also multiplies the moving parts. As trip volume grew, the real problem wasn't the work itself; it was coordination: which vehicle belonged to whom, which driver was free, what pricing applied to a given owner, how much fuel had been used, whether a payment had cleared. That information lived in scattered notebooks, spreadsheets and phone calls and staff spent more time chasing it down than acting on it.",
      "The company already knew how to run the business. What it lacked was a single, reliable place to hold that work. So the goal was never a generic booking tool; it was a system shaped around how Travel Mitra actually operates, trip after trip.",
      "At its core are the people and assets that keep operations moving. Owners are registered with contact details, bank information, and verification records, so the fleet stays organized rather than scattered across memory. Each vehicle holds its own pricing: daily rate, per-kilometer charge, night halt fee, fuel cost because no two owners price the same way, and a fixed structure would break on contact with reality. Drivers are linked directly to their vehicles, removing the back-and-forth when assignments shift at short notice. Pre-bookings lock in trips ahead of the rush. Duty slips replace the paper trail entirely vehicle, driver, customer, timing, kilometers, charges, penalties, tolls, all in one record. Payments and fuel entries stay tied to the right trip and the right person, so what was spent and what was paid is never in question. Search and reports surface any of this in seconds.",
      "The system was designed around Travel Mitra’s existing workflow and what worked best for the team rather than forcing them into a predefined structure. A key challenge was choosing between a desktop and web application. We chose web because a single server could make the system accessible across devices through a browser, while keeping development and maintenance costs lower. The trade-offs more frequent server calls, less client-side processing, and a slightly lighter UX were acceptable for the business's requirements.",
      "The result is steady. Less time spent chasing information, cleaner settlements for owners, better service for customers and a team that can scale trip volume without scaling headcount at the same rate. This is not software built for a market. It's a tool built for one company's way of working, so that work stays visible as it grows.",
    ],
    featuredVideo: {
      slug: "travel-mitra-featured-video",
      url: "/works/travel-mitra/video.mp4",
      alt: "Travel Mitra management system walkthrough showing the dashboard, vehicle records, people management, pre-booked trips, duty slips, expenses, payments, and operational reports.",
      caption:
        "A walkthrough of the custom management system built around Travel Mitra's travel and fleet operations.",
      transcript:
        "The video opens with a title card introducing the problem of manual paperwork, followed by Travel Mitra branding. The administrative dashboard appears, presenting summary counts for vehicles, drivers, owners, and bookings, along with recent bookings, daily travel activity, and shortcuts for common operations. The walkthrough moves to fleet management, showing registered vehicles and their associated information, including vehicle-specific pricing details. The People menu then introduces records for owners, drivers, employees, and fuel providers. The video continues through pre-booked trips and duty-slip management, showing how scheduled travel and trip-related records are organized within the system. Additional screens demonstrate owner records, fuel expenses, spending information, and payment management. The presentation concludes by showcasing multiple report templates for different business purposes, including monthly vehicle reports, duty slips, and reports covering vehicle usage, expenses, fuel, and payable amounts.",
      title: "Travel Mitra Management System Showcase",
      description:
        "A visual walkthrough of a custom web application developed for Travel Mitra's internal operations. The video showcases the administrative dashboard, vehicle and people management, pre-booked trips, duty slips, fuel expenses, spending records, payment tracking, and operational report templates.",
      thumbnail: {
        slug: "travel-mitra-video-thumbnail",
        url: "/works/travel-mitra/image-1.png",
        alt: "Travel Mitra administrative dashboard displaying vehicle, driver, owner, and booking summaries in a navy-and-white interface.",
        caption:
          "Travel Mitra's centralized dashboard for monitoring travel operations.",
        title: "Travel Mitra Management System Preview",
        description:
          "A preview of the custom management system developed for Travel Mitra, featuring its administrative dashboard and summary cards for vehicles, drivers, owners, and bookings.",
        width: 1440,
        height: 810,
      },
      duration: 54,
      uploadedAt: new Date("2026-09-30T00:00:00.000Z"),
    },
    gallery: [
      {
        slug: "travel-mitra-gallery-1",
        url: "/works/travel-mitra/image-1.png",
        alt: "Travel Mitra administrative dashboard showing vehicle, driver, owner, and booking summaries, recent activity sections, and shortcuts for common operations.",
        caption:
          "Travel Mitra dashboard for monitoring fleet records, bookings, and daily travel operations.",
        title: "Travel Mitra Administrative Dashboard",
        description:
          "An overview of the Travel Mitra management dashboard, featuring vehicle, driver, owner, and booking statistics, recent bookings, daily travel activity, and shortcuts for common administrative tasks.",
        width: 1440,
        height: 810,
      },
      {
        slug: "travel-mitra-gallery-2",
        url: "/works/travel-mitra/image-2.png",
        alt: "Travel Mitra management interface collage showing daily duty slips, booking records, vehicle owner profiles, and administrative dashboard screens.",
        caption:
          "A unified interface for managing bookings, duty slips, and vehicle owner records.",
        title: "Travel Mitra Booking and Duty Slip Management",
        description:
          "A visual overview of Travel Mitra's administrative interface, highlighting daily duty slip records, booking information, vehicle owner management, and dashboard elements used to coordinate travel operations.",
        width: 1440,
        height: 810,
      },
      {
        slug: "travel-mitra-gallery-3",
        url: "/works/travel-mitra/image-3.png",
        alt: "Travel Mitra application login screen featuring email and password fields alongside a photograph of an office workspace.",
        caption:
          "Application login experience with Travel Mitra branding and a dedicated sign-in interface.",
        title: "Travel Mitra Application Login Interface",
        description:
          "A preview of the Travel Mitra application's login screen, combining brand identity, an email and password form, account recovery links, and an office workspace photograph.",
        width: 1440,
        height: 810,
      },
      {
        slug: "travel-mitra-gallery-4",
        url: "/works/travel-mitra/image-4.png",
        alt: "Travel Mitra vehicle owners management screen displaying owner profiles, contact information, verification controls, bank details, and edit and delete actions.",
        caption:
          "Vehicle owner records organized into searchable profile cards with verification and account management controls.",
        title: "Travel Mitra Vehicle Owner Management",
        description:
          "A vehicle owner management interface featuring searchable owner records, contact and address details, expandable bank information, verification actions, and controls for editing or removing records.",
        width: 1440,
        height: 810,
      },
      {
        slug: "travel-mitra-gallery-5",
        url: "/works/travel-mitra/image-5.png",
        alt: "Travel Mitra fleet management screen displaying vehicle records, registration numbers, vehicle types, assigned owners and drivers, and operational pricing details.",
        caption:
          "Fleet records with vehicle assignments, rental rates, and vehicle-specific pricing information.",
        title: "Travel Mitra Fleet Management Interface",
        description:
          "A fleet management interface showing vehicle registration details, vehicle categories, assigned owners and drivers, and pricing information such as per-kilometer rates, daily rent, night halt charges, and other operational fees.",
        width: 1440,
        height: 810,
      },
      {
        slug: "travel-mitra-gallery-6",
        url: "/works/travel-mitra/image-6.png",
        alt: "Travel Mitra report templates showing a monthly vehicle report, a daily duty slip, and an on-access vehicle report with trip, expense, fuel, and payment details.",
        caption:
          "Multiple report templates for vehicle operations, duty slips, expenses, and trip records.",
        title: "Travel Mitra Operational Report Templates",
        description:
          "A presentation of three report formats used for travel and fleet operations: a monthly vehicle report, a daily duty slip, and an on-access vehicle report. The templates organize trip information, vehicle charges, expenses, fuel records, and payable amounts.",
        width: 1440,
        height: 810,
      },
    ],
    clients: [
      {
        name: "Travel Mitra",
      },
    ],
    partners: [],
    teamMembers: [],
    collaborators: [],

    faqs: [
      {
        question: "Why did Travel Mitra need a custom management system?",
        answer:
          "Travel Mitra coordinates trips using vehicles owned by independent vehicle owners rather than maintaining its own fleet. As trip volume grew, vehicle details, driver assignments, pricing, fuel usage, and payment information became harder to coordinate because they were spread across notebooks, spreadsheets, and phone calls. A custom system brought these operational records together in one place.",
      },
      {
        question:
          "How does the system manage vehicles owned by different people?",
        answer:
          "Each vehicle has its own record linked to its owner and assigned driver. The system also accommodates individual pricing arrangements, including per-kilometer rates, daily rent, night-halt fees, fuel costs, and other applicable charges. This lets Travel Mitra manage a varied network of independently owned vehicles without imposing one fixed pricing structure.",
      },
      {
        question:
          "How does Travel Mitra organize vehicle owners and their information?",
        answer:
          "Owner records bring contact details, banking information, and verification records into the management system. Keeping these details alongside the associated vehicle information makes owner records easier to access and helps support clearer financial settlements.",
      },
      {
        question:
          "How does the system handle driver assignments and upcoming trips?",
        answer:
          "Drivers are linked directly to vehicle records, helping staff identify the driver associated with a vehicle when assignments change. The pre-booking feature records upcoming trips in advance, giving the team a place to organize scheduled travel requirements before the day of the journey.",
      },
      {
        question: "What information can a duty slip contain?",
        answer:
          "A duty slip brings the key details of a trip into one record, including the vehicle, driver, customer, timings, kilometers, charges, penalties, and tolls. This replaces scattered paper records with structured digital information that staff can access and manage within the application.",
      },
      {
        question:
          "Can the system track fuel expenses and payments alongside trip records?",
        answer:
          "Yes. The application includes fuel expense records, spending records, and payment management. These features help the team keep track of what was spent and paid, connecting operational activity with the financial information needed for clearer settlements.",
      },
      {
        question:
          "How does the system accommodate different vehicle rates and charges?",
        answer:
          "Instead of applying one standard rate to every vehicle, the system supports vehicle-specific pricing. Depending on the arrangement, this can include per-kilometer charges, daily rent, night-halt fees, base prices, overtime rates, lubricant costs, and other applicable charges.",
      },
      {
        question: "What reports can be generated from the system?",
        answer:
          "The project includes multiple report formats for different operational needs, including monthly vehicle reports, duty-slip documents, and reports covering vehicle usage, expenses, fuel, and payable amounts. These formats help present operational and financial records in a more structured form.",
      },
      {
        question:
          "Why was a web application chosen instead of a desktop application?",
        answer:
          "A web application allows the team to access the system through a browser across devices while using a single server. This approach was selected to keep development and maintenance costs lower. The project accepted trade-offs such as more frequent server requests and less client-side processing because they were suitable for the business's requirements.",
      },
      {
        question: "How does the system help Travel Mitra handle more trips?",
        answer:
          "By making vehicle, owner, driver, booking, expense, and payment information easier to find and manage, the system reduces time spent chasing records and coordinating details manually. The intended outcome is cleaner owner settlements, better service for customers, and the ability to manage a higher volume of trips without increasing administrative effort at the same rate.",
      },
    ],

    postedAt: new Date("2026-09-30T00:00:00.000Z"),
    lastModifiedAt: new Date("2026-09-30T00:00:00.000Z"),
  },
  {
    slug: "northeast-auto-creations",
    metadata: {
      title: "Northeast Auto Creations Website | Abhisek",
      description:
        "A digital experience for Northeast Auto Creations, bringing vehicles, automotive products, services, packages, bookings, and online payments together.",
    },
    title: "Northeast Auto Creations",
    description:
      "Built to accommodate a business that had outgrown the boundaries of a conventional workshop website, bringing services, products, vehicle listings, and bookings together under one brand.",
    sectors: [
      "Business Website",
      "Automotive",
      "Automotive Services",
      "Automotive Retail",
    ],
    contents: [
      "Northeast Auto Creations had built a solid presence as a multi-brand car workshop in Lalmati, Guwahati. Routine servicing, mechanical repairs, denting and painting, AC work, insurance claims, premium detailing, customization, and pre-owned vehicles all happened on the ground. Customers found the name easily on Google, Instagram and LinkedIn, yet the existing website never kept pace. It felt dated, made exploration difficult and left most real interactions offline.",

      "What was required was a website that could carry the full weight of the business something practical, dependable and capable of supporting both customer journeys and day-to-day operations. The design stayed quiet and deliberate: clear hierarchy, clean layouts and a mobile-first structure that allowed seamless movement from checking services to browsing accessories or available cars. Nothing ornamental. Just an experience that felt as reliable as the work leaving the workshop.",

      "A flexible content system was put in place behind the pages so services, packages, listings and posts could be kept current without constant technical intervention. Booking, shopping and payment flows were woven directly into the journey, enabling visitors to complete what they started without leaving the site. The work moved through requirements, close collaboration with the UI/UX designer and content developer, careful structuring of information, development, testing and launch.",

      "The result is a website that finally matches the standard of the business itself. Customers now move from first visit to booking or purchase with clarity, while the team holds a digital presence that no longer lags behind the quality of their work.",
    ],
    featuredVideo: {
      slug: "northeast-auto-creations-featured-video",
      url: "/works/northeast-auto-creations/video.mp4",
      alt: "The result is a website that finally matches the standard of the business itself. Customers now move from first visit to booking or purchase with clarity, while the team holds a digital presence that no longer lags behind the quality of their work.",
      caption: "Northeast Auto Creations website walkthrough.",
      transcript:
        "The video opens with Northeast Auto Creations and its online presence before transitioning into the website. The homepage introduces the automotive business and highlights its services, pre-owned vehicles, and customer booking options. The Services section presents offerings including vehicle customization, detailing, restoration, and related automotive services. The video then moves through the product area, showing automotive accessories and care products that visitors can browse and purchase. A product is selected and the shopping flow continues into checkout, where product and delivery information are reviewed before the order is placed. The video then shows the payment experience and order confirmation before returning to the broader Northeast Auto Creations digital experience.",
      title: "Northeast Auto Creations Website Showcase",
      description:
        "A visual walkthrough of the Northeast Auto Creations website, presenting its automotive services, products, vehicle listings, booking experience, shopping flow, checkout, and payment process.",
      thumbnail: {
        slug: "northeast-auto-creations-video-thumbnail",
        url: "/works/northeast-auto-creations/image-1.png",
        alt: "Northeast Auto Creations website displayed across multiple screens with automotive services, pre-owned cars, products, and booking features.",
        caption: "Northeast Auto Creations website and digital experience.",
        title: "Northeast Auto Creations Website Preview",
        description:
          "A multi-screen preview of the Northeast Auto Creations website, combining its automotive brand, service presentation, vehicle listings, product catalogue, and booking experience.",
        width: 1440,
        height: 810,
      },
      duration: 51,
      uploadedAt: new Date("2026-09-30T00:00:00.000Z"),
    },
    gallery: [
      {
        slug: "northeast-auto-creations-gallery-1",
        url: "/works/northeast-auto-creations/image-1.png",
        alt: "Northeast Auto Creations website showing the pre-owned cars, products, and service package sections",
        caption:
          "A unified automotive website bringing cars, products, services, and service packages together.",
        title: "Northeast Auto Creations Website",
        description:
          "A view of the Northeast Auto Creations website combining vehicle listings, automotive products, service packages, and booking actions within a single interface.",
        width: 1440,
        height: 810,
      },
      {
        slug: "northeast-auto-creations-gallery-2",
        url: "/works/northeast-auto-creations/image-2.png",
        alt: "Northeast Auto Creations services page displaying automotive services and car service packages",
        caption:
          "Automotive services and service packages organized into a single digital experience.",
        title: "Automotive Services & Packages",
        description:
          "The website brings together services such as car restoration, customization, detailing, pickup and drop, pre-owned cars, maintenance, insurance claims, and towing alongside dedicated service packages.",
        width: 1440,
        height: 810,
      },
      {
        slug: "northeast-auto-creations-gallery-3",
        url: "/works/northeast-auto-creations/image-3.png",
        alt: "Strapi CMS interface showing Northeast Auto Creations content types, media library, and editable website content",
        caption:
          "A Strapi-powered content system for managing website content and media.",
        title: "Strapi CMS Content Management",
        description:
          "The project uses Strapi CMS to manage structured website content and media, with dedicated content types and a media library for maintaining pages, accessories, blogs, packages, services, and related assets.",
        width: 1440,
        height: 810,
      },
      {
        slug: "northeast-auto-creations-gallery-4",
        url: "/works/northeast-auto-creations/image-4.png",
        alt: "Multiple Northeast Auto Creations website screens showing products, login, packages, pre-owned cars, and services",
        caption:
          "Multiple views of the Northeast Auto Creations website across its core customer journeys.",
        title: "Northeast Auto Creations Website Interface",
        description:
          "A collection of interface views covering product browsing, authentication, vehicle listings, service packages, and automotive services, showing how the different parts of the platform work together.",
        width: 1440,
        height: 810,
      },
      {
        slug: "northeast-auto-creations-gallery-5",
        url: "/works/northeast-auto-creations/image-5.png",
        alt: "Northeast Auto Creations checkout interface showing product details, delivery information, order review, and PhonePe payment",
        caption: "A multi-step checkout flow with integrated online payments.",
        title: "Online Payment & Checkout Flow",
        description:
          "The checkout experience guides customers through product details, delivery information, order review, and payment, including direct online payment through the PhonePe gateway.",
        width: 1440,
        height: 810,
      },
      {
        slug: "northeast-auto-creations-gallery-6",
        url: "/works/northeast-auto-creations/image-6.png",
        alt: "Northeast Auto Creations blog page displaying automotive articles, guides, and maintenance content",
        caption:
          "An automotive content hub for guides, maintenance advice, and vehicle insights.",
        title: "Automotive Blog & Insights",
        description:
          "The website includes a dedicated blog and insights section where automotive knowledge is organized into articles covering car care, maintenance, insurance, servicing, and related topics.",
        width: 1440,
        height: 810,
      },
      {
        slug: "northeast-auto-creations-gallery-7",
        url: "/works/northeast-auto-creations/image-7.png",
        alt: "Northeast Auto Creations profiles displayed across Instagram, Facebook, and WhatsApp",
        caption:
          "Northeast Auto Creations represented across its social and messaging platforms.",
        title: "Social Media Presence",
        description:
          "A collection of Northeast Auto Creations' Instagram, Facebook, and WhatsApp profiles, showing how the business extends its digital presence beyond the website.",
        width: 1440,
        height: 810,
      },
    ],
    clients: [
      {
        name: "Northeast Auto Creations",
        link: {
          url: "https://northeastautocreations.com",
          platform: "Website",
        },
      },
    ],
    partners: [],
    teamMembers: [],
    collaborators: [
      {
        name: "Shivangi Mishra",
        link: {
          url: "https://www.behance.net/shivangimishra2023",
          platform: "Behance",
        },
      },
      {
        name: "Priyanshu Patil",
        link: {
          url: "https://linkedin.com/in/patilpriyanshu",
          platform: "LinkedIn",
        },
      },
    ],
    faqs: [
      {
        question: "What was built for Northeast Auto Creations?",
        answer:
          "A comprehensive automotive website was built to bring together pre-owned cars, automotive products, services, service packages, bookings, and customer information in one platform.",
      },
      {
        question: "What can customers do through the website?",
        answer:
          "Customers can explore pre-owned cars, browse automotive products and services, view service packages, book appointments, and purchase products through the website.",
      },
      {
        question: "Does the website support online product purchases?",
        answer:
          "Yes. The website includes a multi-step checkout flow covering product details, delivery information, order review, and online payment.",
      },
      {
        question: "How are payments handled on the website?",
        answer:
          "The website integrates the PhonePe payment gateway, allowing customers to make payments directly through the checkout experience using supported payment methods.",
      },
      {
        question:
          "What types of automotive services are presented on the website?",
        answer:
          "The platform presents services including car restoration, customisation and modification, denting and painting, detailing and design, pickup and drop, pre-owned cars, maintenance, cashless insurance claims, and car towing.",
      },
      {
        question: "How is the website content managed?",
        answer:
          "The website uses Strapi CMS to manage structured content and media. This allows content such as pages, services, packages, accessories, blogs, and other website information to be updated without modifying the website interface directly.",
      },
      {
        question: "Does the website include an automotive content section?",
        answer:
          "Yes. A dedicated blog and insights section provides automotive articles covering topics such as car care, maintenance, servicing, insurance, and vehicle-related guidance.",
      },
      {
        question: "Does the project include product and accessory management?",
        answer:
          "Yes. The website includes an accessories/product browsing experience where automotive products can be presented with information and pricing, alongside filtering and sorting options.",
      },
      {
        question: "How are the different automotive offerings organized?",
        answer:
          "The website separates the business's offerings into areas such as products, pre-owned cars, accessories, services, packages, and blog content, while keeping them within a consistent website experience.",
      },
      {
        question: "Does the project include a social media presence?",
        answer:
          "The project also represents Northeast Auto Creations across Instagram, Facebook, and WhatsApp, extending the business's digital presence beyond the website.",
      },
    ],
    postedAt: new Date("2026-09-30T00:00:00.000Z"),
    lastModifiedAt: new Date("2026-09-30T00:00:00.000Z"),
  },
  {
    slug: "iron-core",
    metadata: {
      title: "IronCore Fitness Website | Abhisek",
      description:
        "Explore the IronCore Fitness website project, designed and developed to present the gym's brand, services, classes, trainers, and membership options through a focused digital experience.",
    },
    title: "IronCore Fitness",
    description:
      "IronCore's website was built the same way they build strength: one deliberate choice at a time, with nothing left to chance.",
    sectors: ["Business Website", "Service Business"],
    contents: [
      "IronCore Fitness exists to help people push beyond their limits through structured coaching, quality equipment, and a culture grounded in discipline. The website was developed under real constraints of budget and timeline. The priority was to forge a powerful digital presence that elevates the gym’s visibility and online recognition while staying true to its core philosophy.",
      "The strategy rested on directness. Instead of relying on standard fitness imagery or motivational language, the site positions IronCore as a serious ally in transformation, one where mental resilience matters as much as physical strength. The content follows a thoughtful sequence. It opens with the core idea of “Hustle for Health,” moves through the facilities and coaching approach, and then presents practical information on classes, trainers, and membership options. This progression mirrors how potential members tend to evaluate a gym, understanding the environment and values first, before weighing the details.",
      "Visually, the design draws from the gym’s own character. A dark palette dominated by deep blacks and charcoals, with selective sharp accents, creates an atmosphere of focus and intensity. Typography pairs bold, condensed headlines that carry authority with highly legible text for longer passages. Ample whitespace and careful hierarchy produce a clean, rhythmic layout that echoes the precision expected in serious training. Imagery was chosen to reflect real training environments and equipment favoring credibility over idealized scenes.",
      "Structurally, a single-page format with anchored navigation allows easy movement between sections without losing context. Class schedules, a clear membership comparison table, and trainer profiles are presented in scannable ways. Calls to action are placed where interest is likely to peak, and attention to responsive behavior and contrast ensures the experience works well across devices. These choices were made to reduce obstacles and support informed decisions.",
      "The resulting site gives IronCore a coherent and purposeful online identity. It translates the gym’s values into digital form and provides a direct route from curiosity to commitment.",
    ],
    featuredVideo: {
      slug: "iron-core-featured-video",
      url: "/works/iron-core/video.mp4",
      alt: "IronCore Fitness website showcase featuring its homepage, classes, membership plans, trainers, and member testimonials.",
      caption:
        "IronCore Fitness website walkthrough showcasing the brand, services, membership plans, trainers, and testimonials.",
      transcript:
        "The video opens with a Google search for IronCore Fitness before transitioning into the IronCore website. The homepage introduces IronCore with the message “Hustle for Health” and highlights strength, discipline, results, structured coaching, equipment, and community. The About section presents IronCore's philosophy, state-of-the-art equipment, and expert coaches. The Classes and Training section presents different training options designed to build strength, burn calories, and improve flexibility. The Membership Plans section presents Starter, Pro, and Elite membership options with different levels of access, training, coaching, and community support. The video then showcases trainer profiles and the member experience before displaying testimonials from IronCore members. It concludes with the IronCore Fitness logo and brand identity.",
      title: "IronCore Fitness Website Showcase",
      description:
        "A visual walkthrough of the IronCore Fitness website, showcasing its brand identity, fitness philosophy, class and training information, membership plans, trainer profiles, and member testimonials.",
      thumbnail: {
        slug: "iron-core-video-thumbnail",
        url: "/works/iron-core/image-1.png",
        alt: "IronCore Fitness website visual featuring its gym branding, strength-focused imagery, and fitness messaging.",
        caption: "IronCore Fitness brand and website experience.",
        title: "IronCore Fitness Website Preview",
        description:
          "A visual preview of the IronCore Fitness website combining its bold brand identity, gym environment, and strength-focused messaging.",
        width: 1440,
        height: 810,
      },
      duration: 39,
      uploadedAt: new Date("2026-09-24T00:00:00.000Z"),
    },
    gallery: [
      {
        slug: "iron-core-gallery-1",
        url: "/works/iron-core/image-1.png",
        alt: "IronCore Fitness website displayed across desktop screens with its dark gym-focused design and orange visual identity.",
        caption: "IronCore Fitness website across desktop layouts.",
        title: "IronCore Fitness Desktop Website Design",
        description:
          "A desktop presentation of the IronCore Fitness website, showcasing its dark visual system, orange accents, fitness imagery, navigation, content sections, and membership-focused interface.",
        width: 1440,
        height: 810,
      },
      {
        slug: "iron-core-gallery-2",
        url: "/works/iron-core/image-2.png",
        alt: "IronCore Fitness website showing the homepage, membership plans, and trainer sections in a dark orange interface.",
        caption: "Website interface and membership experience.",
        title: "IronCore Fitness Website And Membership Pages",
        description:
          "A closer look at the IronCore Fitness website across its homepage and membership experience, showing how the visual identity, service information, pricing plans, trainers, and supporting content are presented together.",
        width: 1440,
        height: 810,
      },
      {
        slug: "iron-core-gallery-3",
        url: "/works/iron-core/image-3.png",
        alt: 'IronCore Fitness website presentation with layered desktop screens and the message "Build Your Best Self."',
        caption: "Brand messaging and website presentation.",
        title: "IronCore Fitness Brand And Website Presentation",
        description:
          "A promotional composition combining multiple IronCore Fitness website screens with the brand's visual identity and messaging, highlighting the connection between the fitness brand and its digital experience.",
        width: 1440,
        height: 810,
      },
      {
        slug: "iron-core-gallery-4",
        url: "/works/iron-core/image-4.png",
        alt: "IronCore Fitness website shown across three mobile screens with fitness content, classes, and membership information.",
        caption: "Responsive mobile website experience.",
        title: "IronCore Fitness Mobile Website Design",
        description:
          "The responsive mobile experience for IronCore Fitness, showing how the website's content, navigation, classes, and membership information adapt to smaller screens while maintaining the same visual identity.",
        width: 1440,
        height: 810,
      },
      {
        slug: "iron-core-gallery-5",
        url: "/works/iron-core/image-5.png",
        alt: "IronCore Fitness website shown on a desktop monitor and tablet with responsive layouts for classes and membership content.",
        caption: "Responsive website across desktop and tablet layouts.",
        title: "IronCore Fitness Responsive Website",
        description:
          "A responsive presentation of the IronCore Fitness website across larger screen sizes, showing the homepage alongside classes and membership content and demonstrating how the interface adapts across devices.",
        width: 1440,
        height: 810,
      },
    ],
    clients: [{ name: "IronCore Fitness" }],
    partners: [],
    teamMembers: [],
    collaborators: [],
    faqs: [
      {
        question: "What was the main goal of the IronCore Fitness website?",
        answer:
          "The main goal was to create a strong digital presence that improved IronCore Fitness's online visibility while communicating its core values of strength, discipline, and transformation. The website was designed to give potential members a clear understanding of the gym, its approach, and its offerings before taking action.",
      },
      {
        question: "How was the website content structured?",
        answer:
          "The content follows a deliberate progression, beginning with IronCore's philosophy and positioning before moving into its facilities, coaching approach, classes, trainers, and membership options. This structure helps visitors understand the environment and values first, then evaluate the practical details.",
      },
      {
        question:
          "How did the website design reflect the IronCore Fitness brand?",
        answer:
          "The design uses deep blacks and charcoals with sharp accent colors to create a focused and intense visual atmosphere. Bold condensed typography establishes authority, while clear body text, whitespace, and structured layouts keep the experience easy to scan.",
      },
      {
        question: "Why was the website designed as a single-page experience?",
        answer:
          "The single-page structure allows visitors to move between the major sections through anchored navigation without losing context. It keeps the gym's story, facilities, classes, trainers, and membership information within one continuous experience.",
      },
      {
        question: "How were classes and membership options presented?",
        answer:
          "Classes, training information, and membership plans were organized into scannable sections so visitors could understand the available options without working through unnecessary navigation. The membership comparison presents the available plans and their features in a clear format.",
      },
      {
        question: "How was the website designed for different devices?",
        answer:
          "Responsive behavior was considered throughout the experience so that the site's content, navigation, imagery, and calls to action remain usable across different screen sizes. Contrast and layout hierarchy were also maintained to keep important information accessible on smaller screens.",
      },
      {
        question: "What influenced the visual direction of the website?",
        answer:
          "The visual direction was drawn from IronCore's own training environment, equipment, and brand character. Imagery focuses on real training settings and equipment rather than idealized fitness scenes, helping the digital experience remain connected to the character of the gym.",
      },
    ],
    postedAt: new Date("2026-09-24T00:00:00.000Z"),
    lastModifiedAt: new Date("2026-09-24T00:00:00.000Z"),
  },
];
