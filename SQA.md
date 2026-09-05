# Software Quality Assurance Plan

## 1. Purpose

This document defines a practical Software Quality Assurance (SQA) plan for the Restaurant Management Platform. The goal is to verify that customer ordering, administration, POS, supplier, authentication, reporting, and assistant workflows are reliable, secure, responsive, and maintainable.

The plan is risk-based: test the workflows that can lose money, expose data, create incorrect orders, or block restaurant operations before lower-risk visual details.

## 2. Quality Objectives

- Customers can browse menus, manage carts, apply promotions, and place valid orders.
- Orders contain correct items, quantities, prices, taxes, service charges, discounts, and totals.
- Users can only access the workspace and data allowed by their role or approved access grant.
- Admin, POS, supplier, and customer workflows work at supported desktop and mobile breakpoints.
- Invalid input, failed API requests, empty states, loading states, and expired sessions are handled clearly.
- Database changes are migrated safely and do not break existing business data.
- Release builds pass type checking, linting, and the agreed smoke-test suite.

## 3. Main Quality Risks

| Risk | Impact | Priority |
| --- | --- | --- |
| Unauthorized user accesses admin, POS, supplier, or another user's data | Security and privacy incident | Critical |
| Incorrect order total, promotion, tax, or service charge | Financial loss and customer dispute | Critical |
| Duplicate order caused by repeated submission | Duplicate fulfillment and payment risk | Critical |
| Inventory or procurement update is saved incorrectly | Stock and purchasing errors | High |
| Firebase or API failure leaves the UI in a broken state | Operational interruption | High |
| Responsive layout breaks on mobile | Staff or customer workflow blocked | High |
| Migration changes damage existing records | Data loss or downtime | Critical |
| Report or Business Assistant returns incorrect data | Wrong business decision | High |
| Visual inconsistency or minor spacing issue | Usability and brand quality | Medium |

## 4. Scope

### In Scope

- React page behavior and protected navigation
- Firebase login and session restoration
- Management, POS, supplier, and customer access gates
- Menu loading and item selection
- Cart persistence and quantity updates
- Delivery checkout and promotion validation
- Order creation and order status changes
- Inventory and supplier procurement workflows
- Employee, user, permission, and access-grant workflows
- Reports, forecasts, reviews, reservations, and gallery APIs
- Business Assistant request and read-only response behavior
- Express API validation, authorization, and error handling
- Prisma schema, migrations, seed data, and PostgreSQL integration
- Responsive layout, keyboard access, loading states, empty states, and error states

### Out of Scope Unless Added Later

- Payment-provider settlement reconciliation when only cash checkout is enabled
- Production load testing against real customer traffic
- Third-party Firebase availability itself
- Browser behavior outside the supported browser matrix

## 5. Test Strategy

Use a layered test pyramid. Keep fast tests close to the code and use a small number of realistic end-to-end tests for critical journeys.

### Layer 1: Static Checks

Run these on every pull request:

```bash
cd client-main/my-app
npm run lint
npm run build
```

For the server, run TypeScript compilation using the repository's TypeScript configuration and verify Prisma generation:

```bash
cd server
npx prisma generate
npx tsc --noEmit
```

Static checks should catch type errors, unused imports, invalid JSX, broken route references, and Prisma client drift.

### Layer 2: Unit Tests

Test small, deterministic rules without a browser or real database:

- Currency and total calculations
- Tax and service-charge calculations
- Promotion eligibility and discount limits
- Cart quantity updates and removal behavior
- Order status transition rules
- Date-range query construction
- Role and access-grant decisions
- Input normalization such as email, PIN, and promo-code formatting
- Report aggregation and Business Assistant highlight calculations

Unit tests should include normal values, zero values, empty arrays, invalid values, boundary values, and repeated calls.

### Layer 3: API and Integration Tests

Run the Express server against a test database or isolated database schema. Verify real request, authorization, Prisma, and response behavior.

Important API tests:

- Unauthenticated requests return `401` for protected endpoints.
- Authenticated users without the required role receive `403`.
- Admins can approve or reject access grants.
- Users cannot update or delete another user without permission.
- Invalid enum values, missing fields, malformed IDs, and invalid dates return useful `400` responses.
- Menu, inventory, supplier, order, review, report, reservation, and forecast endpoints return the documented response shape.
- Order creation stores the expected items, quantities, amounts, customer data, and status.
- Duplicate or repeated order submissions are handled safely.
- Promotion validation cannot create a discount larger than the allowed business rule.
- Database errors are converted into safe API responses without exposing secrets or SQL details.

### Layer 4: End-to-End Tests

Use a real browser against a running frontend and backend. E2E coverage should focus on the highest-value journeys:

1. Customer signs in or continues as the supported customer flow.
2. Customer opens the menu and adds multiple items.
3. Cart quantity changes are reflected in the subtotal.
4. Customer applies a valid promo and sees the discount and total update.
5. Customer submits delivery details and places an order.
6. Admin signs in and opens the order-management page.
7. Admin filters orders and verifies order details.
8. POS user signs in, passes POS authorization and PIN, and opens POS.
9. Supplier signs in and opens procurement or directory pages.
10. Admin opens Business Assistant, submits a report question, and sees loading, success, or error states.

## 6. Critical Test Scenarios

### Authentication and Authorization

