import { Shield, Lock, Server, Cloud, CreditCard, Activity } from "lucide-react";

export function Features() {
    const features = [
        {
            title: "Anti-Theft Protocol",
            desc: "Prevents unauthorized code replication.",
            icon: <Shield className="w-6 h-6" />,
            color: "text-red-500"
        },
        {
            title: "cPanel Sentinel",
            desc: "Watches for file system tampering.",
            icon: <Server className="w-6 h-6" />,
            color: "text-blue-500"
        },
        {
            title: "Hacker Defense",
            desc: "Automated IP banning system.",
            icon: <Activity className="w-6 h-6" />,
            color: "text-cyan-500"
        },
        {
            title: "Cloud Restoration",
            desc: "Instant backup recovery.",
            icon: <Cloud className="w-6 h-6" />,
            color: "text-purple-500"
        },
        {
            title: "UTR Smart Pay",
            desc: "Automated payment verification.",
            icon: <CreditCard className="w-6 h-6" />,
            color: "text-emerald-500"
        },
        {
            title: "Tamper Forensics",
            desc: "Detailed logs of every intrusion attempt.",
            icon: <Lock className="w-6 h-6" />,
            color: "text-amber-500"
        }
    ];

    return (
        <section className="py-24 px-6 bg-slate-950">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((f, i) => (
                    <div key={i} className="group relative p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all hover:bg-white/10 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className={`p-4 rounded-2xl bg-black/50 w-fit mb-6 ${f.color} border border-white/5`}>
                            {f.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                        <p className="text-slate-400 font-medium">{f.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
