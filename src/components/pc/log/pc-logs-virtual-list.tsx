"use client";

import { Box, ScrollArea, Spinner } from "@chakra-ui/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import React, { type ComponentProps, useEffect, useMemo, useRef } from "react";
import { usePcLogsInfiniteQuery } from "@/utils/hooks/queries/pcs/logs";
import type { IPcLog } from "@/types/pc/pc-log";
import Log from "@/components/pc/log/log-types/log";

interface Props extends ComponentProps<typeof ScrollArea.Root> {
  pcId: string;
}

function getItemProps(
  start: number,
  size: number,
): React.ComponentProps<"div"> {
  return {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: `${size}px`,
      transform: `translateY(${start}px)`,
    },
  };
}

const elementHeight = 48;

export function PcLogsVirtualList({ pcId, ...rest }: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePcLogsInfiniteQuery({ pcId, order: "desc" });

  const logs = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const count = hasNextPage ? logs.length + 1 : logs.length;

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => elementHeight,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) return;

    const isLoaderVisible = lastItem.index >= logs.length;
    if (isLoaderVisible && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [
    virtualItems,
    logs.length,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  const totalSize = virtualizer.getTotalSize();

  const contentProps = useMemo(
    (): React.ComponentProps<"div"> => ({
      style: {
        height: `${totalSize}px`,
        width: "100%",
        position: "relative",
      },
    }),
    [totalSize],
  );

  const renderedItems = useMemo(
    () =>
      virtualItems.map((virtualItem) => {
        const isLoader = virtualItem.index >= logs.length;
        const log: IPcLog | undefined = logs[virtualItem.index];

        return (
          <div
            key={virtualItem.key}
            {...getItemProps(virtualItem.start, virtualItem.size)}
          >
            {isLoader ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                h="full"
              >
                <Spinner size="sm" />
              </Box>
            ) : (
              <Log log={log} h="full" alignItems="center" />
            )}
          </div>
        );
      }),
    [logs, virtualItems],
  );

  return (
    <ScrollArea.Root {...rest}>
      <ScrollArea.Viewport ref={scrollRef}>
        <ScrollArea.Content {...contentProps}>
          {renderedItems}
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar />
    </ScrollArea.Root>
  );
}
