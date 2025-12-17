# PRODCT REQUIREMENTS DOCUMENT (PRD)

## Project: UNHRO Website Clone

| Metadata | Details |
| --- | --- |
| **Target Platform** | Web (Responsive) |
| **Stack** | MERN (MongoDB, Express.js, React.js, Node.js) |
| **Styling** | Tailwind CSS (JSX) |
| **File Handling** | Multer (for image uploads in Admin panel) |
| **Authentication** | JWT (JSON Web Tokens), bcrypt (password hashing) |
| **Input Source** | Provided UI Screenshots (image_0.png to image_8.png) |

---

### 1. EXECUTIVE SUMMARY
The objective is to develop a pixel-perfect clone of the UNHRO public-facing website. The site serves as an informational portal presenting the organization's background, team, governance structure, news, events, and contact information.

While the public view is largely static content, an **Admin Dashboard** is required to manage dynamic sections (Our Team, News & Events, Footer Announcements) to ensure the site remains maintainable.

### 2. SITEMAP & ARCHITECTURE
**Excluded:** The "Research" main navigation link must be omitted based on requirements.

#### Public Facing (Frontend)
1. **Home Page:** Hero section, introductory text, Director's message, Vision/Mission pillars.
2. **About UNHRO (Dropdown Menu):**
    * Background (Policy, Vision, Mission)
    * Administration (Currently maps to the same visual style as Background in the screenshots, assume similar content structure).
    * Research Institutions (UVRI & NCRI descriptions).
    * Our Team (Grid of staff members).
    * Board / Committee ("Coming Soon" placeholder).
3. **Resources:** (Content undefined in screenshots, implement a generic content page template).
4. **Symposium:** (Content undefined, implement generic template).
5. **News & Events:** List of textual news and grid of downloadable event flyers.
6. **Contact Us:** Contact form and Google Maps integration.

#### Admin Portal (Backend Protected Routes)
1. **Login Page**
2. **Dashboard Overview**
3. **Team Manager:** Add/Edit/Delete team members (photo upload via Multer).
4. **News & Events Manager:** Create/Edit news items and upload event flyers (Multer).
5. **Announcements Manager:** Manage links in the footer.

---

### 3. USER ROLES & AUTHENTICATION
#### Roles
1. **Public User:** Can view all public pages and submitting the contact form. No login required.
2. **Super Admin:** Can log into the admin panel to manage content.

#### Authentication Flow (Admin Only)
* **Tech:** Node.js/Express backend.
* **Password Security:** Use `bcrypt` to salt and hash passwords before storing them in MongoDB.
* **Session Management:** Upon successful login, generate a `JWT` (RS256 or HS256) containing the user ID and role. This token must be sent in the `Authorization: Bearer <token>` header for any requests to `/api/admin/*` routes.
* **Middleware:** Implement Express middleware to verify the JWT on protected routes.

---

### 4. DETAILED VISUAL & FRONTEND IMPLEMENTATION GUIDE (CRITICAL)
This section details how to achieve the "exact look" using React and Tailwind CSS.

#### 4.1. Global Styles & Theme Config (`tailwind.config.js`)
Define these colors based on the screenshots to ensure consistency.

```javascript
// tailwind.config.js suggestion
theme: {
  extend: {
    colors: {
      'unhro-dark-blue': '#00008B', // The main nav and footer color
      'unhro-purple': '#6A71B9',    // Team cards, Submit button
      'unhro-light-blue': '#ADD8E6', // Top header gradient start
      'unhro-pink': '#FFC0CB',       // Page title gradient start
    },
    fontFamily: {
      sans: ['Arial', 'Helvetica', 'sans-serif'], // Match the simple sans-serif used
    }
  }
}
```

#### 4.2. The Header Component (Common)
* **Top Bar:** A `flex` container with a horizontal gradient background (`bg-gradient-to-r from-unhro-light-blue to-white`). Three items aligned horizontally: Logo (left), Center text (uppercase, bold, centered), Coat of Arms (right).
* **Navigation Bar:** A `w-full bg-unhro-dark-blue text-white` strip.
    * Use a `flex` container for the links.
* **Dropdown ("About UNHRO"):** Implement using React state (`useState(false)` for open/close). The dropdown menu itself should be absolutely positioned (`absolute top-full left-0`), with a dark purple background (`bg-[#483D8B]`) and white text, as seen in `image_4.png` and `image_7.png`.

#### 4.3. The Footer Component (Common)
* **Top Border:** A distinct multi-colored line. Use a `div` with a high height (e.g., `h-1`) and a background gradient representing red, yellow, and black.
* **Main Body:** `bg-unhro-dark-blue text-white py-8`. Use CSS Grid (`grid-cols-3`) for the three main columns: Logo, Announcements, Contact info.
* **Bottom Bar:** A darker shade of blue strip for copyright links. Flex container, `justify-between text-sm text-gray-300`.

