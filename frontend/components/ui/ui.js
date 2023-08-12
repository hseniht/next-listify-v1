import { createPortal } from "react-dom";
// import { useState, useEffect } from "react";
import css from "../../styles/ui/ui.module.css";
import { Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";

export const ModalBox = ({ title, onClose, children }) => {
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
        <div className={css["modal__box--header"]}>
          {title}
          <Button
            className={css["modal__box--close-btn"]}
            onClick={onClose}
            shape="circle"
            type="text"
            icon={<CloseOutlined />}
          />
        </div>
        <div className={css["modal__box--content"]}>{children}</div>
      </div>
    </div>,
    document.body
  );
};
