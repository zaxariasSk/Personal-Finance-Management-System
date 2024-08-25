import {useEffect, useRef} from 'react';
import {createPortal} from 'react-dom';
import styles from "./Modal.module.css";

export default function Modal({
                                  openModal,
                                  closeModal,
                                  children
                              }) {
    const ref = useRef();

    useEffect(() => {
        if (openModal) {
            ref.current?.showModal();
        } else {
            ref.current?.close();
        }
    }, [openModal]);

    return createPortal(
        <dialog
            className={styles.modal}
            ref={ref}
            onCancel={closeModal}
        >
            {children}
            <button onClick={closeModal}>
                Close
            </button>
        </dialog>,
        document.getElementById('modal')
    );
}
