import React from "react";
import Lucide from "../Lucide";
import Notification from "../Notification";

interface NotificationProps {
  id: string;
  title: string;
  message: string;
  type: string;
}

interface Notification {
  id: "";
  title: "";
  message: "";
  type: "";
}

const Toast: React.FC<NotificationProps> = ({ id, title, message, type }) => {
  return (
    <>
      <Notification id={`${id}`} className="flex hidden">
        {type === "success" && (
          <Lucide icon="CheckCircle" className="text-success" />
        )}
        {type === "error" && <Lucide icon="XCircle" className="text-danger" />}
        <div className="ml-4 mr-4">
          <div className="font-medium">{title}</div>
          <div className="mt-1 text-slate-500">{message}</div>
        </div>
      </Notification>
    </>
  );
};

export default Toast;
