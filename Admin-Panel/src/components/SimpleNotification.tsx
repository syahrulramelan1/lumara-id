const SimpleNotification = ({
  imgSrc,
  username,
  date,
  hoursAgo,
  action,
}: {
  imgSrc?: string;
  username: string;
  date: string;
  hoursAgo: string;
  action: string;
}) => {
  const avatar = imgSrc || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-2)] border border-[var(--border)] hover:border-brand-400 transition-colors">
      <div className="flex gap-3 items-center">
        <img src={avatar} alt={username} className="w-10 h-10 rounded-full bg-[var(--bg-3)]" />
        <div>
          <p className="text-sm text-[var(--text)]">
            <span className="font-semibold">@{username}</span>{" "}{action}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">{date}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <div className="w-2 h-2 bg-brand-500 rounded-full" />
        <p className="text-xs text-[var(--text-muted)]">{hoursAgo}</p>
      </div>
    </div>
  );
};
export default SimpleNotification;
