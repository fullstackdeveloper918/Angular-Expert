// // fakeApi.ts
// import { areas } from '../jsonFiles/user.json';
// import { data } from '../jsonFiles/meeting.json';

// export const fetchAreas = (): Promise<typeof areas> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(areas);
//     }, 1000); // Simulate network delay
//   });
// };

// export const fetchAreaById = (id: number): Promise<typeof areas[0] | undefined> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const area = areas.find((a) => a.id === id);
//       resolve(area);
//     }, 1000); // Simulate network delay
//   });
// };

// export const searchAreasByName = (name: string): Promise<typeof areas> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const filteredAreas = areas.filter((area) =>
//         area.name.toLowerCase().includes(name.toLowerCase())
//       );
//       resolve(filteredAreas);
//     }, 1000); // Simulate network delay
//   });
// };


// export const fetchMeeting = (): Promise<typeof data> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(data);
//     }, 1000); // Simulate network delay
//   });
// };

// export const fetchMeetingById = (id: number): Promise<typeof data[0] | undefined> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const area = data.find((a:any) => a.id === id);
//       resolve(area);
//     }, 1000); // Simulate network delay
//   });
// };

// export const searchMeetingByName = (name: string): Promise<typeof data> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const filteredAreas = data.filter((area:any) =>
//         area.name.toLowerCase().includes(name.toLowerCase())
//       );
//       resolve(filteredAreas);
//     }, 1000); // Simulate network delay
//   });
// };
// export const addMeeting = (newMeeting: typeof data[0]): Promise<void> => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       data.push(newMeeting);
//       resolve();
//     }, 1000); // Simulate network delay
//   });
// };
// export const deleteMeetingById = (id: number): Promise<boolean> => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             const initialLength = data.length;
//             const newData = data.filter((m: any) => m.id !== id);

//             if (newData.length < initialLength) {
//                 // Update local data (optional if you're using React or similar state management)
//                 // Example using React state management
//                 // setData(newData);
//                 resolve(true); // Meeting deleted successfully
//             } else {
//                 reject(new Error(`Meeting with id ${id} not found`));
//             }
//         }, 1000); // Simulate network delay
//     });
// };