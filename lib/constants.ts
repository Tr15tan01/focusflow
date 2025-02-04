export enum CollectionCollors {
  sunset = "bg-gradient-to-r from-red-500 to-orange-500",
  rose = "bg-gradient-to-r from-pink-500 to-red-400",
  ocean = "bg-gradient-to-r from-green-500 to-blue-400",
  deepblue = "bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%",
  candy = "bg-gradient-to-r from-indigo-500 to-purple-400",
}

export type CollectionCollor = keyof typeof CollectionCollors;
