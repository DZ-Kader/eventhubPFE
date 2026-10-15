# EVENTORIA - System Architecture Diagram

![System Architecture Diagram](system_architecture.png)

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
        Axios[Axios API Client]
        AuthGuard[JWT Auth Interceptor / Middleware]
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

    subgraph Database Layer [MongoDB Database]
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
