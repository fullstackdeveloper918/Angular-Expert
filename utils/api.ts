import _superagent, { search } from "superagent";
const SuperagentPromise = require('superagent-promise');
const superagent = SuperagentPromise(_superagent, global.Promise);
import { parseCookies } from 'nookies';

const API_ROOT = 'https://frontend.goaideme.com/';

const BUCKET_ROOT = `https://shared2.fra1.digitaloceanspaces.com/shared2/`;

const API_FILE_ROOT_MEDIUM = `${BUCKET_ROOT}image/medium/`;
const API_FILE_ROOT_ORIGINAL = `${BUCKET_ROOT}image/original/`;
const API_FILE_ROOT_SMALL = `${BUCKET_ROOT}image/small/`;
const API_FILE_ROOT_AUDIO = `${BUCKET_ROOT}audio/`;
const API_FILE_ROOT_VIDEO = `${BUCKET_ROOT}video/`;
const API_FILE_ROOT_DOCUMENTS = `${BUCKET_ROOT}documents/`;
const API_FILE_ROOT_DB_BACKUP = `${BUCKET_ROOT}backup/`;
const cookies = parseCookies();
const accessToken = cookies.COOKIES_USER_ACCESS_TOKEN;
console.log(accessToken,"gfgfgfgfgfg");
const encode = encodeURIComponent;
const responseBody = (res: any) => res.body;

let token: any = accessToken;
console.log(token,"qwqwwqwq");
const tokenPlugin = (req: any) => {
  if (token) {
    req.set('Token', `${token}`);
    // req.set('token', token || "mim");
  }
}

