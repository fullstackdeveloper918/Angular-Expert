import _superagent, { search } from "superagent";
const SuperagentPromise = require('superagent-promise');
const superagent = SuperagentPromise(_superagent, global.Promise);
import { parseCookies } from 'nookies';
import { info } from "console";
import { list } from "postcss";
// import { useSelector } from "react-redux";

// const API_ROOT = 'https://app-uilsndszlq-uc.a.run.app/';
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

// const getUserdata = useSelector((state: any) => state?.user?.userData);
// console.log(getUserdata,"getUserdata");
const encode = encodeURIComponent;
const responseBody = (res: any) => res.body;


let token: any = accessToken;
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
  login: () =>
    requests.get('single-user'),
  signUp: (items: any) => requests.post(`register`, items),
  loginAsUser: (info: any) =>
    requests.post('admin/users/login_as_user', info),
  logout: () =>
    requests.put('admin/logout', {}),
  forgotPassword: (info: any) =>
    requests.post('forgot-password', info),
  updatePassword: (info: any) =>
    requests.put('update-password', info),
  profile: () =>
    requests.get(`profile`),
  // edit: (info: any) =>
  //   requests.put('admin/profile/edit', info),
  edit: (info: any) =>
    requests.patch('profile', info),
};
const dashboard={
  upcoming: (q?: string) =>
    requests.get(`upcoming-meeting?meeting_id=${q ? `${q}` : ""}`),
  next: (q?: string) =>
    requests.get(`next-meetings?meeting_id=${q ? `${q}` : ""}`),
}
const Admin={
  // admin/listadmin/add
  listing: (q?: string) =>
    requests.get(`admin/list${q ? `${q}` : ""}`),
  
  create: (info: any) =>
    requests.post('admin/add', info),
  delete: (info: any) =>
    requests.post(`admin/delete`, info),
  edit: ( info: any) =>
    requests.put(`admin/update`, info),
  getById: (info: any) =>
    requests.post(`admin/detail`,info),
}

