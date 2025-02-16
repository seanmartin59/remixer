import { useState } from 'react'

function App() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleRemix = async () => {
    if (!inputText.trim()) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/remix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      })
      
      const data = await response.json()
      setOutputText(data.remixedText)
    } catch (error) {
      console.error('Error remixing content:', error)
      setOutputText('Error occurred while remixing content')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">Content Remixer</h1>
        
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste your text here..."
          className="w-full h-40 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        
        <button
          onClick={handleRemix}
          disabled={isLoading || !inputText.trim()}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Remixing...' : 'Remix Content'}
        </button>
        
        <div className="bg-white p-4 rounded-lg min-h-40 border">
          <h2 className="text-lg font-semibold mb-2">Remixed Output:</h2>
          <p className="whitespace-pre-wrap">{outputText}</p>
        </div>
      </div>
    </div>
  )
}

export default App
