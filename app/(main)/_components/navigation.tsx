import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import {
  ChevronLeftSquare,
  MenuIcon,
  PlusCircle,
  Search,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";
import {
  ElementRef,
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts"; //* can be done using tailwind but would be complicated, as it is resizable component
import Item from "./item";
import { UserItem } from "./user-item";

export const Navigation = () => {
  const pathname = usePathname();
  //* Create new document(note)
  const createNote = useMutation(api.documents.create);
  //*Responsive media query
  const isMobile = useMediaQuery("(max-width:768px)");
  //* refernces to Dom elements
  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isresetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile); //* Collapsed by default in mobile devices

  //* sidebar initial form
  useEffect(() => {
    if (isMobile) collapse();
    else resetWidth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) collapse();
  }, [pathname, isMobile]);

  /**
   * Handles event of holding sidebar border
   * @param event
   * @returns nothing
   */
  const handleMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    event.preventDefault(); //* oh man why
    event.stopPropagation();
    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = event.clientX;
    //* prevent this component width to go off limits
    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`
      );
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  //* creates a new note in DB
  const handleCreateNote = () => {
    //* returns a promise
    const promise = createNote({ title: "Untitled" });
    toast.promise(promise, {
      loading: "Creating new note...",
      success: "New note created.",
      error: "Failed to create note.",
    });
  };

  //* to reset sidebar width to minimum (default)
  const resetWidth = () => {
    setIsCollapsed(false);
    setIsResetting(true);

    //* width must extend differently in Mobile and md devices
    if (sidebarRef.current)
      sidebarRef.current.style.width = isMobile ? "100%" : "240px";

    if (navbarRef.current) {
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)"
      );
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
    }

    //* to sync with resetting animation
    setTimeout(() => setIsResetting(false), 300);
  };

  const collapse = () => {
    setIsCollapsed(true);
    setIsResetting(true);

    if (sidebarRef.current) sidebarRef.current.style.width = "0";
    if (navbarRef.current) {
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");
    }

    setTimeout(() => setIsResetting(false), 300);
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          " group/sidebar h-full bg-secondary overflow-y-auto relative flex flex-col w-60 z-[99999]",
          isresetting && " transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        <div
          role="button"
          onClick={collapse}
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100"
          )}
        >
          <ChevronLeftSquare className=" h-6 w-6" />
        </div>
        <div>
          <UserItem />

          {/* Search button */}
          <Item onClick={() => {}} icon={Search} label="Search" isSearch />

          {/* Settings Button  */}
          <Item onClick={() => {}} icon={Settings} label="Settings" />
          {/* Net Note button */}
          <Item onClick={handleCreateNote} label="New Page" icon={PlusCircle} />
        </div>
        <div className=" mt-4"></div>
        {/* grouping this hidden div with sidebar.. appears when hover on sidebar */}
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className=" bg-[#c0c0c0] opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute w-2 h-full bg-primary/10 right-0 top-0"
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          " absolute top-0 z-[99999] left-60 w-[calc(100% - 240px)]",
          isresetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}
      >
        <nav className=" bg-transparent px-3 py-2 w-full">
          {isCollapsed && (
            <MenuIcon
              role="button"
              onClick={resetWidth}
              className="h-6 w-6 text-muted-foreground"
            />
          )}
        </nav>
      </div>
    </>
  );
};


