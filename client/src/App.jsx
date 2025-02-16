import { useState } from 'react'

function App() {
  const [inputText, setInputText] = useState('')
  const [tweets, setTweets] = useState([])
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
      setTweets(data.tweets)
    } catch (error) {
      console.error('Error remixing content:', error)
      setTweets([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleTweet = (tweetText) => {
    // Encode the tweet text for use in URL
    const encodedTweet = encodeURIComponent(tweetText);
    // Open Twitter web intent in new tab
    window.open(`https://twitter.com/intent/tweet?text=${encodedTweet}`, '_blank');
  };

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
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Generated Tweets:</h2>
          {tweets.map((tweet, index) => (
            <div 
              key={index}
              className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="mb-3">{tweet}</p>
              <button
                onClick={() => handleTweet(tweet)}
                className="text-sm px-4 py-1 bg-[#1DA1F2] text-white rounded hover:bg-[#1a8cd8] transition-colors"
              >
                Tweet This
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
