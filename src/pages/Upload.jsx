import { CloudUpload, Link2, Tag } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useApp } from "../context/AppContext";

export default function Upload() {
  const navigate = useNavigate();
  const { semesters, subjects, addMaterial, isAdmin } = useApp();
  
  // Redirect non-admin users
  useEffect(() => {
    if (isAdmin === false) {
      navigate("/");
    }
  }, [isAdmin, navigate]);
  
  // Prevent rendering if not admin
  if (isAdmin === false) {
    return null;
  }

  const types = useMemo(
    () => ["Notes", "Practicals", "IMP", "Assignment"],
    []
  );

  const [form, setForm] = useState({
    title: "",
    semester: "",
    type: "Notes",
    subject: "",
    driveLink: "",
    uploadedBy: "Student",
  });

  // Get subjects filtered by selected semester
  const filteredSubjects = useMemo(
    () => subjects.filter(s => Number(s.semId) === Number(form.semester)),
    [subjects, form.semester]
  );

  // Check if form is valid
  const isFormValid = form.title && form.semester && form.subject && form.driveLink;

  function onChange(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    
    // Validate required fields
    if (!form.title || !form.subject || !form.driveLink) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      // Add material through context (async)
      const result = await addMaterial({
        title: form.title,
        semId: form.semester,
        subjectId: form.subject,
        type: form.type,
        link: form.driveLink,
        uploadedBy: form.uploadedBy,
      });
      
      if (result.success) {
        // Reset form
        setForm({
          title: "",
          semester: "",
          type: "Notes",
          subject: "",
          driveLink: "",
          uploadedBy: "Student",
        });
        
        toast.success("Material submitted successfully! Pending approval.");
      } else {
        const msg = result.error || "An unknown error occurred during submission";
        toast.error("Error submitting material: " + msg);
      }
    } catch (error) {
      console.error("Upload Error Details:", error);
      const msg = error?.message || error?.toString() || "An unknown error occurred";
      toast.error("Error submitting material: " + msg);
    }
  }

  return (
    <div className="p-5 pt-8 max-w-md mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Upload</h2>
        <p className="text-white/55 text-xs mt-1">
          Share notes, practicals, important materials, and assignments.
        </p>
      </div>

      <form className="glass-card p-4" onSubmit={onSubmit}>
        <div className="mb-4">
          <div className="text-white/50 uppercase text-[10px] tracking-widest font-bold">
            Publish Material
          </div>
          <div className="text-[12px] text-white/70 mt-2">
            Fill in the details exactly so students can find it easily.
          </div>
        </div>

        {/* Title */}
        <label className="block mb-4">
          <div className="text-[11px] font-bold text-white/70 mb-2">Title</div>
          <input
            value={form.title}
            onChange={onChange("title")}
            placeholder='e.g., Unit 1 Notes'
            className="w-full glass-card px-4 py-3 text-sm outline-hidden placeholder:text-white/35"
            required
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          {/* Semester */}
          <label className="block mb-4">
            <div className="text-[11px] font-bold text-white/70 mb-2">
              Semester *
            </div>
            <select
              value={form.semester}
              onChange={onChange("semester")}
              className="w-full glass-card px-4 py-3 text-sm outline-hidden"
              required
            >
              <option value="" className="bg-[#0a0a0a]">Select Semester</option>
              {semesters.map((s) => (
                <option key={s.id} value={s.id} className="bg-[#0a0a0a]">
                  {s.name}
                </option>
              ))}
            </select>
          </label>

          {/* Type */}
          <label className="block mb-4">
            <div className="text-[11px] font-bold text-white/70 mb-2">Type *</div>
            <select
              value={form.type}
              onChange={onChange("type")}
              className="w-full glass-card px-4 py-3 text-sm outline-hidden"
              required
            >
              {types.map((t) => (
                <option key={t} value={t} className="bg-[#0a0a0a]">
                  {t}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Subject */}
        <label className="block mb-4">
          <div className="text-[11px] font-bold text-white/70 mb-2">Subject *</div>
          <select
            value={form.subject}
            onChange={onChange("subject")}
            className={`w-full glass-card px-4 py-3 text-sm outline-hidden ${!form.semester ? "opacity-50" : ""}`}
            required
            disabled={!form.semester}
          >
            <option value="" className="bg-[#0a0a0a]">
              {form.semester ? "Select subject..." : "Select semester first"}
            </option>
            {filteredSubjects.map((s) => (
              <option key={s.id} value={s.id} className="bg-[#0a0a0a]">
                {s.name} (Sem {s.semId})
              </option>
            ))}
          </select>
          {!form.semester && (
            <div className="text-[10px] text-amber-400 mt-1">
              Please select a semester first
            </div>
          )}
        </label>

        {/* Google Drive Link */}
        <label className="block mb-4">
          <div className="text-[11px] font-bold text-white/70 mb-2">
            Google Drive Link *
          </div>
          <div className="glass-card px-4 py-3 flex items-center gap-3">
            <Link2 size={18} className="text-white/55" />
            <input
              value={form.driveLink}
              onChange={onChange("driveLink")}
              placeholder="https://drive.google.com/..."
              className="w-full bg-transparent text-sm outline-hidden placeholder:text-white/35"
              required
            />
          </div>
        </label>

        {/* Uploader Name */}
        <label className="block mb-5">
          <div className="text-[11px] font-bold text-white/70 mb-2">Your Name</div>
          <div className="glass-card px-4 py-3 flex items-center gap-3">
            <Tag size={18} className="text-white/55" />
            <input
              value={form.uploadedBy}
              onChange={onChange("uploadedBy")}
              placeholder="Enter your name"
              className="w-full bg-transparent text-sm outline-hidden placeholder:text-white/35"
            />
          </div>
        </label>

        {/* Submit */}
        <button 
          type="submit" 
          className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            isFormValid 
              ? "btn-primary" 
              : "bg-white/10 text-white/30 cursor-not-allowed"
          }`}
          disabled={!isFormValid}
        >
          {isFormValid ? "Publish Material" : "Fill all required fields"}
          <CloudUpload size={18} />
        </button>
      </form>
    </div>
  );
}

