# 🧠 Mind Blowing - Collaborative Mind Mapping

A mind-blowing collaborative mind mapping application with real-time collaboration, GitHub integration, text-to-speech, and PDF export.

## Features

- **Real-time Collaboration**: Multiple users can work on the same mind map simultaneously using WebSocket (Socket.IO)
- **Interactive Canvas**: Drag, zoom, and pan the mind map canvas with smooth animations
- **Node Management**: Create, edit, delete, and connect nodes with custom colors
- **Text-to-Speech**: Read your mind map nodes aloud with natural-sounding speech
- **PDF Export**: Export your mind maps as PDF documents
- **GitHub Integration**: Save and load mind maps directly from GitHub repositories
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: HTML5 Canvas, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Real-time**: Socket.IO
- **APIs**: GitHub OAuth, Text-to-Speech, PDF Generation

## Installation

```bash
# Clone the repository
git clone https://github.com/networkshrynex-coder/mind-blowing-app.git
cd mind-blowing-app

# Install dependencies
npm install

# Start the server
npm start

# Or for development with auto-restart
npm run dev
```

## Usage

1. Open `http://localhost:3000` in your browser
2. Enter a mind map name and click "Create"
3. Use the toolbar to add nodes, connect them, and edit text
4. Share the mind map ID with collaborators to work together in real-time
5. Export to PDF or read aloud using the toolbar buttons

## Tools

- **Select**: Click and drag to move nodes
- **Add Node**: Click anywhere on the canvas to add a new node
- **Connect Nodes**: Click one node, then another to create a connection
- **Pan**: Drag the canvas to navigate
- **Zoom**: Use the mouse wheel or zoom buttons

## License

MIT License

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Live Demo

[View on GitHub](https://github.com/networkshrynex-coder/mind-blowing-app)