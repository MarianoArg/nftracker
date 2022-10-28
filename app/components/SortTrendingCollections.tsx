import { useEffect, useState } from "react";
import type { FC } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FiChevronDown } from "react-icons/fi";
import { useSearchParams } from "@remix-run/react";
import usePaginatedCollections from "~/hooks/usePaginatedCollections";

type Options = "Last 24 Hours" | "Last 7 Days" | "Last 30 Days";

const options: { [x: string]: Options } = {
  "1DayVolume": "Last 24 Hours",
  "7DayVolume": "Last 7 Days",
  "30DayVolume": "Last 30 Days",
};

const SortTrendingCollections: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { collections } = usePaginatedCollections();
  const [open, setOpen] = useState(false);
  const [sortSelection, setSortSelection] = useState<Options>("Last 7 Days");
  const sort = searchParams.get("sort");

  useEffect(() => {
    if (sort && options[sort]) {
      setSortSelection(options[sort]);
      return;
    }
    setSortSelection("Last 7 Days");
  }, [sort]);

  return (
    <DropdownMenu.Root onOpenChange={setOpen}>
      <DropdownMenu.Trigger className="flex w-[228px] justify-between rounded-md px-4 py-3 outline-none outline-[#CE66ED]">
        <span className="reservoir-label-l dark:text-gray-100">
          {sortSelection}
        </span>
        <FiChevronDown
          className={`h-5 w-5 text-[#9CA3AF] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        align="end"
        sideOffset={12}
        className="radix-side-bottom:animate-slide-down w-48 divide-y-[1px] divide-[#D1D5DB] overflow-hidden rounded-[8px] border-[1px] border-[#D1D5DB] bg-white shadow-md dark:divide-neutral-600 dark:border-neutral-600 dark:bg-neutral-800 md:w-56"
      >
        {Object.keys(options).map((key) => (
          <DropdownMenu.Item
            key={key}
            onClick={() => {
              collections.setSize(0);
              if (key === "lowest_price") {
                setSearchParams({ sort: "" });
              } else {
                setSearchParams({ sort: key });
              }
            }}
            disabled={sortSelection === options[key]}
            className={`reservoir-label-l reservoir-gray-dropdown-item cursor-pointer rounded-none px-4 py-3 hover:bg-neutral-100 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800`}
            aria-label={`Sort by ${options[key]}`}
          >
            {options[key]}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default SortTrendingCollections;
