import { useDispatch, useSelector } from "react-redux";
import { followUser, unfollowUser } from "../../redux/features/friendSlice";
import styles from "./FriendRequest.module.css"

function FollowButton({ userId, followId }) {
  const dispatch = useDispatch();
  const { following } = useSelector(state => state.follow);

  const isFollowing = following.includes(followId);

  const handleFollow = () => {
    if (isFollowing) {
      dispatch(unfollowUser(userId, followId));
    } else {
      dispatch(followUser(userId, followId));
    }
  };

  return (
    <button className={styles.number} onClick={handleFollow}>
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}

export default FollowButton;
