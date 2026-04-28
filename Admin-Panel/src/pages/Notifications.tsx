import { HiOutlineBell, HiOutlineCheck } from "react-icons/hi";
import { SimpleNotification, Sidebar } from "../components";

const notifications = [
  { username: "johndoe",   hoursAgo: "2 jam lalu",  date: "Kamis 16.20", action: "mengikuti kamu" },
  { username: "markkwik",  hoursAgo: "3 jam lalu",  date: "Kamis 15.15", action: "menyukai ulasanmu" },
  { username: "markdoe",   hoursAgo: "4 jam lalu",  date: "Kamis 13.30", action: "mengikuti kamu" },
  { username: "gg86",      hoursAgo: "5 jam lalu",  date: "Kamis 12.10", action: "mengundangmu ke grup" },
];

const Notifications = () => {
  return (
    <div className="min-h-screen flex dark:bg-[#0D0B14] bg-[var(--bg-2)]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="page-header">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--brand-light)] flex items-center justify-center">
              <HiOutlineBell className="text-brand-600 dark:text-brand-400 text-lg" />
            </div>
            <div>
              <h2 className="page-title">Notifikasi</h2>
              <p className="page-subtitle">{notifications.length} notifikasi baru</p>
            </div>
          </div>
          <button className="btn-ghost flex items-center gap-2 text-sm">
            <HiOutlineCheck className="text-base" />
            Tandai Semua Dibaca
          </button>
        </div>

        <div className="p-6 max-w-2xl">
          <div className="card overflow-hidden">
            <div className="flex flex-col divide-y divide-[var(--border)]">
              {notifications.map((n) => (
                <div key={n.username} className="p-4">
                  <SimpleNotification
                    username={n.username}
                    date={n.date}
                    hoursAgo={n.hoursAgo}
                    action={n.action}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Notifications;
