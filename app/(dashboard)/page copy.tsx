// import { AlertDemo } from "@/components/alert";
// import Collectioncard from "@/components/collectioncard";
// import CreateCollectionButton from "@/components/createcollectionbutton";
// import { SkeletonCard } from "@/components/skeleton";
// import { prisma } from "@/lib/prisma";
// import { wait } from "@/lib/wait";
// import {
//   // ClerkProvider,
//   SignInButton,
//   SignedOut,
//   // UserButton,
// } from "@clerk/nextjs";

// import { currentUser } from "@clerk/nextjs/server";
// import { Suspense } from "react";

// export default async function Home() {
//   return (
//     <div className="w-full">
//       <Suspense fallback={<WelcomeMessageFallback />}>
//         <WelcomeMessage />
//       </Suspense>
//       <Suspense fallback={<WelcomeMessageFallback />}>
//         <CollectionList />
//       </Suspense>
//     </div>
//   );
// }

// const WelcomeMessage = async () => {
//   const user = await currentUser();
//   await wait(3000);
//   console.log(user?.firstName, "user is here");

//   // if (!user)
//   //   return (
//   //     <div>
//   //       Not Silgned In!!!
//   //       <SignedOut>
//   //         <div className="w-full bg-slate-300 rounded-md m-7 px-7 py-3 dark:bg-red-600">
//   //           <SignInButton />
//   //         </div>
//   //       </SignedOut>
//   //     </div>
//   //   );
//   <div className="flex flex-col items-center justify-center gap-6 p-8 rounded-lg bg-white dark:bg-gray-800 shadow-lg max-w-md mx-auto">
//   <div className="text-center space-y-2">
//     <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
//       Welcome to Task Manager
//     </h2>
//     <p className="text-gray-600 dark:text-gray-300">
//       Sign in to access your tasks across all your devices and collaborate with your team.
//     </p>
//   </div>

//   <div className="text-center">
//     <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
//       Currently not signed in
//     </p>
//     <SignInButton>
//       <button className="w-full px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
//         Sign In / Register
//       </button>
//     </SignInButton>
//   </div>

//   <div className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
//     <p>By signing in, you agree to our Terms of Service</p>
//     <p>and acknowledge our Privacy Policy</p>
//   </div>
// </div>

// //   return (
// //     <div className="flex flex-col w-full items-center page-transition bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg p-6 my-3 shadow-md">
// //       <h2 className="text-5xl font-bold">welcome {user?.firstName} </h2>
// //       <SignedOut>
// //         {/* <div className="w-36 bg-purple-800 text-white">
// //           <SignInButton />
// //         </div> */}
// //       </SignedOut>
// //       <p>Sign in to view and update your tasks</p>
// //     </div>
// //   );
// // };

// const WelcomeMessageFallback = () => {
//   return (
//     <div>
//       <SkeletonCard />
//     </div>
//   );
// };

// async function CollectionList() {
//   const user = await currentUser();
//   if (!user)
//     return (
//       // <div>
//       //   Not Signed In
//       //   <div className="w-36 bg-purple-800 text-white">
//       //     <SignInButton />
//       //   </div>
//       // </div>
//       // <div className="flex flex-col items-center justify-center gap-6 p-8 rounded-lg bg-white dark:bg-gray-800 shadow-lg max-w-md mx-auto">
//       //   <div className="text-center space-y-2">
//       //     <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
//       //       Welcome to Task Manager
//       //     </h2>
//       //     <p className="text-gray-600 dark:text-gray-300">
//       //       Sign in to access your tasks across all your devices and collaborate
//       //       with your team.
//       //     </p>
//       //   </div>

//       //   <div className="text-center">
//       //     <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
//       //       Currently not signed in
//       //     </p>
//       //     <SignInButton>
//       //       <button className="w-full px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
//       //         Sign In / Register
//       //       </button>
//       //     </SignInButton>
//       //   </div>

//       //   <div className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
//       //     <p>By signing in, you agree to our Terms of Service</p>
//       //     <p>and acknowledge our Privacy Policy</p>
//       //   </div>
//       // </div>
//     );
//   const collections = await prisma.collection.findMany({
//     include: {
//       tasks: true,
//     },
//     where: {
//       userId: user?.id,
//     },
//   });

//   if (collections.length === 0) {
//     return (
//       <>
//         <AlertDemo />
//         <CreateCollectionButton />
//       </>
//     );
//   }

//   return (
//     <>
//       <CreateCollectionButton />
//       <div className="flex w-100 flex-col gap-4 mx-4">
//         {/* Collections: {collections.length} */}
//         {collections.map((collection) => (
//           <Collectioncard key={collection.id} collection={collection} />
//         ))}
//       </div>
//     </>
//   );
// }
