# UoK Awurudu Web App: Antigravity Implementation Guide

## 🎯 Project Scope
A secure, university-exclusive platform for the **University of Kelaniya** containing an OTP-locked portal, a pageant voting system, and an interactive **Image Puzzle** game.

## 🔑 Phase 1: University-Only Authentication
**Agent Goal:** Create a gateway that only allows `@stu.kln.ac.lk` and `@kln.ac.lk` emails.

### Antigravity Prompt:
> "Initialize a Next.js project. Create an auth route that accepts an email. Use the regex `/^[a-zA-Z0-9._%+-]+@(stu\.)?kln\.ac\.lk$/` to validate. If valid, generate a 6-digit OTP, store it in Supabase with a 5-minute expiry, and send it to the user using Resend. Create a verification UI to input the code and issue a JWT on success."

---

## 🗳️ Phase 2: Pageant Voting (Kumara & Kumariya)
**Agent Goal:** Build a secure voting dashboard with database constraints to prevent double-voting.

### Antigravity Prompt:
> "Create a voting dashboard for 'Awurudu Kumara' and 'Awurudu Kumariya'. 
> 1. Fetch contestant data (name, bio, photo) from Supabase.
> 2. Create a 'votes' table with a unique constraint on `(user_email, category_id)`.
> 3. Implement a 'Vote' button that updates the database and shows a 'Vote Cast' success state.
> 4. Add a clean, mobile-responsive grid UI using Tailwind CSS."

---

## 🧩 Phase 3: The Game - Awurudu Image Puzzle
**Agent Goal:** Build a "Sliding Tile" or "Swap" puzzle game using a traditional Awurudu-themed image (e.g., an oil lamp or a Rabana).

### Game Logic:
* **Image Selection:** A high-resolution image of a traditional *Pana* (Oil Lamp).
* **Grid Size:** 3x3 (Easy) or 4x4 (Hard).
* **Shuffle:** Randomly swap tiles at the start.
* **Mechanic:** Click two tiles to swap their positions.
* **Win State:** Check if the current tile array matches the original index array.

### Antigravity Prompt:
> "Create a 'Solve the Image Puzzle' game component. 
> 1. Use an image of a 'Traditional Sri Lankan Oil Lamp'.
> 2. Divide the image into a 3x3 grid of tiles.
> 3. Implement a 'Shuffle' function that scrambles the tiles.
> 4. Allow users to click two tiles to swap them.
> 5. When the image is correctly reconstructed, trigger a 'Victory' animation and save the completion time to the user's profile in the database."

---

## 🛠️ Deployment & Verification
**Agent Goal:** Use the Browser Agent to ensure the flow is seamless.

### Antigravity Prompt:
> "Run the dev server. Use the Browser Agent to:
> 1. Attempt to login with a non-university email (should fail).
> 2. Login with a test 'stu.kln.ac.lk' email.
> 3. Navigate to the Image Puzzle and verify that tiles can be swapped.
> 4. Verify that the voting button disables after a vote is cast."

## 📂 Technical Stack
* **Framework:** Next.js (App Router)
* **Styling:** Tailwind CSS + Lucide Icons
* **Backend/DB:** Supabase (PostgreSQL)
* **Email:** Resend API
* **State Management:** React 'useState' for puzzle tile tracking.
