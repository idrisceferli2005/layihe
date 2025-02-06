import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "../redux/features/notificationSlice";


const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <div>
      <h1>Notifications</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
  {notifications && notifications.length > 0 ? (
    notifications.map((notification) => (
      <li key={notification._id}>
        {notification.message} - {notification.type}
      </li>
    ))
  ) : (
    <p>No notifications available.</p>
  )}
</ul>

    </div>
  );
};

export default Notifications;