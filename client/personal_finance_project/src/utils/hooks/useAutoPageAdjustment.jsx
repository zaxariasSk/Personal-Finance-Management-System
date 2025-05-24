import { useEffect } from "react";

export const useAutoPageAdjustment = ({
                                          data,
                                          isFetching,
                                          currentPage,
                                          setPage,
                                          itemsKey,
                                      }) => {

    useEffect(() => {
        if (!isFetching && data) {
            const items = data[itemsKey] || [];
            const { totalPages } = data;

            // If current page is empty but other pages exist, go back
            if (items.length === 0 && totalPages > 0) {
                setPage((prev) => Math.min(prev - 1, totalPages));
            }
            // If current page exceeds total pages (due to deletions), go to last page
            else if (currentPage > totalPages && totalPages > 0) {
                setPage(totalPages);
            }
        }
    }, [data, isFetching, currentPage, setPage, itemsKey]);
};