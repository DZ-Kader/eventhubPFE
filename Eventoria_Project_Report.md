# EVENTORIA: The Event Hub of Algeria
## Final Year Project (PFE) Technical System Design & Architectural Report

---

## 1. Project Overview & Executive Summary

**EVENTORIA** is a centralized event discovery, publishing, and ticketing platform designed for the Algerian ecosystem (Technology bootcamps, university workshops, agricultural expos, trade fairs, and professional career days). It resolves the problem of scattered event announcements across unorganized social media pages and private channels.

### Key Technical Highlights
- **Tech Stack**: Full-Stack MERN (MongoDB, Express.js, React 19, Node.js)
- **Frontend Architecture**: Tailwind CSS v4, Lucide Icons, Glassmorphism design system, Recharts analytics
- **Security & RBAC**: Token-based authentication (JWT), bcrypt password hashing, and role-based access control (`user`, `organizer`, `admin`)
- **Containerization & Deployment**: Multi-container Docker compose configuration (MongoDB 6.0, Node.js REST API, Nginx / Vite SPA)

---

## 2. High-Level System Architecture Diagram

![System Architecture Diagram](docs/system_architecture.png)

```mermaid
graph TD
    subgraph Client Layer [Frontend - React 19 + Tailwind v4]
        Visitor[Public Visitor]
        Organizer[Event Organizer]
        Admin[System Admin]
        ViteApp[React Single Page Application SPA]
        Visitor --> ViteApp
        Organizer --> ViteApp
        Admin --> ViteApp
    end

    subgraph Security & Routing Layer
        Axios[Axios API Client Interceptor]
        AuthGuard[JWT Auth Middleware]
        ViteApp --> Axios
        Axios --> AuthGuard
    end

    subgraph Application Server Layer [Backend - Express.js REST API]
        Express[Express Server Engine]
        AuthRoutes[/api/auth]
        EventRoutes[/api/events]
        RegRoutes[/api/registrations]
        AdminRoutes[/api/admin]

        AuthGuard --> Express
        Express --> AuthRoutes
        Express --> EventRoutes
        Express --> RegRoutes
        Express --> AdminRoutes
    end

    subgraph Database Layer [MongoDB NoSQL Database]
        Mongo[(MongoDB Database)]
        UserColl[(Users Collection)]
        EventColl[(Events Collection)]
        RegColl[(Registrations Collection)]
        CatColl[(Categories Collection)]
        CityColl[(Cities Collection)]
        VenueColl[(Venues Collection)]

        Express --> Mongo
        Mongo --> UserColl
        Mongo --> EventColl
        Mongo --> RegColl
        Mongo --> CatColl
        Mongo --> CityColl
        Mongo --> VenueColl
    end
```

---

## 3. Database Design & Entity-Relationship (ER) Diagram

![Entity-Relationship Diagram](docs/er_diagram.png)

```mermaid
erDiagram
    USER ||--o{ EVENT : "organizes"
    USER ||--o{ REGISTRATION : "registers for"
    USER ||--o{ EVENT : "favorites"
    CATEGORY ||--o{ EVENT : "classifies"
    CITY ||--o{ VENUE : "contains"
    CITY ||--o{ EVENT : "hosted in"
    VENUE ||--o{ EVENT : "holds"
    EVENT ||--o{ REGISTRATION : "has attendees"

    USER {
        ObjectId _id PK
        string name
        string email
        string password
        string role "user | organizer | admin"
        string phone
        string profileImage
        Array favorites FK
        date createdAt
    }

    CATEGORY {
        ObjectId _id PK
        string name
        string slug
        string icon
        string description
    }

    CITY {
        ObjectId _id PK
        string name
        string slug
        string description
        string image
    }

    VENUE {
        ObjectId _id PK
        string name
        ObjectId city FK
        string address
        number capacity
        string description
    }

    EVENT {
        ObjectId _id PK
        string title
        string slug
        string shortDescription
        string description
        ObjectId category FK
        ObjectId city FK
        ObjectId venue FK
        ObjectId organizer FK
        string eventType "physical | online | hybrid"
        date startDate
        date endDate
        string startTime
        string endTime
        string status "draft | pending | published | rejected"
        number capacity
        number currentAttendees
        number views
    }

    REGISTRATION {
        ObjectId _id PK
        ObjectId event FK
        ObjectId user FK
        string ticketCode UK
        date registrationDate
        string status "confirmed | cancelled"
    }
```

---

## 4. Workflow & Sequence Diagrams

![Event Lifecycle & Registration Workflows](docs/event_lifecycle_workflow.png)

