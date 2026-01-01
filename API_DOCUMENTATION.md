# Capital Bridge Nepal - API Documentation

**Version:** 1.0.0
**Last Updated:** January 2025

---

## 🌐 Base URLs

| Environment | URL |
|-------------|-----|
| **Production** | `https://aarthiq.onrender.com` |
| **Development** | `http://localhost:5000` |

> **Note for Frontend Developers:** Use production URL in your app. Development URL is for local testing only.

---

## 📑 Table of Contents

1. [Public APIs](#1-public-apis-no-authentication)
2. [Business Onboarding Flow](#2-business-onboarding-flow)
3. [Admin Panel APIs](#3-admin-panel-apis)
4. [Business Dashboard APIs](#4-business-dashboard-apis)
5. [Authentication](#5-authentication)
6. [Error Handling](#6-error-handling)
7. [Frontend Integration Examples](#7-frontend-integration-examples)

---

## 1. PUBLIC APIS (No Authentication)

### 1.1 Get All Approved Businesses

**Endpoint:** `GET /api/businesses`

**Purpose:** Fetch list of all approved businesses for public browsing

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `categoryId` | UUID | No | - | Filter by business category |
| `page` | Number | No | 1 | Page number for pagination |
| `limit` | Number | No | 20 | Number of items per page |

**Example Request:**
```http
GET https://aarthiq.onrender.com/api/businesses?page=1&limit=10
```

**Success Response:** `200 OK`
```json
{
  "businesses": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Tech Startup Nepal",
      "registrationNumber": "ABC123",
      "categoryId": 1,
      "category": {
        "id": 1,
        "name": "Technology",
        "slug": "technology"
      },
      "businessType": "Pvt. Ltd.",
      "yearEstablished": 2020,
      "location": "Kathmandu",
      "teamSize": "10-50 employees",
      "paidUpCapital": "1000000.00",
      "investmentCapacityMin": "500000.00",
      "investmentCapacityMax": "2000000.00",
      "pricePerUnit": "100.00",
      "expectedReturnOptions": "IPO Exit, Dividend",
      "estimatedMarketValuation": "5000000.00",
      "ipoTimeHorizon": "3-5 years",
      "briefDescription": "Leading tech startup in Nepal",
      "fullDescription": "Detailed description...",
      "vision": "Our vision...",
      "mission": "Our mission...",
      "growthPlans": "Growth plans...",
      "contactEmail": "contact@techstartup.com",
      "contactPhone": "+977-1234567890",
      "website": "https://techstartup.com",
      "facebookUrl": "https://facebook.com/techstartup",
      "linkedinUrl": "https://linkedin.com/company/techstartup",
      "twitterUrl": "https://twitter.com/techstartup",
      "logoUrl": "https://example.com/logo.png",
      "viewCount": 145,
      "isFeatured": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

**Frontend Integration (React):**
```javascript
const fetchBusinesses = async (page = 1, categoryId = null) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: '10'
  });

  if (categoryId) {
    params.append('categoryId', categoryId);
  }

  const response = await fetch(
    `https://aarthiq.onrender.com/api/businesses?${params}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch businesses');
  }

  const data = await response.json();
  return data;
};

// Usage:
const { businesses, pagination } = await fetchBusinesses(1);
```

---

### 1.2 Get Business Detail by ID

**Endpoint:** `GET /api/businesses/:id`

**Purpose:** Get complete details of a specific approved business

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | Business ID |

**Example Request:**
```http
GET https://aarthiq.onrender.com/api/businesses/550e8400-e29b-41d4-a716-446655440000
```

**Success Response:** `200 OK`
```json
{
  "business": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Tech Startup Nepal",
    "registrationNumber": "ABC123",
    "category": {
      "id": 1,
      "name": "Technology",
      "slug": "technology"
    },
    "businessType": "Pvt. Ltd.",
    "yearEstablished": 2020,
    "location": "Kathmandu",
    "teamSize": "10-50 employees",
    "paidUpCapital": "1000000.00",
    "investmentCapacityMin": "500000.00",
    "investmentCapacityMax": "2000000.00",
    "pricePerUnit": "100.00",
    "expectedReturnOptions": "IPO Exit, Dividend",
    "estimatedMarketValuation": "5000000.00",
    "ipoTimeHorizon": "3-5 years",
    "briefDescription": "Leading tech startup in Nepal",
    "fullDescription": "Detailed description...",
    "vision": "Our vision...",
    "mission": "Our mission...",
    "growthPlans": "Growth plans...",
    "contactEmail": "contact@techstartup.com",
    "contactPhone": "+977-1234567890",
    "website": "https://techstartup.com",
    "facebookUrl": "https://facebook.com/techstartup",
    "linkedinUrl": "https://linkedin.com/company/techstartup",
    "twitterUrl": "https://twitter.com/techstartup",
    "logoUrl": "https://example.com/logo.png",
    "viewCount": 146,
    "isFeatured": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `404 Not Found` - Business not found or not approved
```json
{
  "error": "Business not found"
}
```

**Frontend Integration (React):**
```javascript
const fetchBusinessDetail = async (businessId) => {
  const response = await fetch(
    `https://aarthiq.onrender.com/api/businesses/${businessId}`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Business not found');
    }
    throw new Error('Failed to fetch business details');
  }

  const data = await response.json();
  return data.business;
};

// Usage:
const business = await fetchBusinessDetail('550e8400-e29b-41d4-a716-446655440000');
```

---

### 1.3 Submit Investment Interest

**Endpoint:** `POST /api/interests`

**Purpose:** Investor submits interest to connect with a business

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "businessId": "550e8400-e29b-41d4-a716-446655440000",
  "investorName": "John Doe",
  "phoneNumber": "+977-9812345678",
  "email": "john.doe@example.com",
  "remarks": "I'm interested in learning more about investment opportunities."
}
```

**Field Validation:**
| Field | Type | Required | Validation Rules |
|-------|------|----------|------------------|
| `businessId` | UUID | Yes | Must be valid UUID of approved business |
| `investorName` | String | Yes | 2-100 characters |
| `phoneNumber` | String | Yes | 10-20 characters, format: `+977-9812345678` |
| `email` | String | Yes | Valid email address, max 255 chars |
| `remarks` | String | No | Max 1000 characters |

**Success Response:** `201 Created`
```json
{
  "message": "Interest submitted successfully",
  "interest": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "businessName": "Tech Startup Nepal",
    "submittedAt": "2024-01-20T10:30:00.000Z"
  }
}
```

**Error Responses:**

`400 Bad Request` - Validation errors
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

`404 Not Found` - Business not found
```json
{
  "error": "Business not found"
}
```

`400 Bad Request` - Business not available
```json
{
  "error": "Business is not available for investment inquiries"
}
```

**Email Notifications:**
- ✅ Business receives notification with investor details
- ✅ Investor receives confirmation email

**Frontend Integration (React):**
```javascript
const submitInterest = async (formData) => {
  const response = await fetch(
    'https://aarthiq.onrender.com/api/interests',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to submit interest');
  }

  const data = await response.json();
  return data;
};

// Usage:
const result = await submitInterest({
  businessId: '550e8400-e29b-41d4-a716-446655440000',
  investorName: 'John Doe',
  phoneNumber: '+977-9812345678',
  email: 'john.doe@example.com',
  remarks: 'Interested in investment opportunities'
});

// Show success message
alert(result.message);
```

---

## 2. BUSINESS ONBOARDING FLOW

### 2.1 Submit Onboarding Request

**Endpoint:** `POST /api/onboarding/request`

**Purpose:** Business submits initial inquiry to list on platform

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "businessName": "New Tech Company",
  "email": "info@newtechcompany.com",
  "phoneNumber": "+977-9812345678",
  "message": "We are a tech company looking to raise investment through your platform."
}
```

**Field Validation:**
| Field | Type | Required | Validation Rules |
|-------|------|----------|------------------|
| `businessName` | String | Yes | 2-255 characters |
| `email` | String | Yes | Valid email, max 255 chars, must be unique |
| `phoneNumber` | String | Yes | 10-20 characters |
| `message` | String | No | Max 1000 characters |

**Success Response:** `201 Created`
```json
{
  "message": "Onboarding request submitted successfully",
  "request": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "businessName": "New Tech Company",
    "email": "info@newtechcompany.com",
    "status": "PENDING",
    "submittedAt": "2024-01-20T10:00:00.000Z"
  }
}
```

**Error Response:** `409 Conflict`
```json
{
  "error": "An onboarding request with this email already exists"
}
```

**Frontend Integration (React):**
```javascript
const submitOnboardingRequest = async (formData) => {
  const response = await fetch(
    'https://aarthiq.onrender.com/api/onboarding/request',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    }
  );

  if (!response.ok) {
    const error = await response.json();

    if (response.status === 409) {
      throw new Error('An onboarding request with this email already exists');
    }

    throw new Error(error.error || 'Failed to submit request');
  }

  const data = await response.json();
  return data;
};
```

---

### 2.2 Validate Registration Token

**Endpoint:** `GET /api/onboarding/validate-token`

**Purpose:** Validate registration token before showing registration form

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `token` | String | Yes | Registration token from email |

**Example Request:**
```http
GET https://aarthiq.onrender.com/api/onboarding/validate-token?token=abc123xyz789
```

**Success Response:** `200 OK`
```json
{
  "isValid": true,
  "businessName": "New Tech Company",
  "email": "info@newtechcompany.com",
  "phoneNumber": "+977-9812345678"
}
```

**Error Responses:**

`404 Not Found` - Invalid token
```json
{
  "error": "Invalid token"
}
```

`400 Bad Request` - Token expired
```json
{
  "error": "Token has expired"
}
```

`400 Bad Request` - Token already used
```json
{
  "error": "Token has already been used"
}
```

**Frontend Integration (React):**
```javascript
const validateRegistrationToken = async (token) => {
  const response = await fetch(
    `https://aarthiq.onrender.com/api/onboarding/validate-token?token=${token}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  const data = await response.json();
  return data;
};

// Usage in registration page:
const RegistrationPage = () => {
  const [tokenData, setTokenData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      validateRegistrationToken(token)
        .then(data => setTokenData(data))
        .catch(err => setError(err.message));
    } else {
      setError('No registration token provided');
    }
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!tokenData) return <div>Loading...</div>;

  return <RegistrationForm tokenData={tokenData} />;
};
```

---

### 2.3 Complete Registration

**Endpoint:** `POST /api/onboarding/register`

**Purpose:** Complete business registration with full details

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "token": "abc123xyz789",
  "password": "SecurePassword@123",
  "businessData": {
    "name": "New Tech Company",
    "registrationNumber": "REG123456",
    "categoryId": 1,
    "businessType": "Pvt. Ltd.",
    "yearEstablished": 2020,
    "location": "Kathmandu",
    "teamSize": "10-50 employees",
    "paidUpCapital": 1000000,
    "investmentCapacityMin": 500000,
    "investmentCapacityMax": 2000000,
    "pricePerUnit": 100,
    "expectedReturnOptions": "IPO Exit, Dividend",
    "estimatedMarketValuation": 5000000,
    "ipoTimeHorizon": "3-5 years",
    "briefDescription": "Leading tech startup in Nepal",
    "fullDescription": "Detailed description...",
    "vision": "Our vision...",
    "mission": "Our mission...",
    "growthPlans": "Growth plans...",
    "contactEmail": "contact@newtechcompany.com",
    "contactPhone": "+977-1-4567890",
    "website": "https://newtechcompany.com",
    "facebookUrl": "https://facebook.com/newtechcompany",
    "linkedinUrl": "https://linkedin.com/company/newtechcompany",
    "twitterUrl": "https://twitter.com/newtechcompany"
  }
}
```

**Success Response:** `201 Created`
```json
{
  "message": "Registration completed successfully",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "info@newtechcompany.com",
    "role": "BUSINESS"
  },
  "business": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "New Tech Company",
    "status": "PENDING",
    "createdAt": "2024-01-20T11:00:00.000Z"
  }
}
```

---

## 3. ADMIN PANEL APIS

All admin endpoints require authentication.

### 3.1 Admin Login

**Endpoint:** `POST /api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "admin@capitalbridge.com",
  "password": "Admin@123"
}
```

**Success Response:** `200 OK`
```json
{
  "message": "Login successful",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "admin@capitalbridge.com",
    "role": "ADMIN",
    "username": "Admin"
  }
}
```

**Authentication Header Format:**
```
Authorization: {userId}|{email}|{role}
```

**Example:**
```
Authorization: 123e4567-e89b-12d3-a456-426614174000|admin@capitalbridge.com|ADMIN
```

---

### 3.2 List Pending Onboarding Requests

**Endpoint:** `GET /api/onboarding/requests`

**Authentication:** Required (ADMIN)

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `status` | String | No | - | Filter by status (PENDING/APPROVED/REJECTED) |
| `page` | Number | No | 1 | Page number |
| `limit` | Number | No | 20 | Items per page |

**Headers:**
```
Authorization: {userId}|{email}|ADMIN
```

**Example Request:**
```http
GET https://aarthiq.onrender.com/api/onboarding/requests?status=PENDING&page=1&limit=20
```

**Success Response:** `200 OK`
```json
{
  "requests": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "businessName": "New Tech Company",
      "email": "info@newtechcompany.com",
      "phoneNumber": "+977-9812345678",
      "message": "We are a tech company...",
      "status": "PENDING",
      "submittedAt": "2024-01-20T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

---

### 3.3 Approve Onboarding Request

**Endpoint:** `PUT /api/onboarding/:id/approve`

**Authentication:** Required (ADMIN)

**Headers:**
```
Authorization: {userId}|{email}|ADMIN
Content-Type: application/json
```

**Example Request:**
```http
PUT https://aarthiq.onrender.com/api/onboarding/550e8400-e29b-41d4-a716-446655440000/approve
```

**Success Response:** `200 OK`
```json
{
  "message": "Onboarding request approved",
  "request": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "businessName": "New Tech Company",
    "status": "APPROVED",
    "onboardingToken": "abc123xyz789",
    "tokenExpiresAt": "2024-01-23T10:00:00.000Z"
  }
}
```

**Side Effects:**
- ✅ Email sent to business with registration link
- ✅ Token generated (72-hour expiry)

---

## 4. BUSINESS DASHBOARD APIS

All business dashboard endpoints require BUSINESS role authentication.

### 4.1 Business Login

**Endpoint:** `POST /api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "info@newtechcompany.com",
  "password": "SecurePassword@123"
}
```

**Success Response:** `200 OK`
```json
{
  "message": "Login successful",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "info@newtechcompany.com",
    "role": "BUSINESS",
    "username": "New Tech Company"
  }
}
```

---

### 4.2 Get Own Business Profile

**Endpoint:** `GET /api/business/profile`

**Authentication:** Required (BUSINESS)

**Headers:**
```
Authorization: {userId}|{email}|BUSINESS
```

**Example Request:**
```http
GET https://aarthiq.onrender.com/api/business/profile
```

**Success Response:** `200 OK`
```json
{
  "business": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "New Tech Company",
    "registrationNumber": "REG123456",
    "category": {
      "id": 1,
      "name": "Technology",
      "slug": "technology"
    },
    "status": "APPROVED",
    "rejectionReason": null,
    "viewCount": 145,
    // ... all business fields
  }
}
```

---

### 4.3 Update Own Business Profile

**Endpoint:** `PUT /api/business/profile`

**Authentication:** Required (BUSINESS)

**Headers:**
```
Authorization: {userId}|{email}|BUSINESS
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "briefDescription": "Updated description",
  "fullDescription": "Updated detailed description",
  "investmentCapacityMax": 3000000,
  "website": "https://newtechcompany.com",
  "growthPlans": "Updated growth plans for 2024"
}
```

**Success Response:** `200 OK`
```json
{
  "message": "Profile updated successfully",
  "business": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "New Tech Company",
    "status": "APPROVED",
    "updatedAt": "2024-01-21T10:00:00.000Z"
  }
}
```

---

### 4.4 Get Investment Interests

**Endpoint:** `GET /api/business/interests`

**Authentication:** Required (BUSINESS)

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | Number | No | 1 | Page number |
| `limit` | Number | No | 20 | Items per page |

**Headers:**
```
Authorization: {userId}|{email}|BUSINESS
```

**Example Request:**
```http
GET https://aarthiq.onrender.com/api/business/interests?page=1&limit=20
```

**Success Response:** `200 OK`
```json
{
  "interests": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "businessId": "550e8400-e29b-41d4-a716-446655440000",
      "investorName": "John Doe",
      "phoneNumber": "+977-9812345678",
      "email": "john.doe@example.com",
      "remarks": "Interested in investment opportunities",
      "submittedAt": "2024-01-20T15:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

---

## 5. AUTHENTICATION

### Authentication Header Format

All protected endpoints require an Authorization header:

```
Authorization: {userId}|{email}|{role}
```

**Example for Admin:**
```
Authorization: 123e4567-e89b-12d3-a456-426614174000|admin@capitalbridge.com|ADMIN
```

**Example for Business:**
```
Authorization: 550e8400-e29b-41d4-a716-446655440000|info@business.com|BUSINESS
```

### Storing Authentication in Frontend

```javascript
// After successful login
const login = async (email, password) => {
  const response = await fetch(
    'https://aarthiq.onrender.com/api/auth/login',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }
  );

  const data = await response.json();

  // Store auth header
  const authHeader = `${data.user.id}|${data.user.email}|${data.user.role}`;
  localStorage.setItem('authHeader', authHeader);
  localStorage.setItem('user', JSON.stringify(data.user));

  return data.user;
};

