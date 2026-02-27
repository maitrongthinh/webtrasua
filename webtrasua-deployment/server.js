
// Optimized entry point - Directly requires the server to save memory
const port = process.env.PORT || process.env.SERVER_PORT || 20366;
const host = '0.0.0.0'; 

process.env.PORT = port;
process.env.HOSTNAME = host;

console.log('--- VPS STARTUP ---');
console.log('Target Port:', port);
console.log('Binding to:', host);
console.log('Expected Access URL: http://145.239.69.111:' + port);

// Run the original Next.js server logic in the same process
require('./next-server.js');
