import { IceCream2, Map, Settings } from "lucide-react";

interface NavBarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isAdmin: boolean;
}

export function NavBar({ currentPath, onNavigate, isAdmin }: NavBarProps) {
  const isAdminArea = currentPath.startsWith("/admin");

  return (
    <nav
      className="flex items-center border-t border-border"
      style={{ background: "#FFF8F2", flexShrink: 0 }}
    >
      <NavItem
        icon={<IceCream2 size={20} />}
        label="Feed"
        active={currentPath === "/"}
        onClick={() => onNavigate("/")}
      />
      <NavItem
        icon={<Map size={20} />}
        label="Map"
        active={currentPath === "/map"}
        onClick={() => onNavigate("/map")}
      />
      {isAdmin && (
        <NavItem
          icon={<Settings size={20} />}
          label="Admin"
          active={isAdminArea}
          onClick={() => onNavigate("/admin")}
          accent
        />
      )}
    </nav>
  );
}

function NavItem({
  icon,
  label,
  active,
  onClick,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  accent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex flex-col items-center gap-0.5 py-2.5 relative transition-all"
      style={{
        color: active ? "#C1415A" : accent ? "#8B6558" : "#8B6558",
        fontWeight: active ? 600 : 400,
      }}
    >
      <span style={{ color: active ? "#C1415A" : "#8B6558" }}>{icon}</span>
      <span
        style={{
          fontSize: 10,
          letterSpacing: "0.03em",
          color: active ? "#C1415A" : "#8B6558",
        }}
      >
        {label}
      </span>
      {active && (
        <span
          className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
          style={{ width: 32, height: 2, background: "#C1415A" }}
        />
      )}
    </button>
  );
}