const requests = {
  del: (url: string) =>
    superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  get: (url: string) =>
    superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  put: (url: string, body: any) =>
    superagent.put(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
  patch: (url: string, body: any) =>
    superagent.patch(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
  post: (url: string, body: any) =>
    superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
  file: (url: string, key: string, file: any) =>
    superagent.post(`${API_ROOT}${url}`).attach(key, file).use(tokenPlugin).then(responseBody)
};

const Auth = {
  login: (info: any) =>
    requests.post('single-user', info),
  signUp: (items: any) => requests.post(`register`, items),
  loginAsUser: (info: any) =>
    requests.post('admin/users/login_as_user', info),
  logout: () =>
    requests.put('admin/logout', {}),
  forgotPassword: (info: any) =>
    requests.post('forgot-password', info),
  updatePassword: (info: any) =>
    requests.put('change-password', info),
  profile: () =>
    requests.get(`profile`),
  // edit: (info: any) =>
  //   requests.put('admin/profile/edit', info),
  edit: (info: any) =>
    requests.patch('profile', info),
};

const User = {
  edit: (info: any) =>
    requests.post('update-user', info),
  listing: (q?: string) =>
    requests.get(`list${q ? `?${q}` : ""}`),
  export: (start_date?: number, end_date?: number) =>
    requests.get(`user?start_date=${start_date}&end_date=${end_date}`),
  getById: (info: any) =>
    requests.post(`single-user-detail`,info),
  getPurchase: (_id: string, q?: string) =>
    requests.get(`user/${_id}/purchase${q ? `?${q}` : ""}`),
  detailPurchase: (_id: string) =>
    requests.get(`user/purchase/${_id}`),
  block: (id: string, info: any) =>
    requests.patch(`user/block/${id}`, info),
  deactivate: (info: any) =>
    requests.post(`activte-deactivate-archive`, info),
  delete: (id: string) =>
    requests.del(`user/delete/${id}`),
  import: (file: any) =>
    requests.file(`user`, 'file', file)
};
const Meeting={
  // add-meeting
  create: (info: any) =>
    requests.post('add-meeting', info),
  listing: () =>
    requests.get(`meeting-list`),
  archive: () =>
    requests.get("meeting-archive"),
  getById: (info: any) =>
    requests.post(`meeting-detail`,info),
  edit: ( info: any) =>
    requests.put(`meeting-update`, info),
  delete: (info: any) =>
    requests.post(`delete-meeting`, info),

}
const Manage_Question={
  create: (info: any) =>
    requests.post('question-add', info),
  edit: ( info: any) =>
    requests.put(`question-update`, info),
  listing: () =>
    requests.get(`question-list`),
  getById: (info: any) =>
    requests.post(`single-user-detail`,info),
}
// const Dashboard = {
//   listing: (q?: string) =>
//     requests.get(`admin/dashboard${q ? `?${q}` : ""}`)
// };

const Faq = {
  listing: (q?: string) =>
    requests.get(`faqs${q ? `?${q}` : ""}`),
  create: (info: any) =>
    requests.post('faqs', info),
  getByID: (id: string) =>
    requests.get(`faqs/${id}`),
  edit: (_id: string, info: any) =>
    requests.patch(`faqs/${_id}`, info),
  delete: (_id: string) =>
    requests.del(`faqs/${_id}`),
};

const Graph = {
  dashboardGraph: (graphType: string, type: string) =>
    requests.get(`admin/dashboard/graph/${graphType}?type=${type}`),

}

const Genre = {
  listing: (q?: string) =>
    requests.get(`genre${q ? `?${q}` : ""}`),
  create: (info: any) =>
    requests.post('genre', info),
  getByID: (id: string) =>
    requests.get(`genre/${id}`),
  edit: (_id: string, info: any) =>
    requests.patch(`genre/${_id}`, info),
  delete: (_id: string) =>
    requests.del(`genre/${_id}`),
}

const Homepage = {
  create: (info: any) =>
    requests.post('admin/homepage', info),
  getByID: (id: string) =>
    requests.get(`admin/homepage/${id}`),
  listing: (q: string) =>
    requests.get(`admin/homepage?${q}`),
  delete: (_id: string) =>
    requests.del(`admin/homepage/${_id}`),
  edit: (_id: string, info: any) =>
    requests.put(`admin/homepage/${_id}`, info),
};





const Notification = {
  create: (info: any) =>
    requests.post('notifications', info),
  listing: (q?: string) =>
    requests.get(`admin/v1/notification${q ? `?${q}` : ""}`),
  readById: (id: string) =>
    requests.put(`admin/v1/notification/${id}`, {}),
  allRead: () =>
    requests.put('admin/v1/notification/allRead', {}),
  unreadCount: () =>
    requests.get(`admin/v1/notification/count`)
}


const Products = {
  create: (info: any) =>
    requests.post('admin/product', info),
  listing: (q: string) =>
    requests.get(`admin/product?${q}`),
  export: (start_date?: number, end_date?: number) =>
    requests.get(`admin/product_export?start_date=${start_date}&end_date=${end_date}`),
  edit: (_id: string, info: any) =>
    requests.put(`admin/product/${_id}`, info),
  get: () =>
    requests.get(`user/product?language=ENGLISH`),
  getById: (id: string) =>
    requests.get(`admin/product/${id}`),
  delete: (_id: string) =>
    requests.del(`admin/product/${_id}`),
  import: (file: any) =>
    requests.file(`admin/product/import`, 'file', file),
  visibility: (_id: string) =>
    requests.patch(`admin/product/${_id}`, {})
};



const Search = {
  pagination: (search: string, nft_type: string) =>
    requests.get(`Nft/search?search=${search}&nft_type=${nft_type}&limit=10&pagination=0&language=ENGLISH`),
};

const Staff = {
  create: (info: any) =>
    requests.post('staff', info),
  listing: (q?: string) =>
    requests.get(`staff${q ? `?${q}` : ""}`),
  edit: (_id: string, info: any) =>
    requests.patch(`staff/${_id}`, info),
  delete: (id: string) =>
    requests.del(`staff/${id}`),
  block_delete: (id: string, info: any) =>
    requests.put(`staff/block/${id}`, info),
  getById: (id: string) =>
    requests.get(`staff/${id}`),
  export: (start_date?: number, end_date?: number) =>
    requests.get(`staff?start_date=${start_date}&end_date=${end_date}`),
  fcmToken: (fcm_token: string) =>
    requests.put('User/fcm', {
      device_type: "Web",
      fcm_token,
      language: "ENGLISH"
    }),
};






const FILES = {
  audio: (filename: string) => filename?.startsWith('http') ? filename : `${API_FILE_ROOT_AUDIO}${filename}`,
  video: (filename: string) => filename?.startsWith('http') ? filename : `${API_FILE_ROOT_VIDEO}${filename}`,
  imageOriginal: (filename: string, alt: any) => filename ? filename?.startsWith('http') ? filename : `${API_FILE_ROOT_ORIGINAL}${filename}` : alt,
  imageMedium: (filename: string, alt: any) => filename ? filename?.startsWith('http') ? filename : `${API_FILE_ROOT_MEDIUM}${filename}` : alt,
  imageSmall: (filename: string, alt?: any) => filename ? filename?.startsWith('http') ? filename : `${API_FILE_ROOT_SMALL}${filename}` : alt,
};

const Dashboard={
    listing: () =>
        requests.get(`areas`)
}

const ImageUpload={
  add: (info: any) =>
    requests.post('uploadFile', info),
}
const henceforthApi = {
  Auth,
  API_ROOT,
  API_FILE_ROOT_DB_BACKUP,
  API_FILE_ROOT_SMALL,
  API_FILE_ROOT_MEDIUM,
  API_FILE_ROOT_ORIGINAL,
  API_FILE_ROOT_VIDEO,
  API_FILE_ROOT_DOCUMENTS,
  Dashboard,
  ImageUpload,
  FILES,
  Meeting,
  Manage_Question,
  Faq,
  Graph,
  Genre,
  Homepage,
  Notification,
  Products,
  Staff,
  Search,
  token,
  User,
  encode,
  setToken: (_token?: string) => { token = _token; }
};

export default henceforthApi