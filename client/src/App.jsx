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
    <div className="min-h-screen bg-gray-100 w-full">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full max-w-[95%]">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-8">Content Remixer</h1>
        
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-8">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your text here..."
            className="w-full h-48 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
          />
          
          <button
            onClick={handleRemix}
            disabled={isLoading || !inputText.trim()}
            className="mt-4 w-full sm:w-auto px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
          >
            {isLoading ? 'Remixing...' : 'Remix Content'}
          </button>
        </div>
        
        {tweets.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Generated Tweets:</h2>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {tweets.map((tweet, index) => (
                <div 
                  key={index}
                  className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow"
                >
                  <p className="mb-4 text-gray-700 text-lg">{tweet}</p>
                  <button
                    onClick={() => handleTweet(tweet)}
                    className="inline-flex items-center px-4 py-2 bg-[#1DA1F2] text-white font-medium rounded-lg hover:bg-[#1a8cd8] transition-colors"
                  >
                    Tweet This
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
