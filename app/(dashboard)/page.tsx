import { AlertDemo } from "@/components/alert";
import Collectioncard from "@/components/collectioncard";
import CreateCollectionButton from "@/components/createcollectionbutton";
import { SkeletonCard } from "@/components/skeleton";
import { prisma } from "@/lib/prisma";
import { wait } from "@/lib/wait";
import {
  // ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  // UserButton,
} from "@clerk/nextjs";

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
    </div>
  );
}

const WelcomeMessage = async () => {
  const user = await currentUser();
  await wait(3000);
  console.log(user?.firstName, "user is here");

  if (!user)
    return (
      <div>
        Not Silgned In!!!
        <SignedOut>
          <div className="w-full bg-slate-300 rounded-md m-7 px-7 py-3 dark:bg-red-600">
            <SignInButton />
          </div>
        </SignedOut>
      </div>
    );

  return (
    <div className="flex flex-col w-full items-center page-transition bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg p-6 my-3 shadow-md">
      <h2 className="text-5xl font-bold">welcome, {user?.firstName} </h2>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </div>
  );
};

const WelcomeMessageFallback = () => {
  return (
    <div>
      <SkeletonCard />
    </div>
  );
};

async function CollectionList() {
  const user = await currentUser();
  if (!user) return <div>Not Signed In</div>;
  const collections = await prisma.collection.findMany({
    include: {
      tasks: true,
    },
    where: {
      userId: user?.id,
    },
  });

  if (collections.length === 0) {
    return (
      <>
        <AlertDemo />
        <CreateCollectionButton />
      </>
    );
  }

  return (
    <>
      <CreateCollectionButton />
      <div className="flex w-100 flex-col gap-4 mx-4">
        {/* Collections: {collections.length} */}
        {collections.map((collection) => (
          <Collectioncard key={collection.id} collection={collection} />
        ))}
      </div>
    </>
  );
}
