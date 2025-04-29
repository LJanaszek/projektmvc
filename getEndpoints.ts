// listApiRoutesFinal.js
const fs = require('fs');
const path = require('path');

const apiFolder = path.join(process.cwd(), 'pages', 'api');
const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];

function extractMethodsFromContent(content) {
  const detectedMethods = [];

  methods.forEach(method => {
    const regex = new RegExp(`[!]?==+\\s*['"]${method}['"]`, 'i');
    // match == or != followed by 'METHOD'
    if (regex.test(content)) {
      detectedMethods.push(method);
    }
  });

  return detectedMethods;
}

function getApiRoutes(dir) {
  const routes = [];

  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);

    if (stat.isDirectory()) {
      const subRoutes = getApiRoutes(filepath);
      routes.push(...subRoutes);
    } else {
      const content = fs.readFileSync(filepath, 'utf8');
      let detected = extractMethodsFromContent(content);

      if (detected.length === 0) {
        detected = ['GET']; // Default to GET if no methods found
      }

      const route = filepath
        .replace(apiFolder, '')
        .replace(/\.(js|ts|jsx|tsx)$/, '')
        .replace(/\\/g, '/'); // Windows fix

      routes.push({
        route: '/api' + route,
        methods: detected,
      });
    }
  }

  return routes;
}

// Run
const routes = getApiRoutes(apiFolder);

console.log('Detected API Endpoints:');
routes.forEach(({ route, methods }) => {
  methods.forEach(method => {
    console.log(method, route);
  });
});
