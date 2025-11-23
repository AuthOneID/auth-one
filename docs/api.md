# API Documentation

AuthOne provides several API endpoints categorized by their purpose.

## 🆔 OIDC / OAuth 2.0 Endpoints

These endpoints are used by applications to authenticate users.

| Method | Endpoint                            | Description                                          |
| ------ | ----------------------------------- | ---------------------------------------------------- |
| `GET`  | `/authorize`                        | Starts the authorization flow.                       |
| `POST` | `/oauth/token`                      | Exchanges authorization code for access tokens.      |
| `GET`  | `/.well-known/openid-configuration` | Returns OIDC configuration metadata.                 |
| `GET`  | `/.well-known/jwks.json`            | Returns JSON Web Key Set for signature verification. |

## 🔑 Public API

Protected by API Key. Used for external integrations.

**Base URL:** `/api`

| Method | Endpoint                  | Description                 |
| ------ | ------------------------- | --------------------------- |
| `GET`  | `/users/:id`              | Get user details.           |
| `POST` | `/users`                  | Create a new user.          |
| `PUT`  | `/users/:id`              | Update a user.              |
| `POST` | `/groups/:id/add_user`    | Add a user to a group.      |
| `POST` | `/groups/:id/remove_user` | Remove a user from a group. |
