import { useState, useEffect } from "react";
import { FaSearch, FaMagic, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SmartSearch = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  // Mock AI-powered search suggestions (replace with actual API)
  const getSmartSuggestions = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);

    // Simulate API delay
    setTimeout(() => {
      const mockSuggestions = [
        {
          type: "skill",
          title: "Guitar Lessons for Beginners",
          category: "Music",
          match: "Highly recommended based on your search",
        },
        {
          type: "skill",
          title: "Advanced Guitar Techniques",
          category: "Music",
          match: "Similar to what you're looking for",
        },
        {
          type: "category",
          title: "Music Skills",
          count: 12,
          match: "Browse all music courses",
        },
        {
          type: "provider",
          title: "Jhankar Mahbub",
          specialty: "Programming & Music",
          match: "Top rated instructor",
        },
      ].filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setSuggestions(mockSuggestions);
      setIsSearching(false);
    }, 500);
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      getSmartSuggestions(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/service?search=${encodeURIComponent(query)}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === "category") {
      navigate(`/service?category=${encodeURIComponent(suggestion.title)}`);
    } else {
      navigate(`/service?search=${encodeURIComponent(suggestion.title)}`);
    }
    setQuery("");
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <div className="flex items-center gap-2 bg-white rounded-full shadow-lg px-6 py-3 border-2 border-transparent focus-within:border-[#422AD5] transition-all">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search for skills, categories, or instructors..."
            className="flex-1 outline-none text-gray-700"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSuggestions([]);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes />
            </button>
          )}
          <button
            type="submit"
            className="bg-[#422AD5] text-white px-6 py-2 rounded-full hover:bg-[#3a1fb8] transition-colors flex items-center gap-2"
          >
            <FaMagic className="text-sm" />
            Search
          </button>
        </div>
      </form>

      {/* Smart Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-base-100 rounded-lg shadow-xl border border-base-300 max-h-96 overflow-y-auto z-50">
          <div className="p-3 border-b bg-base-200">
            <p className="text-sm text-base-content/70 flex items-center gap-2">
              <FaMagic className="text-primary" />
              AI-Powered Suggestions
            </p>
          </div>

          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left p-4 hover:bg-base-200 transition-colors border-b border-base-300 last:border-b-0"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-base-content mb-1">
                    {suggestion.title}
                  </h4>
                  {suggestion.category && (
                    <p className="text-sm text-base-content/70">
                      {suggestion.category}
                    </p>
                  )}
                  {suggestion.specialty && (
                    <p className="text-sm text-base-content/70">
                      {suggestion.specialty}
                    </p>
                  )}
                  {suggestion.count && (
                    <p className="text-sm text-base-content/70">
                      {suggestion.count} skills available
                    </p>
                  )}
                </div>
                <div className="ml-4">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      suggestion.type === "skill"
                        ? "bg-blue-100 text-blue-800"
                        : suggestion.type === "category"
                        ? "bg-green-100 text-green-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {suggestion.type}
                  </span>
                </div>
              </div>
              <p className="text-xs text-base-content/60 mt-2">
                {suggestion.match}
              </p>
            </button>
          ))}
        </div>
      )}

      {isSearching && (
        <div className="absolute top-full mt-2 w-full bg-base-100 rounded-lg shadow-xl border border-base-300 p-4">
          <div className="flex items-center gap-3">
            <div className="loading loading-spinner loading-sm text-primary"></div>
            <p className="text-sm text-base-content/70">
              Finding the best matches for you...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartSearch;
