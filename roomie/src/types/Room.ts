// types/room.ts

export type Room = {
  id: string;
  name: string;
  model: RoomModel;
  backgroundImage: string;
  ambianceMusic?: string;
  components: RoomComponentInstance[];
};

export type RoomModel = {
  id: string;
  name: string;
  componentSlots: RoomSlot[];
  backgroundImagePosition?: string;
  floorColor?: string;
};

export type RoomSlot = {
  id: string;
  type: RoomComponentType;
  position: number;
  screenPosition: {
    centerX: string; // '50%' or '120px'
    centerY: string;
    zIndex?: number;
  };
};


export type RoomComponentType = 'computer' | 'poster' | 'library' | 'audioPlayer';

export type RoomComponentInstance = {
  id: string;
  type: RoomComponentType;
  slotId: string; // maps to model-defined slot
  filter?: RoomFileFilter;
};

export type RoomFileFilter = {
  type?: 'audio' | 'markdown' | 'video' | 'html';
  tags?: string[];
};

export type RoomFile = {
  id: string;
  type: 'audio' | 'markdown' | 'video' | 'html';
  url: string;
  title: string;
  tags: string[];
};

export interface RoomComponent {
  preview: () => string; // returns URL to gif/png
  render: (ctx: RoomRenderContext) => JSX.Element;
  supportedTypes: RoomFile['type'][];
}

export interface RoomRenderContext {
  files: RoomFile[];
  filter?: RoomFileFilter;
  slot: RoomSlot;
}
