# **blog.plantincarrenard.com**

**A New Vision for Old Concepts**
This project is a SolidJS-based blog platform that reimagines personal and community interaction through customizable, immersive digital rooms.

---

## **Project Vision**

This platform is not just a blog. It introduces **interactive personal spaces**, each rendered as a static side-view of a room. These rooms contain:

* A **computer** (access to blog posts and videos)
* A **music device** (user-curated or linked music)
* A **library** (documents, notes, and articles)
* A **poster** (canvas for drawings, post-its, images)

Users can fully customize the wall, desk, and other elements of their room with textures and colors. These rooms are **explorable** by other users.

Cross-content linkage is possible: e.g., a blog post might reference music or a document in the library.

---

## **Requirements**

* Fully polished and responsive UI
* Pages must load and function fully without client-side JavaScript
* Full functionality must be accessible without client-side JS
* Client and server-side data validation
* Suspense + error boundaries for data fetching
* Form submissions must support revalidation
* Network performance: caching, preloading, avoiding waterfalls
* Secure, typed authentication and communication
* Fully type-safe codebase
* Strong component-based architecture
* AI-generated code must be clean and reviewed
* High architectural and functional complexity

---

## **Modules Overview**

### 1. Room Renderer

* Static rendering of wall, desk, and objects
* Texture and object state control
* Future: canvas-based real-time editing

### 2. Content Interfaces

* Markdown-based blog engine with media support
* Music uploads or embeds (YouTube, Spotify)
* Document + note storage

### 3. Interaction System

* SVG/Canvas mapping for object interaction
* Drag and drop for poster area
* Note/image placement and manipulation

### 4. User Customization

* Customizable textures and layout saved persistently
* Room metadata stored in the database

---

## **Architecture**

###  Stack

* **Frontend**: [SolidStart](https://start.solidjs.com) with full SSR
* **Styling**: TailwindCSS
* **Backend ORM**: Prisma
* **Database**: PostgreSQL (or SQLite for development)
* **Authentication**: [Lucia](https://lucia-auth.com/)
* **Validation**: Zod
* **Markdown Parsing**: `marked`, `contentlayer`, or custom renderer
* **Storage**: Local or S3-compatible (TBD)
* **Image/Canvas**: Native Canvas API or SVG rendering

---

###  File & Component Architecture

* `routes/`: SolidStart route-based SSR pages
* `components/`: Reusable UI elements (Room, Poster, BlogList, etc.)
* `lib/`: Shared utilities and hooks
* `server/`: Prisma handlers, DB logic, auth
* `styles/`: Tailwind config + custom theming
* `assets/`: Default room assets and textures

---

###  Prisma Data Models

```prisma
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  username    String   @unique
  hashedPass  String
  rooms       Room[]
  createdAt   DateTime @default(now())
}

model Room {
  id          String   @id @default(cuid())
  ownerId     String
  owner       User     @relation(fields: [ownerId], references: [id])
  name        String
  config      Json     // wall/desk/object styles
  posterItems Json     // notes, images, post-its
  musicLinks  Json     // links to music assets
  library     Json     // list of docs
  createdAt   DateTime @default(now())
}
```


