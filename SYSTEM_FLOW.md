# System Architecture & User Journey Report

## 1. User Journey (New Client)
The onboarding flow is **Manual-Approval Based**. Users cannot instantly login after registration.

1.  **Registration (The "Lead" Phase)**
    *   **Route:** `/register`
    *   **Action:** User fills form (Name, Email, WhatsApp, Domain).
    *   **System Logic:**
        *   Creates a `Lead` record in database (Status: PENDING).
        *   Sends **WhatsApp Notification** to Admin (Mohd Ahmad).
        *   Show "Verification Pending" screen to user.
    *   **Gap:** No user account is created at this stage. Login is impossible.

2.  **Verification (The "Offline" Phase)**
    *   **Action:** Admin manually contacts user via WhatsApp for KYC (Aadhar/Business Proof).
    *   **Approval:** Admin logs into Dashboard (`/dashboard/leads`), reviews lead, and clicks **"Approve"**.
    *   **System Logic:**
        *   Converts `Lead` -> `Client` (User).
        *   Generates a **License Key**.
        *   Sends **Welcome WhatsApp & Email** to Client containing the License Key.

3.  **Access (The "Client" Phase)**
    *   **Route:** `/client/login`
    *   **Auth Method:** **OTP-based** (No Password). Checks if Email + Domain matches an active License.
    *   **Redirect:** Success -> `/client/dashboard`.

4.  **Dashboard Experience**
    *   **Route:** `/client/dashboard`
    *   **Key Actions:**
        *   View Threat Stats ("Threats Neutralized").
        *   Download Security Certificate.
        *   Complete/Update KYC (`/client/kyc` -> `/client/dashboard` upon completion).
        *   View Tamper Logs (Security Alerts).

## 2. Admin Journey
The Admin system is split into two distinct interfaces: **Management** and **Intelligence**.

1.  **Authentication**
    *   **Route:** `/login`
    *   **Auth Method:** Email + Password.
    *   **Redirect:** Default NextAuth redirect (likely `/dashboard`).

2.  **Management Dashboard (`/dashboard`)**
    *   **Focus:** Business Operations.
    *   **Key Features:**
        *   **Leads:** Approve/Reject new registrations.
        *   **Clients/Licenses:** manage expirations, renewals, and suspensions.
        *   **KYC Centre:** Review uploaded documents.

3.  **Intelligence Dashboard (`/admin/dashboard`)**
    *   **Focus:** Security & Monitoring (The "War Room").
    *   **Key Features:**
        *   **Live Attack Feed:** Real-time pusher events.
        *   **Prisoner List:** Manage banned IPs.
        *   **Global Blacklist:** Manage system-wide blocks.
        *   **System Health:** Server uptime and status.

## 3. Gaps & Recommendations (The "Forgotten" Items)

| Feature | Status | Observation |
| :--- | :--- | :--- |
| **Instant Onboarding** | ❌ **Missing** | Users expect to login immediately after signup. Currently, they hit a dead-end until Admin manually approves. |
| **Client Logout** | ⚠️ **Unclear** | `ClientDashboard` (`app/client/dashboard/page.tsx`) does not have a visible "Logout" button in the UI. |
| **Profile Settings** | ❌ **Missing** | Clients cannot change their email or phone number. They depend on Admin to update records. |
| **Navigation Consistency** | ⚠️ **Split** | Two Admin dashboards (`/dashboard` vs `/admin/dashboard`) may cause workflow fragmentation. |
| **Client Notifications** | ⚠️ **Partial** | Clients see "Tamper Logs" but lack a dedicated notification center for dull system alerts (e.g., "Maintenance Scheduled"). |

## 4. Route Map Summary
*   **Public:** `/register`, `/login`, `/client/login`, `/pricing`, `/docs`
*   **Client:** `/client/dashboard`, `/client/kyc`
*   **Admin (Mgmt):** `/dashboard`, `/dashboard/leads`, `/dashboard/clients`
*   **Admin (Intel):** `/admin/dashboard`, `/admin/security`, `/admin/licenses`
