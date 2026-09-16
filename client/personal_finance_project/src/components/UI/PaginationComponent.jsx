import styles from "./PaginationComponent.module.css";

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
        <div className={styles.pagination}>
            <button
            className={styles.button}
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
            >
                Previous
            </button>
            <span className={styles.pageStatus}>{currentPage} <span>of</span> {data?.totalPages}</span>
            <button
                className={styles.button}
                onClick={goToNextPage}
                disabled={currentPage === data?.totalPages}
            >
                Next
            </button>
        </div>
    );
};

export default PaginationComponent;
