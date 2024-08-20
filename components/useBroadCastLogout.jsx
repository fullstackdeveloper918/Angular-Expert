import { useEffect } from "react";
import { auth } from "../utils/firebase";
import { useRouter } from "next/navigation";

const useBroadcastLogout = () => {
  const router = useRouter();
  console.log("useRouter");

  useEffect(() => {
    const broadcastChannel = new BroadcastChannel("auth");

    console.log(broadcastChannel, "broadchannel");

    // Listen for messages from other tabs
    broadcastChannel.onmessage = (event) => {
      if (event.data === "logout") {
        auth.signOut();
        router.push("/auth/signin");
      }
    };

    // Cleanup when the component is unmounted
    return () => {
      broadcastChannel.close();
    };
  }, [router]);

  // Function to broadcast the logout event
  const broadcastLogout = () => {
    const broadcastChannel = new BroadcastChannel("auth");
    broadcastChannel.postMessage("logout");
    broadcastChannel.close(); // Close after sending the message
  };

  return broadcastLogout;
};

export default useBroadcastLogout;
