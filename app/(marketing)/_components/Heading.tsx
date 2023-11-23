import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Heading = () => {
  return (
    <div className="max-w-xl space-y-4">
      <h1 className=" text-3xl sm:text-5xl md:text-5xl font-bold">
        Your Ideas, Documents, &amp; Plans. Unified. Welcome to{" "}
        <span className="underline">Notion</span>
      </h1>
      <h3 className=" text-base sm:text-xl md:text-2xl font-medium ">
        Notion is the conected Workspace where, <br />
        Better, faster Work happens.
      </h3>
      <Button className=" ">
        Get Started <ArrowRight className=" h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};

export default Heading;