// For authenticated requests
const fetchWithAuth = async (url, options = {}) => {
  const authHeader = localStorage.getItem('authHeader');

  if (!authHeader) {
    throw new Error('Not authenticated');
  }

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': authHeader
    }
  });
};

// Usage
const profile = await fetchWithAuth(
  'https://aarthiq.onrender.com/api/business/profile'
).then(res => res.json());
```

---

## 6. ERROR HANDLING

### Error Response Format

All errors follow this format:

```json
{
  "error": "Error message here"
}
```

### Validation Errors

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email address"
    },
    {
      "field": "phoneNumber",
      "message": "Phone number must be at least 10 digits"
    }
  ]
}
```

### HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| `200` | OK | Successful GET/PUT request |
| `201` | Created | Successful POST request (resource created) |
| `400` | Bad Request | Validation error, invalid data |
| `401` | Unauthorized | Authentication required or invalid |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Duplicate resource (e.g., email already exists) |
| `500` | Internal Server Error | Server error |

### Frontend Error Handling

```javascript
const handleApiError = (response, error) => {
  if (response.status === 400) {
    // Validation error
    if (error.details) {
      // Show field-specific errors
      error.details.forEach(detail => {
        showFieldError(detail.field, detail.message);
      });
    } else {
      showError(error.error);
    }
  } else if (response.status === 401) {
    // Not authenticated - redirect to login
    redirectToLogin();
  } else if (response.status === 403) {
    // Forbidden - show permission error
    showError('You do not have permission to perform this action');
  } else if (response.status === 404) {
    // Not found
    showError(error.error || 'Resource not found');
  } else if (response.status === 409) {
    // Conflict
    showError(error.error);
  } else {
    // Server error
    showError('An unexpected error occurred. Please try again.');
  }
};
```

