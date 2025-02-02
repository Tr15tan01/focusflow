import { AlertDemo } from "@/components/alert";
import Collectioncard from "@/components/collectioncard";
import CreateCollectionButton from "@/components/createcollectionbutton";
import { SkeletonCard } from "@/components/skeleton";
import { prisma } from "@/lib/prisma";
import { wait } from "@/lib/wait";
import {
  // ClerkProvider,
  SignInButton,
  // SignedIn,
  SignedOut,
  // UserButton,
} from "@clerk/nextjs";

import { currentUser } from "@clerk/nextjs/server";
import { Suspense } from "react";

export default async function Home() {
  return (
    <div>
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
  if (!user) return <div>Not Silgned In!!!</div>;

  return (
    <div className="flex flex-col w-full items-center page-transition bg-blue-500 p-6">
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
      <div className="flex flex-col gap-4">
        {/* Collections: {collections.length} */}
        {collections.map((collection) => (
          <Collectioncard key={collection.id} collection={collection} />
        ))}
      </div>
    </>
  );
}
