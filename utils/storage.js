const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export const saveToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("orienco-token", token);
    document.cookie = `orienco-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  }
};

export const saveRefreshToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("orienco-refresh-token", token);
  }
};

export const saveUser = (user) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("orienco-user", JSON.stringify(user));
  }
};

export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("orienco-token") || getCookie("orienco-token");
  }
  return null;
};

export const getRefreshToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("orienco-refresh-token");
  }
  return null;
};

export const getUser = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("orienco-user");
    try {
      return user ? JSON.parse(user) : null;
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const removeStorage = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("orienco-token");
    localStorage.removeItem("orienco-refresh-token");
    localStorage.removeItem("orienco-user");
    document.cookie = "orienco-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
};
