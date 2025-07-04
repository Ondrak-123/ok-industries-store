const jsonServer = require('json-server');
const cors = require('cors');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Enable CORS for all routes
server.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Use default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.use(jsonServer.bodyParser);

// Custom route for bulk product creation
server.post('/products/bulk', (req, res) => {
  const db = router.db;
  const products = req.body;
  
  if (!Array.isArray(products)) {
    return res.status(400).json({ error: 'Expected an array of products' });
  }
  
  const newProducts = products.map(product => ({
    ...product,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
  
  // Add products to database
  newProducts.forEach(product => {
    db.get('products').push(product).write();
  });
  
  res.json(newProducts);
});

// Use default router
server.use(router);

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});