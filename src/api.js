const API_BASE_URL = "https://api.videosdk.live";
const VIDEOSDK_TOKEN = process.env.REACT_APP_VIDEOSDK_TOKEN;
const API_AUTH_URL = process.env.REACT_APP_AUTH_URL;
const PROEDUEDGE_API = "http://localhost:5000/api/proeduedge/";
export const getToken = async () => {
  if (VIDEOSDK_TOKEN && API_AUTH_URL) {
    console.error(
      "Error: Provide only ONE PARAMETER - either Token or Auth API",
    );
  } else if (VIDEOSDK_TOKEN) {
    return VIDEOSDK_TOKEN;
  } else if (API_AUTH_URL) {
    const res = await fetch(`${API_AUTH_URL}/get-token`, {
      method: "GET",
    });
    const { token } = await res.json();
    return token;
  } else {
    console.error("Error: ", Error("Please add a token or Auth Server URL"));
  }
};

export const writeRoomToDb = async ({
  userId,
  courseId,
  roomId,
  recordingURL,
  isActive,
}) => {
  const res = await fetch(`${PROEDUEDGE_API}create-meeting`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, courseId, roomId, recordingURL, isActive }),
  });
  return res.json();
};

export const finishMeeting = async ({
  id,
  recordingURL,
  isActive,
  userId,
  courseId,
  roomId,
}) => {
  const res = await fetch(`${PROEDUEDGE_API}update-meeting`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      recordingURL,
      isActive,
      userId,
      courseId,
      roomId,
    }),
  });
  return res.json();
};
export const createMeeting = async ({ token }) => {
  const url = `${API_BASE_URL}/v2/rooms`;
  const options = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
  };

  const response = await fetch(url, options);
  const data = await response.json();

  if (data.roomId) {
    return { meetingId: data.roomId, err: null };
  } else {
    return { meetingId: null, err: data.error };
  }
};

export const validateMeeting = async ({ roomId, token }) => {
  const url = `${API_BASE_URL}/v2/rooms/validate/${roomId}`;

  const options = {
    method: "GET",
    headers: { Authorization: token, "Content-Type": "application/json" },
  };

  const response = await fetch(url, options);

  if (response.status === 400) {
    const data = await response.text();
    return { meetingId: null, err: data };
  }

  const data = await response.json();

  if (data.roomId) {
    return { meetingId: data.roomId, err: null };
  } else {
    return { meetingId: null, err: data.error };
  }
};
