# Cloudflare AI Chat Agent Template

[![[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/bilbywilby/nexus-control-plane-termux-infrastructure-manager)]](https://deploy.workers.cloudflare.com/)

A production-ready full-stack chat application built on Cloudflare Workers. Features persistent multi-session conversations powered by Durable Objects, AI integration via Cloudflare AI Gateway, streaming responses, tool calling (web search, weather), and a modern React UI with session management, dark mode, and responsive design.

## ✨ Key Features

- **Multi-Session Chat**: Create, manage, and switch between unlimited chat sessions with automatic title generation and activity tracking.
- **AI-Powered Conversations**: Integrated with Cloudflare AI Gateway supporting Gemini models with streaming and tool calling.
- **Built-in Tools**: Web search (SerpAPI), weather lookup, and extensible MCP (Model Context Protocol) tools.
- **Production-Ready UI**: Modern React app with shadcn/ui components, TailwindCSS, dark mode, and mobile responsiveness.
- **Session Persistence**: Durable Objects handle state with automatic registration and cleanup.
- **Developer-Friendly**: Type-safe TypeScript, hot-reload development, and one-click deployment.
- **Real-time Streaming**: Server-sent events for instant response streaming.
- **Error Handling & Observability**: Comprehensive logging, client error reporting, and Cloudflare Observability integration.

## 🛠️ Technology Stack

- **Backend**: Cloudflare Workers, Hono, Durable Objects, Cloudflare Agents SDK
- **AI**: Cloudflare AI Gateway (Gemini models), OpenAI-compatible API
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, shadcn/ui
- **State Management**: TanStack Query, Zustand, Immer
- **Utilities**: Lucide icons, Sonner toasts, Framer Motion
- **Tools**: SerpAPI (search), MCP protocol support
- **DevOps**: Wrangler, Bun, ESLint, TypeScript

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) installed
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- Cloudflare account with AI Gateway configured

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   bun install
   ```
3. Configure environment variables in `wrangler.jsonc`:
   ```jsonc
   "vars": {
     "CF_AI_BASE_URL": "https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/openai",
     "CF_AI_API_KEY": "{your_ai_gateway_token}",
     "SERPAPI_KEY": "{your_serpapi_key}" // Optional for web search
   }
   ```
4. Generate types:
   ```
   bun run cf-typegen
   ```

### Development

Start the development server:
```
bun run dev
```

The app will be available at `http://localhost:3000` (or your configured port). The worker handles both API routes and static assets.

**Hot Reload**: Frontend changes hot-reload automatically. Backend changes require redeploy or `wrangler dev`.

### Build for Production

```
bun run build
```

Output in `dist/` folder.

## 📖 Usage

### Chat Sessions

- **Create New Session**: POST `/api/sessions` with `{ title?, firstMessage? }`
- **List Sessions**: GET `/api/sessions`
- **Delete Session**: DELETE `/api/sessions/:id`
- **Update Title**: PUT `/api/sessions/:id/title`
- **Chat**: POST `/api/chat/:sessionId/chat` with `{ message, model?, stream? }`
- **Get Messages**: GET `/api/chat/:sessionId/messages`
- **Switch Model**: POST `/api/chat/:sessionId/model` with `{ model }`

### Frontend Components

- `HomePage.tsx`: Main chat interface
- `AppLayout.tsx`: Optional sidebar layout
- `chatService` in `src/lib/chat.ts`: API wrapper for sessions and messages

### Example API Calls

```bash
# Create session
curl -X POST /api/sessions \
  -H "Content-Type: application/json" \
  -d '{"firstMessage": "Hello world"}'

# Send message
curl -X POST /api/chat/<sessionId>/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the weather in London?", "stream": true}'
```

## ☁️ Deployment

1. Configure `wrangler.jsonc` with your secrets:
   ```
   wrangler secret put CF_AI_API_KEY
   wrangler secret put SERPAPI_KEY  # Optional
   ```

2. Deploy:
   ```
   bun run deploy
   ```

3. Your app is live! Custom domain via Cloudflare Pages or Workers Sites.

**[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/bilbywilby/nexus-control-plane-termux-infrastructure-manager)**

**Post-Deploy**:
- Bind Durable Object namespaces automatically handled
- Assets served from `/dist`
- API routes at `/api/*`

## 🤝 Contributing

1. Fork and clone
2. `bun install`
3. Create feature branch: `feat/my-feature`
4. `bun run dev` and test
5. Lint: `bun run lint`
6. PR with clear description

## 🔒 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `CF_AI_BASE_URL` | Yes | AI Gateway endpoint |
| `CF_AI_API_KEY` | Yes | AI Gateway token |
| `SERPAPI_KEY` | No | Web search integration |

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

## 🙌 Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/)
- Issues: GitHub Issues