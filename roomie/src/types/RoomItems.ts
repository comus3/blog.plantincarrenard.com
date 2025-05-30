// types/RoomItem.ts
export type RoomItemConfig = {
  enabled: boolean;
  position: { x: number; y: number };
  scale?: number;
  texture?: string;
  hoverEffect?: boolean;
  // you can add more interaction properties here later
};

export type RoomConfig = {
  wallTexture: string;
  music?: string;
  computer?: RoomItemConfig;
  poster?: RoomItemConfig;
  library?: RoomItemConfig;
  // future components go here
};
