

# HRouter - LLM Router Web Interface

A modern, interactive web interface for comparing and routing LLM models. Built with React, TypeScript, Tailwind CSS, and Vite.

## Features

### Battle Mode
- **Side-by-side model comparison** with two randomly selected models
- **Vibrant glowing input box** with animated gradient effects
- **Compact, minimal design** with efficient spacing
- **Real-time voting system** to rate model responses
- **Performance metrics** including latency, tokens/sec, token count, and cost

### Side-by-Side Mode
- **Manual model selection** for targeted comparisons
- **Synchronous response streaming** from both models
- **Winner highlighting** based on performance metrics
- **Same glowing input design** as Battle Mode

### Leaderboard
- **Multi-category rankings** (Text, Code, Vision, Document, Text-to-Image, Image Edit, Search, etc.)
- **Glowing search input** with real-time filtering
- **Hover glow effects** on table rows and stat cards
- **Provider icons** for quick identification
- **Voting statistics** and trend tracking

### UI/UX Enhancements
- **3-layer animated gradient glow** on focus (cyan→blue→purple→pink→orange)
- **Minimal spacing** throughout all components
- **Responsive design** for all screen sizes
- **Smooth animations** and transitions

## Run Locally

**Prerequisites:** Node.js 18+

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rohithdgrr/HACKATHON.git
   cd HACKATHON
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

4. **Run the app:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigate to `http://localhost:3000`

## Build for Production

```bash
npm run build
```

## Tech Stack

- **Framework:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Build Tool:** Vite 6
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **AI:** Google Gemini API

## Project Structure

```
src/
├── components/
│   ├── BattleMode.tsx      # Battle comparison interface
│   ├── SideBySideMode.tsx  # Side-by-side comparison
│   ├── Leaderboard.tsx     # Rankings and statistics
│   ├── HRouterApp.tsx     # Main application shell
│   ├── LandingPage.tsx     # Home screen
│   ├── Sidebar.tsx         # Navigation sidebar
│   ├── Stats.tsx           # Statistics view
│   ├── ChatHistory.tsx     # Chat history view
│   ├── Settings.tsx        # Settings panel
│   ├── ModelSelector.tsx   # Model dropdown selector
│   └── UI.tsx              # Reusable UI components
├── services/
│   ├── geminiService.ts    # Gemini AI integration
│   └── leaderboardService.ts # Leaderboard data management
├── types.ts                # TypeScript interfaces
├── lib/
│   └── utils.ts            # Utility functions
└── index.css               # Global styles
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

---

View in AI Studio: https://ai.studio/apps/b0847044-8eb2-447f-a6b6-70c56a8988a3
