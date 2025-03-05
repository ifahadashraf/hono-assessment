import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger';
import { usersRoutes } from './routes/users.routes';
import { prettyJSON } from 'hono/pretty-json';

const app = new Hono()

app.get('/', (c) => c.text('Pretty Blog API'))
app.use(prettyJSON())
app.notFound((c) => c.json({ message: 'Not Found' }, 404))
app.use(logger());

app.route('/api/users', usersRoutes);

serve({
  fetch: app.fetch,
  port: 3000,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
