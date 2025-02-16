import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

function App() {
  const [inputText, setInputText] = useState('')
  const [tweets, setTweets] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [savedTweets, setSavedTweets] = useState([])
  const [showSidebar, setShowSidebar] = useState(true)
  const [savedTweetsVisible, setSavedTweetsVisible] = useState(true)
  const [editingTweet, setEditingTweet] = useState(null)
  const [editText, setEditText] = useState('')

  // Fetch saved tweets on component mount
  useEffect(() => {
    fetchSavedTweets()
  }, [])

  const fetchSavedTweets = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_tweets')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setSavedTweets(data)
    } catch (error) {
      console.error('Error fetching saved tweets:', error)
    }
  }

  const handleSaveTweet = async (tweet) => {
    try {
      const { error } = await supabase
        .from('saved_tweets')
        .insert([{ content: tweet }])
      
      if (error) throw error
      
      // Refresh saved tweets list
      fetchSavedTweets()
    } catch (error) {
      console.error('Error saving tweet:', error)
    }
  }

  const handleDeleteSavedTweet = async (id) => {
    try {
      const { error } = await supabase
        .from('saved_tweets')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      // Refresh saved tweets list
      fetchSavedTweets()
    } catch (error) {
      console.error('Error deleting tweet:', error)
    }
  }

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

  const handleSaveEdit = async (id, newContent) => {
    try {
      const { error } = await supabase
        .from('saved_tweets')
        .update({ content: newContent })
        .eq('id', id)
      
      if (error) throw error
      
      setEditingTweet(null)
      setEditText('')
      fetchSavedTweets()
    } catch (error) {
      console.error('Error updating tweet:', error)
    }
  }

  console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)

  return (
    <div className="min-h-screen bg-gray-100 w-full flex">
      {/* Main content - center with balanced margins */}
      <div className={`flex-1 max-w-7xl mx-auto transition-all duration-300 
        ${showSidebar 
          ? 'pr-[calc(320px+2rem)] pl-8' 
          : 'px-8'
        }`}
      >
        <div className="py-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-8">Tweet That</h1>
          
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
              className={`mt-4 w-full sm:w-auto px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors relative ${
                isLoading ? 'pl-10' : ''
              }`}
            >
              {isLoading && (
                <div className="absolute left-3 top-1/2 -mt-2 w-4 h-4">
                  <div className="animate-spin w-full h-full border-2 border-white border-t-transparent rounded-full"/>
                </div>
              )}
              {isLoading ? 'Making Magic' : 'Create Twitter Magic'}
            </button>
          </div>
          
          {tweets.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">Generated Tweets:</h2>
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                {tweets.map((tweet, index) => (
                  <div 
                    key={index}
                    className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow"
                  >
                    {editingTweet === `generated-${index}` ? (
                      <div className="mb-4">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none mb-2"
                          rows="3"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const newTweets = [...tweets]
                              newTweets[index] = editText
                              setTweets(newTweets)
                              setEditingTweet(null)
                              setEditText('')
                            }}
                            className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingTweet(null)
                              setEditText('')
                            }}
                            className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="mb-4 text-gray-700 text-lg">
                        {tweet}
                        <button
                          onClick={() => {
                            setEditingTweet(`generated-${index}`)
                            setEditText(tweet)
                          }}
                          className="ml-2 text-blue-500 hover:text-blue-600"
                        >
                          ✎
                        </button>
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleTweet(tweet)}
                        className="inline-flex items-center px-4 py-2 bg-[#1DA1F2] text-white font-medium rounded-lg hover:bg-[#1a8cd8] transition-colors"
                      >
                        Tweet This
                      </button>
                      <button
                        onClick={() => handleSaveTweet(tweet)}
                        className="inline-flex items-center px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Save For Later
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Saved Tweets Sidebar */}
      <div className={`fixed top-0 right-0 h-full bg-white shadow-lg transform transition-transform duration-300 flex ${showSidebar ? 'translate-x-0' : 'translate-x-[calc(100%-32px)]'}`}>
        {/* Collapse/Expand button strip */}
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="h-full w-8 flex items-center justify-center bg-blue-500 hover:bg-blue-600 transition-colors group"
          aria-label={showSidebar ? "Collapse sidebar" : "Expand sidebar"}
        >
          <div className="flex items-center justify-center rounded-full w-6 h-6 bg-white/10 group-hover:bg-white/20 transition-colors">
            <span className="text-white text-lg">
              {showSidebar ? '→' : '←'}
            </span>
          </div>
        </button>

        {/* Main sidebar content */}
        <div className="w-80 p-4 h-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Saved Tweets</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {savedTweets.map((tweet) => (
              <div key={tweet.id} className="p-4 border-b">
                {editingTweet === tweet.id ? (
                  <div className="mb-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none mb-2"
                      rows="3"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(tweet.id, editText)}
                        className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingTweet(null)
                          setEditText('')
                        }}
                        className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 mb-2">
                    {tweet.content}
                    <button
                      onClick={() => {
                        setEditingTweet(tweet.id)
                        setEditText(tweet.content)
                      }}
                      className="ml-2 text-blue-500 hover:text-blue-600"
                    >
                      ✎
                    </button>
                  </p>
                )}
                {!editingTweet && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTweet(tweet.content)}
                      className="text-sm px-3 py-1 bg-[#1DA1F2] text-white rounded hover:bg-[#1a8cd8]"
                    >
                      Tweet
                    </button>
                    <button
                      onClick={() => handleDeleteSavedTweet(tweet.id)}
                      className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
