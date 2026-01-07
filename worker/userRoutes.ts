import { Hono } from "hono";
import { getAgentByName } from 'agents';
import { ChatAgent } from './agent';
import { API_RESPONSES } from './config';
import { Env, getAppController } from "./core-utils";
export function coreRoutes(app: Hono<{ Bindings: Env }>) {
    app.all('/api/chat/:sessionId/*', async (c) => {
        try {
            const sessionId = c.req.param('sessionId');
            const agent = await getAgentByName<Env, ChatAgent>(c.env.CHAT_AGENT, sessionId);
            const url = new URL(c.req.url);
            url.pathname = url.pathname.replace(`/api/chat/${sessionId}`, '');
            return agent.fetch(new Request(url.toString(), {
                method: c.req.method,
                headers: c.req.header(),
                body: c.req.method === 'GET' || c.req.method === 'DELETE' ? undefined : c.req.raw.body
            }));
        } catch (error) {
            console.error('Agent routing error:', error);
            return c.json({ success: false, error: API_RESPONSES.AGENT_ROUTING_FAILED }, { status: 500 });
        }
    });
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    app.get('/api/sessions', async (c) => {
        const controller = getAppController(c.env);
        const sessions = await controller.listSessions();
        return c.json({ success: true, data: sessions });
    });
    app.post('/api/research/:sessionId', async (c) => {
        const sessionId = c.req.param('sessionId');
        const body = await c.req.json();
        const agent = await getAgentByName<Env, ChatAgent>(c.env.CHAT_AGENT, sessionId);
        const url = new URL(c.req.url);
        url.pathname = '/research';
        return agent.fetch(new Request(url.toString(), {
            method: 'POST',
            body: JSON.stringify(body)
        }));
    });
    app.post('/api/workflow/:sessionId', async (c) => {
        const sessionId = c.req.param('sessionId');
        const body = await c.req.json();
        const agent = await getAgentByName<Env, ChatAgent>(c.env.CHAT_AGENT, sessionId);
        const url = new URL(c.req.url);
        url.pathname = '/workflow';
        return agent.fetch(new Request(url.toString(), {
            method: 'POST',
            body: JSON.stringify(body)
        }));
    });
    app.get('/api/system/audit/:sessionId', async (c) => {
        const sessionId = c.req.param('sessionId');
        const agent = await getAgentByName<Env, ChatAgent>(c.env.CHAT_AGENT, sessionId);
        const url = new URL(c.req.url);
        url.pathname = '/audit';
        return agent.fetch(new Request(url.toString()));
    });
    app.get('/api/system/health', async (c) => {
        return c.json({
            success: true,
            data: {
                status: 'Healthy',
                uptime: '14d 2h',
                nodes: ['0x-alpha-v2', '0x-beta-node'],
                gate: { passRate: 99.9, status: 'Active' },
                faultTolerance: 'NOMINAL'
            }
        });
    });
    app.post('/api/system/reports/export', async (c) => {
        return c.json({ success: true, file: 'NEXUS_REPORT_Q2.pdf' });
    });
}