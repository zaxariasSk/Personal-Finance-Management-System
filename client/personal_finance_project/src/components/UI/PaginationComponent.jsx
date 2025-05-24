const PaginationComponent = ({
                                 data,
                                 currentPage,
                                 goToNextPage,
                                 goToPreviousPage,
                             }) => {

    if (data?.totalPages <= 1) {
        return null; // Don't render pagination if there's only one page
    }

    return (
        <div>
            <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
            >
                Previous
            </button>
            <span>{currentPage} of {data?.totalPages}</span>
            <button
                onClick={goToNextPage}
                disabled={currentPage === data?.totalPages}
            >
                Next
            </button>
        </div>
    );
};

export default PaginationComponent;
