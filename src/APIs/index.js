import axios from "axios";

const jwt = localStorage.getItem("token");

const api = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "content-type": "application/json",
    Authorization: "Bearer " + jwt,
  },
});

const upload = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "content-type": "multipart/form-data",
  },
});

// Auth & Users
export const getAllUsers = async () => {
  return await api.get(`/users/all`);
};

export const getMyAccount = async () => {
  return await api.get(`/auth/myAccount`);
};

export const postSignIn = async (params) => {
  return await api.post(`/auth/login`, params);
};

export const postSignUp = async (params) => {
  return await api.post(`/auth/register`, params);
};

export const postSignInWithGoogle = async (params) => {
  return await api.post(`/auth/google`, params);
};

export const putUpdateUser = async (params, data) => {
  return await api.put(`/auth/${params}`, data);
};

export const postUpdatePassword = async (params) => {
  return await api.post(`/auth/updatePassword`, params);
};

export const postUpdateAmount = async (params) => {
  return await api.post(`/users/updateAmount`, params);
};

export const getUsersWithPage = async (params) => {
  return await api.get(`/users?${params}`);
};

export const getDetailsUser = async (params) => {
  return await api.get(`/auth/${params}`);
};
export const deleteUser = async (params) => {
  return await api.delete(`/auth/${params}`);
};

// Categories
export const getAllCategories = async () => {
  return await api.get(`/categories/all`);
};
export const getCategories = async (pagination) => {
  return await api.get(`/categories?${pagination}`);
};
export const postAddCategory = async (params) => {
  return await api.post(`/categories/add`, params);
};
export const getDetaisCategory = async (params) => {
  return await api.get(`/categories/${params}`);
};
export const deleteCategory = async (params) => {
  return await api.delete(`/categories/${params}`);
};
export const putUpdateCategory = async (params, data) => {
  return await api.put(`/categories/${params}`, data);
};

// Courses
export const getAllCourses = async () => {
  return await api.get(`/courses/all`);
};

export const getCourses = async (pagination) => {
  return await api.get(`/courses?${pagination}`);
};
export const getCoursesActive = async (params) => {
  return await api.get(`/courses/active?${params}`);
};
export const getCoursesPending = async (params) => {
  return await api.get(`/courses/pending?${params}`);
};
export const getCoursesPopular = async () => {
  return await api.get(`/courses/popular`);
};
export const getCoursesRecent = async (params) => {
  return await api.get(`/courses/recent/${params}`);
};
export const postAddCourseRecent = async (params) => {
  return await api.post(`/courses/recent/add`, params);
};
export const postAddCourse = async (params) => {
  return await api.post(`/courses/add`, params);
};
export const getDetailsCourse = async (params) => {
  return await api.get(`/courses/${params}`);
};
export const getCoursesAdmin = async (params) => {
  return await api.get(`/courses/admin?${params}`);
};
export const putUpdateCourse = async (params, data) => {
  return await api.put(`/courses/${params}`, data);
};

// Contents
export const getAllContents = async () => {
  return await api.get(`/contents/all`);
};
export const getCourseWithContents = async (params) => {
  return await api.get(`/contents/${params}`); // contents/:course_id
};
export const postAddContent = async (params) => {
  return await api.post(`/contents/add`, params);
};
export const getDetailsContent = async (params) => {
  return await api.get(`/contents/details/${params}`); // :_id
};

// Wishlists
export const getWishlist = async (params) => {
  return await api.get(`/wishlists/${params}`); // wishlists/:user_id
};
export const postAddToWishlist = async (params) => {
  return await api.post(`/wishlists/add`, params);
};

export const deleteWishlist = async (params) => {
  return await api.delete(`/wishlishs/${params}`);
};

// Comments
export const getAllComments = async () => {
  return await api.get(`/comments`);
};
export const getComments = async (params, pagination) => {
  return await api.get(`/comments/${params}?${pagination}`); // comments/:course_id
};
export const postAddComment = async function (params) {
  return await api.post(`/comments/add`, params);
};

export const deleteComment = async (params) => {
  return await api.delete(`/comments/${params}`);
};
export const putUpdateComment = async (commentId, data) => {
  return await api.put(`/comments/${commentId}`, data);
};

// Orders
export const getAllOrders = async () => {
  return await api.get(`/orders`);
};
export const getOrdersWithPage = async (params) => {
  return await api.get(`/orders?${params}`);
};
export const getDetailsOrder = async (params) => {
  return await api.get(`/orders/details/${params}`);
};
export const getOrdersSuccess = async (params) => {
  return await api.get(`/orders/success?${params}`);
};
export const getOrders = async (params) => {
  return await api.get(`/orders/${params}`);
};
export const putUpdateOrder = async (params) => {
  return await api.put(`/orders/${params}`);
};
export const postAddOrder = async (params) => {
  return await api.post(`/orders/add`, params);
};
export const deleteOrder = async (params) => {
  return await api.delete(`/orders/${params}`);
};

export const getOrdersLibrary = async (params, pagination) => {
  return await api.get(`/orders/library/${params}?${pagination}`);
};

// Transactions
export const getAllTransactions = async () => {
  return await api.get(`/transactions`);
};

export const getTransactions = async (params) => {
  return await api.get(`/transactions?${params}`);
};

export const getDetailsTransaction = async (params) => {
  return await api.get(`/transactions/details/${params}`);
};
// Upload File
export const uploadImage = async (params) => {
  return await upload.post(`/upload/images`, params);
};
export const uploadVideo = async (params) => {
  return await upload.post(`/upload/videos`, params);
};
