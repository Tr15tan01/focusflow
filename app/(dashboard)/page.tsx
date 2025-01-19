import { AlertDemo } from "@/components/alert";
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
    <>
      <Suspense fallback={<WelcomeMessageFallback />}>
        <WelcomeMessage />
      </Suspense>
      <Suspense fallback={<WelcomeMessageFallback />}>
        <CollectionList />
      </Suspense>
    </>
  );
}

const WelcomeMessage = async () => {
  const user = await currentUser();
  await wait(3000);
  console.log(user?.firstName, "user is here");
  if (!user) return <div>Not Silgned In!!!</div>;

  return (
    <div className="flex flex-col w-full items-center page-transition">
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
    where: {
      userId: user?.id,
    },
  });
  if (collections.length === 0) {
    return <AlertDemo />;
  }
}
