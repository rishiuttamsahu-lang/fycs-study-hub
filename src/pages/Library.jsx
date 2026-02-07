import { FileText, Search, BookOpen, GraduationCap, Download, ArrowUpDown, Check } from "lucide-react";
import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";
import MaterialCard from "../components/MaterialCard";

export default function Library() {
  const { materials, subjects, semesters, getSubjectById, getSemesterById } = useApp();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sortBy, setSortBy] = useState("title"); // Default to A-Z
  const [showSortMenu, setShowSortMenu] = useState(false);
  
  // Helper function to convert Google Drive view links to direct download links
  const convertToDownloadLink = (viewLink) => {
    if (!viewLink) return viewLink;
    
    // Handle different Google Drive URL formats
    
    // Pattern 1: drive.google.com/file/d/{fileId}/view
    if (viewLink.includes("drive.google.com/file/d/")) {
      // Extract file ID from the URL
      const fileIdMatch = viewLink.match(/\/file\/d\/([^\/]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}&confirm=t`;
      }
    } 
    // Pattern 2: drive.google.com/open?id={fileId} (legacy format)
    else if (viewLink.includes("drive.google.com/open?id=")) {
      // Extract file ID from the legacy URL format
      const urlObj = new URL(viewLink);
      const fileId = urlObj.searchParams.get("id");
      if (fileId) {
        return `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`;
      }
    }
    // Pattern 3: Extract ID from URL between /d/ and /view (as specified in requirements)
    else if (viewLink.includes("/d/") && viewLink.includes("/view")) {
      const fileIdMatch = viewLink.match(/\/d\/([^\/]+)\/view/);
      if (fileIdMatch && fileIdMatch[1]) {
        return `https://drive.google.com/uc?export=download&id=${fileIdMatch[1]}&confirm=t`;
      }
    }
    
    // If it's not a Google Drive link, return the original link
    return viewLink;
  };

  // Get unique types from materials
  const allTypes = useMemo(() => {
    const types = new Set();
    materials.forEach(material => {
      if (material.type) {
        types.add(material.type);
      }
    });
    return Array.from(types).sort();
  }, [materials]);

  // Filter and sort materials based on search term, filters, and sort option
  const filteredMaterials = useMemo(() => {
    let result = materials.filter(material => {
      // Filter by search term (title or subject name)
      const matchesSearch = !searchTerm || 
        material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getSubjectById(material.subjectId)?.name.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by semester
      const matchesSemester = !selectedSemester || 
        material.semId === selectedSemester || 
        selectedSemester === "all";

      // Filter by type
      const matchesType = !selectedType || 
        material.type.toLowerCase() === selectedType.toLowerCase() || 
        selectedType === "all";

      // Only show approved materials
      const isApproved = material.status === "Approved";

      return matchesSearch && matchesSemester && matchesType && isApproved;
    });

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "newest") return b.createdAt?.seconds - a.createdAt?.seconds;
      if (sortBy === "oldest") return a.createdAt?.seconds - b.createdAt?.seconds;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });

    return result;
  }, [materials, searchTerm, selectedSemester, selectedType, getSubjectById, sortBy]);

  return (
    <div className="p-5 pt-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-4 text-center">
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          Study Library
        </h1>
        <p className="text-white/55 text-xs mt-1">
          Browse all notes, practicals, important materials, and assignments
        </p>
      </div>

      {/* Controls Section */}
      <div className="glass-card p-4 mb-4 relative z-50">
        <div className="space-y-3">
          {/* Search Bar with Sort Button */}
          <div className="flex gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-white/50" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search materials..."
                className="w-full glass-card pl-10 pr-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-[#FFD700] focus:outline-none"
              />
            </div>
            
            {/* Sort Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50 text-zinc-400 hover:text-white transition-colors"
                title="Sort materials"
              >
                <ArrowUpDown size={18} />
              </button>
              
              {/* Sort Dropdown Menu */}
              {showSortMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#09090b] border border-zinc-800 rounded-xl shadow-2xl z-50 py-1 overflow-hidden">
                  <div className="py-2">
                    {[
                      { value: "newest", label: "Newest First" },
                      { value: "oldest", label: "Oldest First" },
                      { value: "title", label: "Title A-Z" }
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setSortBy(option.value);
                          setShowSortMenu(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm flex items-center justify-between hover:bg-zinc-800 transition-colors ${
                          sortBy === option.value ? "text-[#FFD700] font-bold bg-zinc-800" : "text-zinc-200"
                        }`}
                      >
                        {option.label}
                        {sortBy === option.value && <Check size={16} />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Filters - Side by Side */}
          <div className="grid grid-cols-2 gap-2">
            {/* Semester Filter */}
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="glass-card px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white focus:border-[#FFD700] focus:outline-none text-sm"
            >
              <option value="all" className="bg-[#0a0a0a]">All Sem</option>
              {semesters.map(semester => (
                <option key={semester.id} value={semester.id} className="bg-[#0a0a0a]">
                  {semester.name.replace('Semester ', 'Sem ')}
                </option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="glass-card px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white focus:border-[#FFD700] focus:outline-none text-sm"
            >
              <option value="all" className="bg-[#0a0a0a]">All Types</option>
              {allTypes.map(type => (
                <option key={type} value={type} className="bg-[#0a0a0a]">
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-2 flex items-center justify-between">
        <p className="text-white/70 text-xs">
          Showing <span className="font-bold text-[#FFD700]">{filteredMaterials.length}</span> of {materials.filter(m => m.status === "Approved").length} approved materials
        </p>
      </div>

      {/* Materials Grid */}
      <div className="space-y-4">
        {filteredMaterials.length > 0 ? (
          filteredMaterials.map((material) => (
            <MaterialCard 
              key={material.id} 
              material={material} 
              convertToDownloadLink={convertToDownloadLink}
              getSubjectById={getSubjectById}
            />
          ))
        ) : (
          <div className="glass-card p-12 text-center">
            <FileText size={32} className="mx-auto mb-4 text-white/30" />
            <div className="font-semibold text-white mb-2">No materials found</div>
            <div className="text-sm text-white/40">
              Try adjusting your search or filter criteria
            </div>
          </div>
        )}
      </div>
    </div>
  );
}