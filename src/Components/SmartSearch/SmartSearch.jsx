import { useState, useEffect, useRef } from "react";
import { FaSearch, FaTimes, FaTag, FaUser, FaLayerGroup } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";

const SmartSearch = () => {
  const [query, setQuery] = useState("");
  const [allSkills, setAllSkills] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Load real skills data once
  useEffect(() => {
    fetch("/skills.json")
      .then((res) => res.json())
      .then((data) => setAllSkills(data))
      .catch(() => {});
  }, []);

  // Compute suggestions from real data
  useEffect(() => {
    const timer = setTimeout(() => {
      const q = query.trim().toLowerCase();
      if (!q || allSkills.length === 0) {
        setSuggestions([]);
        return;
      }

      const matchedSkills = allSkills
        .filter(
          (s) =>
            s.skillName?.toLowerCase().includes(q) ||
            s.category?.toLowerCase().includes(q)
        )
        .slice(0, 5)
        .map((s) => ({
          type: "skill",
          icon: <FaTag size={12} />,
          title: s.skillName,
          meta: s.category,
          skillId: s.skillId,
        }));

      const matchedProviders = allSkills
        .filter((s) => s.providerName?.toLowerCase().includes(q))
        .slice(0, 2)
        .map((s) => ({
          type: "provider",
          icon: <FaUser size={12} />,
          title: s.providerName,
          meta: `${s.category} tutor`,
          skillId: s.skillId,
        }));

      const categorySet = new Set();
      const matchedCategories = allSkills
        .filter((s) => {
          if (!s.category?.toLowerCase().includes(q)) return false;
          if (categorySet.has(s.category)) return false;
          categorySet.add(s.category);
          return true;
        })
        .slice(0, 2)
        .map((s) => ({
          type: "category",
          icon: <FaLayerGroup size={12} />,
          title: s.category,
          meta: "Browse category",
        }));

      // deduplicate by title
      const seen = new Set();
      const combined = [...matchedCategories, ...matchedSkills, ...matchedProviders].filter((s) => {
        if (seen.has(s.title)) return false;
        seen.add(s.title);
        return true;
      });

      setSuggestions(combined.slice(0, 7));
    }, 200);

    return () => clearTimeout(timer);
  }, [query, allSkills]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/service?search=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (s) => {
    if (s.type === "skill" && s.skillId) {
      navigate(`/skill/${s.skillId}`);
    } else if (s.type === "category") {
      navigate(`/service?category=${encodeURIComponent(s.title)}`);
    } else {
      navigate(`/service?search=${encodeURIComponent(s.title)}`);
    }
    setQuery("");
    setShowSuggestions(false);
  };

  const typeColor = {
    skill: "text-blue-500 bg-blue-50",
    provider: "text-green-600 bg-green-50",
    category: "text-purple-600 bg-purple-50",
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <p className="text-center text-base-content/60 text-sm font-medium mb-3 uppercase tracking-widest">
        🔍 What do you want to learn today?
      </p>
      <form onSubmit={handleSearch}>
        <div
          className={`flex items-center gap-3 bg-base-100 rounded-2xl shadow-lg px-5 py-3.5 border-2 transition-all duration-300 ${
            focused ? "border-primary shadow-primary/20 shadow-xl" : "border-base-300"
          }`}
        >
          <FaSearch className={`shrink-0 transition-colors ${focused ? "text-primary" : "text-base-content/30"}`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
            onFocus={() => { setFocused(true); setShowSuggestions(true); }}
            onBlur={() => { setFocused(false); setTimeout(() => setShowSuggestions(false), 150); }}
            placeholder="Search skills, tutors, or categories..."
            className="flex-1 outline-none bg-transparent text-base-content placeholder:text-base-content/30 text-sm font-medium"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); setSuggestions([]); inputRef.current?.focus(); }}
              className="shrink-0 text-base-content/30 hover:text-base-content/70 transition-colors"
            >
              <FaTimes size={14} />
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary btn-sm rounded-xl px-4 shrink-0"
          >
            Search
          </button>
        </div>
      </form>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <Motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full left-0 right-0 mt-2 bg-base-100 rounded-2xl shadow-2xl border border-base-300 z-50 overflow-hidden"
          >
            <p className="px-4 pt-3 pb-1 text-xs font-bold text-base-content/40 uppercase tracking-widest">
              Suggestions
            </p>
            {suggestions.map((s, i) => (
              <button
                key={i}
                onMouseDown={() => handleSuggestionClick(s)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-base-200 transition-colors text-left group"
              >
                <span className={`p-1.5 rounded-lg ${typeColor[s.type] || "text-gray-500 bg-gray-100"}`}>
                  {s.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-base-content truncate group-hover:text-primary transition-colors">
                    {s.title}
                  </p>
                  <p className="text-xs text-base-content/45 truncate">{s.meta}</p>
                </div>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${typeColor[s.type]}`}>
                  {s.type}
                </span>
              </button>
            ))}
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Popular tags */}
      {!query && (
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {["Programming", "Music", "Design", "Marketing", "Fitness", "Language"].map((tag) => (
            <button
              key={tag}
              onClick={() => { navigate(`/service?category=${tag}`); }}
              className="px-3 py-1 text-xs font-semibold rounded-full border border-base-300 bg-base-100 text-base-content/60 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartSearch;
