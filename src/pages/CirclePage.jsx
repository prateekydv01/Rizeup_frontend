import CreateCircle from "../component/Circle/CreateCircle";
import JoinCircle from "../component/Circle/JoinCircle";
import MyCircles from "../component/Circle/MyCircles";

function CirclePage() {
  return (
    <div
      className="min-h-screen text-zinc-200 px-5 sm:px-10 md:px-16 lg:px-20 pt-8 pb-16"
      style={{ fontFamily: "'DM Sans', sans-serif", background: "var(--bg-base)" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--scrollbar); border-radius: 4px; }
      `}</style>

      <div className="fixed top-0 left-[20%] w-[400px] h-[300px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,0.04) 0%, transparent 70%)" }} />

      <div className="relative z-10">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-1 h-1 rounded-full" style={{ background: "#f97316" }} />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: "#f97316" }}>Rize Up</span>
          </div>
          <h1 className="font-black tracking-tight mb-1 page-title"
            style={{
              fontFamily: "'Syne', sans-serif", fontSize: "1.75rem",
              background: "linear-gradient(110deg, #ffffff 0%, #fb923c 45%, #ef4444 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
            Circles
          </h1>
          <p className="text-zinc-500 text-xs tracking-wide">Your people. Your orbit.</p>
        </div>

        {/* Create + Join — compact, side by side on md+, stacked on mobile */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10" >
          <div className="flex-1"><CreateCircle /></div>
          <div className="flex-1"><JoinCircle /></div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5">
            <div className="w-px h-3" style={{ background: "rgba(249,115,22,0.6)" }} />
            <span className="text-[9px] font-bold tracking-[0.3em] uppercase" style={{ color: "var(--text-faint)" }}>My Circles</span>
          </div>
          <div className="flex-1 h-px" style={{ background: "var(--border-default)" }} />
        </div>

        <MyCircles />
      </div>
    </div>
  );
}

export default CirclePage;