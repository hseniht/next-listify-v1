import { createPortal } from "react-dom";
// import { useState, useEffect } from "react";
import css from "../../styles/ui/ui.module.css";

export const ModalBox = ({ onClose, children }) => {
  // custom div wrapper
  //   const [modalContainer] = useState(document.createElement("div"));
  //   useEffect(() => {
  //     document.body.appendChild(modalContainer);
  //     return () => {
  //       document.body.removeChild(modalContainer);
  //     };
  //   }, [modalContainer]);

  return createPortal(
    <div className={css["modal__overlay"]}>
      <div className={css["modal__box"]}>
        <button className={css["modal__box--close-btn"]} onClick={onClose}>
          x
        </button>
        <div className={css["modal__box--content"]}>{children}</div>
      </div>
    </div>,
    document.body
  );
};
