export enum CollectionCollors {
  sunset = "bg-gradient-to-r from-red-500 to-orange-500",
  rose = "bg-gradient-to-r from-pink-500 to-red-400",
  ocean = "bg-gradient-to-r from-green-500 to-blue-400",
}

export type CollectionCollor = keyof typeof CollectionCollors;