### 4.1 Event Submission & Admin Moderation Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Draft: Organizer Creates Event
    Draft --> Pending: Organizer Submits for Approval
    Pending --> Published: Admin Approves Submission
    Pending --> Rejected: Admin Denies Submission
    Rejected --> Draft: Organizer Revises Details
    Published --> Completed: Event End Date Passed
    Completed --> [*]
```

### 4.2 Ticket Registration Sequence

```mermaid
sequenceDiagram
    autonumber
    actor User as Visitor / Attendee
    participant UI as React Frontend
    participant API as Express API
    participant DB as MongoDB

    User->>UI: Clicks "Register for Event"
    UI->>API: POST /api/registrations { eventId } + Bearer JWT
    API->>API: Verify JWT token & user session
    API->>DB: Check capacity & existing registration
    alt Constraint Violated (Full or Duplicate)
        DB-->>API: Registration Failed
        API-->>UI: 400 Bad Request
        UI-->>User: Display Toast Error Message
    else Valid Registration
        API->>DB: Insert Registration document & Ticket Code
        API->>DB: Increment Event.currentAttendees (+1)
        DB-->>API: Registration Saved
        API-->>UI: 201 Created { ticketCode }
        UI-->>User: Display Digital Pass Modal & QR Badge
    end
```

---

## 5. Security Architecture & Role Access Matrix

| System Endpoint / Resource | Visitor (Public) | Registered User | Organizer | Admin |
|---|:---:|:---:|:---:|:---:|
| `GET /api/events` (Discover) | ✅ | ✅ | ✅ | ✅ |
| `GET /api/categories`, `/api/cities` | ✅ | ✅ | ✅ | ✅ |
| `POST /api/auth/login` & `/register` | ✅ | ✅ | ✅ | ✅ |
| `POST /api/registrations` (Ticket Pass) | ❌ | ✅ | ✅ | ✅ |
| `GET /api/registrations/my-tickets` | ❌ | ✅ | ✅ | ✅ |
| `POST /api/events` (Create Event) | ❌ | ❌ | ✅ | ✅ |
| `GET /api/events/mine` | ❌ | ❌ | ✅ | ✅ |
| `PUT /api/admin/events/:id/status` | ❌ | ❌ | ❌ | ✅ |
| `POST /api/categories`, `/cities`, `/venues` | ❌ | ❌ | ❌ | ✅ |

---

## 6. Real Application Interface Screenshots

Authentic screenshots captured from live application routes:

- 🏠 **Public Homepage**: [docs/screenshots/home-page.png](file:///c:/Users/dell/Desktop/GomyCodeAcademy/eventhubPFE/docs/screenshots/home-page.png)
- 🔍 **Event Discovery Hub**: [docs/screenshots/discover-page.png](file:///c:/Users/dell/Desktop/GomyCodeAcademy/eventhubPFE/docs/screenshots/discover-page.png)
- 📄 **Event Details**: [docs/screenshots/event-details-page.png](file:///c:/Users/dell/Desktop/GomyCodeAcademy/eventhubPFE/docs/screenshots/event-details-page.png)
- 🔐 **Authentication Form**: [docs/screenshots/login-page.png](file:///c:/Users/dell/Desktop/GomyCodeAcademy/eventhubPFE/docs/screenshots/login-page.png)
- 🎟️ **User Dashboard & Pass**: [docs/screenshots/user-dashboard.png](file:///c:/Users/dell/Desktop/GomyCodeAcademy/eventhubPFE/docs/screenshots/user-dashboard.png)
- 📊 **Organizer Dashboard**: [docs/screenshots/organizer-dashboard.png](file:///c:/Users/dell/Desktop/GomyCodeAcademy/eventhubPFE/docs/screenshots/organizer-dashboard.png)
- ➕ **3-Step Event Creator**: [docs/screenshots/create-event-page.png](file:///c:/Users/dell/Desktop/GomyCodeAcademy/eventhubPFE/docs/screenshots/create-event-page.png)
- 🛡️ **Admin Moderation Queue**: [docs/screenshots/admin-dashboard.png](file:///c:/Users/dell/Desktop/GomyCodeAcademy/eventhubPFE/docs/screenshots/admin-dashboard.png)

---

## 7. Conclusion & PFE Defense Suitability

EVENTORIA provides a complete, production-grade Final Year Project (PFE) implementation. It delivers a modern visual presentation (Tailwind CSS v4 + Lucide icons + Recharts) backed by a clean, explainable MERN architecture suitable for academic defense.