#### 4.4. Page Specific Implementation
**A. Common Page Title Banner (e.g., "Policy, Vision, Mission")**
* Used on almost all subpages.
* `w-full h-24 bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 flex items-center px-8`.
* Text is `text-3xl text-unhro-dark-blue`.

**B. About - Background Page (`image_0.png`)**
* **The 4 Pillars Section (Vision, Mission, etc.):**
    * This is a vertical stack of 4 items.
    * Each item is a `flex` container.
    * **Left Icon:** A large circular container with a thick dark blue border (`rounded-full border-4 border-unhro-dark-blue w-24 h-24 flex items-center justify-center`). Inside is a blue line-icon (use `react-icons` or SVGs).
    * **Right Text:** A `div` with `ml-8`. The heading is bold blue text. A horizontal separator line exists between items.

**C. Our Team Page (`image_1.png`)**
* **Grid Layout:** Use CSS Grid: `grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 px-8 py-8`.
* **Team Card Component:**
    * A `flex flex-col` container.
    * **Image:** Top section for the photo, object-fit cover.
    * **Details Block:** Below the image, a `bg-unhro-purple text-white text-center py-4 px-2`.
    * Name is uppercase bold. Title is smaller.
    * **Button:** A white "MORE" button (`bg-white text-unhro-purple px-4 py-1 text-sm mt-2`).

**D. Contact Us Page (`image_3.png`)**
* **Layout:** A two-column flex layout (`flex flex-col md:flex-row gap-8 px-8`).
* **Left Column (Map):** An `iframe` Google Maps embed. Below it, address details in standard text.
* **Right Column (Form):**
    * A container with a light blue background (`bg-[#E0F7FA] p-8`).
    * Form inputs must have light blue backgrounds (`bg-[#B2EBF2]`) with no borders but ample padding.
    * **Submit Button:** Full width `bg-unhro-purple text-white py-3 font-bold`.

**E. News & Events Page (`image_6.png`)**
* **Events Grid:** Similar to the Team grid.
* `grid grid-cols-1 md:grid-cols-3 gap-6`.
* **Event Card:** Image on top. Below, white text on dark blue background describing the event.
* **Download Button:** A distinct red button with an arrow icon at the bottom of the card.

---

### 5. FUNCTIONAL REQUIREMENTS (Backend & Data)
#### 5.1. MongoDB Schema Design (Proposed)
**User Schema (Admin)**
```javascript
{
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Bcrypt hashed
  role: { type: String, default: 'admin' }
}
```

**TeamMember Schema**
```javascript
{
  name: { type: String, required: true },
  title: { type: String, required: true },
  imagePath: { type: String }, // Stores filename handled by Multer
  bio: { type: String }, // For the "MORE" button content
  order: { type: Number } // For controlling display sequence
}
```

**Event Schema**
```javascript
{
  title: { type: String, required: true },
  description: { type: String },
  eventDate: { type: Date },
  flyerImagePath: { type: String }, // Multer uploaded image
  type: { type: String, enum: ['NEWS', 'EVENT'] }
}
```

**Announcement Schema (Footer)**
```javascript
{
  text: { type: String, required: true },
  link: { type: String, required: true }
}
```

#### 5.2. API Endpoints (Express.js)
**Public Routes:**
* `GET /api/team` - Fetch all team members for the "Our Team" page.
* `GET /api/events` - Fetch news and events.
* `GET /api/announcements` - Fetch footer links.
* `POST /api/contact` - Handle contact form submission (either store in DB or trigger an email using Nodemailer).

**Protected Admin Routes (Requires valid JWT):**
* `POST /api/admin/login` - Returns JWT token.
* `POST /api/admin/team` - Create new team member (uses Multer middleware for `image` field).
* `PUT /api/admin/team/:id` - Update team member.
* `DELETE /api/admin/team/:id` - Delete team member.
* *(Similar CRUD endpoints for Events and Announcements)*

#### 5.3. File Handling (Multer)
* Configure Multer to store uploaded images (team photos, event flyers) in a local `/public/uploads` directory on the Node.js server.
* Ensure the Express app serves this directory statically so frontend can access images via URL (e.g., `http://localhost:5000/uploads/filename.jpg`).

---

### 6. NON-FUNCTIONAL REQUIREMENTS
1. **Responsiveness:** The site must look good and function correctly on mobile devices, tablets, and desktops. Tailwind's responsive prefixes (`md:`, `lg:`) must be used extensively.
2. **Performance:** Optimize image loading. The initial load should be fast.
3. **Security:**
    * Secure headers (Helmet.js).
    * Sanitize inputs to prevent MongoDB injection.
    * Ensure JWT secrets are stored in environment variables (`.env`), not in the code.
4. **Exactness:** The visual fidelity to the screenshots is the highest priority non-functional requirement.
