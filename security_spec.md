# Firestore Security Specification

This document details the security specification, invariants, and threat-modeling payloads (the "Dirty Dozen") for the Aureum Barber Shop salon application.

## 1. Data Invariants

1. **Haircuts Data Integrity**: Haircuts can only be added, updated, or deleted by verified administrative accounts. They are publicly readable.
2. **Bookings Placement Relational Sync**: A booking can be created by any user (authenticated or unauthenticated), but it *must* reference a real, existing `haircutId` in the `haircuts` collection.
3. **Admin Privilege Verification**: Administrative actions are barred from the client layer unless the user UID exists in the read-only `/admins/{userId}` pathway.
4. **PII and Booking Confidentiality**: Complete booking listings (collection list) can only be accessed by admins. Individual bookings can be fetched if the viewer knows the unique, cryptographically secure booking ID.
5. **Review Relational Sync**: A review can be submitted for a haircut only if that haircut actually exists in the database.
6. **No Rating Manipulation**: Reviews must have a rating integer strictly bounded between 1 and 5.
7. **Temporal Integrity**: All client-submitted entries require valid string timestamps representing date/time properties.

---

## 2. The "Dirty Dozen" Threat Payloads

Here are 12 specific payloads demonstrating unauthorized or malicious actions that our `firestore.rules` must successfully block with `PERMISSION_DENIED`.

### Attack 1: Unauthenticated user trying to create a haircut style
- **Collection**: `haircuts/bob_cut`
- **Identity**: Unauthenticated
- **Payload**:
  ```json
  { "id": "bob_cut", "name": "Classic Bob", "description": "Beautiful cut", "category": "women", "imageUrl": "https://images.example/bob.webp", "price": 45, "duration": 30 }
  ```
- **Reason to Deny**: Only admins can write to `haircuts`.

### Attack 2: Normal user trying to delete a haircut style
- **Collection**: `haircuts/modern_fade`
- **Identity**: Authenticated (non-admin)
- **Payload**: Delete operation
- **Reason to Deny**: Normal users are not permitted to delete catalog entries.

### Attack 3: Booking with non-existent haircutId
- **Collection**: `bookings/book_999`
- **Identity**: Unauthenticated
- **Payload**:
  ```json
  { "customerName": "Alice", "customerEmail": "alice@example.com", "customerPhone": "123456", "haircutId": "fake_cut_id_999", "haircutName": "Imaginary Cut", "bookingDate": "2026-06-01", "bookingTime": "10:00", "status": "pending", "createdAt": "2026-05-26T19:04:16Z" }
  ```
- **Reason to Deny**: Fails `exists()` check for `/databases/$(database)/documents/haircuts/fake_cut_id_999`.

### Attack 4: Self-confirming appointment booking
- **Collection**: `bookings/book_101`
- **Identity**: Unauthenticated
- **Payload**:
  ```json
  { "customerName": "Bob", "customerEmail": "bob@example.com", "customerPhone": "222222", "haircutId": "valid_cut", "haircutName": "Classic Fade", "bookingDate": "2026-06-02", "bookingTime": "11:00", "status": "confirmed", "createdAt": "2026-05-26T19:04:16Z" }
  ```
- **Reason to Deny**: Users cannot self-confirm bookings; initial status must undergo admin review (or start as pending, or we validate fields).

### Attack 5: Unbounded long customer name (Denial of Wallet / Buffer)
- **Collection**: `bookings/book_102`
- **Identity**: Unauthenticated
- **Payload**:
  ```json
  { "customerName": "A".repeat(5000), "customerEmail": "bob@example.com", "customerPhone": "222222", "haircutId": "valid_cut", "haircutName": "Fade", "bookingDate": "2026-06-02", "bookingTime": "11:00", "status": "pending", "createdAt": "2026-05-26T19:04:16Z" }
  ```
- **Reason to Deny**: Exceeds size limits (max 100 chars).

### Attack 6: Review rating value overflow
- **Collection**: `reviews/rev_1`
- **Identity**: Unauthenticated
- **Payload**:
  ```json
  { "customerName": "Jane", "rating": 6, "comment": "Amazing", "haircutId": "valid_cut", "createdAt": "2026-05-26T19:04:16Z" }
  ```
- **Reason to Deny**: Rating is 6 (must be <= 5).

### Attack 7: Review rating value underflow
- **Collection**: `reviews/rev_2`
- **Identity**: Unauthenticated
- **Payload**:
  ```json
  { "customerName": "Jane", "rating": -1, "comment": "Terrible", "haircutId": "valid_cut", "createdAt": "2026-05-26T19:04:16Z" }
  ```
- **Reason to Deny**: Rating is -1 (must be >= 1).

### Attack 8: Attempting to bypass schema with unknown fields (Ghost Field Injection)
- **Collection**: `reviews/rev_3`
- **Identity**: Unauthenticated
- **Payload**:
  ```json
  { "customerName": "Jane", "rating": 5, "comment": "Nice", "haircutId": "valid_cut", "createdAt": "2026-05-26T19:04:16Z", "isApprovedBySystem": true }
  ```
- **Reason to Deny**: Shadow field `isApprovedBySystem` injected (fails strict key count check).

### Attack 9: Attempting to query list of all bookings (PII scrapping)
- **Collection**: `bookings` (List query)
- **Identity**: Unauthenticated / Authenticated non-admin
- **Payload**: Try to get all bookings
- **Reason to Deny**: Only admins can run collection queries on bookings due to private user detail containment.

### Attack 10: Invariant violation during update of booking status (by arbitrary user to arbitrary value)
- **Collection**: `bookings/book_v1`
- **Identity**: Authenticated non-admin
- **Payload**:
  ```json
  { "status": "completed" }
  ```
- **Reason to Deny**: Non-admins are only allowed to modify `'status'` to `'cancelled'`.

### Attack 11: Malicious document ID injection (Poisoning)
- **Collection**: `bookings/very-long-poisonous-id-hundreds-of-chars-and-unicode`
- **Identity**: Unauthenticated
- **Payload**: Valid booking payload
- **Reason to Deny**: Poisonous document ID exceeds permissible ID size and pattern match.

### Attack 12: Changing immutable fields on updates
- **Collection**: `bookings/book_v2`
- **Identity**: Unauthenticated / Authenticated non-admin
- **Payload**:
  ```json
  { "customerName": "Different Name", "customerEmail": "hacker@example.com", "haircutId": "valid_cut", "haircutName": "Fade", "bookingDate": "2026-06-02", "bookingTime": "11:00", "status": "cancelled", "createdAt": "2026-05-26T19:04:16Z" }
  ```
- **Reason to Deny**: Customer details, booking datetime, etc. are immutable for non-admins; only the `'status'` field can be updated to `'cancelled'`.
