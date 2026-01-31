import { ArrowLeft, Book } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Subjects() {
  const navigate = useNavigate();
  const { semId } = useParams();
  
  const { subjects, getSemesterById, getSubjectsBySemester, getMaterialsBySubject } = useApp();
  
  // Safety check: Ensure subjects data exists
  if (!subjects) {
    return (
      <div className="p-5 pt-8 max-w-md mx-auto">
        <div className="glass-card p-6 text-center">
          <div className="font-semibold text-white">Loading subjects...</div>
          <div className="text-sm text-white/50 mt-2">Please wait</div>
        </div>
      </div>
    );
  }
  
  // Get semester info
  const semester = getSemesterById(semId);
  
  // Safety check: Semester not found
  if (!semester) {
    return (
      <div className="p-5 pt-8 max-w-md mx-auto">
        <div className="glass-card p-6">
          <div className="font-semibold text-white mb-2">Semester not found</div>
          <div className="text-sm text-white/50 mb-4">
            Please go back and choose a valid semester.
          </div>
          <button
            type="button"
            className="btn-primary w-full"
            onClick={() => navigate("/")}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }
  
  // Get subjects for this semester (with type-safe filtering)
  const semesterSubjects = getSubjectsBySemester(semId) || [];
  
  return (
    <div className="p-5 pt-6 max-w-md mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="glass-card h-10 w-10 flex items-center justify-center hover:bg-white/10 transition-colors"
          aria-label="Back to Home"
          title="Back to Home"
        >
          <ArrowLeft size={18} className="text-white/80" />
        </button>
        
        <div className="text-center">
          <div className="text-xs text-white/55 uppercase tracking-wider font-bold">Subjects</div>
          <div className="font-bold text-lg">{semester.name}</div>
        </div>
        
        <div className="w-10" /> {/* Spacer for alignment */}
      </div>

      {/* Subject List Header */}
      <div className="flex items-center gap-2 mb-4 text-white/50 uppercase text-xs tracking-widest font-bold">
        <Book size={14} />
        <span>Subject List</span>
      </div>

      {/* Subjects Grid */}
      <div className="space-y-3">
        {semesterSubjects && semesterSubjects.length > 0 ? (
          semesterSubjects.map((subject) => {
            // Get approved materials count for this subject
            const approvedCount = getMaterialsBySubject(subject.id)?.length || 0;
            
            return (
              <Link
                key={subject.id}
                to={`/semester/${semId}/${subject.id}`}
                className="glass-card w-full p-4 flex items-center gap-3 transition-all hover:bg-white/5 hover:scale-[1.02] active:scale-[0.98]"
              >
                {/* Subject Icon */}
                <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-extrabold text-xs text-white/85">
                  {subject.name
                    .split(" ")
                    .slice(0, 2)
                    .map((word) => word[0]?.toUpperCase() || "")
                    .join("")}
                </div>

                {/* Subject Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate text-white">{subject.name}</div>
                  <div className="text-xs text-white/55 truncate">
                    {approvedCount} approved material{approvedCount !== 1 ? "s" : ""}
                  </div>
                </div>

                {/* Arrow */}
                <div className="text-white/40">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </div>
              </Link>
            );
          })
        ) : (
          // Empty State
          <div className="glass-card p-8 text-center">
            <div className="text-white/50 mb-2">
              <Book size={32} className="mx-auto mb-3 opacity-50" />
            </div>
            <div className="font-semibold text-white mb-1">No subjects found</div>
            <div className="text-sm text-white/40">
              No subjects are available for {semester.name} yet.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

