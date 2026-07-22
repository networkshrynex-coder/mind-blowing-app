const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Store mind maps in memory (in production, use a database)
const mindMaps = {};

// Socket.IO for real-time collaboration
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a mind map room
  socket.on('join-mindmap', (mindMapId) => {
    socket.join(mindMapId);
    console.log(`User ${socket.id} joined mind map ${mindMapId}`);

    // Send existing mind map data to the new user
    if (mindMaps[mindMapId]) {
      socket.emit('load-mindmap', mindMaps[mindMapId]);
    }
  });

  // Update mind map
  socket.on('update-mindmap', (data) => {
    const { mindMapId, mindMap } = data;
    mindMaps[mindMapId] = mindMap;
    // Broadcast to all other users in the room
    socket.to(mindMapId).emit('mindmap-updated', mindMap);
  });

  // Add a node
  socket.on('add-node', (data) => {
    const { mindMapId, node } = data;
    if (mindMaps[mindMapId]) {
      mindMaps[mindMapId].nodes.push(node);
      socket.to(mindMapId).emit('node-added', node);
    }
  });

  // Update a node
  socket.on('update-node', (data) => {
    const { mindMapId, nodeId, updates } = data;
    if (mindMaps[mindMapId]) {
      const nodeIndex = mindMaps[mindMapId].nodes.findIndex(n => n.id === nodeId);
      if (nodeIndex !== -1) {
        mindMaps[mindMapId].nodes[nodeIndex] = { ...mindMaps[mindMapId].nodes[nodeIndex], ...updates };
        socket.to(mindMapId).emit('node-updated', { nodeId, updates });
      }
    }
  });

  // Delete a node
  socket.on('delete-node', (data) => {
    const { mindMapId, nodeId } = data;
    if (mindMaps[mindMapId]) {
      mindMaps[mindMapId].nodes = mindMaps[mindMapId].nodes.filter(n => n.id !== nodeId);
      // Also remove any edges connected to this node
      mindMaps[mindMapId].edges = mindMaps[mindMapId].edges.filter(e => e.source !== nodeId && e.target !== nodeId);
      socket.to(mindMapId).emit('node-deleted', nodeId);
    }
  });

  // Add an edge
  socket.on('add-edge', (data) => {
    const { mindMapId, edge } = data;
    if (mindMaps[mindMapId]) {
      mindMaps[mindMapId].edges.push(edge);
      socket.to(mindMapId).emit('edge-added', edge);
    }
  });

  // Delete an edge
  socket.on('delete-edge', (data) => {
    const { mindMapId, edgeId } = data;
    if (mindMaps[mindMapId]) {
      mindMaps[mindMapId].edges = mindMaps[mindMapId].edges.filter(e => e.id !== edgeId);
      socket.to(mindMapId).emit('edge-deleted', edgeId);
    }
  });

  // Create a new mind map
  socket.on('create-mindmap', (data) => {
    const { mindMapId, mindMap } = data;
    mindMaps[mindMapId] = mindMap;
    socket.join(mindMapId);
    socket.emit('mindmap-created', mindMap);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// GitHub API integration for saving/loading mind maps
app.get('/api/mindmaps/:id', (req, res) => {
  const { id } = req.params;
  if (mindMaps[id]) {
    res.json(mindMaps[id]);
  } else {
    res.status(404).json({ error: 'Mind map not found' });
  }
});

app.post('/api/mindmaps/:id', (req, res) => {
  const { id } = req.params;
  mindMaps[id] = req.body;
  res.json({ success: true });
});

// GitHub OAuth callback
app.get('/auth/github', (req, res) => {
  const githubUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID || 'your_client_id'}&redirect_uri=${encodeURIComponent(process.env.GITHUB_REDIRECT_URI || 'http://localhost:3000/auth/github/callback')}&scope=repo`;
  res.redirect(githubUrl);
});

app.get('/auth/github/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const tokenRes = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID || 'your_client_id',
      client_secret: process.env.GITHUB_CLIENT_SECRET || 'your_client_secret',
      code
    }, {
      headers: { Accept: 'application/json' }
    });

    const { access_token } = tokenRes.data;
    res.json({ access_token });
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});