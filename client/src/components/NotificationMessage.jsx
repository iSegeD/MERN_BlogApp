import { useSelector } from "react-redux";

const NotificationMessage = () => {
  const message = useSelector((state) => state.notification);

  const lower = message?.toLowerCase() || "";

  const isError = lower.startsWith("error:");
  const isSuccess = lower.startsWith("success:");

  const text = message ? message.replace(/^(error:|success:)\s*/i, "") : "";

  const textColor = isError
    ? "text-red-600"
    : isSuccess
    ? "text-green-600"
    : "";

  return (
    <p
      className={`text-center mb-10 min-h-[1.5rem] font-semibold ${textColor}`}
    >
      {text || "\u00A0"}
    </p>
  );
};

export default NotificationMessage;
