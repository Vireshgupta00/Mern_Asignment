# AI-Powered Career & Consultation Platform

## Project Overview
This project is a production-ready, AI-powered career platform where users can manage their profile, build AI-assisted resumes, interact with a ChatGPT-like career assistant, and book consultations with career experts via Stripe. It is built using the MERN stack and orchestrated via Turborepo.

## Architecture Diagram
```text
Next.js Client (Port 3000)
       |
       v
  API Gateway (Port 4000)
       |
 +-----+-------+-------------+-------------+
 |             |             |             |
Auth Service   AI Service    Resume        Booking
(Port 4001)    (Port 4002)   Service       Service
 |             |             (Port 4003)   (Port 4004)
 |             v             |             |
 v        OpenAI API         v             v
MongoDB                      MongoDB       Stripe API
```

## Service Boundaries and Reasoning
The application uses a modular microservice architecture:
1. **API Gateway:** Centralizes routing, hides internal ports, and manages CORS.
2. **Auth Service:** Isolates user credentials, password hashing, and JWT signing. If auth load spikes, it can scale independently.
3. **AI Service:** Isolates long-polling/high-latency LLM requests from standard CRUD operations.
4. **Resume Service:** Handles high-throughput JSON generation and HTML template rendering.
5. **Booking Service:** Manages sensitive transactional state-machines (Stripe Webhooks, Calendar events).

## Database Design
- **MongoDB** is used as the primary data store.
- We utilize a logical database separation pattern where each microservice connects to the same physical cluster but manages isolated collections (`Users`, `ChatSessions`, `Resumes`, `Bookings`).
- **Embedding vs Referencing:** Chat messages are embedded inside `ChatSession` if small, or referenced if they grow infinitely. Resumes embed `experience` and `education` arrays to ensure single-query retrieval.

## Authentication Strategy
- **JWT (JSON Web Tokens):** The Auth service issues a stateless JWT upon login.
- A shared `@career-platform/shared` internal package provides authentication middleware that validates the JWT signature symmetrically across all microservices without requiring network calls back to the Auth service.

## AI/LLM Architecture
- The AI service intercepts user queries, fetches the `ChatSession` history from MongoDB to build context, and streams the payload to the OpenAI API.
- Errors (like 429 Rate Limits) are caught gracefully and returned to the frontend.

## Payment Flow & State Management
1. User requests a time slot -> `POST /bookings` creates a booking in `PENDING_PAYMENT` state.
2. System initiates Stripe Checkout session and returns the URL.
3. Upon payment, Stripe hits the webhook `POST /bookings/webhook`.
4. The webhook idempotently verifies the signature and updates the state to `PAID` -> `CONFIRMED`.

## Calendar & Email Integration Flow
After the webhook confirms the payment, asynchronous handlers are triggered (currently mocked) to dispatch Google Calendar invites and NodeMailer confirmation emails, ensuring the HTTP response to Stripe doesn't block on third-party APIs.

## Environment Variables
Create a `.env` file in each respective microservice:
- `MONGO_URI=mongodb://localhost:27017/career_platform`
- `JWT_SECRET=your_secret_key`
- `OPENAI_API_KEY=sk-...` (AI Service)
- `STRIPE_SECRET_KEY=sk_test_...` (Booking Service)

## Local Installation & Docker Instructions
Prerequisites: Docker, Node.js v18+
1. Run `docker-compose up -d` to start MongoDB and Redis.
2. Run `npm install` at the workspace root.
3. Run `npm run dev` to start the Turborepo cluster (Frontend + Gateway + 4 Microservices).

## Known Limitations & Technical Trade-offs
- **Shared DB Cluster:** For local dev, all services share one MongoDB container. In production, these should be physically separated or strictly sharded.
- **Frontend Aggregation:** The dashboard currently aggregates stats via multiple client-side requests. A Backend-For-Frontend (BFF) GraphQL layer would optimize this.

## Scaling to 1 Million Users
1. **Database:** Implement MongoDB sharding based on `userId`. 
2. **Caching:** Introduce Redis caching for static Consultant profiles and Resume templates to reduce DB read loads.
3. **Async Workers:** Offload AI Generation and Stripe Webhook processing to a message broker (RabbitMQ/Kafka) with dedicated worker nodes to prevent HTTP timeout failures.
4. **Load Balancing:** Deploy services to Kubernetes with Horizontal Pod Autoscaling (HPA) configured to scale the AI Service based on CPU utilization, and the Auth service based on request throughput.
