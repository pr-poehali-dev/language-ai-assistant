import Icon from "@/components/ui/icon";
import { Teacher } from "./teachers.data";

interface TeacherListScreenProps {
  teachers: Teacher[];
  onStartCall: (teacher: Teacher) => void;
  onOpenChat: (teacher: Teacher) => void;
}

export default function TeacherListScreen({ teachers, onStartCall, onOpenChat }: TeacherListScreenProps) {
  return (
    <div className="min-h-screen bg-mesh">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        <div className="animate-fade-in">
          <h1 className="font-display font-bold text-white text-2xl mb-1">ИИ-преподаватели</h1>
          <p className="text-muted-foreground font-body text-sm">
            Живое общение, голосовые звонки и персональная похвала
          </p>
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap gap-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {[
            { icon: "Phone", text: "Звонок с ИИ", color: "text-neon-purple" },
            { icon: "MessageCircle", text: "Чат 24/7", color: "text-neon-cyan" },
            { icon: "Star", text: "Эмоц. поддержка", color: "text-amber-400" },
            { icon: "TrendingUp", text: "Следит за прогрессом", color: "text-neon-green" },
          ].map(b => (
            <div key={b.text} className="glass flex items-center gap-2 px-3 py-1.5 rounded-full">
              <Icon name={b.icon as "Phone"} size={13} className={b.color} />
              <span className="text-xs font-body text-white">{b.text}</span>
            </div>
          ))}
        </div>

        {/* Teachers grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {teachers.map((teacher, i) => (
            <div key={teacher.id}
              className="animate-fade-in glass rounded-3xl overflow-hidden card-hover"
              style={{ animationDelay: `${0.15 + i * 0.08}s` }}>

              {/* Top banner */}
              <div className={`bg-gradient-to-r ${teacher.color} p-5 flex items-center gap-4 relative overflow-hidden`}>
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full" />
                <div className="absolute -right-2 -bottom-8 w-16 h-16 bg-white/10 rounded-full" />
                <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-4xl flex-shrink-0 backdrop-blur-sm">
                  {teacher.avatar}
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-display font-bold text-white text-xl">{teacher.name}</h3>
                    <span className="text-lg">{teacher.flag}</span>
                  </div>
                  <p className="text-white/80 font-body text-xs mb-1">{teacher.spec}</p>
                  <p className="text-white/60 font-body text-xs italic">"{teacher.personality}"</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex border-b border-white/10">
                {[
                  { label: "Рейтинг", value: String(teacher.rating), icon: "Star" },
                  { label: "Студентов", value: teacher.students, icon: "Users" },
                  { label: "Уровни", value: teacher.level, icon: "BarChart2" },
                ].map(stat => (
                  <div key={stat.label} className="flex-1 flex flex-col items-center py-3 gap-0.5">
                    <Icon name={stat.icon as "Star"} size={13} className="text-muted-foreground" />
                    <span className="font-display font-bold text-white text-sm">{stat.value}</span>
                    <span className="text-xs text-muted-foreground font-body">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Praise preview */}
              <div className="px-5 py-3 border-b border-white/10">
                <p className="text-xs text-muted-foreground font-body mb-1 flex items-center gap-1">
                  <Icon name="MessageSquare" size={11} />
                  Пример похвалы:
                </p>
                <p className="text-sm text-white font-body italic opacity-80 leading-relaxed">
                  "{teacher.praise[0]}"
                </p>
              </div>

              {/* Actions */}
              <div className="p-4 flex gap-3">
                <button
                  onClick={() => onOpenChat(teacher)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 glass rounded-2xl text-white font-body text-sm font-medium hover:bg-white/10 transition-colors">
                  <Icon name="MessageCircle" size={16} className="text-neon-cyan" />
                  Чат
                </button>
                <button
                  onClick={() => onStartCall(teacher)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-white font-body text-sm font-medium bg-gradient-to-r ${teacher.color} hover:opacity-90 transition-opacity`}
                  style={{ boxShadow: `0 4px 20px ${teacher.glow}` }}>
                  <Icon name="Phone" size={16} />
                  Позвонить
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
