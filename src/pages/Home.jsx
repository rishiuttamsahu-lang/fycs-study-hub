import { BookOpen, FileText, GraduationCap, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import dbLogo from "../assets/image.png";

const Home = () => {
  const navigate = useNavigate();
  const { semesters, subjects, getRecentMaterials, getSubjectById, getSemesterById, isAdmin } = useApp();

  const semestersVm = semesters.map((s) => ({
    id: s.id,
    title: s.name,
    subjects: subjects.filter((sub) => Number(sub.semId) === Number(s.id)).length,
  }));

  const recentApproved = getRecentMaterials(5);

  return (
    <div className="p-5 pt-10 max-w-md mx-auto">
      {/* Header Section */}
      <div className="text-center mb-10">
        <img src={dbLogo} alt="FYCS Study Hub Logo" className="w-16 h-16 object-contain mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-1">FYCS Study Hub</h1>
        <p className="text-gray-400 text-xs">Your central hub for first year computer science</p>
      </div>

      {/* Quick Section Title */}
      <div className="flex items-center gap-2 mb-4 text-white/50 uppercase text-[10px] tracking-widest font-bold">
        <BookOpen size={14} />
        <span>Quick Section</span>
      </div>

      {/* Semesters Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {semestersVm.map((sem) => (
          <button
            key={sem.id}
            type="button"
            onClick={() => navigate(`/semester/${sem.id}`)}
            className="glass-card p-4 text-left transition-colors hover:bg-white/5"
          >
            <div className="bg-white/5 border border-white/10 w-9 h-9 rounded-xl flex items-center justify-center mb-3">
              <GraduationCap size={18} className="text-white/90" />
            </div>
            <h3 className="font-bold text-sm mb-1">{sem.title}</h3>
            <p className="text-[10px] text-white/50">{sem.subjects} subjects available</p>
          </button>
        ))}
      </div>

      {/* Materials Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-white/50 uppercase text-[10px] tracking-widest font-bold">
          <Layers size={14} />
          <span>Materials</span>
        </div>
        <button
          type="button"
          className="text-[11px] font-semibold text-[#FFD700] hover:opacity-90 transition-opacity"
          onClick={() => navigate("/admin")}
        >
          Explore
        </button>
      </div>

      <div className="space-y-4">
        {recentApproved.length > 0 ? (
          recentApproved.map((m) => {
            const sub = getSubjectById(m.subjectId);
            const sem = getSemesterById(m.semId);
            return (
              <div key={m.id} className="glass-card p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <FileText size={18} className="text-white/85" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{m.title}</div>
                    <div className="text-[11px] text-white/55 mt-1 truncate">
                      {sem?.name} • {sub?.name} • {m.type}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    className="btn-primary flex-1 py-2 text-sm rounded-xl"
                    onClick={() => navigate(`/semester/${m.semId}/${m.subjectId}`)}
                  >
                    View
                  </button>
                  <div className="text-[11px] text-white/55 text-right min-w-[84px]">
                    <div>👁 {m.views}</div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="glass-card p-8 text-center">
            <div className="text-white/50 mb-2">No materials found</div>
            <div className="text-sm text-white/40">
              Be the first to upload!
            </div>
            {isAdmin && (
              <button
                type="button"
                className="btn-primary mt-4 px-6 py-2 text-sm"
                onClick={() => navigate("/upload")}
              >
                Upload Material
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;