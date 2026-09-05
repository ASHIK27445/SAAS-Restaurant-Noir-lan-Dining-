# Restaurant Management Platform

A full-stack restaurant operations platform for managing customers, menus, orders, kitchen operations, inventory, suppliers, employees, reports, point-of-sale workflows, reservations, reviews, gallery content, and operational intelligence.

This folder contains the primary React client application. The backend is located in the sibling `server` project and provides authentication, authorization, business APIs, Prisma persistence, and operational calculations.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Project Statement](#project-statement)
3. [Solution Plan](#solution-plan)
4. [Technology Stack](#technology-stack)
5. [Getting Started](#getting-started)
6. [System Architecture](#system-architecture)
7. [Authentication and Authorization](#authentication-and-authorization)
8. [Public Website and Customer Experience](#public-website-and-customer-experience)
9. [Menu and Category Management](#menu-and-category-management)
10. [Recipe and Ingredient Cost Mapping](#recipe-and-ingredient-cost-mapping)
11. [Customer Management](#customer-management)
12. [Order Management](#order-management)
13. [POS and Kitchen Operations](#pos-and-kitchen-operations)
14. [Inventory Management](#inventory-management)
15. [Supplier and Procurement Management](#supplier-and-procurement-management)
16. [Employee and Attendance Management](#employee-and-attendance-management)
17. [Reports and Business Intelligence](#reports-and-business-intelligence)
18. [AI and Intelligent Features](#ai-and-intelligent-features)
19. [Reservations, Reviews, Gallery, and Inquiries](#reservations-reviews-gallery-and-inquiries)
20. [Complete Business Workflow](#complete-business-workflow)
21. [Project Structure](#project-structure)
22. [Core Features](#core-features)
23. [All Implemented Feature Areas](#all-implemented-feature-areas)
24. [Optimization Work](#optimization-work)
25. [Difficult Problems and Solutions](#difficult-problems-and-solutions)
26. [Testing and Validation](#testing-and-validation)
27. [Future Optimization](#future-optimization)
28. [Future Improvements](#future-improvements)

---

## Project Overview

The platform connects the customer ordering experience with restaurant management operations.

Customers can:

- Browse the public restaurant website.
- View menu categories and menu items.
- Read restaurant information and reviews.
- View the gallery.
- Submit reservations.
- Add items to a cart.
- Submit delivery or customer orders.
- Track their orders from the customer dashboard.

Restaurant managers and staff can:

- Monitor daily operations from an admin overview.
- Create and manage menu items and categories.
- Define recipes and map recipe rows to inventory items.
- Manage customers, users, employees, permissions, wages, and attendance.
- Receive and manage orders through admin and POS workflows.
- Run a kitchen queue and customer token display.
- Manage inventory, stock movements, suppliers, purchase orders, and contacts.
- Review revenue reports and menu demand forecasts.
- Manage reservations, reviews, inquiries, and gallery content.

The project is designed as an operational system rather than only a marketing website. The important goal is to keep restaurant data connected across sales, menu, inventory, procurement, employees, and reporting.

---

## Project Statement

Restaurants often operate with separate tools for ordering, inventory, purchasing, staffing, and reporting. When these areas are disconnected:

- A menu item can be sold without a clear ingredient cost.
- Stock levels can become inaccurate.
- Purchase decisions depend on guesswork.
- Managers need to read multiple reports before taking action.
- Kitchen, cashier, supplier, and management workflows become difficult to coordinate.
- Customer and operational data are duplicated across systems.

This project addresses those problems with one role-aware platform.

The platform aims to provide:

1. A clear customer ordering experience.
2. A practical POS and kitchen workflow.
3. Centralized restaurant administration.
4. Inventory and supplier visibility.
5. Recipe-based food cost calculation.
6. Reports and demand forecasting.
7. A secure foundation for future AI decision support.

---

## Solution Plan

The solution is organized into connected layers.

### 1. Customer Layer

The public website exposes the restaurant brand, menu, gallery, reviews, reservation form, cart, checkout, and customer dashboard.

### 2. Transaction Layer

The POS and order modules handle menu selection, order creation, payment status, order state changes, receipts, kitchen preparation, delivery state, and customer tracking.

### 3. Operations Layer

The admin modules manage menu items, categories, recipes, inventory, employees, attendance, wages, reservations, inquiries, reviews, and gallery content.

### 4. Procurement Layer

Supplier directories, supplier catalogs, purchase orders, contacts, receiving, stock movements, and supplier performance connect purchasing with inventory.

### 5. Intelligence Layer

Reports, menu demand forecasting, recipe cost analysis, anomaly detection, and the controlled business assistant turn operational data into decisions.

### 6. Security Layer

Firebase Authentication identifies users. Backend middleware verifies tokens, loads the internal user, applies role rules, and restricts management modules.

---

## Technology Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS v4
- Lucide React icons
- React Hook Form
- Zod
- TanStack Query
- Firebase client SDK
- Framer Motion

### Backend

- Node.js
- TypeScript
- Express
- Firebase Admin SDK
- Prisma ORM
- PostgreSQL
- `tsx` for development execution
- Nodemon for server reloads

### Data and Infrastructure

- PostgreSQL database
- Prisma migrations
- Firebase Authentication
- REST APIs
- Environment-based configuration

### Development Commands

From `client-main/my-app`:

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

From `server`:

```bash
npm install
npx prisma generate
npx prisma migrate dev
npx tsx src/server.ts
```

For automatic server restarts:

```bash
npx nodemon src/server.ts
```

The default backend URL is:

```text
http://localhost:3000
```

The frontend uses `VITE_API_URL` when provided. Otherwise, API modules fall back to `http://localhost:3000`.

---

## System Architecture

```text
React client
   |
   | authFetch with Firebase ID token
   v
Express REST API
   |
   | authenticate middleware
   | authorizeRequest middleware
   | role/module checks
   v
Route modules
   |
   v
Prisma ORM
   |
   v
PostgreSQL
```

### Request Flow Example

```text
User clicks Save Purchase Order
        |
        v
React component validates form
        |
        v
authFetch adds Firebase bearer token
        |
        v
Express verifies Firebase token
        |
        v
Authorization checks role and module access
        |
        v
Route validates payload
        |
        v
Prisma transaction writes purchase order and items
        |
        v
JSON response updates the UI
```

---

## Authentication and Authorization

### Authentication

Firebase Authentication handles sign-in and identity verification. The client uses the Firebase user session and the shared `authFetch` helper.

`authFetch`:

1. Waits for Firebase auth state restoration.
2. Gets the current Firebase ID token.
3. Adds `Authorization: Bearer <token>`.
4. Sends the request to the backend.

### Management Login

Management users use the management login and management access gate. The gate prevents unauthenticated users from entering `/admin` routes.

### POS Login

POS users use the POS login and POS access gate. POS routes are separated from management routes because cashier and kitchen operations have a different workflow.

### Supplier Login

Supplier users use the supplier login and supplier access gate. Supplier routes expose supplier-facing catalog, procurement, contact, and performance workflows.

### Roles

The backend includes roles such as:

- `Admin`
- `Manager`
- `DemoAdmin`
- `Cashier`
- `Chef`
- `SousChef`
- `Waiter`
- `Accountant`
- `Supplier`
- `Customer`

### Authorization Rules

Authorization is handled on the backend, not only in the UI.

The backend:

- Verifies the Firebase token.
- Finds the corresponding internal user.
- Checks whether the account is active.
- Applies role-based access.
- Applies module access grants when required.
- Keeps Demo Admin accounts read-only.

The frontend hides or shows navigation based on access, but the server remains the final security boundary.

---

## Public Website and Customer Experience

### Home Page

The home experience presents the restaurant brand, food content, calls to action, featured sections, reviews, and links into menu and reservation flows.

### About Page

The About page presents the restaurant story, culinary identity, and brand information.

### Menu Preview and Full Menu

The customer can browse menu categories and menu items. The menu view exposes item information such as:

- Name
- Description
- Price
- Discount price where available
- Image
- Category
- Dietary labels
- Allergen-related information
- Availability status

### Cart and Checkout

The cart and checkout workflow supports:

1. Selecting menu items.
2. Adjusting quantity.
3. Reviewing subtotal.
4. Applying available order information.
5. Completing customer checkout.
6. Creating or submitting an order through the backend.
7. Viewing the order in the customer dashboard.

Protected checkout routes require a customer access gate.

### Customer Dashboard

The customer dashboard provides customer-specific order visibility and tracking. Customer data is scoped by the authenticated customer identity rather than exposing all restaurant orders.

### Reservations

Customers submit:

- Guest name
- Email
- Phone
- Reservation date
- Reservation time
- Guest count
- Special request

Administrators manage reservation status, notes, and completion from the admin reservation module.

### Reviews

Customers can submit reviews with food, service, and ambience ratings. Administrators can approve, reject, feature, and order reviews for public display.

### Gallery

The public gallery displays restaurant images. Administrators manage image title, URL, category, active state, alt text, and display order.

---

## Menu and Category Management

### Menu Item Management

Menu item management supports:

- Create menu items.
- Edit menu item information.
- Set price and discount price.
- Assign SKU.
- Select category.
- Add description and kitchen notes.
- Add image URL.
- Set calories and preparation metadata.
- Set dietary types.
- Assign allergens.
- Activate or deactivate menu items.
- Delete menu items when allowed.
- Open recipe and ingredient cost management.

### Example Menu Item

```text
Name: Truffle Parmesan Fries
SKU: SIDE-TRUFFLE-FRIES
Category: Sides
Price: $8.50
Dietary: Vegetarian
Status: Active
```

### Category Management

Categories organize menu items and support POS/menu filtering.

Category capabilities include:

- Create category.
- Edit category name and description.
- Set active/inactive status.
- Set image and sort order.
- Set category bucket such as meals, drinks, desserts, or sides.
- Prevent deletion while menu items still belong to the category.

### Menu Lifecycle

```text
Create category
   -> Create menu item
   -> Assign category and allergens
   -> Define recipe
   -> Map ingredients
   -> Publish item
   -> Sell through public menu or POS
```

---

## Recipe and Ingredient Cost Mapping

Recipe management is intentionally separated into two concepts.

### Recipe Definition

The Recipe tab defines what one menu unit requires without requiring an inventory mapping.

Example:

```text
Menu item: Truffle Parmesan Fries

Recipe ingredient       Quantity per unit       Unit
Russet Potatoes         250                     gram
White Truffle Oil       5                       ml
Aged Parmigiano          20                      gram
Salt                    3                       gram
Black Pepper            1                       gram
Fresh Parsley           3                       gram
Frying Oil              500                     ml
```

This means a recipe can be created even when `Burger Bun`, `Russet Potatoes`, or another ingredient has not yet been created in inventory.

### Ingredient Mapping and Cost

The Ingredient Mapping & Cost tab connects each recipe row to an inventory item.

```text
Recipe row: Russet Potatoes (250 gram)
Choose inventory item: Russet Potatoes
Current stock: 10 kg
Unit price: $0.24 / kg
Cost per menu unit: $0.06
```

### Unit Conversion

Recipe quantity and inventory price may use different units. The system converts compatible units before calculating cost.

Supported conversion groups include:

```text
1000 gram = 1 kg
1000 ml = 1 L
1 unit = 1 piece
```

Formula:

$$
IngredientCost = ConvertedRecipeQuantity \times InventoryUnitPrice
$$

Example:

```text
250 gram potatoes × $0.24 per kg
= 0.25 kg × $0.24
= $0.06
```

Incompatible units such as gram-to-litre are rejected instead of producing a misleading cost.

### Recipe History

Each save creates a new immutable recipe version:

```text
Version 1
Version 2
Version 3 - Active
```

History preserves:

- Ingredient names.
- Quantity per menu unit.
- Unit.
- Change note.
- Created date.
- Active version status.

### Data Model

```text
MenuItem
  -> MenuRecipe
       -> MenuRecipeIngredient
            -> optional MenuRecipeMapping
                 -> InventoryItem
```

### Recipe Cost Summary

The mapping view shows:

- Current stock.
- Inventory unit.
- Unit price.
- Converted required quantity.
- Cost per menu unit.
- Total recipe cost.
- Number of mapped ingredients.

---

## Customer Management

Customer management is separate from internal staff/user management.

Capabilities include:

- View registered customers.
- Search customer information.
- Review customer order-related information.
- Manage customer records according to role permissions.
- Keep customer-specific dashboard data protected.

Customer identity is linked to Firebase identity and internal database records where applicable.

---

## User Management and Permissions

### User Management

Administrators can manage system users and staff accounts.

Capabilities include:

- View users.
- Update name and phone.
- Update role.
- Activate or deactivate accounts.
- Manage email verification requirement.
- Delete users where allowed.
- Update staff passwords through protected administrative workflows.

### Permission Management

The permission system supports module-level access grants.

Modules include areas such as:

- Suppliers
- Inventory
- Employees
- Orders
- Attendance
- POS
- Menu
- Users

Managers can request or receive approved module access according to the authorization policy. Admin users can approve or reject access grants.

---

## Order Management

### Order Sources

Orders may come from:

- Public customer checkout.
- Admin order management.
- POS order entry.
- Cashier workflows.
- Dine-in service.
- Takeaway.
- Delivery.

### Order Data

An order contains information such as:

- Order number.
- Order type.
- Status.
- Payment status.
- Payment method.
- Customer information where applicable.
- Table number for dine-in.
- Delivery address for delivery.
- Notes.
- Subtotal, tax, service charge, discount, and total.
- Order items and quantities.
- Creation and completion timestamps.

### Order Status

The system supports operational states such as:

```text
PREPARING
SERVED
OUT_FOR_DELIVERY
RECEIVED
COMPLETED
CANCELLED
```

The allowed transition depends on order type. For example, a delivery order follows a different path from a dine-in order.

### Payment Rules

Payment timing differs by order type:

- Takeaway and delivery may pay at creation.
- Dine-in may pay later at completion.
- Payment status does not automatically imply fulfillment status.

Cancelled orders are excluded from most sales reporting and forecasting calculations.

---

## POS and Kitchen Operations

### POS Home and Dashboard

The POS area is optimized for active restaurant service. It provides quick access to menu items, tables, staff views, orders, and floor distribution.

### POS Menu

Cashiers or POS operators can:

- Browse menu buckets.
- Select menu items.
- Add quantities.
- Add notes or modifiers supported by the workflow.
- Review totals.
- Choose order type.
- Submit the order.

### Floor Plan

The floor plan helps staff understand table layout and dine-in service distribution.

### Staff View

The POS staff view helps assign or identify staff involved in service.

### POS Order Management

Operators can review active orders and update operational state. Order detail pages show item quantities, progress, customer/table context, payment state, and preparation information.

### Kitchen Queue

The kitchen queue shows orders that need preparation. It supports a kitchen-focused workflow instead of forcing kitchen staff to use the full admin interface.

### Customer Token Display

The customer display shows order tokens or ready-order information to customers in the restaurant.

### Cashier Settings

Cashier settings manage the active cashier and POS-related settings such as tax, service charge, printing behavior, and POS configuration.

### Receipt Preview

Receipt preview formats order details for printing or review, including item lines, quantities, totals, payment information, and restaurant details.

---

## Inventory Management

Inventory management tracks stock items and stock movement.

### Inventory Item Data

An inventory item can contain:

- Name.
- SKU.
- Unit.
- Category.
- Current stock.
- Minimum threshold.
- Cost per unit.
- Optional supplier reference.
- Image.

### Stock Status

The UI derives a stock status from current stock and minimum threshold:

```text
Out of stock: current stock <= 0
Low stock: current stock <= minimum threshold
In stock: current stock > minimum threshold
```

### Stock Movements

Supported movement types include:

- `RESTOCK`
- `USAGE`
- `WASTE`
- `ADJUSTMENT`

Every adjustment should include a reason or note where appropriate.

### Inventory Usage Reports

Inventory usage reports summarize daily and monthly usage for an item. These reports support purchasing decisions and future anomaly detection.

### Procurement Connection

When a purchase order is received:

1. Purchase order item received quantities are updated.
2. Restock movements are created.
3. Inventory current stock is incremented.
4. The purchase order becomes received.
5. Delivered date and total amount are recorded.

The receive workflow is transactional so partial updates do not leave the system in an inconsistent state.

---

## Supplier and Procurement Management

### Supplier Directory

Supplier records include:

- Supplier name.
- Category.
- Contact person.
- Email.
- Phone.
- Address.
- Rating.
- Active/inactive state.

### Supplier Profile

The supplier profile aggregates:

- Total received spend.
- Last delivery.
- Fulfillment rate.
- Product quality score.
- On-time delivery rate.
- Demand fulfillment.
- Shortage information.
- Received order count.

### Supplier Performance

Performance analysis can compare suppliers and export report rows. It considers received orders, ratings, quantities, spend, and delivery timing.

### On-Time Delivery Rule

Delivery is compared by calendar date rather than timestamp.

If the expected date and delivered date are the same calendar day, the delivery is on time even if the delivery was recorded later in the day.

Example:

```text
Expected: 2026-09-05 00:00
Delivered: 2026-09-05 15:30
Result: On time
```

### Procurement Tracking

Procurement tracking supports:

- Creating purchase orders.
- Adding purchase order items.
- Setting expected dates.
- Tracking pending and shipped orders.
- Receiving full or partial quantities.
- Recording received unit prices.
- Updating stock automatically.
- Viewing supplier delivery performance.

### Supplier Catalog and Contacts

Supplier catalog management maintains supplier-side product information. Contact directories help staff reach suppliers quickly during purchasing operations.

---

## Employee and Attendance Management

### Employee Management

Employee management supports:

- Staff creation.
- Staff role and title.
- Phone and email.
- Avatar.
- System access flag.
- Active status.
- Online/location information.
- Hourly rate.
- Schedule start and end time.
- Schedule label.

### Staff Scheduling

The system supports standing schedules and open shifts for additional coverage.

Open shifts can include:

- Date.
- Start time.
- End time.
- Label.
- Required role.
- Staff assignments.

### Daily Attendance

Attendance tracks:

- Check-in.
- Check-out.
- Regular hours.
- Regular wage.
- Open shift attendance.
- Open shift hours and wage.
- Bonus.
- Total wage.

### Wage Reports

Wage reports support weekly, monthly, and yearly summaries. Historical wage data uses attendance records and rate snapshots so later rate changes do not rewrite historical payroll calculations.

### Employee Schedule View

Managers can view staff schedules, open shifts, assignments, and attendance-related information from dedicated schedule screens.

---

## Reports and Business Intelligence

### Reports Overview

The reports module provides:

- Revenue summary.
- Order count.
- Average order value.
- Daily revenue and order series.
- Category performance.
- Top dishes.
- Order type distribution.

Reports filter out cancelled orders and use paid order rules where appropriate.

### Example Report

```text
Period: 2026-08-01 to 2026-08-31
Revenue: $18,420.00
Orders: 742
Average order value: $24.82
Top item: Chicken Burger
Top order type: DELIVERY
```

### Demand Forecasting

The demand forecast predicts menu item quantities for tomorrow and the next seven days.

The forecast uses:

- Historical sales.
- Weekday behavior.
- Recent average demand.
- Recent trend.
- Confidence based on available history.

Example:

```text
Chicken Burger
Tomorrow: 42 units
Next 7 days: 286 units
Confidence: 84%
```

Forecasting supports:

- Preparation planning.
- Stockout reduction.
- Waste reduction.
- Staff planning.
- Purchasing decisions.

### Recipe-Based Future Forecasting

Once recipe rows are mapped to inventory items, a menu forecast can become an ingredient forecast.

```text
Forecast: 45 Chicken Burgers
Recipe: 120g chicken per burger
Required chicken: 5.4kg
```

This creates the foundation for smart reorder recommendations and kitchen preparation planning.

---

## AI and Intelligent Features

### Controlled Business Assistant

The Business Assistant is an internal manager-facing feature. It uses a separate route and service boundary:

```text
POST /assistant/ask
```

Current supported questions include:

- Revenue summary.
- Top-selling menu item.
- Average order value.
- Most popular order type.

The current implementation is controlled and read-only. It does not give an external AI model unrestricted database access.

### Business Assistant Flow

```text
Manager question
   -> Input validation
   -> Allowlisted intent detection
   -> Read-only business query
   -> Structured result
   -> Human-readable answer
```

### Security Rules

The assistant:

- Requires an authorized management role.
- Limits question length.
- Accepts only supported intents.
- Reads aggregated order information.
- Does not create or update records.
- Does not execute raw SQL from a user question.
- Does not expose customer-sensitive fields.

### Recipe Cost Intelligence

Recipe mapping provides the data required for future intelligence features:

- Food cost analysis.
- Margin analysis.
- Ingredient shortage detection.
- Waste comparison.
- Menu engineering.
- Forecasted ingredient requirements.

### Planned AI Features

Potential future features include:

- Waste and anomaly detection.
- Smart reorder recommendations.
- Daily manager briefing.
- Root cause analysis.
- Review sentiment analysis.
- Recipe cost drift detection.
- Supplier risk intelligence.
- Staff scheduling recommendations.
- What-if business simulation.
- External LLM-powered operations copilot.

External AI APIs should be called only from the backend. Aggregated, non-sensitive business data should be sent instead of raw database access.

---

## Reservations, Reviews, Gallery, and Inquiries

### Reservation Management

Administrators can view reservation requests, filter by status/date, update status, add admin notes, and complete or cancel reservations.

### Review Administration

Review management supports:

- Pending review moderation.
- Approve/reject actions.
- Show on home setting.
- Review display ordering.
- Food, service, and ambience rating visibility.

### Gallery Administration

Gallery management supports:

- Image title.
- Image URL.
- Alt text.
- Category such as interior, food, or moments.
- Sort order.
- Active/inactive status.

### Inquiry Management

The inquiry module helps administrators review and respond to customer inquiries from the restaurant website.

---

## Complete Business Workflow

### Customer Order Workflow

```text
Customer opens website
   -> Browses menu
   -> Selects items
   -> Adds items to cart
   -> Signs in or verifies access
   -> Checks out
   -> Backend creates order
   -> POS/admin receives order
   -> Kitchen prepares order
   -> Order is served or dispatched
   -> Customer tracks status
   -> Order is completed
```

### Dine-In Workflow

```text
Staff opens POS
   -> Selects table and order type
   -> Adds menu items
   -> Sends order to kitchen
   -> Kitchen prepares items
   -> Order is served
   -> Customer pays at completion
   -> Cashier completes order
```

### Delivery Workflow

```text
Customer submits delivery order
   -> Payment/order validation
   -> Kitchen preparation
   -> Order marked out for delivery
   -> Delivery handoff
   -> Customer receives order
   -> Order marked received/completed
```

### Procurement Workflow

```text
Manager reviews low stock
   -> Selects supplier
   -> Creates purchase order
   -> Sets expected delivery date
   -> Supplier ships order
   -> Staff receives order
   -> Received quantities are recorded
   -> Stock movements are created
   -> Inventory is incremented
   -> Supplier performance updates
```

### Recipe and Cost Workflow

```text
Manager opens Menu Item Management
   -> Selects a menu item
   -> Creates recipe version
   -> Adds ingredient names and per-unit quantities
   -> Opens Ingredient Mapping & Cost
   -> Selects inventory items
   -> System shows current stock and price
   -> Unit conversion is applied
   -> Ingredient costs are calculated
   -> Total menu-unit cost is shown
   -> Mapping is saved
   -> Recipe history remains available
```

### Employee Workflow

```text
Admin creates staff account
   -> Assigns role and access
   -> Defines schedule
   -> Creates or assigns open shifts
   -> Staff checks in/out
   -> Attendance calculates hours and wage
   -> Wage reports aggregate historical records
```

---

## Project Structure

```text
client-main/my-app/
├── public/
├── src/
│   ├── api/
│   │   ├── authFetch.ts
│   │   ├── authorization.ts
│   │   ├── assistant.ts
│   │   ├── demandForecast.ts
│   │   ├── employee.ts
│   │   ├── gallery.ts
│   │   ├── inquiry.ts
│   │   ├── inventory.ts
│   │   ├── order.ts
│   │   ├── recipe.ts
│   │   ├── report.ts
│   │   ├── reservationAdmin.ts
│   │   ├── reservations.ts
│   │   ├── reviewAdmin.ts
│   │   └── reviews.ts
│   ├── components/
│   │   ├── Admin/
│   │   ├── Authentication/
│   │   ├── Home/
│   │   ├── POS/
│   │   ├── Products/
│   │   ├── Others/
│   │   └── supplier/
│   ├── Firebase/
│   ├── Routes/
│   │   └── Routes.tsx
│   ├── pages/
│   ├── types/
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── package.json
├── vite.config.ts
├── tsconfig.app.json
├── tsconfig.node.json
└── README.md
```

### Backend Structure

```text
server/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── auth.ts
│   ├── assistantRoutes.ts
│   ├── assistantService.ts
│   ├── employeesRoutes.ts
│   ├── forecastRoutes.ts
│   ├── galleryRoutes.ts
│   ├── inquiryRoutes.ts
│   ├── inventoryRoutes.ts
│   ├── menuRoutes.ts
│   ├── ordersRoutes.ts
│   ├── reportRoutes.ts
│   ├── reservationRoutes.ts
│   ├── reviewRoutes.ts
│   ├── server.ts
│   └── prisma.ts
├── package.json
└── prisma.config.ts
```

### Main Route Groups

```text
/                         Public website
/POS                      POS workspace
/pos-koh                  Kitchen/POS operational workspace
/admin                    Management workspace
/admin/menu               Menu and category tools
/admin/orders             Order management
/admin/reports            Reports
/admin/demand-forecast    Demand forecast
/admin/menu-item-manage   Menu item and recipe management
```

---

## Core Features

The core platform features are:

- Firebase authentication.
- Role-based management access.
- Module-based permission grants.
- Public menu browsing.
- Customer cart and checkout.
- Dine-in, takeaway, and delivery orders.
- POS menu and order workflows.
- Kitchen queue.
- Customer token display.
- Menu item and category management.
- Recipe version history.
- Ingredient mapping and cost calculation.
- Inventory and stock movement management.
- Supplier and purchase order management.
- Employee schedules and attendance.
- Wage reporting.
- Revenue and sales reports.
- Demand forecasting.
- Reservation management.
- Review moderation.
- Gallery management.
- Inquiry management.
- Business assistant foundation.

---

## All Implemented Feature Areas

### Authentication

- Customer registration and login.
- Management login.
- POS login.
- Supplier login.
- Email verification flows.
- Password reset and resend verification.
- Access gates for protected route groups.

### Administration

- Admin overview.
- User management.
- Customer management.
- Permission management.
- Employee management.
- Staff scheduling.
- Daily attendance.
- Wage reports.
- Floor distribution.
- Cashier settings.

### Menu and Content

- Menu item creation/editing.
- Category management.
- Recipe management.
- Ingredient mapping and cost.
- Recipe history.
- Public menu preview.
- Full menu.
- Gallery administration.
- Reviews administration.
- Inquiry administration.

### Orders and POS

- Order management.
- POS dashboard.
- POS menu.
- POS order management.
- POS floor plan.
- Staff view.
- Floor live distribution.
- Kitchen queue.
- Customer token display.
- Receipt preview.
- Invoice history.

### Inventory and Suppliers

- Inventory item management.
- Stock adjustment.
- Stock movement history.
- Usage reports.
- Supplier directory.
- Supplier profile.
- Supplier performance.
- Supplier contact directory.
- Supplier catalog management.
- Procurement tracking.
- Purchase orders.
- Receiving workflow.

### Intelligence

- Revenue reports.
- Menu demand forecasting.
- Recipe cost foundation.
- Controlled business assistant.
- Unit-aware ingredient cost calculation.
- Supplier on-time delivery calculation.

---

## Optimization Work

### Authenticated API Wrapper

The shared `authFetch` helper avoids repeating token retrieval logic in every API module and keeps authentication behavior consistent.

### Route-Level Code Organization

Features are separated into route and service modules such as menu, inventory, orders, forecasts, reports, assistant, employees, reservations, reviews, and gallery.

### Transactional Inventory Updates

Purchase receiving updates purchase order items, stock movements, inventory quantities, and order status atomically.

Transaction timeouts were explicitly increased for larger receiving and mapping operations, and bulk operations use `createMany` where appropriate.

### Unit-Aware Costing

Recipe cost calculations convert compatible units before multiplication:

- Gram to kilogram.
- Milliliter to litre.
- Unit to piece.

This prevents errors such as multiplying grams directly by a per-kilogram price.

### Recipe and Mapping Separation

Recipe definition is independent from inventory mapping. This allows the manager to document a dish before an inventory item exists.

### Snapshot-Based Cost History

Mapping records preserve unit price snapshots and ingredient costs so historical recipe versions are not silently changed when inventory prices change.

### Cancelled Order Exclusion

Reports and forecasts exclude cancelled orders to prevent invalid demand and revenue values.

### Date-Only Delivery Comparison

Supplier on-time delivery uses calendar-date comparison. A delivery recorded later on the expected date still counts as on time.

### Responsive Operational Tables

Wide tables use horizontal overflow containers rather than forcing the whole page to expand. Dashboard layouts use constrained grid columns and minimum-width guards.

### Explicit Loading and Error States

Major screens provide loading, empty, error, and refresh states instead of leaving the user with a blank interface.

### Role-Specific Workspaces

Admin, POS, supplier, and customer experiences are separated so each user sees the workflow relevant to their job.

---

## Difficult Problems and Solutions

### 1. Keeping Frontend and Backend Authorization Consistent

**Problem:** Hiding a navigation link does not secure an API.

**Solution:** The frontend uses access gates for user experience, while the backend verifies Firebase tokens and enforces roles/modules before executing protected routes.

### 2. Recipe Ingredients Without Existing Stock

**Problem:** A recipe may require an ingredient that has not yet been purchased or created in inventory.

**Solution:** Recipe definitions store ingredient name, quantity, and unit independently. Inventory mapping is optional and happens later.

### 3. Incorrect Cost from Mixed Units

**Problem:** Multiplying `250 gram` by `$0.24/kg` directly creates a wrong cost.

**Solution:** Compatible units are normalized before calculation. Incompatible units are rejected.

### 4. Preserving Recipe History

**Problem:** Editing a recipe in place destroys the historical cost and ingredient definition.

**Solution:** Each save creates a new version and activates it while leaving old versions available for review.

### 5. Prisma Transaction Expiration

**Problem:** Sequential operations inside interactive transactions can exceed Prisma's default timeout, producing `P2028 Transaction not found`.

**Solution:** Large operations use explicit transaction timeout settings and bulk `createMany` writes where possible.

### 6. Same-Day Supplier Delivery Marked Late

**Problem:** Expected dates are often stored at midnight while delivered dates contain the current time. Timestamp comparison incorrectly marks same-day delivery late.

**Solution:** On-time delivery compares normalized calendar dates rather than exact timestamps.

### 7. Connecting Operational Modules

**Problem:** Orders, inventory, suppliers, and employees have different lifecycle rules.

**Solution:** Each domain has a focused route/API model while shared identifiers and transactions connect the workflows.

### 8. Large Management Screens

**Problem:** Admin screens can become difficult to scan when forms, tables, filters, and actions are combined.

**Solution:** Dedicated screens, modals, tabs, grouped categories, responsive tables, and compact status controls keep workflows focused.

---

## Testing and Validation

### Static Validation

Use editor diagnostics or TypeScript checks for touched files.

```bash
cd server
npx tsc --noEmit
```

For the client:

```bash
cd client-main/my-app
npm run build
```

### Manual Validation Checklist

#### Authentication

- Sign in as Admin.
- Sign in as Manager.
- Try a protected route without authentication.
- Verify Demo Admin read-only behavior.

#### Menu and Recipe

- Create a menu item.
- Open recipe management.
- Create recipe rows without inventory mappings.
- Map a recipe row to an inventory item.
- Verify stock and price display.
- Verify gram/kg and ml/L conversion.
- Save a new version.
- Confirm old version remains in history.

#### Inventory and Procurement

- Create inventory item with zero stock.
- Create purchase order.
- Mark order shipped.
- Receive order.
- Confirm stock and stock movement update.
- Verify same-day expected/delivered date counts as on time.

#### Orders and POS

- Create dine-in order.
- Create takeaway order.
- Create delivery order.
- Move order through valid status transitions.
- Confirm kitchen queue and token display.
- Confirm cancelled order is excluded from reports.

#### Reports and Forecasting

- Open report overview.
- Verify daily revenue series.
- Verify top dishes and order types.
- Open demand forecast.
- Check empty-history behavior.

---

## Future Optimization

### Backend

- Add automated tests for route contracts and transaction behavior.
- Add request schemas with Zod or another server-side validation library.
- Add centralized error handling.
- Add request IDs and structured logging.
- Add pagination to all large management queries.
- Add database indexes based on query plans.
- Move large report aggregation into optimized SQL or materialized views.
- Add idempotency keys for payment and stock operations.
- Add audit logs for sensitive management changes.

### Frontend

- Add route-level lazy loading.
- Standardize reusable table, modal, form, and status components.
- Add TanStack Query caching and invalidation to more modules.
- Improve optimistic updates for small state changes.
- Add accessibility tests.
- Add keyboard navigation for POS workflows.
- Add mobile-specific POS layouts.

### Data Quality

- Standardize all units and currency formatting.
- Add validation for incompatible inventory and recipe units.
- Add historical price and supplier-price records.
- Add recipe mapping completeness indicators.
- Add data-quality warnings to reports.

---

## Future Improvements

### AI and External APIs

A future external AI integration should follow this architecture:

```text
Manager question
   -> Backend intent/tool selection
   -> Safe aggregated data query
   -> External LLM API
   -> Validated answer
   -> Manager UI
```

The external provider should never receive database credentials or unrestricted query access.

Potential improvements:

- Bengali and mixed Bengali-English questions.
- Root-cause analysis.
- Daily manager briefing.
- Waste and anomaly detection.
- Smart reorder recommendation.
- Kitchen preparation assistant.
- Recipe cost drift detection.
- Supplier risk intelligence.
- Review sentiment analysis.
- Staff scheduling recommendation.
- What-if price and promotion simulation.

### Recipe and Inventory

- Recipe batch yield.
- Recipe modifiers and add-ons.
- Combo item recipes.
- Ingredient substitutions.
- Waste percentage per ingredient.
- Automatic usage deduction after confirmed orders.
- Stock shortage forecast from menu demand.
- Multi-supplier price comparison.

### Business Intelligence

- Menu engineering matrix: Star, Plow Horse, Puzzle, Dog.
- Margin trend by menu item.
- Promotion effectiveness.
- Customer retention and churn analysis.
- Service bottleneck prediction.
- Supplier lead-time prediction.
- Forecast accuracy tracking.

### Operations

- Multi-location support.
- Multi-currency support.
- Tax configuration by location.
- Offline POS mode.
- Printer and kitchen display integrations.
- Delivery partner integrations.
- Notification and SMS integrations.
- Scheduled report delivery.

---

## Summary

This restaurant platform brings public ordering, customer experience, POS operations, kitchen workflows, administration, inventory, procurement, employee management, reporting, forecasting, recipe costing, and intelligent decision support into one system.

The most important design principles are:

- Keep the backend as the security boundary.
- Separate recipe definitions from inventory mappings.
- Preserve historical versions and price snapshots.
- Use transactions for multi-step stock operations.
- Convert units before calculating cost.
- Treat reports and forecasts as decision support.
- Keep future AI integrations tool-controlled and privacy-aware.

The current system provides the operational foundation needed to add deeper automation and AI features without giving up data integrity or management control.
