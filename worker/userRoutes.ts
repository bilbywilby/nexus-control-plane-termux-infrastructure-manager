import { Hono } from "hono";
import { getAgentByName } from 'agents';
import { ChatAgent } from './agent';
import { API_RESPONSES } from './config';
import { Env, getAppController, registerSession, unregisterSession } from "./core-utils";
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
    app.get('/api/research', async (c) => {
      // Mocked endpoint - in production this would route to a persistent agent
      return c.json({ success: true, data: [] });
    });
    app.get('/api/logs', async (c) => {
      const logs = [
        { time: '2024-05-20 14:00:01', event: 'GATE_PASS', details: 'integrity: 100%' },
        { time: '2024-05-20 14:05:12', event: 'HEAL_EVENT', details: 'Primary -> Secondary Failover Triggered' },
        { time: '2024-05-20 14:05:30', event: 'HEAL_RESOLVED', details: 'Validation restored via secondary path' },
        { time: '2024-05-20 14:10:00', event: 'SNAPSHOT_REDUNDANCY', details: 'Triple backup complete for SNP-0942' }
      ];
      return c.json({ success: true, data: logs });
    });
    app.post('/api/system/recovery', async (c) => {
      const { snapshotId } = await c.req.json();
      return c.json({ success: true, message: `Manual recovery initiated from ${snapshotId}` });
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
}