- Valid login succeeds for an active user.
- Invalid password shows an error and does not expose implementation details.
- Unverified email follows the verification-required flow.
- Inactive or unauthorized users are redirected from protected routes.
- Admin, Manager, Cashier, Supplier, and Customer permissions are enforced.
- Approved and pending access grants produce the expected result.
- Refreshing a protected page restores or rejects the session correctly.
- Logging out clears session storage and prevents protected-page access.

### Menu and Cart

- Public menu loads categories and items.
- Loading, empty, and API-error states are visible.
- Adding an item creates one cart line.
- Adding the same item increases quantity instead of duplicating the line incorrectly.
- Quantity cannot become negative.
- Removing an item updates cart count and subtotal.
- Cart survives a page refresh through local storage.
- Authenticated cart draft synchronization does not overwrite newer local changes unexpectedly.

### Checkout and Promotions

- Empty cart cannot be submitted.
- Name and delivery address are required.
- Optional note is sent only when provided.
- Cash payment selection works; disabled payment methods cannot be selected.
- Promo Apply button shows a loading state and cannot be double-clicked while validating.
- Valid promo displays the discount and updates the grand total.
- Invalid promo clears the applied discount and displays an understandable message.
- Server-calculated order values are trusted over client-only display values.
- Submit button shows a loading state and prevents duplicate requests.
- Successful checkout clears the cart and navigates to the expected destination.
- Failed checkout preserves the entered form data and shows an error.

### Admin and Operations

- Dashboard metrics match API data.
- Order filters return the expected status and date range.
- Inventory changes update the displayed stock state.
- Supplier creation validates required fields.
- Purchase orders require a supplier and valid line items.
- Access-grant approval changes the user's effective permissions.
- Reports handle missing, empty, and populated data.
- Business Assistant is read-only and does not mutate orders, inventory, or users.

### Responsive and Accessibility

Test at minimum:

- 360 x 800 mobile viewport
- 390 x 844 mobile viewport
- 768 x 1024 tablet viewport
- 1280 x 800 desktop viewport
- 1440 x 900 desktop viewport

Check:

- No unintended horizontal overflow.
- Navigation remains usable on mobile.
- Text stays inside cards and buttons.
- Tables have intentional horizontal scrolling when necessary.
- Inputs have visible labels or accessible names.
- Buttons have meaningful accessible labels.
- Keyboard focus is visible.
- Disabled controls communicate their state.
- Color is not the only signal for status or errors.
- Loading and error messages are announced where appropriate.

## 7. Test Data Strategy

Use separate data sets for development, test, staging, and production. Never use production customer data in local or automated tests.

Required test fixtures:

- One Admin user
- One Manager user
- One Cashier/POS user
- One Supplier user
- One Customer user
- One inactive user
- One user with a pending access grant
- Menu categories with and without items
- Inventory items with normal, low, and zero stock
- Valid, expired, and invalid promotion codes
- Orders in each supported status
- Orders with delivery, pickup, completed, and cancelled states
- Empty report periods and populated report periods

Fixtures should be repeatable and resettable. Use stable IDs only inside tests; do not depend on records from a developer's personal database.

## 8. Defect Workflow

Every defect should include:

- Title and affected module
- Environment and browser
- User role
- Exact reproduction steps
- Expected result
- Actual result
- Screenshot, console output, request, and response evidence when useful
- Severity and priority
- Regression risk

Suggested severity levels:

- **Blocker:** prevents release or corrupts important data.
- **Critical:** security, duplicate order, incorrect money, or major authorization failure.
- **Major:** important workflow fails with a practical workaround unavailable.
- **Minor:** limited functional issue with a reasonable workaround.
- **Trivial:** copy, spacing, or low-impact visual issue.

## 9. Release Quality Gates

A release candidate is acceptable when:

- Frontend lint passes.
- Frontend production build passes.
- Server type checking passes.
- Prisma client is generated from the current schema.
- Critical and blocker defects are closed.
- Authentication and authorization smoke tests pass.
- Customer checkout smoke test passes.
- Admin order-management smoke test passes.
- POS login and PIN smoke test passes.
- Supplier procurement smoke test passes.
- No secrets are present in committed source or documentation.
- Responsive checks pass on mobile and desktop.
- Database migration has been reviewed and tested against a backup or disposable database.

## 10. Recommended Execution Order

1. Run static checks and inspect the changed files.
2. Run unit tests for changed calculations or decision rules.
3. Run API authorization and validation tests.
4. Run customer checkout and order-creation integration tests.
5. Run admin, POS, and supplier smoke tests.
6. Run responsive and accessibility checks.
7. Review logs, network requests, and database changes.
8. Record evidence and make the release decision.

## 11. Suggested Tooling

- TypeScript compiler for static type checking
- ESLint for code quality
- Vitest or Jest for unit and API tests
- Supertest for Express endpoint testing
- Playwright for browser and responsive E2E testing
- Prisma migrations and a disposable PostgreSQL database for integration tests
- Firebase Auth emulator for isolated authentication tests
- axe or Lighthouse for accessibility checks
- CI pipeline for lint, build, test, Prisma generation, and migration validation

The exact tool can follow the repository's existing conventions, but the test responsibilities should remain the same.

## 12. QA Evidence Template

```text
Feature:
Environment:
Build/commit:
User role:
Test case:
Steps:
Expected result:
Actual result:
Status: PASS / FAIL / BLOCKED
Evidence:
Defect ID:
Notes:
```

## 13. Definition of Done

A feature is done when its happy path, validation, authorization, loading, empty, error, responsive, and persistence behavior has been tested at the appropriate layer; the implementation passes lint and type checks; documentation is updated when behavior changes; and no critical regression remains open.
