import _superagent, { search } from "superagent";
const SuperagentPromise = require('superagent-promise');
const superagent = SuperagentPromise(_superagent, global.Promise);

const API_ROOT = 'http://localhost:3001/';

const BUCKET_ROOT = `https://shared2.fra1.digitaloceanspaces.com/shared2/`;

const API_FILE_ROOT_MEDIUM = `${BUCKET_ROOT}image/medium/`;
const API_FILE_ROOT_ORIGINAL = `${BUCKET_ROOT}image/original/`;
const API_FILE_ROOT_SMALL = `${BUCKET_ROOT}image/small/`;
const API_FILE_ROOT_AUDIO = `${BUCKET_ROOT}audio/`;
const API_FILE_ROOT_VIDEO = `${BUCKET_ROOT}video/`;
const API_FILE_ROOT_DOCUMENTS = `${BUCKET_ROOT}documents/`;
const API_FILE_ROOT_DB_BACKUP = `${BUCKET_ROOT}backup/`;

const encode = encodeURIComponent;
const responseBody = (res: any) => res.body;

let token: any = null;
const tokenPlugin = (req: any) => {
  if (token) {
    req.set('Authorization', `Bearer ${token}`);
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
    requests.post('login', info),
  loginAsUser: (info: any) =>
    requests.post('admin/users/login_as_user', info),
  logout: () =>
    requests.put('admin/logout', {}),
  changePassword: (info: any) =>
    requests.put('change-password', info),
  profile: () =>
    requests.get(`profile`),
  // edit: (info: any) =>
  //   requests.put('admin/profile/edit', info),
  edit: (info: any) =>
    requests.patch('profile', info),
};

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

const ID_Proof = {
  create: (info: any) =>
    requests.post('id-proof', info),
  getByID: (id: string) =>
    requests.get(`id-proof/${id}`),
  listing: (q?: string) =>
    requests.get(`id-proof${q ? `?${q}` : ""}`),
  delete: (_id: string) =>
    requests.del(`id-proof/delete/${_id}`),
  edit: (_id: string, info: any) =>
    requests.patch(`id-proof/edit/${_id}`, info),
};


const LanguageParent = {
  create: (info: any) =>
    requests.post('admin/v1/language', info),
  // getById: (id: string, q?: string) =>
  //   requests.get(`admin/v1/language/child/${id}${q ? `?${q}` : ""}`),
  listing: (q?: string) =>
    requests.get(`admin/v1/language${q ? `?${q}` : ""}`),
  delete: (_id: string) =>
    requests.del(`admin/v1/language/${_id}`),
  edit: (_id: string, info: any) =>
    requests.patch(`admin/v1/language/${_id}`, info),
}

const LanguageChild = {
  create: (info: any) =>
    requests.post('admin/v1/language/child', info),
  listing: (_id: string, q?: string) =>
    requests.get(`admin/v1/language/childs/${_id}${q ? `?${q}` : ""}`),
  getById: (_id: string) =>
    requests.get(`admin/v1/language/child/${_id}}`),
  delete: (_id: string) =>
    requests.del(`admin/v1/language/child/${_id}`),
  edit: (_id: string, info: any) =>
    requests.put(`admin/v1/language/child/${_id}`, info),
}

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

const Orders = {
  listing: (q?: string) =>
    requests.get(`orders${q ? `?${q}` : ""}`),
  getById: (id: string) =>
    requests.get(`orders/${id}`),
  export: (start_date?: number, end_date?: number) =>
    requests.get(`orders?start_date=${start_date}&end_date=${end_date}`),
};

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

const Rewards = {
  create: (info: any) =>
    requests.post('rewards/name', info),
  listing: (q?: string) =>
    requests.get(`rewards/name${q ? `?${q}` : ""}`),
  edit: (_id: string, info: any) =>
    requests.put(`rewards/name/${_id}`, info),
  delete: (id: string) =>
    requests.del(`rewards/name/${id}`),
  getById: (id: string) =>
    requests.get(`rewards/name/${id}`),
  export: (start_date?: number, end_date?: number) =>
    requests.get(`staff?start_date=${start_date}&end_date=${end_date}`),
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

const Transaction = {
  artistListing: (q?: string) =>
    requests.get(`transaction?type=ARTIST&${q}`),
  userListing: (q?: string) =>
    requests.get(`transaction?type=USER&${q}`),
  transactionDetail: (id: string) =>
    requests.get(`transaction/${id}`),
  getPayoutList: (q?: string) =>
    requests.get(`artist/earning${q ? `?${q}` : ""}`),
  payout: (info: any) =>
    requests.post(`admin/payout`, info),
  artistGetById: (id: string) =>
    requests.get(`transaction/${id}`),
  userGetById: (id: string) =>
    requests.get(`transaction/${id}`),
  artistExport: (start_date?: number, end_date?: number) =>
    requests.get(`transaction?type=ARTIST&start_date=${start_date}&end_date=${end_date}`),
  userExport: (start_date?: number, end_date?: number) =>
    requests.get(`transaction?type=USER&start_date=${start_date}&end_date=${end_date}`),
};

const User = {
  listing: (q: string) =>
    requests.get(`user?${q}`),
  export: (start_date?: number, end_date?: number) =>
    requests.get(`user?start_date=${start_date}&end_date=${end_date}`),
  getById: (id: string) =>
    requests.get(`user/details/${id}`),
  getPurchase: (_id: string, q?: string) =>
    requests.get(`user/${_id}/purchase${q ? `?${q}` : ""}`),
  detailPurchase: (_id: string) =>
    requests.get(`user/purchase/${_id}`),
  block: (id: string, info: any) =>
    requests.patch(`user/block/${id}`, info),
  deactivate: (id: string, info: any) =>
    requests.patch(`user/status/${id}`, info),
  delete: (id: string) =>
    requests.del(`user/delete/${id}`),
  import: (file: any) =>
    requests.file(`user`, 'file', file)
};

const VP_points = {
  create: (info: any) =>
    requests.post('vppoints', info),
  listing: (q?: string) =>
    requests.get(`vppoints${q ? `?${q}` : ""}`),
  edit: (_id: string, info: any) =>
    requests.patch(`vppoints/${_id}`, info),
  delete: (id: string) =>
    requests.del(`vppoints/${id}`),
  getById: (id: string) =>
    requests.get(`vppoints/${id}`),
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
  FILES,
  Faq,
  Graph,
  Genre,
  Homepage,
  ID_Proof,
  LanguageParent,
  LanguageChild,
  Notification,
  Orders,
  Products,
  Rewards,
  Staff,
  Search,
  Transaction,
  token,
  User,
  VP_points,
  encode,
  setToken: (_token?: string) => { token = _token; }
};

export default henceforthApi