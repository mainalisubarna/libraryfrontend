import axios from "axios";
export const POST_API = async (url: string, data: any) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_SERVER_URL + url,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    } else if (error.request) {
      const message = {
        status: false,
        message: error.message,
      };
      return message;
    } else {
      const message = {
        status: false,
        message: error.message,
      };
      return message;
    }
  }
};

export const POST_API_JWT = async (url: string, data: any, token: any) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_SERVER_URL + url,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    } else if (error.request) {
      const message = {
        status: false,
        message: error.message,
      };
      return message;
    } else {
      const message = {
        status: false,
        message: error.message,
      };
      return message;
    }
  }
};
export const POST_API_JWT_FORMDATA = async (
  url: string,
  data: any,
  token: any
) => {
  try {
    const response = await axios.post(
      import.meta.env.VITE_SERVER_URL + url,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    } else if (error.request) {
      const message = {
        status: false,
        message: error.message,
      };
      return message;
    } else {
      const message = {
        status: false,
        message: error.message,
      };
      return message;
    }
  }
};

export const GET_API_JWT = async (url: string, token: any) => {
  try {
    const response = await axios.get(import.meta.env.VITE_SERVER_URL + url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    } else if (error.request) {
      const message = {
        status: false,
        message: error.message,
      };
      return message;
    } else {
      const message = {
        status: false,
        message: error.message,
      };
      return message;
    }
  }
};

export const DELETE_API_JWT = async (url: string, token: any) => {
  try {
    const response = await axios.delete(import.meta.env.VITE_SERVER_URL + url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return error.response.data;
    } else if (error.request) {
      const message = {
        status: false,
        message: error.message,
      };
      return message;
    } else {
      const message = {
        status: false,
        message: error.message,
      };
      return message;
    }
  }
};