const Export={
  // listing: (q?: string) =>
  //   requests.get(`admin/list${q ? `?${q}` : ""}`),
  listing: () =>
    requests.get(`https://frontend.goaideme.com/get-original-report`),
}
const photo_section={
  remove_photo: (info: any) =>
    requests.post('remove-photo-section', info),
  upload_file: (info: any) => 
    requests.post('uploadFile',info),
  update_file: (info: any) => 
    requests.post('update-photo-section', info),
  remove_project: (info: any) => 
    requests.post('remove-project', info)
}
const User = {
  delete1: (info: any) =>
    requests.post(`delete-additional-user`, info),
  edit: (info: any) =>
    requests.post('update-user', info),
  add_additional_user: (info: any) =>
    requests.post('add-adtional-user', info),
  edit_additional_user: (info: any) =>
    requests.post('update-additional-users', info),
  listing: (q?: string,id?:any) =>
    requests.get(`list?meeting_id=${id ? `${id}` : ""}${q ? `${q}` : ""}`),
  past_meeting_list: (q?: string,id?:any) =>
    requests.get(`past-meetings-user?meeting_id=${id ? `${id}` : ""}${q ? `${q}` : ""}`),
  // additional_user_listing: (q?: string) =>
  //   requests.get(`addtional-user-list${q ? `?${q}` : ""}`),
  additional_user_listing: (info: any) =>
    requests.post(`addtional-user-list`,info),
  arcivelisting: (q?: string) =>
    requests.get(`archive-user-listing${q ? `${q}` : ""}`),
  completelist: (q?:string) =>
    requests.get(`descending-completed-form?meeting_id=${q ? `${q}` : ""}`),
  listing1: () =>
    requests.get(`list`),
  user_listing: (q?: string) =>
    requests.get(`single-user-form-status?meeting_id=${q ? `${q}` : ""}`),
  check_fall_spring: (q?:string) =>
    requests.get(`spring-fall-meeting-count?meeting_id=${q ? `${q}` : ""}`),
  user_completed_noncompleted: (q?:string) =>
    requests.get(`complete-uncomplete-form?meeting_id=${q ? `${q}` : ""}`),
  user_total_count: (q?: string) =>
    requests.get(`total-member-count`),
  user_remains_userfor_meeting: (q?: string) =>
    requests.get(`remains-userfor-fill-meeting`),
  export: (start_date?: number, end_date?: number) =>
    requests.get(`user?start_date=${start_date}&end_date=${end_date}`),
  getById: (info: any) =>
    requests.post(`single-user-detail`,info),
  getById1: (info: any) =>
    requests.post(`addtional-user-list`,info),
  getAdditionalId: (info: any) =>
    requests.post(`single-additional-users`,info),
  getQuestion: () =>
    requests.get(`new-questions`),
  getPurchase: (_id: string, q?: string) =>
    requests.get(`user/${_id}/purchase${q ? `${q}` : ""}`),
  detailPurchase: (_id: string) =>
    requests.get(`user/purchase/${_id}`),
  block: (id: string, info: any) =>
    requests.patch(`user/block/${id}`, info),
  deactivate: (info: any) =>
    requests.post(`activte-deactivate-archive`, info),
  delete: (id: string) =>
    requests.del(`user/delete/${id}`),
  import: (file: any) =>
    requests.file(`user`, 'file', file),
  create: (info: any) =>
    requests.post('save-pdf', info),
  archive_user_delete: (info: any) =>
    requests.post(`delete-archive-user`, info),
  unarchive_user: (info: any) =>
    requests.post(`unarchive-user`, info),
};
const Meeting={
  // add-meeting
  create: (info: any) =>
    requests.post('add-meeting', info),
  update:(q?: string)=>
    requests.get(`five-day-beforemeeting-countdown?meeting_id=${q ? `${q}` : ""}`),
  past_meeting:(q?: string)=>
    requests.get(`past-meetings${q ? `${q}` : ""}`),
  meeting_user:(info: any)=>
    requests.post(`past-meetings-user`,info),
  listing: (q?: string) =>
    requests.get(`meeting-list${q ? `${q}` : ""}`),
  upcoming_meeting: (q?: string) =>
    requests.get(`upcoming-meeting?meeting_id=${q ? `${q}` : ""}`),
  archive: (q?: string) =>
    requests.get(`meeting-archive${q ? `${q}` : ""}`),
  getById: (info: any) =>
    requests.post(`meeting-detail`,info),
  edit: ( info: any) =>
    requests.put(`meeting-update`, info),
  delete: (info: any) =>
    requests.post(`delete-meeting`, info),
  unarchive_meeting: (info: any) =>
    requests.post(`unarchive-meeting`, info),
  unarchive_meeting_delete: (info: any) =>
    requests.post(`delete-archive-meeting`, info),

}
const Questionnair={
  add:(info:any)=>
    requests.post("add-answer",info),
  getById: (info: any) =>
    requests.post(`answer-detail`,info),
  downloadPdf: (info: any) =>
    requests.post(`question-answer-pdf`,info),
}
const Manage_Question={
  create: (info: any) =>
    requests.post('question-add', info),
  add_sub_heading: (info: any) =>
    requests.post('section-sub-heading', info),
  edit_sub_heading: (info: any) =>
    requests.post('update-sub-heading', info),
  // list-section-sub-heading
  list: () =>
    requests.get(`list-section-sub-heading`),

  delete_subheading: (info: any) =>
    requests.post(`delete-section-sub-heading`, info),
  getByIdsubHeading: (info: any) =>
    requests.post(`section-by-id`,info),

  edit: ( info: any) =>
    requests.put(`question-update`, info),
  listing: () =>
    requests.get(`question-list`),
  getById: (info: any) =>
    requests.post(`single-question`,info),
  delete: (info: any) =>
    requests.post(`question-delete`, info),
}
const Questionnaire={
  listing: (q?: string,id?:any) =>
    requests.get(`question-list?meeting_id=${id ? `${id}` : ""}${q ? `${q}` : ""}`),
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
  Export,
  Meeting,
  photo_section,
  Admin,
  Questionnair,
  Manage_Question,
  Faq,
  Graph,
  Questionnaire,
  Genre,
  Homepage,
  Notification,
  Products,
  Staff,
  Search,
  token,
  User,
  encode,
  dashboard,
  setToken: (_token?: string) => { token = _token; }
};

export default henceforthApi