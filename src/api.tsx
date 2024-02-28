import axios from "axios";
import { NewUserProps } from "./Auth/Auth";
import { BaseUser, DetailedUser } from "./Games/Games";
import { DetailedGame } from "./Games/Game/Game";

const API_URL = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllUsers = async () => {
  return api.get<BaseUser[]>("/users");
};

export const getUserByUuid = async (user_uuid: string) => {
  return api.get<BaseUser>(`/users/${user_uuid}`);
};

export const getUserWithToken = async (user_token: string) => {
  return api.get<DetailedUser>("/users/details/", {
    headers: {
      Authorization: `Bearer ${user_token}`,
    },
  });
};

export const getRoot = async () => {
  return api.get("/");
};

export const getGames = async (user_token: string) => {
  return api.get("/games/", {
    headers: {
      Authorization: `Bearer ${user_token}`,
    },
  });
};

export const getGame = async (game_id: string) => {
  const request = {
    headers: {
      ContentType: "application/json",
    },
  };
  return api.get<DetailedGame>(`/games/${game_id}`, request);
};

export const postUser = async (user_token: string, user: NewUserProps) => {
  const request = {
    headers: {
      Authorization: `Bearer ${user_token}`,
      ContentType: "application/json",
    },
  };
  return api.post("/users", user, request);
};

export const postGame = async (user_token: string) => {
  const request = {
    headers: {
      Authorization: `Bearer ${user_token}`,
      ContentType: "application/json",
    },
  };
  return api.post("/games/", {}, request);
};

export const deleteGame = async (game_id: string, user_token: string) => {
  const request = {
    headers: {
      Authorization: `Bearer ${user_token}`,
      ContentType: "application/json",
    },
  };
  return api.delete(`/games/${game_id}`, request);
};

export const assignGame = async (
  game_id: string,
  assignee_id: string,
  color: string,
  user_token: string
) => {
  const request = {
    headers: {
      Authorization: `Bearer ${user_token}`,
      ContentType: "application/json",
    },
  };
  return api.patch(`/games/${game_id}/assign`, { assignee_id, color }, request);
};

export const makeMove = async (
  game_id: string,
  start: string,
  end: string,
  user_token: string
) => {
  const request = {
    headers: {
      Authorization: `Bearer ${user_token}`,
      ContentType: "application/json",
    },
  };
  return api.patch(`/games/${game_id}`, { start, end }, request);
};