---

## 7. FRONTEND INTEGRATION EXAMPLES

### Complete React Hook for Business Listing

```javascript
import { useState, useEffect } from 'react';

const useBusinesses = (page = 1, categoryId = null) => {
  const [businesses, setBusinesses] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: page.toString(),
          limit: '10'
        });

        if (categoryId) {
          params.append('categoryId', categoryId);
        }

        const response = await fetch(
          `https://aarthiq.onrender.com/api/businesses?${params}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch businesses');
        }

        const data = await response.json();
        setBusinesses(data.businesses);
        setPagination(data.pagination);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [page, categoryId]);

  return { businesses, pagination, loading, error };
};

// Usage in component
const BusinessList = () => {
  const [page, setPage] = useState(1);
  const { businesses, pagination, loading, error } = useBusinesses(page);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {businesses.map(business => (
        <BusinessCard key={business.id} business={business} />
      ))}

      <Pagination
        currentPage={page}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};
```

### Interest Submission Form

```javascript
const InterestForm = ({ businessId, businessName }) => {
  const [formData, setFormData] = useState({
    investorName: '',
    email: '',
    phoneNumber: '',
    remarks: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const response = await fetch(
        'https://aarthiq.onrender.com/api/interests',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...formData,
            businessId
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          // Validation errors
          const fieldErrors = {};
          data.details.forEach(detail => {
            fieldErrors[detail.field] = detail.message;
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: data.error });
        }
        return;
      }

      // Success
      setSuccess(true);
      setFormData({
        investorName: '',
        email: '',
        phoneNumber: '',
        remarks: ''
      });
    } catch (err) {
      setErrors({ general: 'Failed to submit interest. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="success-message">
        <h3>Interest Submitted!</h3>
        <p>Thank you for your interest in {businessName}.</p>
        <p>You will receive a confirmation email shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {errors.general && (
        <div className="error">{errors.general}</div>
      )}

      <input
        type="text"
        placeholder="Your Name"
        value={formData.investorName}
        onChange={(e) => setFormData({
          ...formData,
          investorName: e.target.value
        })}
      />
      {errors.investorName && <span className="error">{errors.investorName}</span>}

      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({
          ...formData,
          email: e.target.value
        })}
      />
      {errors.email && <span className="error">{errors.email}</span>}

      <input
        type="tel"
        placeholder="Phone Number (+977-9812345678)"
        value={formData.phoneNumber}
        onChange={(e) => setFormData({
          ...formData,
          phoneNumber: e.target.value
        })}
      />
      {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}

      <textarea
        placeholder="Message (optional)"
        value={formData.remarks}
        onChange={(e) => setFormData({
          ...formData,
          remarks: e.target.value
        })}
      />

      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Interest'}
      </button>
    </form>
  );
};
```

---

## 8. CORS CONFIGURATION

The API allows requests from all origins during development. For production, specific domains will be whitelisted.

**Current CORS Setup:** All origins allowed

**Future:** Only specific frontend domains will be allowed

---

## 9. RATE LIMITING

Currently no rate limiting is implemented. Will be added in future updates.

---

## 10. ADDITIONAL NOTES

### Pagination

All list endpoints support pagination with consistent format:
- Query params: `page`, `limit`
- Response includes `pagination` object with `total`, `totalPages`

### Date Formats

All dates are in ISO 8601 format (UTC):
```
2024-01-20T10:00:00.000Z
```

### Decimal Numbers

Financial fields (paidUpCapital, investmentCapacity, etc.) are returned as strings to preserve precision:
```json
"paidUpCapital": "1000000.00"
```

### Boolean Fields

Returned as `true`/`false` (not strings).

---

## 11. SUPPORT

**GitHub Repository:** https://github.com/Shawnkarki07/Aarthiq

**Issues:** Report bugs or request features via GitHub Issues

**Backend Version:** 1.0.0

**Last Updated:** January 2025

---

**Happy Coding! 🚀**
