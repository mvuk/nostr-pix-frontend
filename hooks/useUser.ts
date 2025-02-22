"use client";

import { useState, useEffect } from "react";
import { api, UserDetails } from "@/lib/api";

export function useUser() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      const storedDetails = localStorage.getItem("userDetails");

      if (storedUserId) {
        setUserId(storedUserId);
        if (storedDetails) {
          setUserDetails(JSON.parse(storedDetails));
        } else {
          fetchUserDetails(storedUserId);
        }
      }
    }
  }, []);

  const fetchUserDetails = async (id: string) => {
    setLoadingUserDetails(true);
    try {
      const details = await api.getUserDetails(id);
      setUserDetails(details);
      localStorage.setItem("userDetails", JSON.stringify(details));
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    } finally {
      setLoadingUserDetails(false);
    }
  };

  const createUser = async () => {
    try {
      const newUser = await api.generateNewUser();
      setUserId(newUser.id);
      localStorage.setItem("userId", newUser.id);
      const initialDetails = {
        user: newUser,
        pix_payments: [],
        lightning_deposits: [],
      };
      setUserDetails(initialDetails);
      localStorage.setItem("userDetails", JSON.stringify(initialDetails));
    } catch (error) {
      console.error("Failed to create account:", error);
      throw error;
    }
  };

  const refreshUserDetails = async () => {
    if (userId) {
      setLoadingUserDetails(true);
      try {
        const refreshedUserDetails = await api.refreshUserDetails(userId);
        setUserDetails(refreshedUserDetails);
        localStorage.setItem(
          "userDetails",
          JSON.stringify(refreshedUserDetails)
        );
      } catch (error) {
        console.error("Failed to refresh balance:", error);
        throw error;
      } finally {
        setLoadingUserDetails(false);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userDetails");
    setUserId(null);
    setUserDetails(null);
  };

  return {
    userId,
    userDetails,
    loadingUserDetails,
    createUser,
    refreshUserDetails,
    logout,
  };
}
