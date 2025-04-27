// import { AlertDemo } from "@/components/alert";
// import Collectioncard from "@/components/collectioncard";
// import CreateCollectionButton from "@/components/createcollectionbutton";
// import { SkeletonCard } from "@/components/skeleton";
// import { prisma } from "@/lib/prisma";
// import { wait } from "@/lib/wait";
// import { SignInButton, SignedOut } from "@clerk/nextjs";
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

//   if (!user) {
//     return (
//       <div className="flex flex-col items-center justify-center gap-6 p-8 rounded-lg bg-white dark:bg-gray-800 shadow-lg max-w-md mx-auto my-8">
//         <div className="text-center space-y-2">
//           <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
//             Welcome to Task Manager
//           </h2>
//           <p className="text-gray-600 dark:text-gray-300">
//             Sign in to access your tasks across all your devices and collaborate
//             with your team.
//           </p>
//         </div>

//         <div className="text-center w-full">
//           <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
//             Currently not signed in
//           </p>
//           <SignedOut>
//             <SignInButton>
//               <button className="w-full px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
//                 Sign In / Register
//               </button>
//             </SignInButton>
//           </SignedOut>
//         </div>

//         <div className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
//           <p>By signing in, you agree to our Terms of Service</p>
//           <p>and acknowledge our Privacy Policy</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col w-full items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg p-6 my-3 shadow-md">
//       <h2 className="text-5xl font-bold text-white">
//         Welcome {user?.firstName}
//       </h2>
//       <p className="text-white/90 mt-2">View and manage your tasks</p>
//     </div>
//   );
// };

// const WelcomeMessageFallback = () => {
//   return (
//     <div className="w-full max-w-md mx-auto my-8">
//       <SkeletonCard />
//     </div>
//   );
// };

// async function CollectionList() {
//   const user = await currentUser();
//   if (!user) return null;

//   const collections = await prisma.collection.findMany({
//     include: {
//       tasks: true,
//     },
//     where: {
//       userId: user.id,
//     },
//   });

//   return (
//     <div className="mt-8">
//       {collections.length === 0 ? (
//         <div className="flex flex-col items-center gap-4">
//           <AlertDemo />
//           <CreateCollectionButton />
//         </div>
//       ) : (
//         <>
//           <CreateCollectionButton />
//           <div className="flex flex-col gap-4 mx-4 mt-4">
//             {collections.map((collection) => (
//               <Collectioncard key={collection.id} collection={collection} />
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

import { AlertDemo } from "@/components/alert";
import Collectioncard from "@/components/collectioncard";
import CreateCollectionButton from "@/components/createcollectionbutton";
import { SkeletonCard } from "@/components/skeleton";
import { prisma } from "@/lib/prisma";
import { wait } from "@/lib/wait";
import { SignInButton, SignedOut } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Suspense } from "react";

export default async function Home() {
  return (
    <div className="w-full">
      <Suspense fallback={<WelcomeMessageFallback />}>
        <WelcomeMessage />
      </Suspense>
      <Suspense fallback={<WelcomeMessageFallback />}>
        <CollectionList />
      </Suspense>
      <TaskManagerDescription />
    </div>
  );
}

const WelcomeMessage = async () => {
  const user = await currentUser();
  await wait(3000);
  console.log(user?.firstName, "user is here");

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 p-8 rounded-lg bg-white dark:bg-gray-800 shadow-lg max-w-2xl mx-auto my-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Welcome to Task Manager Pro
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Your ultimate productivity companion for managing tasks efficiently
          </p>
        </div>

        <div className="text-center w-full">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Get started by signing in to your account
          </p>
          <SignedOut>
            <SignInButton>
              <button className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Sign In / Register
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg p-8 my-6 shadow-xl max-w-4xl mx-auto">
      <h2 className="text-5xl font-bold text-white">
        Welcome back, {user?.firstName}!
      </h2>
      <p className="text-white/90 mt-4 text-xl">
        Ready to tackle your tasks today?
      </p>
    </div>
  );
};

const TaskManagerDescription = () => (
  <div className="max-w-4xl mx-auto mt-12 px-4 py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
      Why Task Manager Pro?
    </h3>
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <FeatureCard
          title="Organize Effortlessly"
          description="Create collections and categorize tasks for better organization and focus."
          icon="📊"
        />
        <FeatureCard
          title="Track Progress"
          description="Visual progress indicators help you stay motivated and on track."
          icon="📈"
        />
      </div>
      <div className="space-y-4">
        <FeatureCard
          title="Access Anywhere"
          description="Your tasks sync across all devices so you're always up to date."
          icon="🌐"
        />
        <FeatureCard
          title="Collaborate Easily"
          description="Coming soon: Share collections and work together with your team."
          icon="👥"
        />
      </div>
    </div>
  </div>
);

const FeatureCard = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) => (
  <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
    <span className="text-2xl">{icon}</span>
    <div>
      <h4 className="font-semibold text-lg text-gray-800 dark:text-white">
        {title}
      </h4>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  </div>
);

const WelcomeMessageFallback = () => {
  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <SkeletonCard />
    </div>
  );
};

async function CollectionList() {
  const user = await currentUser();
  if (!user) return null;

  const collections = await prisma.collection.findMany({
    include: {
      tasks: true,
    },
    where: {
      userId: user.id,
    },
  });

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      {collections.length === 0 ? (
        <div className="flex flex-col items-center gap-4">
          <AlertDemo />
          <CreateCollectionButton />
        </div>
      ) : (
        <>
          <CreateCollectionButton />
          <div className="flex flex-col gap-4 mt-6">
            {collections.map((collection) => (
              <Collectioncard key={collection.id} collection={collection} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
