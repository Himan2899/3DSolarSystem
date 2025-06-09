"use client"

export default function ControlPanel({
  isPaused,
  isLightTheme,
  planetSpeeds,
  onTogglePause,
  onToggleTheme,
  onUpdateSpeed,
}) {
  const planetNames = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"]

  return (
    <div className="absolute top-4 left-4 z-10 max-w-xs">
      <div
        className={`p-4 rounded-lg border backdrop-blur-sm ${
          isLightTheme ? "bg-white/90 text-black border-black/20" : "bg-black/80 text-white border-white/20"
        }`}
      >
        <h2 className="text-xl font-bold mb-4 text-center text-yellow-400">🌌 Solar System Controls</h2>

        {/* Main Controls */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={onTogglePause}
            className={`px-4 py-2 rounded text-sm font-medium ${
              isPaused ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {isPaused ? "▶️ Resume" : "⏸️ Pause"}
          </button>
          <button
            onClick={onToggleTheme}
            className="px-4 py-2 rounded text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isLightTheme ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>

        {/* Planet Speed Controls */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {planetNames.map((name, index) => (
            <div key={name} className={`p-3 rounded ${isLightTheme ? "bg-black/10" : "bg-white/10"}`}>
              <label className="block text-sm font-medium mb-1">{name}</label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={planetSpeeds[index]}
                onChange={(e) => onUpdateSpeed(index, Number.parseFloat(e.target.value))}
                className="w-full mb-1"
              />
              <div className="text-xs text-center opacity-75">Speed: {planetSpeeds[index].toFixed(1)}x</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
