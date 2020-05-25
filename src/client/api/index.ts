import axios, {AxiosRequestConfig} from "axios";

import {Kanban, Board} from "../../server/model/kanban";

import {RawCard} from "../../server/model/card";

export const url = "http://localhost:8080";

const refreshInterval = 15 * 600000;

type Token = {
  accessToken: string;
};

type Error = {
  status: number;
  message: string;
};

/**
 * get accessToken from local
 */
const getAuthToken = (): string => {
  return "Bearer " + localStorage.getItem("token") || "";
};

/**
 * refresh token
 */
const refreshAuthToken = async (): Promise<number> => {
  const options: AxiosRequestConfig = {
    method: "PUT",
    url: url + "/api/user/me/accessToken",
    headers: {
      Authorization: getAuthToken()
    }
  };
  const response = await axios(options);
  if (response && response.status === 200) {
    localStorage.setItem("token", response.data.accessToken);
    setTimeout(() => {
      refreshAuthToken();
    }, refreshInterval);
  }
  return response.status;
};

/**
 * signin
 */
export const signin = async (email: string, password: string): Promise<number> => {
  const options: AxiosRequestConfig = {
    method: "POST",
    url: url + "/api/user/accessToken",
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      email: email,
      password: password
    }
  };
  const response = await axios(options);
  if (response && response.status === 200) {
    console.log(response.data);
    localStorage.setItem("token", response.data.accessToken);
    localStorage.setItem("user", response.data._id);
    setTimeout(() => {
      refreshAuthToken();
    }, refreshInterval);
  }

  return response.status;
};

/**
 * signup
 */
export const signup = async (email: string, password: string): Promise<Token | undefined> => {
  const options: AxiosRequestConfig = {
    method: "POST",
    url: url + "/api/user",
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      email: email,
      password: password
    }
  };
  const response = await axios(options);
  if (response && response.status === 200) {
    localStorage.setItem("token", response.data.accessToken);
    localStorage.setItem("user", response.data._id);
    setTimeout(() => {
      refreshAuthToken();
    }, refreshInterval);
    return response.data;
  }
};

/**
 * signout
 */
export const signout = async (): Promise<number> => {
  const options: AxiosRequestConfig = {
    method: "DELETE",
    url: url + "/api/user/me/accessToken",
    headers: {
      Authorization: getAuthToken()
    }
  };
  const response = await axios(options);
  localStorage.clear();
  return response.status;
};

/**
 * get kanban
 */
export const getKanban = async (kanbanID: string): Promise<Kanban | undefined> => {
  const options: AxiosRequestConfig = {
    method: "GET",
    url: url + "/api/kanban/" + kanbanID,
    headers: {
      Authorization: getAuthToken()
    }
  };
  const response = await axios(options);
  if (response && response.status === 200) {
    return response.data;
  } else {
    throw {status: response.status, message: response.statusText};
  }
};

/**
 * update boards
 */
export const updateBoards = async (kanbanID: string, boards: Board[]): Promise<number> => {
  const options: AxiosRequestConfig = {
    method: "PUT",
    url: url + "/api/kanban/" + kanbanID + "/board",
    headers: {
      Authorization: getAuthToken()
    },
    data: {boards: boards}
  };
  const response = await axios(options);
  return response.data;
};

/**
 * create card
 */
export const createCard = async (
  kanbanID: string,
  boardName: string,
  card: RawCard
): Promise<string> => {
  const options: AxiosRequestConfig = {
    method: "POST",
    url: url + "/api/kanban/" + kanbanID + "/board/" + boardName + "/card",
    headers: {
      Authorization: getAuthToken(),
      "Content-Type": "application/json"
    },
    data: {
      name: card.name,
      phone: card.phone,
      email: card.email,
      education: card.education,
      rating: card.rating
    }
  };
  const response = await axios(options);
  return response.data;
};

/**
 * move card
 */
export const moveCard = async (
  kanbanID: string,
  oldBoard: string,
  oldIndex: number,
  newBoard: string,
  newIndex: number
): Promise<number> => {
  const options: AxiosRequestConfig = {
    method: "POST",
    url: url + "/api/kanban/" + kanbanID + "/move",
    headers: {
      Authorization: getAuthToken(),
      "Content-Type": "application/json"
    },
    data: {
      oldBoard: oldBoard,
      oldIndex: oldIndex,
      newBoard: newBoard,
      newIndex: newIndex
    }
  };
  const response = await axios(options);
  return response.status;
};

/**
 * update card
 */
export const updateCard = async (
  kanbanID: string,
  boardName: string,
  cardID: string,
  card: RawCard
): Promise<number> => {
  const options: AxiosRequestConfig = {
    method: "PATCH",
    url: url + "/api/kanban/" + kanbanID + "/board/" + boardName + "/card/" + cardID,
    headers: {
      Authorization: getAuthToken(),
      "Content-Type": "application/json"
    },
    data: {
      name: card.name,
      phone: card.phone,
      email: card.email,
      education: card.education,
      rating: card.rating
    }
  };
  const response = await axios(options);
  return response.status;
};

/**
 * delete card
 */
export const deleteCard = async (
  kanbanID: string,
  boardName: string,
  cardID: string
): Promise<number> => {
  const options: AxiosRequestConfig = {
    method: "DELETE",
    url: url + "/api/kanban/" + kanbanID + "/board/" + boardName + "/card/" + cardID,
    headers: {
      Authorization: getAuthToken()
    }
  };
  const response = await axios(options);
  return response.status;
};

/**
 * upload resume
 */
export const uploadResume = async (
  kanbanID: string,
  boardName: string,
  cardID: string,
  resume: Blob
): Promise<object | Error> => {
  const formData = new FormData();
  formData.append("resume", resume);
  const options: AxiosRequestConfig = {
    method: "POST",
    url: url + "/api/kanban/" + kanbanID + "/board/" + boardName + "/card/" + cardID + "/resume",
    headers: {
      Authorization: getAuthToken(),
      "Content-Type": "multipart/form-data"
    },
    data: formData
  };
  const response = await axios(options);
  if (response && response.status === 200) {
    return response.data;
  } else {
    return {status: response.status, message: response.statusText};
  }
};

/**
 * download resume
 */
export const downloadResume = async (
  kanbanID: string,
  boardName: string,
  cardID: string
): Promise<object | Error> => {
  const options: AxiosRequestConfig = {
    method: "GET",
    url: url + "/api/kanban/" + kanbanID + "/board/" + boardName + "/card/" + cardID + "/resume",
    headers: {
      Authorization: getAuthToken()
    }
  };
  const response = await axios(options);
  if (response && response.status === 200) {
    return response.data;
  } else {
    return {status: response.status, message: response.statusText};
  }
};

/**
 * check jwt
 */
export const checkJWT = async (): Promise<number> => {
  const options: AxiosRequestConfig = {
    method: "GET",
    url: url + "/api/user/me/accessToken",
    headers: {
      Authorization: getAuthToken()
    }
  };
  const response = await axios(options);
  return response.status;
};
