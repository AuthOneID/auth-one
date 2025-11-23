# Features

AuthOne is a comprehensive Identity Provider solution. Below are the key features available in the system.

## 🔐 Identity & Access Management (IAM)

### OpenID Connect (OIDC) & OAuth 2.0

- **Authorization Code Flow**: Securely authenticate users and grant access to applications.
- **Discovery Endpoint**: Standard `/.well-known/openid-configuration` for auto-configuration of clients.
- **JWKS Endpoint**: Public keys exposed at `/.well-known/jwks.json` for token verification.
- **Silent Authentication**: Support for silent token refresh and session checks.

### User Management

- **User CRUD**: Create, read, update, and delete users.
- **Profile Management**: Users can update their own profiles.
- **Role-Based Access Control (RBAC)**: Assign roles to users to manage permissions.
- **Group Management**: Organize users into groups for easier policy management.

## 📱 Application Management

- **Client Registration**: Register and manage OIDC clients (applications).
- **Client Secrets**: Securely manage client credentials.

## 🛠️ Administration

- **Admin Dashboard**: Centralized view for managing the system.
- **Settings**: Configure system-wide settings.
- **File Uploads**: Handle file uploads for user avatars or application logos.

## 🔌 API

- **RESTful API**: Full API support for integrating with external systems.
- **API Key Authentication**: Secure API access for service-to-service communication.
