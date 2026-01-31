import { FileText, Search, BookOpen, GraduationCap } from "lucide-react";
import { useMemo, useState } from "react";
import { useApp } from "../context/AppContext";

export default function Library() {
  const { materials, subjects, semesters, getSubjectById, getSemesterById } = useApp();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedType, setSelectedType] = useState("");

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

  // Filter materials based on search term and filters
  const filteredMaterials = useMemo(() => {
    return materials.filter(material => {
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
  }, [materials, searchTerm, selectedSemester, selectedType, getSubjectById]);

  return (
    <div className="p-5 pt-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-4 text-center">
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          Study Library
        </h1>
        <p className="text-white/55 text-xs mt-1">
          Browse all notes, videos, and PYQs
        </p>
      </div>

      {/* Controls Section */}
      <div className="glass-card p-4 mb-4">
        <div className="space-y-3">
          {/* Search Bar */}
          <div className="relative">
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
          filteredMaterials.map((material) => {
            const subject = getSubjectById(material.subjectId);
            const semester = getSemesterById(material.semId);

            return (
              <div key={material.id} className="glass-card p-5">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <FileText size={20} className="text-white/85" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white/90 text-lg">{material.title}</h3>
                        <div className="text-sm text-white/60 mt-1">
                          {semester?.name} • {subject?.name} • {material.type}
                        </div>
                        <div className="flex gap-4 mt-2 text-xs text-white/50">
                          <span>👁 {material.views} views</span>
                          <span>⬇ {material.downloads || 0} downloads</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <a
                      href={material.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/15 border border-blue-500/25 text-blue-200 font-bold hover:bg-blue-500/20 transition-colors"
                    >
                      <FileText size={16} />
                      View
                    </a>
                  </div>
                </div>
              </div>
            );
          })
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