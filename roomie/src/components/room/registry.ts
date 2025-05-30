// components/room/registry.ts

import { RoomComponent } from '../../types/Room';
import Computer from './Computer';
import Library from './Library';
import Music from './Music';

export const roomComponentRegistry: Record<string, RoomComponent> = {
  computer: Computer,
  library: Library,
  audioPlayer: Music,
};
